import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/store/service/rtk-service";
import { RootState } from "@/store/store";
import { ExamSchedule, ExamProgressReportData } from "./types";
import { CommonApiResponse } from "@/store/commonApiResponse";
import { apiRoutes } from "@/store/routes";

interface ExamState {
    examSchedules: ExamSchedule[];
    selectedExamSchedule: ExamSchedule | null;
    examProgressReport: ExamProgressReportData[];
    loading: boolean;
    error: string | null;
}

const initialState: ExamState = {
    examSchedules: [],
    selectedExamSchedule: null,
    examProgressReport: [],
    loading: false,
    error: null,
};

// API slice
export const examApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getExamSchedules: builder.query<CommonApiResponse<ExamSchedule[]>, void>({
            query: () => `${apiRoutes.exam.examSchedule}`,
        }),
        getResultProgress: builder.query<CommonApiResponse<ExamProgressReportData[]>, void>({
            query: () => `${apiRoutes.exam.examProgressReport}`,
        }),
    }),
});

// Slice
const examSlice = createSlice({
    name: "exam",
    initialState,
    reducers: {
        setSelectedExamSchedule: (state, action: PayloadAction<ExamSchedule>) => {
            state.selectedExamSchedule = action.payload;
        },
        setExamProgressReport: (state, action: PayloadAction<ExamProgressReportData[]>) => {
            state.examProgressReport = action.payload;
        },
        setExamScheduleError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        // ExamSchedules
        builder.addMatcher(
            examApi.endpoints.getExamSchedules.matchFulfilled,
            (state, { payload }) => {
                state.examSchedules = payload.data;
                state.loading = false;
                state.error = null;
            }
        );
        builder.addMatcher(
            examApi.endpoints.getExamSchedules.matchPending,
            (state) => {
                state.loading = true;
            }
        );
        builder.addMatcher(
            examApi.endpoints.getExamSchedules.matchRejected,
            (state, { error }) => {
                state.loading = false;
                state.error = error?.message || "Failed to fetch exam schedules";
            }
        );

        // Exam Progress Report
        builder.addMatcher(
            examApi.endpoints.getResultProgress.matchFulfilled,
            (state, { payload }) => {
                state.examProgressReport = payload.data;
                state.loading = false;
                state.error = null;
            }
        );
        builder.addMatcher(
            examApi.endpoints.getResultProgress.matchPending,
            (state) => {
                state.loading = true;
            }
        );
        builder.addMatcher(
            examApi.endpoints.getResultProgress.matchRejected,
            (state, { error }) => {
                state.loading = false;
                state.error = error?.message || "Failed to fetch exam progress report";
            }
        );
    },
});

// Hooks from API
export const {
    useGetExamSchedulesQuery,
    useGetResultProgressQuery,
} = examApi;

// Actions
export const { setSelectedExamSchedule, setExamProgressReport, setExamScheduleError } =
    examSlice.actions;

export default examSlice.reducer;

// Selectors
export const selectExamSchedules = (state: RootState) => state.exam.examSchedules;
export const selectSelectedExamSchedule = (state: RootState) => state.exam.selectedExamSchedule;
export const selectExamProgressReport = (state: RootState) => state.exam.examProgressReport;
export const selectExamScheduleLoading = (state: RootState) => state.exam.loading;
export const selectExamScheduleError = (state: RootState) => state.exam.error;
