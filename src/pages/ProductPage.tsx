import React, { Component, useEffect } from 'react'
import { useLoaderData, useParams } from 'react-router-dom';
import { Product } from '../data/product.types';

// set to be used in main.tsx -> router
import productsUntyped from '../data/products.json';
export async function productLoader( data: any) {
    const result = await new Promise((resolve, reject) => {
        setTimeout(() => {
            // resolve({"name": `Product ${data.params.productId}`, "productId": data.params.productId});
            const products: Product[] = productsUntyped as Product[];
            resolve(products.filter(p => p.Index == data.params.productId)[0]);
        }, 100);
    });
    // const result = await Promise.resolve({"name": `Product ${params.productId}`, "productId": params.productId});
    return result;
    // return product;
  }

type Props = {}

type State = {}

// export default class Product extends Component<Props, State> {
export default function ProductPage ({}:Props) {
  const product: Product  = useLoaderData() as Product;

  return (
    <>
      <h2>Product</h2>
      <ul>
        <li>Product ID: {product.Index}</li>
        <li>Product Name: {product.TradeName}</li>
      </ul>
    </>
  )
}