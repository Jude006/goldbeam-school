import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  Search,
  Inbox,
  Eye,
  X,
} from "lucide-react";
import {
  getAdmissions,
  getAdmissionById,
  updateAdmission,
} from "../../api/admissionApi";

const STATUS_OPTIONS = ["new", "reviewed", "accepted", "rejected", "archived"];

const AdmissionsInbox = () => {
  const [list, setList] = useState([]);
  const [newCount, setNewCount] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [active, setActive] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAdmissions({
        search: search.trim() || undefined,
        status: status || undefined,
      });
      console.log("📋 Admissions list", data);
      setList(data.applications || []);
      setNewCount(data.newCount ?? 0);
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Could not load applications.",
      });
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const openDetail = async (id) => {
    setDetailLoading(true);
    setActive(null);
    try {
      const data = await getAdmissionById(id);
      console.log("📄 Admission detail", data);
      setActive(data.application);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Could not open application.",
      });
    } finally {
      setDetailLoading(false);
    }
  };

  const saveStatus = async (nextStatus) => {
    if (!active?._id) return;
    setSaving(true);
    try {
      const data = await updateAdmission(active._id, { status: nextStatus });
      setActive(data.application);
      setMessage({ type: "success", text: "Status updated." });
      load();
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Update failed.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto space-y-5 max-w-6xl font-body text-dark">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center gap-1 mb-2 text-xs font-bold text-primary hover:text-accent"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
          </Link>
          <h1 className="flex items-center gap-2 text-2xl font-extrabold font-heading">
            <Inbox className="w-6 h-6 text-secondary" />
            Admission applications
          </h1>
          <p className="text-xs text-gray">
            Online forms from the website ·{" "}
            <span className="font-bold text-primary">{newCount} new</span>
          </p>
        </div>
      </div>

      {message.text && (
        <div
          className={`px-4 py-3 text-xs rounded-xl border ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="flex flex-wrap gap-3 p-4 bg-white border shadow-xs rounded-2xl border-slate-200/80">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-gray" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, phone, class..."
            className="w-full py-2.5 pl-9 pr-3 text-sm border bg-light border-slate-200 rounded-xl focus:outline-none focus:border-primary"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-3 py-2.5 text-sm border bg-light border-slate-200 rounded-xl focus:outline-none focus:border-primary"
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden bg-white border shadow-xs rounded-2xl border-slate-200/80">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-gray">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading...
          </div>
        ) : list.length === 0 ? (
          <p className="py-16 text-sm text-center text-gray">
            No applications yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wide text-gray border-b border-slate-100 bg-light/50">
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Class</th>
                  <th className="px-4 py-3">Guardian</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {list.map((row) => (
                  <tr
                    key={row._id}
                    className="border-b border-slate-50 hover:bg-light/40"
                  >
                    <td className="px-4 py-3 font-heading font-bold">
                      {row.studentFirstName} {row.studentLastName}
                      {row.passportUrl ? (
                        <span className="ml-1 text-[10px] text-secondary">
                          · photo
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-gray">{row.entryClass}</td>
                    <td className="px-4 py-3">
                      <div className="text-xs font-medium">
                        {row.guardianName}
                      </div>
                      <div className="text-[11px] text-gray">
                        {row.guardianPhone}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                          row.status === "new"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray">
                      {row.createdAt
                        ? new Date(row.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => openDetail(row._id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg text-primary hover:bg-primary/10 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {(active || detailLoading) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/40">
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="text-lg font-extrabold font-heading">
                Application
              </h2>
              <button
                type="button"
                onClick={() => setActive(null)}
                className="p-1.5 rounded-lg hover:bg-light cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {detailLoading || !active ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              </div>
            ) : (
              <div className="p-5 space-y-4 text-sm">
                {active.passportUrl && (
                  <img
                    src={active.passportUrl}
                    alt="Passport"
                    className="object-cover w-28 h-36 border rounded-xl border-slate-200"
                  />
                )}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <p>
                    <span className="text-gray">Student</span>
                    <br />
                    <strong>
                      {active.studentFirstName} {active.studentLastName}
                    </strong>
                  </p>
                  <p>
                    <span className="text-gray">Gender / DOB</span>
                    <br />
                    <strong>
                      {active.gender} · {active.dob}
                    </strong>
                  </p>
                  <p>
                    <span className="text-gray">Class</span>
                    <br />
                    <strong>{active.entryClass}</strong>
                  </p>
                  <p>
                    <span className="text-gray">Previous school</span>
                    <br />
                    <strong>{active.previousSchool || "—"}</strong>
                  </p>
                  <p className="col-span-2">
                    <span className="text-gray">Guardian</span>
                    <br />
                    <strong>{active.guardianName}</strong> ·{" "}
                    {active.guardianPhone}
                    <br />
                    {active.guardianEmail || "—"}
                  </p>
                  <p className="col-span-2">
                    <span className="text-gray">Address</span>
                    <br />
                    <strong>{active.residentialAddress}</strong>
                  </p>
                  {active.additionalInfo ? (
                    <p className="col-span-2">
                      <span className="text-gray">Notes</span>
                      <br />
                      {active.additionalInfo}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label className="block mb-1 text-xs font-semibold">
                    Status
                  </label>
                  <select
                    value={active.status}
                    disabled={saving}
                    onChange={(e) => saveStatus(e.target.value)}
                    className="w-full px-3 py-2 text-sm border rounded-xl bg-light border-slate-200"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdmissionsInbox;