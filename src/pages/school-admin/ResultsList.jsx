import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ClipboardList,
  Send,
  Filter,
  Loader2,
  Undo2,
  ClipboardEdit,
  Eye,
} from "lucide-react";
import {
  getResultsOverview,
  publishClassResults,
  unpublishClassResults,
} from "../../api/resultApi";
import { getAcademicSettings } from "../../api/academicSettingsApi";

const TERMS = ["1st Term", "2nd Term", "3rd Term"];

const ResultsList = () => {
  const navigate = useNavigate();
  const [overview, setOverview] = useState([]);
  const [session, setSession] = useState("");
  const [term, setTerm] = useState("1st Term");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [actionKey, setActionKey] = useState("");

  const load = useCallback(async (sess, t) => {
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const data = await getResultsOverview({
        session: sess || undefined,
        term: t || undefined,
      });
      setSession(data.session || sess || "");
      setTerm(data.term || t || "1st Term");
      setOverview(data.overview || []);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Could not load class results.",
      });
      setOverview([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const boot = async () => {
      setLoading(true);
      try {
        const settingsRes = await getAcademicSettings();
        const s = settingsRes.settings || {};
        const nextSession = (s.session || "").trim();
        const nextTerm = s.currentTerm || "1st Term";
        if (cancelled) return;
        setSession(nextSession);
        setTerm(nextTerm);
        await load(nextSession, nextTerm);
      } catch {
        if (!cancelled) await load("", "1st Term");
      }
    };
    boot();
    return () => {
      cancelled = true;
    };
  }, [load]);

  const filtered = overview.filter((r) => {
    const matchSearch = (r.className || "")
      .toLowerCase()
      .includes(search.toLowerCase());
    const statusLabel = r.status === "published" ? "Published" : "Draft";
    const matchStatus =
      statusFilter === "All" || statusLabel === statusFilter;
    return matchSearch && matchStatus;
  });

  const handlePublish = async (row) => {
    const ok = window.confirm(
      `Release results for ${row.className}?\n\nTerm: ${term}\nSession: ${session}\n\nStudents will see their report cards. Parents with email may be notified.`
    );
    if (!ok) return;

    setActionKey(String(row.classId));
    try {
      const data = await publishClassResults({
        classId: row.classId,
        session,
        term,
      });
      setMessage({
        type: "success",
        text: data.message || `${row.className} results published.`,
      });
      await load(session, term);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Could not publish results.",
      });
    } finally {
      setActionKey("");
    }
  };

  const handleUnpublish = async (row) => {
    const ok = window.confirm(
      `Hide results for ${row.className}?\n\nStudents will not see this report until you publish again. You can edit scores after unpublishing.`
    );
    if (!ok) return;

    setActionKey(String(row.classId));
    try {
      const data = await unpublishClassResults({
        classId: row.classId,
        session,
        term,
      });
      setMessage({
        type: "success",
        text: data.message || `${row.className} unpublished.`,
      });
      await load(session, term);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Could not unpublish results.",
      });
    } finally {
      setActionKey("");
    }
  };

  const viewClassStudents = (row) => {
    navigate(
      `/admin/results/class/${row.classId}?session=${encodeURIComponent(
        session
      )}&term=${encodeURIComponent(term)}`
    );
  };

  return (
    <div className="space-y-6 select-none font-body text-dark">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 p-6 bg-white border shadow-xs sm:flex-row sm:items-center rounded-2xl border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase font-heading text-primary">
            <ClipboardList className="w-4 h-4 text-secondary" />
            Results
          </div>
          <h1 className="mt-1 text-2xl font-extrabold font-heading sm:text-3xl">
            Class Results
          </h1>
          <p className="text-xs sm:text-sm text-gray mt-0.5">
            Working on{" "}
            <span className="font-semibold text-dark">
              {session || "—"} · {term}
            </span>
            . Enter scores → view reports → publish when ready.
          </p>
          <p className="mt-1 text-[11px] text-gray">
            Default term is set in{" "}
            <Link
              to="/admin/settings/academic"
              className="font-semibold text-primary hover:underline"
            >
              Academic Settings
            </Link>
            .
          </p>
        </div>
        <Link
          to={`/admin/results/enter?session=${encodeURIComponent(
            session
          )}&term=${encodeURIComponent(term)}`}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-accent text-white font-heading font-bold text-xs rounded-xl cursor-pointer shrink-0"
        >
          <ClipboardEdit className="w-4 h-4" />
          Enter Scores
        </Link>
      </div>

      {message.text && (
        <div
          className={`px-4 py-3 text-xs font-medium rounded-xl border ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-4 p-4 bg-white border shadow-xs rounded-2xl border-slate-200/80 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search class name..."
            className="w-full py-2.5 pl-10 pr-4 text-sm border bg-light border-slate-200 rounded-xl focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-gray">
            <Filter className="w-3.5 h-3.5 text-secondary" />
            Filters
          </span>
          <label className="flex items-center gap-1.5 text-[11px] font-semibold text-dark">
            Term
            <select
              value={term}
              onChange={(e) => load(session, e.target.value)}
              className="px-3 py-2 text-sm font-medium border bg-light border-slate-200 rounded-xl focus:outline-none focus:border-primary"
            >
              {TERMS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-1.5 text-[11px] font-semibold text-dark">
            Status
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm font-medium border bg-light border-slate-200 rounded-xl focus:outline-none focus:border-primary"
            >
              <option value="All">All</option>
              <option value="Draft">Draft (not released)</option>
              <option value="Published">Published (students can see)</option>
            </select>
          </label>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden bg-white border shadow-xs rounded-2xl border-slate-200/80">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-gray">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading classes...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-heading font-bold text-gray uppercase tracking-wider bg-slate-50/60">
                  <th className="py-3.5 px-4">Class</th>
                  <th className="py-3.5 px-4">Term</th>
                  <th className="py-3.5 px-4">Session</th>
                  <th className="py-3.5 px-4">Students</th>
                  <th className="py-3.5 px-4">Scores entered</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray">
                      No classes match your search.
                    </td>
                  </tr>
                ) : (
                  filtered.map((r) => {
                    const isPublished = r.status === "published";
                    const busy = actionKey === String(r.classId);

                    return (
                      <tr key={r.classId} className="hover:bg-light/60">
                        <td className="py-3.5 px-4 font-heading font-bold text-sm">
                          {r.className}
                        </td>
                        <td className="py-3.5 px-4 text-gray">{r.term}</td>
                        <td className="py-3.5 px-4 text-gray">{r.session}</td>
                        <td className="py-3.5 px-4">{r.studentCount}</td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-dark">
                            {r.scoreRows}
                          </span>
                          <span className="text-gray"> score row(s)</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                              isPublished
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-amber-50 text-amber-800 border-amber-200"
                            }`}
                          >
                            {isPublished
                              ? "Published — students can view"
                              : "Draft — not released yet"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => viewClassStudents(r)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-heading font-bold rounded-lg border border-slate-200 text-primary hover:bg-primary/5 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              View reports
                            </button>

                            {!isPublished ? (
                              <button
                                type="button"
                                disabled={busy || Number(r.scoreRows) === 0}
                                title={
                                  Number(r.scoreRows) === 0
                                    ? "Enter scores before publishing"
                                    : "Release results to students"
                                }
                                onClick={() => handlePublish(r)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-heading font-bold rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {busy ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Send className="w-3.5 h-3.5" />
                                )}
                                Publish
                              </button>
                            ) : (
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => handleUnpublish(r)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-heading font-bold rounded-lg text-amber-800 bg-amber-50 border border-amber-200 hover:bg-amber-100 cursor-pointer disabled:opacity-60"
                              >
                                {busy ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Undo2 className="w-3.5 h-3.5" />
                                )}
                                Unpublish
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-[11px] text-gray px-1">
        <strong className="text-dark">Tip:</strong> Publish only after scores
        and comments are complete. Use Unpublish if you need to correct a
        score, then Publish again.
      </p>
    </div>
  );
};

export default ResultsList;