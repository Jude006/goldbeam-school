import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getStudentReport } from "../../api/resultApi";
import StudentReport from "./StudentReport";
import PrimaryStudentReport from "./PrimaryStudentReport";
import { Loader2 } from "lucide-react";

const ReportRouter = () => {
  const { studentId } = useParams();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState(null);

  useEffect(() => {
    const params = {};
    if (searchParams.get("session")) params.session = searchParams.get("session");
    if (searchParams.get("term")) params.term = searchParams.get("term");

    getStudentReport(studentId, params)
      .then((d) =>
        setMode(d.report?.scoreMode === "primary" ? "primary" : "secondary")
      )
      .catch(() => setMode("secondary"));
  }, [studentId, searchParams]);

  if (!mode) {
    return (
      <div className="flex items-center justify-center gap-2 py-20 text-sm text-gray">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading...
      </div>
    );
  }

  return mode === "primary" ? <PrimaryStudentReport /> : <StudentReport />;
};

export default ReportRouter;