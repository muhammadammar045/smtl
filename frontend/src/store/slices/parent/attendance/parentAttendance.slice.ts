import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/store/service/rtk-service";
import { RootState } from "@/store/store";
import { apiRoutes } from "@/store/routes";
import { ParentAttendanceData, ParentAttendanceDetailsData } from "./types";
import { CommonApiResponse } from "@/store/commonApiResponse";

interface ParentAttendanceState {
    attendance: ParentAttendanceData | null;
    attendanceDetails: ParentAttendanceDetailsData | null;
    loading: boolean;
    error: string | null;
}

const initialState: ParentAttendanceState = {
    attendance: null,
    attendanceDetails: null,
    loading: false,
    error: null,
};

export const parentAttendanceApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAttendance: builder.query<CommonApiResponse<ParentAttendanceData>, string>({
            query: (childId) => `${apiRoutes.parent.getAttendance(childId)}`,
        }),
        getAttendanceDetails: builder.query<CommonApiResponse<ParentAttendanceDetailsData>, { childId: string, month: string, year: number, search: string }>({
            query: ({ childId, month, year, search }) => `${apiRoutes.parent.getAttendanceDetails(childId, month, year, search)}`,
        }),
    }),
});

const parentAttendanceSlice = createSlice({
    name: "parentAttendance",
    initialState,
    reducers: {
        setAttendance: (state, action: PayloadAction<ParentAttendanceData>) => {
            state.attendance = action.payload;
        },
        setAttendanceDetails: (state, action: PayloadAction<ParentAttendanceDetailsData>) => {
            state.attendanceDetails = action.payload;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                parentAttendanceApi.endpoints.getAttendance.matchPending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                parentAttendanceApi.endpoints.getAttendance.matchFulfilled,
                (state, { payload }) => {
                    state.attendance = payload.data;
                    state.loading = false;
                    state.error = null;
                }
            )
            .addMatcher(
                parentAttendanceApi.endpoints.getAttendance.matchRejected,
                (state, { error }) => {
                    state.loading = false;
                    state.error = error.message ?? "Failed to fetch attendance";
                }
            )
            .addMatcher(
                parentAttendanceApi.endpoints.getAttendanceDetails.matchPending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                parentAttendanceApi.endpoints.getAttendanceDetails.matchFulfilled,
                (state, { payload }) => {
                    state.attendanceDetails = payload.data;
                    state.loading = false;
                    state.error = null;
                }
            )
            .addMatcher(
                parentAttendanceApi.endpoints.getAttendanceDetails.matchRejected,
                (state, { error }) => {
                    state.loading = false;
                    state.error = error.message ?? "Failed to fetch attendance details";
                }
            );
    },
});

export const { useGetAttendanceQuery, useGetAttendanceDetailsQuery } = parentAttendanceApi;
export const { setAttendance, setAttendanceDetails, setError } = parentAttendanceSlice.actions;
export default parentAttendanceSlice.reducer;

export const selectParentAttendance = (state: RootState) => state.parentAttendance.attendance;
export const selectParentAttendanceDetails = (state: RootState) => state.parentAttendance.attendanceDetails;
export const selectParentAttendanceLoading = (state: RootState) => state.parentAttendance.loading;
export const selectParentAttendanceError = (state: RootState) => state.parentAttendance.error;

