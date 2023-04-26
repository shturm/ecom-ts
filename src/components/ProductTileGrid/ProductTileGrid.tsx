import { Container, Grid } from "@mui/material";
import * as React from "react";
import { ProductTile } from "../ProductTile/ProductTile";
import { Product } from "../../data/product.types";
import { Filters, IFilters, filterProducts } from "../Filter";

export interface IProductTileGridProps {
  products: Product[];
}

export function ProductTileGrid(props: IProductTileGridProps) {
  const [productsFiltered, setProductsFiltered] = React.useState<Product[]>(
    props.products
  );
  const [filters, setFilters] = React.useState<IFilters>({} as IFilters);

  const onFiltersChanged = (newFilters: IFilters) => {
    setFilters(newFilters);
    setProductsFiltered(filterProducts(props.products, newFilters));
  };

  return (
    <React.Fragment>
      <Filters onChange={onFiltersChanged} products={productsFiltered} />
      <h4>{productsFiltered.length} продукта</h4>
      <Grid container spacing={2} alignItems="flex-end">
        {productsFiltered.map((product) => (
          <ProductTile key={product.Index} product={product} />
        ))}
      </Grid>
    </React.Fragment>
  );
}
