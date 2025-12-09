import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/store/service/rtk-service";
import { RootState } from "@/store/store";
import { apiRoutes } from "@/store/routes";
import { IParentDashboardData } from "./types";
import { CommonApiResponse } from "@/store/commonApiResponse";

interface ParentDashboardState {
    dashboard: IParentDashboardData | null;
    loading: boolean;
    error: string | null;
}

const initialState: ParentDashboardState = {
    dashboard: null,
    loading: false,
    error: null,
};

export const parentDashboardApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getParentDashboard: builder.query<CommonApiResponse<IParentDashboardData>, void>({
            query: () => `${apiRoutes.parent.dashboard}`,
        }),
    }),
});

const parentDashboardSlice = createSlice({
    name: "parentDashboard",
    initialState,
    reducers: {
        setDashboard: (state, action: PayloadAction<IParentDashboardData>) => {
            state.dashboard = action.payload;
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
        clearDashboard: (state) => {
            state.dashboard = null;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            parentDashboardApi.endpoints.getParentDashboard.matchFulfilled,
            (state, { payload }) => {
                state.dashboard = payload.data || null;
                state.loading = false;
                state.error = null;
            }
        );
        builder.addMatcher(
            parentDashboardApi.endpoints.getParentDashboard.matchPending,
            (state) => {
                state.loading = true;
                state.error = null;
            }
        );
        builder.addMatcher(
            parentDashboardApi.endpoints.getParentDashboard.matchRejected,
            (state, { error }) => {
                state.loading = false;
                state.error = error?.message || "Failed to fetch parent dashboard data";
            }
        );
    },
});

export const { setDashboard, setError, setLoading, clearDashboard } = parentDashboardSlice.actions;
export const { useGetParentDashboardQuery } = parentDashboardApi;

export const selectParentDashboard = (state: RootState) => state.parentDashboard.dashboard;
export const selectParentDashboardLoading = (state: RootState) => state.parentDashboard.loading;
export const selectParentDashboardError = (state: RootState) => state.parentDashboard.error;

export default parentDashboardSlice.reducer;

