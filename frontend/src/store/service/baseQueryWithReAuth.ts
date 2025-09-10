// api/baseQueryWithReauth.ts

import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";

import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";

export const rawBaseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_API_URL,
    credentials: "include",
    prepareHeaders: (headers) => {
        headers.set("Accept", "application/json");
        return headers;
    },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions
) => {
    const result = await rawBaseQuery(args, api, extraOptions);

    if (result.error && (result.error.status === 307 || result.error.status === 401)) {
        toast.error("Session expired. Please login again.", {
            onClose: () => {
                window.location.href = "/auth/login";
            },
        });

    }

    return result;
};

export default baseQueryWithReauth;