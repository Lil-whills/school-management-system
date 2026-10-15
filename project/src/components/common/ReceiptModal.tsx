import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Printer, Download, CheckCircle, ShieldCheck } from 'lucide-react';
import { FeePayment } from '../../types';
import { useApp } from '../../context/AppContext';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: FeePayment | null;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  payment
}) => {
  const { school, students, classes, guardians, getStudentFinancialSummary } = useApp();

  if (!payment) return null;

  const student = students.find((s) => s.id === payment.studentId);
  const studentClass = classes.find((c) => c.id === student?.currentClassId);
  const guardian = guardians.find((g) => g.id === student?.guardianId);
  const financialSummary = student ? getStudentFinancialSummary(student.id) : null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Official Payment Receipt"
      subtitle={`Receipt No: ${payment.receiptNumber}`}
      maxWidth="xl"
    >
      <div className="flex flex-col gap-6">
        {/* Printable Receipt Paper */}
        <div id="printable-receipt" className="p-6 bg-white border border-[#E7E2D9] rounded-xl shadow-xs printable-area">
          {/* Header */}
          <div className="border-b-2 border-[#171717] pb-4 mb-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="w-8 h-8 rounded-lg bg-[#FFA51F] flex items-center justify-center text-white font-black text-sm">
                SF
              </span>
              <h1 className="text-xl font-extrabold uppercase tracking-wide text-[#171717]">{school.name}</h1>
            </div>
            <p className="text-xs text-[#666666] italic">{school.motto}</p>
            <p className="text-[11px] text-[#666666] mt-1">{school.address} • Tel: {school.phone}</p>
            <div className="inline-block px-3 py-0.5 mt-2 bg-[#FFF8ED] border border-[#E7E2D9] rounded-full text-[11px] font-semibold text-[#B26A00]">
              Ghana Education Service Reg: {school.gesRegistrationNo}
            </div>
          </div>

          {/* Receipt Meta */}
          <div className="flex justify-between items-start bg-[#F5F5F4] p-3 rounded-lg mb-5 text-xs">
            <div>
              <p className="text-[#666666]">Receipt Number:</p>
              <p className="font-bold text-sm text-[#171717]">{payment.receiptNumber}</p>
              <p className="text-[#666666] mt-1">Academic Year / Term:</p>
              <p className="font-semibold text-[#171717]">2025/2026 Academic Year • Term 2</p>
            </div>
            <div className="text-right">
              <p className="text-[#666666]">Date Issued:</p>
              <p className="font-bold text-sm text-[#171717]">{payment.paymentDate}</p>
              <p className="text-[#666666] mt-1">Payment Method:</p>
              <p className="font-semibold text-[#171717]">{payment.paymentMethod}</p>
            </div>
          </div>

          {/* Student Info Table */}
          <div className="grid grid-cols-2 gap-3 text-xs mb-5 border-b border-[#E7E2D9] pb-4">
            <div>
              <p className="text-[#666666]">Student Name:</p>
              <p className="font-bold text-sm text-[#171717]">{student ? `${student.firstName} ${student.lastName}` : 'N/A'}</p>
              <p className="text-[#666666] mt-2">Class:</p>
              <p className="font-semibold text-[#171717]">{studentClass?.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[#666666]">Admission Number:</p>
              <p className="font-bold text-sm text-[#171717]">{student?.admissionNumber || 'N/A'}</p>
              <p className="text-[#666666] mt-2">Guardian / Sponsor:</p>
              <p className="font-semibold text-[#171717]">{guardian ? `${guardian.name} (${guardian.phone})` : 'N/A'}</p>
            </div>
          </div>

          {/* Transaction Breakdown */}
          <table className="w-full text-xs mb-5">
            <thead>
              <tr className="border-b border-[#E7E2D9] text-[#666666]">
                <th className="text-left py-2 font-semibold">Description</th>
                <th className="text-left py-2 font-semibold">Ref Number</th>
                <th className="text-right py-2 font-semibold">Amount (GH₵)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-stone-100">
                <td className="py-2.5 font-medium text-[#171717]">
                  {payment.notes || 'School Fees & Ancillary Charges Payment'}
                </td>
                <td className="py-2.5 text-[#666666] font-mono">{payment.transactionRef}</td>
                <td className="py-2.5 text-right font-bold text-[#171717]">
                  GH₵ {payment.amountPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2} className="pt-3 text-right font-bold text-sm text-[#171717]">Total Paid:</td>
                <td className="pt-3 text-right font-extrabold text-base text-[#B26A00]">
                  GH₵ {payment.amountPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
              </tr>
              {financialSummary && (
                <tr>
                  <td colSpan={2} className="text-right text-[#666666] text-xs pt-1">Remaining Term Balance:</td>
                  <td className="text-right text-xs pt-1 font-bold">
                    {financialSummary.balance <= 0 ? (
                      <span className="text-emerald-600">GH₵ 0.00 (Fully Settled)</span>
                    ) : (
                      <span className="text-[#DC5252]">GH₵ {financialSummary.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    )}
                  </td>
                </tr>
              )}
            </tfoot>
          </table>

          {/* Signatures & Stamp */}
          <div className="pt-6 border-t border-dashed border-[#E7E2D9] flex justify-between items-end text-xs">
            <div>
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold mb-2">
                <ShieldCheck className="w-4 h-4" /> Official Computerized Receipt
              </div>
              <p className="text-[10px] text-[#666666]">Recorded by: {payment.recordedBy}</p>
              <p className="text-[10px] text-[#666666]">Generated via SchoolFlow Portal</p>
            </div>
            <div className="text-center">
              <div className="w-32 border-b border-[#171717] mb-1"></div>
              <p className="font-semibold text-[11px] text-[#171717]">Authorized Bursar</p>
              <p className="text-[10px] text-[#666666]">Accounts Office Stamp</p>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              icon={<Download className="w-4 h-4" />}
              onClick={handlePrint}
            >
              Export PDF
            </Button>
            <Button
              variant="primary"
              icon={<Printer className="w-4 h-4" />}
              onClick={handlePrint}
            >
              Print Receipt
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
