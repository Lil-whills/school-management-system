import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import {
  GraduationCap,
  ClipboardList,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  BookOpen,
  Award,
  Layers,
  Plus,
  Send,
  Save,
  Eye,
  Check,
  X
} from 'lucide-react';
import { ResultSubmission, StudentMarkEntry } from '../types';

export const AcademicsPage: React.FC = () => {
  const {
    students,
    classes,
    subjects,
    resultSubmissions,
    saveResults,
    approveResults,
    rejectResults,
    publishResults,
    promoteStudentsBatch,
    addClass,
    currentUser
  } = useApp();

  const [activeTab, setActiveTab] = useState<'moderation' | 'entry' | 'promotion' | 'classes'>('moderation');

  // Moderation state
  const [inspectingSub, setInspectingSub] = useState<ResultSubmission | null>(null);
  const [returnReason, setReturnReason] = useState('');
  const [isReturning, setIsReturning] = useState(false);

  // Marks Entry State
  const [selectedEntryClass, setSelectedEntryClass] = useState('cls-b4a');
  const [selectedEntrySubject, setSelectedEntrySubject] = useState('sub-mth-4a');
  const classPupils = students.filter((s) => s.currentClassId === selectedEntryClass);

  // Working mark entries for the Marks Entry tab
  const activeSubmission = resultSubmissions.find(
    (r) => r.classId === selectedEntryClass && r.subjectId === selectedEntrySubject
  );

  const [entryMarks, setEntryMarks] = useState<Record<string, { classScore: number; examScore: number }>>(() => {
    const map: Record<string, { classScore: number; examScore: number }> = {};
    if (activeSubmission) {
      activeSubmission.marks.forEach((m) => {
        map[m.studentId] = { classScore: m.classScore, examScore: m.examScore };
      });
    } else {
      classPupils.forEach((p) => {
        map[p.id] = { classScore: 25, examScore: 60 };
      });
    }
    return map;
  });

  // Keep marks in sync when class/subject changes
  const handleEntryClassOrSubChange = (newClass: string, newSubject: string) => {
    setSelectedEntryClass(newClass);
    setSelectedEntrySubject(newSubject);
    const sub = resultSubmissions.find((r) => r.classId === newClass && r.subjectId === newSubject);
    const pupils = students.filter((s) => s.currentClassId === newClass);
    const map: Record<string, { classScore: number; examScore: number }> = {};
    if (sub) {
      sub.marks.forEach((m) => {
        map[m.studentId] = { classScore: m.classScore, examScore: m.examScore };
      });
    } else {
      pupils.forEach((p) => {
        map[p.id] = { classScore: 24, examScore: 58 };
      });
    }
    setEntryMarks(map);
  };

  const calculateGrade = (total: number): { grade: string; remark: string } => {
    if (total >= 80) return { grade: '1', remark: 'Excellent' };
    if (total >= 70) return { grade: '2', remark: 'Very Good' };
    if (total >= 65) return { grade: '3', remark: 'Good' };
    if (total >= 60) return { grade: '4', remark: 'Credit' };
    if (total >= 50) return { grade: '5', remark: 'Pass' };
    return { grade: '6', remark: 'Needs Improvement' };
  };

  const handleScoreChange = (studentId: string, field: 'classScore' | 'examScore', val: number) => {
    const clampedVal = Math.max(0, Math.min(field === 'classScore' ? 30 : 70, val || 0));
    setEntryMarks((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { classScore: 0, examScore: 0 }),
        [field]: clampedVal
      }
    }));
  };

  const handleSaveMarks = (status: 'draft' | 'submitted') => {
    const compiledMarks: StudentMarkEntry[] = classPupils.map((st) => {
      const scoreObj = entryMarks[st.id] || { classScore: 0, examScore: 0 };
      const total = scoreObj.classScore + scoreObj.examScore;
      const { grade, remark } = calculateGrade(total);
      return {
        studentId: st.id,
        classScore: scoreObj.classScore,
        examScore: scoreObj.examScore,
        totalScore: total,
        grade,
        remark
      };
    });

    saveResults({
      id: activeSubmission?.id || `res-${selectedEntryClass}-${selectedEntrySubject}`,
      classId: selectedEntryClass,
      subjectId: selectedEntrySubject,
      termId: 'term-2',
      academicYearId: 'ay-2025-2026',
      submittedBy: currentUser.name,
      submittedAt: new Date().toISOString(),
      status,
      marks: compiledMarks
    });
  };

  // Promotion State
  const [promotedSuccess, setPromotedSuccess] = useState(false);
  const handlePromoteCohort = () => {
    const b4aPupils = students.filter((s) => s.currentClassId === 'cls-b4a');
    const batch = b4aPupils.map((p) => ({
      studentId: p.id,
      newClassId: 'cls-b5',
      action: 'promote' as const
    }));
    promoteStudentsBatch(batch, 'ay-2026-2027');
    setPromotedSuccess(true);
  };

  // Add Class State
  const [newClassName, setNewClassName] = useState('');
  const [newClassLevel, setNewClassLevel] = useState<any>('Primary');
  const [newClassCapacity, setNewClassCapacity] = useState('35');
  const [newClassRoom, setNewClassRoom] = useState('Block B, Room 4');
  const [addClassModalOpen, setAddClassModalOpen] = useState(false);

  const handleAddClassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addClass({
      name: newClassName,
      level: newClassLevel,
      gradeNumber: 8,
      capacity: Number(newClassCapacity),
      classTeacherId: currentUser.id,
      room: newClassRoom
    });
    setAddClassModalOpen(false);
    setNewClassName('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E7E2D9] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#FFA51F]/20 text-[#B26A00]">
              Academic Administration
            </span>
            <span className="text-xs text-[#666666]">Ghana GES Assessment & Examination Systems</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-[#171717] mt-1">
            Academic Moderation & Curriculum
          </h1>
          <p className="text-xs text-[#666666]">
            Continuous assessment entry (30/70 formula), headteacher moderation, report cards, and student promotion.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['owner', 'headteacher'].includes(currentUser.role) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAddClassModalOpen(true)}
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              Configure New Class
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E7E2D9] gap-2 overflow-x-auto text-xs font-bold">
        {[
          { id: 'moderation', label: 'Results Moderation & Submissions', icon: <ClipboardList className="w-4 h-4" /> },
          { id: 'entry', label: 'Continuous Marks Entry', icon: <BookOpen className="w-4 h-4" /> },
          { id: 'promotion', label: 'Student Promotion Workflow', icon: <GraduationCap className="w-4 h-4" /> },
          { id: 'classes', label: 'Classes & Curriculum', icon: <Layers className="w-4 h-4" /> }
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

      {/* TAB 1: Results Moderation */}
      {activeTab === 'moderation' && (
        <div className="space-y-4">
          <Card>
            <CardHeader
              title="Terminal Mark Submissions Awaiting Moderation"
              subtitle="Headteacher / Academic Director review pipeline for Term 2 grades"
            />
            <div className="space-y-3 text-xs">
              {resultSubmissions.map((sub) => {
                const cls = classes.find((c) => c.id === sub.classId);
                const subObj = subjects.find((s) => s.id === sub.subjectId);

                return (
                  <div
                    key={sub.id}
                    className="p-4 rounded-xl border border-[#E7E2D9] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#171717]">
                          {cls?.name} — {subObj?.name || sub.subjectId}
                        </span>
                        <Badge
                          variant={
                            sub.status === 'approved' || sub.status === 'published'
                              ? 'success'
                              : sub.status === 'rejected'
                              ? 'danger'
                              : 'warning'
                          }
                          size="sm"
                        >
                          {sub.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-[#666666] mt-0.5">
                        Submitted by: <span className="font-semibold text-[#171717]">{sub.submittedBy}</span> • {sub.marks.length} pupils scored
                      </p>
                      {sub.reviewNotes && (
                        <p className="text-[11px] text-[#B26A00] italic mt-1 bg-[#FFF8ED] p-1.5 rounded-lg border border-[#FFA51F]/30">
                          Feedback: "{sub.reviewNotes}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Eye className="w-3.5 h-3.5" />}
                        onClick={() => setInspectingSub(sub)}
                      >
                        Inspect Scores
                      </Button>

                      {['owner', 'headteacher'].includes(currentUser.role) && sub.status === 'submitted' && (
                        <>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => {
                              setInspectingSub(sub);
                              setIsReturning(true);
                            }}
                          >
                            Return for Revision
                          </Button>
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => approveResults(sub.id)}
                          >
                            Approve
                          </Button>
                        </>
                      )}

                      {['owner', 'headteacher'].includes(currentUser.role) && sub.status === 'approved' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => publishResults(sub.id)}
                        >
                          Publish Report Cards
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: Marks Entry */}
      {activeTab === 'entry' && (
        <div className="space-y-4">
          <Card className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#666666] mb-1">Class:</label>
                  <select
                    value={selectedEntryClass}
                    onChange={(e) => handleEntryClassOrSubChange(e.target.value, selectedEntrySubject)}
                    className="p-2 rounded-xl border border-[#E7E2D9] font-bold bg-white focus:outline-none focus:border-[#FFA51F]"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#666666] mb-1">Subject:</label>
                  <select
                    value={selectedEntrySubject}
                    onChange={(e) => handleEntryClassOrSubChange(selectedEntryClass, e.target.value)}
                    className="p-2 rounded-xl border border-[#E7E2D9] font-bold bg-white focus:outline-none focus:border-[#FFA51F]"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Save className="w-3.5 h-3.5" />}
                  onClick={() => handleSaveMarks('draft')}
                >
                  Save Draft Marks
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Send className="w-3.5 h-3.5" />}
                  onClick={() => handleSaveMarks('submitted')}
                >
                  Submit for Headteacher Review
                </Button>
              </div>
            </div>
          </Card>

          {/* Mark Sheet Table */}
          <Card>
            <CardHeader
              title={`Marksheet: ${classes.find((c) => c.id === selectedEntryClass)?.name} — ${subjects.find((s) => s.id === selectedEntrySubject)?.name}`}
              subtitle="Ghana GES Standard Assessment: Class Score (Max 30) + Exam Score (Max 70) = Total (100)"
              action={
                <Badge
                  variant={
                    activeSubmission?.status === 'approved'
                      ? 'success'
                      : activeSubmission?.status === 'rejected'
                      ? 'danger'
                      : 'warning'
                  }
                  size="sm"
                >
                  {activeSubmission?.status.toUpperCase() || 'DRAFT'}
                </Badge>
              }
            />

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F5F5F4] text-[#666666] font-semibold border-b border-[#E7E2D9]">
                  <tr>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Admission No</th>
                    <th className="p-3 text-center">Class Score (30%)</th>
                    <th className="p-3 text-center">Exam Score (70%)</th>
                    <th className="p-3 text-center">Total (100%)</th>
                    <th className="p-3 text-center">GES Grade</th>
                    <th className="p-3 text-center">Evaluation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {classPupils.map((st) => {
                    const score = entryMarks[st.id] || { classScore: 0, examScore: 0 };
                    const total = score.classScore + score.examScore;
                    const { grade, remark } = calculateGrade(total);

                    return (
                      <tr key={st.id} className="hover:bg-stone-50">
                        <td className="p-3 font-bold text-[#171717]">
                          {st.firstName} {st.lastName}
                        </td>
                        <td className="p-3 font-mono text-[#666666]">{st.admissionNumber}</td>
                        <td className="p-3 text-center">
                          <input
                            type="number"
                            min={0}
                            max={30}
                            value={score.classScore}
                            onChange={(e) => handleScoreChange(st.id, 'classScore', Number(e.target.value))}
                            className="w-16 text-center p-1.5 rounded-lg border border-[#E7E2D9] font-bold text-xs focus:border-[#FFA51F] focus:outline-none"
                          />
                        </td>
                        <td className="p-3 text-center">
                          <input
                            type="number"
                            min={0}
                            max={70}
                            value={score.examScore}
                            onChange={(e) => handleScoreChange(st.id, 'examScore', Number(e.target.value))}
                            className="w-16 text-center p-1.5 rounded-lg border border-[#E7E2D9] font-bold text-xs focus:border-[#FFA51F] focus:outline-none"
                          />
                        </td>
                        <td className="p-3 text-center font-mono font-extrabold text-sm text-[#B26A00]">
                          {total}%
                        </td>
                        <td className="p-3 text-center">
                          <span className="inline-block w-6 h-6 rounded-full bg-amber-100 text-[#B26A00] font-bold text-center leading-6">
                            {grade}
                          </span>
                        </td>
                        <td className="p-3 text-center font-medium text-[#666666]">{remark}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-4 pt-4 border-t border-[#E7E2D9] flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => handleSaveMarks('draft')}>
                Save Draft
              </Button>
              <Button variant="primary" size="sm" onClick={() => handleSaveMarks('submitted')}>
                Submit Marks for Moderation
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 3: Student Promotion Workflow */}
      {activeTab === 'promotion' && (
        <div className="space-y-4">
          <Card>
            <CardHeader
              title="End-of-Session Student Promotion Preparation"
              subtitle="Preview proposed placements for next academic year (2026/2027) based on terminal averages"
            />
            {promotedSuccess ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h3 className="text-sm font-bold text-emerald-900">
                  Batch Promotion Successfully Executed!
                </h3>
                <p className="text-emerald-700">
                  All Basic 4A pupils have been promoted to Basic 5 for the 2026/2027 Academic Session.
                  Student historical records have been archived in their placement history.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPromotedSuccess(false)}
                >
                  Reset Promotion View
                </Button>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-[#FFF8ED] border border-[#FFA51F]/30 rounded-xl flex items-start gap-3">
                  <GraduationCap className="w-5 h-5 text-[#B26A00] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-[#171717]">Ghana GES Progression Governance</h4>
                    <p className="text-[#666666] mt-0.5">
                      Teachers cannot independently promote pupils. This workflow is restricted to authorized academic directors.
                      Promotion batches update class placements while preserving permanent admission numbers and financial ledgers.
                    </p>
                  </div>
                </div>

                <div className="border border-[#E7E2D9] rounded-xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-[#F5F5F4] text-[#666666] font-semibold border-b border-[#E7E2D9]">
                      <tr>
                        <th className="p-3">Student</th>
                        <th className="p-3">Current Class</th>
                        <th className="p-3">Average Mark</th>
                        <th className="p-3">Proposed 2026/27 Placement</th>
                        <th className="p-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {students
                        .filter((s) => s.currentClassId === 'cls-b4a')
                        .map((st) => (
                          <tr key={st.id} className="hover:bg-stone-50">
                            <td className="p-3 font-bold text-[#171717]">
                              {st.firstName} {st.lastName}
                            </td>
                            <td className="p-3 text-[#666666]">Basic 4A</td>
                            <td className="p-3 font-mono font-bold text-emerald-700">84.5%</td>
                            <td className="p-3 font-semibold text-[#B26A00]">Basic 5</td>
                            <td className="p-3 text-center">
                              <Badge variant="success" size="sm">
                                CLEARED FOR PROMOTION
                              </Badge>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handlePromoteCohort}
                  >
                    Commit Batch Promotion to 2026/2027
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* TAB 4: Classes & Curriculum Configuration */}
      {activeTab === 'classes' && (
        <div className="space-y-4">
          <Card>
            <CardHeader
              title="Classrooms & Academic Capacity"
              subtitle="All accredited basic school classes from Nursery to JHS"
              action={
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setAddClassModalOpen(true)}
                  icon={<Plus className="w-3.5 h-3.5" />}
                >
                  Add Class
                </Button>
              }
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              {classes.map((cls) => {
                const count = students.filter((s) => s.currentClassId === cls.id).length;
                return (
                  <div
                    key={cls.id}
                    className="p-4 rounded-xl border border-[#E7E2D9] bg-white hover:border-[#FFA51F] transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="font-bold text-sm text-[#171717]">{cls.name}</h4>
                      <Badge variant="primary" size="sm">{cls.level}</Badge>
                    </div>
                    <p className="text-[#666666] mt-1">Location: {cls.room}</p>
                    <div className="mt-3 pt-2 border-t border-stone-100 flex justify-between items-center text-[#666666]">
                      <span>Enrollment: <strong className="text-[#171717]">{count} pupils</strong></span>
                      <span>Capacity: {cls.capacity}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* Inspect Scores Modal */}
      {inspectingSub && (
        <Modal
          isOpen={Boolean(inspectingSub)}
          onClose={() => {
            setInspectingSub(null);
            setIsReturning(false);
          }}
          title={`Score Sheet Inspection: ${inspectingSub.classId} — ${inspectingSub.subjectId}`}
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
                  {inspectingSub.marks.map((m) => {
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

            {isReturning ? (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-2">
                <label className="block font-bold text-[#DC5252]">
                  Return Notes for Teacher:
                </label>
                <textarea
                  rows={3}
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  placeholder="e.g. Please verify practical marks for student #009..."
                  className="w-full p-2 border border-red-300 rounded-lg bg-white"
                />
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setIsReturning(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      rejectResults(inspectingSub.id, returnReason);
                      setInspectingSub(null);
                      setIsReturning(false);
                      setReturnReason('');
                    }}
                  >
                    Confirm Return
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center pt-3 border-t border-[#E7E2D9]">
                <Button variant="ghost" onClick={() => setInspectingSub(null)}>
                  Close
                </Button>
                {['owner', 'headteacher'].includes(currentUser.role) && inspectingSub.status === 'submitted' && (
                  <div className="flex gap-2">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setIsReturning(true)}
                    >
                      Return with Notes
                    </Button>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => {
                        approveResults(inspectingSub.id);
                        setInspectingSub(null);
                      }}
                    >
                      Approve Scores
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Add Class Modal */}
      <Modal
        isOpen={addClassModalOpen}
        onClose={() => setAddClassModalOpen(false)}
        title="Create New Classroom"
        subtitle="Configure new class for Ghanaian Basic Education curriculum"
        maxWidth="md"
      >
        <form onSubmit={handleAddClassSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#171717] mb-1">Class Name *</label>
            <input
              type="text"
              required
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              placeholder="e.g. Basic 4C"
              className="w-full p-2.5 rounded-xl border border-[#E7E2D9] focus:outline-none focus:border-[#FFA51F]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#171717] mb-1">Education Level</label>
              <select
                value={newClassLevel}
                onChange={(e) => setNewClassLevel(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-[#E7E2D9] bg-white focus:outline-none focus:border-[#FFA51F]"
              >
                <option value="Nursery">Nursery</option>
                <option value="KG">KG</option>
                <option value="Primary">Primary</option>
                <option value="JHS">JHS</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-[#171717] mb-1">Capacity</label>
              <input
                type="number"
                value={newClassCapacity}
                onChange={(e) => setNewClassCapacity(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E7E2D9] focus:outline-none focus:border-[#FFA51F]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#171717] mb-1">Room Assignment</label>
            <input
              type="text"
              value={newClassRoom}
              onChange={(e) => setNewClassRoom(e.target.value)}
              placeholder="e.g. Block C, Room 5"
              className="w-full p-2.5 rounded-xl border border-[#E7E2D9] focus:outline-none focus:border-[#FFA51F]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#E7E2D9]">
            <Button variant="ghost" type="button" onClick={() => setAddClassModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Classroom
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
