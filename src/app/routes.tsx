import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import Home from "../pages/Home";
import News from "../pages/News";
import AboutPage from "../pages/AboutPage/AboutPage";
import MenuHub from "../pages/MenuHub";
import MenuDetail from "../pages/MenuDetail";
import Contact from "../pages/Contact";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "news", element: <News /> },
      { path: "about", element: <AboutPage /> },
      { path: "menu", element: <MenuHub /> },
      { path: "menu/:menuId", element: <MenuDetail /> },
      { path: "contact", element: <Contact /> },
    ],
  },
]);
