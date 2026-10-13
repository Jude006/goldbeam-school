import React, { useRef, useState } from "react";
import {
  FileText,
  GraduationCap,
  Clock,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Download,
  Printer,
  Loader2,
  Send,
  User,
  ImagePlus,
  X,
} from "lucide-react";
import html2canvas from "html2canvas";
import SEO from "../../components/common/SEO";
import { submitAdmissionForm } from "../../api/publicFormApi";

const admissionSteps = [
  {
    step: "01",
    title: "Choose how to apply",
    desc: "Fill the online form on this page, or download/print the official paper form.",
  },
  {
    step: "02",
    title: "Fill accurately",
    desc: "Please fill in the form accurately. Attach a passport photo if you use the paper form.",
  },
  {
    step: "03",
    title: "Submit",
    desc: "Online applications go to the school email. Paper forms: please visit our office to submit.",
  },
  {
    step: "04",
    title: "Enrollment",
    desc: "After approval, pay fees and collect uniform and materials.",
  },
];

const classesList = [
  "Nursery 1",
  "Nursery 2",
  "Nursery 3",
  "Primary 1",
  "Primary 2",
  "Primary 3",
  "Primary 4",
  "Primary 5",
  "Primary 6",
  "JSS 1",
  "JSS 2",
  "JSS 3",
  "SS 1",
  "SS 2",
  "SS 3",
];

const emptyOnline = {
  studentFirstName: "",
  studentLastName: "",
  gender: "",
  dob: "",
  entryClass: "",
  previousSchool: "",
  guardianName: "",
  guardianPhone: "",
  guardianEmail: "",
  residentialAddress: "",
  additionalInfo: "",
};

const line = "border-b border-slate-800 min-h-[18px]";
const label = "text-[9px] font-bold uppercase tracking-wide text-slate-800";
const box = "border border-slate-800";

