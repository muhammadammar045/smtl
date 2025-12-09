import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/store/service/rtk-service";
import { RootState } from "@/store/store";
import { apiRoutes } from "@/store/routes";
import { IParentDownloadsData } from "./types";
import { CommonApiResponse } from "@/store/commonApiResponse";

interface ParentDownloadState {
    downloads: IParentDownloadsData | null;
    loading: boolean;
    error: string | null;
}

const initialState: ParentDownloadState = {
    downloads: null,
    loading: false,
    error: null,
};

export const parentDownloadApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getDownloads: builder.query<CommonApiResponse<IParentDownloadsData>, string>({
            query: (childId) => `${apiRoutes.parent.getDownloads(childId)}`,
        }),
    }),
});

const parentDownloadSlice = createSlice({
    name: "parentDownload",
    initialState,
    reducers: {
        setDownloads: (state, action: PayloadAction<IParentDownloadsData>) => {
            state.downloads = action.payload;
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
        clearDownloads: (state) => {
            state.downloads = null;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            parentDownloadApi.endpoints.getDownloads.matchFulfilled,
            (state, { payload }) => {
                state.downloads = payload.data || null;
                state.loading = false;
                state.error = null;
            }
        );
        builder.addMatcher(
            parentDownloadApi.endpoints.getDownloads.matchPending,
            (state) => {
                state.loading = true;
                state.error = null;
            }
        );
        builder.addMatcher(
            parentDownloadApi.endpoints.getDownloads.matchRejected,
            (state, { error }) => {
                state.loading = false;
                state.error = error?.message || "Failed to fetch downloads";
            }
        );
    },
});

export const { setDownloads, setError, setLoading, clearDownloads } = parentDownloadSlice.actions;
export const { useGetDownloadsQuery } = parentDownloadApi;

export const selectParentDownloads = (state: RootState) => state.parentDownload.downloads;
export const selectParentDownloadLoading = (state: RootState) => state.parentDownload.loading;
export const selectParentDownloadError = (state: RootState) => state.parentDownload.error;

export default parentDownloadSlice.reducer;

