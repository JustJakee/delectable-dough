import type { Product } from "../../data/products";

type QueryProductsInput = {
  products: Product[];
  searchTerm: string;
  activeTag: string | null;
  page: number;
  pageSize: number;
};

type QueryProductsResult = {
  filteredProducts: Product[];
  pagedProducts: Product[];
  totalCount: number;
  totalPages: number;
};

const buildSearchText = (product: Product) => {
  const variantItems =
    product.variantGroups?.flatMap((group) => group.items) ?? [];
  return [product.name, product.oneLiner, ...variantItems]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
};

export default function queryProducts({
  products,
  searchTerm,
  activeTag,
  page,
  pageSize
}: QueryProductsInput): QueryProductsResult {
  const term = searchTerm.trim().toLowerCase();

  const filteredProducts = products.filter((product) => {
    const matchesTag = activeTag ? product.tags.includes(activeTag) : true;
    const matchesSearch = term ? buildSearchText(product).includes(term) : true;
    return matchesTag && matchesSearch;
  });

  const totalCount = filteredProducts.length;
  const safePageSize = Math.max(1, pageSize);
  const totalPages = Math.max(1, Math.ceil(totalCount / safePageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const startIndex = (safePage - 1) * safePageSize;

  return {
    filteredProducts,
    pagedProducts: filteredProducts.slice(
      startIndex,
      startIndex + safePageSize
    ),
    totalCount,
    totalPages
  };
}
