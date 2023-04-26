import * as React from 'react';
import { useLoaderData } from 'react-router-dom';
import data from '../data/products.json';
import { Product } from '../data/product.types';
import { ProductTileGrid } from '../components';
import { Filters, filterProducts } from '../components/Filter';

export async function protectionCategoryLoader(routeData: any) {
    // console.log(routeData);
    const products: Product[] = data as Product[];
    const result: Product[] = products.filter((x) => x.ProtectionCategory == routeData.params.pc);
    return result;
  }

export interface IProtectionCategoryProps {
}

export function ProtectionCategory (props: IProtectionCategoryProps) {
    const products: Product[] = useLoaderData() as Product[];
    

    return (
    <React.Fragment>
      <ProductTileGrid products={products} />
    </React.Fragment>
  );
}
