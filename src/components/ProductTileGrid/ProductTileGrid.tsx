import { Container, Grid } from '@mui/material';
import * as React from 'react';
import { ProductTile } from '../ProductTile/ProductTile';
import { Product } from '../../data/product.types';

export interface IProductTileGridProps {
    products: Product[]
}

export function ProductTileGrid (props: IProductTileGridProps) {
    return (
        <React.Fragment>
            <Grid container spacing={5} alignItems="flex-end">
                {props.products.map(product => (
                    <ProductTile key={product.Index} product={product}/>
                ))}
            </Grid>
        </React.Fragment>
        );
    }
    