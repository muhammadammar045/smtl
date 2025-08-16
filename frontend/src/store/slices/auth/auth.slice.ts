import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/store/service/rtk-service";
import { IUser } from "@/store/slices/auth/types";
import { RootState } from "@/store/store";
import { apiRoutes } from "@/store/routes";

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
    getUser: builder.query<any, void>({
      query: () => "/auth/profile",
    }),
    login: builder.mutation<IUser, FormData>({
      query: (credentials) => ({
        url: `${apiRoutes.auth.login}`,
        method: "POST",
        body: credentials,
      }),
    }),
    logout: builder.mutation<any, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
    forgotPassword: builder.mutation<any, { email: string }>({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
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
    builder
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, { payload }) => {
        state.user = payload;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.getUser.matchFulfilled, (state, { payload }) => {
        state.user = payload.data || null;
        state.isAuthenticated = !!payload.data;
        state.loading = false;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.forgotPassword.matchFulfilled, (state) => {
        state.loading = false;
        state.error = null;
      });
  },
});

export const { setUser, clearUser, setError, setLoading } = authSlice.actions;

export const {
  useGetUserQuery,
  useLoginMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
} = authApi;

export const selectAuth = (state: RootState) => state.auth.user;

export default authSlice.reducer;
