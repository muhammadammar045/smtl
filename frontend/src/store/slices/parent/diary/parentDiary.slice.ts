import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/store/service/rtk-service";
import { RootState } from "@/store/store";
import { apiRoutes } from "@/store/routes";
import { ParentDiaryData } from "./types";
import { CommonApiResponse } from "@/store/commonApiResponse";

interface ParentDiaryState {
    diary: ParentDiaryData | null;
    loading: boolean;
    error: string | null;
}

const initialState: ParentDiaryState = {
    diary: null,
    loading: false,
    error: null,
};

export const parentDiaryApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getDiary: builder.query<CommonApiResponse<ParentDiaryData>, string>({
            query: (childId) => `${apiRoutes.parent.getDiary(childId)}`,
        }),
    }),
});

const parentDiarySlice = createSlice({
    name: "parentDiary",
    initialState,
    reducers: {
        setDiary: (state, action: PayloadAction<ParentDiaryData>) => {
            state.diary = action.payload;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            parentDiaryApi.endpoints.getDiary.matchFulfilled,
            (state, { payload }) => {
                state.diary = payload.data || null;
                state.loading = false;
                state.error = null;
            }
        );
        builder.addMatcher(
            parentDiaryApi.endpoints.getDiary.matchPending,
            (state) => {
                state.loading = true;
                state.error = null;
            }
        );
        builder.addMatcher(
            parentDiaryApi.endpoints.getDiary.matchRejected,
            (state, { error }) => {
                state.loading = false;
                state.error = error?.message || "Failed to fetch diary";
            }
        );
    },
});

export const { useGetDiaryQuery } = parentDiaryApi;
export const { setDiary, setError } = parentDiarySlice.actions;
export default parentDiarySlice.reducer;

export const selectParentDiary = (state: RootState) => state.parentDiary.diary;
export const selectParentDiaryLoading = (state: RootState) => state.parentDiary.loading;
export const selectParentDiaryError = (state: RootState) => state.parentDiary.error;

