import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpCircle,
  Loader2,
  CheckSquare,
  Square,
} from "lucide-react";
import { getClasses } from "../../api/classApi";
import { getStudents, promoteStudents } from "../../api/studentApi";

const PromoteStudents = () => {
  const [classes, setClasses] = useState([]);
  const [fromClassId, setFromClassId] = useState("");
  const [toClassId, setToClassId] = useState("");
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [promoteAll, setPromoteAll] = useState(true);

  useEffect(() => {
    getClasses()
      .then((data) => {
        const list = data.classes || [];
        setClasses(list);
        if (list.length > 0) setFromClassId(list[0]._id);
        if (list.length > 1) setToClassId(list[1]._id);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!fromClassId) return;

    const load = async () => {
      setLoading(true);
      setMessage({ type: "", text: "" });
      setSelected([]);
      try {
        const data = await getStudents({ classId: fromClassId, status: "Active" });
        setStudents(data.students || []);
      } catch (err) {
        setMessage({
          type: "error",
          text: err.response?.data?.message || "Failed to load students.",
        });
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [fromClassId]);

  const toggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selected.length === students.length) {
      setSelected([]);
    } else {
      setSelected(students.map((s) => s._id));
    }
  };

  const handlePromote = async () => {
    setMessage({ type: "", text: "" });

    if (!fromClassId || !toClassId) {
      setMessage({ type: "error", text: "Select source and target class." });
      return;
    }
    if (fromClassId === toClassId) {
      setMessage({ type: "error", text: "Source and target class must be different." });
      return;
    }
    if (!promoteAll && selected.length === 0) {
      setMessage({ type: "error", text: "Select at least one student, or choose Promote all." });
      return;
    }

    const fromName = classes.find((c) => c._id === fromClassId)?.name;
    const toName = classes.find((c) => c._id === toClassId)?.name;
    const count = promoteAll ? students.length : selected.length;

    const ok = window.confirm(
      `Move ${count} student(s) from ${fromName} → ${toName}?`
    );
    if (!ok) return;

    setSubmitting(true);
    try {
      const payload = promoteAll
        ? { fromClassId, toClassId }
        : { studentIds: selected, toClassId };

      const data = await promoteStudents(payload);
      setMessage({
        type: "success",
        text: data.message || "Students promoted successfully.",
      });
      setSelected([]);
      // refresh list
      const refreshed = await getStudents({ classId: fromClassId, status: "Active" });
      setStudents(refreshed.students || []);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Promotion failed.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-body text-dark select-none">
      <div className="flex items-center gap-3 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <Link
          to="/admin/students"
          className="p-2 bg-light hover:bg-slate-200/80 text-gray rounded-xl cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <div className="flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-wider text-primary">
            <ArrowUpCircle className="w-4 h-4 text-secondary" />
            Promotion
          </div>
          <h1 className="font-heading text-xl sm:text-2xl font-extrabold mt-1">
            Promote / Move Students
          </h1>
          <p className="text-xs text-gray mt-0.5">
            Move students from one class to another.
          </p>
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

      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold mb-1">From Class *</label>
          <select
            value={fromClassId}
            onChange={(e) => setFromClassId(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-light border border-slate-200 rounded-xl focus:outline-none focus:border-primary"
          >
            {classes.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">To Class *</label>
          <select
            value={toClassId}
            onChange={(e) => setToClassId(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-light border border-slate-200 rounded-xl focus:outline-none focus:border-primary"
          >
            {classes.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
            <input
              type="checkbox"
              checked={promoteAll}
              onChange={(e) => {
                setPromoteAll(e.target.checked);
                if (e.target.checked) setSelected([]);
              }}
              className="rounded border-slate-300"
            />
            Promote all students in source class
          </label>

          {!promoteAll && students.length > 0 && (
            <button
              type="button"
              onClick={toggleAll}
              className="text-xs font-heading font-bold text-primary cursor-pointer"
            >
              {selected.length === students.length ? "Clear selection" : "Select all"}
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray text-sm gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading students...
          </div>
        ) : students.length === 0 ? (
          <p className="py-12 text-center text-sm text-gray">No active students in this class.</p>
        ) : (
          <ul className="divide-y divide-slate-100 max-h-[420px] overflow-y-auto">
            {students.map((s) => {
              const isOn = selected.includes(s._id);
              return (
                <li
                  key={s._id}
                  className={`flex items-center gap-3 px-4 py-3 text-sm ${
                    !promoteAll ? "cursor-pointer hover:bg-light/60" : ""
                  }`}
                  onClick={() => {
                    if (!promoteAll) toggle(s._id);
                  }}
                >
                  {!promoteAll &&
                    (isOn ? (
                      <CheckSquare className="w-4 h-4 text-primary shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-gray shrink-0" />
                    ))}
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-bold">
                      {s.firstName} {s.lastName}
                    </p>
                    <p className="text-[11px] text-gray font-mono">{s.admissionNumber}</p>
                  </div>
                  <span className="text-xs text-gray">{s.gender}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handlePromote}
          disabled={submitting || students.length === 0}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-accent text-white text-xs font-heading font-bold rounded-xl cursor-pointer disabled:opacity-60"
        >
          <ArrowUpCircle className="w-4 h-4" />
          {submitting ? "Promoting..." : "Promote Students"}
        </button>
      </div>
    </div>
  );
};

export default PromoteStudents;