import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  GraduationCap,
  CreditCard,
  AlertCircle,
  UserPlus,
  Wallet,
  ArrowUpRight,
  PlusCircle,
  FileText,
  ChevronRight,
  CheckCircle2,
  Loader2,
  Layers,
} from "lucide-react";
import { getStudents } from "../../api/studentApi";
import { getClasses } from "../../api/classApi";
import { getPayments } from "../../api/feeApi";
import { getResultsOverview } from "../../api/resultApi";
import { getAcademicSettings } from "../../api/academicSettingsApi";

const formatNaira = (n) =>
  `₦${Number(n || 0).toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState("");
  const [term, setTerm] = useState("");
  const [studentCount, setStudentCount] = useState(0);
  const [classCount, setClassCount] = useState(0);
  const [feesCollected, setFeesCollected] = useState(0);
  const [recentPayments, setRecentPayments] = useState([]);
  const [publishedClasses, setPublishedClasses] = useState(0);
  const [draftClasses, setDraftClasses] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        let sess = "";
        let t = "1st Term";
        try {
          const settings = await getAcademicSettings();
          sess = settings.settings?.session || "";
          t = settings.settings?.currentTerm || "1st Term";
        } catch {
          // continue with defaults
        }
        setSession(sess);
        setTerm(t);

        const [studentsRes, classesRes, paymentsRes, resultsRes] =
          await Promise.all([
            getStudents({ limit: 1 }).catch(() => ({ students: [], total: 0 })),
            getClasses().catch(() => ({ classes: [] })),
            getPayments({ session: sess, term: t }).catch(() => ({
              payments: [],
            })),
            getResultsOverview({ session: sess, term: t }).catch(() => ({
              overview: [],
            })),
          ]);

        // Prefer API total if present, else length of returned list
        const totalStudents =
          studentsRes.total ??
          studentsRes.count ??
          (Array.isArray(studentsRes.students)
            ? studentsRes.students.length
            : 0);

        // If only 1 student returned due to limit, refetch count-friendly
        let finalStudentCount = totalStudents;
        if (studentsRes.total == null && studentsRes.count == null) {
          const all = await getStudents({}).catch(() => ({ students: [] }));
          finalStudentCount = (all.students || []).length;
        }

        setStudentCount(finalStudentCount);
        setClassCount((classesRes.classes || []).length);

        const payments = paymentsRes.payments || [];
        const collected = payments
          .filter((p) => p.status === "success")
          .reduce((sum, p) => sum + Number(p.amount || 0), 0);
        setFeesCollected(collected);
        setRecentPayments(payments.slice(0, 6));

        const overview = resultsRes.overview || [];
        setPublishedClasses(
          overview.filter((o) => o.status === "published").length,
        );
        setDraftClasses(
          overview.filter((o) => o.status !== "published").length,
        );
        if (resultsRes.session) setSession(resultsRes.session);
        if (resultsRes.term) setTerm(resultsRes.term);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const stats = [
    {
      title: "Total Students",
      value: studentCount.toLocaleString(),
      change: "Active records",
      trend: "up",
      icon: Users,
      iconBg: "bg-primary/10 text-primary",
      link: "/admin/students",
    },
    {
      title: "Classes",
      value: String(classCount),
      change: "School classes",
      trend: "up",
      icon: Layers,
      iconBg: "bg-accent/10 text-accent",
      link: "/admin/classes",
    },
    {
      title: "Fees Collected",
      value: formatNaira(feesCollected),
      change: `${term || "Term"} · success`,
      trend: "up",
      icon: CreditCard,
      iconBg: "bg-emerald-50 text-emerald-600",
      link: "/admin/fees/payments",
    },
    {
      title: "Results Status",
      value: `${publishedClasses} pub`,
      change: `${draftClasses} draft class(es)`,
      trend: draftClasses > 0 ? "down" : "up",
      icon: AlertCircle,
      iconBg: "bg-secondary/10 text-secondary",
      link: "/admin/results",
    },
  ];

  const quickActions = [
    {
      title: "Add New Student",
      desc: "Register student profile",
      icon: UserPlus,
      path: "/admin/students/add",
      btnBg: "bg-primary hover:bg-accent text-white",
      iconBg: "bg-white/10 text-white",
    },
    {
      title: "Record Payment",
      desc: "Log fee transaction",
      icon: Wallet,
      path: "/admin/fees/record",
      btnBg: "bg-secondary hover:bg-highlight text-white",
      iconBg: "bg-white/10 text-white",
    },
    {
      title: "Fee Structure",
      desc: "Configure term fees",
      icon: CreditCard,
      path: "/admin/fees/structure",
      btnBg: "bg-slate-800 hover:bg-dark text-white",
      iconBg: "bg-white/10 text-white",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-24 text-sm text-gray">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-6 select-none font-body text-dark">
      <div className="flex flex-col justify-between gap-4 p-6 bg-white border shadow-xs sm:flex-row sm:items-center rounded-2xl border-slate-200/80">
        <div>
          <span className="px-3 py-1 text-xs font-bold tracking-wider uppercase rounded-full font-heading text-secondary bg-secondary/10">
            Admin Workspace
          </span>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight font-heading sm:text-3xl text-dark">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-gray mt-0.5">
            {term} · {session || "—"} — live data from Marian Foundation
            Academy.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/admissions"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white rounded-xl bg-primary"
          >
            Admission applications
          </Link>
          <Link
            to="/admin/students/add"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-accent text-white font-heading font-bold text-xs rounded-xl shadow-xs transition-all duration-200 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Student</span>
          </Link>
          <Link
            to="/admin/fees/payments"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-light hover:bg-slate-200/80 text-dark border border-slate-200 font-heading font-bold text-xs rounded-xl transition-all duration-200 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-gray" />
            <span>Payments</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 text-xs font-medium text-red-700 border border-red-200 bg-red-50 rounded-xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link
                to={stat.link}
                className="flex flex-col justify-between block h-full p-5 transition-all duration-300 bg-white border rounded-2xl border-slate-200/80 hover:border-primary/40 hover:shadow-md group"
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.iconBg}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="inline-flex items-center gap-0.5 text-[10px] font-heading font-bold px-2 py-0.5 rounded-full bg-slate-50 text-gray border border-slate-100">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>{stat.change}</span>
                  </div>
                </div>
                <div className="mt-5">
                  <h3 className="text-2xl font-extrabold transition-colors font-heading text-dark group-hover:text-primary">
                    {stat.value}
                  </h3>
                  <p className="mt-1 text-xs font-semibold text-gray">
                    {stat.title}
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="flex flex-col justify-between p-6 bg-white border shadow-xs xl:col-span-4 rounded-2xl border-slate-200/80">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold font-heading text-dark">
                Quick Actions
              </h2>
              <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-gray">
                Shortcuts
              </span>
            </div>
            <div className="space-y-3">
              {quickActions.map((action) => {
                const ActionIcon = action.icon;
                return (
                  <Link
                    key={action.title}
                    to={action.path}
                    className={`flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${action.btnBg} shadow-xs group`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${action.iconBg}`}
                      >
                        <ActionIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold leading-tight font-heading">
                          {action.title}
                        </h4>
                        <p className="text-[11px] text-white/80 mt-0.5">
                          {action.desc}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 transition-transform text-white/70 group-hover:translate-x-1" />
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="pt-4 mt-6 text-center border-t border-slate-100">
            <p className="text-xs text-gray">
              Need more options? Use the sidebar modules.
            </p>
          </div>
        </div>

        <div className="p-6 bg-white border shadow-xs xl:col-span-8 rounded-2xl border-slate-200/80">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold font-heading text-dark">
                Recent Fee Payments
              </h2>
              <p className="text-xs text-gray mt-0.5">
                Latest successful payments · {term}
              </p>
            </div>
            <Link
              to="/admin/fees/payments"
              className="inline-flex items-center gap-1 text-xs font-bold transition-colors font-heading text-primary hover:text-accent"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-heading font-bold text-gray uppercase tracking-wider bg-slate-50/50">
                  <th className="px-3 py-3 rounded-l-lg">Student</th>
                  <th className="px-3 py-3">Method</th>
                  <th className="px-3 py-3">Amount</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3 rounded-r-lg">Date</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-slate-100">
                {recentPayments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-gray">
                      No payments yet for this term.
                    </td>
                  </tr>
                ) : (
                  recentPayments.map((p) => (
                    <tr
                      key={p._id}
                      className="transition-colors hover:bg-light/60"
                    >
                      <td className="py-3.5 px-3">
                        <div className="font-bold font-heading text-dark">
                          {p.student?.firstName} {p.student?.lastName}
                        </div>
                        <div className="text-[10px] text-gray font-mono">
                          {p.student?.admissionNumber || p.reference}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-gray capitalize">
                        {String(p.method || "").replace("_", " ")}
                      </td>
                      <td className="py-3.5 px-3 font-heading font-bold text-dark">
                        {formatNaira(p.amount)}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-heading font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60 capitalize">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-gray font-medium">
                        {p.paidAt
                          ? new Date(p.paidAt).toLocaleDateString("en-NG", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
