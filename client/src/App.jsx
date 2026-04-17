import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AppShell } from "./components/AppShell";
import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { AuthCallback } from "./pages/AuthCallback";
import { Contact } from "./pages/Contact";
import { Privacy, Terms } from "./pages/Legal";
import { Features } from "./pages/Features";
import { HowItWorks } from "./pages/HowItWorks";
import { WhyReceiptIQ } from "./pages/WhyReceiptIQ";

const Dashboard = lazy(() =>
    import("./pages/Dashboard").then((m) => ({ default: m.Dashboard })),
);
const UploadReceipt = lazy(() =>
    import("./pages/UploadReceipt").then((m) => ({ default: m.UploadReceipt })),
);
const Expenses = lazy(() =>
    import("./pages/Expenses").then((m) => ({ default: m.Expenses })),
);
const Settings = lazy(() =>
    import("./pages/Settings").then((m) => ({ default: m.Settings })),
);

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/features" element={<Features />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/why-receiptiq" element={<WhyReceiptIQ />} />
            <Route
                element={
                    <ProtectedRoute>
                        <AppShell />
                    </ProtectedRoute>
                }
            >
                <Route
                    path="dashboard"
                    element={
                        <Suspense fallback={<div>Loading…</div>}>
                            <Dashboard />
                        </Suspense>
                    }
                />
                <Route
                    path="upload"
                    element={
                        <Suspense fallback={<div>Loading…</div>}>
                            <UploadReceipt />
                        </Suspense>
                    }
                />
                <Route
                    path="expenses"
                    element={
                        <Suspense fallback={<div>Loading…</div>}>
                            <Expenses />
                        </Suspense>
                    }
                />
                <Route
                    path="settings"
                    element={
                        <Suspense fallback={<div>Loading…</div>}>
                            <Settings />
                        </Suspense>
                    }
                />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
