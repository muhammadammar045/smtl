import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/store/service/rtk-service";
import { RootState } from "@/store/store";
import { Subject, SubjectData } from "./types";
import { CommonApiResponse } from "@/store/commonApiResponse";

interface SubjectState {
    subjects: SubjectData[];
    subject: Subject;
    loading: boolean;
    error: string | null;
}

const initialState: SubjectState = {
    subjects: [],
    subject: {} as Subject,
    loading: false,
    error: null
};

export const subjectApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getSubjects: builder.query<CommonApiResponse<SubjectData[]>, void>({
            query: () => `/subjects`,
        }),
    }),
});

const subjectSlice = createSlice({
    name: "subject",
    initialState,
    reducers: {
        setSubject: (state, action: PayloadAction<Subject>) => {
            state.subject = action.payload;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                subjectApi.endpoints.getSubjects.matchFulfilled,
                (state, { payload }) => {
                    state.subjects = payload.data;
                    state.loading = false;
                    state.error = null;
                }
            );
    },
});


export const { useGetSubjectsQuery } = subjectApi;
export const { setSubject, setError } = subjectSlice.actions;
export default subjectSlice.reducer;

export const selectSubjects = (state: RootState) => state.subjects.subjects
