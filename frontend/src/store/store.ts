import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "@/store/service/rtk-service";
import authReducer from "@/store/slices/auth/auth.slice";
import dashboardReducer from "@/store/slices/dashboard/dashboard.slice";
import noticeboardReducer from "./slices/noticeboard/noticeboard.slice";
import subjectReducer from "./slices/subject/subject.slice";
import downloadReducer from "./slices/download/download.slice";
import attendanceReducer from "./slices/attendance/attendance.slice";
import examReducer from "./slices/examSchedule/examSchedule.slice";

export const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
        auth: authReducer,
        attendance: attendanceReducer,
        dashboard: dashboardReducer,
        noticeboard: noticeboardReducer,
        subjects: subjectReducer,
        downloadCenter: downloadReducer,
        exam: examReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
})
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
