import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import Home from "../pages/Home";
import News from "../pages/News";
import AboutPage from "../pages/AboutPage/AboutPage";
import MenuHub from "../pages/MenuHub";
import MenuDetail from "../pages/MenuDetail";
import Contact from "../pages/Contact";
import OrderPage from "../pages/OrderPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "news", element: <News /> },
      { path: "about", element: <AboutPage /> },
      { path: "products", element: <MenuHub /> },
      { path: "products/:menuId", element: <MenuDetail /> },
      { path: "order", element: <OrderPage /> },
      { path: "contact", element: <Contact /> },
    ],
  },
]);
