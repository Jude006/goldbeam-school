import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  ClipboardEdit,
  Loader2,
  Lock,
  Info,
} from "lucide-react";
import { getClasses } from "../../api/classApi";
import { getSubjects } from "../../api/subjectApi";
import { getAcademicSettings } from "../../api/academicSettingsApi";
import { getEntrySheet, saveScores } from "../../api/resultApi";
import Toast from "../../components/ui/Toast";

const SECONDARY_CA_FIELDS = [
  { key: "weeklyExercise1", label: "WE1", title: "1st Weekly Exercise (max 5)", max: 5 },
  { key: "takeHome1", label: "TH1", title: "1st Take-Home (max 5)", max: 5 },
  { key: "midTermTest", label: "MT", title: "Mid-Term Test (max 10)", max: 10 },
  { key: "project", label: "PRJ", title: "Project (max 10)", max: 10 },
  { key: "weeklyExercise2", label: "WE2", title: "2nd Weekly Exercise (max 5)", max: 5 },
  { key: "takeHome2", label: "TH2", title: "2nd Take-Home (max 5)", max: 5 },
];

const PRIMARY_CA_FIELDS = [
  {
    key: "classWork1",
    label: "CW1",
    title: "Class Work Summary 1st Half (max 20)",
    max: 20,
  },
  {
    key: "classWork2",
    label: "CW2",
    title: "Class Work Summary 2nd Half (max 20)",
    max: 20,
  },
];

/** class.level → subjects to show */
const subjectsForClassLevel = (classLevel = "", allSubjects = []) => {
  const level = String(classLevel || "").toUpperCase();

  if (level === "PRIMARY" || level.startsWith("PRIMARY") || level === "NURSERY") {
    return allSubjects.filter((s) => {
      const band = String(s.levelBand || "Both");
      return band === "Primary" || band === "All";
    });
  }

  if (level === "JSS" || level.startsWith("JSS")) {
    return allSubjects.filter((s) => {
      const band = String(s.levelBand || "Both");
      return band === "Junior" || band === "Both" || band === "All";
    });
  }

  if (level === "SS" || level.startsWith("SS")) {
    return allSubjects.filter((s) => {
      const band = String(s.levelBand || "Both");
      return band === "Senior" || band === "Both" || band === "All";
    });
  }

  return allSubjects;
};

const emptySecondaryRow = (r) => ({
  studentId: r.studentId,
  name: r.name,
  admissionNumber: r.admissionNumber,
  weeklyExercise1: r.weeklyExercise1 ?? "",
  takeHome1: r.takeHome1 ?? "",
  midTermTest: r.midTermTest ?? "",
  project: r.project ?? "",
  weeklyExercise2: r.weeklyExercise2 ?? "",
  takeHome2: r.takeHome2 ?? "",
  exam: r.exam ?? "",
  ca: r.ca,
  total: r.total,
  grade: r.grade,
});

const emptyPrimaryRow = (r) => ({
  studentId: r.studentId,
  name: r.name,
  admissionNumber: r.admissionNumber,
  classWork1: r.classWork1 ?? "",
  classWork2: r.classWork2 ?? "",
  exam: r.exam ?? "",
  ca: r.ca,
  total: r.total,
  grade: r.grade,
});

