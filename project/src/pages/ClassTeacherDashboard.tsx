import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  CalendarCheck,
  Award,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  ClipboardList,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const ClassTeacherDashboard: React.FC = () => {
  const { students, attendanceRecords, resultSubmissions, classes } = useApp();
  const navigate = useNavigate();

  // Basic 4A cohort
  const classStudents = students.filter((s) => s.currentClassId === 'cls-b4a');
  const assignedClass = classes.find((c) => c.id === 'cls-b4a');

  // Today's attendance record (draft vs submitted)
  const todayRecord = attendanceRecords.find(
    (a) => a.classId === 'cls-b4a' && a.date === '2026-03-11'
  ) || attendanceRecords.find((a) => a.classId === 'cls-b4a');

  const isAttendanceSubmitted = todayRecord?.status === 'submitted';

  // Mark completion status for Basic 4A
  const mathSubmission = resultSubmissions.find(
    (r) => r.classId === 'cls-b4a' && r.subjectId === 'sub-mth-4a'
  );
  const englishSubmission = resultSubmissions.find(
    (r) => r.classId === 'cls-b4a' && r.subjectId === 'sub-eng-4a'
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E7E2D9] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#FFA51F]/20 text-[#B26A00]">
              Primary Class Teacher Portal
            </span>
            <span className="text-xs text-[#666666]">Class Administration & Mark Register</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-[#171717] mt-1">
            Welcome, Mr. Samuel Osei
          </h1>
          <p className="text-xs text-[#666666]">
            Class Teacher for <span className="font-bold text-[#171717]">{assignedClass?.name}</span> • Room: {assignedClass?.room}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/students')}
            icon={<Users className="w-3.5 h-3.5" />}
          >
            Class Register
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/attendance')}
            icon={<CalendarCheck className="w-3.5 h-3.5" />}
          >
            Mark Today's Attendance
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4" hoverable>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-[#666666]">Assigned Pupils</p>
              <h3 className="text-2xl font-extrabold text-[#171717] mt-1">
                {classStudents.length}
              </h3>
            </div>
            <div className="p-2.5 rounded-xl bg-[#FFF8ED] text-[#FFA51F] border border-[#FFA51F]/30">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-[#666666] mt-2">Capacity: 35 desks</p>
        </Card>

        {/* Today's Register Status */}
        <Card className="p-4" hoverable>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-[#666666]">Today's Register</p>
              <h3 className="text-base font-extrabold mt-1">
                {isAttendanceSubmitted ? (
                  <span className="text-emerald-700">SUBMITTED</span>
                ) : (
                  <span className="text-amber-600">IN DRAFT</span>
                )}
              </h3>
            </div>
            <div className={`p-2.5 rounded-xl border ${isAttendanceSubmitted ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-[#666666] mt-2">
            {isAttendanceSubmitted ? 'Formal attendance logged' : 'Pending submission to headteacher'}
          </p>
        </Card>

        {/* Mathematics Mark Submission */}
        <Card className="p-4" hoverable>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-[#666666]">Mathematics Marks</p>
              <h3 className="text-base font-extrabold text-[#B26A00] mt-1">
                {mathSubmission?.status.toUpperCase() || 'PENDING'}
              </h3>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-200">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-[#666666] mt-2">7 pupils graded</p>
        </Card>

        {/* English Marks */}
        <Card className="p-4" hoverable>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-[#666666]">English Language</p>
              <h3 className="text-base font-extrabold text-emerald-700 mt-1">
                {englishSubmission?.status.toUpperCase() || 'APPROVED'}
              </h3>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-emerald-800 font-semibold mt-2">Ready for Terminal Reports</p>
        </Card>
      </div>

      {/* Row: Attendance Action Callout & Quick Mark Entry */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Action Card */}
        <Card className={!isAttendanceSubmitted ? 'bg-[#FFF8ED]/50 border-[#FFA51F]/40' : ''}>
          <CardHeader
            title="Daily Morning Roll Call"
            subtitle={`Class register for ${assignedClass?.name} on 11th March 2026`}
            action={
              <Badge variant={isAttendanceSubmitted ? 'success' : 'warning'}>
                {isAttendanceSubmitted ? 'Register Closed' : 'Action Required'}
              </Badge>
            }
          />
          <div className="space-y-3 text-xs">
            <p className="text-[#666666]">
              Ghana Education Service requires daily roll call completion before 09:00 AM.
            </p>
            <div className="bg-white p-3 rounded-xl border border-[#E7E2D9] space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#666666]">Marked Present Today:</span>
                <span className="font-bold text-emerald-700">6 Pupils</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666666]">Marked Excused / Doctor:</span>
                <span className="font-bold text-blue-700">1 Pupil (Yaw Frimpong)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666666]">Unexcused Absent:</span>
                <span className="font-bold text-stone-500">0</span>
              </div>
            </div>

            <Button
              variant="primary"
              className="w-full"
              onClick={() => navigate('/attendance')}
            >
              Open Class Attendance Sheet & Submit
            </Button>
          </div>
        </Card>

        {/* Mark Entry Shortcuts */}
        <Card>
          <CardHeader
            title="Continuous Assessment & Exams"
            subtitle="Enter terminal scores for your assigned subjects (30% Class / 70% Exam)"
            action={
              <button
                onClick={() => navigate('/academics')}
                className="text-xs font-semibold text-[#B26A00] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Mark Registry</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            }
          />
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl border border-[#E7E2D9] bg-stone-50/50 flex items-center justify-between">
              <div>
                <p className="font-bold text-[#171717]">Basic 4A Mathematics</p>
                <p className="text-[11px] text-[#666666]">Status: Submitted to Headmistress</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/academics')}
              >
                View Scores
              </Button>
            </div>

            <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/40 flex items-center justify-between">
              <div>
                <p className="font-bold text-[#171717]">Basic 4A English Language</p>
                <p className="text-[11px] text-emerald-700 font-semibold">Status: Moderated & Approved</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/academics')}
              >
                Report Cards
              </Button>
            </div>

            <div className="p-3 rounded-xl border border-[#E7E2D9] bg-white flex items-center justify-between">
              <div>
                <p className="font-bold text-[#171717]">Religious & Moral Education (RME)</p>
                <p className="text-[11px] text-[#666666]">Status: Draft Open</p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/academics')}
              >
                Enter Marks
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Row: Student Class Roster */}
      <Card>
        <CardHeader
          title="Assigned Class Student Roster"
          subtitle="Direct pupil records and guardian contacts for Basic 4A"
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/students')}
            >
              Full Student Profile Directory
            </Button>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F5F4] text-[#666666] font-semibold border-b border-[#E7E2D9]">
              <tr>
                <th className="p-3">Admission No</th>
                <th className="p-3">Student Name</th>
                <th className="p-3">Gender</th>
                <th className="p-3">Date of Birth</th>
                <th className="p-3">Emergency Contact</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {classStudents.map((st) => (
                <tr key={st.id} className="hover:bg-stone-50">
                  <td className="p-3 font-mono font-bold text-[#B26A00]">{st.admissionNumber}</td>
                  <td className="p-3 font-bold text-[#171717]">
                    {st.firstName} {st.lastName}
                  </td>
                  <td className="p-3 text-[#666666]">{st.gender}</td>
                  <td className="p-3 text-[#666666]">{st.dateOfBirth}</td>
                  <td className="p-3 text-[#171717]">{st.emergencyContact}</td>
                  <td className="p-3 text-center">
                    <Badge variant="success" size="sm">
                      ACTIVE
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
