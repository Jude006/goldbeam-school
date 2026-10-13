import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  User,
  Phone,
  GraduationCap,
  Loader2,
  KeyRound,
  Copy,
  Check,
  Trash2,
  Camera,
} from "lucide-react";
import {
  getStudentById,
  regenerateStudentPassword,
  deleteStudent,
  activateStudent,
} from "../../api/studentApi";

const displayName = (s) =>
  [s?.firstName, s?.middleName, s?.lastName].filter(Boolean).join(" ");

const StudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [credentials, setCredentials] = useState(null);
  const [resetting, setResetting] = useState(false);
  const [copied, setCopied] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getStudentById(id);
      setStudent(data.student);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load student.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleResetPassword = async () => {
    const ok = window.confirm(
      "Generate a new temporary password for this student? The old password will stop working."
    );
    if (!ok) return;
    setResetting(true);
    try {
      const data = await regenerateStudentPassword(id);
      setCredentials(data.credentials);
    } catch (err) {
      window.alert(
        err.response?.data?.message || "Could not regenerate password."
      );
    } finally {
      setResetting(false);
    }
  };

  const handleDelete = async () => {
    const ok = window.confirm(`Deactivate ${displayName(student)}?`);
    if (!ok) return;
    try {
      await deleteStudent(id);
      navigate("/admin/students");
    } catch (err) {
      window.alert(
        err.response?.data?.message || "Could not deactivate student."
      );
    }
  };

  const handleActivate = async () => {
    const ok = window.confirm(`Activate ${displayName(student)} again?`);
    if (!ok) return;
    try {
      await activateStudent(id);
      await load();
    } catch (err) {
      window.alert(
        err.response?.data?.message || "Could not activate student."
      );
    }
  };

  const copyCreds = async () => {
    if (!credentials) return;
    const text = `Admission Number: ${credentials.admissionNumber}
Password: ${credentials.temporaryPassword}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.alert("Could not copy credentials.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-20 text-sm text-gray">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading student...
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="max-w-xl mx-auto space-y-4">
        <div className="px-4 py-3 text-xs font-medium text-red-700 border border-red-200 rounded-xl bg-red-50">
          {error || "Student not found."}
        </div>
        <Link
          to="/admin/students"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to students
        </Link>
      </div>
    );
  }

  const name = displayName(student);

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-body text-dark">
      <div className="flex flex-col justify-between gap-4 p-6 bg-white border shadow-xs sm:flex-row sm:items-center rounded-2xl border-slate-200/80">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/students"
            className="p-2 rounded-xl bg-light text-gray hover:bg-slate-200/80"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-extrabold sm:text-2xl font-heading">
              {name}
            </h1>
            <p className="mt-0.5 text-xs text-gray font-mono">
              {student.admissionNumber}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleResetPassword}
            disabled={resetting}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold border border-slate-200 rounded-xl hover:bg-light disabled:opacity-60"
          >
            <KeyRound className="w-4 h-4" />
            {resetting ? "Resetting..." : "Reset Password"}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/admin/students/${student._id}/edit`)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white rounded-xl bg-primary"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
          {student.status === "Active" ? (
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-rose-600 border border-rose-200 rounded-xl hover:bg-rose-50"
            >
              <Trash2 className="w-4 h-4" />
              Deactivate
            </button>
          ) : (
            <button
              type="button"
              onClick={handleActivate}
              className="px-4 py-2.5 text-xs font-bold text-emerald-700 border border-emerald-200 rounded-xl hover:bg-emerald-50"
            >
              Activate
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[220px_1fr]">
        <div className="flex flex-col items-center justify-center p-6 bg-white border shadow-xs rounded-2xl border-slate-200/80">
          <div className="relative flex items-center justify-center w-36 h-44 overflow-hidden border-2 rounded-2xl bg-light border-primary/20">
            {student.passportUrl ? (
              <img
                src={student.passportUrl}
                alt={`${name} passport`}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray">
                <Camera className="w-8 h-8" />
                <span className="text-xs">No passport photo</span>
              </div>
            )}
          </div>
          <p className="mt-3 text-[11px] font-semibold tracking-wide text-gray uppercase">
            Student passport
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="p-6 space-y-4 bg-white border shadow-xs rounded-2xl border-slate-200/80">
            <h3 className="flex items-center gap-2 pb-2 text-xs font-bold tracking-wider uppercase border-b text-secondary border-slate-100 font-heading">
              <User className="w-4 h-4" />
              Personal
            </h3>
            <Info label="Full Name" value={name} />
            <Info label="First Name" value={student.firstName} />
            <Info label="Middle Name" value={student.middleName || "—"} />
            <Info label="Last Name" value={student.lastName} />
            <Info label="Gender" value={student.gender} />
            <Info
              label="Date of Birth"
              value={
                student.dateOfBirth
                  ? new Date(student.dateOfBirth).toLocaleDateString("en-NG")
                  : "—"
              }
            />
            <Info label="Status" value={student.status} />
          </div>

          <div className="p-6 space-y-4 bg-white border shadow-xs rounded-2xl border-slate-200/80">
            <h3 className="flex items-center gap-2 pb-2 text-xs font-bold tracking-wider uppercase border-b text-secondary border-slate-100 font-heading">
              <GraduationCap className="w-4 h-4" />
              Academic
            </h3>
            <Info label="Admission Number" value={student.admissionNumber} />
            <Info label="Class" value={student.class?.name || "—"} />
            <Info label="Level" value={student.class?.level || "—"} />
            <Info label="Room" value={student.class?.room || "—"} />
          </div>
        </div>
      </div>

      {credentials && (
        <div className="p-5 space-y-3 border rounded-2xl bg-emerald-50 border-emerald-200">
          <p className="text-sm font-bold text-emerald-800 font-heading">
            New password generated
          </p>
          <div className="space-y-1 text-sm">
            <p>
              <span className="text-gray">Admission No:</span>{" "}
              <strong className="font-mono">
                {credentials.admissionNumber}
              </strong>
            </p>
            <p>
              <span className="text-gray">Password:</span>{" "}
              <strong className="font-mono">
                {credentials.temporaryPassword}
              </strong>
            </p>
          </div>
          <button
            type="button"
            onClick={copyCreds}
            className="inline-flex items-center gap-2 px-3 py-2 text-xs font-bold bg-white border rounded-xl border-emerald-200"
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            {copied ? "Copied" : "Copy credentials"}
          </button>
        </div>
      )}

      <div className="p-6 space-y-4 bg-white border shadow-xs rounded-2xl border-slate-200/80">
        <h3 className="flex items-center gap-2 pb-2 text-xs font-bold tracking-wider uppercase border-b text-secondary border-slate-100 font-heading">
          <Phone className="w-4 h-4" />
          Guardian
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Info label="Guardian Name" value={student.guardianName} />
          <Info label="Phone" value={student.guardianPhone} />
          <Info label="Email" value={student.guardianEmail || "—"} />
          <Info label="Address" value={student.address || "—"} />
        </div>
      </div>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div>
    <p className="text-[11px] font-semibold tracking-wider uppercase text-gray">
      {label}
    </p>
    <p className="mt-0.5 text-sm font-medium">{value || "—"}</p>
  </div>
);

export default StudentDetails;