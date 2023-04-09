import React, { Component, useEffect, useState } from "react";
import { useLoaderData, useParams } from "react-router-dom";
import { Product } from "../../data/product.types";

// set to be used in main.tsx -> router
import productsUntyped from "../../data/products.json";
import { Box, Button, Chip, Grid, TextField, Typography } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";

import { ProductDescription } from "./ProductDescription";
import { ProductOrderWidget } from "./ProductOrderWidget";

export async function productLoader(routeData: any) {
  const result = await new Promise((resolve, reject) => {
    setTimeout(() => {
      // resolve({"name": `Product ${data.params.productId}`, "productId": data.params.productId});
      const products: Product[] = productsUntyped as Product[];
      resolve(products.filter((p) => p.Index == routeData.params.productId)[0]);
    }, 100);
  });
  // const result = await Promise.resolve({"name": `Product ${params.productId}`, "productId": params.productId});
  return result;
  // return product;
}

type Props = {
  onAddToCart?: (product: Product, orderCount: number, size: number, additionalDetails: string) => void;
};

type State = {};

// export default class Product extends Component<Props, State> {
export default function ProductPage(props: Props) {
  const product: Product = useLoaderData() as Product;
  const [mainImageUrl, setMainImageUrl] = useState(product.ImageUrlsShopify[0]);
  const [orderWidgetData, setOrderWidgetData] = useState({
    size: product.Sizes[0],
    orderCount: 1,
    additionalDetails: "",
  });

  const onOrderCountChange = (orderCount: number) => {
    if (orderCount < 1) {
      setOrderWidgetData((prevState) => {
        return {
          ...prevState,
          orderCount: 1
        }
      });
    } else {
      setOrderWidgetData((prevState) => {
        return {
          ...prevState,
          orderCount: orderCount
        }
      });
    }
  };

  const onAddToCartHandler = () => {
    if (props.onAddToCart)
      return props.onAddToCart(
        product,
        orderWidgetData.orderCount,
        orderWidgetData.size,
        orderWidgetData.additionalDetails
      );
    console.warn(
      "ProductPage.tsx is not provided with props.onAddToCart",
      product,
      orderWidgetData.orderCount,
      orderWidgetData.size,
      orderWidgetData.additionalDetails
    );
  };

  const smallImgStyle = {
    cursor: "pointer",
    "&:hover": {
      cursor: "pointer",
      opacity: 0.7,
    },
  };

  const ProtectionCategory = () => {
    if (product.ProtectionCategory)
      return <Chip color="success" label={product.ProtectionCategory} icon={<DoneIcon />} />;
    return null;
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={6} md={6}>
        <Box>
          <img src={mainImageUrl} alt={product.InternalName} width={450} height={450} />
        </Box>
        <Box>
          {product.ImageUrlsShopify.map((url) => (
            <img
              key={url}
              src={url}
              alt={product.InternalName}
              width={60}
              height={60}
              onClick={() => setMainImageUrl(url)}
              style={smallImgStyle}
            />
          ))}
        </Box>
      </Grid>
      <Grid item xs={6} md={6}>
        <h1>
          {product.InternalName} <ProtectionCategory />
        </h1>
        <p>{product.Description}</p>
        <ProductOrderWidget
          product={product}
          orderCount={orderWidgetData.orderCount}
          size={orderWidgetData.size}
          additionalDetails={orderWidgetData.additionalDetails}
          onAdditionalDetailsChange={(val) => setOrderWidgetData({ ...orderWidgetData, additionalDetails: val })}
          onOrderCountChange={onOrderCountChange}
          onSizeChange={(val) => setOrderWidgetData({ ...orderWidgetData, size: val })}
          onAddToCart={onAddToCartHandler}
        />
      </Grid>
      <Grid item xs={12} md={12}>
        <ProductDescription product={product} />
        <ProductOrderWidget
          product={product}
          orderCount={orderWidgetData.orderCount}
          size={orderWidgetData.size}
          additionalDetails={orderWidgetData.additionalDetails}
          onAdditionalDetailsChange={(val) => setOrderWidgetData({ ...orderWidgetData, additionalDetails: val })}
          onOrderCountChange={onOrderCountChange}
          onSizeChange={(val) => setOrderWidgetData({ ...orderWidgetData, size: val })}
          onAddToCart={onAddToCartHandler}
        />
      </Grid>
    </Grid>
  );
}
