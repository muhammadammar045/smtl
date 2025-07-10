import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/store/service/rtk-service";
import { ApiResponse } from "@/interfaces/interfaces";
import { RootState } from "@/store/store";
import { NoticeBoardData } from "@/interfaces/noticeboard";

interface NoticeBoardState {
    notifications: NoticeBoardData[];
    notification: NoticeBoardData | null;
    loading: boolean;
    error: string | null;
}

const initialState: NoticeBoardState = {
    notifications: [],
    notification: null,
    loading: false,
    error: null
};

export const noticeboardApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getNoticeBoardNotifications: builder.query<ApiResponse<NoticeBoardData[]>, void>({
            query: () => `/notifications/get-dashboard-notifications`,
        }),
    }),
});

const noticeboardSlice = createSlice({
    name: "noticeboard",
    initialState,
    reducers: {
        setNotification: (state, action: PayloadAction<NoticeBoardData>) => {
            state.notification = action.payload;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                noticeboardApi.endpoints.getNoticeBoardNotifications.matchFulfilled,
                (state, { payload }) => {
                    state.notifications = payload.data;
                    state.loading = false;
                    state.error = null;
                }
            );
    },
});


export const { useGetNoticeBoardNotificationsQuery } = noticeboardApi;
export const { setNotification, setError } = noticeboardSlice.actions;
export default noticeboardSlice.reducer;

export const selectNoticeBoardNotifications = (state: RootState) => state.noticeboard.notifications
