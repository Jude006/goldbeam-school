import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  CreditCard,
  PlusCircle,
  Filter,
  Loader2,
  Mail,
  Wallet,
  Hash,
  User,
} from "lucide-react";
import { getPayments, sendFeeDueNotices } from "../../api/feeApi";
import { getClasses } from "../../api/classApi";
import { getAcademicSettings } from "../../api/academicSettingsApi";
import Toast from "../../components/ui/Toast";

const formatNaira = (n) =>
  `₦${Number(n || 0).toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [session, setSession] = useState("");
  const [term, setTerm] = useState("1st Term");
  const [searchTerm, setSearchTerm] = useState("");
  const [methodFilter, setMethodFilter] = useState("All");
  const [notifyClassId, setNotifyClassId] = useState("");
  const [loading, setLoading] = useState(true);
  const [notifying, setNotifying] = useState(false);
  const [toast, setToast] = useState({ type: "", message: "" });

  const showToast = (type, message) => {
    setToast({ type, message });
  };

  const load = async (sess, t) => {
    setLoading(true);
    try {
      const data = await getPayments({ session: sess, term: t });
      setPayments(data.payments || []);
      setSession(data.session || sess);
      setTerm(data.term || t);
    } catch (err) {
      showToast(
        "error",
        err.response?.data?.message ||
          "Could not load payments. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const boot = async () => {
      try {
        const [classRes, settingsRes] = await Promise.all([
          getClasses(),
          getAcademicSettings(),
        ]);
        const list = classRes.classes || [];
        setClasses(list);
        const sess = settingsRes.settings?.session || "";
        const t = settingsRes.settings?.currentTerm || "1st Term";
        setNotifyClassId(list[0]?._id || "");
        await load(sess, t);
      } catch {
        setLoading(false);
        showToast("error", "Could not load page data.");
      }
    };
    boot();
  }, []);

  const filtered = useMemo(() => {
    return payments.filter((p) => {
      const name = `${p.student?.firstName || ""} ${p.student?.lastName || ""}`;
      const adm = p.student?.admissionNumber || "";
      const q = searchTerm.toLowerCase().trim();
      const matchSearch =
        !q ||
        name.toLowerCase().includes(q) ||
        adm.toLowerCase().includes(q);
      const matchMethod = methodFilter === "All" || p.method === methodFilter;
      return matchSearch && matchMethod;
    });
  }, [payments, searchTerm, methodFilter]);

  /** Totals for current filters (term + search + method) */
  const stats = useMemo(() => {
    const success = filtered.filter(
      (p) => !p.status || p.status === "success"
    );
    const totalAmount = success.reduce(
      (sum, p) => sum + Number(p.amount || 0),
      0
    );
    const count = success.length;

    // Group by student for “this student paid X”
    const byStudent = {};
    success.forEach((p) => {
      const id = String(p.student?._id || p.student || "unknown");
      if (!byStudent[id]) {
        byStudent[id] = {
          id,
          name: `${p.student?.firstName || ""} ${p.student?.lastName || ""}`.trim() || "Student",
          admissionNumber: p.student?.admissionNumber || "—",
          total: 0,
          count: 0,
        };
      }
      byStudent[id].total += Number(p.amount || 0);
      byStudent[id].count += 1;
    });

    const studentGroups = Object.values(byStudent);
    const singleStudent =
      searchTerm.trim() && studentGroups.length === 1
        ? studentGroups[0]
        : null;

    return {
      totalAmount,
      count,
      studentGroups,
      singleStudent,
    };
  }, [filtered, searchTerm]);

  const handleNotify = async () => {
    if (!notifyClassId) {
      showToast("error", "Please select a class for reminders.");
      return;
    }
    if (
      !window.confirm(
        "Send fee-due emails to parents in this class who still have a balance?"
      )
    ) {
      return;
    }
    setNotifying(true);
    try {
      const data = await sendFeeDueNotices({
        classId: notifyClassId,
        session,
        term,
      });
      showToast(
        "success",
        data.message || "Fee reminders sent successfully."
      );
    } catch (err) {
      showToast(
        "error",
        err.response?.data?.message || "Could not send fee reminders."
      );
    } finally {
      setNotifying(false);
    }
  };

  return (
    <div className="space-y-6 select-none font-body text-dark">
      {toast.message && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ type: "", message: "" })}
        />
      )}

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 p-6 bg-white border shadow-xs sm:flex-row sm:items-center rounded-2xl border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase font-heading text-primary">
            <CreditCard className="w-4 h-4 text-secondary" />
            Payments
          </div>
          <h1 className="mt-1 text-2xl font-extrabold font-heading sm:text-3xl">
            Payment Records
          </h1>
          <p className="text-xs sm:text-sm text-gray mt-0.5">
            {session || "—"} · {term} · Cash & bank transfer only
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleNotify}
            disabled={notifying || !notifyClassId}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-primary text-primary font-heading font-bold text-xs rounded-xl cursor-pointer disabled:opacity-60"
          >
            <Mail className="w-4 h-4" />
            {notifying ? "Sending..." : "Send Fee Reminders"}
          </button>
          <Link
            to="/admin/fees/record"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-accent text-white font-heading font-bold text-xs rounded-xl cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Record Payment
          </Link>
        </div>
      </div>

      {/* Summary cards — totals for current filters */}
      {!loading && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="p-4 bg-white border shadow-xs rounded-2xl border-slate-200/80">
            <div className="flex items-center gap-2 text-[11px] font-heading font-bold uppercase tracking-wider text-gray">
              <Wallet className="w-3.5 h-3.5 text-secondary" />
              {stats.singleStudent ? "Student total paid" : "Total collected"}
            </div>
            <p className="mt-1 text-xl font-extrabold font-heading text-primary sm:text-2xl">
              {formatNaira(
                stats.singleStudent
                  ? stats.singleStudent.total
                  : stats.totalAmount
              )}
            </p>
            <p className="mt-0.5 text-[11px] text-gray">
              {session || "—"} · {term}
              {methodFilter !== "All"
                ? ` · ${methodFilter.replace("_", " ")}`
                : ""}
            </p>
          </div>

          <div className="p-4 bg-white border shadow-xs rounded-2xl border-slate-200/80">
            <div className="flex items-center gap-2 text-[11px] font-heading font-bold uppercase tracking-wider text-gray">
              <Hash className="w-3.5 h-3.5 text-secondary" />
              Payments shown
            </div>
            <p className="mt-1 text-xl font-extrabold font-heading text-dark sm:text-2xl">
              {stats.count}
            </p>
            <p className="mt-0.5 text-[11px] text-gray">
              After search & method filter
            </p>
          </div>

          <div className="p-4 bg-white border shadow-xs rounded-2xl border-slate-200/80">
            <div className="flex items-center gap-2 text-[11px] font-heading font-bold uppercase tracking-wider text-gray">
              <User className="w-3.5 h-3.5 text-secondary" />
              {stats.singleStudent ? "Student" : "Students in list"}
            </div>
            {stats.singleStudent ? (
              <>
                <p className="mt-1 text-sm font-extrabold font-heading text-dark">
                  {stats.singleStudent.name}
                </p>
                <p className="text-[11px] font-mono text-gray">
                  {stats.singleStudent.admissionNumber} ·{" "}
                  {stats.singleStudent.count} payment
                  {stats.singleStudent.count === 1 ? "" : "s"}
                </p>
              </>
            ) : (
              <>
                <p className="mt-1 text-xl font-extrabold font-heading text-dark sm:text-2xl">
                  {stats.studentGroups.length}
                </p>
                <p className="mt-0.5 text-[11px] text-gray">
                  Search a name or admission no. to see one student’s total
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col justify-between gap-4 p-4 bg-white border shadow-xs rounded-2xl border-slate-200/80 lg:flex-row">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search student name or admission no..."
            className="w-full py-2 pl-10 pr-4 text-sm border bg-light border-slate-200 rounded-xl focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-secondary" />
          <select
            value={term}
            onChange={(e) => load(session, e.target.value)}
            className="px-3 py-2 text-sm border cursor-pointer bg-light border-slate-200 rounded-xl"
          >
            <option value="1st Term">1st Term</option>
            <option value="2nd Term">2nd Term</option>
            <option value="3rd Term">3rd Term</option>
          </select>
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-3 py-2 text-sm border cursor-pointer bg-light border-slate-200 rounded-xl"
          >
            <option value="All">All methods</option>
            <option value="cash">Cash</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="other">Other</option>
          </select>
          <select
            value={notifyClassId}
            onChange={(e) => setNotifyClassId(e.target.value)}
            className="px-3 py-2 text-sm border cursor-pointer bg-light border-slate-200 rounded-xl"
            title="Class for fee reminders"
          >
            {classes.length === 0 && <option value="">No classes</option>}
            {classes.map((c) => (
              <option key={c._id} value={c._id}>
                Remind: {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Highlight when one student is searched */}
      {stats.singleStudent && (
        <div className="px-4 py-3 text-xs border bg-primary/5 border-primary/20 rounded-xl text-dark">
          <span className="font-bold font-heading">
            {stats.singleStudent.name}
          </span>{" "}
          <span className="font-mono text-gray">
            ({stats.singleStudent.admissionNumber})
          </span>{" "}
          has paid{" "}
          <span className="font-extrabold font-heading text-primary">
            {formatNaira(stats.singleStudent.total)}
          </span>{" "}
          in {term} ({stats.singleStudent.count} payment
          {stats.singleStudent.count === 1 ? "" : "s"} below).
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden bg-white border shadow-xs rounded-2xl border-slate-200/80">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-gray">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading payments...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-heading font-bold text-gray uppercase tracking-wider bg-slate-50/60">
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Method</th>
                  <th className="py-3.5 px-4">Reference</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-gray">
                      No payments found for this term.
                    </td>
                  </tr>
                ) : (
                  filtered.map((p) => (
                    <tr key={p._id} className="hover:bg-light/60">
                      <td className="py-3.5 px-4 text-gray">
                        {p.paidAt
                          ? new Date(p.paidAt).toLocaleDateString("en-NG")
                          : "—"}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold font-heading">
                          {p.student?.firstName} {p.student?.lastName}
                        </div>
                        <div className="text-[10px] text-gray font-mono">
                          {p.student?.admissionNumber}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-bold">
                        {formatNaira(p.amount)}
                      </td>
                      <td className="py-3.5 px-4 text-gray capitalize">
                        {String(p.method || "").replace("_", " ")}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[10px] text-gray">
                        {p.reference || "—"}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-heading font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 capitalize">
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payments;