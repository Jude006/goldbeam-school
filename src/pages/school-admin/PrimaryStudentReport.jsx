import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, Printer, Loader2, Pencil } from "lucide-react";
import { getStudentReport, saveTermReport } from "../../api/resultApi";
import Toast from "../../components/ui/Toast";
import { useAuth } from "../../context/AuthContext";
import PrimaryReportDetailsModal from "../../components/admin/PrimaryReportDetailsModal";

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

const Field = ({ label, value, className = "", labelClass = "" }) => (
  <span className={`inline-flex items-end gap-1 ${className}`}>
    <span className={`whitespace-nowrap ${labelClass}`}>{label}</span>
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

const PrimaryStudentReport = () => {
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
        pupilAge: r.pupilAge ?? r.student?.age ?? "",
        year: r.year || "",
        nextTermBegins: r.nextTermBegins || "",
        attendancePresent: r.attendancePresent ?? "",
        attendanceOutOf: r.attendanceOutOf ?? "",
        nextTermFee: r.nextTermFee ?? "",
        feeOwed: r.feeOwed ?? "",
        feesTotal: r.feesTotal ?? "",
        behaviours: r.behaviours || {},
        formTeacherComment: r.formTeacherComment || "",
        principalComment: r.principalComment || "",
        behavioursEnteredBy: r.behavioursEnteredBy || "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load report.");
      setReport(null);
    } finally {
      setLoading(false);
    }
  }, [studentId, sessionQ, termQ]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-sm text-slate-500">
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Loading primary report...
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="py-24 text-center">
        <p className="text-sm text-slate-600">{error || "Report not found."}</p>
        <Link to="/admin/results" className="text-xs font-bold underline">
          ← Back to results
        </Link>
      </div>
    );
  }

  const subjects = report.subjects || [];
  const behaviours = report.behaviours || {};
  const maxPossible = subjects.length * 100;
  const sex =
    report.student?.gender === "Female"
      ? "Female"
      : report.student?.gender === "Male"
        ? "Male"
        : report.student?.gender || "—";

  const rowCount = Math.max(subjects.length, BEHAVIOUR_ROWS.length);
  const rows = Array.from({ length: rowCount }, (_, i) => i);

  // Primary signatures from academic settings (via report payload)
  const teacherSig = report.primaryTeacherSignature || "";
  const teacherName = report.primaryTeacherName || "";
  const headSig =
    report.primaryManagerSignature || report.deanSignature || "";
  const headName =
    report.primaryManagerName || report.deanName || "";

  return (
    <div className="p-4">
      <Toast
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ type: "", message: "" })}
      />

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 no-print">
        <Link
          to="/admin/results"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 text-[10px] font-bold uppercase border border-slate-200 rounded-lg text-slate-500">
            {report.status === "published" ? "Published" : "Draft preview"}
          </span>
          {isAdmin && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl hover:bg-light cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit behaviour / comments
            </button>
          )}
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-primary rounded-xl"
          >
            <Printer className="w-3.5 h-3.5" /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* ============================ REPORT CARD ============================ */}
      <div
        id="primary-report-card"
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
          <div className="flex-1 text-center leading-tight">
            <h1 className="text-[22px] font-extrabold tracking-tight uppercase">
              Marian Foundation Academy
            </h1>
            <p className="text-[12px] font-bold uppercase">
              Nursery, Primary &amp; Secondary Schools
            </p>
            <p className="text-[11px] font-bold uppercase">P.O. Box 5, Oraukwu</p>
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
              value={report.pupilAge || report.student?.age}
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

        {/* Main grid */}
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
                <p className="text-[8px] leading-[1.3]">1 - Very poor Rating</p>
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
                    {b && behaviours[b[0]] != null && behaviours[b[0]] !== ""
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

        {/* Signatures — primary roles only */}
        <div className="grid grid-cols-3 gap-4 mt-3 px-1">
          <div className="text-center">
            <div className="border-b border-black min-h-[32px] flex items-end justify-center">
              <SignatureMark
                src={teacherSig}
                alt="Class teacher signature"
              />
            </div>
            <p className="mt-[2px] text-[9.5px]">Signature of Class Teacher</p>
            {teacherName ? (
              <p className="text-[8px] text-slate-700">{teacherName}</p>
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
                src={headSig}
                alt="Headmaster signature"
              />
            </div>
            <p className="mt-[2px] text-[9.5px]">
              Signature of Headmaster/Headmistress
            </p>
            {headName ? (
              <p className="text-[8px] text-slate-700">{headName}</p>
            ) : null}
          </div>
        </div>
      </div>

      <PrimaryReportDetailsModal
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
              message: "Primary report details saved.",
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

export default PrimaryStudentReport;