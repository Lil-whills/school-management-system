import React from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';

export const SubjectTeacherDashboard: React.FC = () => {
  const { resultSubmissions, classes, subjects } = useApp();
  const navigate = useNavigate();

  // Find returned submission for revision (Integrated Science Basic 5)
  const rejectedSubmission = resultSubmissions.find((r) => r.status === 'rejected');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E7E2D9] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800">
              Subject Specialist Portal
            </span>
            <span className="text-xs text-[#666666]">Integrated Science & Computing Curriculum</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-[#171717] mt-1">
            Welcome, Ms. Akua Boateng
          </h1>
          <p className="text-xs text-[#666666]">
            Specialist teacher for Integrated Science (Basic 4, 5) & Computing ICT (Basic 5, 6).
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/academics')}
          icon={<BookOpen className="w-3.5 h-3.5" />}
        >
          Open Mark Registry
        </Button>
      </div>

      {/* Revision Alert Banner (Journey D requirement!) */}
      {rejectedSubmission && (
        <div className="p-4 rounded-2xl border border-red-300 bg-red-50 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#DC5252] font-bold text-sm">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>Results Returned for Moderation Revision</span>
            </div>
            <Badge variant="danger">ACTION REQUIRED</Badge>
          </div>
          <p className="text-[#171717]">
            Headmistress Mrs. Comfort Addo returned your submission for{' '}
            <span className="font-bold">Basic 5 Integrated Science</span> with the following feedback:
          </p>
          <div className="p-3 bg-white rounded-xl border border-red-200 text-[#171717] font-medium italic">
            "{rejectedSubmission.reviewNotes}"
          </div>
          <div className="flex justify-end pt-1">
            <Button
              variant="danger"
              size="sm"
              onClick={() => navigate('/academics')}
            >
              Adjust Practical Marks & Resubmit
            </Button>
          </div>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4" hoverable>
          <p className="text-xs font-semibold text-[#666666]">Assigned Subjects</p>
          <h3 className="text-2xl font-extrabold text-[#171717] mt-1">4</h3>
          <p className="text-[11px] text-[#666666] mt-1">Science & ICT</p>
        </Card>
        <Card className="p-4" hoverable>
          <p className="text-xs font-semibold text-[#666666]">Assigned Classes</p>
          <h3 className="text-2xl font-extrabold text-[#171717] mt-1">3</h3>
          <p className="text-[11px] text-[#666666] mt-1">Basic 4A, Basic 5, Basic 6</p>
        </Card>
        <Card className="p-4" hoverable>
          <p className="text-xs font-semibold text-[#666666]">Pending Revisions</p>
          <h3 className="text-2xl font-extrabold text-[#DC5252] mt-1">1</h3>
          <p className="text-[11px] text-[#DC5252] font-semibold mt-1">Basic 5 Science</p>
        </Card>
        <Card className="p-4" hoverable>
          <p className="text-xs font-semibold text-[#666666]">Submitted Marks</p>
          <h3 className="text-2xl font-extrabold text-emerald-700 mt-1">3</h3>
          <p className="text-[11px] text-emerald-800 font-semibold mt-1">Under moderation</p>
        </Card>
      </div>

      {/* Assigned Subjects Roster */}
      <Card>
        <CardHeader
          title="Assigned Classes & Academic Marks"
          subtitle="You are authorized to enter marks only for subjects officially assigned to you"
        />
        <div className="space-y-3 text-xs">
          {[
            {
              subject: 'Integrated Science',
              class: 'Basic 5',
              code: 'SCI-P5',
              room: 'Block C, Room 3',
              status: 'Returned for Revision',
              badge: 'danger'
            },
            {
              subject: 'Computing (ICT)',
              class: 'Basic 5',
              code: 'ICT-P5',
              room: 'Computer Lab 1',
              status: 'Draft Saved (28 scored)',
              badge: 'primary'
            },
            {
              subject: 'Computing (ICT)',
              class: 'Basic 6',
              code: 'ICT-P6',
              room: 'Computer Lab 1',
              status: 'Ready to Enter',
              badge: 'neutral'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-[#E7E2D9] hover:border-[#FFA51F] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#171717]">{item.subject}</span>
                  <span className="font-semibold text-[#B26A00]">({item.class})</span>
                  <Badge variant={item.badge as any} size="sm">
                    {item.status}
                  </Badge>
                </div>
                <p className="text-[#666666] mt-0.5">
                  Code: {item.code} • Location: {item.room}
                </p>
              </div>

              <Button
                variant={item.badge === 'danger' ? 'danger' : 'outline'}
                size="sm"
                onClick={() => navigate('/academics')}
              >
                {item.badge === 'danger' ? 'Correct & Resubmit' : 'Open Mark Sheet'}
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
