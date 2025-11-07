import { api } from "@/store/service/rtk-service";
import attendanceReducer from "./slices/attendance/attendance.slice";
import authReducer from "@/store/slices/auth/auth.slice";
import { configureStore } from "@reduxjs/toolkit";
import dashboardReducer from "@/store/slices/dashboard/dashboard.slice";
import diaryReducer from "./slices/diary/diary.slice";
import downloadReducer from "./slices/download/download.slice";
import examReducer from "./slices/examSchedule/examSchedule.slice";
import liveClassesReducer from "./slices/conference/conference.slice";
import noticeboardReducer from "./slices/noticeboard/noticeboard.slice";
import { setupListeners } from "@reduxjs/toolkit/query";
import subjectReducer from "./slices/subject/subject.slice";
import timeLogReducer from "./slices/timelog/timelog.slice";
import transportReducer from "./slices/transport/transport.slice";

export const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
        auth: authReducer,
        attendance: attendanceReducer,
        dashboard: dashboardReducer,
        noticeboard: noticeboardReducer,
        subjects: subjectReducer,
        downloadCenter: downloadReducer,
        exam: examReducer,
        liveClass: liveClassesReducer,
        timelog: timeLogReducer,
        diary: diaryReducer,
        transport: transportReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
})
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
