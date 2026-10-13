import React, { useEffect, useState } from "react";
import { Loader2, Save, X } from "lucide-react";

/** Matches primary paper report (13 items) */
const BEHAVIOUR_KEYS = [
  ["punctuality", "1. Punctuality"],
  ["attendanceInClass", "2. Class Attendance"],
  ["carryingOutAssignments", "3. Carrying out of Assignment"],
  ["perseverance", "4. Perseverance"],
  ["selfControl", "5. Self Control"],
  ["selfConfidence", "6. Self Confidence"],
  ["leadership", "7. Leadership"],
  ["obedience", "8. Obedience"],
  ["relationshipWithOthers", "9. Relationship with others"],
  ["honesty", "10. Honesty"],
  ["neatness", "11. Neatness"],
  ["gamesSports", "12. Games & Sports"],
  ["manualSkills", "13. Manual Skills"],
];

const RATING_OPTIONS = [5, 4, 3, 2, 1];

const emptyForm = () => ({
  pupilAge: "",
  year: "",
  nextTermBegins: "",
  attendancePresent: "",
  attendanceOutOf: "",
  nextTermFee: "",
  feeOwed: "",
  feesTotal: "",
  behaviours: {},
  formTeacherComment: "",
  principalComment: "",
  behavioursEnteredBy: "",
});

