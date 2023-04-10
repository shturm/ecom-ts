
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import * as React from "react";
import { Product } from "../../data/product.types";
import { useNavigate } from "react-router-dom";
import { productLoader } from "../../pages/ProductPage/ProductPage";


export interface IProductTileProps {
  product: Product;
}

export function ProductTile(props: IProductTileProps) {
  const navigate = useNavigate();
  const sxHover = {
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "primary.dark",
    },
  };

  return (
    <React.Fragment>

      <Grid item xs={12} sm={6} md={4} lg={4}>
        <Card onClick={(e) => navigate(`/product/${props.product.Index}`)} sx={sxHover}>
          <CardHeader
            // title={props.product.InternalName}
            subheader={props.product.InternalName}
            titleTypographyProps={{ align: "center" }}
            subheaderTypographyProps={{
              align: "left",
              color: "text.primary",
            }}
            sx={{
                minHeight: 80
            }}
          />
          <CardContent>
            <Box
              sx={{
                // display: 'flex',
                justifyContent: "center",
                alignItems: "baseline",
                mb: 1,
              }}
            >
              <img src={props.product.ImageUrlsShopify[0]} alt={props.product.InternalName} width={320} height={320} />
              <Typography component="h6" variant="h6" color="text.primary">
                {props.product.Price.toFixed(2)} лв.
              </Typography>
              <Typography component="p" variant="body1" sx={{ color: "text.disabled", fontSize: 11 }}>
                С включено ДДС
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

    </React.Fragment>
  );
}
