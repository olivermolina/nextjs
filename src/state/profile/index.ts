import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AppSettings } from '@prisma/client';

export interface UserDetails {
  username: string;
  email: string;
  image: string;
  followers: number;
  following: number;
  showFollowers?: boolean;
  isFirstDeposit?: boolean;
}

interface ProfileModel {
  loading: boolean;
  userDetails?: UserDetails;
  appSettings?: AppSettings[];
}

const initialProfile: ProfileModel = { loading: false };

const profileSlice = createSlice({
  name: 'profile',
  initialState: initialProfile,
  reducers: {
    reset: () => initialProfile,
    setUserDetails(state, action: PayloadAction<UserDetails>) {
      state.userDetails = action.payload;
      return state;
    },
    setAppSettings(state, action: PayloadAction<AppSettings[]>) {
      state.appSettings = action.payload;
      return state;
    },
  },
});

export const { reset, setUserDetails, setAppSettings } = profileSlice.actions;

export default profileSlice.reducer;
