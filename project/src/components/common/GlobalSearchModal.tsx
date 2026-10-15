import React, { useState, useEffect } from 'react';
import { Search, User as UserIcon, BookOpen, Receipt, FileText, ArrowRight, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStudent?: (studentId: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectStudent
}) => {
  const [query, setQuery] = useState('');
  const { students, classes, feePayments, expenses, currentUser } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  // Search results
  const matchedStudents = cleanQuery
    ? students.filter(
        (s) =>
          s.firstName.toLowerCase().includes(cleanQuery) ||
          s.lastName.toLowerCase().includes(cleanQuery) ||
          s.admissionNumber.toLowerCase().includes(cleanQuery)
      )
    : [];

  const matchedClasses = cleanQuery
    ? classes.filter((c) => c.name.toLowerCase().includes(cleanQuery))
    : [];

  const matchedPayments =
    cleanQuery && ['owner', 'accountant', 'admin'].includes(currentUser.role)
      ? feePayments.filter(
          (p) =>
            p.receiptNumber.toLowerCase().includes(cleanQuery) ||
            p.transactionRef.toLowerCase().includes(cleanQuery)
        )
      : [];

  const matchedExpenses =
    cleanQuery && ['owner', 'accountant'].includes(currentUser.role)
      ? expenses.filter(
          (e) =>
            e.title.toLowerCase().includes(cleanQuery) ||
            e.expenseNumber.toLowerCase().includes(cleanQuery) ||
            e.vendor.toLowerCase().includes(cleanQuery)
        )
      : [];

  const hasResults =
    matchedStudents.length > 0 ||
    matchedClasses.length > 0 ||
    matchedPayments.length > 0 ||
    matchedExpenses.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#E7E2D9] overflow-hidden z-10 flex flex-col">
        {/* Input Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#E7E2D9] bg-[#FFF8ED]/30">
          <Search className="w-5 h-5 text-[#FFA51F] shrink-0" />
          <input
            type="text"
            placeholder="Search students, admission numbers, classes, receipts, expenses..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent border-none outline-none text-sm text-[#171717] placeholder:text-[#666666]"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#666666] hover:text-[#171717]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block text-[10px] uppercase font-semibold text-[#666666] bg-stone-100 border border-stone-200 px-1.5 py-0.5 rounded">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {!cleanQuery ? (
            <div className="py-8 text-center text-xs text-[#666666]">
              <Search className="w-8 h-8 text-stone-300 mx-auto mb-2" />
              <p>Type student names, admission numbers (e.g. "HCA/2022/041"), classes or receipts.</p>
            </div>
          ) : !hasResults ? (
            <div className="py-8 text-center text-xs text-[#666666]">
              <p>No matching records found for "{query}".</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Students */}
              {matchedStudents.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#666666] mb-2">
                    Students ({matchedStudents.length})
                  </p>
                  <div className="space-y-1">
                    {matchedStudents.slice(0, 5).map((st) => {
                      const cls = classes.find((c) => c.id === st.currentClassId);
                      return (
                        <div
                          key={st.id}
                          onClick={() => {
                            onClose();
                            if (onSelectStudent) {
                              onSelectStudent(st.id);
                            } else {
                              navigate('/students');
                            }
                          }}
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#FFF8ED] cursor-pointer group transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#FFA51F]/15 text-[#B26A00] flex items-center justify-center font-bold text-xs shrink-0">
                              {st.firstName[0]}
                              {st.lastName[0]}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-[#171717] group-hover:text-[#B26A00]">
                                {st.firstName} {st.lastName}
                              </p>
                              <p className="text-xs text-[#666666]">
                                {st.admissionNumber} • {cls?.name || 'Class Unassigned'}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-[#FFA51F] group-hover:translate-x-1 transition-all" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Classes */}
              {matchedClasses.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#666666] mb-2">
                    Classes ({matchedClasses.length})
                  </p>
                  <div className="space-y-1">
                    {matchedClasses.map((cls) => (
                      <div
                        key={cls.id}
                        onClick={() => {
                          onClose();
                          navigate('/academics');
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#FFF8ED] cursor-pointer group transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <BookOpen className="w-5 h-5 text-[#FFA51F]" />
                          <div>
                            <p className="text-sm font-semibold text-[#171717]">{cls.name}</p>
                            <p className="text-xs text-[#666666]">
                              Level: {cls.level} • Capacity: {cls.capacity} students
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-[#FFA51F] transition-all" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payments */}
              {matchedPayments.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#666666] mb-2">
                    Receipts & Payments ({matchedPayments.length})
                  </p>
                  <div className="space-y-1">
                    {matchedPayments.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          onClose();
                          navigate('/finances');
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#FFF8ED] cursor-pointer group transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Receipt className="w-5 h-5 text-emerald-600" />
                          <div>
                            <p className="text-sm font-semibold text-[#171717]">{p.receiptNumber}</p>
                            <p className="text-xs text-[#666666]">
                              GH₵{p.amountPaid.toLocaleString()} • {p.paymentMethod} ({p.paymentDate})
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-[#FFA51F] transition-all" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Expenses */}
              {matchedExpenses.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#666666] mb-2">
                    Expenses ({matchedExpenses.length})
                  </p>
                  <div className="space-y-1">
                    {matchedExpenses.map((e) => (
                      <div
                        key={e.id}
                        onClick={() => {
                          onClose();
                          navigate('/finances');
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#FFF8ED] cursor-pointer group transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-amber-600" />
                          <div>
                            <p className="text-sm font-semibold text-[#171717]">{e.title}</p>
                            <p className="text-xs text-[#666666]">
                              {e.expenseNumber} • GH₵{e.amount.toLocaleString()} ({e.approvalStatus})
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-[#FFA51F] transition-all" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
