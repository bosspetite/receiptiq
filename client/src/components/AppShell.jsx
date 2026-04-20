import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export function AppShell() {
    return (
        <div className="min-h-screen bg-[#06080d] text-slate-100">
            <div className="mx-auto flex min-h-screen w-full max-w-[1600px]">
                <Navbar />
                <div className="flex min-h-screen min-w-0 flex-1 flex-col">
                    <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 xl:px-10 xl:py-10">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
}
