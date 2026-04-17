import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";

export function Settings() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    async function handleSignOut() {
        await signOut();
        toast.success("Signed out");
        navigate("/login");
    }

    return (
        <div className="ri-page">
            <div className="ri-page-hero">
                <div className="relative">
                    <p className="ri-kicker">Account</p>
                    <h1 className="ri-h1">Settings</h1>
                    <p className="ri-subtitle">
                        Manage the identity and session details powering your private workspace.
                    </p>
                </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-12">
                <div className="ri-surface ri-surface-pad lg:col-span-7">
                    <p className="ri-kicker">Profile</p>
                    <h2 className="text-2xl font-bold text-white">Identity details</h2>
                    <dl className="mt-6 space-y-4 text-sm">
                        <div>
                            <dt className="text-slate-500">Email</dt>
                            <dd className="mt-1 font-medium text-slate-200">
                                {user?.email || "-"}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-slate-500">User ID</dt>
                            <dd className="mt-1 break-all font-mono text-xs text-slate-400">
                                {user?.id || "-"}
                            </dd>
                        </div>
                    </dl>
                </div>

                <div className="ri-surface ri-surface-pad lg:col-span-5">
                    <p className="ri-kicker">Session</p>
                    <h2 className="text-2xl font-bold text-white">Current device</h2>
                    <p className="mt-3 text-sm text-slate-400">
                        Sign out on this device. Your Supabase session is cleared from this browser.
                    </p>
                    <button type="button" onClick={handleSignOut} className="ri-btn-danger mt-5">
                        Sign out
                    </button>
                    <p className="mt-4 text-xs text-slate-500">
                        Local development keys live in <code className="text-slate-400">client/.env</code>.
                    </p>
                </div>
            </div>
        </div>
    );
}
