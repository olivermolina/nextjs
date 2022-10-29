import React from 'react';
import { Backdrop, CircularProgress } from '@mui/material';

interface Props {
  open: boolean;
}

const BackdropLoading = (props: Props) => {
  return (
    <Backdrop sx={{ color: '#fff', zIndex: 12000 }} open={props.open}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default BackdropLoading;
