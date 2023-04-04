import { Button, Card, CardActions, CardContent, CardHeader, Container, Grid, Skeleton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import * as React from 'react';
import { Product } from '../../data/product.types';
import { useNavigate } from 'react-router-dom';

export interface IProductTileProps {
    product: Product
}


export function ProductTile (props: IProductTileProps) {
    const navigate = useNavigate();
    const sxHover = {
        "cursor": "pointer",
        "&:hover": {
        //   border: "1px solid #00FF00",
        //   color: 'gray',
          backgroundColor: 'gray'
        },
      };

    // const MouseEnterHandler = (event: MouseEvent) => { event.target.style.background = "red"; }
    // const MouseLeaveHandler = (event: MouseEvent) => { event.target.style.background = "blue"; }
  return (
    <React.Fragment>
        <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card onClick={(e) => 
                navigate(`/product/${props.product.Index}`)} 
                sx={sxHover}
                // onMouseEnter={MouseEnterHandler}
                // onMouseLeave={MouseLeaveHandler}
                >
            <CardHeader
                title={props.product.TradeName}
                subheader={props.product.InternalName}
                titleTypographyProps={{ align: 'center' }}
                subheaderTypographyProps={{
                align: 'center',
                }}
                
            />
            <CardContent>
                <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'baseline',
                    mb: 2,
                }}
                >
                <Typography component="h6" variant="h6" color="text.primary">
                    {props.product.Price.toFixed(2)} лв.
                </Typography>
                </Box>
            </CardContent>
            {/* <CardActions>
                <Button
                fullWidth
                // variant={tier.buttonVariant as 'outlined' | 'contained'}
                variant='outlined'
                >
                Button Text
                </Button>
            </CardActions> */}
            </Card>
        </Grid>    
    </React.Fragment>
  );
}
