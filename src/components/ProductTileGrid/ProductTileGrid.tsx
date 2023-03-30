import { Container, Grid } from '@mui/material';
import * as React from 'react';
import { ProductTile } from '../ProductTile/ProductTile';

export interface IProductTileGridProps {
}

export function ProductTileGrid (props: IProductTileGridProps) {
    return (
        <React.Fragment>

        <Grid container spacing={5} alignItems="flex-end">
            <ProductTile />
            <ProductTile />
            <ProductTile />
            <ProductTile />
            <ProductTile />
            <ProductTile />
            <ProductTile />
            <ProductTile />
        </Grid>
        </React.Fragment>
        );
    }
    