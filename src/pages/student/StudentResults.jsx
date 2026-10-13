import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getStudentReport } from "../../api/resultApi";
import { getAcademicSettings } from "../../api/academicSettingsApi";
import StudentPrimaryResults from "./StudentPrimaryResults";
import StudentSecondaryResults from "./StudentSecondaryResults";

/**
 * Student portal results entry.
 * Loads session/term defaults, then picks primary vs secondary layout
 * from report.scoreMode (same idea as admin ReportRouter).
 */
const StudentResults = () => {
  const { user } = useAuth();
  const profile = user?.studentProfile;
  const studentId =
    typeof profile === "object" && profile
      ? profile._id || profile.id
      : profile;

  const [mode, setMode] = useState(null); // "primary" | "secondary"
  const [bootError, setBootError] = useState("");

  useEffect(() => {
    if (!studentId) {
      setMode("secondary");
      return;
    }

    let cancelled = false;

    const detect = async () => {
      try {
        let session = "2026/2027";
        let term = "1st Term";
        try {
          const res = await getAcademicSettings();
          session = res.settings?.session || session;
          term = res.settings?.currentTerm || term;
        } catch {
          // keep defaults
        }

        const data = await getStudentReport(studentId, { session, term });
        if (cancelled) return;
        const scoreMode = data.report?.scoreMode;
        setMode(scoreMode === "primary" ? "primary" : "secondary");
      } catch {
        // Unpublished / no result yet — still try class level from profile
        if (cancelled) return;
        const className =
          (typeof profile === "object" && profile?.class?.name) ||
          profile?.className ||
          "";
        const level =
          (typeof profile === "object" && profile?.class?.level) || "";
        const raw = `${level} ${className}`.toUpperCase().replace(/\s+/g, "");
        const isPrimary =
          raw.includes("PRIMARY") ||
          raw.includes("NURSERY") ||
          /^P[1-6]/.test(raw);
        setMode(isPrimary ? "primary" : "secondary");
      }
    };

    detect();
    return () => {
      cancelled = true;
    };
  }, [studentId, profile]);

  if (!studentId) {
    return (
      <div className="p-6 text-sm font-semibold text-red-600">
        Student profile not linked. Contact the school office.
      </div>
    );
  }

  if (!mode) {
    return (
      <div className="flex items-center justify-center gap-2 py-20 text-sm text-slate-500">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading your result page...
      </div>
    );
  }

  if (bootError) {
    return (
      <div className="p-6 text-sm text-red-600">{bootError}</div>
    );
  }

  return mode === "primary" ? (
    <StudentPrimaryResults />
  ) : (
    <StudentSecondaryResults />
  );
};

export default StudentResults;