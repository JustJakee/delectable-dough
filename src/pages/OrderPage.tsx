import {
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";
import { useSearchParams } from "react-router-dom";
import emailjs from "@emailjs/browser";
import MenuSelector from "../components/order/MenuSelector";
import MenuItemCard from "../components/order/MenuItemCard";
import MenuMatrix from "../components/order/MenuMatrix";
import OrderSummary from "../components/order/OrderSummary";
import MobileCartBar from "../components/order/MobileCartBar";
import CheckoutModal from "../components/order/CheckoutModal";
import { menus } from "../data/menus";
import type {
  LineItem,
  Menu,
  MenuItem,
  OrderState,
  OrderTouched,
} from "../types/menu";
import { formatOrderEmail } from "../utils/formatOrderEmail";
import styles from "./OrderPage.module.css";

type MenuStatus = "available" | "requestOnly" | "viewOnly" | "outOfSeason";

type OrderAction =
  | { type: "SELECT_MENU"; menuId: string }
  | { type: "SET_ORDER_TYPE"; orderType: "preset" | "trayBuilder" }
  | { type: "RESET_ORDER_TYPE" }
  | { type: "CLEAR_CART" }
  | {
      type: "SET_DRAFT_ITEM";
      payload: Partial<
        Pick<
          OrderState,
          | "draftItemId"
          | "draftSizeId"
          | "draftQuantity"
          | "draftFlavor"
          | "draftNotes"
        >
      >;
    }
  | { type: "ADD_LINE_ITEM"; lineItem: LineItem; replaceLineId?: string }
  | { type: "REMOVE_LINE_ITEM"; lineId: string }
  | { type: "EDIT_LINE_ITEM"; lineId: string }
  | {
      type: "SET_FULFILLMENT";
      payload: Partial<
        Pick<OrderState, "fulfillmentType" | "dateNeeded" | "address">
      >;
      touchedField?: keyof OrderTouched;
    }
  | {
      type: "SET_CUSTOMER";
      payload: Partial<
        Pick<
          OrderState,
          "firstName" | "lastName" | "contactMethod" | "email" | "phone"
        >
      >;
      touchedField?: keyof OrderTouched;
    }
  | { type: "SET_NOTES"; notes: string }
  | { type: "SET_CHECKOUT_OPEN"; isOpen: boolean; resetStatus?: boolean }
  | { type: "SET_CHECKOUT_ATTEMPTED"; attempted: boolean }
  | { type: "SET_MATRIX_QUANTITY"; key: string; quantity: number }
  | { type: "SUBMIT_START" }
  | { type: "SUBMIT_SUCCESS" }
  | { type: "SUBMIT_ERROR"; message: string };

const formatMoney = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

const createLineId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const getDefaultSizeId = (item: MenuItem) =>
  item.sizes.find((size) => size.id === item.defaultSizeId)?.id ??
  item.sizes[0]?.id;

const getSelectedMenu = (selectedMenuId: string): Menu => {
  const menu = menus.find((entry) => entry.id === selectedMenuId);
  if (menu) {
    return menu;
  }
  if (!menus[0]) {
    throw new Error("No menus configured.");
  }
  return menus[0];
};

const isValidMenuId = (menuId?: string | null) =>
  Boolean(menuId && menus.some((menu) => menu.id === menuId));

const getMenuIdFromSearch = (params: URLSearchParams) => {
  const menuId = params.get("menu");
  if (isValidMenuId(menuId)) {
    return menuId as string;
  }
  return "";
};

const parseDate = (value?: string) =>
  value ? new Date(`${value}T12:00:00`) : null;

const isOutOfSeason = (menu: Menu) => {
  const start = parseDate(menu.activeFrom);
  const end = parseDate(menu.activeTo);
  if (!start && !end) {
    return false;
  }
  const today = new Date();
  if (start && today < start) {
    return true;
  }
  if (end && today > end) {
    return true;
  }
  return false;
};

const getMenuStatus = (menu: Menu): MenuStatus => {
  if (menu.orderMode === "viewOnly") {
    return "viewOnly";
  }
  if (isOutOfSeason(menu)) {
    return "outOfSeason";
  }
  if (menu.orderMode === "requestOnly") {
    return "requestOnly";
  }
  return "available";
};

const buildInitialState = (menuId?: string): OrderState => ({
  orderType: "unset",
  selectedMenuId: menuId ?? menus[0]?.id ?? "",
  draftItemId: undefined,
  draftSizeId: undefined,
  draftQuantity: 1,
  draftFlavor: "",
  draftNotes: "",
  lineItems: [],
  matrixQuantities: {},
  editingLineId: undefined,
  fulfillmentType: "pickup",
  dateNeeded: "",
  address: "",
  firstName: "",
  lastName: "",
  contactMethod: "email",
  email: "",
  phone: "",
  additionalNotes: "",
  checkoutOpen: false,
  checkoutAttempted: false,
  touched: {},
  submitAttempted: false,
  status: "idle",
  errorMessage: undefined,
});

const reducer = (state: OrderState, action: OrderAction): OrderState => {
  const clearStatus: Partial<OrderState> =
    state.status === "success" || state.status === "error"
      ? { status: "idle", errorMessage: undefined }
      : {};

  switch (action.type) {
    case "SELECT_MENU":
      return {
        ...state,
        ...clearStatus,
        selectedMenuId: action.menuId,
        draftItemId: undefined,
        draftSizeId: undefined,
        draftQuantity: 1,
        draftFlavor: "",
        draftNotes: "",
        editingLineId: undefined,
      };
    case "SET_ORDER_TYPE":
      return {
        ...state,
        orderType: action.orderType,
        draftItemId: undefined,
        draftSizeId: undefined,
        draftQuantity: 1,
        draftFlavor: "",
        draftNotes: "",
        editingLineId: undefined,
      };
    case "RESET_ORDER_TYPE": {
      return buildInitialState("");
    }
    case "CLEAR_CART":
      return {
        ...state,
        lineItems: [],
        matrixQuantities: {},
        editingLineId: undefined,
        checkoutAttempted: false,
        checkoutOpen: false,
      };
    case "SET_DRAFT_ITEM":
      return {
        ...state,
        ...clearStatus,
        ...action.payload,
      };
    case "ADD_LINE_ITEM": {
      const replaceId = action.replaceLineId ?? state.editingLineId;
      const nextItems = replaceId
        ? state.lineItems.map((line) =>
            line.lineId === replaceId ? action.lineItem : line,
          )
        : [...state.lineItems, action.lineItem];

      return {
        ...state,
        ...clearStatus,
        lineItems: nextItems,
        editingLineId: undefined,
        draftQuantity: 1,
        draftNotes: "",
        draftFlavor: "",
        checkoutAttempted: false,
      };
    }
    case "REMOVE_LINE_ITEM":
      return {
        ...state,
        ...clearStatus,
        lineItems: state.lineItems.filter(
          (item) => item.lineId !== action.lineId,
        ),
        editingLineId:
          state.editingLineId === action.lineId
            ? undefined
            : state.editingLineId,
      };
    case "EDIT_LINE_ITEM": {
      const line = state.lineItems.find(
        (item) => item.lineId === action.lineId,
      );
      if (!line || line.source !== "catalog") {
        return state;
      }
      return {
        ...state,
        ...clearStatus,
        selectedMenuId: line.menuId,
        editingLineId: line.lineId,
        draftItemId: line.itemId,
        draftSizeId: line.sizeId,
        draftQuantity: line.quantity,
        draftFlavor: line.flavor ?? "",
        draftNotes: line.notes ?? "",
      };
    }
    case "SET_FULFILLMENT":
      return {
        ...state,
        ...clearStatus,
        ...action.payload,
        touched: action.touchedField
          ? { ...state.touched, [action.touchedField]: true }
          : state.touched,
      };
    case "SET_CUSTOMER":
      return {
        ...state,
        ...clearStatus,
        ...action.payload,
        touched: action.touchedField
          ? { ...state.touched, [action.touchedField]: true }
          : state.touched,
      };
    case "SET_NOTES":
      return {
        ...state,
        ...clearStatus,
        additionalNotes: action.notes,
      };
    case "SET_CHECKOUT_OPEN":
      return {
        ...state,
        ...(action.resetStatus
          ? { status: "idle", errorMessage: undefined }
          : {}),
        checkoutOpen: action.isOpen,
        checkoutAttempted: action.isOpen ? false : state.checkoutAttempted,
      };
    case "SET_CHECKOUT_ATTEMPTED":
      return {
        ...state,
        checkoutAttempted: action.attempted,
      };
    case "SET_MATRIX_QUANTITY":
      return {
        ...state,
        ...clearStatus,
        matrixQuantities: {
          ...state.matrixQuantities,
          [action.key]: action.quantity,
        },
      };
    case "SUBMIT_START":
      return {
        ...state,
        status: "submitting",
        submitAttempted: true,
        errorMessage: undefined,
      };
    case "SUBMIT_SUCCESS":
      return {
        ...buildInitialState(state.selectedMenuId),
        checkoutOpen: true,
        status: "success",
      };
    case "SUBMIT_ERROR":
      return {
        ...state,
        status: action.message ? "error" : "idle",
        submitAttempted: true,
        errorMessage: action.message || undefined,
      };
    default:
      return state;
  }
};

export default function OrderPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const menuParam = searchParams.get("menu");
  const shouldScrollOnLoadRef = useRef(isValidMenuId(menuParam));

  const [orderState, dispatch] = useReducer(reducer, searchParams, (params) =>
    buildInitialState(getMenuIdFromSearch(params)),
  );
  const checkoutButtonRef = useRef<HTMLButtonElement>(null);
  const menuItemsRef = useRef<HTMLDivElement>(null);
  const hasUserSelectedRef = useRef(false);
  const ignoreNextMenuParamRef = useRef<string | null>(null);
  const [pendingMenuId, setPendingMenuId] = useState<string | null>(null);
  const [showMenuConfirm, setShowMenuConfirm] = useState(false);

  const selectedMenu = useMemo(
    () => getSelectedMenu(orderState.selectedMenuId),
    [orderState.selectedMenuId],
  );

  const draftItem = selectedMenu.items?.find(
    (item) => item.id === orderState.draftItemId,
  );

  const subtotal = useMemo(
    () =>
      orderState.lineItems.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0,
      ),
    [orderState.lineItems],
  );

  const menuStatus = getMenuStatus(selectedMenu);
  const menuIsViewOnly = menuStatus === "viewOnly";

  const hasItems = orderState.lineItems.length > 0;
  const showEmptyHint = orderState.checkoutAttempted && !hasItems;
  const { orderType } = orderState;
  const isChoosingOrderType = orderType === "unset";
  const isPresetFlow = orderType === "preset";
  const isTrayBuilderFlow = orderType === "trayBuilder";
  const hasSelectedMenu = isValidMenuId(orderState.selectedMenuId);

  useEffect(() => {
    dispatch({ type: "RESET_ORDER_TYPE" });
  }, []);

  useEffect(() => {
    if (ignoreNextMenuParamRef.current === menuParam) {
      ignoreNextMenuParamRef.current = null;
      return;
    }
    if (!isValidMenuId(menuParam) || menuParam === orderState.selectedMenuId) {
      return;
    }
    dispatch({ type: "SELECT_MENU", menuId: menuParam as string });
  }, [isPresetFlow, menuParam, orderState.selectedMenuId]);

  useEffect(() => {
    if (!shouldScrollOnLoadRef.current) {
      return;
    }
    if (!isPresetFlow) {
      return;
    }
    if (!isValidMenuId(menuParam) || menuParam !== orderState.selectedMenuId) {
      return;
    }
    shouldScrollOnLoadRef.current = false;
    menuItemsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [menuParam, orderState.selectedMenuId]);

  const applyMenuSelection = (menuId: string) => {
    hasUserSelectedRef.current = true;
    ignoreNextMenuParamRef.current = menuId;
    dispatch({ type: "SELECT_MENU", menuId });
    setSearchParams(
      (prev) => {
        const nextParams = new URLSearchParams(prev);
        nextParams.set("menu", menuId);
        return nextParams;
      },
      { replace: true },
    );
  };

  const handleMenuSelect = (menuId: string) => {
    if (menuId === orderState.selectedMenuId) {
      return;
    }
    if (orderState.lineItems.length > 0) {
      setPendingMenuId(menuId);
      setShowMenuConfirm(true);
      return;
    }
    applyMenuSelection(menuId);
  };

  const handleToggleItem = (itemId: string) => {
    if (orderState.draftItemId === itemId) {
      dispatch({
        type: "SET_DRAFT_ITEM",
        payload: { draftItemId: undefined },
      });
      return;
    }

    const item = selectedMenu.items?.find((entry) => entry.id === itemId);
    dispatch({
      type: "SET_DRAFT_ITEM",
      payload: {
        draftItemId: itemId,
        draftSizeId: item ? getDefaultSizeId(item) : undefined,
        draftQuantity: 1,
        draftFlavor: "",
        draftNotes: "",
      },
    });
  };

  const handleEditLine = (lineId: string) => {
    dispatch({ type: "EDIT_LINE_ITEM", lineId });
  };

  const handleEditLineFromModal = (lineId: string) => {
    dispatch({ type: "SET_CHECKOUT_OPEN", isOpen: false });
    dispatch({ type: "EDIT_LINE_ITEM", lineId });
  };

  const handleRemoveLine = (lineId: string) => {
    dispatch({ type: "REMOVE_LINE_ITEM", lineId });
  };

  const canAddItem = (() => {
    if (!draftItem || !orderState.draftSizeId) {
      return false;
    }
    if (orderState.draftQuantity < 1) {
      return false;
    }
    if (draftItem.kind === "flavor" && !orderState.draftFlavor) {
      return false;
    }
    return true;
  })();

  const handleAddItem = () => {
    if (!draftItem || !orderState.draftSizeId) {
      return;
    }

    const size = draftItem.sizes.find(
      (entry) => entry.id === orderState.draftSizeId,
    );
    if (!size) {
      return;
    }

    const newLine: LineItem = {
      lineId: orderState.editingLineId ?? createLineId(),
      menuId: selectedMenu.id,
      menuTitle: selectedMenu.title,
      itemId: draftItem.id,
      itemName: draftItem.name,
      sizeId: size.id,
      sizeLabel: size.label,
      unitPrice: size.price,
      quantity: orderState.draftQuantity,
      flavor:
        draftItem.kind === "flavor"
          ? orderState.draftFlavor || undefined
          : undefined,
      notes: orderState.draftNotes || undefined,
      source: "catalog",
    };

    dispatch({ type: "ADD_LINE_ITEM", lineItem: newLine });
  };

  const handleMatrixQuantityChange = (
    rowId: string,
    columnId: string,
    quantity: number,
  ) => {
    const key = `${selectedMenu.id}:${rowId}:${columnId}`;
    dispatch({ type: "SET_MATRIX_QUANTITY", key, quantity });
  };

  const handleAddMatrixSelections = (
    selections: Array<{
      rowLabel: string;
      columnLabel: string;
      rowId: string;
      columnId: string;
      quantity: number;
      unitPrice: number;
    }>,
  ) => {
    if (!selectedMenu.matrix) {
      return;
    }

    selections.forEach((selection) => {
      const newLine: LineItem = {
        lineId: createLineId(),
        menuId: selectedMenu.id,
        menuTitle: selectedMenu.title,
        itemName: `${selectedMenu.title} — ${selection.rowLabel} (${selection.columnLabel})`,
        unitPrice: selection.unitPrice,
        quantity: selection.quantity,
        source: "matrix",
      };

      dispatch({ type: "ADD_LINE_ITEM", lineItem: newLine });
    });

    selections.forEach((selection) => {
      const key = `${selectedMenu.id}:${selection.rowId}:${selection.columnId}`;
      dispatch({ type: "SET_MATRIX_QUANTITY", key, quantity: 0 });
    });
  };

  const handleCheckout = () => {
    if (!hasItems) {
      dispatch({ type: "SET_CHECKOUT_ATTEMPTED", attempted: true });
      return;
    }
    dispatch({ type: "SET_CHECKOUT_OPEN", isOpen: true });
  };

  const handleCloseModal = () => {
    dispatch({
      type: "SET_CHECKOUT_OPEN",
      isOpen: false,
      resetStatus: orderState.status === "success",
    });
  };

  const errors = {
    dateNeeded: orderState.dateNeeded ? "" : "Select a date needed.",
    name:
      orderState.firstName.trim() && orderState.lastName.trim()
        ? ""
        : "Add your first and last name.",
    email:
      orderState.contactMethod === "email" && !orderState.email
        ? "Email is required."
        : "",
    phone:
      orderState.contactMethod === "phone" && !orderState.phone
        ? "Phone number is required."
        : "",
    address:
      orderState.fulfillmentType === "delivery" && !orderState.address
        ? "Delivery address is required."
        : "",
    deliveryMinimum:
      orderState.fulfillmentType === "delivery" && subtotal < 25
        ? "Delivery is available for orders $25+. You can switch to pickup or add items."
        : "",
  };

  const deliveryBlocked = Boolean(errors.deliveryMinimum);

  const showErrors = {
    dateNeeded:
      Boolean(orderState.submitAttempted || orderState.touched.dateNeeded) &&
      Boolean(errors.dateNeeded),
    name:
      Boolean(
        orderState.submitAttempted ||
        orderState.touched.firstName ||
        orderState.touched.lastName,
      ) && Boolean(errors.name),
    email:
      Boolean(orderState.submitAttempted || orderState.touched.email) &&
      Boolean(errors.email),
    phone:
      Boolean(orderState.submitAttempted || orderState.touched.phone) &&
      Boolean(errors.phone),
    address:
      Boolean(orderState.submitAttempted || orderState.touched.address) &&
      Boolean(errors.address),
    deliveryMinimum:
      Boolean(
        orderState.submitAttempted || orderState.touched.fulfillmentType,
      ) && Boolean(errors.deliveryMinimum),
  };

  const isValid =
    hasItems &&
    !errors.dateNeeded &&
    !errors.name &&
    !errors.email &&
    !errors.phone &&
    !errors.address &&
    !errors.deliveryMinimum;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValid || orderState.status === "submitting") {
      dispatch({ type: "SUBMIT_ERROR", message: "" });
      return;
    }

    dispatch({ type: "SUBMIT_START" });

    const payload = {
      customer_name: `${orderState.firstName} ${orderState.lastName}`,
      contact_method: orderState.contactMethod,
      customer_email: orderState.email ?? "",
      customer_phone: orderState.phone ?? "",
      fulfillment_type: orderState.fulfillmentType,
      date_needed: orderState.dateNeeded,
      delivery_address: orderState.address ?? "",
      order_items: formatOrderEmail(orderState),
      order_subtotal: formatMoney(subtotal),
      order_notes: orderState.additionalNotes ?? "No Additional Notes.",
      selected_menu_title: selectedMenu.title,
      order_type: orderState.orderType,
    };

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_ORDER_TEMPLATE_ID,
        payload,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      );

      dispatch({ type: "SUBMIT_SUCCESS" });
    } catch (error) {
      dispatch({
        type: "SUBMIT_ERROR",
        message:
          "Something went wrong while sending your order. Please try again.",
      });
    }
  };

  return (
    <div
      className={styles.page}
      style={
        selectedMenu.accentColor
          ? ({ "--menu-accent": selectedMenu.accentColor } as CSSProperties)
          : undefined
      }
    >
      {isChoosingOrderType ? (
        <section
          className={styles.orderTypeCard}
          aria-labelledby="order-type-title"
        >
          <h2 id="order-type-title" className={styles.orderTypeTitle}>
            How would you like to order?
          </h2>
          <div className={styles.orderTypeGrid}>
            <button
              type="button"
              className={styles.orderTypeOption}
              onClick={() =>
                dispatch({ type: "SET_ORDER_TYPE", orderType: "preset" })
              }
            >
              <span className={styles.optionText}>
                <span className={styles.optionTitle}>Preset menus</span>
                <span className={styles.optionDesc}>
                  Curated trays & seasonal favorites, ready to order.
                </span>
                <span className={styles.optionCta}>
                  Choose preset menus &rarr;
                </span>
              </span>
            </button>
            <button
              type="button"
              className={styles.orderTypeOption}
              onClick={() =>
                dispatch({ type: "SET_ORDER_TYPE", orderType: "trayBuilder" })
              }
            >
              <span className={styles.optionText}>
                <span className={styles.optionTitle}>Build your own tray</span>
                <span className={styles.optionDesc}>
                  Mix and match items to create a custom tray or dessert bar.
                </span>
                <span className={styles.optionCta}>Start building &rarr;</span>
              </span>
            </button>
          </div>
        </section>
      ) : (
        <>
          <div className={styles.orderTypeBar}>
            <button
              type="button"
              className={styles.orderTypeChange}
              aria-label="Change order type"
              onClick={() => {
                setSearchParams(new URLSearchParams(), { replace: true });
                dispatch({ type: "RESET_ORDER_TYPE" });
              }}
            >
              &larr; Change order type
            </button>
          </div>

          {isPresetFlow ? (
            <div className={styles.orderGrid}>
              <section
                className={styles.menuColumn}
                aria-labelledby="menu-title"
              >
                <div className={styles.orderTypeContent}>
                  <MenuSelector
                    menus={menus}
                    selectedMenuId={orderState.selectedMenuId}
                    selectedMenu={selectedMenu}
                    status={menuStatus}
                    getStatus={getMenuStatus}
                    onSelect={handleMenuSelect}
                  />

                  {hasSelectedMenu ? (
                    <div
                      className={styles.menuItemsSection}
                      ref={menuItemsRef}
                      id="menu-items"
                    >
                      {selectedMenu.template === "matrix" &&
                      selectedMenu.matrix ? (
                        <MenuMatrix
                          menuId={selectedMenu.id}
                          matrix={selectedMenu.matrix}
                          quantities={orderState.matrixQuantities}
                          onChangeQuantity={handleMatrixQuantityChange}
                          onAddSelections={handleAddMatrixSelections}
                          disabled={menuIsViewOnly}
                        />
                      ) : (
                        <div className={styles.menuItems}>
                          {selectedMenu.items?.map((item) => (
                            <MenuItemCard
                              key={item.id}
                              item={item}
                              isOpen={orderState.draftItemId === item.id}
                              selectedSizeId={
                                orderState.draftItemId === item.id
                                  ? orderState.draftSizeId
                                  : undefined
                              }
                              quantity={orderState.draftQuantity}
                              flavor={orderState.draftFlavor}
                              notes={orderState.draftNotes}
                              onToggle={handleToggleItem}
                              onSelectSize={(sizeId) =>
                                dispatch({
                                  type: "SET_DRAFT_ITEM",
                                  payload: { draftSizeId: sizeId },
                                })
                              }
                              onQuantityChange={(value) =>
                                dispatch({
                                  type: "SET_DRAFT_ITEM",
                                  payload: { draftQuantity: value },
                                })
                              }
                              onFlavorChange={(value) =>
                                dispatch({
                                  type: "SET_DRAFT_ITEM",
                                  payload: { draftFlavor: value },
                                })
                              }
                              onNotesChange={(value) =>
                                dispatch({
                                  type: "SET_DRAFT_ITEM",
                                  payload: { draftNotes: value },
                                })
                              }
                              onAdd={handleAddItem}
                              canAdd={
                                orderState.draftItemId === item.id
                                  ? canAddItem
                                  : false
                              }
                              isDisabled={menuIsViewOnly}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              </section>

              <aside className={styles.summaryColumn}>
                <OrderSummary
                  lineItems={orderState.lineItems}
                  subtotal={subtotal}
                  onEdit={handleEditLine}
                  onRemove={handleRemoveLine}
                  onCheckout={handleCheckout}
                  checkoutDisabled={!hasItems}
                  showEmptyHint={showEmptyHint}
                  checkoutButtonRef={checkoutButtonRef}
                  idPrefix="summary"
                />
              </aside>
            </div>
          ) : null}

          {isTrayBuilderFlow ? (
            <section className={styles.builderOnly}>
              <div
                className={styles.builderPanel}
                role="region"
                aria-labelledby="builder-title"
              >
                <h3 className={styles.builderTitle} id="builder-title">
                  Build Your Own Tray
                </h3>
                <p className={styles.builderText}>
                  This builder is coming next. For now, please use Preset Menus
                  or contact us for a custom quote.
                </p>
              </div>
            </section>
          ) : null}
        </>
      )}

      {isPresetFlow ? (
        <>
          <MobileCartBar
            itemCount={orderState.lineItems.length}
            subtotal={subtotal}
            onOpen={handleCheckout}
            showHint={showEmptyHint}
            hintText="Add at least one item to checkout."
          />

          <CheckoutModal
            isOpen={orderState.checkoutOpen}
            onClose={handleCloseModal}
            returnFocusRef={checkoutButtonRef}
            lineItems={orderState.lineItems}
            subtotal={subtotal}
            onEdit={handleEditLineFromModal}
            onRemove={handleRemoveLine}
            fulfillmentType={orderState.fulfillmentType}
            dateNeeded={orderState.dateNeeded}
            address={orderState.address}
            contactMethod={orderState.contactMethod}
            firstName={orderState.firstName}
            lastName={orderState.lastName}
            email={orderState.email}
            phone={orderState.phone}
            additionalNotes={orderState.additionalNotes}
            onChangeFulfillmentType={(value) =>
              dispatch({
                type: "SET_FULFILLMENT",
                payload: { fulfillmentType: value },
                touchedField: "fulfillmentType",
              })
            }
            onChangeDate={(value) =>
              dispatch({
                type: "SET_FULFILLMENT",
                payload: { dateNeeded: value },
              })
            }
            onChangeAddress={(value) =>
              dispatch({
                type: "SET_FULFILLMENT",
                payload: { address: value },
              })
            }
            onChangeFirstName={(value) =>
              dispatch({
                type: "SET_CUSTOMER",
                payload: { firstName: value },
              })
            }
            onChangeLastName={(value) =>
              dispatch({
                type: "SET_CUSTOMER",
                payload: { lastName: value },
              })
            }
            onChangeContactMethod={(value) =>
              dispatch({
                type: "SET_CUSTOMER",
                payload: { contactMethod: value },
                touchedField: "contactMethod",
              })
            }
            onChangeEmail={(value) =>
              dispatch({
                type: "SET_CUSTOMER",
                payload: { email: value },
              })
            }
            onChangePhone={(value) =>
              dispatch({
                type: "SET_CUSTOMER",
                payload: { phone: value },
              })
            }
            onChangeNotes={(value) =>
              dispatch({ type: "SET_NOTES", notes: value })
            }
            onBlurDate={() =>
              dispatch({
                type: "SET_FULFILLMENT",
                payload: {},
                touchedField: "dateNeeded",
              })
            }
            onBlurAddress={() =>
              dispatch({
                type: "SET_FULFILLMENT",
                payload: {},
                touchedField: "address",
              })
            }
            onBlurFirstName={() =>
              dispatch({
                type: "SET_CUSTOMER",
                payload: {},
                touchedField: "firstName",
              })
            }
            onBlurLastName={() =>
              dispatch({
                type: "SET_CUSTOMER",
                payload: {},
                touchedField: "lastName",
              })
            }
            onBlurEmail={() =>
              dispatch({
                type: "SET_CUSTOMER",
                payload: {},
                touchedField: "email",
              })
            }
            onBlurPhone={() =>
              dispatch({
                type: "SET_CUSTOMER",
                payload: {},
                touchedField: "phone",
              })
            }
            errors={errors}
            showErrors={showErrors}
            status={orderState.status}
            errorMessage={orderState.errorMessage}
            disableSubmit={
              orderState.status === "submitting" || deliveryBlocked
            }
            onSubmit={handleSubmit}
          />
        </>
      ) : null}

      {showMenuConfirm ? (
        <div
          className={styles.confirmBackdrop}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowMenuConfirm(false);
              setPendingMenuId(null);
            }
          }}
        >
          <div
            className={styles.confirmModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="menu-confirm-title"
          >
            <h2 id="menu-confirm-title" className={styles.confirmTitle}>
              Leave this menu?
            </h2>
            <p className={styles.confirmText}>
              Your cart will be cleared if you switch menus.
            </p>
            <div className={styles.confirmActions}>
              <button
                type="button"
                className={styles.confirmSecondary}
                onClick={() => {
                  setShowMenuConfirm(false);
                  setPendingMenuId(null);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.confirmPrimary}
                onClick={() => {
                  if (pendingMenuId) {
                    dispatch({ type: "CLEAR_CART" });
                    applyMenuSelection(pendingMenuId);
                  }
                  setShowMenuConfirm(false);
                  setPendingMenuId(null);
                }}
              >
                Switch menus
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
