import React, { Component, useEffect, useState } from "react";
import { useLoaderData, useParams } from "react-router-dom";
import { Product } from "../../data/product.types";

// set to be used in main.tsx -> router
import productsUntyped from "../../data/products.json";
import { Box, Button, Chip, Grid, TextField, Typography } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import ShoppingCartTwoToneIcon from "@mui/icons-material/ShoppingCartTwoTone";
import { ProductDescription } from "./ProductDescription";

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
  onAddToCart?: (product: Product, count: number) => void;
};

const defaultProps: Props = {
  onAddToCart: (product: Product, count: number) =>
    console.log("Added to cart", product.InternalName, count),
};

type State = {};

// export default class Product extends Component<Props, State> {
export default function ProductPage(props: Props = defaultProps) {
  const product: Product = useLoaderData() as Product;

  const [mainImageUrl, setMainImageUrl] = useState(product.ImageUrlsShopify[0]);
  const [orderCount, setOrderCount] = useState(1);

  const onOrderCountChange = (event: any) => {
    if (event.target.value < 1) {
      setOrderCount(1);
    } else {
      setOrderCount(event.target.value);
    }
  };

  const onAddToCartHandler = (product: Product, orderCount: number) => {
    if (props.onAddToCart) return props.onAddToCart(product, orderCount);
    console.warn(
      "ProductPage.tsx is not provided with props.onAddToCart",
      product,
      orderCount
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
      return (
        <Chip
          color="success"
          label={product.ProtectionCategory}
          icon={<DoneIcon />}
        />
      );
    return null;
  };
  return (
    // <>
    //   <h2>Product</h2>
    //   <ul>
    //     <li>Product ID: {product.Index}</li>
    //     <li>Product Name: {product.TradeName}</li>
    //     <li>Product Price: {product.Price.toFixed(2)}</li>
    //   </ul>
    // </>

    <Grid container spacing={2}>
      <Grid item xs={6} md={6}>
        <Box>
          <img
            src={mainImageUrl}
            alt={product.InternalName}
            width={450}
            height={450}
          />
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
        <Typography
          component="span"
          variant="caption"
          sx={{ color: "text.primary", fontSize: 28 }}
        >
          Цена: {product.Price.toFixed(2)} лв.
        </Typography>
        <Typography
          component="p"
          variant="body1"
          sx={{ color: "text.disabled", fontSize: 11 }}
          mb={2}
        >
          с включено ДДС
        </Typography>
        <Box flexWrap={"nowrap"} display={"flex"} mt={2}>
          <TextField
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            sx={{
              width: 70,
              // padding: "10"
            }}
            label="Брой"
            type="number"
            value={orderCount}
            onChange={onOrderCountChange}
          />
          <Button
            onClick={() => {
              onAddToCartHandler(product, orderCount);
            }}
            variant="outlined"
            color="success"
            endIcon={<ShoppingCartTwoToneIcon />}
            size="large"
          >
            ДОБАВИ В КОЛИЧКАТА
          </Button>
        </Box>
      </Grid>
      <Grid item xs={12} md={12}>
            <ProductDescription product={product} />
        </Grid>
    </Grid>
  );
}
