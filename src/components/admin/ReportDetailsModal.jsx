import React, { useEffect, useState } from "react";
import { Loader2, Save, X } from "lucide-react";

const BEHAVIOUR_KEYS = [
  ["punctuality", "1. Punctuality"],
  ["attendanceInClass", "2. Attendance at Class"],
  ["attentiveness", "3. Attentiveness"],
  ["carryingOutAssignments", "4. Initiative"],
  ["perseverance", "5. Perseverance"],
  ["organizationalAbility", "6. Carrying out of design"],
  ["neatness", "7. Organizational Ability"],
  ["honesty", "8. Neatness"],
  ["politeness", "9. Honesty"],
  ["selfControl", "10. Politeness"],
  ["senseOfResponsibility", "11. Self Control"],
  ["senseOfCooperation", "12. Sense of Responsibility"],
  ["obedience", "13. Sense of Co-operation"],
  ["publicSpeaking", "14. Obedience"],
  ["handwriting", "15. Public Speaking"],
];

const SKILL_KEYS = [
  ["handlingOfTools", "1. Handling of Tools"],
  ["drawing", "2. Drawing"],
  ["painting", "3. Painting"],
  ["musicalSkills", "4. Sculpture (specify)"],
  ["games", "5. Musical Skills (specify)"],
  ["sports", "6. Games"],
  ["gymnastics", "7. Sports"],
  ["gymnasticsB", "8. Gymnastics"],
];

const FEE_FIELDS = [
  ["tuition", "Tuition"],
  ["boarding", "Boarding"],
  ["pta", "P.T.A"],
  ["equipment", "Equipment"],
  ["rehabilitation", "Rehabilitation"],
  ["igboLang", "Prom. of Igbo Lang"],
  ["library", "Library"],
  ["gamesFee", "Games"],
  ["examination", "Examination"],
];

const COMMENT_FIELDS = [
  ["formTeacherComment", "Form teacher's comments"],
  ["houseMasterComment", "House master's comments"],
  ["guidanceCounsellorComment", "Guidance counsellor's comments"],
  ["principalComment", "Principal's comments"],
];

const RATING_OPTIONS = [5, 4, 3, 2, 1];

const emptyFees = () =>
  Object.fromEntries(FEE_FIELDS.map(([k]) => [k, { n: "", k: "" }]));

const emptyForm = () => ({
  house: "",
  year: "",
  nextTermBegins: "",
  behaviours: {},
  skills: {},
  fees: emptyFees(),
  formTeacherComment: "",
  houseMasterComment: "",
  guidanceCounsellorComment: "",
  principalComment: "",
  behavioursEnteredBy: "",
});

const normalizeFees = (feesIn = {}) => {
  const fees = emptyFees();
  FEE_FIELDS.forEach(([key]) => {
    const row = feesIn[key] || {};
    fees[key] = {
      n: row.n === 0 || row.n ? row.n : row.n ?? "",
      k: row.k === 0 || row.k ? row.k : row.k ?? "",
    };
  });
  return fees;
};

