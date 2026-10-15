import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { StudentFormModal } from '../components/student/StudentFormModal';
import { useOutletContext } from 'react-router-dom';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Download,
  Phone,
  Mail,
  Eye,
  Edit,
  GraduationCap
} from 'lucide-react';
import { Student } from '../types';

export const StudentsPage: React.FC = () => {
  const { students, classes, guardians, currentUser } = useApp();
  const { openStudentProfile } = useOutletContext<{ openStudentProfile: (id: string) => void }>();

  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>(() => {
    // If teacher, default to their assigned class
    if (currentUser.role === 'teacher' && currentUser.assignedClassId) {
      return currentUser.assignedClassId;
    }
    return 'all';
  });
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'transferred' | 'withdrawn'>('all');

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const canAddOrEdit = ['owner', 'headteacher', 'admin'].includes(currentUser.role);

  const filtered = students.filter((s) => {
    const matchesSearch =
      s.firstName.toLowerCase().includes(search.toLowerCase()) ||
      s.lastName.toLowerCase().includes(search.toLowerCase()) ||
      s.admissionNumber.toLowerCase().includes(search.toLowerCase());
    const matchesClass = selectedClass === 'all' || s.currentClassId === selectedClass;
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesClass && matchesStatus;
  });

  const handleExportCSV = () => {
    const headers = 'AdmissionNumber,FirstName,LastName,Gender,DateOfBirth,Class,EmergencyContact,Address\n';
    const rows = filtered
      .map((s) => {
        const cls = classes.find((c) => c.id === s.currentClassId)?.name || '';
        return `"${s.admissionNumber}","${s.firstName}","${s.lastName}","${s.gender}","${s.dateOfBirth}","${cls}","${s.emergencyContact}","${s.address}"`;
      })
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Heritage_Crown_Students_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E7E2D9] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#FFA51F]/20 text-[#B26A00]">
              Pupil Registry
            </span>
            <span className="text-xs text-[#666666]">Ghana Basic Education Student Information</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-[#171717] mt-1">
            Student Records & Directory
          </h1>
          <p className="text-xs text-[#666666]">
            {filtered.length} pupils matching filter • Search by name or admission number.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Export List
          </Button>
          {canAddOrEdit && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setEditingStudent(null);
                setFormModalOpen(true);
              }}
              icon={<UserPlus className="w-3.5 h-3.5" />}
            >
              Admit New Student
            </Button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#666666] absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by student first name, surname, or admission ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-[#E7E2D9] focus:outline-none focus:border-[#FFA51F] bg-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="text-xs p-2.5 rounded-xl border border-[#E7E2D9] focus:outline-none focus:border-[#FFA51F] bg-white font-medium"
            >
              <option value="all">All Classes ({students.length})</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="text-xs p-2.5 rounded-xl border border-[#E7E2D9] focus:outline-none focus:border-[#FFA51F] bg-white font-medium"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Enrolled</option>
              <option value="transferred">Transferred</option>
              <option value="withdrawn">Withdrawn</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Students Data Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F5F4] text-[#666666] font-semibold border-b border-[#E7E2D9]">
              <tr>
                <th className="p-3">Student</th>
                <th className="p-3">Admission ID</th>
                <th className="p-3">Class</th>
                <th className="p-3">Gender / DOB</th>
                <th className="p-3">Guardian</th>
                <th className="p-3">Contact</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.length > 0 ? (
                filtered.map((st) => {
                  const cls = classes.find((c) => c.id === st.currentClassId);
                  const grd = guardians.find((g) => g.id === st.guardianId);

                  return (
                    <tr
                      key={st.id}
                      onClick={() => openStudentProfile(st.id)}
                      className="hover:bg-[#FFF8ED]/50 cursor-pointer group transition-colors"
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#FFA51F]/20 text-[#B26A00] flex items-center justify-center font-bold text-xs shrink-0">
                            {st.photoUrl ? (
                              <img
                                src={st.photoUrl}
                                alt={st.firstName}
                                className="w-full h-full object-cover rounded-full"
                              />
                            ) : (
                              `${st.firstName[0]}${st.lastName[0]}`
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-[#171717] group-hover:text-[#B26A00] block">
                              {st.firstName} {st.lastName}
                            </span>
                            <span className="text-[11px] text-[#666666]">{st.address}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 font-mono font-bold text-[#B26A00]">{st.admissionNumber}</td>
                      <td className="p-3 font-semibold text-[#171717]">{cls?.name || 'Unassigned'}</td>
                      <td className="p-3">
                        <span className="text-[#171717]">{st.gender}</span>
                        <span className="text-[11px] text-[#666666] block">{st.dateOfBirth}</span>
                      </td>
                      <td className="p-3">
                        <span className="font-medium text-[#171717]">{grd?.name || 'N/A'}</span>
                        <span className="text-[11px] text-[#666666] block">{grd?.relationship}</span>
                      </td>
                      <td className="p-3 text-[#666666]">{grd?.phone || st.emergencyContact}</td>
                      <td className="p-3 text-center">
                        <Badge variant={st.status === 'active' ? 'success' : 'neutral'} size="sm">
                          {st.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openStudentProfile(st.id)}
                            icon={<Eye className="w-3 h-3" />}
                          >
                            Profile
                          </Button>
                          {canAddOrEdit && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingStudent(st);
                                setFormModalOpen(true);
                              }}
                              icon={<Edit className="w-3 h-3" />}
                            >
                              Edit
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-[#666666]">
                    No student records found matching the specified filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Admission / Edit Form Modal */}
      <StudentFormModal
        isOpen={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setEditingStudent(null);
        }}
        studentToEdit={editingStudent}
      />
    </div>
  );
};
