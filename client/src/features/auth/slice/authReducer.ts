import type { EmployeeResponse } from "@/entities/employee/types/apiTypes";
import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

type AuthContext = {
  projectRole?: string[];
};

type AuthState = {
  user: EmployeeResponse | null;
  context: AuthContext;
};
const initialState: AuthState = {
  user: null,
  context: {},
};

const authSlice = createSlice({
  reducerPath: "auth",
  name: "auth",
  initialState,
  reducers: {
    initialize: (state, action: PayloadAction<EmployeeResponse>) => {
      state.user = action.payload;
    },
    attachContext: (state, action: PayloadAction<AuthContext>) => {
      state.context = action.payload;
    },
  },
});

export const { initialize, attachContext } = authSlice.actions;
export default authSlice.reducer;
