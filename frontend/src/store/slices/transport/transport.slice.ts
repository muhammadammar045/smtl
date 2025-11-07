import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { CommonApiResponse } from "@/store/commonApiResponse";
import { RootState } from "@/store/store";
import { Transport } from "./types";
import { api } from "@/store/service/rtk-service";
import { apiRoutes } from "@/store/routes";

// State Interface
interface TransportState {
    transports: Transport | null;
    transport: Transport | null;
    loading: boolean;
    error: string | null;
}

// Initial State
const initialState: TransportState = {
    transports: null,
    transport: null,
    loading: false,
    error: null,
};

// ✅ RTK Query API slice
export const transportApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getTransport: builder.query<CommonApiResponse<Transport>, void>({
            query: () => apiRoutes.routes.getRoutes,
        }),
    }),
});

// ✅ Redux slice
const transportSlice = createSlice({
    name: "transport",
    initialState,
    reducers: {
        setTransport: (state, action: PayloadAction<Transport>) => {
            state.transport = action.payload;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            transportApi.endpoints.getTransport.matchFulfilled,
            (state, { payload }) => {
                state.transports = payload.data;
                state.loading = false;
                state.error = null;
            }
        );
    },
});

// ✅ Export hook from API, not slice
export const { useGetTransportQuery } = transportApi;

// ✅ Export actions
export const { setTransport, setError } = transportSlice.actions;

// ✅ Export reducer
export default transportSlice.reducer;

// ✅ Selectors
export const selectTransports = (state: RootState) => state.transport.transports;
export const selectTransport = (state: RootState) => state.transport.transport;
