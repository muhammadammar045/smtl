import { TimeLogData, TimeLogRow } from "./types";

import { CommonApiResponse } from "@/store/commonApiResponse";
import { RootState } from "@/store/store";
import { api } from "@/store/service/rtk-service";
import { apiRoutes } from "@/store/routes";
import { createSlice } from "@reduxjs/toolkit";

// Define the slice state
interface TimeLogState {
    timeLogs: TimeLogRow[];         // Raw row data
    metadata: Omit<TimeLogData, 'data'> | null; // draw, total, etc.
    loading: boolean;
    error: string | null;
}

const initialState: TimeLogState = {
    timeLogs: [],
    metadata: null,
    loading: false,
    error: null
};


// RTK Query endpoint
export const timeLogApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getTimeLogs: builder.query<CommonApiResponse<TimeLogData>, void>({
            query: () => apiRoutes.timelog.getTimeLogs,
        }),
    }),
});


// Slice
const timeLogSlice = createSlice({
    name: "timeLog",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            timeLogApi.endpoints.getTimeLogs.matchFulfilled,
            (state, { payload }) => {
                state.timeLogs = payload.data.data;
                state.metadata = {
                    draw: payload.data.draw,
                    recordsTotal: payload.data.recordsTotal,
                    recordsFiltered: payload.data.recordsFiltered,
                };
                state.loading = false;
                state.error = null;
            }
        );

    },
});

// Exports
export const { useGetTimeLogsQuery } = timeLogApi;
export const { } = timeLogSlice.actions;
export default timeLogSlice.reducer;

// Selector
export const selectTimeLogs = (state: RootState) => state.timelog.timeLogs;
