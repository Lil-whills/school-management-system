import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarCheck,
  DollarSign,
  FolderKanban,
  MessageSquare,
  FileBarChart,
  Settings,
  History,
  X,
  LogOut,
  Sparkles,
  School as SchoolIcon
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { currentUser, school, resultSubmissions, expenses, attendanceRecords } = useApp();

  // Role-specific badge counters
  const pendingResultsCount = resultSubmissions.filter((r) => r.status === 'submitted').length;
  const pendingExpensesCount = expenses.filter((e) => e.approvalStatus === 'pending').length;
  const draftAttendanceCount = attendanceRecords.filter((a) => a.status === 'draft').length;

  // Build permitted navigation items based on role
  const getNavItems = () => {
    switch (currentUser.role) {
      case 'owner':
        return [
          { to: '/', label: 'Owner Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
          { to: '/students', label: 'Student Records', icon: <Users className="w-4 h-4" /> },
          {
            to: '/academics',
            label: 'Academic Moderation',
            icon: <GraduationCap className="w-4 h-4" />,
            badge: pendingResultsCount > 0 ? `${pendingResultsCount} pending` : undefined,
            badgeVariant: 'warning'
          },
          { to: '/attendance', label: 'Attendance Monitor', icon: <CalendarCheck className="w-4 h-4" /> },
          {
            to: '/finances',
            label: 'Fees & Expenses',
            icon: <DollarSign className="w-4 h-4" />,
            badge: pendingExpensesCount > 0 ? `${pendingExpensesCount} req` : undefined,
            badgeVariant: 'danger'
          },
          { to: '/activities', label: 'Financial Activities', icon: <FolderKanban className="w-4 h-4" /> },
          { to: '/communications', label: 'Parent Messages', icon: <MessageSquare className="w-4 h-4" /> },
          { to: '/reports', label: 'School Reports', icon: <FileBarChart className="w-4 h-4" /> },
          { to: '/audit', label: 'Audit Activity', icon: <History className="w-4 h-4" /> },
          { to: '/settings', label: 'School Settings', icon: <Settings className="w-4 h-4" /> }
        ];

      case 'headteacher':
        return [
          { to: '/', label: 'Academic Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { to: '/students', label: 'All Students', icon: <Users className="w-4 h-4" /> },
          {
            to: '/academics',
            label: 'Results & Promotion',
            icon: <GraduationCap className="w-4 h-4" />,
            badge: pendingResultsCount > 0 ? `${pendingResultsCount} review` : undefined,
            badgeVariant: 'warning'
          },
          {
            to: '/attendance',
            label: 'Daily Attendance',
            icon: <CalendarCheck className="w-4 h-4" />,
            badge: draftAttendanceCount > 0 ? `${draftAttendanceCount} draft` : undefined,
            badgeVariant: 'info'
          },
          { to: '/communications', label: 'Parent Notices', icon: <MessageSquare className="w-4 h-4" /> },
          { to: '/reports', label: 'Terminal Reports', icon: <FileBarChart className="w-4 h-4" /> },
          { to: '/settings', label: 'Curriculum & Classes', icon: <Settings className="w-4 h-4" /> }
        ];

      case 'teacher':
        return [
          { to: '/', label: 'Basic 4A Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { to: '/students', label: 'Class Register', icon: <Users className="w-4 h-4" /> },
          {
            to: '/attendance',
            label: 'Mark Daily Register',
            icon: <CalendarCheck className="w-4 h-4" />,
            badge: draftAttendanceCount > 0 ? 'Today Draft' : undefined,
            badgeVariant: 'info'
          },
          { to: '/academics', label: 'Subject Marks Entry', icon: <GraduationCap className="w-4 h-4" /> },
          { to: '/communications', label: 'Class Announcements', icon: <MessageSquare className="w-4 h-4" /> },
          { to: '/reports', label: 'Terminal Report Cards', icon: <FileBarChart className="w-4 h-4" /> }
        ];

      case 'subject_teacher':
        return [
          { to: '/', label: 'Subject Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          {
            to: '/academics',
            label: 'Assigned Subjects Marks',
            icon: <GraduationCap className="w-4 h-4" />,
            badge: '1 revision',
            badgeVariant: 'danger'
          },
          { to: '/attendance', label: 'Subject Attendance', icon: <CalendarCheck className="w-4 h-4" /> },
          { to: '/reports', label: 'Assessment Reports', icon: <FileBarChart className="w-4 h-4" /> }
        ];

      case 'accountant':
        return [
          { to: '/', label: 'Bursar Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { to: '/finances', label: 'Fee Management & Bills', icon: <DollarSign className="w-4 h-4" /> },
          {
            to: '/activities',
            label: 'Project Accounting',
            icon: <FolderKanban className="w-4 h-4" />,
            badge: 'Kakum Tour',
            badgeVariant: 'primary'
          },
          { to: '/students', label: 'Student Fee Ledgers', icon: <Users className="w-4 h-4" /> },
          { to: '/communications', label: 'Fee Reminders (SMS)', icon: <MessageSquare className="w-4 h-4" /> },
          { to: '/reports', label: 'Financial Reports', icon: <FileBarChart className="w-4 h-4" /> },
          { to: '/audit', label: 'Finance Audit Trail', icon: <History className="w-4 h-4" /> }
        ];

      case 'admin':
        return [
          { to: '/', label: 'Records Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { to: '/students', label: 'Student Admissions', icon: <Users className="w-4 h-4" /> },
          { to: '/attendance', label: 'Attendance Audit', icon: <CalendarCheck className="w-4 h-4" /> },
          { to: '/academics', label: 'Class Rosters', icon: <GraduationCap className="w-4 h-4" /> },
          { to: '/communications', label: 'School Broadcasts', icon: <MessageSquare className="w-4 h-4" /> },
          { to: '/reports', label: 'Enrollment Reports', icon: <FileBarChart className="w-4 h-4" /> },
          { to: '/audit', label: 'System Audit Log', icon: <History className="w-4 h-4" /> },
          { to: '/settings', label: 'School Profile', icon: <Settings className="w-4 h-4" /> }
        ];

      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden backdrop-blur-xs"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#FFF8ED] border-r border-[#E7E2D9] flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-[#E7E2D9] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FFA51F] flex items-center justify-center text-[#171717] font-extrabold shadow-sm shadow-[#FFA51F]/40">
              <SchoolIcon className="w-5 h-5 text-[#171717]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-[#171717] tracking-tight">SchoolFlow</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 bg-[#FFA51F]/20 text-[#B26A00] rounded">
                  GH
                </span>
              </div>
              <p className="text-[11px] text-[#666666] truncate max-w-[150px]">
                {school.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#666666] hover:text-[#171717] lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Role Card inside sidebar */}
        <div className="px-4 py-3 border-b border-[#E7E2D9] bg-white/50">
          <div className="flex items-center gap-2.5">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover border border-[#FFA51F]"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-[#171717] truncate">{currentUser.name}</p>
              <p className="text-[10px] text-[#B26A00] font-semibold truncate capitalize">
                {currentUser.title}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#666666] mb-2">
            Navigation
          </p>
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#FFA51F] text-[#171717] shadow-xs font-bold'
                    : 'text-[#666666] hover:text-[#171717] hover:bg-stone-200/50'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <span className="shrink-0">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    item.badgeVariant === 'warning'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : item.badgeVariant === 'danger'
                      ? 'bg-red-100 text-[#DC5252] border border-red-300'
                      : 'bg-white/80 text-[#171717]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Footer info & Term indicator */}
        <div className="p-3 border-t border-[#E7E2D9] bg-white/40 space-y-2 text-[11px]">
          <div className="flex items-center justify-between text-[#666666]">
            <span>Active Session:</span>
            <span className="font-bold text-[#171717]">Term 2 (2025/26)</span>
          </div>
          <div className="flex items-center justify-between text-[#666666]">
            <span>GES Basic Standard:</span>
            <span className="font-semibold text-emerald-700">Verified</span>
          </div>
        </div>
      </aside>
    </>
  );
};
