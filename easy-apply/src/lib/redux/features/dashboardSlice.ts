import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type DashboardView = 'find' | 'saved';

interface DashboardState {
  currentView: DashboardView;
}

const initialState: DashboardState = {
  currentView: 'find',
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setView: (state, action: PayloadAction<DashboardView>) => {
      state.currentView = action.payload;
    },
  },
});

export const { setView } = dashboardSlice.actions;
export default dashboardSlice.reducer; 