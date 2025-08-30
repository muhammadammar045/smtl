import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/store/service/rtk-service";
import { RootState } from "@/store/store";
import { SubjectData, Student } from "./types"; // <-- add Student type here
import { CommonApiResponse } from "@/store/commonApiResponse";
import { apiRoutes } from "@/store/routes";

interface SubjectState {
    subjects: SubjectData[];
    student: Student | null;
    loading: boolean;
    error: string | null;
}

const initialState: SubjectState = {
    subjects: [],
    student: null,
    loading: false,
    error: null,
};

export const subjectApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getSubjects: builder.query<
            CommonApiResponse<{ subjectlist: SubjectData[]; student: Student }>,
            void
        >({
            query: () => `${apiRoutes.subjects.getSubjects}`,
        }),
    }),
});

const subjectSlice = createSlice({
    name: "subject",
    initialState,
    reducers: {
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            subjectApi.endpoints.getSubjects.matchFulfilled,
            (state, { payload }) => {
                state.subjects = payload.data.subjectlist;
                state.student = payload.data.student;
                state.loading = false;
                state.error = null;
            }
        );
    },
});

export const { useGetSubjectsQuery } = subjectApi;
export const { setError } = subjectSlice.actions;
export default subjectSlice.reducer;

// ✅ Selectors
export const selectSubjects = (state: RootState) => state.subjects.subjects;
export const selectStudent = (state: RootState) => state.subjects.student;
