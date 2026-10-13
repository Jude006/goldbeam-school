import React, { useCallback, useEffect, useState } from "react";
import {
  History,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  Building2,
  Copy,
  Wallet,
} from "lucide-react";
import { getMyFees } from "../../api/feeApi";
import { getAcademicSettings } from "../../api/academicSettingsApi";

/**
 * School bank accounts — update these (or load from Academic Settings later).
 */
const BANK_ACCOUNTS = [
  {
    id: "commercial",
    label: "Commercial Bank",
    bankName: "First Bank of Nigeria",
    accountName: "Goldbeam Schools",
    accountNumber: "0000000000",
    note: "Main school account",
  },
  {
    id: "microfinance",
    label: "Microfinance Bank",
    bankName: "Your Microfinance Bank Name",
    accountName: "Goldbeam Schools",
    accountNumber: "0000000000",
    note: "Alternative account",
  },
];

const StudentFees = () => {
  const [session, setSession] = useState("");
  const [term, setTerm] = useState("1st Term");
  const [totalFees, setTotalFees] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [balance, setBalance] = useState(0);
  const [structures, setStructures] = useState([]);
  const [payments, setPayments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showPayModal, setShowPayModal] = useState(false);
  const [copiedKey, setCopiedKey] = useState("");

  const loadFees = useCallback(async (sess, t) => {
    setLoading(true);
    try {
      const params = {};
      if (sess) params.session = sess;
      if (t) params.term = t;

      const data = await getMyFees(params);
      const nextSession = data.session || sess || "";
      const nextTerm = data.term || t || "1st Term";

      setSession(nextSession);
      setTerm(nextTerm);
      setTotalFees(Number(data.totalFees) || 0);
      setTotalPaid(Number(data.totalPaid) || 0);
      setBalance(Number(data.balance) || 0);
      setStructures(data.structures || []);
      setPayments(data.payments || []);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Could not load your fees.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const boot = async () => {
      let sess = "";
      let t = "1st Term";
      try {
        const settings = await getAcademicSettings();
        sess = settings.settings?.session || "";
        t = settings.settings?.currentTerm || "1st Term";
      } catch {
        // keep defaults
      }
      setSession(sess);
      setTerm(t);
      await loadFees(sess, t);
    };
    boot();
  }, [loadFees]);

  const copyText = async (text, key) => {
    try {
      await navigator.clipboard.writeText(String(text));
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(""), 2000);
    } catch {
      setMessage({
        type: "error",
        text: "Could not copy. Please copy the number manually.",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-20 text-sm text-gray">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading fees...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 select-none font-body text-dark">
      <div className="p-6 bg-white border shadow-xs rounded-2xl border-slate-200/80">
        <h1 className="text-2xl font-extrabold tracking-tight font-heading text-dark">
          Fees & Payments
        </h1>
        <p className="text-xs text-gray mt-0.5">
          View your fee breakdown and payment history. Pay into the school
          account, then send your receipt to the school office so it can be
          recorded.
        </p>
        <p className="text-[11px] text-gray mt-1">
          {term} · {session || "—"}
        </p>
      </div>

      {message.text && (
        <div
          className={`flex items-start gap-2 px-4 py-3 text-xs font-medium rounded-xl border ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          )}
          <span>{message.text}</span>
          <button
            type="button"
            onClick={() => setMessage({ type: "", text: "" })}
            className="ml-auto p-0.5 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Balance card */}
      <div className="flex flex-col gap-6 p-6 text-white shadow-sm bg-gradient-to-br from-primary to-accent sm:p-8 rounded-2xl sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <span className="text-xs font-semibold tracking-wider uppercase font-heading text-highlight">
            Outstanding Fee Balance
          </span>
          <div className="text-3xl font-black tracking-tight font-heading sm:text-4xl">
            ₦{balance.toLocaleString()}
          </div>
          <p className="text-xs text-white/80">
            Total term fee: ₦{totalFees.toLocaleString()} · Paid: ₦
            {totalPaid.toLocaleString()}
          </p>
        </div>

        <div className="flex flex-col gap-2 shrink-0">
          {balance <= 0 ? (
            <div className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold bg-white/15 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
              Fees cleared for this term
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowPayModal(true)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-bold text-white transition-all shadow-md cursor-pointer bg-secondary hover:bg-highlight font-heading sm:text-sm rounded-xl"
            >
              <Wallet className="w-4 h-4" />
              How to pay
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Breakdown */}
        <div className="p-6 space-y-4 bg-white border shadow-xs lg:col-span-2 rounded-2xl border-slate-200/80">
          <h3 className="flex flex-wrap items-center justify-between gap-2 pb-3 text-sm font-bold border-b font-heading text-dark border-slate-100">
            <span>{term} Fee Breakdown</span>
            <span className="text-xs font-normal text-gray">
              {session || "Session"}
            </span>
          </h3>

          <div className="text-xs divide-y divide-slate-100">
            {structures.length === 0 ? (
              <p className="py-6 text-center text-gray">
                No fee items set for your class this term yet.
              </p>
            ) : (
              structures.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <span className="font-semibold truncate text-dark">
                    {item.title}
                  </span>
                  <span className="font-mono font-bold shrink-0">
                    ₦{Number(item.amount).toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent payments (admin-recorded cash / transfer) */}
        <div className="p-6 space-y-4 bg-white border shadow-xs rounded-2xl border-slate-200/80">
          <h3 className="flex items-center gap-2 pb-3 text-sm font-bold border-b font-heading text-dark border-slate-100">
            <History className="w-4 h-4 text-secondary" />
            Recent Payments
          </h3>

          <div className="space-y-3">
            {payments.length === 0 ? (
              <p className="py-4 text-xs text-center text-gray">
                No payments recorded yet. After you transfer, send the receipt
                to the school so it can be updated here.
              </p>
            ) : (
              payments.map((tx) => (
                <div
                  key={tx._id}
                  className="p-3 space-y-1 text-xs border bg-light rounded-xl border-slate-100"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-bold text-[10px] truncate">
                      {tx.reference || tx._id}
                    </span>
                    <span className="font-bold text-emerald-600 shrink-0">
                      ₦{Number(tx.amount).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray text-[10px]">
                    <span>
                      {tx.paidAt
                        ? new Date(tx.paidAt).toLocaleDateString("en-NG", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </span>
                    <span className="capitalize">
                      {String(tx.method || "cash").replace(/_/g, " ")}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bank details popup */}
      {showPayModal && (
        <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-dark/50">
          <button
            type="button"
            className="absolute inset-0 cursor-pointer"
            aria-label="Close"
            onClick={() => setShowPayModal(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            className="relative z-10 w-full max-w-md max-h-[90vh] overflow-y-auto bg-white shadow-2xl rounded-t-2xl sm:rounded-2xl border border-slate-200"
          >
            <div className="sticky top-0 flex items-start justify-between gap-3 px-5 py-4 bg-white border-b border-slate-100">
              <div>
                <h2 className="text-sm font-extrabold font-heading text-dark">
                  School account details
                </h2>
                <p className="text-[11px] text-gray mt-0.5">
                  Transfer your fees, then send the receipt to the school.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPayModal(false)}
                className="p-2 cursor-pointer rounded-xl hover:bg-light"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-5 py-4 space-y-4">
              {balance > 0 && (
                <div className="px-3 py-2.5 text-xs rounded-xl bg-primary/5 border border-primary/15">
                  <span className="text-gray">Amount still owed: </span>
                  <span className="font-bold text-primary">
                    ₦{balance.toLocaleString()}
                  </span>
                  <span className="text-gray">
                    {" "}
                    · You may pay in full or part.
                  </span>
                </div>
              )}

              {BANK_ACCOUNTS.map((acc) => (
                <div
                  key={acc.id}
                  className="p-4 space-y-3 border border-slate-100 rounded-xl bg-slate-50/50"
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary shrink-0" />
                    <div>
                      <p className="text-xs font-bold font-heading text-dark">
                        {acc.label}
                      </p>
                      <p className="text-[10px] text-gray">{acc.note}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between gap-2">
                      <span className="text-gray">Bank</span>
                      <span className="font-semibold text-right">
                        {acc.bankName}
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-gray">Account name</span>
                      <span className="font-semibold text-right">
                        {acc.accountName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-gray">Account number</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold tracking-wide">
                          {acc.accountNumber}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyText(acc.accountNumber, acc.id)}
                          className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-bold rounded-lg bg-primary/10 text-primary hover:bg-primary/15 cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          {copiedKey === acc.id ? "Copied" : "Copy"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="p-3 space-y-1.5 text-[11px] leading-relaxed rounded-xl bg-amber-50 border border-amber-100 text-amber-900">
                <p className="font-bold">After you pay</p>
                <ol className="pl-4 space-y-1 list-decimal text-amber-800/90">
                  <li>Keep your bank transfer receipt / alert.</li>
                  <li>
                    Send it to the school (WhatsApp / office) with the student
                    name and admission number.
                  </li>
                  <li>
                    Admin will confirm and record it — it will show under{" "}
                    <strong>Recent Payments</strong>.
                  </li>
                </ol>
              </div>
            </div>

            <div className="px-5 py-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowPayModal(false)}
                className="w-full py-2.5 text-xs font-heading font-bold text-white bg-primary hover:bg-accent rounded-xl cursor-pointer"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentFees;
