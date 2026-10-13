import React, { useCallback, useEffect, useRef, useState } from "react";
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

const API_ORIGIN =
  (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(
    /\/api\/?$/,
    ""
  ) || "http://localhost:5000";

const assetUrl = (path) => {
  if (!path || typeof path !== "string") return "";
  const trimmed = path.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `${API_ORIGIN}${trimmed.startsWith("/") ? trimmed : `/${trimmed}`}`;
};

const SignatureMark = ({ src, alt = "Signature" }) => {
  const [failed, setFailed] = useState(false);
  const url = assetUrl(src);

  useEffect(() => {
    setFailed(false);
  }, [src, url]);

  if (!url || failed) {
    return <span className="block h-8" />;
  }

  return (
    <img
      src={url}
      alt={alt}
      className="object-contain h-8 mx-auto"
      onError={() => setFailed(true)}
    />
  );
};

const BEHAVIOUR_ROWS = [
  ["punctuality", "1", "Punctuality"],
  ["attendanceInClass", "2", "Class Attendance"],
  ["carryingOutAssignments", "3", "Carrying out of Assignment"],
  ["perseverance", "4", "Perseverance"],
  ["selfControl", "5", "Self Control"],
  ["selfConfidence", "6", "Self Confidence"],
  ["leadership", "7", "Leadership"],
  ["obedience", "8", "Obedience"],
  ["relationshipWithOthers", "9", "Relationship with others"],
  ["honesty", "10", "Honesty"],
  ["neatness", "11", "Neatness"],
  ["gamesSports", "12", "Games & Sports"],
  ["manualSkills", "13", "Manual Skills"],
];

function getOrdinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

const Field = ({ label, value, className = "" }) => (
  <span className={`inline-flex items-end gap-1 ${className}`}>
    <span className="whitespace-nowrap">{label}</span>
    <span className="flex-1 min-w-[60px] border-b border-black leading-[1.15] px-1 font-semibold">
      {value === null || value === undefined || value === "" ? "\u00A0" : value}
    </span>
  </span>
);

const VHead = ({ children }) => (
  <div
    className="mx-auto whitespace-nowrap text-[8.5px] font-bold leading-[1.05] tracking-tight"
    style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
  >
    {children}
  </div>
);

const StudentPrimaryResults = () => {
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
        // defaults
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

  const load = useCallback(async () => {
    if (!studentId || !session || !term) return;
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
  }, [studentId, session, term]);

  useEffect(() => {
    load();
  }, [load]);

  const isPublished = report?.status === "published";

  const handlePrint = () => window.print();

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
      link.download = `primary-report-${adm}-${term.replace(/\s+/g, "-")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Save image failed:", err);
      alert(
        "Could not save image. Run: npm install html2canvas — or use Print / PDF."
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
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const pw = pdf.internal.pageSize.getWidth() - 12;
      const ph = (canvas.height * pw) / canvas.width;
      pdf.addImage(img, "PNG", 6, 6, pw, Math.min(ph, pdf.internal.pageSize.getHeight() - 12));
      const adm = report?.student?.admissionNumber || "student";
      pdf.save(`primary-report-${adm}-${term.replace(/\s+/g, "-")}.pdf`);
    } catch (err) {
      console.error("PDF export failed:", err);
      alert(
        "Could not build PDF. Run: npm install jspdf html2canvas — or use Print."
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

  const subjects = report?.subjects || [];
  const behaviours = report?.behaviours || {};
  const maxPossible = subjects.length * 100;
  const sex =
    report?.student?.gender === "Female"
      ? "Female"
      : report?.student?.gender === "Male"
        ? "Male"
        : report?.student?.gender || "—";

  const rowCount = Math.max(subjects.length, BEHAVIOUR_ROWS.length);
  const rows = Array.from({ length: rowCount }, (_, i) => i);

  return (
    <div className="p-4 space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-end justify-between gap-3 no-print">
        <div>
          <h1 className="text-lg font-black text-slate-800">
            Primary Terminal Results
          </h1>
          <p className="text-xs font-semibold text-slate-500">
            Choose session and term to view your official primary report card.
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

      {/* ========== SAME DESIGN AS ADMIN PRIMARY REPORT ========== */}
      {!loading && report && isPublished && (
        <div className="overflow-x-auto">
          <div
            id="primary-report-card"
            ref={reportRef}
            className="mx-auto bg-white text-black border-[1.5px] border-black p-3"
            style={{
              width: "210mm",
              maxWidth: "100%",
              fontFamily: "Arial, Helvetica, sans-serif",
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-1">
              <div className="w-[62px] shrink-0">
                <img
                  src="/images/logo.png"
                  alt="School crest"
                  className="w-[62px] h-[62px] object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
              <div className="flex-1 leading-tight text-center">
                <h1 className="text-[22px] font-extrabold tracking-tight uppercase">
                  Marian Foundation Academy
                </h1>
                <p className="text-[12px] font-bold uppercase">
                  Nursery, Primary &amp; Secondary Schools
                </p>
                <p className="text-[11px] font-bold uppercase">
                  P.O. Box 5, Oraukwu
                </p>
                <p className="text-[11px] font-bold uppercase">
                  Idemili Local Govt. Area, Anambra State.
                </p>
              </div>
              <div className="w-[62px] shrink-0" />
            </div>

            {/* Pupil info */}
            <div className="mt-2 space-y-[6px] text-[11px] px-1">
              <div className="flex items-end gap-2">
                <Field
                  label="Name of Pupil:"
                  value={report.student?.name}
                  className="flex-[3]"
                />
                <Field label="Sex:" value={sex} className="flex-[1]" />
                <Field
                  label="Pupil's Age:"
                  value={report.pupilAge ?? report.student?.age}
                  className="flex-[1]"
                />
              </div>
              <div className="flex items-end gap-2">
                <Field
                  label="Class:"
                  value={report.student?.className}
                  className="flex-[1.2]"
                />
                <Field
                  label="Class Population:"
                  value={report.numberInClass}
                  className="flex-[1]"
                />
                <Field
                  label="Class Average:"
                  value={report.average != null ? report.average : ""}
                  className="flex-[1]"
                />
                <Field
                  label="Year:"
                  value={report.year || report.session}
                  className="flex-[1]"
                />
                <Field label="Term:" value={report.term} className="flex-[0.9]" />
              </div>
            </div>

            {/* Main grid — identical to admin */}
            <table className="w-full mt-2 border-collapse table-fixed text-[10px]">
              <colgroup>
                <col style={{ width: "27%" }} />
                <col style={{ width: "6%" }} />
                <col style={{ width: "6%" }} />
                <col style={{ width: "6%" }} />
                <col style={{ width: "6%" }} />
                <col style={{ width: "6%" }} />
                <col style={{ width: "6%" }} />
                <col style={{ width: "25%" }} />
                <col style={{ width: "12%" }} />
              </colgroup>

              <thead>
                <tr>
                  <th
                    rowSpan={2}
                    className="p-1 text-left align-top border border-black"
                  >
                    <p className="text-center text-[9.5px] font-bold underline">
                      Key of Grade
                    </p>
                    <p className="text-[8.5px] leading-[1.35]">
                      A. (Distinction) - &nbsp;70% and Above
                    </p>
                    <p className="text-[8.5px] leading-[1.35]">
                      C. (Credit) - &nbsp;55% - 69%
                    </p>
                    <p className="text-[8.5px] leading-[1.35]">
                      D. (Pass) - &nbsp;40% - 54%
                    </p>
                    <p className="text-[8.5px] leading-[1.35]">
                      F. (Fail) - &nbsp;Below 40%
                    </p>
                  </th>
                  <th rowSpan={2} className="border border-black p-1 h-[96px]">
                    <VHead>Class Work Summary 1st Half of Term (20)</VHead>
                  </th>
                  <th rowSpan={2} className="p-1 border border-black">
                    <VHead>Class Work Summary 2nd Half of Term (20)</VHead>
                  </th>
                  <th rowSpan={2} className="p-1 border border-black">
                    <VHead>End of Term Exam (60)</VHead>
                  </th>
                  <th
                    colSpan={3}
                    className="border border-black p-1 text-[9.5px] font-bold"
                  >
                    Summary for the Term
                  </th>
                  <th rowSpan={2} className="p-1 align-middle border border-black">
                    <p className="text-[9px] font-bold leading-[1.25] uppercase">
                      Social Behaviours
                      <br />
                      and
                      <br />
                      Manipulative Skills
                    </p>
                  </th>
                  <th rowSpan={2} className="p-1 align-top border border-black">
                    <p className="text-[8.5px] font-bold uppercase leading-[1.25]">
                      Key to
                      <br />
                      Rating Scale:
                    </p>
                    <p className="text-[8px] leading-[1.3]">5 - Excellent</p>
                    <p className="text-[8px] leading-[1.3]">4 - Good</p>
                    <p className="text-[8px] leading-[1.3]">3 - Fair</p>
                    <p className="text-[8px] leading-[1.3]">2 - Poor</p>
                    <p className="text-[8px] leading-[1.3]">
                      1 - Very poor Rating
                    </p>
                  </th>
                </tr>
                <tr>
                  <th className="border border-black p-1 h-[52px]">
                    <VHead>Total Score (100)</VHead>
                  </th>
                  <th className="p-1 border border-black">
                    <VHead>Class Average</VHead>
                  </th>
                  <th className="p-1 border border-black">
                    <VHead>Grade</VHead>
                  </th>
                </tr>
              </thead>

              <tbody>
                {rows.map((i) => {
                  const s = subjects[i];
                  const b = BEHAVIOUR_ROWS[i];
                  return (
                    <tr key={i}>
                      <td className="border border-black px-1.5 py-[3px] text-[10.5px] font-bold">
                        {s ? (
                          <>
                            <span className="inline-block w-[16px]">{i + 1}</span>
                            {s.subjectName}
                          </>
                        ) : (
                          "\u00A0"
                        )}
                      </td>
                      <td className="border border-black text-center py-[3px] font-semibold">
                        {s ? (s.classWork1 ?? "") : "\u00A0"}
                      </td>
                      <td className="border border-black text-center py-[3px] font-semibold">
                        {s ? (s.classWork2 ?? "") : "\u00A0"}
                      </td>
                      <td className="border border-black text-center py-[3px] font-semibold">
                        {s ? (s.exam ?? "") : "\u00A0"}
                      </td>
                      <td className="border border-black text-center py-[3px] font-semibold">
                        {s ? (s.total ?? "") : "\u00A0"}
                      </td>
                      <td className="border border-black text-center py-[3px] font-semibold">
                        {s ? (s.classAverage ?? "") : "\u00A0"}
                      </td>
                      <td className="border border-black text-center py-[3px] font-bold">
                        {s ? (s.grade ?? "") : "\u00A0"}
                      </td>
                      <td className="border border-black px-1.5 py-[3px] text-[9px] font-semibold">
                        {b ? (
                          <>
                            <span className="inline-block w-[14px]">{b[1]}</span>
                            {b[2]}
                          </>
                        ) : (
                          "\u00A0"
                        )}
                      </td>
                      <td className="border border-black text-center py-[3px] font-bold">
                        {b &&
                        behaviours[b[0]] != null &&
                        behaviours[b[0]] !== ""
                          ? behaviours[b[0]]
                          : "\u00A0"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Totals */}
            <div className="mt-2 space-y-[6px] text-[11px] px-1">
              <div className="flex items-end gap-3">
                <Field
                  label="Total Score:"
                  value={report.totalScore}
                  className="flex-[1]"
                />
                <Field
                  label="Out of:"
                  value={maxPossible || ""}
                  className="flex-[1]"
                />
                <Field
                  label="Grade:"
                  value={
                    report.position != null
                      ? `${report.position}${getOrdinal(report.position)} out of ${
                          report.outOf ?? report.numberInClass ?? "—"
                        } pupils`
                      : ""
                  }
                  className="flex-[2]"
                />
              </div>
              <div className="flex items-end gap-3">
                <Field
                  label="Next Term Begins:"
                  value={report.nextTermBegins}
                  className="flex-[1]"
                />
              </div>
              <div className="flex items-end gap-3">
                <Field
                  label="Attendance:"
                  value={report.attendancePresent}
                  className="flex-[1]"
                />
                <Field
                  label="Out of:"
                  value={report.attendanceOutOf}
                  className="flex-[1]"
                />
              </div>
              <div className="flex items-end gap-3">
                <Field
                  label="Fees: Next Term's Fee:"
                  value={report.nextTermFee}
                  className="flex-[1.3]"
                />
                <Field
                  label="Fee Owed:"
                  value={report.feeOwed}
                  className="flex-[1]"
                />
                <Field
                  label="Total:"
                  value={report.feesTotal}
                  className="flex-[1]"
                />
              </div>
            </div>

            {/* Comments */}
            <div className="grid grid-cols-2 gap-4 mt-2 px-1 text-[11px]">
              <div>
                <p className="whitespace-nowrap">
                  Class Teacher&apos;s Comments:
                  <span className="inline-block w-[45%] border-b border-black align-bottom" />
                </p>
                <div className="min-h-[42px] text-[11px] font-semibold leading-[1.9]">
                  <div className="border-b border-black">
                    {report.formTeacherComment || "\u00A0"}
                  </div>
                  <div className="border-b border-black">&nbsp;</div>
                </div>
              </div>
              <div>
                <p className="whitespace-nowrap">
                  Headmaster&apos;s / Headmistress&apos; Comments:
                  <span className="inline-block w-[25%] border-b border-black align-bottom" />
                </p>
                <div className="min-h-[42px] text-[11px] font-semibold leading-[1.9]">
                  <div className="border-b border-black">
                    {report.principalComment || "\u00A0"}
                  </div>
                  <div className="border-b border-black">&nbsp;</div>
                </div>
              </div>
            </div>

                      {/* Signatures — primary roles from settings */}
            <div className="grid grid-cols-3 gap-4 px-1 mt-3">
              <div className="text-center">
                <div className="border-b border-black min-h-[32px] flex items-end justify-center">
                  <SignatureMark
                    src={report.primaryTeacherSignature}
                    alt="Class teacher signature"
                  />
                </div>
                <p className="mt-[2px] text-[9.5px]">
                  Signature of Class Teacher
                </p>
                {report.primaryTeacherName ? (
                  <p className="text-[8px] text-slate-700">
                    {report.primaryTeacherName}
                  </p>
                ) : null}
              </div>
              <div className="text-center">
                <div className="border-b border-black">
                  <span className="block h-8" />
                </div>
                <p className="mt-[2px] text-[9.5px]">Parent&apos;s Signature</p>
              </div>
              <div className="text-center">
                <div className="border-b border-black min-h-[32px] flex items-end justify-center">
                  <SignatureMark
                    src={
                      report.primaryManagerSignature ||
                      report.deanSignature ||
                      ""
                    }
                    alt="Headmaster signature"
                  />
                </div>
                <p className="mt-[2px] text-[9.5px]">
                  Signature of Headmaster/Headmistress
                </p>
                {(report.primaryManagerName || report.deanName) ? (
                  <p className="text-[8px] text-slate-700">
                    {report.primaryManagerName || report.deanName}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #primary-report-card, #primary-report-card * { visibility: visible; }
          #primary-report-card {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: 1.5px solid #000 !important;
          }
          #primary-report-card table,
          #primary-report-card th,
          #primary-report-card td {
            border-color: #000 !important;
            color: #000 !important;
          }
          .no-print { display: none !important; }
          #primary-report-card table { page-break-inside: avoid; }
          @page { size: A4 portrait; margin: 8mm; }
        }
      `}</style>
    </div>
  );
};

export default StudentPrimaryResults;