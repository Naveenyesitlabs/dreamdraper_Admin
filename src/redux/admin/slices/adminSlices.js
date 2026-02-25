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
export const loginAdmin = createAsyncThunk(
    "admin/loginAdmin",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.login(formData);
            console.log("response", response)
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

//Google Login
// export const socialLogin = createAsyncThunk(
//     "user/socialLogin",
//     async (formData, { rejectWithValue }) => {
//         try {
//             const response = await api.socialLoginApi(formData);
//             return response.data;
//         } catch (error) {
//             return rejectWithValue(error.response?.data || error.message);
//         }
//     }
// );

// all users
export const getAllUsers = createAsyncThunk(
    "admin/getAllUsers",
    async (_, { rejectWithValue }) => {
        try {
            await checkLogin()
            const response = await api.allUsers();
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// change user status
export const statusUpdate = createAsyncThunk(
    "admin/statusUpdate",
    async (formData, { rejectWithValue }) => {
        try {
            await checkLogin()
            const response = await api.statusChange(formData);
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Delete User
export const deleteUser = createAsyncThunk(
    "admin/deleteUser",
    async (formData, { rejectWithValue }) => {
        try {
            await checkLogin()
            const response = await api.userDelete(formData);
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const allPlans = createAsyncThunk(
    "admin/allPlans",
    async (_, { rejectWithValue }) => {
        try {
            await checkLogin()
            const response = await api.getAllPlans();
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const updateUser = createAsyncThunk(
    "admin/updateUser",
    async (formData, { rejectWithValue }) => {
        try {
            await checkLogin()
            const response = await api.updateUserProfile(formData);
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const registerUser = createAsyncThunk(
    "admin/registerUser",
    async (formData, { rejectWithValue }) => {
        try {
            await checkLogin()
            const response = await api.addNewUser(formData);
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)


const adminSlice = createSlice({
    name: "admin",
    initialState: {
        userdata: {},
        loading: false,
        error: null,
        loginData: {},
        plans: []
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loginAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.loginData = JSON.stringify(action?.payload?.data);
                // console.log("action", action)
                localStorage.setItem('dreamDrapperAminToken', JSON.stringify(action?.payload?.data?.token))
                toast.success(action?.payload?.message || "Admin logedIn")
            })
            .addCase(loginAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                toast.error(action?.payload?.message)
            });

        // builder
        //     .addCase(socialLogin.pending, (state) => {
        //         state.loading = true;
        //         state.error = null;
        //     })
        //     .addCase(socialLogin.fulfilled, (state, action) => {
        //         state.loading = false;
        //         console.log(action, "action")
        //         localStorage.setItem('dreamDrapperToken', JSON.stringify(action?.payload?.data?.token))
        //         toast.success(action?.payload?.message || "Admin logedIn")
        //     })
        //     .addCase(socialLogin.rejected, (state, action) => {
        //         state.loading = false;
        //         state.error = action.payload || action.error.message;

        //     });
        builder
            .addCase(getAllUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.userdata = action?.payload?.data;
                console.log(action?.payload?.data, "action");
                // toast.success(action?.payload?.message)
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                if (action?.payload?.status == 403) {
                    logouterror()
                }
                console.log(action)
            });

        builder
            .addCase(statusUpdate.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(statusUpdate.fulfilled, (state, action) => {
                state.loading = false;
                state.userdata = action?.payload?.data;
                console.log(action?.payload?.data, "action");
                toast.success(action?.payload?.message)
            })
            .addCase(statusUpdate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                if (action?.payload?.status == 403) {
                    logouterror()
                }
            });

        builder
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.userdata = action?.payload?.data;
                console.log(action?.payload?.data, "action");
                toast.success(action?.payload?.message)
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                if (action?.payload?.status == 403) {
                    logouterror()
                }
                console.log(action)
            });

        builder
            .addCase(allPlans.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(allPlans.fulfilled, (state, action) => {
                state.loading = false;
                state.plans = action?.payload?.data;
                console.log(action?.payload?.data, "action11");
                // toast.success(action?.payload?.message)
            })
            .addCase(allPlans.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                if (action?.payload?.status == 403) {
                    logouterror()
                }
                console.log(action)
            });

        builder
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                console.log(action?.payload?.data, "action11");
                toast.success(action?.payload?.message)
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                if (action?.payload?.status == 403) {
                    logouterror()
                }
                console.log(action, "updateUser")
            });

        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                console.log(action?.payload?.data, "registerUser");
                toast.success(action?.payload?.message)
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                if (action?.payload?.status == 403) {
                    logouterror()
                }
                console.log(action, "registerUser")
            });

    },
});

export default adminSlice.reducer;
