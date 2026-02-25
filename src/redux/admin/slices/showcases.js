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
export const addShowcasesCategory = createAsyncThunk(
    "admin/addShowcasesCategory",
    async (formData, { rejectWithValue }) => {
        try {
             await checkLogin()
            const response = await api.addNewShowcasesCategory(formData);
            console.log("response", response)
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
export const updateShowcasesCategory = createAsyncThunk(
    "admin/updateShowcasesCategory",
    async (formData, { rejectWithValue }) => {
        try {
             await checkLogin()
            const response = await api.changeShowcasesCategory(formData);
            console.log("response", response)
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
export const getAllShowcases = createAsyncThunk(
    "admin/getAllShowcases",
    async (_, { rejectWithValue }) => {
        try {
             await checkLogin()
            const response = await api.allShowcases();
            console.log("response", response)
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
export const addNewShowcases = createAsyncThunk(
    "admin/addNewShowcases",
    async (formData, { rejectWithValue }) => {
        try {
             await checkLogin()
            const response = await api.addShowcases(formData);
            console.log("response", response)
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateShowcases = createAsyncThunk(
    "admin/updateShowcases",
    async (formData, { rejectWithValue }) => {
        try {
             await checkLogin()
            const response = await api.changeShowcases(formData);
            console.log("response", response)
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


const showcaseSlice = createSlice({
    name: "showcase",
    initialState: {
        loading: false,
        error: null,
        showcasesData: []
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(updateShowcasesCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateShowcasesCategory.fulfilled, (state, action) => {
                state.loading = false;
                toast.success(action?.payload?.message || "Showcases category updated")
            })
            .addCase(updateShowcasesCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                if (action?.payload?.status == 403) {
                    logouterror()
                }
                toast.error(action?.payload?.message)
            });
        builder
            .addCase(addShowcasesCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addShowcasesCategory.fulfilled, (state, action) => {
                state.loading = false;
                toast.success(action?.payload?.message || "Showcases category added")
            })
            .addCase(addShowcasesCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                if (action?.payload?.status == 403) {
                    logouterror()
                }
                toast.error(action?.payload?.message)
            });
        builder
            .addCase(getAllShowcases.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllShowcases.fulfilled, (state, action) => {
                state.loading = false;
                console.log("action", action)
                state.showcasesData = action?.payload?.data
                // toast.success(action?.payload?.message || "Showcases category updated")
            })
            .addCase(getAllShowcases.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                if (action?.payload?.status == 403) {
                    logouterror()
                }
                toast.error(action?.payload?.message)
            });
        builder
            .addCase(addNewShowcases.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addNewShowcases.fulfilled, (state, action) => {
                state.loading = false;
                // console.log("action", action)
                toast.success(action?.payload?.message || "Showcases category added")
            })
            .addCase(addNewShowcases.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                if (action?.payload?.status == 403) {
                    logouterror()
                }
                toast.error(action?.payload?.message)
            });
        builder
            .addCase(updateShowcases.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateShowcases.fulfilled, (state, action) => {
                state.loading = false;
                // console.log("action", action)
                toast.success(action?.payload?.message || "Showcases category updated")
            })
            .addCase(updateShowcases.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                if (action?.payload?.status == 403) {
                    logouterror()
                }
                toast.error(action?.payload?.message)
            });
    },
});

export default showcaseSlice.reducer;