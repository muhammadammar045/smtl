import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/store/service/rtk-service";
import { RootState } from "@/store/store";
import { apiRoutes } from "@/store/routes";
import { IParentLeaveRequestData } from "./types";
import { CommonApiResponse } from "@/store/commonApiResponse";

interface ParentLeaveRequestState {
    leaveRequests: IParentLeaveRequestData | null;
    loading: boolean;
    error: string | null;
}

const initialState: ParentLeaveRequestState = {
    leaveRequests: null,
    loading: false,
    error: null,
};

export const parentLeaveRequestApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getLeaveRequest: builder.query<CommonApiResponse<IParentLeaveRequestData>, string>({
            query: (childId) => `${apiRoutes.parent.getLeaveRequest(childId)}`,
        }),
    }),
});

const parentLeaveRequestSlice = createSlice({
    name: "parentLeaveRequest",
    initialState,
    reducers: {
        setLeaveRequests: (state, action: PayloadAction<IParentLeaveRequestData>) => {
            state.leaveRequests = action.payload;
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
        clearLeaveRequests: (state) => {
            state.leaveRequests = null;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            parentLeaveRequestApi.endpoints.getLeaveRequest.matchFulfilled,
            (state, { payload }) => {
                state.leaveRequests = payload.data || null;
                state.loading = false;
                state.error = null;
            }
        );
        builder.addMatcher(
            parentLeaveRequestApi.endpoints.getLeaveRequest.matchPending,
            (state) => {
                state.loading = true;
                state.error = null;
            }
        );
        builder.addMatcher(
            parentLeaveRequestApi.endpoints.getLeaveRequest.matchRejected,
            (state, { error }) => {
                state.loading = false;
                state.error = error?.message || "Failed to fetch leave requests";
            }
        );
    },
});

export const { setLeaveRequests, setError, setLoading, clearLeaveRequests } = parentLeaveRequestSlice.actions;
export const { useGetLeaveRequestQuery } = parentLeaveRequestApi;

export const selectParentLeaveRequests = (state: RootState) => state.parentLeaveRequest.leaveRequests;
export const selectParentLeaveRequestLoading = (state: RootState) => state.parentLeaveRequest.loading;
export const selectParentLeaveRequestError = (state: RootState) => state.parentLeaveRequest.error;

export default parentLeaveRequestSlice.reducer;

