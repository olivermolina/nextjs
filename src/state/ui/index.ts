import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface UIModel {
  loading: boolean;
  /**
   * When a number is present will show a modal that will load contest data and allow a user to join.
   */
  activeContestDetailModal?: string;
}

const initialUI: UIModel = {
  loading: false,
  activeContestDetailModal: undefined,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState: initialUI,
  reducers: {
    setLoading(state, payload: PayloadAction<boolean>) {
      state.loading = payload.payload;
    },
    reset: () => initialUI,
    setActiveContestDetailModal(state, payload: PayloadAction<string>) {
      state.activeContestDetailModal = payload.payload;
      return state;
    },
  },
});

export const { setLoading, reset, setActiveContestDetailModal } =
  uiSlice.actions;

export default uiSlice.reducer;
