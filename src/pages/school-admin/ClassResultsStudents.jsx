import React, { useEffect, useState } from "react";
import { Link, useParams, useSearchParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Eye,
  Loader2,
  GraduationCap,
} from "lucide-react";
import { getStudents } from "../../api/studentApi";
import { getClasses } from "../../api/classApi";

const ClassResultsStudents = () => {
  const { classId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const session = searchParams.get("session") || "";
  const term = searchParams.get("term") || "1st Term";

  const [className, setClassName] = useState("");
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [studentsRes, classesRes] = await Promise.all([
          getStudents({ classId, status: "Active" }),
          getClasses(),
        ]);

        setStudents(studentsRes.students || []);

        const cls = (classesRes.classes || []).find(
          (c) => String(c._id) === String(classId)
        );
        setClassName(cls?.name || "Class");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load students.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [classId]);

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    const name = `${s.firstName || ""} ${s.lastName || ""}`.toLowerCase();
    const adm = (s.admissionNumber || "").toLowerCase();
    return name.includes(q) || adm.includes(q);
  });

  const openReport = (studentId) => {
    navigate(
      `/admin/results/report/${studentId}?session=${encodeURIComponent(
        session
      )}&term=${encodeURIComponent(term)}`
    );
  };

  return (
    <div className="space-y-6 select-none font-body text-dark">
      <div className="flex flex-col gap-4 p-6 bg-white border shadow-xs sm:flex-row sm:items-center rounded-2xl border-slate-200/80">
        <div className="flex items-start min-w-0 gap-3">
          <Link
            to="/admin/results"
            className="p-2 cursor-pointer bg-light hover:bg-slate-200/80 rounded-xl shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase font-heading text-primary">
              <GraduationCap className="w-4 h-4 text-secondary" />
              Class reports
            </div>
            <h1 className="font-heading text-xl sm:text-2xl font-extrabold mt-0.5 truncate">
              {className}
            </h1>
            <p className="text-xs text-gray mt-0.5">
              {term} · {session || "—"} — select a student to view their report card.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 text-xs font-medium text-red-700 border border-red-200 bg-red-50 rounded-xl">
          {error}
        </div>
      )}

      <div className="p-4 bg-white border shadow-xs rounded-2xl border-slate-200/80">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-gray absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or admission number..."
            className="w-full py-2 pl-10 pr-4 text-sm border bg-light border-slate-200 rounded-xl focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="overflow-hidden bg-white border shadow-xs rounded-2xl border-slate-200/80">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-gray">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading students...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-heading font-bold text-gray uppercase tracking-wider bg-slate-50/60">
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Admission No.</th>
                  <th className="py-3.5 px-4">Gender</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-gray">
                      No students found in this class.
                    </td>
                  </tr>
                ) : (
                  filtered.map((s) => (
                    <tr key={s._id} className="hover:bg-light/60">
                      <td className="py-3.5 px-4 font-heading font-bold">
                        {s.firstName} {s.lastName}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-gray">
                        {s.admissionNumber}
                      </td>
                      <td className="py-3.5 px-4 text-gray">
                        {s.gender || "—"}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => openReport(s._id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-heading font-bold text-primary hover:bg-primary/10 rounded-lg cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View report
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
    </div>
  );
};

export default ClassResultsStudents;