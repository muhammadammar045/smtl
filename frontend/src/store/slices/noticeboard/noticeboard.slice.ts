import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/store/service/rtk-service";
import { RootState } from "@/store/store";
import { CommonApiResponse } from "@/store/commonApiResponse";
import { NoticeBoardData, Notification } from "./types";
import { apiRoutes } from "@/store/routes";

interface NoticeBoardState {
    notifications: Notification[];
    notification: Notification;
    loading: boolean;
    error: string | null;
}

const initialState: NoticeBoardState = {
    notifications: [],
    notification: {} as Notification,
    loading: false,
    error: null,
};

export const noticeboardApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getNoticeBoardNotifications: builder.query<CommonApiResponse<NoticeBoardData>, void>({
            query: () => `${apiRoutes.noticeboard.getNoticeboardDetails}`,
        }),
    }),
});

const noticeboardSlice = createSlice({
    name: "noticeboard",
    initialState,
    reducers: {
        setNotification: (state, action: PayloadAction<Notification>) => {
            state.notification = action.payload;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            noticeboardApi.endpoints.getNoticeBoardNotifications.matchFulfilled,
            (state, { payload }) => {
                state.notifications = payload.data.notificationList;
                state.loading = false;
                state.error = null;
            }
        );

        builder.addMatcher(
            noticeboardApi.endpoints.getNoticeBoardNotifications.matchRejected,
            (state, { error }) => {
                state.error = error?.message || "Failed to fetch notifications";
                state.loading = false;
            }
        );
    },
});

export const { useGetNoticeBoardNotificationsQuery } = noticeboardApi;
export const { setNotification, setError } = noticeboardSlice.actions;
export default noticeboardSlice.reducer;

export const selectNoticeBoardNotifications = (state: RootState) =>
    state.noticeboard.notifications;
