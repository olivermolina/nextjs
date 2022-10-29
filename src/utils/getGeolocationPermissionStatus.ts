export enum GeolocationPermissionStatus {
  DENIED = 'denied',
  GRANTED = 'granted',
  PROMPT = 'prompt',
}

/**
 * Checks the status of the geolocation permission asynchronously.
 *
 * Returns the permission status: `'denied'`, `'granted'`, or `'prompt'`.
 *
 * Includes a fallback for browsers which do not support the Web Permissions API.
 */
export async function getGeolocationPermissionStatus(): Promise<
  'denied' | 'granted' | 'prompt'
> {
  if ('permissions' in navigator) {
    return (await navigator.permissions.query({ name: 'geolocation' })).state;
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      // successfully got location
      () => resolve(GeolocationPermissionStatus.GRANTED),
      (error) => {
        // permission denied
        if (error.code == error.PERMISSION_DENIED)
          resolve(GeolocationPermissionStatus.DENIED);

        // some other error, but not one which is related to a denied permission
        resolve(GeolocationPermissionStatus.GRANTED);
      },
      {
        maximumAge: Infinity,
        timeout: 0,
      },
    );
  });
}
