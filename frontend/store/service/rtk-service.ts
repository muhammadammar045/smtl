import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
        credentials: "include",
        prepareHeaders: (headers, { getState }) => {
            const token = localStorage.getItem("token");
            console.log("Token in prepareHeaders:", token);
            if (token) {
                headers.set("Authorization", ` Bearer ${token}`);
            }

            return headers;
        },
    }),
    endpoints: () => ({}),
});
