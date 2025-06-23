import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/store/service/rtk-service";
import { ApiResponse, IUser } from "@/interfaces/interfaces";
import { RootState } from "@/store/store";



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
  error: null
};

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query<ApiResponse<IUser>, void>({
      query: () => "/auth/profile",
    }),
    login: builder.mutation<ApiResponse<IUser>, { username: string; password: string }>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    logout: builder.mutation<ApiResponse<IUser>, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
    forgotPassword: builder.mutation<ApiResponse<IUser>, { email: string }>({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),
  }),
});


const authSlice = createSlice({
  name: "user",
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
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        authApi.endpoints.login.matchFulfilled,
        (state, { payload }) => {
          state.user = payload.data;
          state.isAuthenticated = true;
          state.loading = false;
          state.error = null;
        }
      )
      .addMatcher(
        authApi.endpoints.getUser.matchFulfilled,
        (state, { payload }) => {
          state.user = payload.data;
          state.isAuthenticated = true;
          state.loading = false;
          state.error = null;
        }
      )
      .addMatcher(
        authApi.endpoints.logout.matchFulfilled,
        (state) => {
          state.user = null;
          state.isAuthenticated = false;
          state.loading = false;
          state.error = null;
        }
      )
      .addMatcher(
        authApi.endpoints.forgotPassword.matchFulfilled,
        (state) => {
          state.loading = false;
          state.error = null;
        }
      );
  },
});

export const { useGetUserQuery, useLoginMutation, useLogoutMutation } = authApi;
export const { setUser, clearUser, setError, setLoading } = authSlice.actions;
export default authSlice.reducer;

export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectAuthRole = (state: RootState) => state.auth.user
export const selectAuthIsLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;
