import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { ReceiptModal } from '../components/common/ReceiptModal';
import { Modal } from '../components/common/Modal';
import { useNavigate } from 'react-router-dom';
import { FeePayment } from '../types';
import {
  DollarSign,
  TrendingUp,
  Receipt,
  AlertTriangle,
  FolderKanban,
  FileText,
  CreditCard,
  Plus,
  ArrowRight,
  ShieldAlert,
  Wallet
} from 'lucide-react';

export const AccountantDashboard: React.FC = () => {
  const {
    students,
    classes,
    feePayments,
    expenses,
    financialActivities,
    recordPayment,
    recordExpense
  } = useApp();

  const navigate = useNavigate();

  // Modals
  const [selectedReceipt, setSelectedReceipt] = useState<FeePayment | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);

  // New Payment Form
  const [payStudentId, setPayStudentId] = useState('stu-003'); // Zainab Salifu
  const [payAmount, setPayAmount] = useState('850');
  const [payMethod, setPayMethod] = useState<'Mobile Money' | 'Cash' | 'Bank Transfer' | 'Cheque'>('Mobile Money');
  const [payRef, setPayRef] = useState(`MTN-MM-${Math.floor(10000000 + Math.random() * 90000000)}`);
  const [payNotes, setPayNotes] = useState('Settlement of Term 2 balance via MTN MoMo');

  // New Expense Form
  const [expTitle, setExpTitle] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expCategory, setExpCategory] = useState<any>('Facility Maintenance');
  const [expVendor, setExpVendor] = useState('');
  const [expMethod, setExpMethod] = useState<any>('Mobile Money');
  const [expRequireApproval, setExpRequireApproval] = useState(true);

  // Financial aggregates
  const totalCollected = feePayments.reduce((acc, p) => acc + p.amountPaid, 0);
  const totalBilled = 31350; // for active cohort
  const totalOutstanding = Math.max(0, totalBilled - totalCollected);
  const collectionRate = Math.round((totalCollected / totalBilled) * 100);

  const totalExpenses = expenses
    .filter((e) => e.approvalStatus === 'approved')
    .reduce((acc, e) => acc + e.amount, 0);

  const netOperatingSummary = totalCollected - totalExpenses;
  const pendingApprovalExpenses = expenses.filter((e) => e.approvalStatus === 'pending');

  const handleRecordPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPay = recordPayment({
      studentId: payStudentId,
      amountPaid: Number(payAmount),
      paymentMethod: payMethod,
      paymentDate: new Date().toISOString().split('T')[0],
      transactionRef: payRef,
      recordedBy: 'Mr. Emmanuel Donkor',
      notes: payNotes,
      termId: 'term-2',
      academicYearId: 'ay-2025-2026'
    });
    setPaymentModalOpen(false);
    setSelectedReceipt(newPay); // Immediately present the receipt!
  };

  const handleRecordExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    recordExpense({
      title: expTitle,
      amount: Number(expAmount),
      category: expCategory,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: expMethod,
      vendor: expVendor || 'Local Vendor',
      referenceNo: `REF-${Math.floor(1000 + Math.random() * 9000)}`,
      enteredBy: 'Mr. Emmanuel Donkor',
      approvalStatus: expRequireApproval ? 'pending' : 'approved',
      attachmentName: 'voucher_receipt.pdf'
    });
    setExpenseModalOpen(false);
    setExpTitle('');
    setExpAmount('');
    setExpVendor('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E7E2D9] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
              Bursar & Accounts Office
            </span>
            <span className="text-xs text-[#666666]">Ghana Cedi (GH₵) • Term 2 Financial Operating Ledger</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-[#171717] mt-1">
            Accounts & Financial Management
          </h1>
          <p className="text-xs text-[#666666]">
            Welcome, Mr. Emmanuel Donkor. Record fee collections, disburse expenses, and reconcile project funds.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpenseModalOpen(true)}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Expense
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setPaymentModalOpen(true)}
            icon={<Receipt className="w-3.5 h-3.5" />}
          >
            Record Fee Payment
          </Button>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4" hoverable>
          <p className="text-xs font-semibold text-[#666666]">Total Fees Collected</p>
          <h3 className="text-2xl font-extrabold text-emerald-700 mt-1">
            GH₵ {totalCollected.toLocaleString()}
          </h3>
          <p className="text-[11px] text-emerald-800 font-semibold mt-2">
            {collectionRate}% Collection Rate
          </p>
        </Card>

        <Card className="p-4" hoverable>
          <p className="text-xs font-semibold text-[#666666]">Outstanding Arrears</p>
          <h3 className="text-2xl font-extrabold text-[#DC5252] mt-1">
            GH₵ {totalOutstanding.toLocaleString()}
          </h3>
          <p className="text-[11px] text-[#DC5252] font-semibold mt-2">Term 2 Arrears Register</p>
        </Card>

        <Card className="p-4" hoverable>
          <p className="text-xs font-semibold text-[#666666]">Approved Expenses</p>
          <h3 className="text-2xl font-extrabold text-[#171717] mt-1">
            GH₵ {totalExpenses.toLocaleString()}
          </h3>
          <p className="text-[11px] text-[#666666] mt-2">Disbursed Operating Outflows</p>
        </Card>

        <Card className="p-4" hoverable>
          <p className="text-xs font-semibold text-[#666666]">Net Operating Balance</p>
          <h3 className={`text-2xl font-extrabold mt-1 ${netOperatingSummary >= 0 ? 'text-[#B26A00]' : 'text-red-600'}`}>
            GH₵ {netOperatingSummary.toLocaleString()}
          </h3>
          <p className="text-[11px] text-[#666666] mt-2">Inflow less Outflow</p>
        </Card>
      </div>

      {/* Row: Project Accounting (Key Differentiator!) & Pending Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Accounting Differentiator (2 Cols) */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="School Project & Activity Accounting (Ring-Fenced Ledgers)"
            subtitle="Kakum Tour, Sports Festival & Science Lab upgrade accounts"
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/activities')}
                icon={<FolderKanban className="w-3.5 h-3.5" />}
              >
                All Project Ledgers
              </Button>
            }
          />
          <div className="space-y-4">
            {financialActivities.map((act) => {
              const remaining = act.incomeReceived - act.expensesSpent;
              return (
                <div
                  key={act.id}
                  onClick={() => navigate('/activities')}
                  className="p-4 rounded-xl border border-[#E7E2D9] hover:border-[#FFA51F] hover:bg-[#FFF8ED]/20 transition-all cursor-pointer group space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-[#171717] group-hover:text-[#B26A00]">
                        {act.title}
                      </h4>
                      <p className="text-[11px] text-[#666666]">{act.description}</p>
                    </div>
                    <Badge variant={act.status === 'reconciled' ? 'success' : 'primary'} size="sm">
                      {act.status.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-4 gap-2 bg-[#F5F5F4] p-3 rounded-xl text-center">
                    <div>
                      <span className="text-[#666666] block">Approved Budget</span>
                      <span className="font-bold text-[#171717]">GH₵{act.budget.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[#666666] block">Collected / Inflows</span>
                      <span className="font-bold text-emerald-700">GH₵{act.incomeReceived.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[#666666] block">Total Spent</span>
                      <span className="font-bold text-[#171717]">GH₵{act.expensesSpent.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[#666666] block">Funds Remaining</span>
                      <span className="font-extrabold text-[#B26A00]">GH₵{remaining.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Expenses Pending Owner Approval */}
        <Card>
          <CardHeader
            title="Expenses Awaiting Owner Sign-Off"
            subtitle="Transactions routed to proprietor Dr. Kwame Mensah"
            action={
              <Badge variant="warning" size="sm">
                {pendingApprovalExpenses.length} Pending
              </Badge>
            }
          />
          <div className="space-y-3 text-xs">
            {pendingApprovalExpenses.map((exp) => (
              <div
                key={exp.id}
                className="p-3 rounded-xl border border-amber-200 bg-amber-50/40 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#171717]">{exp.title}</span>
                  <span className="font-mono font-bold text-[#B26A00]">
                    GH₵{exp.amount.toLocaleString()}
                  </span>
                </div>
                <p className="text-[#666666]">
                  Vendor: {exp.vendor} • Method: {exp.paymentMethod}
                </p>
                <Badge variant="warning" size="sm">
                  Submitted to Proprietor
                </Badge>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2"
              onClick={() => navigate('/finances')}
            >
              Open Expense Register
            </Button>
          </div>
        </Card>
      </div>

      {/* Row: Recent Payments Ledger */}
      <Card>
        <CardHeader
          title="Recent Student Fee Payments & Issued Receipts"
          subtitle="Click 'Print Receipt' to inspect and print official computer receipts"
          action={
            <Button
              variant="primary"
              size="sm"
              onClick={() => setPaymentModalOpen(true)}
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              Record Payment
            </Button>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F5F4] text-[#666666] font-semibold border-b border-[#E7E2D9]">
              <tr>
                <th className="p-3">Receipt No</th>
                <th className="p-3">Student Name</th>
                <th className="p-3">Date</th>
                <th className="p-3">Method</th>
                <th className="p-3">MoMo / Bank Ref</th>
                <th className="p-3 text-right">Amount (GH₵)</th>
                <th className="p-3 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {feePayments.map((pay) => {
                const st = students.find((s) => s.id === pay.studentId);
                const cls = classes.find((c) => c.id === st?.currentClassId);
                return (
                  <tr key={pay.id} className="hover:bg-stone-50">
                    <td className="p-3 font-mono font-bold text-[#B26A00]">{pay.receiptNumber}</td>
                    <td className="p-3 font-semibold text-[#171717]">
                      {st ? `${st.firstName} ${st.lastName}` : 'N/A'}
                      <span className="text-[11px] text-[#666666] block font-normal">{cls?.name}</span>
                    </td>
                    <td className="p-3 text-[#666666]">{pay.paymentDate}</td>
                    <td className="p-3 font-medium text-[#171717]">{pay.paymentMethod}</td>
                    <td className="p-3 font-mono text-[#666666]">{pay.transactionRef}</td>
                    <td className="p-3 text-right font-extrabold text-[#171717]">
                      GH₵ {pay.amountPaid.toLocaleString()}
                    </td>
                    <td className="p-3 text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Receipt className="w-3.5 h-3.5" />}
                        onClick={() => setSelectedReceipt(pay)}
                      >
                        Print Receipt
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Record Fee Payment Modal (Journey E Requirement!) */}
      <Modal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        title="Record Student Fee Payment & Generate Receipt"
        subtitle="Issue official computerized receipt and update student ledger"
        maxWidth="lg"
      >
        <form onSubmit={handleRecordPaymentSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#171717] mb-1">
              Select Student / Ward <span className="text-red-500">*</span>
            </label>
            <select
              value={payStudentId}
              onChange={(e) => setPayStudentId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#E7E2D9] focus:outline-none focus:border-[#FFA51F] bg-white font-semibold"
            >
              {students.map((st) => {
                const c = classes.find((cl) => cl.id === st.currentClassId);
                return (
                  <option key={st.id} value={st.id}>
                    {st.firstName} {st.lastName} ({st.admissionNumber}) — {c?.name}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#171717] mb-1">
                Amount Paid (GH₵) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                placeholder="e.g. 2850"
                className="w-full p-2.5 rounded-xl border border-[#E7E2D9] focus:outline-none focus:border-[#FFA51F] font-bold text-sm"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#171717] mb-1">
                Payment Method <span className="text-red-500">*</span>
              </label>
              <select
                value={payMethod}
                onChange={(e) => setPayMethod(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-[#E7E2D9] focus:outline-none focus:border-[#FFA51F] bg-white"
              >
                <option value="Mobile Money">Mobile Money (MTN / Telecel)</option>
                <option value="Bank Transfer">Bank Transfer (GCB / Ecobank)</option>
                <option value="Cash">Cash (Bursar Office)</option>
                <option value="Cheque">Bank Cheque</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#171717] mb-1">
              Transaction Reference / Mobile Money ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={payRef}
              onChange={(e) => setPayRef(e.target.value)}
              placeholder="e.g. MTN-MM-99182374"
              className="w-full p-2.5 rounded-xl border border-[#E7E2D9] focus:outline-none focus:border-[#FFA51F] font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#171717] mb-1">
              Payment Remarks / Receipt Notes
            </label>
            <input
              type="text"
              value={payNotes}
              onChange={(e) => setPayNotes(e.target.value)}
              placeholder="e.g. Term 2 Full Fees Settlement"
              className="w-full p-2.5 rounded-xl border border-[#E7E2D9] focus:outline-none focus:border-[#FFA51F]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#E7E2D9]">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setPaymentModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Post Payment & View Receipt
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Expense Modal */}
      <Modal
        isOpen={expenseModalOpen}
        onClose={() => setExpenseModalOpen(false)}
        title="Record School Expense"
        subtitle="Log operational outflow or submit for proprietor approval"
        maxWidth="lg"
      >
        <form onSubmit={handleRecordExpenseSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#171717] mb-1">
              Expense Title / Description <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={expTitle}
              onChange={(e) => setExpTitle(e.target.value)}
              placeholder="e.g. Gen-Set Diesel Fuel & Power Servicing"
              className="w-full p-2.5 rounded-xl border border-[#E7E2D9] focus:outline-none focus:border-[#FFA51F]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#171717] mb-1">
                Amount (GH₵) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                value={expAmount}
                onChange={(e) => setExpAmount(e.target.value)}
                placeholder="e.g. 1500"
                className="w-full p-2.5 rounded-xl border border-[#E7E2D9] focus:outline-none focus:border-[#FFA51F] font-bold"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#171717] mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={expCategory}
                onChange={(e) => setExpCategory(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-[#E7E2D9] focus:outline-none focus:border-[#FFA51F] bg-white"
              >
                <option value="Staff Welfare">Staff Welfare</option>
                <option value="Utilities & Internet">Utilities & Internet</option>
                <option value="Facility Maintenance">Facility Maintenance</option>
                <option value="Teaching Materials">Teaching Materials</option>
                <option value="Transport & Fuel">Transport & Fuel</option>
                <option value="School Event">School Event</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#171717] mb-1">
                Vendor / Recipient <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={expVendor}
                onChange={(e) => setExpVendor(e.target.value)}
                placeholder="e.g. Shell Filling Station East Legon"
                className="w-full p-2.5 rounded-xl border border-[#E7E2D9] focus:outline-none focus:border-[#FFA51F]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#171717] mb-1">
                Payment Channel
              </label>
              <select
                value={expMethod}
                onChange={(e) => setExpMethod(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-[#E7E2D9] focus:outline-none focus:border-[#FFA51F] bg-white"
              >
                <option value="Mobile Money">Mobile Money</option>
                <option value="Cash">Cash Voucher</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-[#FFF8ED] rounded-xl border border-[#FFA51F]/30 flex items-center gap-2">
            <input
              type="checkbox"
              id="reqApproval"
              checked={expRequireApproval}
              onChange={(e) => setExpRequireApproval(e.target.checked)}
              className="rounded text-[#FFA51F] focus:ring-[#FFA51F]"
            />
            <label htmlFor="reqApproval" className="cursor-pointer font-semibold text-[#B26A00]">
              Route to Proprietor (Dr. Kwame Mensah) for sign-off approval
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#E7E2D9]">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setExpenseModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Commit Expense
            </Button>
          </div>
        </form>
      </Modal>

      {/* Embedded Printable Receipt Modal */}
      <ReceiptModal
        isOpen={Boolean(selectedReceipt)}
        onClose={() => setSelectedReceipt(null)}
        payment={selectedReceipt}
      />
    </div>
  );
};
