import { Outlet, useNavigate } from "react-router-dom";
import { Search, Upload } from "lucide-react";
import { useState } from "react";
import { Navbar } from "./Navbar";

export function AppShell() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");

    function handleSearchSubmit(e) {
        e.preventDefault();
        const next = query.trim();
        navigate(next ? `/expenses?q=${encodeURIComponent(next)}` : "/expenses");
    }

    return (
        <div className="min-h-screen bg-[#06080d] text-slate-100">
            <div className="mx-auto flex min-h-screen w-full max-w-[1600px]">
                <Navbar />
                <div className="flex min-h-screen min-w-0 flex-1 flex-col">
                    <div className="sticky top-0 z-20 border-b border-white/5 bg-[#090c12]/85 px-4 py-4 backdrop-blur sm:px-6 lg:px-8 xl:px-10">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <form onSubmit={handleSearchSubmit} className="relative w-full max-w-xl">
                                <Search
                                    size={16}
                                    strokeWidth={1.75}
                                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                                />
                                <input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search expenses"
                                    className="ri-input mt-0 pl-10"
                                />
                            </form>
                            <button
                                type="button"
                                onClick={() => navigate("/upload")}
                                className="ri-action-btn ri-action-btn-primary w-full sm:w-auto"
                            >
                                <Upload size={16} strokeWidth={1.75} />
                                <span>Quick upload</span>
                            </button>
                        </div>
                    </div>
                    <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 xl:px-10 xl:py-10">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
}
