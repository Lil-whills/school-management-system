import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  HelpCircle,
  Save,
  Send,
  AlertCircle,
  Users,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { AttendanceStatus, AttendanceEntry } from '../types';

export const AttendancePage: React.FC = () => {
  const {
    students,
    classes,
    attendanceRecords,
    saveAttendance,
    currentUser
  } = useApp();

  const [selectedDate, setSelectedDate] = useState('2026-03-11');
  const [selectedClassId, setSelectedClassId] = useState<string>(() => {
    if (currentUser.role === 'teacher' && currentUser.assignedClassId) {
      return currentUser.assignedClassId;
    }
    return 'cls-b4a';
  });

  const [correctionModalOpen, setCorrectionModalOpen] = useState(false);
  const [correctionReason, setCorrectionReason] = useState('');

  // Class pupils
  const classStudents = students.filter((s) => s.currentClassId === selectedClassId);

  // Existing record for this class & date
  const existingRecord = attendanceRecords.find(
    (a) => a.classId === selectedClassId && a.date === selectedDate
  );

  // Local working entries state
  const [entries, setEntries] = useState<AttendanceEntry[]>(() => {
    if (existingRecord) {
      return existingRecord.entries;
    }
    return classStudents.map((s) => ({
      studentId: s.id,
      status: 'present' as AttendanceStatus
    }));
  });

  // Keep local entries in sync when date or class changes
  const handleDateOrClassChange = (newDate: string, newClassId: string) => {
    setSelectedDate(newDate);
    setSelectedClassId(newClassId);

    const match = attendanceRecords.find(
      (a) => a.classId === newClassId && a.date === newDate
    );
    const targetStudents = students.filter((s) => s.currentClassId === newClassId);

    if (match) {
      setEntries(match.entries);
    } else {
      setEntries(
        targetStudents.map((s) => ({
          studentId: s.id,
          status: 'present' as AttendanceStatus
        }))
      );
    }
  };

  const isSubmitted = existingRecord?.status === 'submitted';

  const updateStudentStatus = (studentId: string, status: AttendanceStatus, remarks?: string) => {
    setEntries((prev) =>
      prev.map((e) =>
        e.studentId === studentId ? { ...e, status, remarks: remarks !== undefined ? remarks : e.remarks } : e
      )
    );
  };

  const handleMarkAllPresent = () => {
    setEntries((prev) => prev.map((e) => ({ ...e, status: 'present' })));
  };

  const handleSaveDraft = () => {
    saveAttendance({
      id: existingRecord?.id || `att-${selectedDate}-${selectedClassId}`,
      classId: selectedClassId,
      date: selectedDate,
      status: 'draft',
      submittedBy: currentUser.name,
      entries
    });
  };

  const handleSubmitRegister = (isCorrection = false) => {
    const recordId = existingRecord?.id || `att-${selectedDate}-${selectedClassId}`;
    const correctionHistory = existingRecord?.correctionHistory || [];

    if (isCorrection && correctionReason) {
      correctionHistory.push({
        date: new Date().toISOString(),
        changedBy: currentUser.name,
        reason: correctionReason
      });
    }

    saveAttendance({
      id: recordId,
      classId: selectedClassId,
      date: selectedDate,
      status: 'submitted',
      submittedBy: currentUser.name,
      submittedAt: new Date().toISOString(),
      entries,
      correctionReason: isCorrection ? correctionReason : undefined,
      correctionHistory
    });

    setCorrectionModalOpen(false);
    setCorrectionReason('');
  };

  // Aggregates for display
  const presentCount = entries.filter((e) => e.status === 'present').length;
  const absentCount = entries.filter((e) => e.status === 'absent').length;
  const lateCount = entries.filter((e) => e.status === 'late').length;
  const excusedCount = entries.filter((e) => e.status === 'excused').length;
  const attendanceRate = entries.length > 0 ? Math.round((presentCount / entries.length) * 100) : 100;

  const currentClassObj = classes.find((c) => c.id === selectedClassId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E7E2D9] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#FFA51F]/20 text-[#B26A00]">
              Ghana Education Service Daily Register
            </span>
            <span className="text-xs text-[#666666]">Mandatory Morning Attendance Sign-Off</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-[#171717] mt-1">
            Student Attendance Workflow
          </h1>
          <p className="text-xs text-[#666666]">
            Record roll call, track tardiness & doctor excuses, and formally submit class records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isSubmitted ? (
            <Badge variant="success" size="md">
              OFFICIALLY SUBMITTED
            </Badge>
          ) : (
            <Badge variant="warning" size="md">
              REGISTER IN DRAFT
            </Badge>
          )}
        </div>
      </div>

      {/* Control Bar: Date Selector & Class Selector */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div>
              <label className="block text-[11px] font-bold text-[#666666] mb-1">Select Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateOrClassChange(e.target.value, selectedClassId)}
                className="text-xs p-2 rounded-xl border border-[#E7E2D9] focus:outline-none focus:border-[#FFA51F] bg-white font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#666666] mb-1">Select Class:</label>
              <select
                value={selectedClassId}
                onChange={(e) => handleDateOrClassChange(selectedDate, e.target.value)}
                disabled={currentUser.role === 'teacher' && currentUser.assignedClassId !== undefined}
                className="text-xs p-2 rounded-xl border border-[#E7E2D9] focus:outline-none focus:border-[#FFA51F] bg-white font-bold disabled:opacity-75"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.level})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Bulk Action */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              icon={<Sparkles className="w-3.5 h-3.5 text-[#FFA51F]" />}
              onClick={handleMarkAllPresent}
            >
              Mark Entire Class Present
            </Button>
          </div>
        </div>
      </Card>

      {/* Metric Summary Banner */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="p-3 text-center bg-white">
          <span className="text-[11px] text-[#666666] block">Class Size</span>
          <span className="text-xl font-extrabold text-[#171717]">{entries.length}</span>
        </Card>
        <Card className="p-3 text-center bg-emerald-50 border-emerald-200">
          <span className="text-[11px] text-emerald-800 block font-medium">Present</span>
          <span className="text-xl font-extrabold text-emerald-700">{presentCount}</span>
        </Card>
        <Card className="p-3 text-center bg-red-50 border-red-200">
          <span className="text-[11px] text-red-800 block font-medium">Absent</span>
          <span className="text-xl font-extrabold text-[#DC5252]">{absentCount}</span>
        </Card>
        <Card className="p-3 text-center bg-amber-50 border-amber-200">
          <span className="text-[11px] text-amber-800 block font-medium">Late</span>
          <span className="text-xl font-extrabold text-amber-700">{lateCount}</span>
        </Card>
        <Card className="p-3 text-center bg-blue-50 border-blue-200">
          <span className="text-[11px] text-blue-800 block font-medium">Attendance Rate</span>
          <span className="text-xl font-extrabold text-blue-700">{attendanceRate}%</span>
        </Card>
      </div>

      {/* Attendance Register Table */}
      <Card>
        <CardHeader
          title={`Daily Register: ${currentClassObj?.name} — ${selectedDate}`}
          subtitle="Toggle student attendance status pills below. Add specific remarks for tardiness or doctor notes."
          action={
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                icon={<Save className="w-3.5 h-3.5" />}
                onClick={handleSaveDraft}
              >
                Save Draft
              </Button>
              {isSubmitted ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setCorrectionModalOpen(true)}
                >
                  Submit Authorized Correction
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Send className="w-3.5 h-3.5" />}
                  onClick={() => handleSubmitRegister(false)}
                >
                  Submit Official Register
                </Button>
              )}
            </div>
          }
        />

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F5F4] text-[#666666] font-semibold border-b border-[#E7E2D9]">
              <tr>
                <th className="p-3">Student Name</th>
                <th className="p-3">Admission No</th>
                <th className="p-3 text-center">Mark Status</th>
                <th className="p-3">Remarks / Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {entries.map((entry) => {
                const student = students.find((s) => s.id === entry.studentId);
                if (!student) return null;

                return (
                  <tr key={entry.studentId} className="hover:bg-stone-50">
                    <td className="p-3 font-bold text-[#171717]">
                      {student.firstName} {student.lastName}
                    </td>
                    <td className="p-3 font-mono text-[#666666]">{student.admissionNumber}</td>
                    <td className="p-3 text-center">
                      <div className="inline-flex rounded-xl bg-stone-100 p-1 border border-stone-200 gap-1">
                        {[
                          { status: 'present', label: 'Present', color: 'bg-emerald-600 text-white' },
                          { status: 'late', label: 'Late', color: 'bg-amber-500 text-white' },
                          { status: 'absent', label: 'Absent', color: 'bg-[#DC5252] text-white' },
                          { status: 'excused', label: 'Excused', color: 'bg-blue-600 text-white' }
                        ].map((btn) => (
                          <button
                            type="button"
                            key={btn.status}
                            onClick={() => updateStudentStatus(entry.studentId, btn.status as any)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                              entry.status === btn.status
                                ? `${btn.color} shadow-xs font-bold`
                                : 'text-[#666666] hover:bg-white hover:text-[#171717]'
                            }`}
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        placeholder="Optional remarks (e.g. traffic delay, clinic visit)..."
                        value={entry.remarks || ''}
                        onChange={(e) => updateStudentStatus(entry.studentId, entry.status, e.target.value)}
                        className="w-full text-xs p-1.5 border border-transparent hover:border-stone-200 focus:border-[#FFA51F] rounded-lg bg-transparent focus:bg-white focus:outline-none"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Actions */}
        <div className="mt-5 pt-4 border-t border-[#E7E2D9] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p className="text-[#666666]">
            Recorded by: <span className="font-semibold text-[#171717]">{existingRecord?.submittedBy || currentUser.name}</span>
            {existingRecord?.submittedAt && ` on ${new Date(existingRecord.submittedAt).toLocaleTimeString()}`}
          </p>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleSaveDraft}>
              Save Draft
            </Button>
            {isSubmitted ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setCorrectionModalOpen(true)}
              >
                Submit Correction with Reason
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleSubmitRegister(false)}
              >
                Submit Class Register
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Attendance Correction Modal */}
      <Modal
        isOpen={correctionModalOpen}
        onClose={() => setCorrectionModalOpen(false)}
        title="Authorized Attendance Register Correction"
        subtitle="Ghana GES regulations require an audit reason when updating previously submitted rolls"
        maxWidth="md"
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#171717] mb-1">
              Reason for Register Revision <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={correctionReason}
              onChange={(e) => setCorrectionReason(e.target.value)}
              placeholder="e.g. Pupil arrived with hospital excuse slip after morning register was signed off..."
              className="w-full p-2.5 rounded-xl border border-[#E7E2D9] focus:outline-none focus:border-[#FFA51F]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#E7E2D9]">
            <Button variant="ghost" onClick={() => setCorrectionModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              disabled={!correctionReason.trim()}
              onClick={() => handleSubmitRegister(true)}
            >
              Confirm & Re-submit Register
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