const OfficialAdmissionForm = React.forwardRef(
  function OfficialAdmissionForm(_, ref) {
    return (
      <div
        ref={ref}
        id="official-admission-form"
        className="mx-auto bg-[#faf8f2] text-black"
        style={{
          width: "210mm",
          maxWidth: "100%",
          minHeight: "297mm",
          fontFamily: "Arial, Helvetica, sans-serif",
          padding: "12mm 10mm",
          boxSizing: "border-box",
        }}
      >
        <div className="relative flex items-start justify-between gap-2 pb-2 border-b-2 border-red-700">
          <div className="flex items-center justify-center w-14 h-14 shrink-0">
            <img
              src="/images/MARIAN FOUNDATION LOGO.png"
              alt="Crest"
              className="object-contain w-12 h-12"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
          <div className="flex-1 px-1 text-center">
            <p className="text-[10px] font-bold tracking-wide text-red-800 uppercase">
              Archdiocese of Onitsha
            </p>
            <h1 className="text-[13px] sm:text-[15px] font-black uppercase leading-tight text-slate-900">
              Goldbeam Schools
            </h1>
            <p className="text-[9px] font-semibold uppercase leading-tight">
              Oraukwu, Idemili North LGA
            </p>
            <p className="text-[9px] font-semibold uppercase leading-tight">
              Anambra State, Nigeria · P.O. Box 5
            </p>
            <p className="text-[8px] font-bold text-red-700 uppercase mt-0.5">
              Motto: Love, Service and Excellence
            </p>
          </div>
          <div className="flex items-center justify-center w-14 h-14 shrink-0">
            <img
              src="/images/final_crest.png"
              alt="Secondary crest"
              className="object-contain w-12 h-12"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        </div>

        <div className="relative flex items-start justify-center mt-3 mb-2">
          <div className="px-6 py-1 text-[12px] font-black tracking-widest text-white uppercase bg-red-700 rounded-md">
            Admission Form
          </div>
          <div
            className={`${box} absolute right-0 top-0 w-[72px] h-[90px] flex items-center justify-center bg-white`}
          >
            <span className="text-[8px] font-bold tracking-widest text-slate-500 -rotate-90">
              PASSPORT
            </span>
          </div>
        </div>

        <p className="text-center text-[9px] font-bold uppercase tracking-wide text-slate-700 mb-2">
          — Nursery / Primary and Secondary School —
        </p>

        <div className="grid grid-cols-2 gap-3 mb-2 text-[9px]">
          <div className={`${box} p-2`}>
            <p className={`${label} mb-1`}>Class Applied For</p>
            <p className="mb-1">Please tick (✓)</p>
            <div className="flex flex-wrap mb-1 gap-x-3 gap-y-1">
              <span>□ Nursery</span>
              <span>□ Primary</span>
              <span>□ Secondary</span>
            </div>
            <div className="flex items-end gap-1 mt-1">
              <span className="font-semibold shrink-0">Class:</span>
              <span className={`flex-1 ${line}`}>&nbsp;</span>
            </div>
          </div>
          <div className={`${box} p-2`}>
            <p className={`${label} mb-1`}>Admission Sought For</p>
            <div className="flex items-end gap-1 mb-1">
              <span className="font-semibold shrink-0">Academic Year:</span>
              <span className="shrink-0">20</span>
              <span className={`w-8 ${line}`}>&nbsp;</span>
              <span className="shrink-0">- 20</span>
              <span className={`w-8 ${line}`}>&nbsp;</span>
            </div>
            <div className="flex items-end gap-1">
              <span className="font-semibold shrink-0">Date of Admission:</span>
              <span className={`flex-1 ${line}`}>&nbsp;</span>
              <span className="text-[8px] text-slate-500 shrink-0">
                DD/MM/YYYY
              </span>
            </div>
          </div>
        </div>

        <div className={`${box} p-2 mb-2 text-[9px]`}>
          <p className={`${label} text-red-800 mb-1.5`}>
            1. Pupil / Student Details
          </p>
          <div className="grid grid-cols-3 gap-x-2 gap-y-1.5 mb-1.5">
            <div className="flex items-end gap-1">
              <span className="font-semibold shrink-0">First Name:</span>
              <span className={`flex-1 ${line}`}>&nbsp;</span>
            </div>
            <div className="flex items-end gap-1">
              <span className="font-semibold shrink-0">Middle Name:</span>
              <span className={`flex-1 ${line}`}>&nbsp;</span>
            </div>
            <div className="flex items-end gap-1">
              <span className="font-semibold shrink-0">Last Name:</span>
              <span className={`flex-1 ${line}`}>&nbsp;</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-x-2 gap-y-1.5 mb-1.5">
            <div className="flex items-end gap-1">
              <span className="font-semibold shrink-0">Date of Birth:</span>
              <span className={`flex-1 ${line}`}>&nbsp;</span>
              <span className="text-[7px] text-slate-500">DD/MM/YYYY</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="font-semibold">Gender:</span>
              <span>□ Male</span>
              <span>□ Female</span>
            </div>
            <div className="flex items-end gap-1">
              <span className="font-semibold shrink-0">Nationality:</span>
              <span className={`flex-1 ${line}`}>&nbsp;</span>
            </div>
          </div>
          <div className="flex items-end gap-1 mb-1.5">
            <span className="font-semibold shrink-0">Address:</span>
            <span className={`flex-1 ${line}`}>&nbsp;</span>
          </div>
          <div className="grid grid-cols-3 gap-x-2 gap-y-1.5">
            <div className="flex items-end gap-1">
              <span className="font-semibold shrink-0">Village:</span>
              <span className={`flex-1 ${line}`}>&nbsp;</span>
            </div>
            <div className="flex items-end gap-1">
              <span className="font-semibold shrink-0">LGA:</span>
              <span className={`flex-1 ${line}`}>&nbsp;</span>
            </div>
            <div className="flex items-end gap-1">
              <span className="font-semibold shrink-0">State:</span>
              <span className={`flex-1 ${line}`}>&nbsp;</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-2 text-[9px]">
          <div className={`${box} p-2`}>
            <p className={`${label} text-red-800 mb-1`}>
              2. Parent / Guardian Details
            </p>
            <p className="mb-1 font-bold">Father / Guardian</p>
            {["Name", "Qualification", "Occupation", "Phone No.", "Email"].map(
              (f) => (
                <div key={`f-${f}`} className="flex items-end gap-1 mb-1">
                  <span className="font-semibold shrink-0">{f}:</span>
                  <span className={`flex-1 ${line}`}>&nbsp;</span>
                </div>
              ),
            )}
          </div>
          <div className={`${box} p-2`}>
            <p className={`${label} text-transparent mb-1 select-none`}>.</p>
            <p className="mb-1 font-bold">Mother / Guardian</p>
            {["Name", "Qualification", "Occupation", "Phone No.", "Email"].map(
              (f) => (
                <div key={`m-${f}`} className="flex items-end gap-1 mb-1">
                  <span className="font-semibold shrink-0">{f}:</span>
                  <span className={`flex-1 ${line}`}>&nbsp;</span>
                </div>
              ),
            )}
          </div>
          <div className={`${box} p-2`}>
            <p className={`${label} text-red-800 mb-1`}>3. Contact Details</p>
            <p className="mb-1 font-semibold">Residential Address:</p>
            <div className={`${line} mb-2`}>&nbsp;</div>
            <div className={`${line} mb-2`}>&nbsp;</div>
            <div className={`${line} mb-2`}>&nbsp;</div>
            <div className={`${line}`}>&nbsp;</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-2 text-[9px]">
          <div className={`${box} p-2`}>
            <p className={`${label} text-red-800 mb-1`}>
              4. Academic Information
            </p>
            <div className="flex items-end gap-1 mb-1.5">
              <span className="font-semibold shrink-0">
                Previous Class/Grade:
              </span>
              <span className={`flex-1 ${line}`}>&nbsp;</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1.5">
              <span className="font-semibold">Transport facility?</span>
              <span>□ Yes</span>
              <span>□ No</span>
            </div>
          </div>
          <div className={`${box} p-2`}>
            <p className={`${label} text-red-800 mb-1`}>
              5. Previous School Details
            </p>
            <div className="flex items-end gap-1 mb-1.5">
              <span className="font-semibold shrink-0">School Name:</span>
              <span className={`flex-1 ${line}`}>&nbsp;</span>
            </div>
            <div className="flex items-end gap-1">
              <span className="font-semibold shrink-0">Last Class Passed:</span>
              <span className={`flex-1 ${line}`}>&nbsp;</span>
            </div>
          </div>
        </div>

        <div className={`${box} p-2 mb-2 text-[9px]`}>
          <p className={`${label} text-red-800 mb-1`}>6. Declaration</p>
          <p className="leading-relaxed mb-2 text-[8.5px]">
            I hereby declare that the above information is true and correct to
            the best of my knowledge and belief.
          </p>
          <div className="grid grid-cols-3 gap-3 mt-2">
            <div className="flex items-end gap-1">
              <span className="font-semibold shrink-0">
                Parent/Guardian Name:
              </span>
              <span className={`flex-1 ${line}`}>&nbsp;</span>
            </div>
            <div className="flex items-end gap-1">
              <span className="font-semibold shrink-0">Signature:</span>
              <span className={`flex-1 ${line}`}>&nbsp;</span>
            </div>
            <div className="flex items-end gap-1">
              <span className="font-semibold shrink-0">Date:</span>
              <span className={`flex-1 ${line}`}>&nbsp;</span>
            </div>
          </div>
        </div>

        <div className={`${box} p-2 text-[9px] bg-slate-50`}>
          <p className="mb-1.5 text-center font-black tracking-wide text-red-800 uppercase">
            For Official Use
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
            <div className="flex items-end gap-1">
              <span className="font-semibold shrink-0">Form No.:</span>
              <span className={`flex-1 ${line}`}>&nbsp;</span>
            </div>
            <div className="flex items-end gap-1">
              <span className="font-semibold shrink-0">Date Received:</span>
              <span className={`flex-1 ${line}`}>&nbsp;</span>
            </div>
            <div className="flex items-end gap-1">
              <span className="font-semibold shrink-0">Class Allotted:</span>
              <span className={`flex-1 ${line}`}>&nbsp;</span>
            </div>
            <div className="flex items-end gap-1">
              <span className="font-semibold shrink-0">
                Principal&apos;s Signature:
              </span>
              <span className={`flex-1 ${line}`}>&nbsp;</span>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

const fieldClass =
  "w-full px-3.5 py-2.5 text-sm bg-light border border-slate-200 rounded-xl focus:outline-none focus:border-primary";

const Admission = () => {
  const formRef = useRef(null);
  const [mode, setMode] = useState("online"); // "online" | "download"
  const [downloading, setDownloading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [form, setForm] = useState(emptyOnline);
  const [passportFile, setPassportFile] = useState(null);
  const [passportPreview, setPassportPreview] = useState("");

  const setField = (key, value) => {
    setMessage({ type: "", text: "" });
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleDownloadImage = async () => {
    const el =
      formRef.current || document.getElementById("official-admission-form");
    if (!el) {
      setMessage({
        type: "error",
        text: "Form not found. Please refresh the page.",
      });
      return;
    }
    setDownloading(true);
    setMessage({ type: "", text: "" });
    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#faf8f2",
        logging: false,
      });
      const link = document.createElement("a");
      link.download = "Marian-Foundation-Academy-Admission-Form.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
      setMessage({
        type: "success",
        text: "Form downloaded. Please fill in the form accurately, attach a passport photo, and visit our office to submit it.",
      });
    } catch (err) {
      console.error("Download form failed:", err);
      setMessage({
        type: "error",
        text: "Could not download image. Use Print instead, or try another browser.",
      });
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => window.print();

  const handleOnlineSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (
      !form.studentFirstName.trim() ||
      !form.studentLastName.trim() ||
      !form.gender ||
      !form.dob ||
      !form.entryClass ||
      !form.guardianName.trim() ||
      !form.guardianPhone.trim() ||
      !form.residentialAddress.trim()
    ) {
      setMessage({
        type: "error",
        text: "Please fill all required fields marked with *.",
      });
      return;
    }

    if (
      form.guardianEmail.trim() &&
      !/^\S+@\S+\.\S+$/.test(form.guardianEmail.trim())
    ) {
      setMessage({
        type: "error",
        text: "Please enter a valid guardian email, or leave it empty.",
      });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        studentFirstName: form.studentFirstName.trim(),
        studentLastName: form.studentLastName.trim(),
        gender: form.gender,
        dob: form.dob,
        entryClass: form.entryClass,
        previousSchool: form.previousSchool.trim(),
        guardianName: form.guardianName.trim(),
        guardianPhone: form.guardianPhone.trim(),
        guardianEmail: form.guardianEmail.trim(),
        residentialAddress: form.residentialAddress.trim(),
        additionalInfo: form.additionalInfo.trim(),
      };

      const data = await submitAdmissionForm(payload, passportFile);
      console.log("✅ Admission response", data);

      setMessage({
        type: "success",
        text:
          data.message ||
          "Application received. The admissions office will contact you soon.",
      });
      setForm(emptyOnline);
      setPassportFile(null);
      setPassportPreview("");
    } catch (err) {
      console.error("❌ Admission submit", err.response?.data || err.message);
      setMessage({
        type: "error",
        text:
          err.response?.data?.message ||
          "Could not submit application right now. Please call the school or visit the office.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Admissions - Enroll Your Child Today"
        description="Apply online or download the Marian Foundation Academy admission form. Nursery, primary and secondary — Oraukwu, Anambra State."
        keywords="school admissions, Marian Foundation Academy admission form, apply online"
        url="/admissions"
        tags={["admissions", "enroll", "apply", "admission form"]}
      />

      <div className="min-h-screen select-none bg-light font-body text-dark">
        <section className="relative px-4 py-16 overflow-hidden text-white bg-primary md:py-20 no-print">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="relative z-10 mx-auto text-center max-w-7xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs font-bold tracking-wider uppercase rounded-full bg-white/10 text-highlight font-heading backdrop-blur-md">
              <GraduationCap className="w-4 h-4 text-secondary" />
              Admissions Open
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight font-heading sm:text-4xl lg:text-5xl">
              Apply to{" "}
              <span className="text-secondary">Marian Foundation Academy</span>
            </h1>
            <p className="max-w-2xl mx-auto mt-4 text-sm leading-relaxed sm:text-base text-white/80">
              <span className="font-bold text-white">Apply online</span> and we
              email the school, or{" "}
              <span className="font-bold text-white">download the form</span>{" "}
              and{" "}
              <span className="font-bold text-white">
                please visit our office
              </span>{" "}
              to submit it.{" "}
              <span className="font-bold text-white">
                Please fill in the form accurately
              </span>
              .
            </p>
          </div>
        </section>

        <section className="py-12 bg-white border-b border-slate-200/80 no-print">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-bold font-heading sm:text-3xl text-dark">
                Simple 4-Step{" "}
                <span className="text-primary">Admission Process</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {admissionSteps.map((step) => (
                <div
                  key={step.step}
                  className="relative p-5 border bg-light rounded-2xl border-slate-200/60"
                >
                  <div className="mb-2 text-2xl font-black font-heading text-secondary">
                    {step.step}
                  </div>
                  <h3 className="mb-1 text-base font-bold font-heading text-dark">
                    {step.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-gray">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 lg:py-16">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            {/* Mode switch */}
            <div className="flex flex-wrap gap-2 p-1.5 mb-8 bg-white border shadow-xs border-slate-200/80 rounded-2xl w-full sm:w-auto no-print">
              <button
                type="button"
                onClick={() => {
                  setMode("online");
                  setMessage({ type: "", text: "" });
                }}
                className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-heading font-bold rounded-xl cursor-pointer transition ${
                  mode === "online"
                    ? "bg-primary text-white"
                    : "text-dark hover:bg-light"
                }`}
              >
                <Send className="w-4 h-4" />
                Apply online
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("download");
                  setMessage({ type: "", text: "" });
                }}
                className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-heading font-bold rounded-xl cursor-pointer transition ${
                  mode === "download"
                    ? "bg-primary text-white"
                    : "text-dark hover:bg-light"
                }`}
              >
                <Download className="w-4 h-4" />
                Download admission form
              </button>
            </div>

            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
              <div className="space-y-4 lg:col-span-8">
                {message.text && (
                  <div
                    className={`no-print px-4 py-3 text-xs font-medium rounded-xl border ${
                      message.type === "success"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    }`}
                  >
                    {message.text}
                  </div>
                )}

                {mode === "online" ? (
                  <form
                    onSubmit={handleOnlineSubmit}
                    className="p-5 space-y-5 bg-white border shadow-xs sm:p-6 border-slate-200/80 rounded-2xl no-print"
                  >
                    <div>
                      <h3 className="flex items-center gap-2 text-lg font-bold font-heading text-primary">
                        <User className="w-5 h-5 text-secondary" />
                        Online application
                      </h3>
                      <p className="text-xs text-gray mt-0.5">
                        Fields marked * are required. Your application is sent
                        to the school email.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block mb-1 text-xs font-semibold text-dark">
                          Student first name *
                        </label>
                        <input
                          className={fieldClass}
                          value={form.studentFirstName}
                          onChange={(e) =>
                            setField("studentFirstName", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-xs font-semibold text-dark">
                          Student last name *
                        </label>
                        <input
                          className={fieldClass}
                          value={form.studentLastName}
                          onChange={(e) =>
                            setField("studentLastName", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-xs font-semibold text-dark">
                          Gender *
                        </label>
                        <select
                          className={fieldClass}
                          value={form.gender}
                          onChange={(e) => setField("gender", e.target.value)}
                          required
                        >
                          <option value="">Select</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                      <div>
                        <label className="block mb-1 text-xs font-semibold text-dark">
                          Date of birth *
                        </label>
                        <input
                          type="date"
                          className={fieldClass}
                          value={form.dob}
                          onChange={(e) => setField("dob", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-xs font-semibold text-dark">
                          Class applying for *
                        </label>
                        <select
                          className={fieldClass}
                          value={form.entryClass}
                          onChange={(e) =>
                            setField("entryClass", e.target.value)
                          }
                          required
                        >
                          <option value="">Select class</option>
                          {classesList.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block mb-1 text-xs font-semibold text-dark">
                          Previous school
                        </label>
                        <input
                          className={fieldClass}
                          value={form.previousSchool}
                          onChange={(e) =>
                            setField("previousSchool", e.target.value)
                          }
                          placeholder="Optional"
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <p className="mb-3 text-xs font-bold tracking-wide uppercase text-secondary">
                        Guardian
                      </p>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block mb-1 text-xs font-semibold text-dark">
                            Guardian name *
                          </label>
                          <input
                            className={fieldClass}
                            value={form.guardianName}
                            onChange={(e) =>
                              setField("guardianName", e.target.value)
                            }
                            required
                          />
                        </div>
                        <div>
                          <label className="block mb-1 text-xs font-semibold text-dark">
                            Guardian phone *
                          </label>
                          <input
                            className={fieldClass}
                            value={form.guardianPhone}
                            onChange={(e) =>
                              setField("guardianPhone", e.target.value)
                            }
                            required
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block mb-1 text-xs font-semibold text-dark">
                            Guardian email
                          </label>
                          <input
                            type="email"
                            className={fieldClass}
                            value={form.guardianEmail}
                            onChange={(e) =>
                              setField("guardianEmail", e.target.value)
                            }
                            placeholder="Optional"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block mb-1 text-xs font-semibold text-dark">
                            Residential address *
                          </label>
                          <textarea
                            rows={2}
                            className={`${fieldClass} resize-none`}
                            value={form.residentialAddress}
                            onChange={(e) =>
                              setField("residentialAddress", e.target.value)
                            }
                            required
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block mb-1 text-xs font-semibold text-dark">
                            Passport photograph{" "}
                            <span className="font-normal text-gray">
                              (recommended)
                            </span>
                          </label>
                          <p className="mb-2 text-[11px] text-gray">
                            JPEG, PNG or WebP · max 3MB
                          </p>
                          <div className="flex flex-wrap items-start gap-4">
                            <label className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-heading font-bold border border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-light">
                              <ImagePlus className="w-4 h-4 text-secondary" />
                              {passportFile
                                ? "Change photo"
                                : "Upload passport"}
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  e.target.value = "";
                                  setMessage({ type: "", text: "" });
                                  if (!file) return;
                                  if (file.size > 3 * 1024 * 1024) {
                                    setMessage({
                                      type: "error",
                                      text: "Passport must be 3MB or smaller.",
                                    });
                                    return;
                                  }
                                  setPassportFile(file);
                                  setPassportPreview(URL.createObjectURL(file));
                                  console.log(
                                    "📷 Passport selected",
                                    file.name,
                                    file.size,
                                  );
                                }}
                              />
                            </label>
                            {passportPreview && (
                              <div className="relative">
                                <img
                                  src={passportPreview}
                                  alt="Passport preview"
                                  className="object-cover w-20 h-24 border rounded-lg border-slate-200"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setPassportFile(null);
                                    setPassportPreview("");
                                  }}
                                  className="absolute p-0.5 bg-white rounded-full shadow -top-2 -right-2 cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5 text-red-600" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block mb-1 text-xs font-semibold text-dark">
                            Additional information
                          </label>
                          <textarea
                            rows={2}
                            className={`${fieldClass} resize-none`}
                            value={form.additionalInfo}
                            onChange={(e) =>
                              setField("additionalInfo", e.target.value)
                            }
                            placeholder="Optional notes for the school"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setMode("download")}
                        className="px-4 py-2.5 text-xs font-heading font-bold bg-light rounded-xl cursor-pointer"
                      >
                        Prefer paper form?
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-heading font-bold text-white bg-primary hover:bg-accent rounded-xl cursor-pointer disabled:opacity-60"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Submit application
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex flex-col gap-3 p-5 bg-white border shadow-xs sm:flex-row sm:items-center sm:justify-between border-slate-200/80 rounded-2xl no-print">
                      <div>
                        <h3 className="text-lg font-bold font-heading text-primary">
                          Official Admission Form
                        </h3>
                        <p className="text-xs text-gray mt-0.5">
                          Download or print, fill accurately, attach passport,
                          and please visit our office to submit.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={handleDownloadImage}
                          disabled={downloading}
                          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-heading font-bold text-white bg-primary hover:bg-accent rounded-xl cursor-pointer disabled:opacity-60"
                        >
                          {downloading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Download className="w-4 h-4" />
                          )}
                          {downloading ? "Preparing..." : "Download as Image"}
                        </button>
                        <button
                          type="button"
                          onClick={handlePrint}
                          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-heading font-bold border border-slate-200 rounded-xl hover:bg-light cursor-pointer"
                        >
                          <Printer className="w-4 h-4" />
                          Print Form
                        </button>
                      </div>
                    </div>
                    <div className="p-2 overflow-x-auto bg-white border shadow-xs sm:p-4 border-slate-200/80 rounded-2xl">
                      <OfficialAdmissionForm ref={formRef} />
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-6 lg:col-span-4 no-print">
                <div className="p-6 space-y-4 text-white shadow-sm bg-primary rounded-2xl">
                  <h3 className="flex items-center gap-2 pb-3 text-lg font-bold border-b font-heading border-white/10">
                    <Clock className="w-5 h-5 text-secondary" />
                    Admission Enquiries
                  </h3>
                  <p className="text-xs leading-relaxed text-white/80">
                    <span className="font-bold text-white">
                      Please visit our office
                    </span>{" "}
                    for fees, entrance exam, or documents.
                  </p>
                  <div className="pt-2 space-y-3 text-xs text-white/90">
                    <div className="flex items-start gap-3">
                      <Phone className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                      <span className="font-bold">08140728109</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                      <span className="break-all">
                        mfacademyschool@gmail.com
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                      <span>
                        Inside St Joseph Catholic Church Premises, Oraukwu,
                        Idemili North LGA, Anambra State.
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-3 bg-white border border-slate-200/80 rounded-2xl">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-secondary/10 text-secondary">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold font-heading text-dark">
                    Two ways to apply
                  </h4>
                  <ul className="pl-4 space-y-2 text-xs leading-relaxed list-disc text-gray">
                    <li>
                      <span className="font-bold text-dark">Online:</span> fill
                      the form and submit — school receives email.
                    </li>
                    <li>
                      <span className="font-bold text-dark">Paper:</span>{" "}
                      download/print, fill accurately, passport photo, visit
                      office.
                    </li>
                  </ul>
                  <a
                    href="tel:08140728109"
                    className="inline-flex items-center gap-2 pt-2 text-xs font-bold font-heading text-primary hover:text-accent"
                  >
                    <MessageSquare className="w-4 h-4 text-secondary" />
                    Call Admission Office
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #official-admission-form, #official-admission-form * { visibility: visible; }
          #official-admission-form {
            position: absolute;
            left: 0;
            top: 0;
            width: 210mm !important;
          }
          .no-print { display: none !important; }
          @page { size: A4 portrait; margin: 8mm; }
        }
      `}</style>
    </>
  );
};

export default Admission;
