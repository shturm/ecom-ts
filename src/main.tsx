import React from 'react'
import ReactDOM from 'react-dom/client'

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


import Home from './pages/Home'
import Layout from './components/Layout/Layout'
import './main.css'

import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import NotFound from './pages/NotFound'
import Contact from './pages/Contact'
import Cart from './pages/Cart'
import Product, { productLoader } from './pages/Product';
import Pricing from './components/Pricing/Pricing';
const router = createBrowserRouter([
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


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>,
)
