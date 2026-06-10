import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../Api";
import { toast } from "react-toastify";

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
export const getPlans = createAsyncThunk(
    "admin/getAllPlans",
    async (_, { rejectWithValue }) => {
        try {
             await checkLogin()
            const response = await api.featchAllPlans();
            console.log("response", response)
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const addNewPlans = createAsyncThunk(
    "admin/addNewPlans",
    async (formData, { rejectWithValue }) => {
        try {
             await checkLogin()
            const response = await api.newPlans(formData);
            console.log("response", response)
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updatePlansDaitls = createAsyncThunk(
    "admin/updatePlansDaitls",
    async (formData, { rejectWithValue }) => {
        try {
             await checkLogin()
            const response = await api.chagePlansDaitles(formData);
            console.log("response", response)
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const removePlan = createAsyncThunk(
    "admin/removePlan",
    async (formData, { rejectWithValue }) => {
        try {
             await checkLogin()
            const response = await api.deletePlans(formData);
            console.log("response", response)
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const plansSlice = createSlice({
    name: "plans",
    initialState: {
        loading: false,
        error: null,
        allPlans: []
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getPlans.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPlans.fulfilled, (state, action) => {
                state.allPlans = action.payload.data
                state.loading = false;
                // toast.success(action?.payload?.message || "Showcases category updated")
            })
            .addCase(getPlans.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                if (action?.payload?.status == 403) {
                    logouterror()
                }
                toast.error(action?.payload?.message)
            });
        builder
            .addCase(addNewPlans.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addNewPlans.fulfilled, (state, action) => {
                // state.allPlans = action.payload.data
                state.loading = false;
                toast.success(action?.payload?.message || "Plan added successfully")
            })
            .addCase(addNewPlans.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                if (action?.payload?.status == 403) {
                    logouterror()
                }
                toast.error(action?.payload?.message)
            });
        builder
            .addCase(updatePlansDaitls.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePlansDaitls.fulfilled, (state, action) => {
                // state.allPlans = action.payload.data
                state.loading = false;
                toast.success(action?.payload?.message || "Plan updated successfully")
            })
            .addCase(updatePlansDaitls.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                if (action?.payload?.status == 403) {
                    logouterror()
                }
                toast.error(action?.payload?.message)
            });
        builder
            .addCase(removePlan.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removePlan.fulfilled, (state, action) => {
                state.loading = false;
                toast.success(action?.payload?.message || "Plan deleted successfully")
            })
            .addCase(removePlan.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                if (action?.payload?.status == 403) {
                    logouterror()
                }
                toast.error(action?.payload?.message)
            });
    }
})


export default plansSlice.reducer
