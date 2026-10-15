import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import {
  FileBarChart,
  Printer,
  Download,
  Calendar,
  Filter,
  DollarSign,
  Users,
  CheckCircle2,
  AlertTriangle,
  Receipt
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const {
    school,
    students,
    classes,
    feePayments,
    expenses,
    financialActivities,
    getStudentFinancialSummary
  } = useApp();

  const [reportType, setReportType] = useState<
    'collection' | 'arrears' | 'income_expense' | 'enrollment'
  >('collection');

  const [selectedTerm, setSelectedTerm] = useState('Term 2 (2025/2026)');

  const totalCollected = feePayments.reduce((acc, p) => acc + p.amountPaid, 0);
  const totalBilled = 31350;
  const totalOutstanding = Math.max(0, totalBilled - totalCollected);
  const totalExpenses = expenses
    .filter((e) => e.approvalStatus === 'approved')
    .reduce((acc, e) => acc + e.amount, 0);

  // Arrears list
  const debtorList = students
    .map((st) => {
      const summary = getStudentFinancialSummary(st.id);
      const cls = classes.find((c) => c.id === st.currentClassId);
      return { student: st, classObj: cls, ...summary };
    })
    .filter((l) => l.balance > 0);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let headers = '';
    let rows = '';

    if (reportType === 'collection') {
      headers = 'ReceiptNo,StudentName,Date,Method,Amount(GHC),Reference\n';
      rows = feePayments
        .map((p) => {
          const st = students.find((s) => s.id === p.studentId);
          return `"${p.receiptNumber}","${st?.firstName} ${st?.lastName}","${p.paymentDate}","${p.paymentMethod}",${p.amountPaid},"${p.transactionRef}"`;
        })
        .join('\n');
    } else if (reportType === 'arrears') {
      headers = 'AdmissionNo,StudentName,Class,Billed(GHC),Paid(GHC),OutstandingArrears(GHC)\n';
      rows = debtorList
        .map(
          (d) =>
            `"${d.student.admissionNumber}","${d.student.firstName} ${d.student.lastName}","${d.classObj?.name}",${d.totalBilled},${d.totalPaid},${d.balance}`
        )
        .join('\n');
    } else {
      headers = 'Section,Amount(GHC)\n';
      rows = `Total Fee Collections,${totalCollected}\nTotal Approved Expenses,${totalExpenses}\nNet Operating Surplus,${totalCollected - totalExpenses}`;
    }

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Heritage_Crown_Report_${reportType}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Non-print controls */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E7E2D9] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#FFA51F]/20 text-[#B26A00]">
              Official Academic & Financial Reporting
            </span>
            <span className="text-xs text-[#666666]">Print-Ready Formats</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-[#171717] mt-1">
            School Reports & Summaries
          </h1>
          <p className="text-xs text-[#666666]">
            Audited financial reconciliations, arrears schedules, and enrollment metrics for proprietors and boards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Export CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handlePrint}
            icon={<Printer className="w-3.5 h-3.5" />}
          >
            Print Official Report
          </Button>
        </div>
      </div>

      {/* Report Switcher Tabs (Non-print) */}
      <div className="no-print flex border-b border-[#E7E2D9] gap-2 overflow-x-auto text-xs font-bold">
        {[
          { id: 'collection', label: 'Term Fee Collections Report', icon: <Receipt className="w-4 h-4" /> },
          { id: 'arrears', label: 'Outstanding Arrears & Debtors', icon: <AlertTriangle className="w-4 h-4" /> },
          { id: 'income_expense', label: 'Income & Expenditure Statement', icon: <DollarSign className="w-4 h-4" /> },
          { id: 'enrollment', label: 'Class Enrollment Distribution', icon: <Users className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setReportType(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              reportType === tab.id
                ? 'border-[#FFA51F] text-[#B26A00] bg-white rounded-t-xl font-bold'
                : 'border-transparent text-[#666666] hover:text-[#171717]'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Printable Report Document Container */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E7E2D9] shadow-sm printable-area space-y-6">
        {/* Official Letterhead */}
        <div className="border-b-2 border-[#171717] pb-4 text-center">
          <h2 className="text-2xl font-extrabold uppercase tracking-wide text-[#171717]">
            {school.name}
          </h2>
          <p className="text-xs text-[#666666] italic font-serif mt-0.5">{school.motto}</p>
          <p className="text-xs text-[#666666] mt-1">{school.address} • Tel: {school.phone}</p>
          <div className="mt-2 inline-block px-3 py-0.5 bg-[#FFF8ED] border border-[#E7E2D9] rounded-full text-xs font-semibold text-[#B26A00]">
            GES Registration: {school.gesRegistrationNo} • Currency: Ghana Cedi (GH₵)
          </div>
        </div>

        {/* Report Metadata Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#F5F5F4] p-4 rounded-xl text-xs gap-2">
          <div>
            <span className="text-[#666666] block">Document Title:</span>
            <span className="font-bold text-sm text-[#171717] uppercase">
              {reportType === 'collection'
                ? 'Term Fee Collection Summary'
                : reportType === 'arrears'
                ? 'Outstanding Fee Arrears & Defaulters Schedule'
                : reportType === 'income_expense'
                ? 'Income & Expenditure Operating Statement'
                : 'Pupil Enrollment by Academic Stream'}
            </span>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-[#666666] block">Session & Generation Date:</span>
            <span className="font-semibold text-[#171717]">
              {selectedTerm} • Generated {new Date().toLocaleDateString('en-GB')}
            </span>
          </div>
        </div>

        {/* REPORT 1: Collections */}
        {reportType === 'collection' && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-3 gap-3 bg-[#FFF8ED] p-3 rounded-xl text-center">
              <div>
                <span className="text-[#666666] block">Total Inflow Collections:</span>
                <span className="text-base font-extrabold text-emerald-700">
                  GH₵ {totalCollected.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[#666666] block">Transactions Recorded:</span>
                <span className="text-base font-bold text-[#171717]">{feePayments.length}</span>
              </div>
              <div>
                <span className="text-[#666666] block">Average Collection / Pupil:</span>
                <span className="text-base font-bold text-[#B26A00]">
                  GH₵ {Math.round(totalCollected / feePayments.length).toLocaleString()}
                </span>
              </div>
            </div>

            <table className="w-full text-left">
              <thead className="bg-[#F5F5F4] text-[#666666] font-semibold border-b border-[#E7E2D9]">
                <tr>
                  <th className="p-3">Receipt No</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Payment Channel</th>
                  <th className="p-3">Reference Code</th>
                  <th className="p-3 text-right">Amount (GH₵)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {feePayments.map((p) => {
                  const st = students.find((s) => s.id === p.studentId);
                  return (
                    <tr key={p.id}>
                      <td className="p-3 font-mono font-bold text-[#B26A00]">{p.receiptNumber}</td>
                      <td className="p-3 font-bold text-[#171717]">
                        {st ? `${st.firstName} ${st.lastName}` : p.studentId}
                      </td>
                      <td className="p-3 text-[#666666]">{p.paymentDate}</td>
                      <td className="p-3">{p.paymentMethod}</td>
                      <td className="p-3 font-mono text-[#666666]">{p.transactionRef}</td>
                      <td className="p-3 text-right font-extrabold text-[#171717]">
                        GH₵ {p.amountPaid.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-[#171717] font-bold">
                  <td colSpan={5} className="p-3 text-right">Cumulative Total Collections:</td>
                  <td className="p-3 text-right text-base text-emerald-700">
                    GH₵ {totalCollected.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {/* REPORT 2: Arrears & Defaulters */}
        {reportType === 'arrears' && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 bg-red-50 p-3 rounded-xl border border-red-200 text-center">
              <div>
                <span className="text-[#DC5252] block font-medium">Total Outstanding Arrears:</span>
                <span className="text-xl font-extrabold text-[#DC5252]">
                  GH₵ {totalOutstanding.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[#DC5252] block font-medium">Pupils with Arrears:</span>
                <span className="text-xl font-extrabold text-[#DC5252]">{debtorList.length} Pupils</span>
              </div>
            </div>

            <table className="w-full text-left">
              <thead className="bg-[#F5F5F4] text-[#666666] font-semibold border-b border-[#E7E2D9]">
                <tr>
                  <th className="p-3">Admission No</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Class</th>
                  <th className="p-3 text-right">Billed (GH₵)</th>
                  <th className="p-3 text-right">Paid (GH₵)</th>
                  <th className="p-3 text-right">Balance Due (GH₵)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {debtorList.map((d) => (
                  <tr key={d.student.id}>
                    <td className="p-3 font-mono font-bold text-[#B26A00]">{d.student.admissionNumber}</td>
                    <td className="p-3 font-bold text-[#171717]">
                      {d.student.firstName} {d.student.lastName}
                    </td>
                    <td className="p-3">{d.classObj?.name}</td>
                    <td className="p-3 text-right font-mono">GH₵ {d.totalBilled.toLocaleString()}</td>
                    <td className="p-3 text-right font-mono text-emerald-700">GH₵ {d.totalPaid.toLocaleString()}</td>
                    <td className="p-3 text-right font-mono font-extrabold text-sm text-[#DC5252]">
                      GH₵ {d.balance.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* REPORT 3: Income & Expenditure Statement */}
        {reportType === 'income_expense' && (
          <div className="space-y-6 text-xs">
            <div className="grid grid-cols-3 gap-3 bg-[#F5F5F4] p-4 rounded-xl text-center">
              <div>
                <span className="text-[#666666] block">A. Operating Inflows:</span>
                <span className="text-base font-extrabold text-emerald-700">
                  GH₵ {totalCollected.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[#666666] block">B. Operating Expenses:</span>
                <span className="text-base font-extrabold text-[#171717]">
                  GH₵ {totalExpenses.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[#666666] block">C. Net Operating Balance:</span>
                <span className="text-base font-extrabold text-[#B26A00]">
                  GH₵ {(totalCollected - totalExpenses).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="border border-[#E7E2D9] rounded-xl p-4 space-y-3">
              <h4 className="font-bold text-sm text-[#171717] border-b border-stone-200 pb-2">
                Expenditure Categorization Breakdown
              </h4>
              <div className="space-y-2">
                {[
                  { cat: 'Staff Welfare & Support Allowances', amount: 14500 },
                  { cat: 'Utilities, ECG Power & Internet', amount: 4800 },
                  { cat: 'Teaching & Lab Consumables', amount: 3850 },
                  { cat: 'School Bus Charter Transport', amount: 2800 },
                  { cat: 'Excursions & Catering Supplies', amount: 1850 }
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1 border-b border-stone-100">
                    <span className="text-[#171717]">{item.cat}</span>
                    <span className="font-mono font-bold text-[#171717]">
                      GH₵ {item.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* REPORT 4: Enrollment by Class */}
        {reportType === 'enrollment' && (
          <div className="space-y-4 text-xs">
            <table className="w-full text-left">
              <thead className="bg-[#F5F5F4] text-[#666666] font-semibold border-b border-[#E7E2D9]">
                <tr>
                  <th className="p-3">Classroom</th>
                  <th className="p-3">Stream</th>
                  <th className="p-3">Capacity</th>
                  <th className="p-3 text-right">Active Pupils</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {classes.map((cls) => {
                  const count = students.filter((s) => s.currentClassId === cls.id).length;
                  return (
                    <tr key={cls.id}>
                      <td className="p-3 font-bold text-[#171717]">{cls.name}</td>
                      <td className="p-3">{cls.level}</td>
                      <td className="p-3">{cls.capacity} desks</td>
                      <td className="p-3 text-right font-extrabold text-[#B26A00]">{count}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Signatures & Certification Footer */}
        <div className="pt-8 border-t border-dashed border-[#E7E2D9] flex justify-between items-end text-xs">
          <div>
            <p className="font-bold text-[#171717]">Prepared By:</p>
            <p className="text-[#666666]">Mr. Emmanuel Donkor, Senior Bursar</p>
            <p className="text-[10px] text-[#666666] mt-1">Official SchoolFlow Financial Ledger System</p>
          </div>
          <div className="text-center">
            <div className="w-40 border-b border-[#171717] mb-1"></div>
            <p className="font-bold text-[#171717]">Dr. Kwame Mensah</p>
            <p className="text-[#666666]">Proprietor / Board Chairman</p>
          </div>
        </div>
      </div>
    </div>
  );
};
