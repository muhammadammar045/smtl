import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/store/service/rtk-service";
import { ApiResponse } from "@/interfaces/interfaces";
import { RootState } from "@/store/store";
import { StudentDashboardData } from "@/interfaces/student";

interface StudentState {
    student: StudentDashboardData | null;
    loading: boolean;
    error: string | null;
}

const initialState: StudentState = {
    student: null,
    loading: false,
    error: null
};

export const studentApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getStudentDetails: builder.query<ApiResponse<StudentDashboardData>, number>({
            query: (studentId) => `/students/student-details`,
        }),
    }),
});

const studentSlice = createSlice({
    name: "student",
    initialState,
    reducers: {
        setStudent: (state, action: PayloadAction<StudentDashboardData>) => {
            state.student = action.payload;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                studentApi.endpoints.getStudentDetails.matchFulfilled,
                (state, { payload }) => {
                    state.student = payload.data;
                    state.loading = false;
                    state.error = null;
                }
            );
    },
});


export const { useGetStudentDetailsQuery } = studentApi;
export const { setStudent, setError } = studentSlice.actions;
export default studentSlice.reducer;

export const selectStudent = (state: RootState) => state.student.student;
export const selectStudentLoading = (state: RootState) => state.student.loading;
export const selectStudentError = (state: RootState) => state.student.error;
