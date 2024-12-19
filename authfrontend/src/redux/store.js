import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slice/userSlice";
import authReducer from "../slice/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    data: userReducer,
  },
});
