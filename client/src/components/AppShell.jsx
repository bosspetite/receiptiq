import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export function AppShell() {
    return (
        <div className="flex min-h-screen flex-col bg-[radial-gradient(circle_at_top,rgba(72,204,191,0.12),transparent_20%),linear-gradient(180deg,rgba(8,17,31,0.92),rgba(5,11,21,0.98))]">
            <Navbar />
            <main className="ri-container flex-1 py-8">
                <Outlet />
            </main>
        </div>
    );
}