const EnterScores = () => {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [session, setSession] = useState("");
  const [term, setTerm] = useState("1st Term");
  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [scoreMode, setScoreMode] = useState("secondary"); // primary | secondary
  const [locked, setLocked] = useState(false);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSheet, setLoadingSheet] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ type: "", message: "" });

  const isPrimary = scoreMode === "primary";
  const caFields = isPrimary ? PRIMARY_CA_FIELDS : SECONDARY_CA_FIELDS;

  const selectedClass = useMemo(
    () => classes.find((c) => c._id === classId) || null,
    [classes, classId]
  );

  const filteredSubjects = useMemo(
    () => subjectsForClassLevel(selectedClass?.level, subjects),
    [selectedClass, subjects]
  );

  useEffect(() => {
    const boot = async () => {
      setLoading(true);
      try {
        const [classRes, subjectRes, settingsRes] = await Promise.all([
          getClasses(),
          getSubjects(),
          getAcademicSettings(),
        ]);
        const classList = classRes.classes || [];
        const subjectList = subjectRes.subjects || [];
        setClasses(classList);
        setSubjects(subjectList);
        setSession(settingsRes.settings?.session || "");
        setTerm(settingsRes.settings?.currentTerm || "1st Term");
        if (classList[0]) setClassId(classList[0]._id);
      } catch (err) {
        setToast({
          type: "error",
          message: err.response?.data?.message || "Failed to load form data.",
        });
      } finally {
        setLoading(false);
      }
    };
    boot();
  }, []);

  // When class changes, keep valid subject for that level
  useEffect(() => {
    if (!classId || subjects.length === 0) return;

    const cls = classes.find((c) => c._id === classId);
    const allowed = subjectsForClassLevel(cls?.level, subjects);

    if (allowed.length === 0) {
      setSubjectId("");
      return;
    }

    const stillValid = allowed.some((s) => s._id === subjectId);
    if (!stillValid) {
      setSubjectId(allowed[0]._id);
    }
  }, [classId, classes, subjects]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!classId || !subjectId || !session || !term) return;

    const loadSheet = async () => {
      setLoadingSheet(true);
      try {
        const data = await getEntrySheet({ classId, subjectId, session, term });
        const mode = data.meta?.scoreMode === "primary" ? "primary" : "secondary";
        setScoreMode(mode);
        setLocked(!!data.meta?.locked);
        setRows(
          (data.rows || []).map((r) =>
            mode === "primary" ? emptyPrimaryRow(r) : emptySecondaryRow(r)
          )
        );
      } catch (err) {
        setRows([]);
        setToast({
          type: "error",
          message: err.response?.data?.message || "Failed to load students.",
        });
      } finally {
        setLoadingSheet(false);
      }
    };
    loadSheet();
  }, [classId, subjectId, session, term]);

  const updateField = (studentId, field, value, max) => {
    let next = value;
    if (value !== "") {
      const n = Number(value);
      if (Number.isNaN(n)) return;
      next = Math.min(Math.max(n, 0), max);
    }
    setRows((prev) =>
      prev.map((r) =>
        r.studentId === studentId ? { ...r, [field]: next } : r
      )
    );
  };

  const computed = useMemo(
    () =>
      rows.map((r) => {
        if (isPrimary) {
          const hasAny =
            (r.classWork1 !== "" && r.classWork1 != null) ||
            (r.classWork2 !== "" && r.classWork2 != null) ||
            (r.exam !== "" && r.exam != null);
          if (!hasAny) return { ...r, caLive: null, totalLive: null };
          const cw1 =
            r.classWork1 === "" || r.classWork1 == null
              ? 0
              : Number(r.classWork1);
          const cw2 =
            r.classWork2 === "" || r.classWork2 == null
              ? 0
              : Number(r.classWork2);
          const examLive =
            r.exam === "" || r.exam == null ? 0 : Number(r.exam);
          const caLive = cw1 + cw2;
          return { ...r, caLive, totalLive: caLive + examLive };
        }

        const nums = SECONDARY_CA_FIELDS.map((f) =>
          r[f.key] === "" || r[f.key] == null ? 0 : Number(r[f.key])
        );
        const hasAny =
          SECONDARY_CA_FIELDS.some(
            (f) => r[f.key] !== "" && r[f.key] != null
          ) || (r.exam !== "" && r.exam != null);
        if (!hasAny) return { ...r, caLive: null, totalLive: null };
        const caLive = nums.reduce((a, b) => a + b, 0);
        const examLive = r.exam === "" || r.exam == null ? 0 : Number(r.exam);
        return { ...r, caLive, totalLive: caLive + examLive };
      }),
    [rows, isPrimary]
  );

  const handleSave = async (e) => {
    e.preventDefault();
    if (locked) {
      setToast({
        type: "error",
        message: "Results are published. Unpublish before editing.",
      });
      return;
    }

    if (!subjectId) {
      setToast({
        type: "error",
        message:
          "No subject for this class level. Add a matching subject first.",
      });
      return;
    }

    let scores = [];

    if (isPrimary) {
      scores = rows
        .filter(
          (r) =>
            (r.classWork1 !== "" && r.classWork1 != null) ||
            (r.classWork2 !== "" && r.classWork2 != null) ||
            (r.exam !== "" && r.exam != null)
        )
        .map((r) => ({
          studentId: r.studentId,
          classWork1:
            r.classWork1 === "" || r.classWork1 == null
              ? 0
              : Number(r.classWork1),
          classWork2:
            r.classWork2 === "" || r.classWork2 == null
              ? 0
              : Number(r.classWork2),
          exam: r.exam === "" || r.exam == null ? 0 : Number(r.exam),
        }));
    } else {
      scores = rows
        .filter((r) => {
          const comps = SECONDARY_CA_FIELDS.some(
            (f) => r[f.key] !== "" && r[f.key] != null
          );
          return comps || (r.exam !== "" && r.exam != null);
        })
        .map((r) => ({
          studentId: r.studentId,
          weeklyExercise1:
            r.weeklyExercise1 === "" ? 0 : Number(r.weeklyExercise1),
          takeHome1: r.takeHome1 === "" ? 0 : Number(r.takeHome1),
          midTermTest: r.midTermTest === "" ? 0 : Number(r.midTermTest),
          project: r.project === "" ? 0 : Number(r.project),
          weeklyExercise2:
            r.weeklyExercise2 === "" ? 0 : Number(r.weeklyExercise2),
          takeHome2: r.takeHome2 === "" ? 0 : Number(r.takeHome2),
          exam: r.exam === "" ? 0 : Number(r.exam),
        }));
    }

    if (!scores.length) {
      setToast({
        type: "error",
        message: "Enter at least one score before saving.",
      });
      return;
    }

    setSaving(true);
    try {
      const data = await saveScores({
        classId,
        subjectId,
        session,
        term,
        scores,
      });
      setToast({
        type: "success",
        message:
          data.message || `Saved ${data.savedCount} score(s) successfully.`,
      });

      const sheet = await getEntrySheet({
        classId,
        subjectId,
        session,
        term,
      });
      const mode =
        sheet.meta?.scoreMode === "primary" ? "primary" : "secondary";
      setScoreMode(mode);
      setRows(
        (sheet.rows || []).map((r) =>
          mode === "primary" ? emptyPrimaryRow(r) : emptySecondaryRow(r)
        )
      );
    } catch (err) {
      setToast({
        type: "error",
        message: err.response?.data?.message || "Could not save scores.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-20 text-sm text-gray">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading...
      </div>
    );
  }

  const colSpan = isPrimary ? 7 : 11;

  return (
    <div className="space-y-6 select-none font-body text-dark">
      <Toast
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ type: "", message: "" })}
      />

      <div className="flex flex-col gap-3 p-6 bg-white border shadow-xs sm:flex-row sm:items-center rounded-2xl border-slate-200/80">
        <div className="flex items-center flex-1 gap-3">
          <Link
            to="/admin/results"
            className="p-2 cursor-pointer bg-light rounded-xl hover:bg-slate-200/80"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase font-heading text-primary">
              <ClipboardEdit className="w-4 h-4 text-secondary" />
              Enter Results
            </div>
            <h1 className="text-xl font-extrabold font-heading sm:text-2xl">
              Record Scores
            </h1>
            <p className="text-xs text-gray mt-0.5">
              {session} ·{" "}
              {isPrimary
                ? "Primary: CW1 (20) + CW2 (20) + Exam (60) = 100"
                : "Secondary: CA parts (40) + Exam (60) = 100"}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {isPrimary && (
            <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-heading font-bold">
              Primary mode
            </span>
          )}
          {locked && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-heading font-bold">
              <Lock className="w-3.5 h-3.5" /> Published (locked)
            </span>
          )}
        </div>
      </div>

      <div className="flex items-start gap-2 px-4 py-3 text-[11px] text-gray bg-primary/5 border border-primary/15 rounded-xl">
        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <p>
          <strong className="text-dark">How to use:</strong> Pick class &amp;
          subject. Primary classes use class-work halves + exam. JSS/SS keep the
          secondary CA breakdown. Subjects are filtered by class level.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 p-4 bg-white border shadow-xs rounded-2xl border-slate-200/80 sm:grid-cols-3">
        <div>
          <label className="block mb-1 text-xs font-semibold">Class</label>
          <select
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            className="w-full px-3 py-2 text-sm border cursor-pointer bg-light border-slate-200 rounded-xl focus:outline-none focus:border-primary"
          >
            {classes.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
                {c.level ? ` (${c.level})` : ""}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 text-xs font-semibold">
            Subject
            {selectedClass?.level === "Primary" && (
              <span className="ml-1 font-normal text-gray">(Primary)</span>
            )}
            {selectedClass?.level === "JSS" && (
              <span className="ml-1 font-normal text-gray">(Junior)</span>
            )}
            {selectedClass?.level === "SS" && (
              <span className="ml-1 font-normal text-gray">(Senior)</span>
            )}
          </label>
          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="w-full px-3 py-2 text-sm border cursor-pointer bg-light border-slate-200 rounded-xl focus:outline-none focus:border-primary"
          >
            {filteredSubjects.length === 0 ? (
              <option value="">No subjects for this class level</option>
            ) : (
              filteredSubjects.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                  {s.levelBand && s.levelBand !== "Both"
                    ? ` · ${s.levelBand}`
                    : ""}
                </option>
              ))
            )}
          </select>
        </div>
        <div>
          <label className="block mb-1 text-xs font-semibold">Term</label>
          <select
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="w-full px-3 py-2 text-sm border cursor-pointer bg-light border-slate-200 rounded-xl focus:outline-none focus:border-primary"
          >
            <option value="1st Term">1st Term</option>
            <option value="2nd Term">2nd Term</option>
            <option value="3rd Term">3rd Term</option>
          </select>
        </div>
      </div>

      <form
        onSubmit={handleSave}
        className="overflow-hidden bg-white border shadow-xs rounded-2xl border-slate-200/80"
      >
        {loadingSheet ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-gray">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading students...
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table
                className={`w-full text-[11px] text-left ${
                  isPrimary ? "min-w-[640px]" : "min-w-[900px]"
                }`}
              >
                <thead>
                  <tr className="border-b border-slate-100 font-heading font-bold text-gray uppercase tracking-wider bg-slate-50/60">
                    <th className="px-3 py-3 sticky left-0 bg-slate-50">
                      Student
                    </th>
                    {caFields.map((f) => (
                      <th
                        key={f.key}
                        className="px-2 py-3 text-center"
                        title={f.title}
                      >
                        {f.label}
                      </th>
                    ))}
                    <th className="px-2 py-3 text-center" title="Exam max 60">
                      Exam
                    </th>
                    <th className="px-2 py-3 text-center">CA</th>
                    <th className="px-2 py-3 text-center">Total</th>
                    <th className="px-2 py-3 text-center">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {computed.length === 0 ? (
                    <tr>
                      <td
                        colSpan={colSpan}
                        className="py-10 text-center text-gray"
                      >
                        No active students in this class.
                      </td>
                    </tr>
                  ) : (
                    computed.map((r) => (
                      <tr key={r.studentId} className="hover:bg-light/40">
                        <td className="px-3 py-2 sticky left-0 bg-white">
                          <p className="text-xs font-bold font-heading">
                            {r.name}
                          </p>
                          <p className="text-[10px] text-gray font-mono">
                            {r.admissionNumber}
                          </p>
                        </td>
                        {caFields.map((f) => (
                          <td key={f.key} className="px-1 py-2 text-center">
                            <input
                              type="number"
                              min={0}
                              max={f.max}
                              disabled={locked}
                              title={f.title}
                              value={r[f.key]}
                              onChange={(e) =>
                                updateField(
                                  r.studentId,
                                  f.key,
                                  e.target.value,
                                  f.max
                                )
                              }
                              className="w-14 px-1 py-1.5 text-center bg-light border border-slate-200 rounded-lg focus:outline-none focus:border-primary disabled:opacity-50"
                            />
                          </td>
                        ))}
                        <td className="px-1 py-2 text-center">
                          <input
                            type="number"
                            min={0}
                            max={60}
                            disabled={locked}
                            title="End of term exam (max 60)"
                            value={r.exam}
                            onChange={(e) =>
                              updateField(
                                r.studentId,
                                "exam",
                                e.target.value,
                                60
                              )
                            }
                            className="w-14 px-1 py-1.5 text-center bg-light border border-slate-200 rounded-lg focus:outline-none focus:border-primary disabled:opacity-50"
                          />
                        </td>
                        <td className="px-2 py-2 font-bold text-center">
                          {r.caLive ?? r.ca ?? "—"}
                        </td>
                        <td className="px-2 py-2 font-bold text-center">
                          {r.totalLive ?? r.total ?? "—"}
                        </td>
                        <td className="px-2 py-2 font-bold text-center text-primary">
                          {r.grade || "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-t border-slate-100">
              <p className="text-[10px] text-gray">
                {isPrimary
                  ? "CW1 + CW2 = CA (40) · + Exam (60) = Total (100)"
                  : "WE1+TH1+MT+PRJ+WE2+TH2 = CA (40) · + Exam (60) = Total (100)"}
              </p>
              <button
                type="submit"
                disabled={
                  saving || locked || computed.length === 0 || !subjectId
                }
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-xs font-heading font-bold rounded-xl cursor-pointer disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Scores
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default EnterScores;