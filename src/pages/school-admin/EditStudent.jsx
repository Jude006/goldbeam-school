import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, User, Phone, Loader2, Camera, X } from "lucide-react";
import { getStudentById, updateStudent } from "../../api/studentApi";
import { getClasses } from "../../api/classApi";

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [passportPreview, setPassportPreview] = useState("");
  const [newPassportPreview, setNewPassportPreview] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "Male",
    dob: "",
    classId: "",
    guardianName: "",
    guardianPhone: "",
    guardianEmail: "",
    address: "",
    status: "Active",
    passport: null,
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [studentRes, classRes] = await Promise.all([
          getStudentById(id),
          getClasses(),
        ]);
        const student = studentRes.student;
        setClasses(classRes.classes || []);
        setFormData({
          firstName: student.firstName || "",
          middleName: student.middleName || "",
          lastName: student.lastName || "",
          gender: student.gender || "Male",
          dob: student.dateOfBirth ? student.dateOfBirth.slice(0, 10) : "",
          classId: student.class?._id || student.class || "",
          guardianName: student.guardianName || "",
          guardianPhone: student.guardianPhone || "",
          guardianEmail: student.guardianEmail || "",
          address: student.address || "",
          status: student.status || "Active",
          passport: null,
        });
        setPassportPreview(student.passportUrl || "");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load student.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handlePassportChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      event.target.value = "";
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setError("Passport image must not exceed 3MB.");
      event.target.value = "";
      return;
    }
    setError("");
    updateField("passport", file);
    setNewPassportPreview(URL.createObjectURL(file));
  };

  const removeNewPassport = () => {
    setFormData((current) => ({ ...current, passport: null }));
    if (newPassportPreview) URL.revokeObjectURL(newPassportPreview);
    setNewPassportPreview("");
  };

  useEffect(() => {
    return () => {
      if (newPassportPreview) URL.revokeObjectURL(newPassportPreview);
    };
  }, [newPassportPreview]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await updateStudent(id, {
        firstName: formData.firstName.trim(),
        middleName: (formData.middleName || "").trim(),
        lastName: formData.lastName.trim(),
        gender: formData.gender,
        dateOfBirth: formData.dob || null,
        classId: formData.classId,
        guardianName: formData.guardianName.trim(),
        guardianPhone: formData.guardianPhone.trim(),
        guardianEmail: formData.guardianEmail.trim() || null,
        address: formData.address.trim(),
        status: formData.status,
        passport: formData.passport,
      });
      navigate(`/admin/students/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not update student.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-20 text-sm text-gray">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-body text-dark select-none">
      <div className="flex items-center gap-3 p-6 bg-white border shadow-xs rounded-2xl border-slate-200/80">
        <Link
          to={`/admin/students/${id}`}
          className="p-2 rounded-xl bg-light hover:bg-slate-200/80 text-gray"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-extrabold sm:text-2xl font-heading">
            Edit Student
          </h1>
          <p className="mt-0.5 text-xs text-gray">
            Update student profile information.
          </p>
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 text-xs font-medium text-red-700 border border-red-200 rounded-xl bg-red-50">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="p-6 space-y-6 bg-white border shadow-xs sm:p-8 rounded-2xl border-slate-200/80"
      >
        <section className="space-y-4">
          <h3 className="flex items-center gap-2 pb-2 text-xs font-bold tracking-wider uppercase border-b text-secondary border-slate-100 font-heading">
            <User className="w-4 h-4" />
            Personal Information
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="First Name *">
              <input
                required
                value={formData.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Middle Name">
              <input
                value={formData.middleName}
                onChange={(e) => updateField("middleName", e.target.value)}
                placeholder="Optional"
                className={inputClass}
              />
            </Field>
            <Field label="Last Name *">
              <input
                required
                value={formData.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Gender *">
              <select
                value={formData.gender}
                onChange={(e) => updateField("gender", e.target.value)}
                className={inputClass}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </Field>
            <Field label="Date of Birth">
              <input
                type="date"
                value={formData.dob}
                onChange={(e) => updateField("dob", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Class *">
              <select
                required
                value={formData.classId}
                onChange={(e) => updateField("classId", e.target.value)}
                className={inputClass}
              >
                <option value="">Select class</option>
                {classes.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div>
            <label className="block mb-1 text-xs font-semibold">
              Student Passport
            </label>
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex items-center justify-center w-24 h-28 overflow-hidden border-2 rounded-xl bg-light border-primary/20">
                {newPassportPreview || passportPreview ? (
                  <img
                    src={newPassportPreview || passportPreview}
                    alt="Student passport"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <Camera className="w-7 h-7 text-gray" />
                )}
              </div>
              <div className="space-y-2">
                <label className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white rounded-xl bg-primary cursor-pointer hover:bg-accent">
                  <Camera className="w-4 h-4" />
                  Change passport
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePassportChange}
                    className="hidden"
                  />
                </label>
                {formData.passport && (
                  <button
                    type="button"
                    onClick={removeNewPassport}
                    className="flex items-center gap-1 text-xs font-semibold text-red-600"
                  >
                    <X className="w-3.5 h-3.5" />
                    Remove new photo
                  </button>
                )}
                <p className="text-[11px] text-gray">
                  JPG, PNG, or WebP. Maximum size: 3MB.
                </p>
              </div>
            </div>
          </div>

          <Field label="Status">
            <select
              value={formData.status}
              onChange={(e) => updateField("status", e.target.value)}
              className="w-full max-w-xs px-3.5 py-2.5 text-sm bg-light border border-slate-200 rounded-xl focus:outline-none focus:border-primary"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Graduated">Graduated</option>
              <option value="Transferred">Transferred</option>
            </select>
          </Field>
        </section>

        <section className="pt-2 space-y-4">
          <h3 className="flex items-center gap-2 pb-2 text-xs font-bold tracking-wider uppercase border-b text-secondary border-slate-100 font-heading">
            <Phone className="w-4 h-4" />
            Guardian Details
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Guardian Name *">
              <input
                required
                value={formData.guardianName}
                onChange={(e) => updateField("guardianName", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Phone *">
              <input
                required
                value={formData.guardianPhone}
                onChange={(e) => updateField("guardianPhone", e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
          <Field label="Guardian Email">
            <input
              type="email"
              value={formData.guardianEmail}
              onChange={(e) => updateField("guardianEmail", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Address">
            <textarea
              rows={2}
              value={formData.address}
              onChange={(e) => updateField("address", e.target.value)}
              className={`${inputClass} resize-none`}
            />
          </Field>
        </section>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => navigate(`/admin/students/${id}`)}
            className="px-4 py-2.5 text-xs font-bold bg-light rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white rounded-xl bg-primary disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? "Saving..." : "Update Student"}
          </button>
        </div>
      </form>
    </div>
  );
};

const Field = ({ label, children }) => (
  <div>
    <label className="block mb-1 text-xs font-semibold">{label}</label>
    {children}
  </div>
);

const inputClass =
  "w-full px-3.5 py-2.5 text-sm bg-light border border-slate-200 rounded-xl focus:outline-none focus:border-primary";

export default EditStudent;