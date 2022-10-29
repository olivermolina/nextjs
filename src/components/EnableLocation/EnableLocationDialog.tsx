import React from 'react';
import { Dialog } from '@mui/material';
import EnableLocation from './EnableLocation';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleEnableLocation: () => void;
}

export default function EnableLocationDialog({
  open,
  setOpen,
  handleEnableLocation,
}: Props) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} fullScreen sx={{ top: 65 }}>
      <EnableLocation
        handleClose={handleClose}
        handleEnableLocation={handleEnableLocation}
      />
    </Dialog>
  );
}
