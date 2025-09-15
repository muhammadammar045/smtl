import { AttendanceData, AttendanceDetailsData } from "./types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { CommonApiResponse } from "@/store/commonApiResponse";
import { RootState } from "@/store/store";
import { api } from "@/store/service/rtk-service";
import { apiRoutes } from "@/store/routes";

interface AttendanceState {
    attendance: AttendanceData | null;
    attendanceDetails: AttendanceDetailsData | null;
    loading: boolean;
    error: string | null;
}

const initialState: AttendanceState = {
    attendance: null,
    attendanceDetails: null,
    loading: false,
    error: null,
};

// RTK Query endpoints
export const attendanceApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAttendance: builder.query<CommonApiResponse<AttendanceData>, void>({
            query: () => `${apiRoutes.attendance.getAttendance}`,
        }),
        getAttendanceDetails: builder.query<CommonApiResponse<AttendanceDetailsData>, { month: string, year: number, search: string }>({
            query: (args) => `${apiRoutes.attendance.getAttendanceDetails(args.month, args.year, args.search)}`,
        }),
    }),
});

const attendanceSlice = createSlice({
    name: "attendance",
    initialState,
    reducers: {
        setAttendance: (state, action: PayloadAction<AttendanceData>) => {
            state.attendance = action.payload;
        },

        setAttendanceDetails: (state, action: PayloadAction<AttendanceDetailsData>) => {
            state.attendanceDetails = action.payload;
        },
        setAttendanceError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                attendanceApi.endpoints.getAttendance.matchPending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                attendanceApi.endpoints.getAttendance.matchFulfilled,
                (state, { payload }) => {
                    state.attendance = payload.data; // ✅ expects { code, data, message, status }
                    state.loading = false;
                    state.error = null;
                }
            )
            .addMatcher(
                attendanceApi.endpoints.getAttendance.matchRejected,
                (state, { error }) => {
                    state.loading = false;
                    state.error = error.message ?? "Failed to fetch attendance";
                }
            )
            .addMatcher(
                attendanceApi.endpoints.getAttendanceDetails.matchPending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                attendanceApi.endpoints.getAttendanceDetails.matchFulfilled,
                (state, { payload }) => {
                    state.attendanceDetails = payload.data; // ✅ expects { code, data, message, status }
                    state.loading = false;
                    state.error = null;
                }
            )
            .addMatcher(
                attendanceApi.endpoints.getAttendanceDetails.matchRejected,
                (state, { error }) => {
                    state.loading = false;
                    state.error = error.message ?? "Failed to fetch attendance details";
                }
            );
    },
});

export const { useGetAttendanceQuery, useGetAttendanceDetailsQuery } = attendanceApi;
export const { setAttendance, setAttendanceDetails, setAttendanceError } = attendanceSlice.actions;
export default attendanceSlice.reducer;

// ✅ Selectors
export const selectAttendance = (state: RootState) => state.attendance.attendance;
export const selectAttendanceDetails = (state: RootState) => state.attendance.attendanceDetails;
export const selectAttendanceLoading = (state: RootState) => state.attendance.loading;
export const selectAttendanceError = (state: RootState) => state.attendance.error;
