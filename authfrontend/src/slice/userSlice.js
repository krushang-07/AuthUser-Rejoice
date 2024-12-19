import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstance";

export const fetchData = createAsyncThunk(
  "data/fetchData",
  async ({ id, username }) => {
    try {
      const url = "/users";

      const queryParams = {};
      if (id) queryParams.id = id;
      if (username) queryParams.username = username;

      const response = await axiosInstance.get(url, {
        params: queryParams,
      });
      console.log(response);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch data");
    }
  }
);

const userSlice = createSlice({
  name: "data",
  initialState: {
    data: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload || [];
        // console.log(state.data);
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;
