import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "@/store/service/rtk-service";
import authReducer from "@/store/slices/auth/auth.slice";
import dashboardReducer from "@/store/slices/dashboard/dashboard.slice";
import noticeboardReducer from "./slices/noticeboard/noticeboard.slice";
import subjectReducer from "./slices/subject/subject.slice";

export const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
        auth: authReducer,
        dashboard: dashboardReducer,
        noticeboard: noticeboardReducer,
        subjects: subjectReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
})
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
