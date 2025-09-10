
// store/service/rtk-service.ts

import baseQueryWithReauth from "./baseQueryWithReAuth";
import { createApi } from "@reduxjs/toolkit/query/react";

export const api = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithReauth,
    endpoints: () => ({}),
});
