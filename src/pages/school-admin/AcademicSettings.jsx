import React, { useEffect, useState } from "react";
import {
  Settings,
  Save,
  Calendar,
  Loader2,
  Pencil,
  X,
  Lock,
  Upload,
  Trash2,
  PenLine,
} from "lucide-react";
import {
  getAcademicSettings,
  updateAcademicSettings,
  uploadOfficialSignature,
  removeOfficialSignature,
} from "../../api/academicSettingsApi";

const API_ORIGIN =
  (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(
    /\/api\/?$/,
    "",
  ) || "http://localhost:5000";

const sigUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
};

/** Secondary report card roles (unchanged) */
const SECONDARY_SIGNATURE_ROLES = [
  {
    role: "principal",
    label: "Principal",
    nameKey: "principalName",
    sigKey: "principalSignature",
  },
  {
    role: "formTeacher",
    label: "Form Teacher",
    nameKey: "formTeacherName",
    sigKey: "formTeacherSignature",
  },
  {
    role: "houseMaster",
    label: "House Master",
    nameKey: "houseMasterName",
    sigKey: "houseMasterSignature",
  },
  {
    role: "guidanceCounsellor",
    label: "Guidance Counsellor",
    nameKey: "guidanceCounsellorName",
    sigKey: "guidanceCounsellorSignature",
  },
];

/** Primary report card roles (new) */
const PRIMARY_SIGNATURE_ROLES = [
  {
    role: "primaryTeacher",
    label: "Class Teacher (Primary)",
    nameKey: "primaryTeacherName",
    sigKey: "primaryTeacherSignature",
  },
  {
    role: "dean",
    label: "Dean",
    nameKey: "deanName",
    sigKey: "deanSignature",
  },
  {
    role: "primaryManager",
    label: "Primary School Manager",
    nameKey: "primaryManagerName",
    sigKey: "primaryManagerSignature",
  },
];

const emptyForm = () => ({
  session: "",
  currentTerm: "1st Term",
  caMax: 40,
  examMax: 60,
  passMark: 40,
  grades: [],
  schoolName: "",
  // Secondary
  principalName: "",
  principalSignature: "",
  formTeacherName: "",
  formTeacherSignature: "",
  houseMasterName: "",
  houseMasterSignature: "",
  guidanceCounsellorName: "",
  guidanceCounsellorSignature: "",
  // Primary
  primaryTeacherName: "",
  primaryTeacherSignature: "",
  deanName: "",
  deanSignature: "",
  primaryManagerName: "",
  primaryManagerSignature: "",
});

