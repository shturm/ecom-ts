import { createBrowserRouter, Link, useNavigate } from "react-router-dom";

import NotFoundPage from "../pages/NotFoundPage";
import ContactPage from "../pages/ContactPage";
import CartPage from "../pages/CartPage/CartPage";
import ProductPage, { productLoader } from "../pages/ProductPage/ProductPage";
import Pricing from "../components/Pricing/Pricing";
import Layout from "../components/Layout/Layout";
import HomePage from "../pages/HomePage";
import { CategoryPage } from "../pages/CategoryPage";

import ShoppingCartTwoToneIcon from "@mui/icons-material/ShoppingCartTwoTone";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Icon, ListItemIcon } from "@mui/material";

import "./Navigation.css";
import { Product } from "../data/product.types";
import { ProtectionCategory, protectionCategoryLoader } from "../pages/ProtectionCategory";
import { TermsAndContiionsPage } from "../pages/TermsAndConditions";

export const navItems = [
  // { href: "/product/1337", title: "Product" },
  // { href: "/pricing", title: "Pricing" },
  { href: "/", title: "Всички" },
  { href: "/protectionCategory/F2A", title: "F2A" },
  { href: "/protectionCategory/S1", title: "S1" },
  { href: "/protectionCategory/S2", title: "S2" },
  { href: "/protectionCategory/S3", title: "S3" },
  { href: "/protectionCategory/S1P", title: "S1P" },
  { href: "/protectionCategory/O1", title: "O1" },
  { href: "/protectionCategory/O2", title: "O2" },
  { href: "/protectionCategory/O3", title: "O3" },
  { href: "/contact", title: "Контакт" },
  // { href: "/category", title: "Category" },
  { href: "/search", title: "Търсене", disabled: true },
  { href: "/cart", title: "Количка", icon: <ShoppingCartTwoToneIcon />, disabled: false},
  // { href: "/not-found", title: "Not" },
];

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/home", element: <HomePage /> },
      { path: "/protectionCategory/:pc", element: <ProtectionCategory />, loader: protectionCategoryLoader },
      { path: "/pricing", element: <Pricing /> },
      { path: "/contact", element: <ContactPage /> },
      { path: "/category", element: <CategoryPage /> },
      { path: "/toc", element: <TermsAndContiionsPage /> },
      {
        path: "/product/:productId",
        element: (
          <ProductPage
            // onAddToCart={(product: Product, orderCount: number) => {
            //   console.log(
            //     "onAddToCart provided from Navigation.tsx",
            //     product,
            //     orderCount
            //   );
            // }}
          />
        ),
        loader: productLoader,
      },
      { path: "/search", element: <NotFoundPage /> },
      { path: "/search/:query", element: <NotFoundPage /> },
      { path: "/cart", element: <CartPage /> },
      { path: "/not-found", element: <NotFoundPage /> },
      { path: "/not-found", element: <NotFoundPage /> },
    ],
  },
]);

interface Props {}

const drawerWidth = 240;
// const navItems = ['Home', 'About', 'Contact'];

export function DrawerAppBar(props: Props) {
  // const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        <Link to="/">
          <Button>Safetyshoes.bg</Button>
        </Link>
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.title} disablePadding>
            <ListItemButton
              sx={{ textAlign: "center" }}
              onClick={(e) => navigate(item.href)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container = document.body;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar component="nav" id="app-bar">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            <Link to="/">
              <Button sx={{ color: "#fff" }}>Safetyshoes.bg</Button>
            </Link>
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {navItems.map((item) => (
              // <Link key={item.title} to={item.href}>
                <Button key={item.title} sx={{ color: "#fff" }} disabled={item.disabled} href={item.href}>
                  {item.icon}
                  {item.title}
                </Button>
              // </Link>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}
