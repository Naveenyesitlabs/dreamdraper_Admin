import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "./slices/adminSlices";
import libraryReducer from './slices/libraryCategorySlice'
import projectReducer from './slices/projectManagemetSlice'
import TutorialAndMediaReducer from './slices/TutorialAndMediaSlices'
import showcasesReducer from './slices/showcases'
import plansReducer from './slices/planSlices'
import subscriberReducer from './slices/subscriberSlice'
import MeasuringFormsReducer from './slices/measuringFormsSlices'

export const store = configureStore({
  reducer: {
    user: adminReducer,
    libCategory: libraryReducer,
    project: projectReducer,
    TutorialAndMedia: TutorialAndMediaReducer,
    showcase: showcasesReducer,
    plans: plansReducer,
    subscriber: subscriberReducer,
    MeasuringForms: MeasuringFormsReducer
  },
});