import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Search,
  CreditCard,
  Loader2,
  Filter,
} from "lucide-react";
import { getStudents } from "../../api/studentApi";
import { getClasses } from "../../api/classApi";
import { recordPayment, getStudentFeeSummary } from "../../api/feeApi";
import { getAcademicSettings } from "../../api/academicSettingsApi";
import Toast from "../../components/ui/Toast";

const RecordPayment = () => {
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState("All");
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const [selected, setSelected] = useState(null);
  const [summary, setSummary] = useState(null);
  const [session, setSession] = useState("");
  const [term, setTerm] = useState("1st Term");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ type: "", message: "" });
  const [form, setForm] = useState({
    amount: "",
    method: "cash",
    note: "",
  });

  const showToast = (type, message) => setToast({ type, message });

  useEffect(() => {
    const boot = async () => {
      try {
        const [classRes, settingsRes] = await Promise.all([
          getClasses(),
          getAcademicSettings(),
        ]);
        setClasses(classRes.classes || []);
        setSession(settingsRes.settings?.session || "");
        setTerm(settingsRes.settings?.currentTerm || "1st Term");
      } catch {
        showToast("error", "Could not load classes or settings.");
      }
    };
    boot();
  }, []);

  useEffect(() => {
    if (selected) return;

    const hasSearch = search.trim().length > 0;
    const hasClass = classId !== "All";

    if (!hasSearch && !hasClass) {
      setResults([]);
      return;
    }

    const t = setTimeout(async () => {
      setSearching(true);
      try {
        const params = { limit: 50, status: "Active" };
        if (hasSearch) params.search = search.trim();
        if (hasClass) params.classId = classId;
        const data = await getStudents(params);
        setResults(data.students || []);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(t);
  }, [search, classId, selected]);

  const pickStudent = async (s) => {
    setSelected(s);
    setSearch(`${s.firstName} ${s.lastName}`);
    setResults([]);
    setError("");
    try {
      const data = await getStudentFeeSummary(s._id, { session, term });
      setSummary(data);
      if (data.balance > 0) {
        setForm((f) => ({ ...f, amount: String(data.balance) }));
      } else {
        setForm((f) => ({ ...f, amount: "" }));
      }
    } catch (err) {
      setSummary(null);
      setError(
        err.response?.data?.message || "Could not load this student's balance."
      );
    }
  };

  const clearSelection = () => {
    setSelected(null);
    setSummary(null);
    setSearch("");
    setError("");
    setForm((f) => ({ ...f, amount: "", note: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected) return;

    const amount = Number(form.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Enter an amount greater than 0.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const data = await recordPayment({
        studentId: selected._id,
        amount,
        method: form.method,
        note: form.note.trim(),
        session,
        term,
      });

      showToast(
        "success",
        data.message ||
          `Payment of ₦${amount.toLocaleString()} recorded successfully.`
      );

      // Short delay so toast is visible, then go to list
      setTimeout(() => {
        navigate("/admin/fees/payments");
      }, 700);
    } catch (err) {
      const msg =
        err.response?.data?.message || "Could not record payment. Please try again.";
      setError(msg);
      showToast("error", msg);
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 select-none font-body text-dark">
      {toast.message && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ type: "", message: "" })}
        />
      )}

      <div className="flex items-center gap-3 p-6 bg-white border shadow-xs rounded-2xl border-slate-200/80">
        <Link
          to="/admin/fees/payments"
          className="p-2 cursor-pointer bg-light hover:bg-slate-200/80 text-gray rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-extrabold font-heading sm:text-2xl">
            Record Payment
          </h1>
          <p className="text-xs text-gray mt-0.5">
            {session || "—"} · {term} — cash or bank transfer only
          </p>
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 text-xs font-medium text-red-700 border border-red-200 bg-red-50 rounded-xl">
          {error}
        </div>
      )}

      <div className="p-6 space-y-4 bg-white border shadow-xs rounded-2xl border-slate-200/80">
        <h3 className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase font-heading text-secondary">
          <Search className="w-4 h-4" />
          Find Student
        </h3>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="flex items-center gap-1.5 text-[11px] font-semibold text-gray mb-1">
              <Filter className="w-3.5 h-3.5 text-secondary" />
              Filter by class
            </label>
            <select
              value={classId}
              onChange={(e) => {
                setClassId(e.target.value);
                clearSelection();
              }}
              className="w-full px-3.5 py-2.5 text-sm bg-light border border-slate-200 rounded-xl focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="All">All classes</option>
              {classes.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray mb-1">
              Search name / admission no.
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-gray absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelected(null);
                  setSummary(null);
                }}
                placeholder="Type to search..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-light border border-slate-200 rounded-xl focus:outline-none focus:border-primary"
              />
              {searching && (
                <Loader2 className="absolute w-4 h-4 -translate-y-1/2 animate-spin right-3 top-1/2 text-gray" />
              )}
            </div>
          </div>
        </div>

        <p className="text-[11px] text-gray">
          Pick a class or search by name, then click the student to record
          payment.
        </p>

        {!selected && results.length > 0 && (
          <div className="overflow-hidden overflow-y-auto border border-slate-200 rounded-xl max-h-64">
            {results.map((s) => (
              <button
                key={s._id}
                type="button"
                onClick={() => pickStudent(s)}
                className="w-full px-4 py-3 text-left border-b cursor-pointer hover:bg-light last:border-0 border-slate-100"
              >
                <div className="text-sm font-bold font-heading">
                  {s.firstName} {s.lastName}
                </div>
                <div className="text-[11px] text-gray">
                  {s.admissionNumber} · {s.class?.name || "—"}
                </div>
              </button>
            ))}
          </div>
        )}

        {!selected &&
          !searching &&
          (classId !== "All" || search.trim()) &&
          results.length === 0 && (
            <p className="py-4 text-xs text-center text-gray">
              No students found. Try another class or search.
            </p>
          )}

        {selected && summary && (
          <div className="p-4 space-y-2 border bg-primary/5 border-primary/20 rounded-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold font-heading">
                  {selected.firstName} {selected.lastName}
                </p>
                <p className="text-xs text-gray">
                  {selected.admissionNumber} ·{" "}
                  {summary.student?.className || "—"}
                </p>
              </div>
              <button
                type="button"
                onClick={clearSelection}
                className="text-[11px] font-heading font-bold text-primary cursor-pointer hover:underline"
              >
                Change
              </button>
            </div>
            <p className="text-xs">
              Total fees:{" "}
              <strong>₦{Number(summary.totalFees || 0).toLocaleString()}</strong>
              {" · "}
              Paid:{" "}
              <strong className="text-emerald-700">
                ₦{Number(summary.totalPaid || 0).toLocaleString()}
              </strong>
              {" · "}
              Balance:{" "}
              <strong className="text-secondary">
                ₦{Number(summary.balance || 0).toLocaleString()}
              </strong>
            </p>
          </div>
        )}
      </div>

      {selected && (
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5 bg-white border shadow-xs sm:p-8 rounded-2xl border-slate-200/80"
        >
          <h3 className="flex items-center gap-2 pb-2 text-xs font-bold tracking-wider uppercase border-b font-heading text-secondary border-slate-100">
            <CreditCard className="w-4 h-4" />
            Payment Details
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block mb-1 text-xs font-semibold">
                Amount (₦) *
              </label>
              <input
                type="number"
                required
                min="1"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-light border border-slate-200 rounded-xl focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block mb-1 text-xs font-semibold">
                Method *
              </label>
              <select
                value={form.method}
                onChange={(e) => setForm({ ...form, method: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-light border border-slate-200 rounded-xl focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="cash">Cash</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block mb-1 text-xs font-semibold">Note</label>
              <input
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                placeholder="e.g. Part payment / bank teller ref"
                className="w-full px-3.5 py-2.5 text-sm bg-light border border-slate-200 rounded-xl focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate("/admin/fees/payments")}
              className="px-4 py-2.5 text-xs font-heading font-bold bg-light rounded-xl cursor-pointer"
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
                  <Save className="w-4 h-4" /> Save Payment
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default RecordPayment;