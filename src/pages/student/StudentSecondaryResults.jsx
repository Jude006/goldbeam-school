import React, { useEffect, useRef, useState } from "react";
import {
  Download,
  Image as ImageIcon,
  Filter,
  Calendar,
  Layers,
  Loader2,
  AlertCircle,
  Printer,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getStudentReport } from "../../api/resultApi";
import { getAcademicSettings } from "../../api/academicSettingsApi";

const TERMS = ["1st Term", "2nd Term", "3rd Term"];

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
  { letter: "a", max: "5", label: "1st Set Weekly Exercise", field: "weeklyExercise1" },
  { letter: "b", max: "5", label: "Take Home Assignment", field: "takeHome1" },
  { letter: "c", max: "10", label: "Mid Term Test", field: "midTermTest" },
  { letter: "d", max: "10", label: "Project", field: "project" },
  { letter: "e", max: "5", label: "1st Set Weekly Exercise", field: "weeklyExercise2" },
  { letter: "f", max: "5", label: "Take Home Assignment", field: "takeHome2" },
  { letter: "g", max: "40", label: "Summary of Continous Ass", field: "ca" },
  { letter: "h", max: "60", label: "End of Term Examination", field: "exam" },
  { letter: "i", max: "100", label: "Total Score", field: "total" },
  { letter: "j", max: "", label: "Position", field: "subjectPosition" },
  { letter: "k", max: "", label: "Class Average", field: "classAverage" },
  { letter: "l", max: "", label: "Grade (ACPF)", field: "grade" },
];

const MIN_SUBJECT_ROWS = 19;

const API_ORIGIN = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/api\/?$/, "");

const assetUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${API_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
};

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

const SignatureMark = ({ src, alt }) => {
  if (!src) return null;
  return (
    <img
      src={assetUrl(src)}
      alt={alt || "signature"}
      className="inline-block object-contain h-6"
      crossOrigin="anonymous"
      onError={(e) => {
        e.currentTarget.style.display = "none";
      }}
    />
  );
};

