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
            <div className="ri-page-header">
                <div>
                    <h1 className="ri-page-title">Upload receipt</h1>
                    <p className="ri-page-copy">
                        Add an image, run extraction, review the result, then
                        save a clean expense record.
                    </p>
                </div>
                <span className="ri-inline-pill">Review required</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                <div className="ri-panel p-5">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                        Step 1
                    </p>
                    <p className="mt-3 text-lg font-semibold tracking-tight text-white">
                        Upload image
                    </p>
                </div>
                <div className="ri-panel p-5">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                        Step 2
                    </p>
                    <p className="mt-3 text-lg font-semibold tracking-tight text-white">
                        Extract and review
                    </p>
                </div>
                <div className="ri-panel p-5">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                        Step 3
                    </p>
                    <p className="mt-3 text-lg font-semibold tracking-tight text-white">
                        Save to dashboard
                    </p>
                </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[420px,minmax(0,1fr)]">
                <div className="ri-panel p-6">
                    <div>
                        <h2 className="text-lg font-semibold tracking-tight text-white">
                            Receipt image
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-400">
                            PNG, JPEG, or WebP works best for extraction.
                        </p>
                    </div>

                    <label className="mt-6 block">
                        <span className="ri-label">Choose file</span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={onFileChange}
                            className="mt-3 block w-full text-sm text-slate-300 file:mr-4 file:rounded-xl file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-medium file:text-slate-950 hover:file:bg-slate-100"
                        />
                    </label>

                    {previewUrl ? (
                        <div className="mt-5 overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] p-3">
                            <img
                                src={previewUrl}
                                alt="Receipt preview"
                                className="h-auto w-full rounded-lg object-contain"
                            />
                        </div>
                    ) : (
                        <div className="mt-5 rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-sm leading-6 text-slate-400">
                            Screenshots and clean photos work best. If extraction
                            struggles, try a tighter crop and continue with manual
                            edits if needed.
                        </div>
                    )}

                    {extractError ? (
                        <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/[0.08] p-4 text-sm text-amber-100">
                            <p className="font-medium">Extraction could not complete</p>
                            <p className="mt-1 opacity-90">{extractError}</p>
                        </div>
                    ) : null}

                    <div className="mt-6 flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={extract}
                            disabled={extracting || !file}
                            className="ri-action-btn ri-action-btn-primary"
                        >
                            {extracting ? "Extracting..." : "Extract receipt data"}
                        </button>
                        <button
                            type="button"
                            onClick={resetForm}
                            className="ri-action-btn"
                            disabled={extracting || saving}
                        >
                            Reset
                        </button>
                    </div>
                </div>

                <div className="ri-panel p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-semibold tracking-tight text-white">
                                Review extracted data
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-slate-400">
                                Confirm the values before saving the expense.
                            </p>
                        </div>
                        <span className="ri-inline-pill">
                            {extractedOnce ? "Ready to save" : "Manual review"}
                        </span>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
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
                            className="ri-action-btn ri-action-btn-primary"
                        >
                            {saving ? "Saving..." : "Save expense"}
                        </button>
                        <Link to="/dashboard" className="ri-action-btn">
                            Back to dashboard
                        </Link>
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
