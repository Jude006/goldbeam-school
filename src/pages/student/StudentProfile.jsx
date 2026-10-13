import React from "react";
import {
  User,
  Phone,
  GraduationCap,
  Camera,
  Loader2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const formatDate = (value) => {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString("en-NG", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
};

const StudentProfile = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-20 text-sm text-gray">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading profile...
      </div>
    );
  }

  // Prefer populated studentProfile from /auth/me
  const profile =
    user?.studentProfile && typeof user.studentProfile === "object"
      ? user.studentProfile
      : null;

  const firstName = user?.firstName || profile?.firstName || "";
  const lastName = user?.lastName || profile?.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim() || "Student";
  const admissionNo =
    user?.admissionNumber || profile?.admissionNumber || "—";
  const className =
    profile?.class?.name ||
    (typeof profile?.class === "string" ? profile.class : null) ||
    "—";
  const gender = profile?.gender || user?.gender || "—";
  const dob = formatDate(profile?.dateOfBirth);
  const passportUrl = profile?.passportUrl || user?.passportUrl || "";

  const guardianName = profile?.guardianName || "—";
  const guardianPhone = profile?.guardianPhone || "—";
  const guardianEmail = profile?.guardianEmail || "—";
  const address = profile?.address || "—";
  const status = profile?.status || "Active";

  const initial = fullName.charAt(0).toUpperCase() || "S";

  return (
    <div className="max-w-4xl mx-auto space-y-6 select-none font-body text-dark">
      {/* Header */}
      <div className="flex items-center gap-4 p-6 bg-white border shadow-xs rounded-2xl border-slate-200/80">
        <div className="relative flex items-center justify-center w-16 h-16 overflow-hidden text-2xl font-black text-white shrink-0 rounded-2xl bg-primary font-heading">
          {passportUrl ? (
            <img
              src={passportUrl}
              alt={fullName}
              className="object-cover w-full h-full"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            initial
          )}
        </div>
        <div className="min-w-0">
          <h1 className="text-xl font-extrabold tracking-tight font-heading sm:text-2xl text-dark truncate">
            {fullName}
          </h1>
          <p className="font-mono text-xs text-gray">
            {admissionNo} • Class:{" "}
            <span className="font-bold text-primary">{className}</span>
          </p>
          <p className="mt-1 text-[11px] text-gray">
            Status:{" "}
            <span
              className={
                status === "Active"
                  ? "font-bold text-emerald-700"
                  : "font-bold text-amber-700"
              }
            >
              {status}
            </span>
          </p>
        </div>
      </div>

      {/* Passport card + details */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[200px_1fr]">
        <div className="flex flex-col items-center justify-center p-5 bg-white border shadow-xs rounded-2xl border-slate-200/80">
          <div className="relative flex items-center justify-center w-36 h-44 overflow-hidden border-2 rounded-2xl bg-light border-primary/20">
            {passportUrl ? (
              <img
                src={passportUrl}
                alt={`${fullName} passport`}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 px-3 text-center text-gray">
                <Camera className="w-8 h-8" />
                <span className="text-[11px]">
                  No passport photo yet. The school office can add it.
                </span>
              </div>
            )}
          </div>
          <p className="mt-3 text-[11px] font-semibold tracking-wide uppercase text-gray">
            Student passport
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Academic / personal */}
          <div className="p-6 space-y-4 bg-white border shadow-xs rounded-2xl border-slate-200/80">
            <h3 className="flex items-center gap-2 pb-2 text-xs font-bold tracking-wider uppercase border-b font-heading text-secondary border-slate-100">
              <GraduationCap className="w-4 h-4" />
              Academic info
            </h3>

            <div className="space-y-3 text-xs">
              <Row label="Full name" value={fullName} />
              <Row label="Admission number" value={admissionNo} mono />
              <Row label="Class" value={className} />
              <Row label="Gender" value={gender} />
              <Row label="Date of birth" value={dob} />
            </div>
          </div>

          {/* Guardian */}
          <div className="p-6 space-y-4 bg-white border shadow-xs rounded-2xl border-slate-200/80">
            <h3 className="flex items-center gap-2 pb-2 text-xs font-bold tracking-wider uppercase border-b font-heading text-secondary border-slate-100">
              <Phone className="w-4 h-4" />
              Guardian & contact
            </h3>

            <div className="space-y-3 text-xs">
              <Row label="Parent / guardian" value={guardianName} />
              <Row label="Phone number" value={guardianPhone} />
              <Row label="Email address" value={guardianEmail || "—"} />
              <Row label="Residential address" value={address} />
            </div>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-gray text-center px-4">
        To correct your details or passport photo, please contact the school
        office. Students cannot edit this profile online.
      </p>
    </div>
  );
};

const Row = ({ label, value, mono }) => (
  <div>
    <span className="block text-gray">{label}</span>
    <span
      className={`font-bold text-dark ${mono ? "font-mono" : ""} break-words`}
    >
      {value || "—"}
    </span>
  </div>
);

export default StudentProfile;