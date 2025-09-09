import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/store/service/rtk-service";
import { IUser } from "@/store/slices/auth/types";
import { RootState } from "@/store/store";
import { apiRoutes } from "@/store/routes";
import { CommonApiResponse } from "@/store/commonApiResponse";

interface UserState {
  user: IUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<CommonApiResponse<IUser>, FormData>({
      query: (credentials) => ({
        url: `${apiRoutes.auth.login}`,
        method: "POST",
        body: credentials,
      }),
    }),
    logout: builder.mutation<CommonApiResponse<IUser>, void>({
      query: () => ({
        url: `${apiRoutes.auth.logout}`,
        method: "POST",
      }),
    }),
  }),
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
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
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        if (payload.status && payload.data) {
          state.user = payload.data; // use payload.data (the IUser)
          state.isAuthenticated = true;
          state.error = null;
        } else {
          state.error = payload.message || "Login failed";
          state.user = null;
          state.isAuthenticated = false;
        }
        state.loading = false;
      }
    );

    builder.addMatcher(
      authApi.endpoints.login.matchRejected,
      (state, { error }) => {
        state.loading = false;
        state.error = error?.message || "Login failed";
        state.user = null;
        state.isAuthenticated = false;
      }
    );

    builder.addMatcher(
      authApi.endpoints.logout.matchFulfilled,
      (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      }
    );

    builder.addMatcher(
      authApi.endpoints.logout.matchRejected,
      (state, { error }) => {
        state.loading = false;
        state.error = error?.message || "Logout failed";
      }
    );
  },
});

export const { setUser, clearUser, setError, setLoading } = authSlice.actions;

export const { useLoginMutation, useLogoutMutation } = authApi;

export const selectAuth = (state: RootState) => state.auth.user;

export default authSlice.reducer;
