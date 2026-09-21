import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../Api";

export const convertSvg = createAsyncThunk("svgConvert/convert", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.convertSvgImage(formData);
    const contentType = response.headers?.["content-type"] || "image/svg+xml";
    if (response.data instanceof Blob) return { url: URL.createObjectURL(response.data), contentType };
    return { url: response.data?.url || response.data?.data || response.data?.file, contentType };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message || "Unable to convert image");
  }
});

const svgConvertSlice = createSlice({
  name: "svgConvert",
  initialState: { loading: false, error: null, convertedUrl: "", contentType: "image/svg+xml" },
  reducers: {
    clearConversion: (state) => {
      if (state.convertedUrl?.startsWith("blob:")) URL.revokeObjectURL(state.convertedUrl);
      state.convertedUrl = "";
      state.error = null;
    },
  },
  extraReducers: (builder) => builder
    .addCase(convertSvg.pending, (state) => { state.loading = true; state.error = null; })
    .addCase(convertSvg.fulfilled, (state, action) => { state.loading = false; state.convertedUrl = action.payload.url; state.contentType = action.payload.contentType; })
    .addCase(convertSvg.rejected, (state, action) => { state.loading = false; state.error = action.payload || "Unable to convert image"; }),
});

export const { clearConversion } = svgConvertSlice.actions;
export default svgConvertSlice.reducer;
