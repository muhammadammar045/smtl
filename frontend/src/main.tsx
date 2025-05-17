import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { router } from "./router";
import { ThemeProvider } from "./contexts/themeContext/themeContext";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Provider store={store}>
            <ThemeProvider>
                <RouterProvider router={router} />
                <ToastContainer
                    position='top-center'
                    autoClose={2000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick={false}
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme='dark'
                    transition={Bounce}
                />
            </ThemeProvider>
        </Provider>
    </StrictMode>
);
