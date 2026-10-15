import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-[#72D94B] shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-[#DC5252] shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
          info: <Info className="w-5 h-5 text-[#FFA51F] shrink-0" />
        };

        const borderColors = {
          success: 'border-l-4 border-l-[#72D94B]',
          error: 'border-l-4 border-l-[#DC5252]',
          warning: 'border-l-4 border-l-amber-500',
          info: 'border-l-4 border-l-[#FFA51F]'
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto bg-white rounded-xl shadow-lg border border-[#E7E2D9] ${borderColors[toast.type]} p-3.5 flex items-start gap-3 transition-all duration-200 animate-in slide-in-from-top-2`}
          >
            {icons[toast.type]}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#171717]">{toast.title}</p>
              {toast.message && <p className="text-xs text-[#666666] mt-0.5">{toast.message}</p>}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 text-[#666666] hover:text-[#171717] rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
