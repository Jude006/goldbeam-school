import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  FileSpreadsheet,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Download,
} from "lucide-react";
import { importStudents } from "../../api/studentApi";

const TEMPLATE_HEADERS = [
  "firstName",
  "lastName",
  "gender",
  "className",
  "guardianName",
  "guardianPhone",
  "guardianEmail",
  "address",
  "dateOfBirth",
];

const ImportStudents = () => {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const downloadTemplate = () => {
    const header = TEMPLATE_HEADERS.join(",");
    const example = [
      "Chinedu",
      "Okeke",
      "Male",
      "JSS1",
      "Mr Emmanuel Okeke",
      "08031234567",
      "parent@email.com",
      "Oraukwu",
      "2012-05-14",
    ].join(",");
    const csv = `${header}\n${example}\n`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "student-import-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadCredentials = () => {
    if (!result?.created?.length) return;
    const header = "admissionNumber,name,className,temporaryPassword";
    const lines = result.created.map(
      (c) =>
        `"${c.admissionNumber}","${c.name}","${c.className || ""}","${c.temporaryPassword}"`
    );
    const csv = [header, ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `student-credentials-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Choose an Excel or CSV file first.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await importStudents(file);
      setResult(data);
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
    } catch (err) {
      setError(err.response?.data?.message || "Import failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 select-none font-body text-dark">
      <div className="flex items-center gap-3 p-6 bg-white border shadow-xs rounded-2xl border-slate-200/80">
        <Link
          to="/admin/students"
          className="p-2 cursor-pointer bg-light hover:bg-slate-200/80 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-extrabold font-heading sm:text-2xl">
            Import Students
          </h1>
          <p className="text-xs text-gray mt-0.5">
            Upload Excel (.xlsx) or CSV — max 300 rows. Classes must exist first.
          </p>
        </div>
      </div>

      <div className="p-6 space-y-4 bg-white border shadow-xs rounded-2xl border-slate-200/80">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase font-heading text-primary">
            <FileSpreadsheet className="w-4 h-4 text-secondary" />
            Bulk upload
          </div>
          <button
            type="button"
            onClick={downloadTemplate}
            className="inline-flex items-center gap-2 px-3 py-2 text-xs font-bold border cursor-pointer font-heading border-slate-200 rounded-xl hover:bg-light"
          >
            <Download className="w-4 h-4" />
            Download template
          </button>
        </div>

        <ul className="pl-4 space-y-1 text-xs list-disc text-gray">
          <li>
            Required: firstName, lastName, gender, className, guardianName,
            guardianPhone
          </li>
          <li>gender: Male or Female · className must match e.g. JSS1</li>
          <li>
            After import, download credentials (admission no + temp password)
            once
          </li>
        </ul>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div
            className="p-8 text-center transition-colors border-2 border-dashed cursor-pointer border-slate-200 rounded-2xl hover:border-primary/40"
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="w-8 h-8 mx-auto mb-2 text-primary" />
            <p className="text-sm font-bold font-heading">
              {file ? file.name : "Click to choose file"}
            </p>
            <p className="text-[11px] text-gray mt-1">.xlsx, .xls or .csv</p>
            <input
              ref={inputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={(e) => {
                setFile(e.target.files?.[0] || null);
                setError("");
                setResult(null);
              }}
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 px-4 py-3 text-xs text-red-700 border border-red-200 bg-red-50 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Link
              to="/admin/students"
              className="px-4 py-2.5 text-xs font-heading font-bold bg-light rounded-xl"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || !file}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-xs font-heading font-bold rounded-xl cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Importing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" /> Upload & Import
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {result && (
        <div className="p-6 space-y-4 bg-white border shadow-xs rounded-2xl border-slate-200/80">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-bold font-heading text-emerald-700">
              <CheckCircle2 className="w-5 h-5" />
              {result.message}
            </div>
            {result.createdCount > 0 && (
              <button
                type="button"
                onClick={downloadCredentials}
                className="inline-flex items-center gap-2 px-3 py-2 text-xs font-bold text-white cursor-pointer font-heading bg-primary rounded-xl"
              >
                <Download className="w-4 h-4" />
                Download login credentials
              </button>
            )}
          </div>

          {result.errors?.length > 0 && (
            <div className="overflow-x-auto">
              <p className="mb-2 text-xs font-bold text-amber-700">
                Failed rows ({result.errorCount})
              </p>
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b text-gray">
                    <th className="py-2 pr-3">Row</th>
                    <th className="py-2">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {result.errors.map((e, i) => (
                    <tr key={i} className="border-b border-slate-50">
                      <td className="py-2 pr-3 font-mono">{e.row}</td>
                      <td className="py-2 text-rose-600">{e.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImportStudents;