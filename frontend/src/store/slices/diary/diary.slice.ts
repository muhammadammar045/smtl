import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { CommonApiResponse } from "@/store/commonApiResponse";
import { Diary } from "./types";
import { RootState } from "@/store/store";
import { api } from "@/store/service/rtk-service";
import { apiRoutes } from "@/store/routes";

// State Interface
interface DiaryState {
    diaries: Diary | null;
    diary: Diary | null;
    loading: boolean;
    error: string | null;
}

// Initial State
const initialState: DiaryState = {
    diaries: null,
    diary: null,
    loading: false,
    error: null,
};

// ✅ RTK Query API slice
export const diaryApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getDiary: builder.query<CommonApiResponse<Diary>, void>({
            query: () => apiRoutes.diary.getDiary,
        }),
    }),
});

// ✅ Redux slice
const diarySlice = createSlice({
    name: "diary",
    initialState,
    reducers: {
        setDiary: (state, action: PayloadAction<Diary>) => {
            state.diary = action.payload;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            diaryApi.endpoints.getDiary.matchFulfilled,
            (state, { payload }) => {
                state.diaries = payload.data;
                state.loading = false;
                state.error = null;
            }
        );
    },
});

// ✅ Export hook from API, not slice
export const { useGetDiaryQuery } = diaryApi;

// ✅ Export actions
export const { setDiary, setError } = diarySlice.actions;

// ✅ Export reducer
export default diarySlice.reducer;

// ✅ Selectors
export const selectDiaryes = (state: RootState) => state.diary.diaries;
export const selectDiary = (state: RootState) => state.diary.diary;
