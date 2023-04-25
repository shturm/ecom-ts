import * as React from 'react';
import ReactDOM from 'react-dom';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';

export interface IInfoModalProps {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    onClose?: () => void
    children?: JSX.Element | Array<JSX.Element>
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

export function InfoModal (props: IInfoModalProps) {

  const close = () => {
    props.setIsOpen(false);
    props.onClose && props.onClose();
  }
  return (
    <React.Fragment>
      <Modal
        open={props.isOpen}
        onClose={close}
      >
        <Box sx={{ ...style, width: 600 }}>
            {props.children}
          <Button variant='outlined' onClick={close} sx={{float: 'right'}}>OK</Button>
        </Box>
      </Modal>
    </React.Fragment>
  );
}
