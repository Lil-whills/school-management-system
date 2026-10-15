import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { StudentFormModal } from '../components/student/StudentFormModal';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  Users,
  UserPlus,
  BookOpen,
  Calendar,
  Download,
  Upload,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  Filter
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { students, classes, guardians } = useApp();
  const navigate = useNavigate();
  const { openStudentProfile } = useOutletContext<{ openStudentProfile: (id: string) => void }>();

  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('all');

  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.status === 'active').length;
  const newAdmissions = students.filter((s) => s.admissionDate.startsWith('2026') || s.admissionDate.startsWith('2025-09')).length;

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClassFilter === 'all' || s.currentClassId === selectedClassFilter;
    return matchesSearch && matchesClass;
  });

  const handleExportCSV = () => {
    const headers = 'AdmissionNumber,FirstName,LastName,Gender,DateOfBirth,Class,GuardianPhone\n';
    const rows = filteredStudents.map((s) => {
      const cls = classes.find((c) => c.id === s.currentClassId)?.name || '';
      const grd = guardians.find((g) => g.id === s.guardianId)?.phone || '';
      return `${s.admissionNumber},${s.firstName},${s.lastName},${s.gender},${s.dateOfBirth},"${cls}","${grd}"`;
    }).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Heritage_Crown_Student_Roster_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleSimulateCSVImport = () => {
    alert('Demonstration: Sample CSV records parsed and verified against Ghana GES student numbering schema. 3 new student records queued.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E7E2D9] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
              Records & Admissions Office
            </span>
            <span className="text-xs text-[#666666]">Permanent Pupil Registry & Placements</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-[#171717] mt-1">
            School Administrator / Records Portal
          </h1>
          <p className="text-xs text-[#666666]">
            Welcome, Ms. Grace Asante. Manage admissions, guardian records, and class rosters.
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
            onClick={() => setRegisterModalOpen(true)}
            icon={<UserPlus className="w-3.5 h-3.5" />}
          >
            Admit New Student
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4" hoverable>
          <p className="text-xs font-semibold text-[#666666]">Total Registered Pupils</p>
          <h3 className="text-2xl font-extrabold text-[#171717] mt-1">{totalStudents}</h3>
          <p className="text-[11px] text-emerald-700 font-semibold mt-2">{activeStudents} currently active</p>
        </Card>

        <Card className="p-4" hoverable>
          <p className="text-xs font-semibold text-[#666666]">New Admissions (Session)</p>
          <h3 className="text-2xl font-extrabold text-[#B26A00] mt-1">{newAdmissions}</h3>
          <p className="text-[11px] text-[#666666] mt-2">Verified & Placed</p>
        </Card>

        <Card className="p-4" hoverable>
          <p className="text-xs font-semibold text-[#666666]">Active Classrooms</p>
          <h3 className="text-2xl font-extrabold text-[#171717] mt-1">{classes.length}</h3>
          <p className="text-[11px] text-[#666666] mt-2">Nursery to JHS 3</p>
        </Card>

        <Card className="p-4" hoverable>
          <p className="text-xs font-semibold text-[#666666]">Linked Guardians</p>
          <h3 className="text-2xl font-extrabold text-blue-700 mt-1">{guardians.length}</h3>
          <p className="text-[11px] text-blue-800 font-semibold mt-2">Multi-ward supported</p>
        </Card>
      </div>

      {/* Student Records Table with Search & Filters */}
      <Card>
        <CardHeader
          title="Student Admission Registry & Permanent Records"
          subtitle="Click on any pupil row to open their comprehensive shared profile"
          action={
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                icon={<Upload className="w-3.5 h-3.5" />}
                onClick={handleSimulateCSVImport}
              >
                Import CSV
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<UserPlus className="w-3.5 h-3.5" />}
                onClick={() => setRegisterModalOpen(true)}
              >
                Register Student
              </Button>
            </div>
          }
        />

        {/* Filter controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#666666] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by student name or admission number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-[#E7E2D9] focus:outline-none focus:border-[#FFA51F] bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#666666] shrink-0" />
            <select
              value={selectedClassFilter}
              onChange={(e) => setSelectedClassFilter(e.target.value)}
              className="text-xs p-2 rounded-xl border border-[#E7E2D9] focus:outline-none focus:border-[#FFA51F] bg-white font-medium"
            >
              <option value="all">All Classes ({students.length})</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F5F4] text-[#666666] font-semibold border-b border-[#E7E2D9]">
              <tr>
                <th className="p-3">Admission No</th>
                <th className="p-3">Student Name</th>
                <th className="p-3">Class</th>
                <th className="p-3">Date of Birth</th>
                <th className="p-3">Gender</th>
                <th className="p-3">Primary Guardian</th>
                <th className="p-3">Contact</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredStudents.map((st) => {
                const cls = classes.find((c) => c.id === st.currentClassId);
                const grd = guardians.find((g) => g.id === st.guardianId);
                return (
                  <tr
                    key={st.id}
                    onClick={() => openStudentProfile(st.id)}
                    className="hover:bg-[#FFF8ED]/50 cursor-pointer group transition-colors"
                  >
                    <td className="p-3 font-mono font-bold text-[#B26A00]">{st.admissionNumber}</td>
                    <td className="p-3 font-bold text-[#171717] group-hover:text-[#B26A00]">
                      {st.firstName} {st.lastName}
                    </td>
                    <td className="p-3 font-semibold text-[#171717]">{cls?.name || 'Unassigned'}</td>
                    <td className="p-3 text-[#666666]">{st.dateOfBirth}</td>
                    <td className="p-3 text-[#666666]">{st.gender}</td>
                    <td className="p-3 font-medium text-[#171717]">{grd?.name || 'N/A'}</td>
                    <td className="p-3 text-[#666666]">{grd?.phone || st.emergencyContact}</td>
                    <td className="p-3 text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openStudentProfile(st.id);
                        }}
                      >
                        View Profile
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Student Registration Modal */}
      <StudentFormModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
      />
    </div>
  );
};
