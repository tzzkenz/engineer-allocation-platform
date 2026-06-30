import type { EmployeeResponse } from "@/entities/employee/types/apiTypes";
import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

type AuthState = {
  user: EmployeeResponse | null;
};
const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  reducerPath: "auth",
  name: "auth",
  initialState,
  reducers: {
    initialize: (state, action: PayloadAction<EmployeeResponse>) => {
      state.user = action.payload;
    },
  },
});

export const { initialize } = authSlice.actions;
export default authSlice.reducer;
