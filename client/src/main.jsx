import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
const Toaster = lazy(() => import("react-hot-toast"));
import { AuthProvider } from "./context/AuthContext";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <App />
                <Suspense>
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            className:
                                "!bg-navy-light !text-slate-100 !border !border-slate-600",
                            duration: 4000,
                        }}
                    />
                </Suspense>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>,
);