const StudentSecondaryResults = () => {
  const { user } = useAuth();
  const reportRef = useRef(null);

  const profile = user?.studentProfile;
  const studentId =
    typeof profile === "object" && profile
      ? profile._id || profile.id
      : profile;

  const [session, setSession] = useState("");
  const [term, setTerm] = useState("1st Term");
  const [sessionOptions, setSessionOptions] = useState([]);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const boot = async () => {
      let sess = "2026/2027";
      let t = "1st Term";
      try {
        const res = await getAcademicSettings();
        sess = res.settings?.session || sess;
        t = res.settings?.currentTerm || t;
      } catch {
        // keep defaults
      }
      setSession(sess);
      setTerm(t);
      const year = parseInt(String(sess).split("/")[0], 10);
      if (!Number.isNaN(year)) {
        setSessionOptions([`${year}/${year + 1}`, `${year - 1}/${year}`]);
      } else {
        setSessionOptions([sess]);
      }
    };
    boot();
  }, []);

  useEffect(() => {
    if (!studentId || !session || !term) return;

    const load = async () => {
      setLoading(true);
      setError("");
      setReport(null);
      try {
        const data = await getStudentReport(studentId, { session, term });
        setReport(data.report);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "No result available for this term yet."
        );
        setReport(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [studentId, session, term]);

  const isPublished = report?.status === "published";

  const handlePrint = () => {
    window.print();
  };

  const handleSaveImage = async () => {
    if (!reportRef.current || !isPublished) return;
    setExporting(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });
      const link = document.createElement("a");
      const adm = report?.student?.admissionNumber || "student";
      link.download = `report-${adm}-${term.replace(/\s+/g, "-")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Save image failed:", err);
      alert(
        "Could not save image. Run: npm install html2canvas — or use Print / PDF instead."
      );
    } finally {
      setExporting(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!reportRef.current || !isPublished) return;
    setDownloading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const pw = pdf.internal.pageSize.getWidth() - 12;
      const ph = (canvas.height * pw) / canvas.width;
      pdf.addImage(img, "PNG", 6, 6, pw, ph);
      const adm = report?.student?.admissionNumber || "student";
      pdf.save(`report-${adm}-${term.replace(/\s+/g, "-")}.pdf`);
    } catch (err) {
      console.error("PDF export failed:", err);
      alert(
        "Could not build PDF. Run: npm install jspdf html2canvas — or use Print / PDF instead."
      );
    } finally {
      setDownloading(false);
    }
  };

  if (!studentId) {
    return (
      <div className="p-6 text-sm font-semibold text-red-600">
        Student profile not linked. Contact the school office.
      </div>
    );
  }

  const levelBand =
    report?.levelBand ||
    resolveLevelBand(report?.student?.level, report?.student?.className);
  const subjects = report?.subjects || [];
  const padRows = Math.max(0, MIN_SUBJECT_ROWS - subjects.length);
  const fees = report?.fees || {};
  const filledDate = report?.reportFilledDate || "";

  const thBase = "border border-black p-1 text-[8px] font-bold align-middle";
  const tdBase = "border border-black p-1 text-[9px] align-middle";

  return (
    <div className="p-4 space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-end justify-between gap-3 no-print">
        <div>
          <h1 className="text-lg font-black text-slate-800">
            Academic Terminal Results
          </h1>
          <p className="text-xs font-semibold text-slate-500">
            Choose session and term to view your official report card.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            disabled={!isPublished}
            className="inline-flex items-center gap-2 px-3 py-2 text-xs font-bold text-white bg-slate-800 rounded-xl disabled:opacity-40"
          >
            <Printer className="w-4 h-4" />
            Print / PDF
          </button>
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={!isPublished || downloading}
            className="inline-flex items-center gap-2 px-3 py-2 text-xs font-bold text-white bg-primary rounded-xl disabled:opacity-40"
          >
            {downloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Download PDF
          </button>
          <button
            type="button"
            onClick={handleSaveImage}
            disabled={!isPublished || exporting}
            className="inline-flex items-center gap-2 px-3 py-2 text-xs font-bold border border-slate-300 rounded-xl text-slate-700 disabled:opacity-40"
          >
            {exporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ImageIcon className="w-4 h-4" />
            )}
            Save as Image
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 no-print">
        <div>
          <label className="flex items-center gap-1 mb-1 text-[11px] font-bold text-slate-600">
            <Calendar className="w-3 h-3" />
            Academic Session
          </label>
          <select
            value={session}
            onChange={(e) => setSession(e.target.value)}
            className="w-full px-3 py-2 text-xs font-bold border cursor-pointer bg-light border-slate-200 rounded-xl focus:outline-none focus:border-primary"
          >
            {sessionOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
            {session && !sessionOptions.includes(session) && (
              <option value={session}>{session}</option>
            )}
          </select>
        </div>
        <div>
          <label className="flex items-center gap-1 mb-1 text-[11px] font-bold text-slate-600">
            <Layers className="w-3 h-3" />
            School Term
          </label>
          <select
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="w-full px-3 py-2 text-xs font-bold border cursor-pointer bg-light border-slate-200 rounded-xl focus:outline-none focus:border-primary"
          >
            {TERMS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && (
        <div className="flex items-center gap-2 p-6 text-sm font-bold text-slate-500 no-print">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading result...
        </div>
      )}

      {!loading && error && (
        <div className="p-6 text-center border border-dashed rounded-2xl border-slate-300 no-print">
          <Filter className="w-6 h-6 mx-auto mb-2 text-slate-400" />
          <p className="text-sm font-black text-slate-700">No result to show</p>
          <div className="mt-1 space-y-1">
            <p className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
              <AlertCircle className="w-3 h-3" />
              {error}
            </p>
            <p className="text-[11px] text-slate-400">
              Try another term, or wait until the school publishes this class
              result.
            </p>
          </div>
        </div>
      )}

      {!loading && report && !isPublished && (
        <div className="p-4 text-xs font-semibold border border-amber-300 bg-amber-50 text-amber-700 rounded-xl no-print">
          This report is still a <strong>draft</strong>. It will appear here
          after the school publishes it.
        </div>
      )}

      {/* Official report card — same layout as admin */}
      {!loading && report && isPublished && (
        <div className="overflow-x-auto">
          <div
            id="report-card"
            ref={reportRef}
            className="min-w-[1100px] bg-white text-black border-[1.5px] border-black p-3"
          >
            {/* Header */}
            <div className="relative flex-col items-center text-center md:flex">
              <img
                src="/images/MARIAN FOUNDATION LOGO.png"
                alt="School crest"
                className="object-contain w-16 h-16 "
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <div className="text-[13px] font-black uppercase tracking-wide">
                Onitsha Archdiocesan School System,
              </div>
              <div className="text-[12px] font-bold uppercase">
                Anambra State
              </div>
              <div className="text-[12px] font-black uppercase underline">
                {levelBand}
              </div>
              <div className="text-[12px] font-black uppercase">
                Termly Report
              </div>
              <div className="text-[10px] font-bold uppercase">
                {report.schoolName || ""}
              </div>
              <div className="absolute right-0 top-0 text-[9px] font-bold border border-black px-2 py-[2px]">
                Original
              </div>
            </div>

            {/* Identity */}
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="space-y-[3px]">
                <div className="flex items-end text-[10px] font-bold">
                  <span className="whitespace-nowrap">NAME OF SCHOOL:</span>
                  <span className="flex-1 ml-1 border-b border-black">
                    {report.schoolName || "\u00A0"}
                  </span>
                </div>
                <div className="flex items-end text-[10px] font-bold">
                  <span className="whitespace-nowrap">NAME OF STUDENT:</span>
                  <span className="flex-1 ml-1 border-b border-black">
                    {report.student?.name || "\u00A0"}
                  </span>
                </div>
                <div className="flex items-end text-[10px] font-bold">
                  <span className="whitespace-nowrap">ADMISSION NO:</span>
                  <span className="flex-1 ml-1 border-b border-black">
                    {report.student?.admissionNumber || "\u00A0"}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-[3px]">
                <div className="flex items-end text-[10px] font-bold">
                  <span className="whitespace-nowrap">HOUSE:</span>
                  <span className="flex-1 ml-1 border-b border-black">
                    {report.house || "\u00A0"}
                  </span>
                </div>
                <div className="flex items-end text-[10px] font-bold">
                  <span className="whitespace-nowrap">CLASS:</span>
                  <span className="flex-1 ml-1 border-b border-black">
                    {report.student?.className || "\u00A0"}
                  </span>
                </div>
                <div className="flex items-end text-[10px] font-bold">
                  <span className="whitespace-nowrap">TERM:</span>
                  <span className="flex-1 ml-1 border-b border-black">
                    {report.term || "\u00A0"}
                  </span>
                </div>
                <div className="flex items-end text-[10px] font-bold">
                  <span className="whitespace-nowrap">NUMBER IN CLASS:</span>
                  <span className="flex-1 ml-1 border-b border-black">
                    {report.numberInClass ?? "\u00A0"}
                  </span>
                </div>
                <div className="flex items-end text-[10px] font-bold">
                  <span className="whitespace-nowrap">NEXT TERM BEGINS:</span>
                  <span className="flex-1 ml-1 border-b border-black">
                    {report.nextTermBegins || "\u00A0"}
                  </span>
                </div>
                <div className="flex items-end text-[10px] font-bold">
                  <span className="whitespace-nowrap">YEAR:</span>
                  <span className="flex-1 ml-1 border-b border-black">
                    {report.year || "\u00A0"}
                  </span>
                </div>
              </div>
            </div>

            {/* Body: scores + right column */}
            <div className="grid grid-cols-[1fr_260px] gap-2 mt-2">
              {/* LEFT */}
              <div>
                {/* Key to grades */}
                <div className="grid grid-cols-[150px_1fr] gap-2">
                  <div className="p-1 border border-black">
                    <p className="text-[9px] font-black underline text-center">
                      KEY TO GRADES
                    </p>
                    {OFFICIAL_GRADE_KEY.map(([g, r]) => (
                      <p key={g} className="text-[9px] font-bold">
                        {g} = {r}
                      </p>
                    ))}
                  </div>
                  <div className="p-1 border border-black">
                    <p className="text-[9px] font-black uppercase">
                      MARKS OBTAINABLE IN SIX (CORE SUBJECTS) AND UP TO A
                      MAXIMUM OF NINE SUBJECTS TO BE OFFERED
                    </p>
                    <p className="text-[8px] leading-tight">
                      Core subjects are those subjects which will enable a
                      student to offer any course of study in a Higher
                      Education. Fill in elective as appropriate to the
                      students.
                    </p>
                  </div>
                </div>

                {/* Score grid */}
                <table className="w-full mt-1 border-collapse table-fixed">
                  <colgroup>
                    <col style={{ width: "150px" }} />
                    {SCORE_COLUMNS.map((c) => (
                      <col key={c.letter} style={{ width: "42px" }} />
                    ))}
                    <col />
                    <col style={{ width: "70px" }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th className={`${thBase} text-left`} rowSpan={2}>
                        SUBJECT
                      </th>
                      {SCORE_COLUMNS.map((c) => (
                        <th key={c.letter} className={`${thBase} h-[108px] p-0`}>
                          <div className="h-[108px] flex items-center justify-center">
                            <span
                              className="whitespace-nowrap text-[8px] font-bold"
                              style={{
                                writingMode: "vertical-rl",
                                transform: "rotate(180deg)",
                              }}
                            >
                              {c.label}
                            </span>
                          </div>
                        </th>
                      ))}
                      <th className={thBase} rowSpan={2}>
                        Subject Master&apos;s Remark
                        <div className="text-[8px]">m</div>
                      </th>
                      <th className={thBase} rowSpan={2}>
                        Signature
                      </th>
                    </tr>
                    <tr>
                      {SCORE_COLUMNS.map((c) => (
                        <th key={`${c.letter}-max`} className={thBase}>
                          {c.letter}
                          {c.max ? ` / ${c.max}` : ""}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.map((s, idx) => (
                      <tr key={s.subjectName || idx}>
                        <td className={`${tdBase} font-bold text-left`}>
                          {idx + 1}. {s.subjectName}
                        </td>
                        {SCORE_COLUMNS.map((c) => (
                          <td
                            key={c.letter}
                            className={`${tdBase} text-center`}
                          >
                            {cell(s[c.field])}
                          </td>
                        ))}
                        <td className={`${tdBase} text-left`}>
                          {cell(s.remark)}
                        </td>
                        <td className={tdBase}>&nbsp;</td>
                      </tr>
                    ))}
                    {Array.from({ length: padRows }).map((_, i) => (
                      <tr key={`pad-${i}`}>
                        <td className={`${tdBase} font-bold text-left`}>
                          {subjects.length + i + 1}.
                        </td>
                        {SCORE_COLUMNS.map((c) => (
                          <td key={c.letter} className={tdBase}>
                            &nbsp;
                          </td>
                        ))}
                        <td className={tdBase}>&nbsp;</td>
                        <td className={tdBase}>&nbsp;</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Totals + form teacher + fees */}
                <div className="grid grid-cols-[1fr_260px] gap-2 mt-2">
                  <div className="space-y-1">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="flex items-end text-[10px] font-bold">
                        <span className="whitespace-nowrap">Total Score:</span>
                        <span className="flex-1 ml-1 border-b border-black">
                          {cell(report.totalScore)}
                        </span>
                      </div>
                      <div className="flex items-end text-[10px] font-bold">
                        <span className="whitespace-nowrap">Average Score:</span>
                        <span className="flex-1 ml-1 border-b border-black">
                          {report.average != null ? `${report.average}%` : ""}
                        </span>
                      </div>
                      <div className="flex items-end text-[10px] font-bold">
                        <span className="whitespace-nowrap">Position:</span>
                        <span className="flex-1 ml-1 border-b border-black">
                          {report.position ?? ""}
                          {report.outOf ? ` / ${report.outOf}` : ""}
                        </span>
                      </div>
                    </div>

                    <div className="p-1 border border-black">
                      <p className="text-[10px] font-black">
                        Form Teacher&apos;s Comments:
                      </p>
                      <p className="text-[10px] min-h-[16px] border-b border-black">
                        {report.formTeacherComment || "\u00A0"}
                      </p>
                      <p className="border-b border-black">&nbsp;</p>
                      <div className="flex items-end justify-between gap-3 mt-1">
                        <div className="flex items-end flex-1 gap-1">
                          <span className="text-[10px] font-bold">
                            Signature:
                          </span>
                          <span className="flex-1 text-center border-b border-black">
                            <SignatureMark
                              src={report.formTeacherSignature}
                              alt="Form teacher signature"
                            />
                          </span>
                          {report.formTeacherName ? (
                            <span className="text-[9px] font-bold">
                              {report.formTeacherName}
                            </span>
                          ) : null}
                        </div>
                        <div className="flex items-end gap-1 w-[150px]">
                          <span className="text-[10px] font-bold">Date:</span>
                          <span className="flex-1 border-b border-black text-[9px]">
                            {report.formTeacherDate || filledDate || ""}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Fees */}
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className={`${thBase} text-left`}>Fees</th>
                        <th className={thBase}>K</th>
                        <th className={thBase}>N</th>
                      </tr>
                    </thead>
                    <tbody>
                      {FEE_MAP.map(([key, label]) => (
                        <tr key={key}>
                          <td className={`${tdBase} text-left`}>{label}</td>
                          <td className={`${tdBase} text-center`}>
                            {feeK(fees, key)}
                          </td>
                          <td className={`${tdBase} text-center`}>
                            {feeN(fees, key)}
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td className={`${tdBase} font-black text-left`}>
                          TOTAL
                        </td>
                        <td className={tdBase}>&nbsp;</td>
                        <td className={`${tdBase} text-center font-black`}>
                          {feesTotalN(fees)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* RIGHT: behaviour + skills */}
              <div>
                <div className="p-1 border border-black">
                  <p className="text-[9px] font-black underline text-center">
                    KEY TO GRADES
                  </p>
                  <p className="text-[9px] font-bold">5 - Excellent</p>
                  <p className="text-[9px] font-bold">4 - Good</p>
                  <p className="text-[9px] font-bold">3 - Fair</p>
                  <p className="text-[9px] font-bold">2 - Poor</p>
                  <p className="text-[9px] font-bold">1 - Very Poor</p>
                </div>

                <table className="w-full mt-1 border-collapse">
                  <thead>
                    <tr>
                      <th className={`${thBase} text-left`}>
                        SOCIAL BEHAVIOUR
                      </th>
                      <th className={`${thBase} w-[46px]`}>Ratings</th>
                      <th className={`${thBase} w-[60px]`}>Entered by</th>
                    </tr>
                  </thead>
                  <tbody>
                    {BEHAVIOUR_KEYS.map(([key, label]) => (
                      <tr key={key}>
                        <td className={`${tdBase} text-left`}>{label}</td>
                        <td className={`${tdBase} text-center`}>
                          {report.behaviours?.[key] ?? ""}
                        </td>
                        <td className={tdBase}>&nbsp;</td>
                      </tr>
                    ))}
                    <tr>
                      <td className={`${thBase} text-left`} colSpan={3}>
                        MOTOR SKILLS
                      </td>
                    </tr>
                    {SKILL_KEYS.map(([key, label]) => (
                      <tr key={key}>
                        <td className={`${tdBase} text-left`}>{label}</td>
                        <td className={`${tdBase} text-center`}>
                          {report.skills?.[key] ?? ""}
                        </td>
                        <td className={tdBase}>&nbsp;</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <p className="mt-1 text-[9px] font-bold">
                  Entered by:{" "}
                  <span className="font-normal">
                    {report.behavioursEnteredBy || "____________"}
                  </span>
                </p>
              </div>
            </div>

            {/* Comment blocks */}
            <div className="grid grid-cols-3 gap-2 mt-2">
              <div className="p-1 border border-black">
                <p className="text-[10px] font-black">
                  HOUSE MASTER&apos;S COMMENTS
                </p>
                <p className="text-[10px] min-h-[16px] border-b border-black">
                  {report.houseMasterComment || "\u00A0"}
                </p>
                <p className="border-b border-black">&nbsp;</p>
                <div className="flex items-end gap-1 mt-1">
                  <span className="text-[9px] font-bold">SIGNATURE</span>
                  <span className="flex-1 text-center border-b border-black">
                    <SignatureMark
                      src={report.houseMasterSignature}
                      alt="House master signature"
                    />
                  </span>
                </div>
                <div className="flex items-end gap-2 mt-1">
                  <div className="flex items-end flex-1 gap-1">
                    <span className="text-[9px] font-bold">NAME</span>
                    <span className="flex-1 border-b border-black text-[9px]">
                      {report.houseMasterName || ""}
                    </span>
                  </div>
                  <div className="flex items-end gap-1 w-[100px]">
                    <span className="text-[9px] font-bold">DATE</span>
                    <span className="flex-1 border-b border-black text-[9px]">
                      {report.houseMasterDate || filledDate || ""}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-1 border border-black">
                <p className="text-[10px] font-black">
                  (GUIDANCE COUNSELLOR&apos;S COMMENTS)
                </p>
                <p className="text-[10px] min-h-[16px] border-b border-black">
                  {report.guidanceCounsellorComment || "\u00A0"}
                </p>
                <p className="border-b border-black">&nbsp;</p>
                <div className="flex items-end gap-1 mt-1">
                  <span className="text-[9px] font-bold">SIGNATURE</span>
                  <span className="flex-1 text-center border-b border-black">
                    <SignatureMark
                      src={report.guidanceCounsellorSignature}
                      alt="Guidance counsellor signature"
                    />
                  </span>
                </div>
                <div className="flex items-end gap-2 mt-1">
                  <div className="flex items-end flex-1 gap-1">
                    <span className="text-[9px] font-bold">NAME</span>
                    <span className="flex-1 border-b border-black text-[9px]">
                      {report.guidanceCounsellorName || ""}
                    </span>
                  </div>
                  <div className="flex items-end gap-1 w-[100px]">
                    <span className="text-[9px] font-bold">DATE</span>
                    <span className="flex-1 border-b border-black text-[9px]">
                      {report.guidanceCounsellorDate || filledDate || ""}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-1 border border-black">
                <p className="text-[10px] font-black">
                  PRINCIPAL&apos;S COMMENTS
                </p>
                <p className="text-[10px] min-h-[16px] border-b border-black">
                  {report.principalComment || "\u00A0"}
                </p>
                <p className="border-b border-black">&nbsp;</p>
                <div className="flex items-end gap-1 mt-1">
                  <span className="text-[9px] font-bold">SIGNATURE:</span>
                  <span className="flex-1 text-center border-b border-black">
                    <SignatureMark
                      src={report.principalSignature}
                      alt="Principal signature"
                    />
                  </span>
                </div>
                <div className="flex items-end gap-1 mt-1">
                  <span className="text-[9px] font-bold whitespace-nowrap">
                    NAME OF PRINCIPAL:
                  </span>
                  <span className="flex-1 border-b border-black text-[9px]">
                    {report.principalName || ""}
                  </span>
                </div>
                <div className="flex items-end gap-1 mt-1">
                  <span className="text-[9px] font-bold">DATE</span>
                  <span className="flex-1 border-b border-black text-[9px]">
                    {report.principalDate || filledDate || ""}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #report-card, #report-card * { visibility: visible; }
          #report-card {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            min-width: 0 !important;
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

export default StudentSecondaryResults;
