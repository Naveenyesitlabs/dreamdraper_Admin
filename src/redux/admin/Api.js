import axios from 'axios';

// const API = axios.create({
//   baseURL: import.meta.env.VITE_LOCAL_BACKEND_URL,
//   headers: {
//     'Authorization': `Bearer ${JSON.parse(localStorage.getItem("dreamDrapperAminToken"))}`,
//   },
// });

const API = axios.create({
  baseURL: import.meta.env.VITE_LOCAL_BACKEND_URL,
});

API.interceptors.request.use((config) => {
  const token = JSON.parse(localStorage.getItem("dreamDrapperAminToken"));
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const login = (formData) => API.post("/admin/login", formData);

//All Users
export const allUsers = () => API.get("/admin/get-users");
export const statusChange = (formData) => API.post("/admin/update-users-status", formData);
export const userDelete = (formData) => API.post("/admin/delete-users", formData);
export const getAllPlans = () => API.get('/admin/all-plans');
export const updateUserProfile = (formData) => API.post('/admin/update-user', formData);
export const addNewUser = (formData) => API.post('/admin/add-user', formData);

// Library Category And Sub Category 
export const mainCategory = (formData) => API.post("/admin/all-custom-category", formData)
export const addMainCategory = (formData) => API.post("/admin/new-main-category", formData)
export const changeMainCategory = (formData) => API.post("/admin/update-main-category", formData)
export const deleteCustomCategory = (formData) => API.post("/admin/delete-custom-category", formData);
export const changeCateStatus = (formData) => API.post('/admin/update-status', formData)

// Sub-Category 
export const getAllCategoryData = (formData) => API.post("/admin/all-custom-category", formData)
export const addNewSubCategory = (formData) => API.post("/admin/new-sub-category", formData)
export const updateSubCate = (formData) => API.post("/admin/update-sub-category", formData)

// Nested Category
export const getSubCategory = (formData) => API.post("/admin/sub-categorys", formData)
export const newNestedCategory = (formData) => API.post("/admin/add-nested-category", formData)
export const changeNestedCategory = (formData) => API.post("/admin/update-nested-category", formData)

// Sub-Nested Category
export const allNestedCate = (formData) => API.post('/admin/nested-categorys', formData)
export const addNestedCate = (formData) => API.post('/admin/add-sub-nested-category', formData)
export const changeSubNestedCate = (formData) => API.post('/admin/update-sub-nested-category', formData)

// Library Management 
export const getAllSubNested = (formData) => API.post('/admin/sub-nested-categorys', formData);
export const featchAllTemplate = () => API.get('/admin/all-designe');
export const addTemplate = (formData) => API.post('/admin/upload-new-designe', formData)
export const updateTemplate = (formData) => API.post('/admin/update-template', formData)

// project manager
export const getUserByProject = () => API.get('/admin/users')
export const getAllProjectByUserID = (formData) => API.post('/admin/users-project', formData);

//Tutorial & Media
export const getAllTurorialCategory = () => API.get('/admin/all-tutorial-category')
export const newTurorialCategory = (formData) => API.post('/admin/add-tutorial-category', formData)
export const changeTurorialCategory = (formData) => API.post('/admin/update-tutorial-category', formData)
export const getAllTutorails = () => API.get('/admin/all-tutorials')
export const newTutorails = (formData) => API.post('/admin/add-tutorial', formData)
export const changesInTutorails = (formData) => API.post('/admin/update-tutorials', formData)

// Showcases   
export const addNewShowcasesCategory = (formData) => API.post('/admin/add-showcase-category', formData)
export const changeShowcasesCategory = (formData) => API.post('/admin/update-showcase-category', formData)
export const addShowcases = (formData) => API.post('/admin/add-showcases', formData)
export const allShowcases = () => API.get('/admin/get-all-showcase')
export const changeShowcases = (formData) => API.post('/admin/update-showcase', formData)


//Plan Management
export const featchAllPlans = () => API.get('/admin/all-plans')
export const newPlans = (formData) => API.post('/admin/add-plan', formData)
export const chagePlansDaitles = (formData) => API.post('/admin/update-plan', formData)

// Subscribers
export const fetchAllSubscribers = () => API.get('/admin/get-subscribers')
export const deleteSubscriber = (subscription_id) => API.delete(`/admin/delete-subscriber/${subscription_id}`)

// Measuring Forms
export const fetchAllMeasuringForms = () => API.get('/admin/get-forms');
export const addNewMeasuringForms = (formData) => API.post('/admin/new-forms', formData);
export const changeMeasuringForms = (formData) => API.post('/admin/updates-forms', formData);