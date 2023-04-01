import { createBrowserRouter, Link, useNavigate } from "react-router-dom";

import NotFound from '../pages/NotFound';
import Contact from '../pages/Contact';
import Cart from '../pages/Cart';
import Product, { productLoader } from '../pages/Product';
import Pricing from '../components/Pricing/Pricing';
import Layout from "../components/Layout/Layout";
import Home from "../pages/Home";
import { Category } from "../pages/Category";

import ShoppingCartTwoToneIcon from '@mui/icons-material/ShoppingCartTwoTone';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Icon, ListItemIcon } from "@mui/material";

import './Navigation.css';


export const navItems = [
  { href: "/product/1337", title: "Product"},
  { href: "/pricing", title: "Pricing"},
  { href: "/contact", title: "Contact"},
  { href: "/category", title: "Category"},
  { href: "/search", title: "Search"},
  { href: "/cart", title: "Cart", icon: <ShoppingCartTwoToneIcon/>},
  { href: "/not-found", title: "Not"},
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
      { path: "/category", element: <Category /> },
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

interface Props {
  
}

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
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        <Link to="/">
          <Button >
            Safetyshoes.bg
          </Button>
        </Link>
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.title} disablePadding>
              <ListItemButton sx={{ textAlign: 'center' }} onClick={(e) => navigate(item.href)}>
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
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar component="nav" id="app-bar">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            <Link to="/">
              <Button sx={{ color: '#fff' }}>
                  Safetyshoes.bg
              </Button>
        </Link>
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {navItems.map((item) => (
              <Link key={item.title} to={item.href}>
                <Button key={item.title} sx={{ color: '#fff' }}>
                  {item.icon}
                  {item.title}
                </Button>
              </Link>
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
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

    </Box>
  );
}
