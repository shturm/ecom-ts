import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";

import * as React from "react";
import storage from "../../data/storage";

export interface ICartForm {
  name: string;
  phone: string;
  email: string;
  address: string;
  additionalDetails: string;
  paymentMethod: string;
}

export interface ICartFormProps {
  onValidSubmission: (form: ICartForm) => void;
}

export function CartForm(props: ICartFormProps) {
  const cartForm = storage.get("cartForm") as ICartForm;
  const [name, setName] = React.useState<string>(cartForm?.name);
  const [nameHelperText, setNameHelperText] = React.useState<string>();
  const [nameError, setNameError] = React.useState(false);
  const validateName = () => {
    if (name?.trim()) {
      setNameError(false);
      setNameHelperText("");
      return true;
    }
    setNameHelperText("Задължително поле");
    setNameError(true);
    return false;
  };
  const onNameBlur = () => validateName();

  const [phone, setPhone] = React.useState<string>(cartForm?.phone);
  const [phoneHelperText, setPhoneHelperText] = React.useState<string>();
  const [phoneError, setPhoneError] = React.useState(false);
  const validatePhone = () => {
    if (phone?.trim()) {
      setPhoneError(false);
      setPhoneHelperText("");
      return true;
    }
    setPhoneHelperText("Задължително поле");
    setPhoneError(true);
    return false;
  };
  const onPhoneBlur = () => validatePhone();

  const [email, setEmail] = React.useState<string>(cartForm?.email);
  const [emailHelperText, setEmailHelperText] = React.useState<string>();
  const [emailError, setEmailError] = React.useState(false);
  const validateEmail = () => {
    if (email?.trim()) {
      setEmailError(false);
      setEmailHelperText("");
      return true;
    }
    setEmailHelperText("Задължително поле");
    setEmailError(true);
    return false;
  };
  const onEmailBlur = () => validateEmail();

  const [address, setAddress] = React.useState(cartForm?.address);
  const [addressHelperText, setAddressHelperText] = React.useState<string>();
  const [addressError, setAddressError] = React.useState(false);
  const validateAddress = () => {
    if (address?.trim()) {
      setAddressError(false);
      setAddressHelperText("");
      return true;
    }
    setAddressHelperText("Задължително поле");
    setAddressError(true);
    return false;
  };
  const onAddressBlur = () => validateAddress();

  const [additionalDetails, setAdditionalDetails] = React.useState(
    cartForm?.additionalDetails
  );

  const [paymentMethod, setPaymentMethod] = React.useState(
    cartForm?.paymentMethod
  );

  const onNameChange = (val: string) => setName(val);
  const onPhoneChange = (val: string) => setPhone(val);
  const onEmailChange = (val: string) => setEmail(val);
  const onAddressChange = (val: string) => setAddress(val);
  const onAdditionalDetailsChange = (val: string) => setAdditionalDetails(val);
  const onPaymentMethodChange = (val: string) => setPaymentMethod(val);

  const onSubmit = () => {
    if (!validateForm()) return;
    const data = {
      name,
      phone,
      email,
      address,
      additionalDetails,
      paymentMethod,
    } as ICartForm;
    storage.set("cartForm", data);
    props.onValidSubmission(data);
  };

  const validateForm = () => {
    if (!validateName()) return false;
    if (!validatePhone()) return false;
    if (!validateEmail()) return false;
    if (!validateAddress()) return false;

    return true;
  };

  const addressPlaceholder = [
    "Град",
    "Улица и номер",
    "Блок",
    "Вход",
    "Етаж",
    "Апартамент/Офис",
  ].join("\n");
  const additionalDetailsPlaceholder = [
    "Особеност на адреса",
    "Данни за фактура",
    "Допълнителни данни за контакт",
  ].join("\n");

  return (
    <React.Fragment>
      <Box
        component={"form"}
        sx={{
          "& .MuiTextField-root": { m: 1 /*width: "30ch"*/ },
        }}
        noValidate
        autoComplete="off"
      >
        <fieldset>
          <legend>Получател</legend>
          <Grid container spacing={1}>
            <Grid item lg={6}>
              <TextField
                label="Получзтел"
                variant="outlined"
                placeholder="Три имена"
                fullWidth
                error={nameError}
                helperText={nameHelperText}
                value={name}
                onBlur={onNameBlur}
                onChange={(e) => onNameChange(e.target.value)}
                required
              />
              <TextField
                label="Телефон"
                variant="outlined"
                placeholder="Телефон"
                fullWidth
                error={phoneError}
                helperText={phoneHelperText}
                value={phone}
                onBlur={onPhoneBlur}
                onChange={(e) => onPhoneChange(e.target.value)}
                required
              />
              <TextField
                label="Електронен адрес"
                variant="outlined"
                placeholder="Email"
                type="email"
                fullWidth
                error={emailError}
                helperText={emailHelperText}
                value={email}
                onBlur={onEmailBlur}
                onChange={(e) => onEmailChange(e.target.value)}
                required
              />
            </Grid>
            <Grid item lg={5}>
              <TextField
                label="Адрес"
                variant="outlined"
                placeholder={addressPlaceholder}
                fullWidth={true}
                multiline={true}
                minRows={3}
                error={addressError}
                helperText={addressHelperText}
                value={address}
                onBlur={onAddressBlur}
                onChange={(e) => onAddressChange(e.target.value)}
                required
              />
              <TextField
                label="Допълнителни инструкции"
                variant="outlined"
                placeholder={additionalDetailsPlaceholder}
                fullWidth={true}
                multiline={true}
                minRows={6}
                value={additionalDetails}
                onChange={(e) => onAdditionalDetailsChange(e.target.value)}
              />
            </Grid>
          </Grid>
        </fieldset>

        <fieldset>
          <legend>Плащане</legend>
          <FormControl>
            <FormLabel id="payway-label">Начин на плащане</FormLabel>
            <RadioGroup
              aria-labelledby="payway-label"
              defaultValue="cashOnDelivery"
              name="payway"
              value={paymentMethod}
              onChange={(e) => onPaymentMethodChange(e.target.value)}
            >
              <FormControlLabel
                value="cashOnDelivery"
                control={<Radio />}
                label="Наложен платеж"
              />
              <FormControlLabel
                value="iban"
                control={<Radio />}
                label="Банков път"
              />
            </RadioGroup>
          </FormControl>
          {paymentMethod == "iban" && (
            <>
              <p>IBAN:</p>
              <p>Основание: (името на получателя)</p>
            </>
          )}
          {/* <fieldset>
            <legend>Фактура</legend>
          </fieldset> */}
        </fieldset>

        <Button
          variant="outlined"
          color="success"
          size="large"
          sx={{ fontSize: 24 }}
          onClick={onSubmit}
          //   type="submit"
        >
          Поръчай
        </Button>
      </Box>
    </React.Fragment>
  );
}
