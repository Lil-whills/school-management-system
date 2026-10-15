import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Users,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ClipboardList,
  Eye,
  Check,
  X
} from 'lucide-react';
import { ResultSubmission } from '../types';

export const HeadteacherDashboard: React.FC = () => {
  const {
    students,
    classes,
    users,
    attendanceRecords,
    resultSubmissions,
    approveResults,
    rejectResults,
    publishResults,
    promoteStudentsBatch,
    academicYears
  } = useApp();

  const navigate = useNavigate();

  // Review Modal state for submitted marks
  const [selectedSubmission, setSelectedSubmission] = useState<ResultSubmission | null>(null);
  const [correctionReason, setCorrectionReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  // Promotion Demonstration State
  const [promotionModalOpen, setPromotionModalOpen] = useState(false);
  const [selectedPromotionYear, setSelectedPromotionYear] = useState('ay-2026-2027');
  const [promotionBatchStatus, setPromotionBatchStatus] = useState<string | null>(null);

  // Metric counts
  const totalStudents = students.filter((s) => s.status === 'active').length;
  const activeClassesCount = classes.length;
  const assignedTeachersCount = users.filter((u) => u.role === 'teacher' || u.role === 'subject_teacher').length;

  const pendingSubmissions = resultSubmissions.filter((r) => r.status === 'submitted');
  const approvedSubmissions = resultSubmissions.filter((r) => r.status === 'approved');
  const incompleteAttendanceClasses = classes.filter((c) => {
    const todayRec = attendanceRecords.find((a) => a.classId === c.id);
    return !todayRec || todayRec.status === 'draft';
  });

  const handleApprove = (id: string) => {
    approveResults(id, 'Moderated and approved by Mrs. Comfort Addo (Headmistress).');
    setSelectedSubmission(null);
  };

  const handleReturn = (id: string) => {
    if (!correctionReason.trim()) {
      alert('Please provide a specific correction reason for the teacher.');
      return;
    }
    rejectResults(id, correctionReason);
    setSelectedSubmission(null);
    setIsRejecting(false);
    setCorrectionReason('');
  };

  const handleExecutePromotion = () => {
    // Demo batch promotion: Basic 4A students -> Basic 5
    const basic4AStudents = students.filter((s) => s.currentClassId === 'cls-b4a');
    const promotions = basic4AStudents.map((s) => ({
      studentId: s.id,
      newClassId: 'cls-b5',
      action: 'promote' as const
    }));

    promoteStudentsBatch(promotions, selectedPromotionYear);
    setPromotionBatchStatus(`Successfully promoted ${promotions.length} students from Basic 4A to Basic 5 for the 2026/2027 Academic Year!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E7E2D9] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800">
              Academic Administration Portal
            </span>
            <span className="text-xs text-[#666666]">Ghana Basic Education Curriculum Moderation</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-[#171717] mt-1">
            Headteacher / Academic Director Portal
          </h1>
          <p className="text-xs text-[#666666]">
            Welcome, Mrs. Comfort Addo. Review teacher marks, monitor class registers, and prepare student promotions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPromotionModalOpen(true)}
            icon={<GraduationCap className="w-3.5 h-3.5" />}
          >
            Promotion Workflow
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/academics')}
            icon={<ClipboardList className="w-3.5 h-3.5" />}
          >
            Curriculum & Classes
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4" hoverable>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-[#666666]">Total Students</p>
              <h3 className="text-2xl font-extrabold text-[#171717] mt-1">{totalStudents}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-[#666666] mt-2">Across 12 GES Classes</p>
        </Card>

        <Card className="p-4" hoverable>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-[#666666]">Results Awaiting Review</p>
              <h3 className="text-2xl font-extrabold text-amber-700 mt-1">
                {pendingSubmissions.length}
              </h3>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
              <ClipboardList className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-amber-800 font-semibold mt-2">
            Requires moderation sign-off
          </p>
        </Card>

        <Card className="p-4" hoverable>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-[#666666]">Incomplete Registers</p>
              <h3 className="text-2xl font-extrabold text-[#DC5252] mt-1">
                {incompleteAttendanceClasses.length}
              </h3>
            </div>
            <div className="p-2.5 rounded-xl bg-red-50 text-[#DC5252] border border-red-200">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-[#DC5252] font-semibold mt-2">Classes with pending registers</p>
        </Card>

        <Card className="p-4" hoverable>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-[#666666]">Approved for Terminal Reports</p>
              <h3 className="text-2xl font-extrabold text-emerald-700 mt-1">
                {approvedSubmissions.length}
              </h3>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-emerald-800 font-semibold mt-2">Ready to publish</p>
        </Card>
      </div>

      {/* Row: Results Moderation Workflow (Journey B Requirement!) */}
      <Card>
        <CardHeader
          title="Terminal Results Moderation & Approval Pipeline"
          subtitle="Review teacher mark submissions, inspect student scores, return for revision or approve for report cards"
          action={
            <Badge variant="primary" size="sm">
              Workflow Active
            </Badge>
          }
        />

        <div className="space-y-3">
          {resultSubmissions.map((sub) => {
            const cls = classes.find((c) => c.id === sub.classId);
            const isPending = sub.status === 'submitted';
            const isApproved = sub.status === 'approved';
            const isRejected = sub.status === 'rejected';

            return (
              <div
                key={sub.id}
                className={`p-4 rounded-xl border transition-all text-xs flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isPending
                    ? 'bg-amber-50/60 border-amber-300 shadow-xs'
                    : isRejected
                    ? 'bg-red-50/50 border-red-200'
                    : 'bg-white border-[#E7E2D9]'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#171717]">
                      {cls?.name} — {sub.subjectId === 'sub-mth-4a' ? 'Mathematics' : sub.subjectId === 'sub-eng-4a' ? 'English Language' : 'Integrated Science'}
                    </span>
                    <Badge
                      variant={isPending ? 'warning' : isApproved ? 'success' : 'danger'}
                      size="sm"
                    >
                      {sub.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-[#666666] mt-1">
                    Submitted by: <span className="font-semibold text-[#171717]">{sub.submittedBy}</span> • {sub.marks.length} students graded
                  </p>
                  {sub.reviewNotes && (
                    <p className="text-[11px] text-[#666666] italic mt-1 bg-stone-100 p-1.5 rounded-lg inline-block">
                      Note: {sub.reviewNotes}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Eye className="w-3.5 h-3.5" />}
                    onClick={() => setSelectedSubmission(sub)}
                  >
                    Inspect Scores
                  </Button>

                  {isPending && (
                    <>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          setSelectedSubmission(sub);
                          setIsRejecting(true);
                        }}
                      >
                        Return for Revision
                      </Button>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleApprove(sub.id)}
                      >
                        Approve Results
                      </Button>
                    </>
                  )}

                  {isApproved && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => publishResults(sub.id)}
                    >
                      Publish to Report Cards
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Row: Incomplete Attendance Tracker & Promotion Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incomplete Attendance Monitor */}
        <Card>
          <CardHeader
            title="Today's Attendance Compliance"
            subtitle="Track classes where registers have not yet been formally submitted"
            action={
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/attendance')}
              >
                Attendance Log
              </Button>
            }
          />
          <div className="space-y-2.5 text-xs">
            {incompleteAttendanceClasses.map((cls) => (
              <div
                key={cls.id}
                className="p-3 rounded-xl border border-stone-200 bg-stone-50 flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-[#171717]">{cls.name}</p>
                  <p className="text-[#666666]">Class Teacher: {cls.classTeacherId === 'user-teacher' ? 'Mr. Samuel Osei' : 'Assigned Staff'}</p>
                </div>
                <Badge variant="warning" size="sm">
                  Register in Draft
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Promotion Demo Card */}
        <Card className="bg-[#FFF8ED]/50 border-[#FFA51F]/30">
          <CardHeader
            title="Student Promotion Workflow (2026/2027)"
            subtitle="Preview proposed grade placements, check missing marks, and batch promote cohorts"
            action={
              <Badge variant="primary" size="sm">
                Annual Process
              </Badge>
            }
          />
          <div className="text-xs space-y-3">
            <p className="text-[#666666]">
              Authorized academic administrators review end-of-year terminal averages and prepare student placements for the upcoming academic session.
            </p>
            <div className="bg-white p-3 rounded-xl border border-[#E7E2D9] space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-[#171717]">Basic 4A Cohort (7 tracked pupils):</span>
                <span className="font-semibold text-emerald-700">100% Assessment Complete</span>
              </div>
              <div className="flex justify-between items-center text-[#666666]">
                <span>Proposed Target Placement:</span>
                <span className="font-bold text-[#B26A00]">Basic 5 (Block C, Room 3)</span>
              </div>
            </div>
            <Button
              variant="primary"
              size="md"
              className="w-full"
              onClick={() => setPromotionModalOpen(true)}
            >
              Launch Promotion Preview & Moderation
            </Button>
          </div>
        </Card>
      </div>

      {/* Inspect Scores Modal */}
      {selectedSubmission && (
        <Modal
          isOpen={Boolean(selectedSubmission)}
          onClose={() => {
            setSelectedSubmission(null);
            setIsRejecting(false);
          }}
          title={`Score Sheet Inspection: ${selectedSubmission.classId} — ${selectedSubmission.subjectId}`}
          subtitle={`Submitted by ${selectedSubmission.submittedBy} on ${new Date(selectedSubmission.submittedAt).toLocaleDateString()}`}
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs">
            <div className="border border-[#E7E2D9] rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-[#F5F5F4] text-[#666666] font-semibold border-b border-[#E7E2D9]">
                  <tr>
                    <th className="p-2.5">Student</th>
                    <th className="p-2.5 text-center">Class (30)</th>
                    <th className="p-2.5 text-center">Exam (70)</th>
                    <th className="p-2.5 text-center">Total (100)</th>
                    <th className="p-2.5 text-center">GES Grade</th>
                    <th className="p-2.5">Teacher Remark</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {selectedSubmission.marks.map((m) => {
                    const st = students.find((s) => s.id === m.studentId);
                    return (
                      <tr key={m.studentId} className="hover:bg-stone-50">
                        <td className="p-2.5 font-bold text-[#171717]">
                          {st ? `${st.firstName} ${st.lastName}` : m.studentId}
                        </td>
                        <td className="p-2.5 text-center font-mono">{m.classScore}</td>
                        <td className="p-2.5 text-center font-mono">{m.examScore}</td>
                        <td className="p-2.5 text-center font-bold text-[#B26A00] font-mono">{m.totalScore}%</td>
                        <td className="p-2.5 text-center font-bold">{m.grade}</td>
                        <td className="p-2.5 text-[#666666] italic">{m.remark}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {isRejecting ? (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-2">
                <label className="block font-bold text-[#DC5252]">
                  Reason for Returning Submission to Teacher:
                </label>
                <textarea
                  value={correctionReason}
                  onChange={(e) => setCorrectionReason(e.target.value)}
                  placeholder="e.g. Practical assessment marks must be recalculated out of 30..."
                  rows={3}
                  className="w-full p-2 text-xs border border-red-300 rounded-lg focus:outline-none bg-white"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsRejecting(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleReturn(selectedSubmission.id)}
                  >
                    Confirm Return
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center pt-3 border-t border-[#E7E2D9]">
                <Button
                  variant="ghost"
                  onClick={() => setSelectedSubmission(null)}
                >
                  Close
                </Button>
                {selectedSubmission.status === 'submitted' && (
                  <div className="flex gap-2">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setIsRejecting(true)}
                    >
                      Return with Notes
                    </Button>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleApprove(selectedSubmission.id)}
                    >
                      Approve Result Sheet
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Promotion Workflow Modal */}
      <Modal
        isOpen={promotionModalOpen}
        onClose={() => {
          setPromotionModalOpen(false);
          setPromotionBatchStatus(null);
        }}
        title="Student Annual Promotion & Placement Review"
        subtitle="End-of-year class progression for 2026/2027 Academic Year"
        maxWidth="2xl"
      >
        <div className="space-y-4 text-xs">
          {promotionBatchStatus ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-bold">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Promotion Batch Executed</span>
              </div>
              <p className="text-emerald-700">{promotionBatchStatus}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPromotionModalOpen(false)}
              >
                Dismiss
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 bg-[#F5F5F4] p-3 rounded-xl">
                <div>
                  <span className="text-[#666666] block">Source Class:</span>
                  <span className="font-bold text-[#171717]">Basic 4A (Mr. Samuel Osei)</span>
                </div>
                <div>
                  <span className="text-[#666666] block">Target Academic Year:</span>
                  <select
                    value={selectedPromotionYear}
                    onChange={(e) => setSelectedPromotionYear(e.target.value)}
                    className="font-bold text-[#B26A00] bg-transparent outline-none"
                  >
                    <option value="ay-2026-2027">2026/2027 Academic Year</option>
                  </select>
                </div>
              </div>

              <div className="border border-[#E7E2D9] rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-[#F5F5F4] text-[#666666] font-semibold border-b border-[#E7E2D9]">
                    <tr>
                      <th className="p-2.5">Student Name</th>
                      <th className="p-2.5">Current Placement</th>
                      <th className="p-2.5">Proposed Promotion</th>
                      <th className="p-2.5 text-center">Academic Standing</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {students
                      .filter((s) => s.currentClassId === 'cls-b4a')
                      .map((st) => (
                        <tr key={st.id} className="hover:bg-stone-50">
                          <td className="p-2.5 font-bold text-[#171717]">
                            {st.firstName} {st.lastName}
                          </td>
                          <td className="p-2.5 text-[#666666]">Basic 4A</td>
                          <td className="p-2.5 font-semibold text-[#B26A00]">Basic 5</td>
                          <td className="p-2.5 text-center">
                            <Badge variant="success" size="sm">
                              ELIGIBLE
                            </Badge>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900">
                <p className="font-bold">Promotion Safety Rule:</p>
                <p className="text-[11px] mt-0.5">
                  Confirming this batch automatically records previous class history in the student profile while preserving permanent student ID and guardian links.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E7E2D9]">
                <Button
                  variant="ghost"
                  onClick={() => setPromotionModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleExecutePromotion}
                >
                  Confirm & Commit Batch Promotion
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};
