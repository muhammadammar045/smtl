import { Conference, LiveClasses } from "./types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { CommonApiResponse } from "@/store/commonApiResponse";
import { RootState } from "@/store/store";
import { api } from "@/store/service/rtk-service";
import { apiRoutes } from "@/store/routes";

// State Interface
interface LiveClassesState {
    liveClasses: LiveClasses | null;
    liveClass: Conference | null;
    loading: boolean;
    error: string | null;
}

// Initial State
const initialState: LiveClassesState = {
    liveClasses: null,
    liveClass: null,
    loading: false,
    error: null,
};

// ✅ RTK Query API slice
export const liveClassApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getLiveClasses: builder.query<CommonApiResponse<LiveClasses>, void>({
            query: () => apiRoutes.conference.getConference,
        }),
    }),
});

// ✅ Redux slice
const liveClassSlice = createSlice({
    name: "liveClass",
    initialState,
    reducers: {
        setLiveClass: (state, action: PayloadAction<LiveClasses>) => {
            state.liveClass = action.payload;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            liveClassApi.endpoints.getLiveClasses.matchFulfilled,
            (state, { payload }) => {
                state.liveClasses = payload.data;
                state.loading = false;
                state.error = null;
            }
        );
    },
});

// ✅ Export hook from API, not slice
export const { useGetLiveClassesQuery } = liveClassApi;

// ✅ Export actions
export const { setLiveClass, setError } = liveClassSlice.actions;

// ✅ Export reducer
export default liveClassSlice.reducer;

// ✅ Selectors
export const selectLiveClasses = (state: RootState) => state.liveClass.liveClasses;
export const selectLiveClass = (state: RootState) => state.liveClass.liveClass;
