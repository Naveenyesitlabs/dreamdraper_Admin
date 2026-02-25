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

export const fetchAllUserByProject = createAsyncThunk(
    "admin/fetchAllUserByProject",
    async (_, { rejectWithValue }) => {
        try {
            await checkLogin()
            const response = await api.getUserByProject();
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const getAllUsersProject = createAsyncThunk(
    "admin/getAllUsersProject",
    async (formData, { rejectWithValue }) => {
        try {
            await checkLogin()
            const response = await api.getAllProjectByUserID(formData);
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

const projectManagerSlice = createSlice({
    name: "projectManager",
    initialState: {
        loading: false,
        error: null,
        allUserByProject: [],
        allProjectWithUser: []
    },
    reducers: {},
    extraReducers: (builder) => {

        builder
            .addCase(fetchAllUserByProject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllUserByProject.fulfilled, (state, action) => {
                state.loading = false;
                console.log("actionrttrtrt", action?.payload?.data);
                state.allUserByProject = action?.payload?.data
                // toast.success(action?.payload?.message)
            })
            .addCase(fetchAllUserByProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                if (action?.payload?.status == 403) {
                    logouterror()
                }
                toast.error(action?.payload?.message)
            });
        builder
            .addCase(getAllUsersProject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllUsersProject.fulfilled, (state, action) => {
                state.loading = false;
                console.log("actionrttrtrt", action?.payload?.data);
                state.allProjectWithUser = action?.payload?.data
                // toast.success(action?.payload?.message)
            })
            .addCase(getAllUsersProject.rejected, (state, action) => {
                state.loading = false;
                console.log("actionrttrtrt", action?.payload?.staus);
                state.error = action.payload || action.error.message;
                if (action?.payload?.status == 403) {
                    logouterror()
                }
                toast.error(action?.payload?.message)
            });
    },
});

export default projectManagerSlice.reducer;