const ReportDetailsModal = ({
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

  useEffect(() => {
    if (!open) return;

    setForm({
      house: initialData.house || "",
      year: initialData.year || "",
      nextTermBegins: initialData.nextTermBegins || "",
      behaviours: { ...(initialData.behaviours || {}) },
      skills: { ...(initialData.skills || {}) },
      fees: normalizeFees(initialData.fees),
      formTeacherComment: initialData.formTeacherComment || "",
      houseMasterComment: initialData.houseMasterComment || "",
      guidanceCounsellorComment: initialData.guidanceCounsellorComment || "",
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

  const setSkill = (key, value) => {
    setForm((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [key]: value === "" ? null : Number(value),
      },
    }));
  };

  const setFee = (key, field, value) => {
    setForm((prev) => ({
      ...prev,
      fees: {
        ...prev.fees,
        [key]: {
          ...(prev.fees?.[key] || { n: "", k: "" }),
          [field]: value,
        },
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Names come from Academic Settings — do not send them from this modal
    onSave?.(form);
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
        className="relative z-10 flex flex-col w-full max-w-3xl max-h-[92vh] bg-white shadow-2xl rounded-t-2xl sm:rounded-2xl border border-slate-200"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-4 py-3 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="text-sm font-extrabold font-heading text-dark">
              Edit report details
            </h2>
            <p className="text-[11px] text-gray mt-0.5">
              {studentName}
              {className ? ` · ${className}` : ""}
              {term ? ` · ${term}` : ""}
              {session ? ` · ${session}` : ""}
            </p>
            <p className="text-[10px] text-gray mt-1">
              Ratings 5–1 · Dates fill on save · Official names & signatures come from Academic Settings
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
            {/* Identity */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <label className="block space-y-1">
                <span className="text-[11px] font-semibold">House</span>
                <input
                  value={form.house}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, house: e.target.value }))
                  }
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
                  className="w-full px-3 py-2 text-sm border bg-light border-slate-200 rounded-xl focus:outline-none focus:border-primary"
                />
              </label>
              <label className="block space-y-1">
                <span className="text-[11px] font-semibold">Next term begins</span>
                <input
                  value={form.nextTermBegins}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, nextTermBegins: e.target.value }))
                  }
                  className="w-full px-3 py-2 text-sm border bg-light border-slate-200 rounded-xl focus:outline-none focus:border-primary"
                />
              </label>
            </div>

            {/* Behaviour + Skills */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <div className="p-3 space-y-2 border border-slate-100 rounded-xl bg-slate-50/50">
                <h3 className="text-xs font-bold text-primary">Social behaviour</h3>
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
              </div>

              <div className="p-3 space-y-2 border border-slate-100 rounded-xl bg-slate-50/50">
                <h3 className="text-xs font-bold text-primary">Motor skills</h3>
                {SKILL_KEYS.map(([key, label]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between gap-2"
                  >
                    <span className="text-[11px]">{label}</span>
                    <select
                      value={form.skills?.[key] ?? ""}
                      onChange={(e) => setSkill(key, e.target.value)}
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
            </div>

            {/* Fees */}
            <div className="p-3 space-y-2 border border-slate-100 rounded-xl">
              <h3 className="text-xs font-bold text-primary">Fees (Naira / Kobo)</h3>
              <p className="text-[10px] text-gray">
                Amounts for this term. Shown in the fees box on the report card.
              </p>
              <div className="space-y-2">
                {FEE_FIELDS.map(([key, label]) => (
                  <div
                    key={key}
                    className="grid grid-cols-[1fr_90px_70px] gap-2 items-center"
                  >
                    <span className="text-[11px] font-medium">{label}</span>
                    <input
                      type="number"
                      min={0}
                      placeholder="₦ N"
                      value={form.fees?.[key]?.n ?? ""}
                      onChange={(e) => setFee(key, "n", e.target.value)}
                      className="px-2 py-1.5 text-xs border bg-light border-slate-200 rounded-lg"
                    />
                    <input
                      type="number"
                      min={0}
                      max={99}
                      placeholder="K"
                      value={form.fees?.[key]?.k ?? ""}
                      onChange={(e) => setFee(key, "k", e.target.value)}
                      className="px-2 py-1.5 text-xs border bg-light border-slate-200 rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Comments only — no official names */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-primary">Comments</h3>
              <p className="text-[10px] text-gray">
                Official names and signature images are managed under Academic Settings.
              </p>
              {COMMENT_FIELDS.map(([key, label]) => (
                <label key={key} className="block space-y-1">
                  <span className="text-[11px] font-semibold">{label}</span>
                  <textarea
                    rows={2}
                    value={form[key]}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, [key]: e.target.value }))
                    }
                    className="w-full px-3 py-2 text-sm border resize-none bg-light border-slate-200 rounded-xl focus:outline-none focus:border-primary"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Footer */}
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

export default ReportDetailsModal;