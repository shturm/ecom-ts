import { createBrowserRouter } from "react-router-dom";

import NotFound from '../pages/NotFound';
import Contact from '../pages/Contact';
import Cart from '../pages/Cart';
import Product, { productLoader } from '../pages/Product';
import Pricing from '../components/Pricing/Pricing';
import Layout from "../components/Layout/Layout";
import Home from "../pages/Home";

export const navItems = [
    { href: "/product/1337", title: "Product" },
    { href: "/pricing", title: "Pricing" },
    { href: "/contact", title: "Contact" },
    { href: "/category", title: "Category" },
    { href: "/search", title: "Search" },
    { href: "/cart", title: "Cart" },
    { href: "/not-found", title: "Not" },
  ];

  export const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <NotFound/>,
      children: [
        { index: true, element: <Home /> },
        { path: "/home", element: <Home /> },
        { path: "/pricing", element: <Pricing /> },
        { path: "/contact", element: <Contact /> },
        { path: "/category", element: <NotFound /> },
        { 
          path: "/product/:productId", 
          element: <Product />, 
          loader: productLoader
        },
        { path: "/search", element: <NotFound /> },
        { path: "/search/:query", element: <NotFound /> },
        { path: "/cart", element: <Cart /> },
        { path: "/not-found", element: <NotFound /> },
        { path: "/not-found", element: <NotFound /> },
      ]
    }
  ]);
  