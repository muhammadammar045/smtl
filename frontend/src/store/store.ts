import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "@/store/service/rtk-service";
import authReducer from "@/store/slices/auth/auth.slice";
import studentReducer from "@/store/slices/student/student.slice";
import noticeboardReducer from "./slices/noticeboard/noticeboard.slice";

export const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
        auth: authReducer,
        student: studentReducer,
        noticeboard: noticeboardReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
})
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
