import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { ReceiptModal } from '../common/ReceiptModal';
import {
  User,
  Calendar,
  BookOpen,
  DollarSign,
  Clock,
  Award,
  Users,
  FileCheck,
  Receipt,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FeePayment } from '../../types';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string | null;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  studentId
}) => {
  const {
    students,
    classes,
    guardians,
    classPlacements,
    attendanceRecords,
    resultSubmissions,
    reportCards,
    getStudentFinancialSummary,
    currentUser,
    academicYears
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'guardian' | 'placements' | 'attendance' | 'results' | 'reports' | 'finances'
  >('overview');
  const [selectedReceipt, setSelectedReceipt] = useState<FeePayment | null>(null);

  if (!studentId) return null;

  const student = students.find((s) => s.id === studentId);
  if (!student) return null;

  const currentClass = classes.find((c) => c.id === student.currentClassId);
  const guardian = guardians.find((g) => g.id === student.guardianId);
  const placements = classPlacements.filter((cp) => cp.studentId === student.id);
  const finSummary = getStudentFinancialSummary(student.id);

  // Filter attendance entries for this student
  const studentAttendance = attendanceRecords.flatMap((rec) => {
    const entry = rec.entries.find((e) => e.studentId === student.id);
    if (!entry) return [];
    return [{ date: rec.date, status: entry.status, remarks: entry.remarks, submittedStatus: rec.status }];
  });

  // Filter academic marks for this student
  const studentResults = resultSubmissions.flatMap((sub) => {
    const mark = sub.marks.find((m) => m.studentId === student.id);
    if (!mark) return [];
    return [{
      subjectId: sub.subjectId,
      classId: sub.classId,
      status: sub.status,
      ...mark
    }];
  });

  const studentReports = reportCards.filter((r) => r.studentId === student.id);

  const isFinancialRole = ['owner', 'accountant', 'admin'].includes(currentUser.role);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FFA51F]/20 text-[#B26A00] flex items-center justify-center font-bold text-base">
              {student.photoUrl ? (
                <img
                  src={student.photoUrl}
                  alt={student.firstName}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                `${student.firstName[0]}${student.lastName[0]}`
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span>{student.firstName} {student.lastName}</span>
                <Badge variant={student.status === 'active' ? 'success' : 'neutral'} size="sm">
                  {student.status.toUpperCase()}
                </Badge>
              </div>
              <p className="text-xs text-[#666666] font-normal font-mono">
                Admission No: {student.admissionNumber} • {currentClass?.name || 'Class Unassigned'}
              </p>
            </div>
          </div>
        }
        maxWidth="4xl"
      >
        {/* Navigation Tabs */}
        <div className="flex border-b border-[#E7E2D9] mb-5 overflow-x-auto gap-1 text-xs">
          {[
            { id: 'overview', label: 'Overview', icon: <User className="w-3.5 h-3.5" /> },
            { id: 'guardian', label: 'Guardian Information', icon: <Users className="w-3.5 h-3.5" /> },
            { id: 'placements', label: 'Class History', icon: <BookOpen className="w-3.5 h-3.5" /> },
            { id: 'attendance', label: 'Attendance', icon: <Clock className="w-3.5 h-3.5" /> },
            { id: 'results', label: 'Academic Results', icon: <Award className="w-3.5 h-3.5" /> },
            { id: 'reports', label: 'Report Cards', icon: <FileCheck className="w-3.5 h-3.5" /> },
            ...(isFinancialRole
              ? [{ id: 'finances', label: 'Fee Ledger', icon: <DollarSign className="w-3.5 h-3.5" /> }]
              : [])
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 font-semibold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-[#FFA51F] text-[#B26A00] bg-[#FFF8ED]/50'
                  : 'border-transparent text-[#666666] hover:text-[#171717] hover:border-stone-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div className="bg-[#F5F5F4] p-4 rounded-xl space-y-3">
              <h4 className="font-bold text-sm text-[#171717] border-b border-stone-200 pb-2">
                Personal Demographics
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[#666666] block">Date of Birth:</span>
                  <span className="font-semibold text-[#171717]">{student.dateOfBirth}</span>
                </div>
                <div>
                  <span className="text-[#666666] block">Gender:</span>
                  <span className="font-semibold text-[#171717]">{student.gender}</span>
                </div>
                <div>
                  <span className="text-[#666666] block">Date of Admission:</span>
                  <span className="font-semibold text-[#171717]">{student.admissionDate}</span>
                </div>
                <div>
                  <span className="text-[#666666] block">Enrolled Class:</span>
                  <span className="font-semibold text-[#B26A00]">{currentClass?.name}</span>
                </div>
              </div>
              <div>
                <span className="text-[#666666] block">Residential Address:</span>
                <span className="font-semibold text-[#171717]">{student.address}</span>
              </div>
              <div>
                <span className="text-[#666666] block">Emergency Contact:</span>
                <span className="font-semibold text-rose-700">{student.emergencyContact}</span>
              </div>
            </div>

            <div className="bg-[#FFF8ED]/60 border border-[#FFA51F]/20 p-4 rounded-xl space-y-3">
              <h4 className="font-bold text-sm text-[#171717] border-b border-[#FFA51F]/20 pb-2">
                Academic & Status Summary
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-1 border-b border-stone-100">
                  <span className="text-[#666666]">Current Academic Level:</span>
                  <Badge variant="primary">{currentClass?.level}</Badge>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-stone-100">
                  <span className="text-[#666666]">Classroom:</span>
                  <span className="font-semibold text-[#171717]">{currentClass?.room || 'Main Block'}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-stone-100">
                  <span className="text-[#666666]">Attendance Rate (Term 2):</span>
                  <span className="font-bold text-emerald-600">
                    {studentAttendance.length > 0
                      ? `${Math.round(
                          (studentAttendance.filter((a) => a.status === 'present').length /
                            studentAttendance.length) *
                            100
                        )}%`
                      : '96.2%'}
                  </span>
                </div>
                {isFinancialRole && (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-[#666666]">Fee Payment Standing:</span>
                    <Badge variant={finSummary.balance <= 0 ? 'success' : 'danger'}>
                      {finSummary.balance <= 0 ? 'Fully Paid' : `GH₵${finSummary.balance.toLocaleString()} Arrears`}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Guardian Information */}
        {activeTab === 'guardian' && (
          <div className="space-y-4 text-xs">
            {guardian ? (
              <div className="p-5 border border-[#E7E2D9] rounded-xl bg-white space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-base font-bold text-[#171717]">{guardian.name}</h4>
                    <p className="text-xs text-[#B26A00] font-semibold">{guardian.relationship}</p>
                  </div>
                  <Badge variant="info">Primary Contact</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-stone-100">
                  <div>
                    <span className="text-[#666666] block">Phone Number:</span>
                    <a href={`tel:${guardian.phone}`} className="font-bold text-[#171717] hover:underline">
                      {guardian.phone}
                    </a>
                  </div>
                  <div>
                    <span className="text-[#666666] block">Email Address:</span>
                    <a href={`mailto:${guardian.email}`} className="font-semibold text-blue-600 hover:underline">
                      {guardian.email}
                    </a>
                  </div>
                  <div>
                    <span className="text-[#666666] block">Occupation / Organization:</span>
                    <span className="font-semibold text-[#171717]">{guardian.occupation}</span>
                  </div>
                  <div>
                    <span className="text-[#666666] block">Residence:</span>
                    <span className="font-semibold text-[#171717]">{guardian.address}</span>
                  </div>
                </div>

                {/* Linked Siblings / Multi-child Demonstration */}
                <div className="mt-4 pt-4 border-t border-stone-100">
                  <p className="font-bold text-[#171717] mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#FFA51F]" />
                    Other Wards Enrolled at School ({guardian.studentIds.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {guardian.studentIds.map((sid) => {
                      const linkedSt = students.find((s) => s.id === sid);
                      if (!linkedSt) return null;
                      const lClass = classes.find((c) => c.id === linkedSt.currentClassId);
                      return (
                        <div
                          key={sid}
                          className={`p-2.5 rounded-lg border text-xs flex items-center gap-2 ${
                            sid === student.id ? 'bg-[#FFF8ED] border-[#FFA51F]' : 'bg-[#F5F5F4] border-[#E7E2D9]'
                          }`}
                        >
                          <span className="font-bold text-[#171717]">
                            {linkedSt.firstName} {linkedSt.lastName}
                          </span>
                          <span className="text-[#666666]">({lClass?.name || 'Class'})</span>
                          {sid === student.id && <Badge variant="primary" size="sm">Current</Badge>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-[#666666]">No guardian currently assigned.</div>
            )}
          </div>
        )}

        {/* Tab 3: Class Placements History */}
        {activeTab === 'placements' && (
          <div className="space-y-3 text-xs">
            <p className="text-xs text-[#666666]">
              Permanent student identity tracking class placements and promotions across academic sessions.
            </p>
            <div className="border border-[#E7E2D9] rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-[#F5F5F4] text-[#666666] font-semibold border-b border-[#E7E2D9]">
                  <tr>
                    <th className="p-3">Academic Year</th>
                    <th className="p-3">Class</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Promotion Date</th>
                    <th className="p-3">Previous Class</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {placements.length > 0 ? (
                    placements.map((p) => {
                      const c = classes.find((cl) => cl.id === p.classId);
                      const prevC = classes.find((cl) => cl.id === p.previousClassId);
                      const ay = academicYears.find((y) => y.id === p.academicYearId);
                      return (
                        <tr key={p.id} className="hover:bg-stone-50">
                          <td className="p-3 font-semibold text-[#171717]">{ay?.name || p.academicYearId}</td>
                          <td className="p-3 font-bold text-[#B26A00]">{c?.name || p.classId}</td>
                          <td className="p-3">
                            <Badge variant={p.status === 'promoted' ? 'success' : 'primary'} size="sm">
                              {p.status.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="p-3 text-[#666666]">{p.promotedAt ? new Date(p.promotedAt).toLocaleDateString() : 'Initial Admission'}</td>
                          <td className="p-3 text-[#666666]">{prevC ? prevC.name : '—'}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-[#666666]">
                        Currently in {currentClass?.name} (2025/2026 Academic Year).
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Attendance History */}
        {activeTab === 'attendance' && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="block text-xl font-bold text-emerald-700">
                  {studentAttendance.filter((a) => a.status === 'present').length}
                </span>
                <span className="text-[11px] text-emerald-800 font-medium">Days Present</span>
              </div>
              <div className="p-3 rounded-xl bg-red-50 border border-red-200">
                <span className="block text-xl font-bold text-[#DC5252]">
                  {studentAttendance.filter((a) => a.status === 'absent').length}
                </span>
                <span className="text-[11px] text-red-800 font-medium">Days Absent</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                <span className="block text-xl font-bold text-amber-700">
                  {studentAttendance.filter((a) => a.status === 'late').length}
                </span>
                <span className="text-[11px] text-amber-800 font-medium">Late Marks</span>
              </div>
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                <span className="block text-xl font-bold text-blue-700">
                  {studentAttendance.filter((a) => a.status === 'excused').length}
                </span>
                <span className="text-[11px] text-blue-800 font-medium">Excused</span>
              </div>
            </div>

            <div className="border border-[#E7E2D9] rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-[#F5F5F4] text-[#666666] font-semibold border-b border-[#E7E2D9]">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Attendance Status</th>
                    <th className="p-3">Register Status</th>
                    <th className="p-3">Teacher Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {studentAttendance.length > 0 ? (
                    studentAttendance.map((att, i) => (
                      <tr key={i} className="hover:bg-stone-50">
                        <td className="p-3 font-medium text-[#171717]">{att.date}</td>
                        <td className="p-3">
                          <Badge
                            variant={
                              att.status === 'present'
                                ? 'success'
                                : att.status === 'absent'
                                ? 'danger'
                                : att.status === 'late'
                                ? 'warning'
                                : 'info'
                            }
                            size="sm"
                          >
                            {att.status.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="p-3 text-[#666666] capitalize">{att.submittedStatus}</td>
                        <td className="p-3 text-[#666666]">{att.remarks || '—'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-[#666666]">
                        No recorded attendance dates for this period.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Academic Results */}
        {activeTab === 'results' && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#171717]">Term 2 Continuous Assessment & Exam Marks</span>
              <span className="text-[11px] text-[#666666]">Ghana GES Basic Education Grading Scale (1–9)</span>
            </div>

            <div className="border border-[#E7E2D9] rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-[#F5F5F4] text-[#666666] font-semibold border-b border-[#E7E2D9]">
                  <tr>
                    <th className="p-3">Subject</th>
                    <th className="p-3 text-center">Class Score (30%)</th>
                    <th className="p-3 text-center">Exam Score (70%)</th>
                    <th className="p-3 text-center">Total (100%)</th>
                    <th className="p-3 text-center">GES Grade</th>
                    <th className="p-3">Moderation Remark</th>
                    <th className="p-3">Approval</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {studentResults.length > 0 ? (
                    studentResults.map((r, i) => (
                      <tr key={i} className="hover:bg-stone-50">
                        <td className="p-3 font-semibold text-[#171717]">
                          {r.subjectId === 'sub-mth-4a'
                            ? 'Mathematics'
                            : r.subjectId === 'sub-eng-4a'
                            ? 'English Language'
                            : r.subjectId === 'sub-sci-5'
                            ? 'Integrated Science'
                            : r.subjectId}
                        </td>
                        <td className="p-3 text-center font-mono font-medium">{r.classScore} / 30</td>
                        <td className="p-3 text-center font-mono font-medium">{r.examScore} / 70</td>
                        <td className="p-3 text-center font-mono font-bold text-[#B26A00]">{r.totalScore}%</td>
                        <td className="p-3 text-center">
                          <span className="inline-block w-6 h-6 rounded-full bg-amber-100 text-[#B26A00] font-bold text-center leading-6">
                            {r.grade}
                          </span>
                        </td>
                        <td className="p-3 text-[#666666] italic">{r.remark}</td>
                        <td className="p-3">
                          <Badge
                            variant={
                              r.status === 'approved' || r.status === 'published'
                                ? 'success'
                                : r.status === 'rejected'
                                ? 'danger'
                                : 'warning'
                            }
                            size="sm"
                          >
                            {r.status.toUpperCase()}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-4 text-center text-[#666666]">
                        No assessment marks entered yet for this student.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 6: Report Cards */}
        {activeTab === 'reports' && (
          <div className="space-y-4 text-xs">
            {studentReports.length > 0 ? (
              studentReports.map((rep) => (
                <div key={rep.id} className="p-5 border border-[#E7E2D9] rounded-xl bg-white space-y-4 shadow-xs">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <div>
                      <h4 className="font-bold text-sm text-[#171717]">Term 1 Official Terminal Report Card</h4>
                      <p className="text-xs text-[#666666]">2025/2026 Academic Year • Basic 4A</p>
                    </div>
                    <Badge variant="success">PUBLISHED</Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-3 bg-[#FFF8ED] p-3 rounded-lg text-center">
                    <div>
                      <span className="text-[#666666] block">Overall Score</span>
                      <span className="text-lg font-bold text-[#B26A00]">{rep.overallScore}%</span>
                    </div>
                    <div>
                      <span className="text-[#666666] block">Class Position</span>
                      <span className="text-lg font-bold text-[#171717]">{rep.position}</span>
                    </div>
                    <div>
                      <span className="text-[#666666] block">Attendance</span>
                      <span className="text-lg font-bold text-emerald-700">
                        {rep.attendancePresent} / {rep.attendanceTotal} days
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="p-3 bg-stone-50 rounded-lg">
                      <span className="font-bold text-[#171717] block mb-1">Class Teacher Remark:</span>
                      <p className="italic text-[#666666]">{rep.classTeacherRemark}</p>
                    </div>
                    <div className="p-3 bg-stone-50 rounded-lg">
                      <span className="font-bold text-[#171717] block mb-1">Headteacher Remark:</span>
                      <p className="italic text-[#666666]">{rep.headteacherRemark}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-[#666666] border border-dashed border-[#E7E2D9] rounded-xl">
                <FileCheck className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                <p>Term 2 report cards are awaiting final examination completion and Headteacher sign-off.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 7: Fee Ledger (Financial Roles Only) */}
        {activeTab === 'finances' && isFinancialRole && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-stone-50 border border-[#E7E2D9]">
                <span className="text-[#666666] block">Billed Term Fees:</span>
                <span className="text-base font-bold text-[#171717]">
                  GH₵ {finSummary.totalBilled.toLocaleString()}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-[#E7E2D9]">
                <span className="text-[#666666] block">Adjustments/Discounts:</span>
                <span className="text-base font-bold text-emerald-700">
                  {(finSummary.totalAdjustments ?? 0) !== 0 ? `GH₵ ${(finSummary.totalAdjustments ?? 0).toLocaleString()}` : 'GH₵ 0.00'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-emerald-800 block">Total Payments Received:</span>
                <span className="text-base font-bold text-emerald-700">
                  GH₵ {finSummary.totalPaid.toLocaleString()}
                </span>
              </div>
              <div
                className={`p-3 rounded-xl border ${
                  finSummary.balance <= 0
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-red-50 border-red-200 text-[#DC5252]'
                }`}
              >
                <span className="block font-medium">Outstanding Balance:</span>
                <span className="text-base font-extrabold">
                  {finSummary.balance <= 0 ? 'GH₵ 0.00 (Cleared)' : `GH₵ ${finSummary.balance.toLocaleString()}`}
                </span>
              </div>
            </div>

            {/* Payments List */}
            <div>
              <h4 className="font-bold text-sm text-[#171717] mb-2 flex items-center justify-between">
                <span>Recorded Payment Transactions</span>
              </h4>
              <div className="border border-[#E7E2D9] rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-[#F5F5F4] text-[#666666] font-semibold border-b border-[#E7E2D9]">
                    <tr>
                      <th className="p-3">Receipt No</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Method</th>
                      <th className="p-3">Reference</th>
                      <th className="p-3 text-right">Amount (GH₵)</th>
                      <th className="p-3 text-center">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {(finSummary.payments || []).length > 0 ? (
                      (finSummary.payments || []).map((pay) => (
                        <tr key={pay.id} className="hover:bg-stone-50">
                          <td className="p-3 font-bold text-[#B26A00]">{pay.receiptNumber}</td>
                          <td className="p-3 text-[#666666]">{pay.paymentDate}</td>
                          <td className="p-3 text-[#171717] font-medium">{pay.paymentMethod}</td>
                          <td className="p-3 text-[#666666] font-mono">{pay.transactionRef}</td>
                          <td className="p-3 text-right font-bold text-[#171717]">
                            GH₵ {pay.amountPaid.toLocaleString()}
                          </td>
                          <td className="p-3 text-center">
                            <Button
                              variant="outline"
                              size="sm"
                              icon={<Receipt className="w-3 h-3" />}
                              onClick={() => setSelectedReceipt(pay)}
                            >
                              View Receipt
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-4 text-center text-[#666666]">
                          No payments recorded for this student yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-[#E7E2D9] flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Close Profile
          </Button>
        </div>
      </Modal>

      {/* Embedded Receipt Modal */}
      <ReceiptModal
        isOpen={Boolean(selectedReceipt)}
        onClose={() => setSelectedReceipt(null)}
        payment={selectedReceipt}
      />
    </>
  );
};
