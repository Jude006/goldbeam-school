import React, { useCallback, useEffect, useState } from "react";
import {
  Search,
  PlusCircle,
  Edit,
  Trash2,
  BookOpen,
  X,
  Save,
  Loader2,
  Filter,
} from "lucide-react";
import {
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
} from "../../api/subjectApi";
import Toast from "../../components/ui/Toast";

const emptyForm = {
  name: "",
  code: "",
  category: "Core",
  levelBand: "Both",
};

const LEVEL_LABELS = {
  Primary: "Primary",
  Junior: "Junior (JSS)",
  Senior: "Senior (SS)",
  Both: "Junior & Senior",
  All: "All levels",
};

const SubjectsList = () => {
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [toast, setToast] = useState({ type: "", message: "" });

  const showToast = (type, message) => {
    setToast({ type, message });
  };

  const fetchSubjects = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSubjects({
        search: search.trim() || undefined,
        levelBand: levelFilter || undefined,
        category: categoryFilter || undefined,
      });
      setSubjects(data.subjects || []);
    } catch (err) {
      showToast(
        "error",
        err.response?.data?.message || "Could not load subjects."
      );
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  }, [search, levelFilter, categoryFilter]);

  useEffect(() => {
    const t = setTimeout(() => {
      fetchSubjects();
    }, search ? 350 : 0);
    return () => clearTimeout(t);
  }, [fetchSubjects, search]);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setShowForm(true);
  };

  const openEdit = (sub) => {
    setEditingId(sub._id);
    setForm({
      name: sub.name || "",
      code: (sub.code || "").toUpperCase(),
      category: sub.category || "Core",
      levelBand: sub.levelBand || "Both",
    });
    setFormError("");
    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;
    setShowForm(false);
    setFormError("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError("");

    const name = form.name.trim().replace(/\s+/g, " ");
    const code = form.code.trim().toUpperCase().replace(/\s+/g, "");

    if (!name) {
      setFormError("Please enter the subject name.");
      return;
    }
    if (!code) {
      setFormError("Please enter a subject code (for example MTH).");
      return;
    }
    if (code.length < 2 || code.length > 12) {
      setFormError("Subject code should be between 2 and 12 characters.");
      return;
    }

    const payload = {
      name,
      code,
      category: form.category || "Core",
      levelBand: form.levelBand || "Both",
    };

    setSaving(true);
    try {
      if (editingId) {
        const data = await updateSubject(editingId, payload);
        showToast(
          "success",
          data.message || `"${payload.name}" updated successfully.`
        );
      } else {
        const data = await createSubject(payload);
        showToast(
          "success",
          data.message || `"${payload.name}" created successfully.`
        );
      }
      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
      await fetchSubjects();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Could not save subject. Please try again.";
      setFormError(msg);
      showToast("error", msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (sub) => {
    const ok = window.confirm(
      `Remove "${sub.name}" (${sub.code})?\n\nIf scores already exist for this subject, it will only be hidden from new entries.`
    );
    if (!ok) return;

    try {
      const data = await deleteSubject(sub._id);
      showToast("success", data.message || `"${sub.name}" has been removed.`);
      await fetchSubjects();
    } catch (err) {
      showToast(
        "error",
        err.response?.data?.message || "Could not delete subject."
      );
    }
  };

  return (
    <div className="space-y-6 select-none font-body text-dark">
      <Toast
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ type: "", message: "" })}
      />

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 p-6 bg-white border shadow-xs sm:flex-row sm:items-center rounded-2xl border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase font-heading text-primary">
            <BookOpen className="w-4 h-4 text-secondary" />
            Subjects
          </div>
          <h1 className="mt-1 text-2xl font-extrabold font-heading sm:text-3xl">
            All Subjects
          </h1>
          <p className="text-xs sm:text-sm text-gray mt-0.5">
            {subjects.length} subject{subjects.length !== 1 ? "s" : ""} shown
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-accent text-white font-heading font-bold text-xs rounded-xl cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          Add Subject
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 p-4 bg-white border shadow-xs rounded-2xl border-slate-200/80 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or code..."
            className="w-full py-2.5 pl-10 pr-4 text-sm border bg-light border-slate-200 rounded-xl focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray">
            <Filter className="w-3.5 h-3.5 text-secondary" />
            Filter
          </span>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-3 py-2 text-sm border bg-light border-slate-200 rounded-xl focus:outline-none focus:border-primary"
          >
            <option value="">All levels</option>
            <option value="Primary">Primary</option>
            <option value="Junior">Junior (JSS)</option>
            <option value="Senior">Senior (SS)</option>
            <option value="Both">Both only (JSS &amp; SS)</option>
            <option value="All">Shared by all levels</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-sm border bg-light border-slate-200 rounded-xl focus:outline-none focus:border-primary"
          >
            <option value="">All categories</option>
            <option value="Core">Core</option>
            <option value="Elective">Elective</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden bg-white border shadow-xs rounded-2xl border-slate-200/80">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-gray">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading subjects...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-heading font-bold text-gray uppercase tracking-wider bg-slate-50/60">
                  <th className="py-3.5 px-4">Subject</th>
                  <th className="py-3.5 px-4">Code</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Level</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subjects.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray">
                      No subjects found. Add a subject to get started.
                    </td>
                  </tr>
                ) : (
                  subjects.map((s) => (
                    <tr key={s._id} className="hover:bg-light/60">
                      <td className="py-3.5 px-4 font-heading font-bold">
                        {s.name}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-gray">
                        {s.code}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            s.category === "Core"
                              ? "bg-primary/10 text-primary"
                              : "bg-secondary/10 text-secondary"
                          }`}
                        >
                          {s.category || "Core"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-gray">
                        {LEVEL_LABELS[s.levelBand] || s.levelBand || "Both"}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            title="Edit"
                            onClick={() => openEdit(s)}
                            className="p-1.5 hover:bg-amber-50 text-amber-600 rounded-lg cursor-pointer"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            title="Delete"
                            onClick={() => handleDelete(s)}
                            className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/40">
          <div
            className="w-full max-w-md p-6 space-y-5 bg-white shadow-xl rounded-2xl"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold font-heading">
                {editingId ? "Edit Subject" : "Add Subject"}
              </h2>
              <button
                type="button"
                onClick={closeForm}
                className="p-1.5 hover:bg-light rounded-lg cursor-pointer"
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
                  Subject name *
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  placeholder="e.g. Mathematics"
                  className="w-full px-3.5 py-2.5 text-sm bg-light border border-slate-200 rounded-xl focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-xs font-semibold">
                    Code *
                  </label>
                  <input
                    required
                    value={form.code}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        code: e.target.value.toUpperCase().replace(/\s+/g, ""),
                      })
                    }
                    placeholder="MTH"
                    maxLength={12}
                    className="w-full px-3.5 py-2.5 text-sm font-mono bg-light border border-slate-200 rounded-xl focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-xs font-semibold">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-sm bg-light border border-slate-200 rounded-xl focus:outline-none focus:border-primary"
                  >
                    <option value="Core">Core</option>
                    <option value="Elective">Elective</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1 text-xs font-semibold">
                  Offered to *
                </label>
                <select
                  value={form.levelBand}
                  onChange={(e) =>
                    setForm({ ...form, levelBand: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 text-sm bg-light border border-slate-200 rounded-xl focus:outline-none focus:border-primary"
                >
                  <option value="Primary">Primary only</option>
                  <option value="Junior">Junior secondary only (JSS)</option>
                  <option value="Senior">Senior secondary only (SS)</option>
                  <option value="Both">Junior &amp; Senior (Both)</option>
                  <option value="All">All levels (Primary + JSS + SS)</option>
                </select>
                <p className="mt-1 text-[10px] text-gray">
                  Use <strong>Primary</strong> for primary report-card subjects.
                  Use <strong>Both</strong> for subjects shared by JSS and SS.
                  Use <strong>All</strong> only if the same subject is used from
                  primary through secondary.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-1">
                <button
                  type="button"
                  disabled={saving}
                  onClick={closeForm}
                  className="px-4 py-2.5 text-xs font-heading font-bold bg-light rounded-xl cursor-pointer disabled:opacity-60"
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
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {editingId ? "Save changes" : "Create subject"}
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

export default SubjectsList;