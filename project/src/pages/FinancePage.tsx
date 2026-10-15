import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { ReceiptModal } from '../components/common/ReceiptModal';
import { Modal } from '../components/common/Modal';
import { FeePayment } from '../types';
import {
  DollarSign,
  Receipt,
  TrendingUp,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Download,
  CheckCircle2,
  XCircle,
  FileText,
  CreditCard,
  Printer
} from 'lucide-react';

export const FinancePage: React.FC = () => {
  const {
    students,
    classes,
    feePayments,
    feeSchedules,
    feeAdjustments,
    expenses,
    recordPayment,
    addFeeAdjustment,
    recordExpense,
    approveExpense,
    rejectExpense,
    getStudentFinancialSummary,
    currentUser
  } = useApp();

  const [activeTab, setActiveTab] = useState<'ledgers' | 'schedules' | 'expenses' | 'transactions'>('ledgers');
  const [selectedReceipt, setSelectedReceipt] = useState<FeePayment | null>(null);

  // Filter state for Student Ledgers
  const [searchPupil, setSearchPupil] = useState('');
  const [balanceFilter, setBalanceFilter] = useState<'all' | 'arrears' | 'cleared'>('all');

  // Payment Recording Modal State
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [payStudentId, setPayStudentId] = useState('stu-003');
  const [payAmount, setPayAmount] = useState('850');
  const [payMethod, setPayMethod] = useState<'Mobile Money' | 'Cash' | 'Bank Transfer' | 'Cheque'>('Mobile Money');
  const [payRef, setPayRef] = useState(`MTN-MM-${Math.floor(10000000 + Math.random() * 90000000)}`);
  const [payNotes, setPayNotes] = useState('Settlement of Term 2 fee balance');

  // Adjustment Modal State
  const [adjustmentModalOpen, setAdjustmentModalOpen] = useState(false);
  const [adjStudentId, setAdjStudentId] = useState('stu-004');
  const [adjAmount, setAdjAmount] = useState('200');
  const [adjType, setAdjType] = useState<any>('discount');
  const [adjReason, setAdjReason] = useState('PTA welfare discount for academic merit');

  // Expense Modal State
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [expTitle, setExpTitle] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expCategory, setExpCategory] = useState<any>('Facility Maintenance');
  const [expVendor, setExpVendor] = useState('');
  const [expMethod, setExpMethod] = useState<any>('Mobile Money');
  const [expRequireApproval, setExpRequireApproval] = useState(true);

  // Financial aggregates
  const totalCollected = feePayments.reduce((acc, p) => acc + p.amountPaid, 0);
  const totalBilled = 31350;
  const totalOutstanding = Math.max(0, totalBilled - totalCollected);
  const totalExpenses = expenses
    .filter((e) => e.approvalStatus === 'approved')
    .reduce((acc, e) => acc + e.amount, 0);

  const canApprove = ['owner'].includes(currentUser.role);

  // Ledgers computation
  const pupilLedgers = students.map((st) => {
    const summary = getStudentFinancialSummary(st.id);
    const cls = classes.find((c) => c.id === st.currentClassId);
    return {
      student: st,
      classObj: cls,
      ...summary
    };
  });

  const filteredLedgers = pupilLedgers.filter((l) => {
    const matchesSearch =
      l.student.firstName.toLowerCase().includes(searchPupil.toLowerCase()) ||
      l.student.lastName.toLowerCase().includes(searchPupil.toLowerCase()) ||
      l.student.admissionNumber.toLowerCase().includes(searchPupil.toLowerCase());
    const matchesBalance =
      balanceFilter === 'all'
        ? true
        : balanceFilter === 'arrears'
        ? l.balance > 0
        : l.balance <= 0;
    return matchesSearch && matchesBalance;
  });

  const handleRecordPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPay = recordPayment({
      studentId: payStudentId,
      amountPaid: Number(payAmount),
      paymentMethod: payMethod,
      paymentDate: new Date().toISOString().split('T')[0],
      transactionRef: payRef,
      recordedBy: currentUser.name,
      notes: payNotes,
      termId: 'term-2',
      academicYearId: 'ay-2025-2026'
    });
    setPaymentModalOpen(false);
    setSelectedReceipt(newPay);
  };

  const handleRecordAdjustmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addFeeAdjustment({
      studentId: adjStudentId,
      amount: -Math.abs(Number(adjAmount)), // discounts are negative deductions
      type: adjType,
      reason: adjReason,
      approvedBy: currentUser.name,
      date: new Date().toISOString().split('T')[0]
    });
    setAdjustmentModalOpen(false);
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
      referenceNo: `EXP-REF-${Math.floor(1000 + Math.random() * 9000)}`,
      enteredBy: currentUser.name,
      approvalStatus: expRequireApproval ? 'pending' : 'approved',
      attachmentName: 'voucher_receipt.pdf'
    });
    setExpenseModalOpen(false);
    setExpTitle('');
    setExpAmount('');
    setExpVendor('');
  };

  const handleExportLedgerCSV = () => {
    const headers = 'AdmissionNo,StudentName,Class,Billed(GHC),Discounts(GHC),NetBilled(GHC),Paid(GHC),Balance(GHC),Status\n';
    const rows = filteredLedgers
      .map(
        (l) =>
          `"${l.student.admissionNumber}","${l.student.firstName} ${l.student.lastName}","${l.classObj?.name || ''}",${l.totalBilled},${l.totalAdjustments},${l.netBilled},${l.totalPaid},${l.balance},"${l.balance <= 0 ? 'CLEARED' : 'ARREARS'}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Heritage_Crown_Fee_Ledgers_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E7E2D9] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#FFA51F]/20 text-[#B26A00]">
              Ghana Cedi (GH₵)
            </span>
            <span className="text-xs text-[#666666]">Term 2 Fee Billing, Mobile Money & Operating Ledgers</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-[#171717] mt-1">
            Fees & Financial Management
          </h1>
          <p className="text-xs text-[#666666]">
            Fee schedules, student ledgers, MoMo payment receipts, discounts, and verified school expenses.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAdjustmentModalOpen(true)}
          >
            Apply Discount
          </Button>
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

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4" hoverable>
          <p className="text-xs font-semibold text-[#666666]">Total Fees Collected</p>
          <h3 className="text-2xl font-extrabold text-emerald-700 mt-1">
            GH₵ {totalCollected.toLocaleString()}
          </h3>
          <p className="text-[11px] text-emerald-800 font-semibold mt-2">
            {feePayments.length} recorded payments
          </p>
        </Card>

        <Card className="p-4" hoverable>
          <p className="text-xs font-semibold text-[#666666]">Outstanding Arrears</p>
          <h3 className="text-2xl font-extrabold text-[#DC5252] mt-1">
            GH₵ {totalOutstanding.toLocaleString()}
          </h3>
          <p className="text-[11px] text-[#DC5252] font-semibold mt-2">
            Term 2 Unsettled Fees
          </p>
        </Card>

        <Card className="p-4" hoverable>
          <p className="text-xs font-semibold text-[#666666]">Approved Expenses</p>
          <h3 className="text-2xl font-extrabold text-[#171717] mt-1">
            GH₵ {totalExpenses.toLocaleString()}
          </h3>
          <p className="text-[11px] text-[#666666] mt-2">Operational disbursements</p>
        </Card>

        <Card className="p-4" hoverable>
          <p className="text-xs font-semibold text-[#666666]">Operating Net Position</p>
          <h3 className="text-2xl font-extrabold text-[#B26A00] mt-1">
            GH₵ {(totalCollected - totalExpenses).toLocaleString()}
          </h3>
          <p className="text-[11px] text-[#666666] mt-2">Cash at Bank / MoMo</p>
        </Card>
      </div>

      {/* Financial Tabs */}
      <div className="flex border-b border-[#E7E2D9] gap-2 overflow-x-auto text-xs font-bold">
        {[
          { id: 'ledgers', label: 'Pupil Fee Ledgers & Balances', icon: <DollarSign className="w-4 h-4" /> },
          { id: 'schedules', label: 'Official Fee Schedules', icon: <FileText className="w-4 h-4" /> },
          { id: 'expenses', label: 'Expenses & Approvals Register', icon: <CreditCard className="w-4 h-4" /> },
          { id: 'transactions', label: 'Payment Receipts Log', icon: <Receipt className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-[#FFA51F] text-[#B26A00] bg-white rounded-t-xl'
                : 'border-transparent text-[#666666] hover:text-[#171717]'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Student Fee Ledgers */}
      {activeTab === 'ledgers' && (
        <div className="space-y-4">
          <Card className="p-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center text-xs">
              <div className="relative flex-1 w-full sm:w-auto">
                <Search className="w-4 h-4 text-[#666666] absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Filter student ledgers by name or admission number..."
                  value={searchPupil}
                  onChange={(e) => setSearchPupil(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-[#E7E2D9] focus:outline-none focus:border-[#FFA51F] bg-white"
                />
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <select
                  value={balanceFilter}
                  onChange={(e) => setBalanceFilter(e.target.value as any)}
                  className="text-xs p-2.5 rounded-xl border border-[#E7E2D9] bg-white font-medium"
                >
                  <option value="all">All Students ({filteredLedgers.length})</option>
                  <option value="arrears">With Outstanding Arrears</option>
                  <option value="cleared">Fully Cleared</option>
                </select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportLedgerCSV}
                  icon={<Download className="w-3.5 h-3.5" />}
                >
                  Export CSV
                </Button>
              </div>
            </div>
          </Card>

          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F5F5F4] text-[#666666] font-semibold border-b border-[#E7E2D9]">
                  <tr>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Admission No</th>
                    <th className="p-3">Class</th>
                    <th className="p-3 text-right">Billed Fees</th>
                    <th className="p-3 text-right">Discounts</th>
                    <th className="p-3 text-right">Paid to Date</th>
                    <th className="p-3 text-right">Current Balance</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredLedgers.map((l) => (
                    <tr key={l.student.id} className="hover:bg-stone-50">
                      <td className="p-3 font-bold text-[#171717]">
                        {l.student.firstName} {l.student.lastName}
                      </td>
                      <td className="p-3 font-mono text-[#666666]">{l.student.admissionNumber}</td>
                      <td className="p-3 font-semibold text-[#171717]">{l.classObj?.name || 'Class'}</td>
                      <td className="p-3 text-right font-mono font-medium text-[#171717]">
                        GH₵ {l.totalBilled.toLocaleString()}
                      </td>
                      <td className="p-3 text-right font-mono font-medium text-emerald-700">
                        {(l.totalAdjustments ?? 0) !== 0 ? `GH₵ ${(l.totalAdjustments ?? 0).toLocaleString()}` : '—'}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-700">
                        GH₵ {l.totalPaid.toLocaleString()}
                      </td>
                      <td className="p-3 text-right font-mono font-extrabold text-sm">
                        {l.balance <= 0 ? (
                          <span className="text-emerald-600">GH₵ 0.00</span>
                        ) : (
                          <span className="text-[#DC5252]">GH₵ {l.balance.toLocaleString()}</span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <Badge variant={l.balance <= 0 ? 'success' : 'danger'} size="sm">
                          {l.balance <= 0 ? 'CLEARED' : 'ARREARS'}
                        </Badge>
                      </td>
                      <td className="p-3 text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setPayStudentId(l.student.id);
                            setPayAmount(String(Math.max(0, l.balance)));
                            setPaymentModalOpen(true);
                          }}
                        >
                          Receive MoMo
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: Fee Schedules */}
      {activeTab === 'schedules' && (
        <Card>
          <CardHeader
            title="Accredited Term 2 Fee Schedule"
            subtitle="Ghana Education Service standard billable breakdown for Basic 4A and Primary Wing"
          />
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F5F4] text-[#666666] font-semibold border-b border-[#E7E2D9]">
                <tr>
                  <th className="p-3">Fee Item / Category</th>
                  <th className="p-3">Applicable Level</th>
                  <th className="p-3">Due Date</th>
                  <th className="p-3 text-right">Scheduled Amount (GH₵)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {feeSchedules.map((fs) => (
                  <tr key={fs.id} className="hover:bg-stone-50">
                    <td className="p-3 font-bold text-[#171717]">{fs.category}</td>
                    <td className="p-3 font-semibold text-[#B26A00]">Basic 4 & Primary</td>
                    <td className="p-3 text-[#666666]">{fs.dueDate}</td>
                    <td className="p-3 text-right font-extrabold text-sm text-[#171717]">
                      GH₵ {fs.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-[#FFF8ED]/80 font-bold text-xs">
                  <td colSpan={3} className="p-3 text-right text-[#171717]">
                    Total Term 2 Composite Bill per Pupil:
                  </td>
                  <td className="p-3 text-right text-base text-[#B26A00]">
                    GH₵ 2,850.00
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>
      )}

      {/* TAB 3: Expenses Register */}
      {activeTab === 'expenses' && (
        <Card>
          <CardHeader
            title="School Operational Expense Register"
            subtitle="Disbursements, vendor vouchers, and proprietor approval status"
            action={
              <Button
                variant="primary"
                size="sm"
                onClick={() => setExpenseModalOpen(true)}
                icon={<Plus className="w-3.5 h-3.5" />}
              >
                Log New Expense
              </Button>
            }
          />
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F5F4] text-[#666666] font-semibold border-b border-[#E7E2D9]">
                <tr>
                  <th className="p-3">Expense ID</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Vendor / Payee</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right">Amount (GH₵)</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-center">Authorization</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-stone-50">
                    <td className="p-3 font-mono font-bold text-[#B26A00]">{exp.expenseNumber}</td>
                    <td className="p-3 font-bold text-[#171717]">
                      {exp.title}
                      <span className="text-[10px] text-[#666666] block font-normal">Ref: {exp.referenceNo}</span>
                    </td>
                    <td className="p-3">
                      <Badge variant="primary" size="sm">{exp.category}</Badge>
                    </td>
                    <td className="p-3 text-[#666666] font-medium">{exp.vendor}</td>
                    <td className="p-3 text-[#666666]">{exp.date}</td>
                    <td className="p-3 text-right font-bold text-sm text-[#171717]">
                      GH₵ {exp.amount.toLocaleString()}
                    </td>
                    <td className="p-3 text-center">
                      <Badge
                        variant={
                          exp.approvalStatus === 'approved'
                            ? 'success'
                            : exp.approvalStatus === 'rejected'
                            ? 'danger'
                            : 'warning'
                        }
                        size="sm"
                      >
                        {exp.approvalStatus.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
                      {canApprove && exp.approvalStatus === 'pending' ? (
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => {
                              const r = window.prompt('Reason for rejecting:');
                              if (r) rejectExpense(exp.id, r);
                            }}
                          >
                            Reject
                          </Button>
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => approveExpense(exp.id)}
                          >
                            Approve
                          </Button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-[#666666]">
                          {exp.approvedBy ? `By ${exp.approvedBy}` : '—'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TAB 4: Transaction Receipts Log */}
      {activeTab === 'transactions' && (
        <Card>
          <CardHeader
            title="Fee Payment Transactions & Verified Receipts"
            subtitle="Click 'Print' on any transaction to generate the official computer receipt"
          />
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F5F4] text-[#666666] font-semibold border-b border-[#E7E2D9]">
                <tr>
                  <th className="p-3">Receipt No</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Payment Date</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">MoMo / Bank Ref</th>
                  <th className="p-3 text-right">Amount (GH₵)</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {feePayments.map((p) => {
                  const st = students.find((s) => s.id === p.studentId);
                  return (
                    <tr key={p.id} className="hover:bg-stone-50">
                      <td className="p-3 font-mono font-bold text-[#B26A00]">{p.receiptNumber}</td>
                      <td className="p-3 font-semibold text-[#171717]">
                        {st ? `${st.firstName} ${st.lastName}` : p.studentId}
                      </td>
                      <td className="p-3 text-[#666666]">{p.paymentDate}</td>
                      <td className="p-3 text-[#171717]">{p.paymentMethod}</td>
                      <td className="p-3 font-mono text-[#666666]">{p.transactionRef}</td>
                      <td className="p-3 text-right font-extrabold text-[#171717]">
                        GH₵ {p.amountPaid.toLocaleString()}
                      </td>
                      <td className="p-3 text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<Printer className="w-3.5 h-3.5" />}
                          onClick={() => setSelectedReceipt(p)}
                        >
                          Print Official Receipt
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Record Fee Payment Modal */}
      <Modal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        title="Record Fee Payment"
        subtitle="Post cash, bank, or Mobile Money receipt"
        maxWidth="lg"
      >
        <form onSubmit={handleRecordPaymentSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#171717] mb-1">
              Select Student <span className="text-red-500">*</span>
            </label>
            <select
              value={payStudentId}
              onChange={(e) => setPayStudentId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#E7E2D9] font-bold bg-white"
            >
              {students.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.firstName} {st.lastName} ({st.admissionNumber})
                </option>
              ))}
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
                className="w-full p-2.5 rounded-xl border border-[#E7E2D9] font-bold text-sm"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#171717] mb-1">Method</label>
              <select
                value={payMethod}
                onChange={(e) => setPayMethod(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-[#E7E2D9] bg-white font-medium"
              >
                <option value="Mobile Money">Mobile Money (MTN/Telecel)</option>
                <option value="Bank Transfer">Bank Transfer (GCB/Ecobank)</option>
                <option value="Cash">Cash (Bursar)</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#171717] mb-1">
              Transaction Reference / MoMo Approval Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={payRef}
              onChange={(e) => setPayRef(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#E7E2D9] font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#171717] mb-1">Notes</label>
            <input
              type="text"
              value={payNotes}
              onChange={(e) => setPayNotes(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#E7E2D9]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#E7E2D9]">
            <Button variant="ghost" type="button" onClick={() => setPaymentModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Post Payment & View Receipt
            </Button>
          </div>
        </form>
      </Modal>

      {/* Apply Discount / Fee Adjustment Modal */}
      <Modal
        isOpen={adjustmentModalOpen}
        onClose={() => setAdjustmentModalOpen(false)}
        title="Apply Fee Discount / Approved Adjustment"
        subtitle="Reduce or waive fees with recorded justification"
        maxWidth="md"
      >
        <form onSubmit={handleRecordAdjustmentSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#171717] mb-1">Pupil</label>
            <select
              value={adjStudentId}
              onChange={(e) => setAdjStudentId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#E7E2D9] font-bold bg-white"
            >
              {students.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.firstName} {st.lastName} ({st.admissionNumber})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#171717] mb-1">
                Discount Amount (GH₵) *
              </label>
              <input
                type="number"
                required
                value={adjAmount}
                onChange={(e) => setAdjAmount(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E7E2D9] font-bold"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#171717] mb-1">Type</label>
              <select
                value={adjType}
                onChange={(e) => setAdjType(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-[#E7E2D9] bg-white"
              >
                <option value="discount">PTA / Sibling Discount</option>
                <option value="scholarship">Academic Scholarship</option>
                <option value="waiver">Welfare Board Waiver</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#171717] mb-1">
              Recorded Approval Reason *
            </label>
            <textarea
              required
              rows={2}
              value={adjReason}
              onChange={(e) => setAdjReason(e.target.value)}
              className="w-full p-2 rounded-xl border border-[#E7E2D9]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#E7E2D9]">
            <Button variant="ghost" type="button" onClick={() => setAdjustmentModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Apply Fee Deduction
            </Button>
          </div>
        </form>
      </Modal>

      {/* Log Expense Modal */}
      <Modal
        isOpen={expenseModalOpen}
        onClose={() => setExpenseModalOpen(false)}
        title="Record School Expense"
        maxWidth="lg"
      >
        <form onSubmit={handleRecordExpenseSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#171717] mb-1">Title *</label>
            <input
              type="text"
              required
              value={expTitle}
              onChange={(e) => setExpTitle(e.target.value)}
              placeholder="e.g. Science Lab Consumables"
              className="w-full p-2.5 rounded-xl border border-[#E7E2D9]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#171717] mb-1">Amount (GH₵) *</label>
              <input
                type="number"
                required
                value={expAmount}
                onChange={(e) => setExpAmount(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E7E2D9] font-bold"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#171717] mb-1">Category</label>
              <select
                value={expCategory}
                onChange={(e) => setExpCategory(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-[#E7E2D9] bg-white"
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
              <label className="block font-semibold text-[#171717] mb-1">Vendor *</label>
              <input
                type="text"
                required
                value={expVendor}
                onChange={(e) => setExpVendor(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E7E2D9]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#171717] mb-1">Method</label>
              <select
                value={expMethod}
                onChange={(e) => setExpMethod(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-[#E7E2D9] bg-white"
              >
                <option value="Mobile Money">Mobile Money</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-[#E7E2D9]">
            <Button variant="ghost" type="button" onClick={() => setExpenseModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Expense
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
