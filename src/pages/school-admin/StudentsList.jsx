import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  PlusCircle,
  Eye,
  Edit,
  Filter,
  UserCheck,
  GraduationCap,
  Loader2,
  Upload,
} from "lucide-react";
import { getStudents } from "../../api/studentApi";
import { getClasses } from "../../api/classApi";

const StudentsList = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStudents = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (selectedClass !== "All") params.classId = selectedClass;

      const data = await getStudents(params);
      setStudents(data.students || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load students.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getClasses()
      .then((data) => setClasses(data.classes || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const t = setTimeout(fetchStudents, 300);
    return () => clearTimeout(t);
  }, [searchTerm, selectedClass]);

  return (
    <div className="space-y-6 select-none font-body text-dark">
      <div className="flex flex-col justify-between gap-4 p-6 bg-white border shadow-xs sm:flex-row sm:items-center rounded-2xl border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase font-heading text-primary">
            <GraduationCap className="w-4 h-4 text-secondary" />
            Student Directory
          </div>
          <h1 className="mt-1 text-2xl font-extrabold font-heading sm:text-3xl">
            All Students
          </h1>
          <p className="text-xs sm:text-sm text-gray mt-0.5">
            Manage student records, view profiles, and update details.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/admin/students/add"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-accent text-white font-heading font-bold text-xs rounded-xl cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Add New Student
          </Link>
          <Link
            to="/admin/students/import"
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-primary text-primary font-heading font-bold text-xs rounded-xl"
          >
            <Upload className="w-4 h-4" />
            Import Excel
          </Link>
          <Link
            to="/admin/students/promote"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-accent text-white font-heading font-bold text-xs rounded-xl cursor-pointer"
          >
            Promote Student
          </Link>
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 text-xs font-medium text-red-700 border border-red-200 bg-red-50 rounded-xl">
          {error}
        </div>
      )}

      <div className="flex flex-col items-center justify-between gap-4 p-4 bg-white border shadow-xs rounded-2xl border-slate-200/80 md:flex-row">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name or admission number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 pl-10 pr-4 text-sm border bg-light border-slate-200 rounded-xl focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center justify-end w-full gap-3 md:w-auto">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray shrink-0">
            <Filter className="w-3.5 h-3.5 text-secondary" />
            Class:
          </div>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 text-sm border cursor-pointer bg-light border-slate-200 rounded-xl focus:outline-none focus:border-primary"
          >
            <option value="All">All Classes</option>
            {classes.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
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
                  <th className="py-3.5 px-4">Admission No.</th>
                  <th className="py-3.5 px-4">Student Name</th>
                  <th className="py-3.5 px-4">Class</th>
                  <th className="py-3.5 px-4">Guardian & Phone</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-gray">
                      No students found.
                    </td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <tr key={student._id} className="hover:bg-light/60">
                      <td className="py-3.5 px-4 font-mono text-gray font-semibold">
                        {student.admissionNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold font-heading">
                          {student.firstName} {student.lastName}
                        </div>
                        <div className="text-[10px] text-gray">
                          {student.gender}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-primary">
                        {student.class?.name || "—"}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium">
                          {student.guardianName}
                        </div>
                        <div className="text-[10px] text-gray">
                          {student.guardianPhone}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-heading font-bold ${
                            student.status === "Active"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          <UserCheck className="w-3 h-3" />
                          {student.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() =>
                              navigate(`/admin/students/${student._id}`)
                            }
                            className="p-1.5 hover:bg-primary/10 text-primary rounded-lg cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              navigate(`/admin/students/${student._id}/edit`)
                            }
                            className="p-1.5 hover:bg-amber-50 text-amber-600 rounded-lg cursor-pointer"
                          >
                            <Edit className="w-4 h-4" />
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
    </div>
  );
};

export default StudentsList;