const PrimaryReportDetailsModal = ({
  open,
  onClose,
  initialData = {},
  studentName = "",
  className = "",
  session = "",
  term = "",
  saving = false,
  onSave,
}) => {
  const [form, setForm] = useState(emptyForm());
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setError("");
    setForm({
      pupilAge: initialData.pupilAge ?? "",
      year: initialData.year || "",
      nextTermBegins: initialData.nextTermBegins || "",
      attendancePresent: initialData.attendancePresent ?? "",
      attendanceOutOf: initialData.attendanceOutOf ?? "",
      nextTermFee: initialData.nextTermFee ?? "",
      feeOwed: initialData.feeOwed ?? "",
      feesTotal: initialData.feesTotal ?? "",
      behaviours: { ...(initialData.behaviours || {}) },
      formTeacherComment: initialData.formTeacherComment || "",
      principalComment: initialData.principalComment || "",
      behavioursEnteredBy: initialData.behavioursEnteredBy || "",
    });
  }, [open, initialData]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape" && !saving) onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, saving, onClose]);

  if (!open) return null;

  const setBehaviour = (key, value) => {
    setForm((prev) => ({
      ...prev,
      behaviours: {
        ...prev.behaviours,
        [key]: value === "" ? null : Number(value),
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    onSave?.({
      pupilAge: form.pupilAge === "" ? null : form.pupilAge,
      year: form.year,
      nextTermBegins: form.nextTermBegins,
      attendancePresent: form.attendancePresent,
      attendanceOutOf: form.attendanceOutOf,
      nextTermFee: form.nextTermFee,
      feeOwed: form.feeOwed,
      feesTotal: form.feesTotal,
      behaviours: form.behaviours,
      formTeacherComment: form.formTeacherComment,
      principalComment: form.principalComment,
      behavioursEnteredBy: form.behavioursEnteredBy,
    });
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center print:hidden">
      <button
        type="button"
        aria-label="Close overlay"
        className="absolute inset-0 cursor-pointer bg-black/45"
        onClick={() => !saving && onClose?.()}
      />

      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 flex flex-col w-full max-w-2xl max-h-[92vh] bg-white shadow-2xl rounded-t-2xl sm:rounded-2xl border border-slate-200"
      >
        <div className="flex items-start justify-between gap-3 px-4 py-3 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="text-sm font-extrabold font-heading text-dark">
              Edit primary report details
            </h2>
            <p className="text-[11px] text-gray mt-0.5">
              {studentName}
              {className ? ` · ${className}` : ""}
              {term ? ` · ${term}` : ""}
              {session ? ` · ${session}` : ""}
            </p>
            <p className="text-[10px] text-gray mt-1">
              Ratings 5–1 · Signatures come from Academic Settings
            </p>
          </div>
          <button
            type="button"
            disabled={saving}
            onClick={() => onClose?.()}
            className="p-2 cursor-pointer rounded-xl hover:bg-light disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 px-4 py-4 space-y-5 overflow-y-auto">
            {error && (
              <div className="px-3 py-2 text-xs font-medium text-red-700 border border-red-200 bg-red-50 rounded-xl">
                {error}
              </div>
            )}

            {/* Identity / term meta — all fields on the paper card */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="block space-y-1">
                <span className="text-[11px] font-semibold">Pupil&apos;s age</span>
                <input
                  value={form.pupilAge}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, pupilAge: e.target.value }))
                  }
                  placeholder="e.g. 8"
                  className="w-full px-3 py-2 text-sm border bg-light border-slate-200 rounded-xl focus:outline-none focus:border-primary"
                />
              </label>
              <label className="block space-y-1">
                <span className="text-[11px] font-semibold">Year</span>
                <input
                  value={form.year}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, year: e.target.value }))
                  }
                  placeholder="e.g. 2025"
                  className="w-full px-3 py-2 text-sm border bg-light border-slate-200 rounded-xl focus:outline-none focus:border-primary"
                />
              </label>
              <label className="block space-y-1 sm:col-span-2">
                <span className="text-[11px] font-semibold">Next term begins</span>
                <input
                  value={form.nextTermBegins}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, nextTermBegins: e.target.value }))
                  }
                  placeholder="e.g. 14-1-2025"
                  className="w-full px-3 py-2 text-sm border bg-light border-slate-200 rounded-xl focus:outline-none focus:border-primary"
                />
              </label>
              <label className="block space-y-1">
                <span className="text-[11px] font-semibold">Attendance (present)</span>
                <input
                  value={form.attendancePresent}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      attendancePresent: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 text-sm border bg-light border-slate-200 rounded-xl focus:outline-none focus:border-primary"
                />
              </label>
              <label className="block space-y-1">
                <span className="text-[11px] font-semibold">Attendance out of</span>
                <input
                  value={form.attendanceOutOf}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      attendanceOutOf: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 text-sm border bg-light border-slate-200 rounded-xl focus:outline-none focus:border-primary"
                />
              </label>
              <label className="block space-y-1">
                <span className="text-[11px] font-semibold">
                  Next term&apos;s fee
                </span>
                <input
                  value={form.nextTermFee}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, nextTermFee: e.target.value }))
                  }
                  className="w-full px-3 py-2 text-sm border bg-light border-slate-200 rounded-xl focus:outline-none focus:border-primary"
                />
              </label>
              <label className="block space-y-1">
                <span className="text-[11px] font-semibold">Fee owed</span>
                <input
                  value={form.feeOwed}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, feeOwed: e.target.value }))
                  }
                  className="w-full px-3 py-2 text-sm border bg-light border-slate-200 rounded-xl focus:outline-none focus:border-primary"
                />
              </label>
              <label className="block space-y-1 sm:col-span-2">
                <span className="text-[11px] font-semibold">Fees total</span>
                <input
                  value={form.feesTotal}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, feesTotal: e.target.value }))
                  }
                  className="w-full px-3 py-2 text-sm border bg-light border-slate-200 rounded-xl focus:outline-none focus:border-primary"
                />
              </label>
            </div>

            {/* Behaviours */}
            <div className="p-3 space-y-2 border border-slate-100 rounded-xl bg-slate-50/50">
              <h3 className="text-xs font-bold text-primary">
                Social behaviours &amp; manipulative skills
              </h3>
              {BEHAVIOUR_KEYS.map(([key, label]) => (
                <div
                  key={key}
                  className="flex items-center justify-between gap-2"
                >
                  <span className="text-[11px]">{label}</span>
                  <select
                    value={form.behaviours?.[key] ?? ""}
                    onChange={(e) => setBehaviour(key, e.target.value)}
                    className="w-[72px] px-2 py-1.5 text-xs border bg-white border-slate-200 rounded-lg"
                  >
                    <option value="">—</option>
                    {RATING_OPTIONS.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
              <label className="block pt-2 space-y-1">
                <span className="text-[11px] font-semibold">Entered by</span>
                <input
                  value={form.behavioursEnteredBy}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      behavioursEnteredBy: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl"
                />
              </label>
            </div>

            {/* Comments */}
            <div className="space-y-3">
              <label className="block space-y-1">
                <span className="text-[11px] font-semibold">
                  Class teacher&apos;s comments
                </span>
                <textarea
                  rows={3}
                  value={form.formTeacherComment}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      formTeacherComment: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 text-sm border resize-none bg-light border-slate-200 rounded-xl focus:outline-none focus:border-primary"
                />
              </label>
              <label className="block space-y-1">
                <span className="text-[11px] font-semibold">
                  Headmaster / Headmistress comments
                </span>
                <textarea
                  rows={3}
                  value={form.principalComment}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      principalComment: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 text-sm border resize-none bg-light border-slate-200 rounded-xl focus:outline-none focus:border-primary"
                />
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 px-4 py-3 bg-white border-t border-slate-100 shrink-0">
            <button
              type="button"
              disabled={saving}
              onClick={() => onClose?.()}
              className="px-4 py-2.5 text-xs font-bold rounded-xl bg-light text-gray hover:bg-slate-200/80 cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-accent text-white text-xs font-heading font-bold rounded-xl cursor-pointer disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save details
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrimaryReportDetailsModal;