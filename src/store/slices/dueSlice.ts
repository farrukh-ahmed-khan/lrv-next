import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchDue = createAsyncThunk("due/fetchDue", async (_, thunkAPI) => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axios.get("/api/dues/get", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response.data)

    return response.data.due;
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";
    return thunkAPI.rejectWithValue(message);
  }
});

interface DueState {
  due: any;
  loading: boolean;
  error: string | null;
}

const initialState: DueState = {
  due: null,
  loading: false,
  error: null,
};

const dueSlice = createSlice({
  name: "due",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDue.fulfilled, (state, action) => {
        state.loading = false;
        state.due = action.payload;
      })
      .addCase(fetchDue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default dueSlice.reducer;
