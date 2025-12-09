import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/store/service/rtk-service";
import { RootState } from "@/store/store";
import { apiRoutes } from "@/store/routes";
import { ParentSubjectData } from "./types";
import { CommonApiResponse } from "@/store/commonApiResponse";

interface ParentSubjectState {
    subjects: ParentSubjectData | null;
    loading: boolean;
    error: string | null;
}

const initialState: ParentSubjectState = {
    subjects: null,
    loading: false,
    error: null,
};

export const parentSubjectApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getSubject: builder.query<CommonApiResponse<ParentSubjectData>, string>({
            query: (childId) => `${apiRoutes.parent.getSubject(childId)}`,
        }),
    }),
});

const parentSubjectSlice = createSlice({
    name: "parentSubject",
    initialState,
    reducers: {
        setSubjects: (state, action: PayloadAction<ParentSubjectData>) => {
            state.subjects = action.payload;
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
        clearSubjects: (state) => {
            state.subjects = null;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            parentSubjectApi.endpoints.getSubject.matchFulfilled,
            (state, { payload }) => {
                state.subjects = payload.data || null;
                state.loading = false;
                state.error = null;
            }
        );
        builder.addMatcher(
            parentSubjectApi.endpoints.getSubject.matchPending,
            (state) => {
                state.loading = true;
                state.error = null;
            }
        );
        builder.addMatcher(
            parentSubjectApi.endpoints.getSubject.matchRejected,
            (state, { error }) => {
                state.loading = false;
                state.error = error?.message || "Failed to fetch subjects";
            }
        );
    },
});

export const { setSubjects, setError, setLoading, clearSubjects } = parentSubjectSlice.actions;
export const { useGetSubjectQuery } = parentSubjectApi;

export const selectParentSubjects = (state: RootState) => state.parentSubject.subjects;
export const selectParentSubjectLoading = (state: RootState) => state.parentSubject.loading;
export const selectParentSubjectError = (state: RootState) => state.parentSubject.error;

export default parentSubjectSlice.reducer;

