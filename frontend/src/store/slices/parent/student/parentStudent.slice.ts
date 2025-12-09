import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/store/service/rtk-service";
import { RootState } from "@/store/store";
import { apiRoutes } from "@/store/routes";
import { IParentStudentData } from "./types";
import { CommonApiResponse } from "@/store/commonApiResponse";

interface ParentStudentState {
    student: IParentStudentData | null;
    loading: boolean;
    error: string | null;
}

const initialState: ParentStudentState = {
    student: null,
    loading: false,
    error: null,
};

export const parentStudentApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getStudent: builder.query<CommonApiResponse<IParentStudentData>, string>({
            query: (childId) => `${apiRoutes.parent.getStudent(childId)}`,
        }),
    }),
});

const parentStudentSlice = createSlice({
    name: "parentStudent",
    initialState,
    reducers: {
        setStudent: (state, action: PayloadAction<IParentStudentData>) => {
            state.student = action.payload;
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
            state.student = null;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            parentStudentApi.endpoints.getStudent.matchFulfilled,
            (state, { payload }) => {
                state.student = payload.data || null;
                state.loading = false;
                state.error = null;
            }
        );
        builder.addMatcher(
            parentStudentApi.endpoints.getStudent.matchPending,
            (state) => {
                state.loading = true;
                state.error = null;
            }
        );
        builder.addMatcher(
            parentStudentApi.endpoints.getStudent.matchRejected,
            (state, { error }) => {
                state.loading = false;
                state.error = error?.message || "Failed to fetch student data";
            }
        );
    },
});

export const { setStudent, setError, setLoading, clearStudent } = parentStudentSlice.actions;
export const { useGetStudentQuery } = parentStudentApi;

export const selectParentStudent = (state: RootState) => state.parentStudent.student;
export const selectParentStudentLoading = (state: RootState) => state.parentStudent.loading;
export const selectParentStudentError = (state: RootState) => state.parentStudent.error;

export default parentStudentSlice.reducer;

