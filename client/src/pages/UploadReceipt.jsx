import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../services/api";

const emptyForm = {
    vendor: "",
    date: "",
    amount: "",
    category: "General",
    currency: "USD",
    items: "",
    receipt_url: "",
};

export function UploadReceipt() {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [extracting, setExtracting] = useState(false);
    const [saving, setSaving] = useState(false);
    const [extractError, setExtractError] = useState("");
    const [extractedOnce, setExtractedOnce] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [previewUrl, setPreviewUrl] = useState(null);

    function resetForm() {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        setFile(null);
        setExtractError("");
        setExtractedOnce(false);
        setForm(emptyForm);
    }

    function onFileChange(e) {
        const nextFile = e.target.files?.[0];
        setFile(nextFile || null);
        setExtractError("");

        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(
            nextFile && nextFile.type?.startsWith("image/")
                ? URL.createObjectURL(nextFile)
                : null,
        );
    }

    async function extract() {
        if (!file) {
            toast.error("Choose a receipt image first");
            return;
        }

        if (!file.type.startsWith("image/")) {
            toast.error(
                "Use a photo or screenshot (PNG/JPEG/WebP). PDF is not supported for AI extraction.",
            );
            return;
        }

        setExtracting(true);
        setExtractError("");
        try {
            const body = new FormData();
            body.append("receipt", file);
            const { data } = await api.post("/upload/extract", body);

            setForm({
                vendor: data.vendor ?? "",
                date: data.date ?? "",
                amount: data.amount != null ? String(data.amount) : "",
                category: data.category ?? "General",
                currency: data.currency ?? "USD",
                items: Array.isArray(data.items)
                    ? data.items.join("\n")
                    : data.items ?? "",
                receipt_url: data.receipt_url ?? "",
            });
            setExtractedOnce(true);
            toast.success("Extraction complete. Review and edit below.");
        } catch (e) {
            setExtractedOnce(false);
            setExtractError(
                e.message ||
                    "Extraction failed. You can still type the expense details manually and save them.",
            );
            toast.error(e.message || "Extraction failed");
        } finally {
            setExtracting(false);
        }
    }

    async function saveExpense() {
        const amountNum = Number.parseFloat(form.amount);
        if (Number.isNaN(amountNum)) {
            toast.error("Enter a valid amount");
            return;
        }

        setSaving(true);
        try {
            const items =
                typeof form.items === "string"
                    ? form.items
                          .split("\n")
                          .map((item) => item.trim())
                          .filter(Boolean)
                    : [];

            const { data } = await api.post("/expenses", {
                vendor: form.vendor.trim(),
                date: form.date || null,
                amount: amountNum,
                category: form.category || "General",
                items,
                receipt_url: form.receipt_url || null,
                currency: form.currency || "USD",
            });

            if (Array.isArray(data?.warnings)) {
                data.warnings.forEach((warning) =>
                    toast(warning, { icon: "!" }),
                );
            }
            toast.success("Expense saved");
            resetForm();
            navigate("/dashboard", {
                state: {
                    savedExpense: data?.expense || {
                        vendor: form.vendor.trim(),
                    },
                },
            });
        } catch (e) {
            toast.error(e.message || "Could not save");
        } finally {
            setSaving(false);
        }
    }

    const canSave =
        !saving &&
        form.vendor.trim() &&
        form.amount !== "" &&
        Number.isFinite(Number.parseFloat(form.amount));

    return (
        <div className="ri-page">
            <div className="ri-page-hero">
                <div className="relative flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="ri-kicker">Capture and review</p>
                        <h1 className="ri-h1">Upload receipt</h1>
                        <p className="ri-subtitle">
                            Add an image, run extraction, sanity-check the result,
                            then save a clean expense record.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <span className="ri-badge-accent">AI assisted</span>
                        <span className="ri-badge">Review before save</span>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                <div className="ri-stat">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                        Step 1
                    </p>
                    <p className="mt-3 text-lg font-bold text-white">Upload image</p>
                </div>
                <div className="ri-stat">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                        Step 2
                    </p>
                    <p className="mt-3 text-lg font-bold text-white">Extract + review</p>
                </div>
                <div className="ri-stat">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                        Step 3
                    </p>
                    <p className="mt-3 text-lg font-bold text-white">Save to dashboard</p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-12">
                <div className="lg:col-span-5">
                    <div className="ri-surface ri-surface-pad">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="ri-kicker">Receipt input</p>
                                <h2 className="text-2xl font-bold text-white">
                                    Receipt image
                                </h2>
                                <p className="mt-2 text-sm text-slate-400">
                                    PNG, JPEG, or WebP works best for receipt extraction.
                                </p>
                            </div>
                            <span className="ri-badge">Gemini extraction</span>
                        </div>

                        <label className="mt-5 block">
                            <span className="ri-label">Choose file</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={onFileChange}
                                className="mt-3 block w-full text-sm text-slate-300 file:mr-4 file:rounded-full file:border-0 file:bg-white/90 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-950 hover:file:bg-white"
                            />
                        </label>

                        {previewUrl ? (
                            <div className="mt-5 overflow-hidden rounded-[1.2rem] border border-white/10 bg-slate-950/40 p-3">
                                <img
                                    src={previewUrl}
                                    alt="Receipt preview"
                                    className="h-auto w-full rounded-[0.9rem] object-contain"
                                />
                            </div>
                        ) : (
                            <div className="mt-5 rounded-[1.2rem] border border-dashed border-white/10 bg-white/5 p-6 text-sm text-slate-400">
                                Tip: screenshots and clear photos extract best. If you see errors, try a tighter crop.
                            </div>
                        )}

                        {extractError ? (
                            <div className="mt-5 rounded-[1.2rem] border border-amber-700/50 bg-amber-950/30 p-4 text-sm text-amber-100">
                                <p className="font-medium">
                                    Extraction could not complete
                                </p>
                                <p className="mt-1 opacity-90">{extractError}</p>
                                <p className="mt-2 text-xs text-amber-200/80">
                                    You can still fill the form manually and save the expense.
                                </p>
                            </div>
                        ) : null}

                        <div className="mt-5 flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={extract}
                                disabled={extracting || !file}
                                className="ri-btn-primary"
                            >
                                {extracting ? (
                                    <>
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                                        Extracting...
                                    </>
                                ) : (
                                    "Extract receipt data"
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="ri-btn-secondary"
                                disabled={extracting || saving}
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-7">
                    <div className="ri-surface ri-surface-pad ri-grid-accent">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="ri-kicker">Final review</p>
                                <h2 className="text-2xl font-bold text-white">
                                    Review extracted data
                                </h2>
                                <p className="mt-2 text-sm text-slate-400">
                                    Confirm the values before saving to Supabase.
                                </p>
                            </div>
                            <span className="ri-badge-accent">
                                {extractedOnce ? "Extracted" : "Review required"}
                            </span>
                        </div>

                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                            <Field label="Vendor" value={form.vendor} onChange={(value) => setForm((current) => ({ ...current, vendor: value }))} />
                            <Field label="Date" type="date" value={form.date} onChange={(value) => setForm((current) => ({ ...current, date: value }))} />
                            <Field label="Amount" type="number" step="0.01" value={form.amount} onChange={(value) => setForm((current) => ({ ...current, amount: value }))} />
                            <Field label="Currency" value={form.currency} onChange={(value) => setForm((current) => ({ ...current, currency: value }))} />
                            <Field label="Category" value={form.category} onChange={(value) => setForm((current) => ({ ...current, category: value }))} />
                            <Field label="Receipt URL (optional)" value={form.receipt_url} onChange={(value) => setForm((current) => ({ ...current, receipt_url: value }))} className="sm:col-span-2" />
                        </div>

                        <div className="mt-4">
                            <label className="ri-label">Line items (one per line)</label>
                            <textarea
                                rows={5}
                                value={form.items}
                                onChange={(e) =>
                                    setForm((current) => ({
                                        ...current,
                                        items: e.target.value,
                                    }))
                                }
                                className="ri-textarea"
                            />
                            <p className="ri-help">
                                Optional. Keep one item per line for cleaner records.
                            </p>
                        </div>

                        <div className="mt-6 flex flex-wrap items-center gap-3">
                            <button
                                type="button"
                                onClick={saveExpense}
                                disabled={!canSave}
                                className="ri-btn-primary"
                            >
                                {saving ? (
                                    <>
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save expense"
                                )}
                            </button>
                            <Link to="/dashboard" className="ri-btn-secondary">
                                Back to dashboard
                            </Link>
                            <span className="text-xs text-slate-500">
                                Saved rows are protected by your Supabase user session.
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Field({ label, value, onChange, type = "text", step, className = "" }) {
    return (
        <div className={className}>
            <label className="ri-label">{label}</label>
            <input
                type={type}
                step={step}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="ri-input"
            />
        </div>
    );
}
