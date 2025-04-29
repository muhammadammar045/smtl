import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { router } from "./router";
import { ThemeProvider } from "./contexts/themeContext/themeContext";
import { ApiProvider } from "@reduxjs/toolkit/query/react";
import { api } from "../store/service/rtk-service";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider>
            <ApiProvider api={api}>
                <RouterProvider router={router} />
            </ApiProvider>
        </ThemeProvider>
    </StrictMode>
);
