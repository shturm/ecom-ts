import { Container, Link, Typography } from '@mui/material';
import * as React from 'react';

function Copyright(props: any) {
    return (
        <>
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link color="inherit" href="https://safetyshoes.bg/">Safetyshoes.bg</Link>{' '}{new Date().getFullYear()}{'. '}
        <Link color="inherit" href="/toc">Условия за ползване.&nbsp;</Link>
        <Link color="inherit" href="/privacy">Политика за поверителност</Link>
      </Typography>
      
        </>
    );
  }

export interface IFooterProps {
}

export function Footer (props: IFooterProps) {
  return (
    <Container
    maxWidth="md"
    component="footer"
    sx={{
      borderTop: (theme) => `1px solid ${theme.palette.divider}`,
      mt: 8,
      py: [3, 6],
    }}>
  
    <Copyright sx={{ mt: 5 }} />
    </Container>
  
  );
}
