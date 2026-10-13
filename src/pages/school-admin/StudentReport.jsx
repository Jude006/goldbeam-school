import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, Printer, Loader2, Pencil, ImageIcon, Loader2Icon } from "lucide-react";
import { getStudentReport, saveTermReport } from "../../api/resultApi";
import Toast from "../../components/ui/Toast";
import { useAuth } from "../../context/AuthContext";
import ReportDetailsModal from "../../components/admin/ReportDetailsModal";
import html2canvas from "html2canvas";

// Same base URL logic as AcademicSettings page
const API_ORIGIN =
  (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(
    /\/api\/?$/,
    "",
  ) || "http://localhost:5000";

const assetUrl = (path) => {
  if (!path) return "";
  if (typeof path !== "string") return "";
  const trimmed = path.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `${API_ORIGIN}${trimmed.startsWith("/") ? trimmed : `/${trimmed}`}`;
};

/** Same idea as Academic Settings <img src={sigUrl(...)} /> */
const SignatureMark = ({ src, alt = "Signature" }) => {
  const [failed, setFailed] = useState(false);
  const url = assetUrl(src);

  useEffect(() => {
    setFailed(false);
  }, [src, url]);

  if (!url || failed) {
    return (
      <span className="inline-block w-24 align-bottom border-b border-black" />
    );
  }

  return (
    <img
      src={url}
      alt={alt}
      className="inline-block h-7 max-w-[110px] align-bottom object-contain"
      onError={() => {
        console.warn("Signature image failed to load:", url);
        setFailed(true);
      }}
    />
  );
};

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

const FEE_MAP = [
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

const OFFICIAL_GRADE_KEY = [
  ["A", "80 - 100"],
  ["B", "70 - 80"],
  ["C", "55 - 69"],
  ["D", "40 - 54"],
  ["E", "00 - 39"],
];

const SCORE_COLUMNS = [
  {
    letter: "a",
    max: "5",
    label: "1st Set Weekly Exercise",
    field: "weeklyExercise1",
    width: "3.4%",
  },
  {
    letter: "b",
    max: "5",
    label: "Take Home Assignment",
    field: "takeHome1",
    width: "3.4%",
  },
  {
    letter: "c",
    max: "10",
    label: "Mid Term Test",
    field: "midTermTest",
    width: "3.4%",
  },
  { letter: "d", max: "10", label: "Project", field: "project", width: "3.4%" },
  {
    letter: "e",
    max: "5",
    label: "1st Set Weekly Exercise",
    field: "weeklyExercise2",
    width: "3.4%",
  },
  {
    letter: "f",
    max: "5",
    label: "Take Home Assignment",
    field: "takeHome2",
    width: "3.4%",
  },
  {
    letter: "g",
    max: "40",
    label: "Summary of Continous Assignment",
    field: "ca",
    width: "3.6%",
  },
  {
    letter: "h",
    max: "60",
    label: "End of Term Examination",
    field: "exam",
    width: "3.6%",
  },
  {
    letter: "i",
    max: "100",
    label: "Total Score",
    field: "total",
    width: "3.6%",
  },
  {
    letter: "j",
    max: "",
    label: "Position",
    field: "subjectPosition",
    width: "3.4%",
  },
  {
    letter: "k",
    max: "",
    label: "Class Average",
    field: "classAverage",
    width: "3.4%",
  },
  {
    letter: "l",
    max: "",
    label: "Grade (ACPF)",
    field: "grade",
    width: "3.4%",
  },
];

const MIN_SUBJECT_ROWS = 19;

const resolveLevelBand = (level = "", name = "") => {
  const raw = `${level || ""} ${name || ""}`.replace(/\s+/g, "").toUpperCase();
  if (/JSS[1-3]/.test(raw) || raw.includes("JUNIOR")) return "JUNIOR SECONDARY";
  if (
    /(^|[^A-Z])SS[1-3]/.test(raw) ||
    raw.startsWith("SS") ||
    raw.includes("SENIOR")
  ) {
    return "SENIOR SECONDARY";
  }
  return "JUNIOR SECONDARY";
};

const cell = (v) => (v === null || v === undefined || v === "" ? "" : v);

const feeN = (fees, key) => {
  const n = fees?.[key]?.n;
  return n === null || n === undefined || n === "" ? "" : n;
};

const feeK = (fees, key) => {
  const k = fees?.[key]?.k;
  return k === null || k === undefined || k === "" ? "" : k;
};

const feesTotalN = (fees = {}) => {
  let t = 0;
  let any = false;
  FEE_MAP.forEach(([key]) => {
    const n = fees?.[key]?.n;
    if (n !== null && n !== undefined && n !== "") {
      any = true;
      t += Number(n) || 0;
    }
  });
  return any ? t : "";
};

const StudentReport = () => {
  const { studentId } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ type: "", message: "" });
  const [form, setForm] = useState({});
  const [savingImage, setSavingImage] = useState(false);

  const handleSaveAsImage = async () => {
    const el = document.getElementById("report-card");
    if (!el) {
      setToast({ type: "error", message: "Report card not found." });
      return;
    }

    setSavingImage(true);
    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const link = document.createElement("a");
      const name =
        (report?.student?.admissionNumber || "report").replace(/\//g, "-") +
        `_${report?.term || "term"}`.replace(/\s+/g, "-") +
        ".png";

      link.download = name;
      link.href = canvas.toDataURL("image/png");
      link.click();

      setToast({ type: "success", message: "Report saved as image." });
    } catch (err) {
      console.error("Save as image failed:", err);
      setToast({
        type: "error",
        message: "Could not save image. Try Print / PDF instead.",
      });
    } finally {
      setSavingImage(false);
    }
  };

  const sessionQ = searchParams.get("session") || "";
  const termQ = searchParams.get("term") || "";

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (sessionQ) params.session = sessionQ;
      if (termQ) params.term = termQ;
      const data = await getStudentReport(studentId, params);
      const r = data.report;
      setReport(r);
      setForm({
        house: r.house || "",
        year: r.year || "",
        nextTermBegins: r.nextTermBegins || "",
        behaviours: r.behaviours || {},
        skills: r.skills || {},
        fees: r.fees || {},
        formTeacherComment: r.formTeacherComment || "",
        houseMasterComment: r.houseMasterComment || "",
        guidanceCounsellorComment: r.guidanceCounsellorComment || "",
        principalComment: r.principalComment || "",
        behavioursEnteredBy: r.behavioursEnteredBy || "",
        formTeacherName: r.formTeacherName || "",
        houseMasterName: r.houseMasterName || "",
        guidanceCounsellorName: r.guidanceCounsellorName || "",
        principalName: r.principalName || "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load report.");
    } finally {
      setLoading(false);
    }
  }, [studentId, sessionQ, termQ]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-sm text-slate-600">
        <Loader2 className="w-6 h-6 animate-spin" />
        Loading report...
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <p className="text-sm font-semibold text-red-600">
          {error || "Report not found."}
        </p>
        <Link
          to="/admin/results"
          className="inline-flex items-center gap-2 text-sm font-bold text-primary"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Results
        </Link>
      </div>
    );
  }

  const levelBand =
    report.levelBand ||
    resolveLevelBand(report.student?.level, report.student?.className);

  const subjects = report.subjects || [];
  const padRows = Math.max(0, MIN_SUBJECT_ROWS - subjects.length);
  const fees = report.fees || {};
  const filledDate = report.reportFilledDate || "";

  return (
    <div className="p-4 bg-white">
      <Toast
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ type: "", message: "" })}
      />

      <div className="flex items-center justify-between mb-4 no-print">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 text-sm font-medium cursor-pointer text-primary"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 text-[11px] font-bold rounded-full bg-slate-100 text-slate-700">
            {report.status === "published" ? "Published" : "Draft preview"}
          </span>
          {isAdmin && report.status !== "published" && (
            <button
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl hover:bg-light cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit comments / behaviour
            </button>
          )}
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold border cursor-pointer border-slate-200 rounded-xl hover:bg-light"
          >
            <Printer className="w-4 h-4" /> Print / PDF
          </button>

          <button
            type="button"
            onClick={handleSaveAsImage}
            disabled={savingImage}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold border cursor-pointer border-slate-200 rounded-xl hover:bg-light disabled:opacity-60"
          >
            {savingImage ? (
              <Loader2Icon className="w-4 h-4 animate-spin" />
            ) : (
              <ImageIcon className="w-4 h-4" />
            )}
            {savingImage ? "Saving..." : "Save as Image"}
          </button>
        </div>
      </div>

      <div
        id="report-card"
        className="mx-auto bg-white text-black border-[1.5px] border-black p-3"
        style={{
          width: "100%",
          maxWidth: "1123px",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        {/* ================= HEADER (unchanged) ================= */}
        <div className="relative flex flex-col items-center pb-2 text-center border-b-[1.5px] border-black">
          <img
            src="/images/MARIAN FOUNDATION LOGO.png"
            alt="School crest"
            className="object-contain w-14 h-14"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <div className="text-[13px] font-bold uppercase leading-tight">
            Onitsha Archdiocesan School System,
          </div>
          <div className="text-[13px] font-bold uppercase leading-tight">
            Anambra State
          </div>
          <div className="text-[12px] font-bold uppercase leading-tight">
            {levelBand}
          </div>
          <div className="text-[12px] font-bold uppercase leading-tight">
            Termly Report
          </div>
          <div className="text-[10px] uppercase leading-tight">
            {report.schoolName || ""}
          </div>
          <span className="absolute top-0 right-0 text-[9px] italic">
            Original
          </span>
        </div>

        {/* ================= IDENTITY (unchanged) ================= */}
        <div className="grid grid-cols-2 gap-x-6 py-2 text-[10px] border-b-[1.5px] border-black">
          <div className="space-y-1">
            <div className="flex items-end gap-1">
              <span className="font-bold uppercase whitespace-nowrap">
                NAME OF SCHOOL:
              </span>
              <span className="flex-1 border-b border-black">
                {report.schoolName || "\u00A0"}
              </span>
            </div>
            <div className="flex items-end gap-1">
              <span className="font-bold uppercase whitespace-nowrap">
                NAME OF STUDENT:
              </span>
              <span className="flex-1 border-b border-black">
                {report.student?.name || "\u00A0"}
              </span>
            </div>
            <div className="flex items-end gap-1">
              <span className="font-bold uppercase whitespace-nowrap">
                ADMISSION NO:
              </span>
              <span className="flex-1 border-b border-black">
                {report.student?.admissionNumber || "\u00A0"}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <div className="flex items-end gap-1">
              <span className="font-bold uppercase whitespace-nowrap">
                HOUSE:
              </span>
              <span className="flex-1 border-b border-black">
                {report.house || "\u00A0"}
              </span>
            </div>
            <div className="flex items-end gap-1">
              <span className="font-bold uppercase whitespace-nowrap">
                CLASS:
              </span>
              <span className="flex-1 border-b border-black">
                {report.student?.className || "\u00A0"}
              </span>
            </div>
            <div className="flex items-end gap-1">
              <span className="font-bold uppercase whitespace-nowrap">
                TERM:
              </span>
              <span className="flex-1 border-b border-black">
                {report.term || "\u00A0"}
              </span>
            </div>
            <div className="flex items-end gap-1">
              <span className="font-bold uppercase whitespace-nowrap">
                NUMBER IN CLASS:
              </span>
              <span className="flex-1 border-b border-black">
                {report.numberInClass ?? "\u00A0"}
              </span>
            </div>
            <div className="flex items-end gap-1">
              <span className="font-bold uppercase whitespace-nowrap">
                NEXT TERM BEGINS:
              </span>
              <span className="flex-1 border-b border-black">
                {report.nextTermBegins || "\u00A0"}
              </span>
            </div>
            <div className="flex items-end gap-1">
              <span className="font-bold uppercase whitespace-nowrap">
                YEAR:
              </span>
              <span className="flex-1 border-b border-black">
                {report.year || "\u00A0"}
              </span>
            </div>
          </div>
        </div>

        {/* ================= MAIN BODY ================= */}
        <div className="grid grid-cols-[1fr_270px] gap-2 pt-2">
          {/* LEFT COLUMN */}
          <div>
            <div className="grid grid-cols-[150px_1fr] gap-2 mb-1">
              <div className="border-[1.5px] border-black p-1">
                <p className="text-[10px] font-bold underline">KEY TO GRADES</p>
                {OFFICIAL_GRADE_KEY.map(([g, r]) => (
                  <p key={g} className="text-[10px] leading-[13px]">
                    {g} = {r}
                  </p>
                ))}
              </div>
              <div className="flex flex-col justify-center px-1">
                <p className="text-[10px] font-bold uppercase leading-tight">
                  MARKS OBTAINABLE IN SIX (CORE SUBJECTS) AND UP TO A MAXIMUM OF
                  NINE SUBJECTS TO BE OFFERED
                </p>
                <p className="text-[8px] italic leading-tight">
                  Core subjects are those subjects which will enable a student
                  to offer any course of study in a Higher Education. Fill in
                  elective as appropriate to the students.
                </p>
              </div>
            </div>

            {/* ============ SCORE GRID (redesigned header) ============ */}
            <table
              className="w-full border-collapse table-fixed"
              style={{
                borderTop: "1.5px solid #000",
                borderLeft: "1.5px solid #000",
              }}
            >
              <colgroup>
                <col style={{ width: "26%" }} />
                {SCORE_COLUMNS.map((c) => (
                  <col key={c.letter} style={{ width: c.width }} />
                ))}
                <col style={{ width: "14%" }} />
                <col style={{ width: "12%" }} />
              </colgroup>

              <thead>
                {/* ROW 1 — column letters a … m */}
                <tr>
                  <th
                    rowSpan={3}
                    className="border-r-[1.5px] border-b-[1.5px] border-black align-bottom text-left px-1 pb-1 text-[9px] font-bold uppercase"
                  >
                    Subject
                  </th>
                  {SCORE_COLUMNS.map((c) => (
                    <th
                      key={`ltr-${c.letter}`}
                      className="border-r border-b border-black text-center text-[9px] font-bold leading-[12px] h-[14px]"
                    >
                      {c.letter}
                    </th>
                  ))}
                  <th className="border-r border-b border-black text-center text-[9px] font-bold leading-[12px] h-[14px]">
                    m
                  </th>
                  <th className="border-r-[1.5px] border-b border-black text-center text-[9px] font-bold leading-[12px] h-[14px]">
                    n
                  </th>
                </tr>

                {/* ROW 2 — labels (vertical, uniform height) */}
                <tr>
                  {SCORE_COLUMNS.map((c) => (
                    <th
                      key={`lbl-${c.letter}`}
                      className="border-r border-b border-black p-0 align-middle"
                      style={{ height: "108px" }}
                    >
                      <div className="flex items-center justify-center w-full h-full">
                        <span
                          className="block text-[8px] font-semibold leading-[9px] text-center whitespace-normal"
                          style={{
                            writingMode: "vertical-rl",
                            transform: "rotate(180deg)",
                            maxHeight: "104px",
                            width: "100%",
                          }}
                        >
                          {c.label}
                        </span>
                      </div>
                    </th>
                  ))}
                  <th
                    className="border-r border-b border-black p-0 align-middle"
                    style={{ height: "108px" }}
                  >
                    <div className="flex items-center justify-center w-full h-full">
                      <span
                        className="block text-[8px] font-semibold leading-[9px] text-center"
                        style={{
                          writingMode: "vertical-rl",
                          transform: "rotate(180deg)",
                        }}
                      >
                        Subject Master&apos;s Remark
                      </span>
                    </div>
                  </th>
                  <th
                    className="border-r-[1.5px] border-b border-black p-0 align-middle"
                    style={{ height: "108px" }}
                  >
                    <div className="flex items-center justify-center w-full h-full">
                      <span
                        className="block text-[8px] font-semibold leading-[9px] text-center"
                        style={{
                          writingMode: "vertical-rl",
                          transform: "rotate(180deg)",
                        }}
                      >
                        Signature
                      </span>
                    </div>
                  </th>
                </tr>

                {/* ROW 3 — max obtainable marks */}
                <tr>
                  {SCORE_COLUMNS.map((c) => (
                    <th
                      key={`max-${c.letter}`}
                      className="border-r border-b-[1.5px] border-black text-center text-[9px] font-bold leading-[12px] h-[14px]"
                    >
                      {c.max || "\u00A0"}
                    </th>
                  ))}
                  <th className="border-r border-b-[1.5px] border-black h-[14px]">
                    &nbsp;
                  </th>
                  <th className="border-r-[1.5px] border-b-[1.5px] border-black h-[14px]">
                    &nbsp;
                  </th>
                </tr>
              </thead>

              <tbody>
                {subjects.map((s, idx) => (
                  <tr key={s._id || s.subjectName || idx}>
                    <td className="border-r-[1.5px] border-b border-black px-1 text-[9px] leading-[14px] h-[16px] whitespace-nowrap overflow-hidden">
                      {idx + 1}. {s.subjectName}
                    </td>
                    {SCORE_COLUMNS.map((c) => (
                      <td
                        key={c.letter}
                        className="border-r border-b border-black text-center text-[9px] leading-[14px] h-[16px]"
                      >
                        {cell(s[c.field])}
                      </td>
                    ))}
                    <td className="border-r border-b border-black text-center text-[8px] leading-[14px] h-[16px]">
                      {cell(s.remark)}
                    </td>
                    <td className="border-r-[1.5px] border-b border-black h-[16px]">
                      &nbsp;
                    </td>
                  </tr>
                ))}
                {Array.from({ length: padRows }).map((_, i) => (
                  <tr key={`pad-${i}`}>
                    <td className="border-r-[1.5px] border-b border-black px-1 text-[9px] leading-[14px] h-[16px]">
                      {subjects.length + i + 1}.
                    </td>
                    {SCORE_COLUMNS.map((c) => (
                      <td
                        key={c.letter}
                        className="border-r border-b border-black h-[16px]"
                      >
                        &nbsp;
                      </td>
                    ))}
                    <td className="border-r border-b border-black h-[16px]">
                      &nbsp;
                    </td>
                    <td className="border-r-[1.5px] border-b border-black h-[16px]">
                      &nbsp;
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* TOTALS + FORM TEACHER + FEES */}
            <div className="grid grid-cols-[1fr_230px] gap-2 mt-2">
              <div>
                <div className="grid grid-cols-3 gap-2 text-[10px]">
                  <div className="flex items-end gap-1">
                    <span className="font-bold whitespace-nowrap">
                      Total Score:
                    </span>
                    <span className="flex-1 border-b border-black">
                      {cell(report.totalScore)}
                    </span>
                  </div>
                  <div className="flex items-end gap-1">
                    <span className="font-bold whitespace-nowrap">
                      Average Score:
                    </span>
                    <span className="flex-1 border-b border-black">
                      {report.average != null ? `${report.average}%` : ""}
                    </span>
                  </div>
                  <div className="flex items-end gap-1">
                    <span className="font-bold whitespace-nowrap">
                      Position:
                    </span>
                    <span className="flex-1 border-b border-black">
                      {report.position ?? ""}
                      {report.outOf ? ` / ${report.outOf}` : ""}
                    </span>
                  </div>
                </div>

                <div className="mt-2">
                  <p className="text-[10px] font-bold">
                    Form Teacher&apos;s Comments:
                  </p>
                  <p className="text-[10px] leading-[15px] border-b border-black min-h-[15px]">
                    {report.formTeacherComment || "\u00A0"}
                  </p>
                  <p className="text-[10px] leading-[15px] border-b border-black min-h-[15px]">
                    &nbsp;
                  </p>
                  <div className="flex items-end gap-6 mt-1 text-[10px]">
                    <span className="flex items-end gap-1">
                      Signature:
                      <SignatureMark
                        src={report.formTeacherSignature}
                        alt="Form teacher signature"
                      />
                    </span>
                    <span className="flex items-end flex-1 gap-1">
                      Date:
                      <span className="flex-1 border-b border-black">
                        {report.formTeacherDate || filledDate || ""}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Fees — bound to report.fees */}
              <div>
                <table className="w-full border-collapse border-[1.5px] border-black">
                  <thead>
                    <tr>
                      <th className="border border-black text-left px-1 text-[9px] font-bold h-[14px]">
                        Fees
                      </th>
                      <th className="border border-black text-center text-[9px] font-bold w-[38px] h-[14px]">
                        K
                      </th>
                      <th className="border border-black text-center text-[9px] font-bold w-[52px] h-[14px]">
                        N
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {FEE_MAP.map(([key, label]) => (
                      <tr key={key}>
                        <td className="border border-black px-1 text-[9px] leading-[13px] h-[15px]">
                          {label}
                        </td>
                        <td className="border border-black text-center text-[9px] h-[15px]">
                          {feeK(fees, key)}
                        </td>
                        <td className="border border-black text-center text-[9px] h-[15px]">
                          {feeN(fees, key)}
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td className="border border-black px-1 text-[9px] font-bold h-[15px]">
                        TOTAL
                      </td>
                      <td className="border border-black h-[15px]">&nbsp;</td>
                      <td className="border border-black text-center text-[9px] font-bold h-[15px]">
                        {feesTotalN(fees)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN — behaviour / motor skills */}
          <div>
            <div className="border-[1.5px] border-black p-1 mb-1">
              <p className="text-[10px] font-bold underline">KEY TO GRADES</p>
              <p className="text-[9px] leading-[12px]">5 - Excellent</p>
              <p className="text-[9px] leading-[12px]">4 - Good</p>
              <p className="text-[9px] leading-[12px]">3 - Fair</p>
              <p className="text-[9px] leading-[12px]">2 - Poor</p>
              <p className="text-[9px] leading-[12px]">1 - Very Poor</p>
            </div>

            <table className="w-full border-collapse border-[1.5px] border-black">
              <thead>
                <tr>
                  <th className="border border-black text-left px-1 text-[9px] font-bold h-[14px]">
                    SOCIAL BEHAVIOUR
                  </th>
                  <th className="border border-black text-center text-[9px] font-bold w-[52px] h-[14px]">
                    Ratings
                  </th>
                  <th className="border border-black text-center text-[9px] font-bold w-[56px] h-[14px]">
                    Entered by
                  </th>
                </tr>
              </thead>
              <tbody>
                {BEHAVIOUR_KEYS.map(([key, label]) => (
                  <tr key={key}>
                    <td className="border border-black px-1 text-[9px] leading-[13px] h-[15px]">
                      {label}
                    </td>
                    <td className="border border-black text-center text-[9px] h-[15px]">
                      {report.behaviours?.[key] ?? ""}
                    </td>
                    <td className="border border-black h-[15px]">&nbsp;</td>
                  </tr>
                ))}
                <tr>
                  <td
                    colSpan={3}
                    className="border border-black px-1 text-[9px] font-bold h-[14px] uppercase"
                  >
                    MOTOR SKILLS
                  </td>
                </tr>
                {SKILL_KEYS.map(([key, label]) => (
                  <tr key={key}>
                    <td className="border border-black px-1 text-[9px] leading-[13px] h-[15px]">
                      {label}
                    </td>
                    <td className="border border-black text-center text-[9px] h-[15px]">
                      {report.skills?.[key] ?? ""}
                    </td>
                    <td className="border border-black h-[15px]">&nbsp;</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex items-end gap-1 mt-1 text-[9px]">
              Entered by:{" "}
              <span className="flex-1 border-b border-black">
                {report.behavioursEnteredBy || "____________"}
              </span>
            </div>
          </div>
        </div>

        {/* ================= COMMENT BLOCKS ================= */}
        <div className="grid grid-cols-3 gap-3 pt-2 mt-2 border-t-[1.5px] border-black">
          <div>
            <p className="text-[10px] font-bold uppercase">
              HOUSE MASTER&apos;S COMMENTS
            </p>
            <p className="text-[10px] leading-[15px] border-b border-black min-h-[15px]">
              {report.houseMasterComment || "\u00A0"}
            </p>
            <p className="text-[10px] leading-[15px] border-b border-black min-h-[15px]">
              &nbsp;
            </p>
            <p className="flex items-end gap-1 mt-1 text-[9px]">
              SIGNATURE{" "}
              <SignatureMark
                src={report.houseMasterSignature}
                alt="House master signature"
              />
            </p>
            <p className="flex items-end gap-3 mt-1 text-[9px]">
              <span className="flex items-end flex-1 gap-1">
                NAME{" "}
                <span className="flex-1 border-b border-black">
                  {report.houseMasterName || ""}
                </span>
              </span>
              <span className="flex items-end flex-1 gap-1">
                DATE{" "}
                <span className="flex-1 border-b border-black">
                  {report.houseMasterDate || filledDate || ""}
                </span>
              </span>
            </p>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase">
              (GUIDANCE COUNSELLOR&apos;S COMMENTS)
            </p>
            <p className="text-[10px] leading-[15px] border-b border-black min-h-[15px]">
              {report.guidanceCounsellorComment || "\u00A0"}
            </p>
            <p className="text-[10px] leading-[15px] border-b border-black min-h-[15px]">
              &nbsp;
            </p>
            <p className="flex items-end gap-1 mt-1 text-[9px]">
              SIGNATURE{" "}
              <SignatureMark
                src={report.guidanceCounsellorSignature}
                alt="Guidance counsellor signature"
              />
            </p>
            <p className="flex items-end gap-3 mt-1 text-[9px]">
              <span className="flex items-end flex-1 gap-1">
                NAME{" "}
                <span className="flex-1 border-b border-black">
                  {report.guidanceCounsellorName || ""}
                </span>
              </span>
              <span className="flex items-end flex-1 gap-1">
                DATE{" "}
                <span className="flex-1 border-b border-black">
                  {report.guidanceCounsellorDate || filledDate || ""}
                </span>
              </span>
            </p>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase">
              PRINCIPAL&apos;S COMMENTS
            </p>
            <p className="text-[10px] leading-[15px] border-b border-black min-h-[15px]">
              {report.principalComment || "\u00A0"}
            </p>
            <p className="text-[10px] leading-[15px] border-b border-black min-h-[15px]">
              &nbsp;
            </p>
            <p className="flex items-end gap-1 mt-1 text-[9px]">
              SIGNATURE:{" "}
              <SignatureMark
                src={report.principalSignature}
                alt="Principal signature"
              />
            </p>
            <p className="flex items-end gap-1 mt-1 text-[9px]">
              NAME OF PRINCIPAL:{" "}
              <span className="flex-1 border-b border-black">
                {report.principalName || ""}
              </span>
            </p>
            <p className="flex items-end gap-1 mt-1 text-[9px]">
              DATE{" "}
              <span className="flex-1 border-b border-black">
                {report.principalDate || filledDate || ""}
              </span>
            </p>
          </div>
        </div>
      </div>

      <ReportDetailsModal
        open={editing}
        onClose={() => setEditing(false)}
        initialData={form}
        studentName={report.student?.name}
        className={report.student?.className}
        session={report.session}
        term={report.term}
        saving={saving}
        onSave={async (payload) => {
          setSaving(true);
          try {
            await saveTermReport(studentId, {
              session: report.session,
              term: report.term,
              ...payload,
            });
            setToast({
              type: "success",
              message: "Report details saved successfully.",
            });
            setEditing(false);
            await load();
          } catch (err) {
            setToast({
              type: "error",
              message: err.response?.data?.message || "Could not save.",
            });
          } finally {
            setSaving(false);
          }
        }}
      />

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #report-card, #report-card * { visibility: visible; }
          #report-card {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: 1.5px solid #000 !important;
          }
          .no-print { display: none !important; }
          #report-card table { page-break-inside: avoid; }
          @page { size: A4 landscape; margin: 6mm; }
        }
      `}</style>
    </div>
  );
};

export default StudentReport;
