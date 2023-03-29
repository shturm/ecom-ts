import { ReactNode, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './Layout.css'
import { Outlet, Router } from 'react-router-dom'

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import StarIcon from '@mui/icons-material/StarBorder';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import GlobalStyles from '@mui/material/GlobalStyles';
import Container from '@mui/material/Container';
import { navItems } from '../../Navigation/Navigation';
import { Footer } from '../Footer/Footer'


function LayoutContent() {
  return (
    <React.Fragment>
      <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
      <CssBaseline />
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
      >
        <Toolbar sx={{ flexWrap: 'wrap' }}>
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            <Link href="/">Safetyshoes.bg</Link>
          </Typography>
          <nav>
            {navItems.map(navItem => 
              <Link 
                variant="button"
                color="text.primary"
                sx={{ my: 1, mx: 1.5 }} key={navItem.title} 
                href={navItem.href}>
                  {navItem.icon}
                  {navItem.title}
              </Link>
            )}

          </nav>
          {/* <Button href="#" variant="outlined" sx={{ my: 1, mx: 1.5 }}>
            Login
          </Button> */}
        </Toolbar>
      </AppBar>
      <Container component="main">
        <Outlet/>
      </Container>
      
      <Footer />
    </React.Fragment>
  );
}

export default function Layout() {
  return <LayoutContent />;
}
