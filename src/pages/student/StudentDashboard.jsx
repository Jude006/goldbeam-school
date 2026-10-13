import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Wallet,
  FileCheck2,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getStudentReport } from "../../api/resultApi";
import { getMyFees } from "../../api/feeApi";
import { getAcademicSettings } from "../../api/academicSettingsApi";
import SEO from "../../components/common/SEO";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState("");
  const [term, setTerm] = useState("");
  const [resultReady, setResultReady] = useState(false);
  const [average, setAverage] = useState(null);

  // Fees
  const [totalFees, setTotalFees] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [feeBalance, setFeeBalance] = useState(0);
  const [feesLoaded, setFeesLoaded] = useState(false);

  const profile = user?.studentProfile;
  const studentId =
    typeof profile === "object" && profile
      ? profile._id || profile.id
      : profile;

  const displayName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
    : "Student";
  const firstName = user?.firstName || displayName.split(" ")[0] || "Student";
  const admissionNo = user?.admissionNumber || "—";
  const className =
    (typeof profile === "object" && profile?.class?.name) || "—";

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        let sess = "2026/2027";
        let t = "1st Term";

        try {
          const settingsRes = await getAcademicSettings();
          sess = settingsRes.settings?.session || sess;
          t = settingsRes.settings?.currentTerm || t;
        } catch {
          // defaults
        }

        setSession(sess);
        setTerm(t);

        // Results + fees in parallel
        const tasks = [];

        if (studentId) {
          tasks.push(
            getStudentReport(studentId, { session: sess, term: t })
              .then((data) => {
                if (data.report?.status === "published") {
                  setResultReady(true);
                  setAverage(data.report.average);
                } else {
                  setResultReady(false);
                }
              })
              .catch(() => setResultReady(false)),
          );
        }

        tasks.push(
          getMyFees({ session: sess, term: t })
            .then((data) => {
              setTotalFees(Number(data.totalFees) || 0);
              setTotalPaid(Number(data.totalPaid) || 0);
              setFeeBalance(Number(data.balance) || 0);
              if (data.session) setSession(data.session);
              if (data.term) setTerm(data.term);
              setFeesLoaded(true);
            })
            .catch(() => {
              setFeesLoaded(false);
            }),
        );

        await Promise.all(tasks);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [studentId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-20 text-sm text-gray">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading dashboard...
      </div>
    );
  }

  const feesCleared = feesLoaded && feeBalance <= 0 && totalFees > 0;
  const noFeesSet = feesLoaded && totalFees === 0;
  const paidPercent =
    totalFees > 0
      ? Math.min(100, Math.round((totalPaid / totalFees) * 100))
      : 0;

  return (
    <>
      <SEO
        title="Student Dashboard"
        description="Access your academic results, fee records, and profile at Amazing Grace Academy."
        keywords="student portal, school dashboard, academic results"
        url="/student/dashboard"
      />
      <div className="mx-auto space-y-6 select-none max-w-7xl font-body text-dark">
        {/* Welcome */}
        <div className="relative flex flex-col items-start justify-between gap-4 p-6 overflow-hidden text-white shadow-sm bg-primary sm:p-8 rounded-2xl sm:flex-row sm:items-center">
          <div className="relative z-10 space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-[11px] font-heading font-semibold text-highlight">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {term} · {session}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight font-heading sm:text-3xl">
              Welcome back, {firstName}!
            </h1>
            <p className="text-xs sm:text-sm text-white/80">
              Admission No:{" "}
              <span className="font-mono font-bold text-white">
                {admissionNo}
              </span>
              {" | "}
              Class: {className}
            </p>
          </div>

          <Link
            to="/student/results"
            className="relative z-10 inline-flex items-center gap-2 px-5 py-3 text-xs font-bold text-white transition-all duration-200 shadow-sm cursor-pointer bg-secondary hover:bg-highlight font-heading sm:text-sm rounded-xl"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>View Terminal Result</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Fees */}
          <div className="flex flex-col justify-between p-6 space-y-4 bg-white border shadow-xs rounded-2xl border-slate-200/80">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center min-w-0 gap-3">
                <div className="p-3 bg-rose-50 text-rose-600 rounded-xl shrink-0">
                  <Wallet className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold font-heading text-dark">
                    School Fee Status
                  </h3>
                  <p className="text-xs truncate text-gray">
                    {term} · {session}
                  </p>
                </div>
              </div>
              {feesLoaded && (
                <span
                  className={`shrink-0 px-3 py-1 rounded-full text-[10px] font-heading font-bold border ${
                    noFeesSet
                      ? "bg-slate-50 text-gray border-slate-200"
                      : feesCleared
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  {noFeesSet
                    ? "No fees set"
                    : feesCleared
                      ? "Fully Paid"
                      : "Outstanding"}
                </span>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <span className="block text-xs text-gray">Balance due</span>
                  <span className="text-2xl font-black font-heading text-dark">
                    ₦{Number(feeBalance).toLocaleString()}
                  </span>
                </div>
                <div className="text-xs text-right text-gray">
                  Paid:{" "}
                  <span className="font-bold text-emerald-600">
                    ₦{Number(totalPaid).toLocaleString()}
                  </span>
                  <span className="block sm:inline sm:before:content-['_/']">
                    {" "}
                    ₦{Number(totalFees).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    feesCleared ? "bg-emerald-500" : "bg-primary"
                  }`}
                  style={{ width: `${paidPercent}%` }}
                />
              </div>

              <p className="text-xs text-gray">
                {noFeesSet
                  ? "No fee structure for your class this term yet."
                  : feesCleared
                    ? "Your fees for this term are fully cleared."
                    : "You can pay in full or part online on the Fees page."}
              </p>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <span className="text-xs text-gray">
                {feeBalance > 0
                  ? "Pay securely online"
                  : "View history & receipts"}
              </span>
              <Link
                to="/student/fees"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-accent text-white text-xs font-heading font-bold rounded-xl transition-colors cursor-pointer shrink-0"
              >
                <span>{feeBalance > 0 ? "Pay Fees" : "View Fees"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Results */}
          <div className="flex flex-col justify-between p-6 space-y-4 bg-white border shadow-xs rounded-2xl border-slate-200/80">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center min-w-0 gap-3">
                <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold font-heading text-dark">
                    Result Card Status
                  </h3>
                  <p className="text-xs truncate text-gray">
                    {term} · {session}
                  </p>
                </div>
              </div>
              {resultReady ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-heading font-bold shrink-0">
                  <CheckCircle2 className="w-3 h-3" /> Result Ready
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[10px] font-heading font-bold shrink-0">
                  <AlertCircle className="w-3 h-3" /> Not published
                </span>
              )}
            </div>

            <div className="p-4 space-y-1 border bg-light rounded-xl border-slate-100">
              <h4 className="text-xs font-bold font-heading text-dark">
                {resultReady
                  ? `Your ${term} report is available`
                  : "Results are not published yet"}
              </h4>
              <p className="text-xs text-gray">
                {resultReady
                  ? average != null
                    ? `Average: ${average}%. Open Results to view or print your report card.`
                    : "Open Results to view or print your report card."
                  : "When your school publishes the class result, it will show here."}
              </p>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <span className="text-xs text-gray">
                Any term on Results page
              </span>
              <Link
                to="/student/results"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-secondary hover:bg-highlight text-white text-xs font-heading font-bold rounded-xl transition-colors cursor-pointer shrink-0"
              >
                <span>Check Result</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentDashboard;
