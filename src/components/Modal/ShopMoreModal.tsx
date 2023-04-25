import * as React from "react";
import ReactDOM from "react-dom";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

export interface IShopMoreModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onClose?: () => void;
  children?: JSX.Element | Array<JSX.Element>;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

export function ShopMoreModal(props: IShopMoreModalProps) {
  const navigate = useNavigate();
  const close = () => {
    props.setIsOpen(false);
    props.onClose && props.onClose();
  };

  return (
    <React.Fragment>
      <Modal open={props.isOpen} onClose={close}>
        <Box sx={{ ...style, width: 600 }}>
          <h2>Артикулът е добавен в количката</h2>
          <p>
            Желаете ли да продължите ли да продължите пазаруването или да
            завършите поръчката ?
          </p>
          {props.children}
          <Box>
            <Button
              variant="outlined"
              color="success"
              sx={{ float: "left" }}
              onClick={() => navigate("/cart")}
            >
              Завърши поръчката
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              sx={{ float: "right" }}
              onClick={close}
            >
              Продължи пазаруването
            </Button>
          </Box>
        </Box>
      </Modal>
    </React.Fragment>
  );
}
