import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

const Toast = ({ type = "success", message, onClose }) => {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [message, onClose]);

  if (!message) return null;

  const ok = type === "success";

  return (
    <div className="fixed z-[100] flex items-start gap-3 px-4 py-3 text-xs font-medium border shadow-lg top-4 right-4 left-4 sm:left-auto sm:max-w-sm rounded-xl bg-white print:hidden">
      {ok ? (
        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
      ) : (
        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
      )}
      <p className={ok ? "text-emerald-800" : "text-rose-800"}>{message}</p>
      <button
        type="button"
        onClick={onClose}
        className="p-0.5 ml-auto text-gray hover:text-dark cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default Toast;