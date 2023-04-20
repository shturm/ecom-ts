import {
  Box,
  Button,
  Grid,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  Typography,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import CloseIcon from "@mui/icons-material/Close";
import _ from "lodash";
import React from "react";
import { CartOrderRecord } from "./CartOrderRecord";
import IOrderRecord from "../../Models/IOrderRecord";
import storage from "../../data/storage";
import { Link } from "react-router-dom";
import { CartForm, ICartForm } from "./CartForm";

type ICartPageProps = {
  orderRecords?: IOrderRecord[];
};

export default function CartPage(props: ICartPageProps) {
  const [orderRecords, setOrderRecords] = React.useState<Array<IOrderRecord>>(
    storage.get("cart")
  );

  const [total, setTotal] = React.useState<Number>(
    _.sum(orderRecords.map((x) => x.OrderProduct.Price * x.OrderCount))
  );

  const onCountChange = (id: string, count: number) => {
    if (count <= 0) count = 1;
    let currentIndex = orderRecords.findIndex(
      (record) => record.OrderRecordId == id
    );
    orderRecords[currentIndex].OrderCount = count;
    const updatedRecords = orderRecords.slice();

    // console.log(`${updatedRecords[currentIndex].OrderRecordId} ${updatedRecords[currentIndex].OrderCount}`);
    setTotal(
      _.sum(orderRecords.map((x) => x.OrderProduct.Price * x.OrderCount))
    );
    storage.set("cart", updatedRecords);
    setOrderRecords(updatedRecords);
  };

  const onSizeChange = (id: string, size: number) => {
    let currentIndex = orderRecords.findIndex(
      (record) => record.OrderRecordId == id
    );
    orderRecords[currentIndex].OrderSize = size;
    const updatedRecords = orderRecords.slice();

    // console.log(`${updatedRecords[currentIndex].OrderRecordId} ${updatedRecords[currentIndex].OrderCount}`);
    storage.set("cart", updatedRecords);
    setOrderRecords(updatedRecords);
  };

  const onDelete = (id: string) => {
    let cart = orderRecords.slice();
    const index = cart.findIndex((x) => x.OrderRecordId == id);
    cart.splice(index, 1);
    storage.set("cart", cart);
    setOrderRecords(cart);
  };

  const onSubmit = async (formData: ICartForm) => {
    const data = {
      items: orderRecords.map((x) => {
        return {
        index: x.OrderProduct.Index,
        internalName: x.OrderProduct.InternalName,
        count: x.OrderCount,
        size: x.OrderSize,
        additionalDetails: x.OrderAdditionalDetails
      };
      }),
      ...formData
    };
    // todo: send email
    const response = await window.fetch('/cart.php', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json; charset=utf8',

      }
    });
    
    console.log("CartPage.onSubmit", data);
  }

  return (
    <React.Fragment>
      <Typography variant="h2">Поръчка</Typography>
      <Grid container>
        <Grid item lg={12} md={12} xs={12}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>Артикул</TableCell>
                  <TableCell align="right">Номер</TableCell>
                  <TableCell align="right">Брой</TableCell>
                  <TableCell align="right">Ед. Цена</TableCell>
                  <TableCell align="right">Субтотал</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderRecords.map((record: IOrderRecord) => (
                  <TableRow
                    key={
                      record.OrderProduct.Index +
                      record.OrderSize +
                      record.OrderCount +
                      record.OrderAdditionalDetails
                    }
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell width={80}>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => onDelete(record.OrderRecordId || "")}
                      >
                        <CloseIcon />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Link
                        to={`/product/${record.OrderProduct.Index}`}
                        style={{ color: "text.primary" }}
                      >
                        <img
                          src={record.OrderProduct.ImageUrlsShopify[0]}
                          alt={record.OrderProduct.InternalName}
                          width={45}
                          height={45}
                        />
                        {record.OrderProduct.InternalName}
                      </Link>
                      {record.OrderAdditionalDetails &&
                        " - " + record.OrderAdditionalDetails}
                    </TableCell>
                    <TableCell align="right">
                      {/* <InputLabel id="demo-simple-select-label">Размер</InputLabel> */}
                      <Select
                        // labelId="simple-select-label-size"
                        // id="simple-select-label-size"
                        value={record.OrderSize}
                        // label="Размер"
                        onChange={(e) =>
                          onSizeChange(
                            record.OrderRecordId || "",
                            Number(e.target.value)
                          )
                        }
                      >
                        {_.uniq(record.OrderProduct.Sizes).map((x) => (
                          <MenuItem key={x} value={x}>
                            {x.toString()}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell align="right" width={60}>
                      <Input
                        value={record.OrderCount}
                        type="number"
                        onChange={(e) =>
                          onCountChange(
                            record.OrderRecordId || "",
                            parseInt(e.target.value)
                          )
                        }
                      />
                    </TableCell>
                    <TableCell align="right" width={100}>
                      {record.OrderProduct.Price.toFixed(2)} лв.
                    </TableCell>
                    <TableCell align="right" width={100}>
                      {(record.OrderCount * record.OrderProduct.Price).toFixed(
                        2
                      )}{" "}
                      лв.
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={4} align="right">
                    <Typography variant="h6">ОБЩО: </Typography>
                  </TableCell>
                  <TableCell colSpan={2} align="right">
                    <Typography variant="h6">{total.toFixed(2)} лв.</Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item lg={12} md={12} xs={12} mt={2}>
          <CartForm onValidSubmission={onSubmit}></CartForm>
        </Grid>

        {/* <Grid item lg={6} md={6} xs={12}>
            <CartOrderRecord
              OrderProduct={{ InternalName: "asdasd" }}
              OrderCount={0}
              OrderSize={0}
              OrderAdditionalDetails={""}
            />
            асдасд
          </Grid>

          <Grid item lg={6} md={6} xs={12}>
            item 2
          </Grid> */}
      </Grid>{" "}
      {/* container */}
    </React.Fragment>
  );
}
