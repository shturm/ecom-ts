import React, { Component, useEffect } from 'react'
import { useLoaderData, useParams } from 'react-router-dom';
import products from '../../data/products.json';

// set to be used in main.tsx -> router
export async function productLoader( params: any) {
    const result = await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({"name": `Product ${params.productId}`, "productId": params.productId});
        }, 100);
    });
    // const result = await Promise.resolve({"name": `Product ${params.productId}`, "productId": params.productId});
    return result;
    // return product;
  }

type Props = {}

type State = {}

// export default class Product extends Component<Props, State> {
export default function Product ({}:Props) {
  let product: any  = useLoaderData();

  return (
    <>
      <h2>Product</h2>
      <ul>
        <li>Product ID: {product.productId}</li>
        <li>Product Name: {product.name}</li>
      </ul>
    </>
  )
}