const AcademicSettings = () => {
  const [form, setForm] = useState(emptyForm());
  const [backup, setBackup] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingRole, setUploadingRole] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const applySettings = (s = {}) => {
    const next = {
      session: s.session || "",
      currentTerm: s.currentTerm || "1st Term",
      caMax: s.caMax ?? 40,
      examMax: s.examMax ?? 60,
      passMark: s.passMark ?? 40,
      grades: Array.isArray(s.grades) ? s.grades : [],
      schoolName: s.schoolName || "",
      principalName: s.principalName || "",
      principalSignature: s.principalSignature || "",
      formTeacherName: s.formTeacherName || "",
      formTeacherSignature: s.formTeacherSignature || "",
      houseMasterName: s.houseMasterName || "",
      houseMasterSignature: s.houseMasterSignature || "",
      guidanceCounsellorName: s.guidanceCounsellorName || "",
      guidanceCounsellorSignature: s.guidanceCounsellorSignature || "",
      primaryTeacherName: s.primaryTeacherName || "",
      primaryTeacherSignature: s.primaryTeacherSignature || "",
      deanName: s.deanName || "",
      deanSignature: s.deanSignature || "",
      primaryManagerName: s.primaryManagerName || "",
      primaryManagerSignature: s.primaryManagerSignature || "",
    };
    console.log("📅 applySettings:", next);
    setForm(next);
    setBackup(next);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setMessage({ type: "", text: "" });
      console.log("📅 Loading academic settings...");
      try {
        const data = await getAcademicSettings();
        console.log("✅ Settings loaded:", data.settings);
        applySettings(data.settings);
      } catch (err) {
        console.error("❌ Load settings failed:", err);
        setMessage({
          type: "error",
          text: err.response?.data?.message || "Failed to load settings.",
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const startEdit = () => {
    setBackup(form);
    setMessage({ type: "", text: "" });
    setIsEditing(true);
    console.log("✏️ Edit mode ON");
  };

  const cancelEdit = () => {
    if (backup) setForm(backup);
    setMessage({ type: "", text: "" });
    setIsEditing(false);
    console.log("↩️ Edit cancelled");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });
    console.log("💾 Saving academic settings:", form);

    try {
      const payload = {
        session: form.session,
        currentTerm: form.currentTerm,
        caMax: form.caMax,
        examMax: form.examMax,
        passMark: form.passMark,
        grades: form.grades,
        schoolName: form.schoolName,
        principalName: form.principalName,
        formTeacherName: form.formTeacherName,
        houseMasterName: form.houseMasterName,
        guidanceCounsellorName: form.guidanceCounsellorName,
        primaryTeacherName: form.primaryTeacherName,
        deanName: form.deanName,
        primaryManagerName: form.primaryManagerName,
      };

      const data = await updateAcademicSettings(payload);
      console.log("✅ Settings saved:", data.settings);
      applySettings(data.settings);
      setIsEditing(false);
      setMessage({
        type: "success",
        text: data.message || "Settings saved successfully.",
      });
    } catch (err) {
      console.error("❌ Save settings failed:", err);
      const apiErrors = err.response?.data?.errors;
      setMessage({
        type: "error",
        text:
          (apiErrors && apiErrors[0]) ||
          err.response?.data?.message ||
          "Could not save settings.",
      });
    } finally {
      setSaving(false);
    }
  };

  const allRoles = [...SECONDARY_SIGNATURE_ROLES, ...PRIMARY_SIGNATURE_ROLES];

  const handleUpload = async (role, file) => {
    if (!file) return;

    const nameKey = allRoles.find((r) => r.role === role)?.nameKey;
    const name = nameKey ? form[nameKey] || "" : "";

    setUploadingRole(role);
    setMessage({ type: "", text: "" });
    console.log("✍️ Uploading signature:", role, file.name, "name:", name);

    try {
      const data = await uploadOfficialSignature(role, file, name);
      console.log("✅ Signature uploaded:", data.path || data.settings);
      applySettings(data.settings);
      setMessage({
        type: "success",
        text: data.message || "Signature uploaded successfully.",
      });
    } catch (err) {
      console.error("❌ Upload signature failed:", err);
      setMessage({
        type: "error",
        text:
          err.response?.data?.message ||
          "Upload failed. Use PNG/JPG under 2MB.",
      });
    } finally {
      setUploadingRole("");
    }
  };

  const handleRemoveSig = async (role) => {
    setUploadingRole(role);
    setMessage({ type: "", text: "" });
    console.log("🗑️ Removing signature:", role);

    try {
      const data = await removeOfficialSignature(role);
      console.log("✅ Signature removed:", role);
      applySettings(data.settings);
      setMessage({
        type: "success",
        text: data.message || "Signature removed.",
      });
    } catch (err) {
      console.error("❌ Remove signature failed:", err);
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Could not remove signature.",
      });
    } finally {
      setUploadingRole("");
    }
  };

  const inputClass = `w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none transition ${
    isEditing
      ? "bg-light border-slate-200 focus:border-primary"
      : "bg-slate-50 border-slate-100 text-dark cursor-default"
  }`;

  const renderSignatureGroup = (title, subtitle, roles) => (
    <div className="space-y-4">
      <h3 className="flex items-center gap-2 pb-2 text-xs font-bold tracking-wider uppercase border-b font-heading text-secondary border-slate-100">
        <PenLine className="w-4 h-4" />
        {title}
      </h3>
      <p className="text-[11px] text-gray">{subtitle}</p>

      {roles.map((item) => (
        <div
          key={item.role}
          className="flex flex-col gap-3 p-4 border sm:flex-row sm:items-center rounded-xl border-slate-100 bg-slate-50/40"
        >
          <div className="flex-1 min-w-0 space-y-2">
            <p className="text-xs font-bold font-heading text-dark">
              {item.label}
            </p>
            <input
              value={form[item.nameKey] || ""}
              disabled={!isEditing}
              onChange={(e) =>
                setForm({ ...form, [item.nameKey]: e.target.value })
              }
              placeholder={`${item.label} full name`}
              className={inputClass}
            />
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center justify-center overflow-hidden bg-white border rounded-lg w-28 h-14 border-slate-200">
              {form[item.sigKey] ? (
                <img
                  src={sigUrl(form[item.sigKey])}
                  alt={`${item.label} signature`}
                  className="object-contain max-h-12 max-w-[6.5rem]"
                  onError={(e) => {
                    console.warn("Signature image failed:", form[item.sigKey]);
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <span className="text-[10px] text-gray">No signature</span>
              )}
            </div>

            <label className="inline-flex items-center gap-1.5 px-3 py-2 text-[11px] font-bold text-white bg-primary rounded-xl cursor-pointer hover:bg-accent disabled:opacity-60">
              {uploadingRole === item.role ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Upload className="w-3.5 h-3.5" />
              )}
              Upload
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                className="hidden"
                disabled={!!uploadingRole}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  e.target.value = "";
                  if (f) handleUpload(item.role, f);
                }}
              />
            </label>

            {form[item.sigKey] ? (
              <button
                type="button"
                disabled={!!uploadingRole}
                onClick={() => handleRemoveSig(item.role)}
                className="p-2 text-red-600 rounded-lg cursor-pointer hover:bg-red-50 disabled:opacity-50"
                title="Remove signature"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-20 text-sm text-gray">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading academic settings...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 select-none font-body text-dark">
      <div className="p-6 bg-white border shadow-xs rounded-2xl border-slate-200/80">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase font-heading text-primary">
              <Settings className="w-4 h-4 text-secondary" />
              Academic Setup
            </div>
            <h1 className="mt-1 text-2xl font-extrabold font-heading">
              Academic Settings
            </h1>
            <p className="text-xs text-gray mt-0.5 max-w-md">
              Session, term, grading, and official signatures (primary &amp;
              secondary) used on report cards.
            </p>
          </div>

          {!isEditing ? (
            <button
              type="button"
              onClick={startEdit}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-accent text-white text-xs font-heading font-bold rounded-xl cursor-pointer shrink-0"
            >
              <Pencil className="w-4 h-4" />
              Edit Settings
            </button>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-heading font-bold uppercase tracking-wider shrink-0">
              <Pencil className="w-3.5 h-3.5" />
              Editing
            </div>
          )}
        </div>
      </div>

      {message.text && (
        <div
          className={`px-4 py-3 text-xs font-medium rounded-xl border ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {!isEditing && (
        <div className="flex items-start gap-2 px-4 py-3 text-xs border text-gray bg-light border-slate-200/80 rounded-xl">
          <Lock className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary" />
          <p>
            Session and score settings are locked until you click{" "}
            <strong>Edit Settings</strong>. Signature images can still be
            uploaded or removed anytime.
          </p>
        </div>
      )}

      <form
        onSubmit={handleSave}
        className="p-6 space-y-6 bg-white border shadow-xs sm:p-8 rounded-2xl border-slate-200/80"
      >
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 pb-2 text-xs font-bold tracking-wider uppercase border-b font-heading text-secondary border-slate-100">
            <Calendar className="w-4 h-4" />
            Session & Term
          </h3>

          <div>
            <label className="block mb-1 text-xs font-semibold">
              School Name
            </label>
            <input
              value={form.schoolName}
              disabled={!isEditing}
              onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
              placeholder="Amazing Grace Academy"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block mb-1 text-xs font-semibold">
                Current Session *
              </label>
              <input
                value={form.session}
                disabled={!isEditing}
                onChange={(e) => setForm({ ...form, session: e.target.value })}
                placeholder="e.g. 2026/2027"
                className={inputClass}
              />
              <p className="text-[11px] text-gray mt-1">Format: 2026/2027</p>
            </div>

            <div>
              <label className="block mb-1 text-xs font-semibold">
                Current Term *
              </label>
              <select
                value={form.currentTerm}
                disabled={!isEditing}
                onChange={(e) =>
                  setForm({ ...form, currentTerm: e.target.value })
                }
                className={inputClass}
              >
                <option value="1st Term">1st Term</option>
                <option value="2nd Term">2nd Term</option>
                <option value="3rd Term">3rd Term</option>
              </select>
              <p className="text-[11px] text-gray mt-1">
                Change when the term ends. It does not switch automatically.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="pb-2 text-xs font-bold tracking-wider uppercase border-b font-heading text-secondary border-slate-100">
            Score Setup
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block mb-1 text-xs font-semibold">CA Max</label>
              <input
                type="number"
                min={1}
                max={100}
                disabled={!isEditing}
                value={form.caMax}
                onChange={(e) =>
                  setForm({ ...form, caMax: Number(e.target.value) })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="block mb-1 text-xs font-semibold">
                Exam Max
              </label>
              <input
                type="number"
                min={1}
                max={100}
                disabled={!isEditing}
                value={form.examMax}
                onChange={(e) =>
                  setForm({ ...form, examMax: Number(e.target.value) })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="block mb-1 text-xs font-semibold">
                Pass Mark
              </label>
              <input
                type="number"
                min={0}
                max={100}
                disabled={!isEditing}
                value={form.passMark}
                onChange={(e) =>
                  setForm({ ...form, passMark: Number(e.target.value) })
                }
                className={inputClass}
              />
            </div>
          </div>

          <p className="text-[11px] text-gray">
            CA Max + Exam Max must equal <strong>100</strong>. Example: CA 40 +
            Exam 60.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="pb-2 text-xs font-bold tracking-wider uppercase border-b font-heading text-secondary border-slate-100">
            Grading Scale
          </h3>
          <p className="text-[11px] text-gray">
            Used when results are calculated. Example: total 75 → Grade A.
          </p>

          <div className="overflow-x-auto border rounded-xl border-slate-100">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left border-b text-gray bg-slate-50/80 border-slate-100">
                  <th className="py-2.5 px-3 font-heading font-bold">Grade</th>
                  <th className="py-2.5 px-3 font-heading font-bold">Min</th>
                  <th className="py-2.5 px-3 font-heading font-bold">Max</th>
                  <th className="py-2.5 px-3 font-heading font-bold">Remark</th>
                </tr>
              </thead>
              <tbody>
                {form.grades.map((g) => (
                  <tr
                    key={g.grade}
                    className="border-b border-slate-50 last:border-0"
                  >
                    <td className="py-2.5 px-3 font-bold text-primary">
                      {g.grade}
                    </td>
                    <td className="py-2.5 px-3">{g.min}</td>
                    <td className="py-2.5 px-3">{g.max}</td>
                    <td className="py-2.5 px-3 text-gray">{g.remark}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {renderSignatureGroup(
          "Secondary Signatures (JSS / SS Report Card)",
          "Used on junior and senior secondary termly reports. PNG or JPG, max 2MB. Upload works even when settings are locked.",
          SECONDARY_SIGNATURE_ROLES,
        )}

        {renderSignatureGroup(
          "Primary Signatures (Primary Report Card)",
          "Used only on primary report cards: Class Teacher, Dean, and Primary School Manager. Separate from secondary.",
          PRIMARY_SIGNATURE_ROLES,
        )}

        {isEditing && (
          <div className="flex flex-wrap items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={cancelEdit}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-heading font-bold text-gray bg-light hover:bg-slate-200/80 rounded-xl cursor-pointer disabled:opacity-60"
            >
              <X className="w-4 h-4" />
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
                  Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default AcademicSettings;
