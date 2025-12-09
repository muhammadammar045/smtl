import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/store/service/rtk-service";
import { RootState } from "@/store/store";
import { apiRoutes } from "@/store/routes";
import { ParentRouteData } from "./types";
import { CommonApiResponse } from "@/store/commonApiResponse";

interface ParentRouteState {
    routes: ParentRouteData | null;
    loading: boolean;
    error: string | null;
}

const initialState: ParentRouteState = {
    routes: null,
    loading: false,
    error: null,
};

export const parentRouteApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getRoutes: builder.query<CommonApiResponse<ParentRouteData>, void>({
            query: () => apiRoutes.parent.getRoutes,
        }),
    }),
});

const parentRouteSlice = createSlice({
    name: "parentRoute",
    initialState,
    reducers: {
        setRoutes: (state, action: PayloadAction<ParentRouteData>) => {
            state.routes = action.payload;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            parentRouteApi.endpoints.getRoutes.matchFulfilled,
            (state, { payload }) => {
                state.routes = payload.data;
                state.loading = false;
                state.error = null;
            }
        );
        builder.addMatcher(
            parentRouteApi.endpoints.getRoutes.matchPending,
            (state) => {
                state.loading = true;
                state.error = null;
            }
        );
        builder.addMatcher(
            parentRouteApi.endpoints.getRoutes.matchRejected,
            (state, { error }) => {
                state.loading = false;
                state.error = error?.message || "Failed to fetch routes";
            }
        );
    },
});

export const { useGetRoutesQuery } = parentRouteApi;
export const { setRoutes, setError } = parentRouteSlice.actions;
export default parentRouteSlice.reducer;

export const selectParentRoutes = (state: RootState) => state.parentRoute.routes;
export const selectParentRouteLoading = (state: RootState) => state.parentRoute.loading;
export const selectParentRouteError = (state: RootState) => state.parentRoute.error;

