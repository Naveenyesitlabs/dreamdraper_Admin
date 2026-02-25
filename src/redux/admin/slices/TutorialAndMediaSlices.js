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
    if (!token) {
        window.location.href = "/";
    }
}


export const fetchAllCategory = createAsyncThunk(
    "admin/fetchAllCategory",
    async (_, { rejectWithValue }) => {
        try {
            await checkLogin()
            const response = await api.getAllTurorialCategory();
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const addNewCategory = createAsyncThunk(
    "admin/addNewCategory",
    async (formData, { rejectWithValue }) => {
        try {
            await checkLogin()
            const response = await api.newTurorialCategory(formData);
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const updateCategory = createAsyncThunk(
    "admin/updateCategory",
    async (formData, { rejectWithValue }) => {
        try {
            await checkLogin()
            const response = await api.changeTurorialCategory(formData);
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const fetchAllTutorails = createAsyncThunk(
    "admin/fetchAllTutorails",
    async (_, { rejectWithValue }) => {
        try {
            await checkLogin()
            const response = await api.getAllTutorails();
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const addNewTutorails = createAsyncThunk(
    "admin/addNewTutorails",
    async (formData, { rejectWithValue }) => {
        try {
            await checkLogin()
            const response = await api.newTutorails(formData);
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const updateTutorails = createAsyncThunk(
    "admin/updateTutorails",
    async (formData, { rejectWithValue }) => {
        try {
            await checkLogin()
            const response = await api.changesInTutorails(formData);
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

const TutorialAndMediaSlice = createSlice({
    name: "TutorialAndMedia",
    initialState: {
        loading: false,
        error: null,
        allCategory: [],
        allTutorails: []
    },
    reducers: {},
    extraReducers: (builder) => {

        builder
            .addCase(fetchAllCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllCategory.fulfilled, (state, action) => {
                state.loading = false;
                // console.log("actionrttrtrt", action?.payload?.data);
                state.allCategory = action?.payload?.data
                // toast.success(action?.payload?.message)
            })
            .addCase(fetchAllCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                if (action?.payload?.status == 403) {
                    logouterror()
                }
                toast.error(action?.payload?.message)
            });

        builder
            .addCase(addNewCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addNewCategory.fulfilled, (state, action) => {
                state.loading = false;
                // console.log("actionrttrtrt", action?.payload?.data);
                toast.success(action?.payload?.message)
            })
            .addCase(addNewCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                if (action?.payload?.status == 403) {
                    logouterror()
                }
                toast.error(action?.payload?.message)
            });

        builder
            .addCase(updateCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                state.loading = false;
                // console.log("actionrttrtrt", action?.payload?.data);
                toast.success(action?.payload?.message)
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                if (action?.payload?.status == 403) {
                    logouterror()
                }
                toast.error(action?.payload?.message)
            });

        builder
            .addCase(fetchAllTutorails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllTutorails.fulfilled, (state, action) => {
                state.loading = false;
                // console.log("actionrttrtrt", action?.payload?.data);
                state.allTutorails = action?.payload?.data
                // toast.success(action?.payload?.message)
            })
            .addCase(fetchAllTutorails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                if (action?.payload?.status == 403) {
                    logouterror()
                }
                toast.error(action?.payload?.message)
            });
        builder
            .addCase(addNewTutorails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addNewTutorails.fulfilled, (state, action) => {
                state.loading = false;
                // console.log("actionrttrtrt", action?.payload?.data);
                toast.success(action?.payload?.message)
            })
            .addCase(addNewTutorails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                if (action?.payload?.status == 403) {
                    logouterror()
                }
                toast.error(action?.payload?.message)
            });
    }
});

export default TutorialAndMediaSlice.reducer;