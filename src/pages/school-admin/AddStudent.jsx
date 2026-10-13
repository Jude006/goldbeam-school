import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Save,
  User,
  Phone,
  Copy,
  Check,
  Loader2,
  GraduationCap,
} from "lucide-react";
import { getClasses } from "../../api/classApi";
import { createStudent } from "../../api/studentApi";
import Toast from "../../components/ui/Toast";

const formatPersonName = (value = "") =>
  String(value)
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");

const formatPhone = (value = "") =>
  String(value)
    .replace(/[^\d+\s-]/g, "")
    .trim();

const fullName = (first = "", middle = "", last = "") =>
  [first, middle, last]
    .map((n) => formatPersonName(n))
    .filter(Boolean)
    .join(" ");

const emptyForm = {
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
  passport: null,
};

const AddStudent = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [classes, setClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [credentials, setCredentials] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState({ type: "", message: "" });
  const [formData, setFormData] = useState(emptyForm);
  const [passportPreview, setPassportPreview] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getClasses();
        const list = data.classes || [];
        setClasses(list);
        if (list.length > 0) {
          setFormData((prev) => ({ ...prev, classId: list[0]._id }));
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Could not load classes. Create a class first."
        );
      } finally {
        setLoadingClasses(false);
      }
    };
    load();
  }, []);

  const update = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handlePassportChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setError("Passport image must not exceed 3MB.");
      return;
    }
    update("passport", file);
    setPassportPreview(URL.createObjectURL(file));
  };

  const validateStep1 = () => {
    if (!formData.firstName.trim() || formData.firstName.trim().length < 2) {
      return "Please enter the student’s first name.";
    }
    if (!formData.lastName.trim() || formData.lastName.trim().length < 2) {
      return "Please enter the student’s last name.";
    }
    if (!["Male", "Female"].includes(formData.gender)) {
      return "Please select gender.";
    }
    if (!formData.classId) {
      return "Please select a class. Create a class first if the list is empty.";
    }
    return "";
  };

  const validateStep2 = () => {
    if (!formData.guardianName.trim()) {
      return "Please enter the guardian’s name.";
    }
    if (
      !formData.guardianPhone.trim() ||
      formData.guardianPhone.trim().length < 8
    ) {
      return "Please enter a valid guardian phone number.";
    }
    const email = formData.guardianEmail.trim();
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      return "Guardian email does not look valid. Fix it or leave it empty.";
    }
    if (!formData.address.trim()) {
      return "Please enter a residential address.";
    }
    return "";
  };

  const goNext = () => {
    if (step === 1) {
      const msg = validateStep1();
      if (msg) {
        setError(msg);
        return;
      }
      setFormData((prev) => ({
        ...prev,
        firstName: formatPersonName(prev.firstName),
        middleName: formatPersonName(prev.middleName),
        lastName: formatPersonName(prev.lastName),
      }));
      setError("");
      setStep(2);
      return;
    }
    if (step === 2) {
      const msg = validateStep2();
      if (msg) {
        setError(msg);
        return;
      }
      setFormData((prev) => ({
        ...prev,
        guardianName: formatPersonName(prev.guardianName),
        guardianPhone: formatPhone(prev.guardianPhone),
        guardianEmail: prev.guardianEmail.trim().toLowerCase(),
        address: prev.address.trim().replace(/\s+/g, " "),
      }));
      setError("");
      setStep(3);
    }
  };

  const goBack = () => {
    setError("");
    setStep((s) => Math.max(1, s - 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e1 = validateStep1();
    const e2 = validateStep2();
    if (e1 || e2) {
      setError(e1 || e2);
      setStep(e1 ? 1 : 2);
      return;
    }

    setSubmitting(true);
    setError("");

    const firstName = formatPersonName(formData.firstName);
    const middleName = formatPersonName(formData.middleName);
    const lastName = formatPersonName(formData.lastName);

    try {
      const payload = {
        firstName,
        middleName: middleName || "",
        lastName,
        gender: formData.gender,
        dateOfBirth: formData.dob || null,
        classId: formData.classId,
        guardianName: formatPersonName(formData.guardianName),
        guardianPhone: formatPhone(formData.guardianPhone),
        guardianEmail: formData.guardianEmail.trim().toLowerCase() || null,
        address: formData.address.trim().replace(/\s+/g, " "),
        passport: formData.passport,
      };

      const data = await createStudent(payload);
      setStudentName(fullName(firstName, middleName, lastName));
      setCredentials(data.credentials);
      setToast({
        type: "success",
        message: data.message || "Student created successfully.",
      });
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Could not create the student. Please check the details and try again.";
      setError(msg);
      setToast({ type: "error", message: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const copyCreds = async () => {
    if (!credentials) return;
    const text = `Student: ${studentName}\nAdmission Number: ${credentials.admissionNumber}\nPassword: ${credentials.temporaryPassword}\n\nLog in at the Student Portal with the admission number and password.`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setToast({
        type: "error",
        message: "Could not copy. Please write the details down manually.",
      });
    }
  };

  const selectedClass = classes.find((c) => c._id === formData.classId);

  if (credentials) {
    return (
      <div className="max-w-lg mx-auto space-y-6 font-body text-dark select-none">
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ type: "", message: "" })}
        />
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-emerald-700">
            <Check className="w-5 h-5" />
            <h1 className="font-heading text-xl font-extrabold">
              Student registered
            </h1>
          </div>
          <p className="text-sm text-gray">
            <strong className="text-dark">{studentName}</strong> is in the
            system. Share these login details with the parent. The password is
            only shown once.
          </p>
          <div className="bg-light rounded-xl p-4 space-y-2 text-sm border border-slate-200">
            <p>
              <span className="text-gray">Admission number:</span>{" "}
              <strong className="font-mono">
                {credentials.admissionNumber}
              </strong>
            </p>
            <p>
              <span className="text-gray">Temporary password:</span>{" "}
              <strong className="font-mono">
                {credentials.temporaryPassword}
              </strong>
            </p>
            <p className="text-[11px] text-gray pt-1">
              Login uses the admission number and password (not the parent
              email). Brothers can share the same parent email.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={copyCreds}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-heading font-bold bg-light rounded-xl cursor-pointer"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {copied ? "Copied" : "Copy details"}
            </button>
            <button
              type="button"
              onClick={() => {
                setCredentials(null);
                setFormData((prev) => ({
                  ...emptyForm,
                  classId: prev.classId || classes[0]?._id || "",
                }));
                setStep(1);
                setPassportPreview("");
              }}
              className="px-4 py-2.5 text-xs font-heading font-bold border border-slate-200 rounded-xl cursor-pointer"
            >
              Add another
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/students")}
              className="px-5 py-2.5 bg-primary text-white text-xs font-heading font-bold rounded-xl cursor-pointer"
            >
              Go to Students
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-body text-dark select-none">
      <Toast
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ type: "", message: "" })}
      />

      <div className="flex items-center gap-3 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <Link
          to="/admin/students"
          className="p-2 bg-light hover:bg-slate-200/80 text-gray rounded-xl cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1">
          <h1 className="font-heading text-xl sm:text-2xl font-extrabold">
            Add New Student
          </h1>
          <p className="text-xs text-gray mt-0.5">
            Step {step} of 3 — middle name is optional.
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        {["Student", "Guardian", "Confirm"].map((label, i) => {
          const n = i + 1;
          const active = step === n;
          const done = step > n;
          return (
            <div
              key={label}
              className={`flex-1 rounded-xl px-3 py-2 text-center text-[11px] font-heading font-bold border ${
                active
                  ? "bg-primary text-white border-primary"
                  : done
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-white text-gray border-slate-200"
              }`}
            >
              {n}. {label}
            </div>
          );
        })}
      </div>

      {error && (
        <div className="px-4 py-3 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-xl">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6"
      >
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-heading text-xs font-bold text-secondary uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
              <User className="w-4 h-4" /> Personal information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">
                  First name *
                </label>
                <input
                  required
                  value={formData.firstName}
                  onChange={(e) => update("firstName", e.target.value)}
                  onBlur={() =>
                    update("firstName", formatPersonName(formData.firstName))
                  }
                  placeholder="e.g. Chinedu"
                  className="w-full px-3.5 py-2.5 text-sm bg-light border border-slate-200 rounded-xl focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Middle name
                </label>
                <input
                  value={formData.middleName}
                  onChange={(e) => update("middleName", e.target.value)}
                  onBlur={() =>
                    update("middleName", formatPersonName(formData.middleName))
                  }
                  placeholder="Optional"
                  className="w-full px-3.5 py-2.5 text-sm bg-light border border-slate-200 rounded-xl focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Last name *
                </label>
                <input
                  required
                  value={formData.lastName}
                  onChange={(e) => update("lastName", e.target.value)}
                  onBlur={() =>
                    update("lastName", formatPersonName(formData.lastName))
                  }
                  placeholder="e.g. Okeke"
                  className="w-full px-3.5 py-2.5 text-sm bg-light border border-slate-200 rounded-xl focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Gender *
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => update("gender", e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-light border border-slate-200 rounded-xl focus:outline-none focus:border-primary"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Date of birth
                </label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => update("dob", e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-light border border-slate-200 rounded-xl focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Class *
                </label>
                <select
                  required
                  value={formData.classId}
                  onChange={(e) => update("classId", e.target.value)}
                  disabled={loadingClasses || classes.length === 0}
                  className="w-full px-3.5 py-2.5 text-sm bg-light border border-slate-200 rounded-xl focus:outline-none focus:border-primary disabled:opacity-60"
                >
                  {classes.length === 0 ? (
                    <option value="">No classes — create one first</option>
                  ) : (
                    classes.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name} ({c.level})
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            <div>
              <label className="block mb-1 text-xs font-semibold">
                Student passport photograph
              </label>
              <div className="flex flex-wrap items-center gap-4">
                <label className="inline-flex items-center justify-center px-4 py-2.5 text-xs font-heading font-bold text-white bg-primary hover:bg-accent rounded-xl cursor-pointer">
                  Choose passport photo
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePassportChange}
                    className="hidden"
                  />
                </label>
                {passportPreview && (
                  <img
                    src={passportPreview}
                    alt="Selected student passport"
                    className="object-cover w-20 h-24 border-2 rounded-xl border-primary"
                  />
                )}
                {formData.passport && (
                  <div>
                    <p className="text-xs font-semibold text-dark">
                      {formData.passport.name}
                    </p>
                    <p className="mt-1 text-[11px] text-gray">
                      {(formData.passport.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                )}
              </div>
              <p className="mt-1 text-[11px] text-gray">
                JPG, PNG, or WebP. Maximum size: 3MB.
              </p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-heading text-xs font-bold text-secondary uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
              <Phone className="w-4 h-4" /> Guardian details
            </h3>
            <p className="text-[11px] text-gray">
              Parent email is optional. The same email can be used for more than
              one child.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Guardian name *
                </label>
                <input
                  required
                  value={formData.guardianName}
                  onChange={(e) => update("guardianName", e.target.value)}
                  onBlur={() =>
                    update(
                      "guardianName",
                      formatPersonName(formData.guardianName)
                    )
                  }
                  className="w-full px-3.5 py-2.5 text-sm bg-light border border-slate-200 rounded-xl focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Phone number *
                </label>
                <input
                  required
                  type="tel"
                  value={formData.guardianPhone}
                  onChange={(e) => update("guardianPhone", e.target.value)}
                  placeholder="0803..."
                  className="w-full px-3.5 py-2.5 text-sm bg-light border border-slate-200 rounded-xl focus:outline-none focus:border-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">
                Guardian email (optional)
              </label>
              <input
                type="email"
                value={formData.guardianEmail}
                onChange={(e) => update("guardianEmail", e.target.value)}
                placeholder="parent@email.com"
                className="w-full px-3.5 py-2.5 text-sm bg-light border border-slate-200 rounded-xl focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">
                Residential address *
              </label>
              <textarea
                required
                rows={3}
                value={formData.address}
                onChange={(e) => update("address", e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-light border border-slate-200 rounded-xl focus:outline-none focus:border-primary resize-none"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="font-heading text-xs font-bold text-secondary uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
              <GraduationCap className="w-4 h-4" /> Confirm before saving
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-xl bg-light border border-slate-100">
                <p className="text-[10px] uppercase text-gray font-bold">
                  Student
                </p>
                <p className="font-heading font-bold mt-1">
                  {fullName(
                    formData.firstName,
                    formData.middleName,
                    formData.lastName
                  )}
                </p>
                <p className="text-xs text-gray mt-1">
                  {formData.gender}
                  {formData.dob ? ` · ${formData.dob}` : ""}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-light border border-slate-100">
                <p className="text-[10px] uppercase text-gray font-bold">
                  Class
                </p>
                <p className="font-heading font-bold mt-1">
                  {selectedClass
                    ? `${selectedClass.name} (${selectedClass.level})`
                    : "—"}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-light border border-slate-100 sm:col-span-2">
                <p className="text-[10px] uppercase text-gray font-bold">
                  Guardian
                </p>
                <p className="font-heading font-bold mt-1">
                  {formatPersonName(formData.guardianName)}
                </p>
                <p className="text-xs text-gray mt-1">
                  {formData.guardianPhone}
                  {formData.guardianEmail
                    ? ` · ${formData.guardianEmail.trim().toLowerCase()}`
                    : ""}
                </p>
                <p className="text-xs text-gray mt-1">{formData.address}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap justify-between gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() =>
              step === 1 ? navigate("/admin/students") : goBack()
            }
            className="px-4 py-2.5 text-xs font-heading font-bold text-gray bg-light rounded-xl cursor-pointer"
          >
            {step === 1 ? "Cancel" : "Back"}
          </button>
          <div className="flex gap-2">
            {step < 3 ? (
              <button
                type="button"
                onClick={goNext}
                disabled={loadingClasses || classes.length === 0}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-accent text-white text-xs font-heading font-bold rounded-xl cursor-pointer disabled:opacity-60"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting || classes.length === 0}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-accent text-white text-xs font-heading font-bold rounded-xl cursor-pointer disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save student
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddStudent;