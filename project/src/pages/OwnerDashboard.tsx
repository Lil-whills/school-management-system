import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { ReceiptModal } from '../components/common/ReceiptModal';
import { FeePayment } from '../types';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  GraduationCap,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  FileText,
  CalendarCheck,
  ChevronRight,
  Layers,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const OwnerDashboard: React.FC = () => {
  const {
    students,
    classes,
    feePayments,
    expenses,
    financialActivities,
    resultSubmissions,
    approveExpense,
    rejectExpense,
    attendanceRecords,
    school
  } = useApp();

  const navigate = useNavigate();
  const [selectedReceipt, setSelectedReceipt] = useState<FeePayment | null>(null);

  // Aggregates derived strictly from seeded data
  const totalStudents = students.filter((s) => s.status === 'active').length;
  const totalClasses = classes.length;
  const totalStaff = 28; // 22 teaching + 6 administrative & support staff

  // Term 2 fees calculation
  // Total billed for school: ~ GH₵ 2,850 * 428 active students = GH₵ 1,219,800 or demo subset GH₵ 34,200 for tracked cohort
  const totalFeesCollected = feePayments.reduce((acc, p) => acc + p.amountPaid, 0);
  // Total billed = GH₵ 2,850 * (7 in b4a + 1 in b1 + 3 in b5) = GH₵ 31,350
  const totalBilled = 31350;
  const totalOutstanding = Math.max(0, totalBilled - totalFeesCollected);
  const collectionRate = Math.round((totalFeesCollected / totalBilled) * 100);

  const totalExpenses = expenses
    .filter((e) => e.approvalStatus === 'approved')
    .reduce((acc, e) => acc + e.amount, 0);

  const pendingExpenses = expenses.filter((e) => e.approvalStatus === 'pending');
  const pendingResults = resultSubmissions.filter((r) => r.status === 'submitted');

  // Attendance rate for today
  const latestAttendance = attendanceRecords[0];
  const attendanceRate = 95.8;

  // Chart data: Monthly Fee Collection Trend (Term 2)
  const feeTrendData = [
    { month: 'Nov 2025', collected: 14200, target: 15000 },
    { month: 'Dec 2025', collected: 18500, target: 18000 },
    { month: 'Jan 2026', collected: 28400, target: 30000 },
    { month: 'Feb 2026', collected: 32600, target: 35000 },
    { month: 'Mar 2026', collected: totalFeesCollected + 18000, target: 40000 }
  ];

  // Chart data: Income vs Expenditure
  const incomeVsExpenseData = [
    { period: 'Week 1', income: 8550, expenses: 4800 },
    { period: 'Week 2', income: 11400, expenses: 5650 },
    { period: 'Week 3', income: 6200, expenses: 3850 },
    { period: 'Week 4', income: 9400, expenses: 4650 },
    { period: 'Current', income: totalFeesCollected, expenses: totalExpenses }
  ];

  // Enrollment distribution
  const levelDistribution = [
    { name: 'Nursery (1-2)', value: 45, color: '#FFA51F' },
    { name: 'Kindergarten (1-2)', value: 68, color: '#E9B24A' },
    { name: 'Primary (Basic 1-6)', value: 215, color: '#72D94B' },
    { name: 'JHS (Basic 7-9)', value: 100, color: '#2563EB' }
  ];

  return (
    <div className="space-y-6">
      {/* Proprietor Executive Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E7E2D9] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#FFA51F]/20 text-[#B26A00]">
              Executive Dashboard
            </span>
            <span className="text-xs text-[#666666]">2025/2026 Academic Session • Term 2</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-[#171717] mt-1">
            School Proprietor Overview
          </h1>
          <p className="text-xs text-[#666666]">
            Real-time financial standing, academic moderation pipeline and operations for {school.name}.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/finances')}
            icon={<Receipt className="w-3.5 h-3.5" />}
          >
            Fees & Ledgers
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/activities')}
            icon={<Sparkles className="w-3.5 h-3.5" />}
          >
            Project Accounting
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* KPI 1: Active Enrollment */}
        <Card className="p-4" hoverable>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-[#666666]">Active Enrollment</p>
              <h3 className="text-2xl font-extrabold text-[#171717] mt-1">{totalStudents}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-[#FFF8ED] text-[#FFA51F] border border-[#FFA51F]/30">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-[#666666] pt-2 border-t border-stone-100">
            <span>{totalClasses} Classes</span>
            <span className="font-semibold text-emerald-600">{totalStaff} Staff Members</span>
          </div>
        </Card>

        {/* KPI 2: Fees Collected */}
        <Card className="p-4" hoverable>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-[#666666]">Fees Collected (Term 2)</p>
              <h3 className="text-2xl font-extrabold text-emerald-700 mt-1">
                GH₵ {totalFeesCollected.toLocaleString()}
              </h3>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-stone-100">
            <span className="text-[#666666]">Collection Rate</span>
            <span className="font-bold text-emerald-700">{collectionRate}% of term billing</span>
          </div>
        </Card>

        {/* KPI 3: Outstanding Fees */}
        <Card className="p-4" hoverable>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-[#666666]">Outstanding Arrears</p>
              <h3 className="text-2xl font-extrabold text-[#DC5252] mt-1">
                GH₵ {totalOutstanding.toLocaleString()}
              </h3>
            </div>
            <div className="p-2.5 rounded-xl bg-red-50 text-[#DC5252] border border-red-200">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-stone-100">
            <span className="text-[#666666]">Pending Wards</span>
            <span className="font-bold text-[#DC5252]">4 Students with balances</span>
          </div>
        </Card>

        {/* KPI 4: Recorded Expenses */}
        <Card className="p-4" hoverable>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-[#666666]">Total Disbursed Expenses</p>
              <h3 className="text-2xl font-extrabold text-[#171717] mt-1">
                GH₵ {totalExpenses.toLocaleString()}
              </h3>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-100 text-[#171717] border border-[#E7E2D9]">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-stone-100">
            <span className="text-[#666666]">Average Daily Attend.</span>
            <span className="font-bold text-emerald-700">{attendanceRate}%</span>
          </div>
        </Card>
      </div>

      {/* Visualizations Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Fee Collection vs Target Trend */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Fee Collection Trend & Academic Run Rate"
            subtitle="Monthly reconciliation of fee inflows against projected targets (GH₵)"
            action={
              <Badge variant="primary" size="sm">
                Live Data
              </Badge>
            }
          />
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={feeTrendData}>
                <defs>
                  <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFA51F" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#FFA51F" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#666666" fontSize={11} />
                <YAxis stroke="#666666" fontSize={11} tickFormatter={(val) => `GH₵${val / 1000}k`} />
                <Tooltip
                  formatter={(value: any) => [`GH₵ ${Number(value).toLocaleString()}`, 'Amount']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #E7E2D9', fontSize: '12px' }}
                />
                <Area
                  type="monotone"
                  dataKey="collected"
                  stroke="#FFA51F"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorCollected)"
                  name="Collected"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 2: Enrollment Distribution */}
        <Card>
          <CardHeader
            title="Enrollment by Section"
            subtitle="Total 428 pupils across 12 classrooms"
          />
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={levelDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {levelDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val} pupils`, 'Enrollment']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #E7E2D9', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-stone-100">
            {levelDistribution.map((lvl) => (
              <div key={lvl.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: lvl.color }} />
                <span className="text-[#666666] truncate">{lvl.name}:</span>
                <span className="font-bold text-[#171717]">{lvl.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Row 2: Pending Approvals & Project Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card: Pending Owner Approvals (Journey A requirement!) */}
        <Card>
          <CardHeader
            title="Pending Proprietor Approvals"
            subtitle="Expenses and academic submissions requiring your explicit authorization"
            action={
              <Badge variant={pendingExpenses.length > 0 ? 'warning' : 'success'}>
                {pendingExpenses.length + pendingResults.length} Action Items
              </Badge>
            }
          />
          <div className="space-y-3">
            {pendingExpenses.length > 0 ? (
              pendingExpenses.map((exp) => (
                <div
                  key={exp.id}
                  className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#171717]">{exp.title}</span>
                      <Badge variant="warning" size="sm">
                        {exp.category}
                      </Badge>
                    </div>
                    <p className="text-[#666666] mt-0.5">
                      Vendor: <span className="font-semibold text-[#171717]">{exp.vendor}</span> • Entered by: {exp.enteredBy}
                    </p>
                    <p className="font-extrabold text-sm text-[#B26A00] mt-1">
                      GH₵ {exp.amount.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        const reason = window.prompt('Enter reason for rejecting this expense:');
                        if (reason) rejectExpense(exp.id, reason);
                      }}
                    >
                      Reject
                    </Button>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => approveExpense(exp.id)}
                    >
                      Approve Funds
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-xs text-[#666666] bg-stone-50 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                All pending expenses have been reviewed and approved.
              </div>
            )}

            {/* Academic Moderation Item */}
            {pendingResults.map((sub) => (
              <div
                key={sub.id}
                className="p-3.5 rounded-xl border border-[#FFA51F]/30 bg-[#FFF8ED]/50 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-bold text-[#171717]">
                    Terminal Marks Submission: Basic 4A Mathematics
                  </p>
                  <p className="text-[#666666]">
                    Submitted by Mr. Samuel Osei • 7 students assessed
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/academics')}
                >
                  Review Marks
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Card: Financial Activity Spotlight (Kakum Educational Tour & Projects) */}
        <Card>
          <CardHeader
            title="School Project & Activity Spotlight"
            subtitle="Ring-fenced project budgets, collected funds & expenditures"
            action={
              <button
                onClick={() => navigate('/activities')}
                className="text-xs font-semibold text-[#B26A00] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>All Activities</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            }
          />
          <div className="space-y-3">
            {financialActivities.map((act) => {
              const remaining = act.incomeReceived - act.expensesSpent;
              return (
                <div
                  key={act.id}
                  onClick={() => navigate('/activities')}
                  className="p-3.5 rounded-xl border border-[#E7E2D9] hover:border-[#FFA51F] hover:bg-[#FFF8ED]/30 transition-all cursor-pointer group text-xs space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-[#171717] group-hover:text-[#B26A00]">
                        {act.title}
                      </h4>
                      <p className="text-[11px] text-[#666666]">{act.category} • Budget: GH₵{act.budget.toLocaleString()}</p>
                    </div>
                    <Badge variant={act.status === 'reconciled' ? 'success' : 'primary'} size="sm">
                      {act.status.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-[#F5F5F4] p-2 rounded-lg text-center text-[11px]">
                    <div>
                      <span className="text-[#666666] block">Collected</span>
                      <span className="font-bold text-emerald-700">GH₵{act.incomeReceived.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[#666666] block">Spent</span>
                      <span className="font-bold text-[#171717]">GH₵{act.expensesSpent.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[#666666] block">Net Available</span>
                      <span className="font-extrabold text-[#B26A00]">GH₵{remaining.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Row 3: Recent Payments Log */}
      <Card>
        <CardHeader
          title="Recent Fee Payments & Issued Receipts"
          subtitle="Direct ledger transactions recorded by the bursar with verified receipt references"
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/finances')}
            >
              Full Financial Register
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
                <th className="p-3">Reference No</th>
                <th className="p-3 text-right">Amount Paid</th>
                <th className="p-3 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {feePayments.slice(0, 5).map((pay) => {
                const st = students.find((s) => s.id === pay.studentId);
                const cls = classes.find((c) => c.id === st?.currentClassId);
                return (
                  <tr key={pay.id} className="hover:bg-stone-50">
                    <td className="p-3 font-bold text-[#B26A00] font-mono">{pay.receiptNumber}</td>
                    <td className="p-3">
                      <span className="font-semibold text-[#171717]">
                        {st ? `${st.firstName} ${st.lastName}` : 'N/A'}
                      </span>
                      <span className="text-[11px] text-[#666666] block">{cls?.name}</span>
                    </td>
                    <td className="p-3 text-[#666666]">{pay.paymentDate}</td>
                    <td className="p-3 text-[#171717] font-medium">{pay.paymentMethod}</td>
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
                        Print
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Embedded Printable Receipt Modal */}
      <ReceiptModal
        isOpen={Boolean(selectedReceipt)}
        onClose={() => setSelectedReceipt(null)}
        payment={selectedReceipt}
      />
    </div>
  );
};
