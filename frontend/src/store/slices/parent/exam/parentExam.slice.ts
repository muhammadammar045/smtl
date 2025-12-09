import { createSlice } from "@reduxjs/toolkit";
import { api } from "@/store/service/rtk-service";
import { RootState } from "@/store/store";
import { apiRoutes } from "@/store/routes";
import { ParentExamTimetableData, ParentExamsData } from "./types";
import { CommonApiResponse } from "@/store/commonApiResponse";

interface ParentExamState {
    examTimetable: ParentExamTimetableData | null;
    exams: ParentExamsData | null;
    loading: boolean;
    error: string | null;
}

const initialState: ParentExamState = {
    examTimetable: null,
    exams: null,
    loading: false,
    error: null,
};

export const parentExamApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getExamTimetable: builder.query<CommonApiResponse<ParentExamTimetableData>, string>({
            query: (childId) => `${apiRoutes.parent.getExamTimetable(childId)}`,
        }),
        getExams: builder.query<CommonApiResponse<ParentExamsData>, string>({
            query: (childId) => `${apiRoutes.parent.getExams(childId)}`,
        }),
    }), 
});

const parentExamSlice = createSlice({
    name: "parentExam",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addMatcher(
                parentExamApi.endpoints.getExamTimetable.matchFulfilled,
                (state, { payload }) => {
                    state.examTimetable = payload.data ?? null;
                    state.loading = false;
                    state.error = null;
                }
            )
            .addMatcher(
                parentExamApi.endpoints.getExams.matchFulfilled,
                (state, { payload }) => {
                    state.exams = payload.data ?? null;
                    state.loading = false;
                    state.error = null;
                }
            )
            .addMatcher(
                parentExamApi.endpoints.getExamTimetable.matchPending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                parentExamApi.endpoints.getExams.matchPending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                parentExamApi.endpoints.getExamTimetable.matchRejected,
                (state, { error }) => {
                    state.loading = false;
                    state.error = error?.message || "Failed to fetch exam timetable";
                }
            )
            .addMatcher(
                parentExamApi.endpoints.getExams.matchRejected,
                (state, { error }) => {
                    state.loading = false;
                    state.error = error?.message || "Failed to fetch exams";
                }
            );
    },
});

export const { useGetExamTimetableQuery, useGetExamsQuery } = parentExamApi;

export const selectParentExamTimetable = (state: RootState) => state.parentExam.examTimetable;
export const selectParentExams = (state: RootState) => state.parentExam.exams;
export const selectParentExamLoading = (state: RootState) => state.parentExam.loading;
export const selectParentExamError = (state: RootState) => state.parentExam.error;

export default parentExamSlice.reducer;

