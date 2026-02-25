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


export const getCategory = createAsyncThunk(
    "admin/getCategory",
    async (formData, { rejectWithValue }) => {
        try {
            await checkLogin()
            const response = await api.mainCategory(formData);
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const addCategory = createAsyncThunk(
    "admin/addCategory",
    async (formData, { rejectWithValue }) => {
        try {
            await checkLogin()
            const response = await api.addMainCategory(formData);
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const UpdateCategory = createAsyncThunk(
    "admin/UpdateCategory",
    async (formData, { rejectWithValue }) => {
        try {
            await checkLogin()
            const response = await api.changeMainCategory(formData);
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const deleteDate = createAsyncThunk(
    "admin/deleteDate",
    async (formData, { rejectWithValue }) => {
        try {
            await checkLogin()
            const response = await api.deleteCustomCategory(formData);
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)
// Sub-Category
export const allCategory = createAsyncThunk(
    "admin/allCategory",
    async (formData, { rejectWithValue }) => {
        try {
            await checkLogin()
            const response = await api.getAllCategoryData(formData);
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const addSubCategory = createAsyncThunk(
    "admin/addSubCategory",
    async (formData, { rejectWithValue }) => {
        try {
            await checkLogin()
            const response = await api.addNewSubCategory(formData);
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const updateSubCategory = createAsyncThunk(
    "admin/updateSubCategory",
    async (formData, { rejectWithValue }) => {
        try {
            await checkLogin()
            const response = await api.updateSubCate(formData);
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)


// Nested Category
export const allSubCategory = createAsyncThunk(
    "admin/allSubCategory",
    async (formData, { rejectWithValue }) => {
        try {
            await checkLogin()
            const response = await api.getSubCategory(formData);
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const addNestedCategory = createAsyncThunk(
    "admin/addNestedCategory",
    async (formData, { rejectWithValue }) => {
        try {
            await checkLogin()
            const response = await api.newNestedCategory(formData);
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const updateNestedCategory = createAsyncThunk(
    "admin/updateNestedCategory",
    async (formData, { rejectWithValue }) => {
        try {
            await checkLogin()
            const response = await api.changeNestedCategory(formData);
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Sub-Nested-Category
export const getAllNestedCategory = createAsyncThunk(
    "admin/getAllNestedCategory",
    async (formData, { rejectWithValue }) => {
        try {
            await checkLogin()
            const response = await api.allNestedCate(formData);
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const addSubNestedCategory = createAsyncThunk(
    "admin/addSubNestedCategory",
    async (formData, { rejectWithValue }) => {
        try {
            await checkLogin()
            const response = await api.addNestedCate(formData);
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateSubNestedCategory = createAsyncThunk(
    "admin/updateSubNestedCategory",
    async (formData, { rejectWithValue }) => {
        try {
            await checkLogin()
            const response = await api.changeSubNestedCate(formData);
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const activeInActiveCategories = createAsyncThunk(
    "admin/activeInActiveCategories",
    async (formData, { rejectWithValue }) => {
        try {
            await checkLogin()
            const response = await api.changeCateStatus(formData);
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Library Management
export const getSubNestedCate = createAsyncThunk(
    "admin/getSubNestedCate",
    async (formData, { rejectWithValue }) => {
        try {
            await checkLogin()
            const response = await api.getAllSubNested(formData);
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getAllTemplate = createAsyncThunk(
    "admin/getAllTemplate",
    async (_, { rejectWithValue }) => {
        try {
            await checkLogin()
            const response = await api.featchAllTemplate();
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const addNewTemplate = createAsyncThunk(
    "admin/addNewTemplate",
    async (formData, { rejectWithValue }) => {
        try {
            await checkLogin()
            const response = await api.addTemplate(formData);
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateTemplateDesigne = createAsyncThunk(
    "admin/updateTemplateDesigne",
    async (formData, { rejectWithValue }) => {
        try {
            await checkLogin()
            const response = await api.updateTemplate(formData);
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);



const libraryCategorySlice = createSlice({
    name: "libraryCategory",
    initialState: {
        loading: false,
        error: null,
        mainCategoryData: [],
        allTemplate: []
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.mainCategoryData = action?.payload?.data
                // toast.success(action?.payload?.message)
            })
            .addCase(getCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                if (action?.payload?.status == 403) {
                    logouterror()
                }
                toast.error(action?.payload?.message)
            });

        builder
            .addCase(addCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addCategory.fulfilled, (state, action) => {
                state.loading = false;
                console.log("action", action?.payload?.data);
                toast.success(action?.payload?.message)
            })
            .addCase(addCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                if (action?.payload?.status == 403) {
                    logouterror()
                }
                toast.error(action?.payload?.message)
            });

        builder
            .addCase(UpdateCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(UpdateCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.loginData = JSON.stringify(action?.payload?.data)
                console.log("action", action?.payload?.data);
                toast.success(action?.payload?.message)
            })
            .addCase(UpdateCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                if (action?.payload?.status == 403) {
                    logouterror()
                }
                toast.error(action?.payload?.message)
            });

        builder
            .addCase(deleteDate.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteDate.fulfilled, (state, action) => {
                state.loading = false;
                console.log("action", action?.payload?.data);
                toast.success(action?.payload?.message)
            })
            .addCase(deleteDate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                if (action?.payload?.status == 403) {
                    logouterror()
                }
                toast.error(action?.payload?.message)
            });

        builder
            .addCase(allCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(allCategory.fulfilled, (state, action) => {
                state.loading = false;
                // console.log("action", action?.payload?.data);
                // toast.success(action?.payload?.message)
            })
            .addCase(allCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                if (action?.payload?.status == 403) {
                    logouterror()
                }
                toast.error(action?.payload?.message)
            });

        builder
            .addCase(addSubCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addSubCategory.fulfilled, (state, action) => {
                state.loading = false;
                console.log("action", action?.payload?.data);
                toast.success(action?.payload?.message)
            })
            .addCase(addSubCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                if (action?.payload?.status == 403) {
                    logouterror()
                }
                toast.error(action?.payload?.message)
            });

        builder
            .addCase(updateSubCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateSubCategory.fulfilled, (state, action) => {
                state.loading = false;
                console.log("action", action?.payload?.data);
                toast.success(action?.payload?.message)
            })
            .addCase(updateSubCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                if (action?.payload?.status == 403) {
                    logouterror()
                }
                toast.error(action?.payload?.message)
            });

        builder
            .addCase(allSubCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(allSubCategory.fulfilled, (state, action) => {
                state.loading = false;
                // console.log("action", action?.payload?.data);
                // toast.success(action?.payload?.message)
            })
            .addCase(allSubCategory.rejected, (state, action) => {
                state.loading = false;
                console.log(action, "action")
                state.error = action.payload || action.error.message;
                if (action?.payload?.status == 403) {
                    logouterror()
                }
                toast.error(action?.payload?.message)
            });

        builder
            .addCase(addNestedCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addNestedCategory.fulfilled, (state, action) => {
                state.loading = false;
                console.log("action", action?.payload?.data);
                toast.success(action?.payload?.message)
            })
            .addCase(addNestedCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                if (action?.payload?.status == 403) {
                    logouterror()
                }
                toast.error(action?.payload?.message)
            });

        builder
            .addCase(updateNestedCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateNestedCategory.fulfilled, (state, action) => {
                state.loading = false;
                console.log("action", action?.payload?.data);
                toast.success(action?.payload?.message)
            })
            .addCase(updateNestedCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                if (action?.payload?.status == 403) {
                    logouterror()
                }
                toast.error(action?.payload?.message)
            });

        builder
            .addCase(getAllNestedCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllNestedCategory.fulfilled, (state, action) => {
                state.loading = false;
                // toast.success(action?.payload?.message)
            })
            .addCase(getAllNestedCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                if (action?.payload?.status == 403) {
                    logouterror()
                }
                toast.error(action?.payload?.message)
            });
        builder
            .addCase(addSubNestedCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addSubNestedCategory.fulfilled, (state, action) => {
                state.loading = false;
                console.log("action", action?.payload?.data);
                toast.success(action?.payload?.message)
            })
            .addCase(addSubNestedCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                if (action?.payload?.status == 403) {
                    logouterror()
                }
                toast.error(action?.payload?.message)
            });

        builder
            .addCase(updateSubNestedCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateSubNestedCategory.fulfilled, (state, action) => {
                state.loading = false;
                console.log("action", action?.payload?.data);
                toast.success(action?.payload?.message)
            })
            .addCase(updateSubNestedCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                if (action?.payload?.status == 403) {
                    logouterror()
                }
                toast.error(action?.payload?.message)
            });
        builder
            .addCase(getSubNestedCate.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSubNestedCate.fulfilled, (state, action) => {
                state.loading = false;
                console.log("action", action?.payload?.data);
                // toast.success(action?.payload?.message)
            })
            .addCase(getSubNestedCate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                if (action?.payload?.status == 403) {
                    logouterror()
                }
                toast.error(action?.payload?.message)
            });

        builder
            .addCase(getAllTemplate.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllTemplate.fulfilled, (state, action) => {
                state.loading = false;
                console.log("action", action?.payload?.data);
                state.allTemplate = action?.payload?.data
                // toast.success(action?.payload?.message)
            })
            .addCase(getAllTemplate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                if (action?.payload?.status == 403) {
                    logouterror()
                }
                toast.error(action?.payload?.message)
            });

        builder
            .addCase(activeInActiveCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(activeInActiveCategories.fulfilled, (state, action) => {
                state.loading = false;
                console.log("action", action?.payload?.data);
                toast.success(action?.payload?.message)
            })
            .addCase(activeInActiveCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                if (action?.payload?.status == 403) {
                    logouterror()
                }
                toast.error(action?.payload?.message)
            });

        builder
            .addCase(addNewTemplate.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addNewTemplate.fulfilled, (state, action) => {
                state.loading = false;
                console.log("action", action?.payload?.data);
                toast.success(action?.payload?.message)
            })
            .addCase(addNewTemplate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                if (action?.payload?.status == 403) {
                    logouterror()
                }
                toast.error(action?.payload?.message)
            });

        builder
            .addCase(updateTemplateDesigne.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTemplateDesigne.fulfilled, (state, action) => {
                state.loading = false;
                console.log("action", action?.payload?.data);
                toast.success(action?.payload?.message)
            })
            .addCase(updateTemplateDesigne.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                if (action?.payload?.status == 403) {
                    logouterror()
                }
                toast.error(action?.payload?.message)
            });
    },
});

export default libraryCategorySlice.reducer;