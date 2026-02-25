import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import * as api from "../Api";

function logouterror() {
    toast.error("Token Expired")
    localStorage.removeItem("dreamDrapperAminToken");
    setTimeout(() => {
        window.location.href = "/";
    }, 1000);
}

async function checkLogin() {
    const token = localStorage.getItem("dreamDrapperAminToken");
    console.log("token", token)
    if (!token) {
        console.log("hello object")
        window.location.href = "/";
    }
}

// Async thunk (API call)
export const getAllMeasuring = createAsyncThunk(
    "admin/getAllMeasuring",
    async (_, { rejectWithValue }) => {
        try {
            await checkLogin()
            const response = await api.fetchAllMeasuringForms();
            console.log("response", response)
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const addMeasuring = createAsyncThunk(
    "admin/addMeasuring",
    async (formData, { rejectWithValue }) => {
        try {
            await checkLogin()
            const response = await api.addNewMeasuringForms(formData);
            console.log("response", response)
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateMeasuring = createAsyncThunk(
    "admin/updateMeasuring",
    async (formData, { rejectWithValue }) => {
        try {
            await checkLogin()
            const response = await api.changeMeasuringForms(formData);
            console.log("response", response)
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);



const MeasuringFormsSlice = createSlice({
    name: "MeasuringForms",
    initialState: {
        loading: false,
        error: null,
        allMeasuring: []
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllMeasuring.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllMeasuring.fulfilled, (state, action) => {
                state.allMeasuring = action.payload.data
                state.loading = false;
                // toast.success(action?.payload?.message || "Showcases category updated")
            })
            .addCase(getAllMeasuring.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                if (action?.payload?.status == 403) {
                    logouterror()
                }
                toast.error(action?.payload?.message)
            });
        builder
            .addCase(addMeasuring.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addMeasuring.fulfilled, (state, action) => {
                // state.allMeasuring = action.payload.data
                state.loading = false;
                toast.success(action?.payload?.message || "Measuring form added successfully")
            })
            .addCase(addMeasuring.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                if (action?.payload?.status == 403) {
                    logouterror()
                }
                toast.error(action?.payload?.message)
            });
        builder
            .addCase(updateMeasuring.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateMeasuring.fulfilled, (state, action) => {
                // state.allMeasuring = action.payload.data
                state.loading = false;
                toast.success(action?.payload?.message || "Measuring form updated successfully")
            })
            .addCase(updateMeasuring.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                if (action?.payload?.status == 403) {
                    logouterror()
                }
                toast.error(action?.payload?.message)
            });
    }
})


export default MeasuringFormsSlice.reducer