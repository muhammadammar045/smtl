import { ExamProgressReportData, ExamScheduleData } from "./types";

import { CommonApiResponse } from "@/store/commonApiResponse";
import { RootState } from "@/store/store";
import { api } from "@/store/service/rtk-service";
import { apiRoutes } from "@/store/routes";
import { createSlice } from "@reduxjs/toolkit";

interface ExamState {
    examSchedules: ExamScheduleData[]; // ✅ should be array
    examProgressReport: ExamProgressReportData[];
    examResults: ExamProgressReportData[];
    loading: boolean;
    error: string | null;
}

const initialState: ExamState = {
    examSchedules: [], // ✅ empty array
    examProgressReport: [],
    examResults: [],
    loading: false,
    error: null,
};

// ✅ Inject RTK Query endpoints
export const examApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getExamSchedules: builder.query<
            CommonApiResponse<ExamScheduleData[]>,
            void
        >({
            query: () => apiRoutes.exam.examSchedule,
        }),
        getResultProgress: builder.query<
            CommonApiResponse<ExamProgressReportData[]>,
            void
        >({
            query: () => apiRoutes.exam.examProgressReport,
        }),
        getExamResults: builder.query<
            CommonApiResponse<ExamProgressReportData[]>,
            void
        >({
            query: () => apiRoutes.exam.examResults,
        })
    }),
});

// ✅ Slice
const examSlice = createSlice({
    name: "exam",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addMatcher(
            examApi.endpoints.getExamSchedules.matchFulfilled,
            (state, { payload }) => {
                state.examSchedules = payload.data ?? [];
                state.loading = false;
                state.error = null;
            }
        );
        builder.addMatcher(
            examApi.endpoints.getResultProgress.matchFulfilled,
            (state, { payload }) => {
                state.examProgressReport = payload.data ?? [];
                state.loading = false;
                state.error = null;
            }
        );
        builder.addMatcher(
            examApi.endpoints.getExamResults.matchFulfilled,
            (state, { payload }) => {
                state.examResults = payload.data ?? [];
                state.loading = false;
                state.error = null;
            }
        );
    },
});

// ✅ Export hooks for components
export const {
    useGetExamSchedulesQuery,
    useGetResultProgressQuery,
    useGetExamResultsQuery,
} = examApi;

export default examSlice.reducer;

// ✅ Selectors
export const selectExam = (state: RootState) => state.exam;
export const selectExamSchedules = (state: RootState) =>
    state.exam.examSchedules;
export const selectExamProgressReport = (state: RootState) =>
    state.exam.examProgressReport;
export const selectExamLoading = (state: RootState) => state.exam.loading;
export const selectExamError = (state: RootState) => state.exam.error;
