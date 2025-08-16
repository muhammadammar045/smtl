import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/store/service/rtk-service";
import { RootState } from "@/store/store";
import { apiRoutes } from "@/store/routes";
import { IDashboardData } from "./types";
import { CommonApiResponse } from "@/store/commonApiResponse";



interface StudentState {
    dashboard: IDashboardData | null;
    loading: boolean;
    error: string | null;
}

const initialState: StudentState = {
    dashboard: null,
    loading: false,
    error: null,
};

export const dashboardApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getDashboardDetails: builder.query<CommonApiResponse<IDashboardData>, void>({
            query: () => `${apiRoutes.dashboard.getDashboardDetails}`,
        }),
    }),
});

const studentSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {
        setStudent: (state, action: PayloadAction<IDashboardData>) => {
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
        clearStudent: (state) => {
            state.dashboard = null;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            dashboardApi.endpoints.getDashboardDetails.matchFulfilled,
            (state, { payload }) => {
                state.dashboard = payload.data || null;
                state.loading = false;
                state.error = null;
            }
        );
        builder.addMatcher(
            dashboardApi.endpoints.getDashboardDetails.matchPending,
            (state) => {
                state.loading = true;
                state.error = null;
            }
        );
        builder.addMatcher(
            dashboardApi.endpoints.getDashboardDetails.matchRejected,
            (state, { error }) => {
                state.loading = false;
                state.error = error?.message || "Failed to fetch student data";
            }
        );
    },
});

export const { setStudent, setError, setLoading, clearStudent } = studentSlice.actions;
export const { useGetDashboardDetailsQuery } = dashboardApi;

export const selectDashboard = (state: RootState) => state.dashboard.dashboard;
export const selectLoading = (state: RootState) => state.dashboard.loading;
export const selectError = (state: RootState) => state.dashboard.error;

export default studentSlice.reducer;
