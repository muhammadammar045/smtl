import { createSlice } from "@reduxjs/toolkit";
import { api } from "@/store/service/rtk-service";
import { RootState } from "@/store/store";
import { apiRoutes } from "@/store/routes";
import { ParentBioLogData } from "./types";
import { CommonApiResponse } from "@/store/commonApiResponse";

interface ParentBioLogState {
    bioLogs: ParentBioLogData | null;
    loading: boolean;
    error: string | null;
}

const initialState: ParentBioLogState = {
    bioLogs: null,
    loading: false,
    error: null,
};

export const parentBioLogApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getBioLog: builder.query<CommonApiResponse<ParentBioLogData>, string>({
            query: (childId) => `${apiRoutes.parent.getBioLog(childId)}`,
        }),
    }),
});

const parentBioLogSlice = createSlice({
    name: "parentBioLog",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addMatcher(
            parentBioLogApi.endpoints.getBioLog.matchFulfilled,
            (state, { payload }) => {
                state.bioLogs = payload.data || null;
                state.loading = false;
                state.error = null;
            }
        );
        builder.addMatcher(
            parentBioLogApi.endpoints.getBioLog.matchPending,
            (state) => {
                state.loading = true;
                state.error = null;
            }
        );
        builder.addMatcher(
            parentBioLogApi.endpoints.getBioLog.matchRejected,
            (state, { error }) => {
                state.loading = false;
                state.error = error?.message || "Failed to fetch bio log";
            }
        );
    },
});

export const { useGetBioLogQuery } = parentBioLogApi;

export const selectParentBioLogs = (state: RootState) => state.parentBioLog.bioLogs;
export const selectParentBioLogLoading = (state: RootState) => state.parentBioLog.loading;
export const selectParentBioLogError = (state: RootState) => state.parentBioLog.error;

export default parentBioLogSlice.reducer;

