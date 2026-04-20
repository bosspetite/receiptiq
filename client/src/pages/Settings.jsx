import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { LogOut, Mail, ShieldCheck } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export function Settings() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    async function handleSignOut() {
        await signOut();
        toast.success("Securely signed out.");
        navigate("/login");
    }

    return (
        <div className="ri-page">
            <div className="ri-page-header">
                <div>
                    <h1 className="ri-page-title">Settings</h1>
                    <p className="ri-page-copy">
                        Manage your account details and this device's access to
                        your workspace.
                    </p>
                </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-[1.2fr,0.8fr]">
                <section className="ri-panel p-6">
                    <div className="flex items-center gap-3">
                        <div className="ri-icon-wrap">
                            <Mail size={18} strokeWidth={1.75} />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold tracking-tight text-white">
                                Account email
                            </h2>
                            <p className="mt-1 text-sm leading-6 text-slate-400">
                                This is the email currently attached to your
                                ReceiptIQ account.
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-4">
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                            Email
                        </p>
                        <p className="mt-2 text-base font-medium text-white">
                            {user?.email || "-"}
                        </p>
                    </div>
                </section>

                <section className="ri-panel p-6">
                    <div className="flex items-center gap-3">
                        <div className="ri-icon-wrap">
                            <ShieldCheck size={18} strokeWidth={1.75} />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold tracking-tight text-white">
                                Session access
                            </h2>
                            <p className="mt-1 text-sm leading-6 text-slate-400">
                                Sign out of this device when you’re done working.
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-4">
                        <p className="text-sm leading-6 text-slate-300">
                            Signing out removes access from this browser and
                            keeps your workspace secure.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleSignOut}
                        className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/[0.04]"
                    >
                        <LogOut size={16} strokeWidth={1.75} />
                        <span>Sign out</span>
                    </button>
                </section>
            </div>
        </div>
    );
}
