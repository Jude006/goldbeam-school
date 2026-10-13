import React, { useCallback, useEffect, useState } from "react";
import {
  Search,
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  Users,
  X,
  Save,
  GraduationCap,
  Loader2,
} from "lucide-react";
import {
  getClasses,
  createClass,
  updateClass,
  deleteClass,
  getClassById,
} from "../../api/classApi";
import Toast from "../../components/ui/Toast";

const emptyForm = {
  name: "",
  level: "JSS",
  capacity: "40",
  room: "",
};

const LEVELS = ["Primary", "JSS", "SS"];

const ClassesList = () => {
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [showView, setShowView] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  const [activeClass, setActiveClass] = useState(null);
  const [classStudents, setClassStudents] = useState([]);
  const [viewLoading, setViewLoading] = useState(false);

  const [toast, setToast] = useState({ type: "", message: "" });

  const showToast = (type, message) => setToast({ type, message });

  const fetchClasses = useCallback(async (q = "") => {
    setLoading(true);
    try {
      const data = await getClasses(q);
      setClasses(data.classes || []);
    } catch (err) {
      showToast(
        "error",
        err.response?.data?.message || "Could not load classes."
      );
      setClasses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  useEffect(() => {
    const t = setTimeout(() => fetchClasses(search.trim()), 350);
    return () => clearTimeout(t);
  }, [search, fetchClasses]);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setShowForm(true);
  };

  const openEdit = (cls) => {
    setEditingId(cls._id);
    setForm({
      name: cls.name || "",
      level: LEVELS.includes(cls.level) ? cls.level : "JSS",
      capacity: String(cls.capacity ?? 40),
      room: cls.room || "",
    });
    setFormError("");
    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;
    setShowForm(false);
    setFormError("");
  };

  const openView = async (cls) => {
    setActiveClass(cls);
    setShowView(true);
    setViewLoading(true);
    setClassStudents([]);
    try {
      const data = await getClassById(cls._id);
      setClassStudents(data.students || []);
      if (data.class) setActiveClass(data.class);
    } catch (err) {
      showToast(
        "error",
        err.response?.data?.message || "Could not load class details."
      );
      setClassStudents([]);
    } finally {
      setViewLoading(false);
    }
  };

  const validateForm = () => {
    const name = form.name.trim();
    if (!name) {
      return "Please enter a class name (for example JSS 1 or SS 2A).";
    }
    if (name.length < 2) {
      return "Class name is too short.";
    }
    if (!LEVELS.includes(form.level)) {
      return "Please select a valid level: Primary, JSS, or SS.";
    }
    const cap = Number(form.capacity);
    if (!Number.isFinite(cap) || cap < 1 || cap > 500) {
      return "Capacity must be a number between 1 and 500.";
    }
    if (form.room && form.room.trim().length > 40) {
      return "Room name is too long (max 40 characters).";
    }
    return "";
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError("");

    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    const payload = {
      name: form.name.trim(),
      level: form.level,
      capacity: Number(form.capacity) || 40,
      room: form.room.trim(),
    };

    setSaving(true);
    try {
      if (editingId) {
        const data = await updateClass(editingId, payload);
        showToast(
          "success",
          data.message || `Class "${payload.name}" updated successfully.`
        );
      } else {
        const data = await createClass(payload);
        showToast(
          "success",
          data.message || `Class created successfully.`
        );
      }
      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
      await fetchClasses(search.trim());
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Could not save class. Please check your details and try again.";
      setFormError(msg);
      showToast("error", msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cls) => {
    const ok = window.confirm(
      `Delete class "${cls.name}"?\n\nYou can only delete a class that has no students.`
    );
    if (!ok) return;

    try {
      const data = await deleteClass(cls._id);
      showToast(
        "success",
        data.message || `Class "${cls.name}" has been deleted.`
      );
      await fetchClasses(search.trim());
    } catch (err) {
      showToast(
        "error",
        err.response?.data?.message || "Could not delete class."
      );
    }
  };

  return (
    <div className="space-y-6 font-body text-dark select-none">
      <Toast
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ type: "", message: "" })}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-wider text-primary">
            <GraduationCap className="w-4 h-4 text-secondary" />
            Class Management
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold mt-1">
            Classes
          </h1>
          <p className="text-xs sm:text-sm text-gray mt-0.5">
            {classes.length} class{classes.length !== 1 ? "es" : ""} found
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-accent text-white font-heading font-bold text-xs rounded-xl cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          Create Class
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search classes..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-light border border-slate-200 rounded-xl focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray text-sm gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading classes...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-heading font-bold text-gray uppercase tracking-wider bg-slate-50/60">
                  <th className="py-3.5 px-4">Class</th>
                  <th className="py-3.5 px-4">Level</th>
                  <th className="py-3.5 px-4">Students</th>
                  <th className="py-3.5 px-4">Capacity</th>
                  <th className="py-3.5 px-4">Room</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {classes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray">
                      No classes yet. Create one to get started.
                    </td>
                  </tr>
                ) : (
                  classes.map((cls) => (
                    <tr key={cls._id} className="hover:bg-light/60">
                      <td className="py-3.5 px-4 font-heading font-bold">
                        {cls.name}
                      </td>
                      <td className="py-3.5 px-4 text-gray">{cls.level}</td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 font-semibold text-primary">
                          <Users className="w-3.5 h-3.5" />
                          {cls.studentCount ?? 0}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-gray">{cls.capacity}</td>
                      <td className="py-3.5 px-4 text-gray">
                        {cls.room || "—"}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            type="button"
                            title="View students"
                            onClick={() => openView(cls)}
                            className="p-1.5 hover:bg-primary/10 text-primary rounded-lg cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            title="Edit"
                            onClick={() => openEdit(cls)}
                            className="p-1.5 hover:bg-amber-50 text-amber-600 rounded-lg cursor-pointer"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            title="Delete"
                            onClick={() => handleDelete(cls)}
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

      {/* Create / Edit modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/40">
          <div
            className="bg-white w-full max-w-md rounded-2xl p-6 space-y-5 shadow-xl"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex justify-between items-center">
              <h2 className="font-heading text-lg font-extrabold">
                {editingId ? "Edit Class" : "Create Class"}
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
              <div className="px-3 py-2 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-xl">
                {formError}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Class name *
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  placeholder="e.g. JSS 1 or SS 2A"
                  className="w-full px-3.5 py-2.5 text-sm bg-light border border-slate-200 rounded-xl focus:outline-none focus:border-primary"
                />
                <p className="mt-1 text-[10px] text-gray">
                  Names are saved in a standard format (e.g. jss1 → JSS 1).
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Level *
                  </label>
                  <select
                    value={form.level}
                    onChange={(e) =>
                      setForm({ ...form, level: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-sm bg-light border border-slate-200 rounded-xl focus:outline-none focus:border-primary"
                  >
                    {LEVELS.map((lv) => (
                      <option key={lv} value={lv}>
                        {lv}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Capacity
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={500}
                    value={form.capacity}
                    onChange={(e) =>
                      setForm({ ...form, capacity: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-sm bg-light border border-slate-200 rounded-xl focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Room</label>
                <input
                  value={form.room}
                  onChange={(e) =>
                    setForm({ ...form, room: e.target.value })
                  }
                  placeholder="Optional"
                  maxLength={40}
                  className="w-full px-3.5 py-2.5 text-sm bg-light border border-slate-200 rounded-xl focus:outline-none focus:border-primary"
                />
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
                      {editingId ? "Save changes" : "Create class"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View students modal */}
      {showView && activeClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/40">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-heading text-lg font-extrabold">
                  {activeClass.name}
                </h2>
                <p className="text-xs text-gray">
                  {viewLoading
                    ? "Loading..."
                    : `${classStudents.length} student(s)`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowView(false)}
                className="p-1.5 hover:bg-light rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {viewLoading ? (
              <div className="flex items-center justify-center gap-2 py-10 text-sm text-gray">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading students...
              </div>
            ) : classStudents.length === 0 ? (
              <p className="text-sm text-gray text-center py-8">
                No students in this class yet.
              </p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {classStudents.map((s) => (
                  <li
                    key={s._id}
                    className="py-3 flex justify-between text-sm gap-3"
                  >
                    <div>
                      <p className="font-heading font-bold">
                        {s.firstName} {s.lastName}
                      </p>
                      <p className="text-[11px] text-gray font-mono">
                        {s.admissionNumber}
                      </p>
                    </div>
                    <span className="text-xs text-gray shrink-0">
                      {s.gender || "—"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassesList;