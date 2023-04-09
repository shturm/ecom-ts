import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import ShoppingCartTwoToneIcon from "@mui/icons-material/ShoppingCartTwoTone";
import * as React from "react";
import { Product } from "../../data/product.types";
import IOrderRecord from "../../Models/IOrderRecord"

export default interface IProductOrderWidgetProps extends IOrderRecord {
  // product: Product;
  // orderCount: number;
  // size: number;
  // additionalDetails: string;
  
  onSizeChange: (size: number) => void;
  onOrderCountChange: (orderCount: number) => void;
  onAdditionalDetailsChange: (text: string) => void;
  onAddToCart: (product: Product, orderCount: number) => void;
}

export function ProductOrderWidget(props: IProductOrderWidgetProps) {
  const onAddToCartHandler = (product: Product, orderCount: number) => {
    props.onAddToCart(product, orderCount);
  };
  const onOrderCountChangeHandler = (orderCount: number) => {
    props.onOrderCountChange(orderCount);
  };

  const onSizeChangeHandler = (size: number) => {
    props.onSizeChange(size);
  };

  const onAdditionalDetailsChangeHandler = (text: string) => {
    props.onAdditionalDetailsChange(text);
    // console.log("ProductOrderWidget", "Additional details changed:", text);
  };

  return (
    <React.Fragment>
      <Typography component="span" variant="caption" sx={{ color: "text.primary", fontSize: 28 }}>
        Цена: {props.OrderProduct.Price.toFixed(2)} лв.
      </Typography>
      <Typography component="p" variant="body1" sx={{ color: "text.disabled", fontSize: 11 }} mb={2}>
        с включено ДДС
      </Typography>
      <Box width={567}>
        <Box flexWrap={"nowrap"} display={"flex"} mt={2} className="ProductOrderWidget">
          <FormControl sx={{ width: 110 }}>
            <InputLabel id="demo-simple-select-label">Размер</InputLabel>
            <Select
              labelId="simple-select-label-size"
              id="simple-select-label-size"
              value={props.OrderSize}
              label="Age"
              onChange={(e) => onSizeChangeHandler(Number(e.target.value))}
            >
              {props.OrderProduct.Sizes.map((x) => (
                <MenuItem key={x} value={x}>{x.toString()}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            sx={{
              width: 70,
              // padding: "10"
            }}
            label="Брой"
            type="number"
            value={props.OrderCount}
            onChange={(e) => onOrderCountChangeHandler(parseInt(e.target.value))}
          />
          <TextField
            label={"Допълнителни инструкции"}
            sx={{ width: 424 }}
            value={props.OrderAdditionalDetails}
            onChange={(e) => onAdditionalDetailsChangeHandler(e.target.value)}
          ></TextField>
        </Box>
        <Button
          onClick={() => onAddToCartHandler(props.OrderProduct, props.OrderCount)}
          variant="outlined"
          color="success"
          endIcon={<ShoppingCartTwoToneIcon />}
          size="large"
          sx={{
            fontSize: 24,
            width: 567,
          }}
        >
          ДОБАВИ В КОЛИЧКАТА
        </Button>
      </Box>
    </React.Fragment>
  );
}
