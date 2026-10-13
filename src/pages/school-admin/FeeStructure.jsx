import React, { useEffect, useState } from "react";
import {
  PlusCircle,
  Edit,
  Trash2,
  Wallet,
  X,
  Save,
  Loader2,
} from "lucide-react";
import {
  getFeeStructures,
  createFeeStructure,
  updateFeeStructure,
  deleteFeeStructure,
} from "../../api/feeApi";
import { getClasses } from "../../api/classApi";
import { getAcademicSettings } from "../../api/academicSettingsApi";
import Toast from "../../components/ui/Toast";

const emptyForm = {
  title: "",
  classId: "",
  term: "1st Term",
  amount: "",
  description: "",
};

const FeeStructure = () => {
  const [fees, setFees] = useState([]);
  const [classes, setClasses] = useState([]);
  const [session, setSession] = useState("");
  const [termFilter, setTermFilter] = useState("1st Term");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [toast, setToast] = useState({ type: "", message: "" });

  const showToast = (type, message) => setToast({ type, message });

  const load = async (sess, term) => {
    setLoading(true);
    try {
      const data = await getFeeStructures({ session: sess, term });
      setFees(data.fees || []);
      if (data.session) setSession(data.session);
      if (data.term) setTermFilter(data.term);
    } catch (err) {
      showToast(
        "error",
        err.response?.data?.message || "Could not load fee structures."
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
        const term = settingsRes.settings?.currentTerm || "1st Term";
        setSession(sess);
        setTermFilter(term);
        setForm((f) => ({
          ...f,
          classId: list[0]?._id || "",
          term,
        }));
        await load(sess, term);
      } catch (err) {
        showToast(
          "error",
          err.response?.data?.message || "Could not load page data."
        );
        setLoading(false);
      }
    };
    boot();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setFormError("");
    setForm({
      ...emptyForm,
      classId: classes[0]?._id || "",
      term: termFilter,
    });
    setShowModal(true);
  };

  const openEdit = (fee) => {
    setEditingId(fee._id);
    setFormError("");
    setForm({
      title: fee.title || "",
      classId: fee.class?._id || fee.class || "",
      term: fee.term || termFilter,
      amount: String(fee.amount ?? ""),
      description: fee.description || "",
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError("");

    const title = form.title.trim();
    const amount = Number(form.amount);

    if (!title) {
      setFormError("Please enter a fee name (e.g. Tuition Fee).");
      return;
    }
    if (!form.classId) {
      setFormError("Please select a class.");
      return;
    }
    if (!Number.isFinite(amount) || amount < 0) {
      setFormError("Please enter a valid amount (0 or more).");
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await updateFeeStructure(editingId, {
          title,
          amount,
          description: form.description.trim(),
        });
        showToast("success", "Fee item updated successfully.");
      } else {
        await createFeeStructure({
          title,
          classId: form.classId,
          term: form.term,
          session,
          amount,
          description: form.description.trim(),
        });
        showToast("success", "Fee item created successfully.");
      }
      setShowModal(false);
      setEditingId(null);
      await load(session, termFilter);
    } catch (err) {
      const msg =
        err.response?.data?.message || "Could not save fee structure.";
      setFormError(msg);
      showToast("error", msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (
      !window.confirm(
        `Remove "${title || "this fee"}"? Students will no longer be billed for it.`
      )
    ) {
      return;
    }
    try {
      await deleteFeeStructure(id);
      showToast("success", "Fee item removed.");
      await load(session, termFilter);
    } catch (err) {
      showToast(
        "error",
        err.response?.data?.message || "Could not remove fee item."
      );
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

      <div className="flex flex-col justify-between gap-4 p-6 bg-white border shadow-xs sm:flex-row sm:items-center rounded-2xl border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase font-heading text-primary">
            <Wallet className="w-4 h-4 text-secondary" />
            Fee Management
          </div>
          <h1 className="mt-1 text-2xl font-extrabold font-heading sm:text-3xl">
            Fee Structure
          </h1>
          <p className="text-xs sm:text-sm text-gray mt-0.5">
            {session || "—"} · Create fees by class and term
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          disabled={classes.length === 0}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-accent text-white font-heading font-bold text-xs rounded-xl cursor-pointer disabled:opacity-60"
        >
          <PlusCircle className="w-4 h-4" />
          Add Fee Item
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 p-4 bg-white border shadow-xs rounded-2xl border-slate-200/80">
        <label className="text-xs font-semibold text-gray">Term:</label>
        <select
          value={termFilter}
          onChange={(e) => {
            setTermFilter(e.target.value);
            load(session, e.target.value);
          }}
          className="px-3 py-2 text-sm border bg-light border-slate-200 rounded-xl focus:outline-none focus:border-primary cursor-pointer"
        >
          <option value="1st Term">1st Term</option>
          <option value="2nd Term">2nd Term</option>
          <option value="3rd Term">3rd Term</option>
        </select>
      </div>

      <div className="overflow-hidden bg-white border shadow-xs rounded-2xl border-slate-200/80">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-gray">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-heading font-bold text-gray uppercase tracking-wider bg-slate-50/60">
                  <th className="py-3.5 px-4">Fee Name</th>
                  <th className="py-3.5 px-4">Class</th>
                  <th className="py-3.5 px-4">Term</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {fees.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-gray">
                      No fee items for this term. Click “Add Fee Item”.
                    </td>
                  </tr>
                ) : (
                  fees.map((fee) => (
                    <tr key={fee._id} className="hover:bg-light/60">
                      <td className="py-3.5 px-4 font-heading font-bold">
                        {fee.title}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-primary">
                        {fee.class?.name || "—"}
                      </td>
                      <td className="py-3.5 px-4 text-gray">{fee.term}</td>
                      <td className="py-3.5 px-4 font-bold">
                        ₦{Number(fee.amount || 0).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => openEdit(fee)}
                          className="p-1.5 hover:bg-amber-50 text-amber-600 rounded-lg cursor-pointer"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(fee._id, fee.title)}
                          className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg cursor-pointer"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/40">
          <div className="w-full max-w-md p-6 space-y-5 bg-white border shadow-xl rounded-2xl border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold font-heading">
                {editingId ? "Edit Fee Item" : "Add Fee Item"}
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg hover:bg-light cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="px-3 py-2 text-xs font-medium text-red-700 border border-red-200 bg-red-50 rounded-xl">
                {formError}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block mb-1 text-xs font-semibold">
                  Fee Name *
                </label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Tuition Fee"
                  className="w-full px-3.5 py-2.5 text-sm bg-light border border-slate-200 rounded-xl focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-xs font-semibold">
                    Class *
                  </label>
                  <select
                    required
                    disabled={!!editingId}
                    value={form.classId}
                    onChange={(e) =>
                      setForm({ ...form, classId: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-sm bg-light border border-slate-200 rounded-xl focus:outline-none focus:border-primary disabled:opacity-60 cursor-pointer"
                  >
                    {classes.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-xs font-semibold">
                    Term *
                  </label>
                  <select
                    value={form.term}
                    disabled={!!editingId}
                    onChange={(e) =>
                      setForm({ ...form, term: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-sm bg-light border border-slate-200 rounded-xl focus:outline-none focus:border-primary disabled:opacity-60 cursor-pointer"
                  >
                    <option value="1st Term">1st Term</option>
                    <option value="2nd Term">2nd Term</option>
                    <option value="3rd Term">3rd Term</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1 text-xs font-semibold">
                  Amount (₦) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={form.amount}
                  onChange={(e) =>
                    setForm({ ...form, amount: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 text-sm bg-light border border-slate-200 rounded-xl focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block mb-1 text-xs font-semibold">
                  Description
                </label>
                <input
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 text-sm bg-light border border-slate-200 rounded-xl focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 text-xs font-heading font-bold bg-light rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-xs font-heading font-bold rounded-xl cursor-pointer disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {editingId ? "Update" : "Save"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeStructure;