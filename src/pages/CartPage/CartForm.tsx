import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import * as React from "react";

export interface ICartFormProps {}

export function CartForm(props: ICartFormProps) {
  const addressPlaceholder = [
    "Град",
    "Улица и номер",
    "Блок",
    "Вход",
    "Етаж",
    "Апартамент/Офис",
  ].join("\n");
  return (
    <React.Fragment>
      <Box
        component={"form"}
        sx={{
          "& .MuiTextField-root": { m: 1, width: "30ch" },
        }}
        noValidate
        autoComplete="off"
      >
        <fieldset>
          <legend>Получател</legend>
          <TextField
            label="Получзтел"
            variant="outlined"
            placeholder="Три имена"
            
          />
          <TextField
            label="Телефон"
            variant="outlined"
            placeholder="Телефон"
            
          />
          <TextField
            label="Електронен адрес"
            variant="outlined"
            placeholder="Email"
            type="email"
            
          />
          <TextField
            label="Адрес"
            variant="outlined"
            placeholder={addressPlaceholder}
            fullWidth={true}
            multiline={true}
            minRows={3}
          />
          <TextField
            label="Допълнителни инструкции"
            variant="outlined"
            placeholder={'Допълнителни инструкции'}
            fullWidth={true}
            multiline={true}
            minRows={6}
          />
        </fieldset>

        <fieldset>
          <legend>Плащане</legend>
          <FormControl>
            <FormLabel id="payway-label">Начин на плащане</FormLabel>
            <RadioGroup
              aria-labelledby="payway-label"
              defaultValue="cashOnDelivery"
              name="payway"
              // value={'iban'}
            >
              <FormControlLabel
                value="cashOnDelivery"
                control={<Radio />}
                label="Наложен платеж"
              />
              {/* <FormControlLabel
                value="iban"
                control={<Radio />}
                label="Банков път"
              /> */}
            </RadioGroup>
          </FormControl>
          {/* <fieldset>
            <legend>Фактура</legend>
          </fieldset> */}
        </fieldset>

        <Button
          variant="outlined"
          color="success"
          size="large"
          sx={{ fontSize: 24 }}
        >
          Поръчай
        </Button>
      </Box>
    </React.Fragment>
  );
}
