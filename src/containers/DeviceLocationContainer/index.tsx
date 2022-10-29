import React, { Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import { IDeviceGPS } from '~/lib/tsevo-gidx/GIDX';
import {
  GeolocationPermissionStatus,
  getGeolocationPermissionStatus,
} from '~/utils/getGeolocationPermissionStatus';
import EnableLocationDialog from '~/components/EnableLocation/EnableLocationDialog';

interface Props {
  deviceGPS: IDeviceGPS;
  setDeviceGPS: Dispatch<SetStateAction<IDeviceGPS>>;
  openLocationDialog: boolean;
  setOpenLocationDialog: Dispatch<SetStateAction<boolean>>;
}

const DeviceLocationContainer = (props: Props) => {
  const { deviceGPS, setDeviceGPS, setOpenLocationDialog, openLocationDialog } =
    props;

  const onSetDeviceGPS = () => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setDeviceGPS({
        Latitude: position.coords.latitude,
        Longitude: position.coords.longitude,
      });
    });
  };

  const handleEnableLocation = () => {
    onSetDeviceGPS();
    setOpenLocationDialog(false);
  };

  const locationPermissionCallback = useCallback(async () => {
    const permissionStatus = await getGeolocationPermissionStatus();
    const isGranted = permissionStatus === GeolocationPermissionStatus.GRANTED;
    setOpenLocationDialog(!isGranted);
    if (isGranted) onSetDeviceGPS();
  }, [deviceGPS]);

  useEffect(() => {
    locationPermissionCallback();
  }, []);

  return (
    <EnableLocationDialog
      open={openLocationDialog}
      setOpen={setOpenLocationDialog}
      handleEnableLocation={handleEnableLocation}
    />
  );
};

export default DeviceLocationContainer;
