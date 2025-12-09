import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/store/service/rtk-service";
import { RootState } from "@/store/store";
import { apiRoutes } from "@/store/routes";
import { ParentNoticeBoardData } from "./types";
import { CommonApiResponse } from "@/store/commonApiResponse";

interface ParentNotificationState {
    notifications: ParentNoticeBoardData | null;
    loading: boolean;
    error: string | null;
}

const initialState: ParentNotificationState = {
    notifications: null,
    loading: false,
    error: null,
};

export const parentNotificationApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getNotifications: builder.query<CommonApiResponse<ParentNoticeBoardData>, string>({
            query: (childId) => `${apiRoutes.parent.getNotifications(childId)}`,
        }),
    }),
});

const parentNotificationSlice = createSlice({
    name: "parentNotification",
    initialState,
    reducers: {
        setNotifications: (state, action: PayloadAction<ParentNoticeBoardData>) => {
            state.notifications = action.payload;
            state.loading = false;
            state.error = null;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.loading = false;
        },  
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        clearNotifications: (state) => {
            state.notifications = null;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            parentNotificationApi.endpoints.getNotifications.matchFulfilled,
            (state, { payload }) => {
                state.notifications = payload.data || null;
                state.loading = false;
                state.error = null;
            }
        );
        builder.addMatcher(
            parentNotificationApi.endpoints.getNotifications.matchPending,
            (state) => {
                state.loading = true;
                state.error = null;
            }
        );
        builder.addMatcher(
            parentNotificationApi.endpoints.getNotifications.matchRejected,
            (state, { error }) => {
                state.loading = false;
                state.error = error?.message || "Failed to fetch notifications";
            }
        );
    },
});

export const { setNotifications, setError, setLoading, clearNotifications } = parentNotificationSlice.actions;
export const { useGetNotificationsQuery } = parentNotificationApi;

export const selectParentNotifications = (state: RootState) => state.parentNotification.notifications;
export const selectParentNotificationLoading = (state: RootState) => state.parentNotification.loading;
export const selectParentNotificationError = (state: RootState) => state.parentNotification.error;

export default parentNotificationSlice.reducer;

