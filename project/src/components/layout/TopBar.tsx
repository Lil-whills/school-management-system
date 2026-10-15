import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Menu,
  Search,
  Bell,
  RotateCcw,
  UserCheck,
  ChevronDown,
  LogOut,
  ShieldAlert,
  GraduationCap
} from 'lucide-react';

interface TopBarProps {
  onToggleSidebar: () => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onToggleSidebar,
  onOpenSearch,
  onOpenNotifications
}) => {
  const { currentUser, switchRole, unreadNotificationCount, resetAllData } = useApp();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const rolesList: { role: UserRole; label: string; email: string; desc: string }[] = [
    { role: 'owner', label: 'School Owner / Proprietor', email: 'owner@demo.school', desc: 'Executive oversight & finances' },
    { role: 'headteacher', label: 'Headteacher / Academic Admin', email: 'headteacher@demo.school', desc: 'Moderation, exams & promotion' },
    { role: 'teacher', label: 'Primary Class Teacher', email: 'teacher@demo.school', desc: 'Basic 4A register & marks' },
    { role: 'subject_teacher', label: 'Assistant / Subject Teacher', email: 'subjectteacher@demo.school', desc: 'Science & ICT specialist' },
    { role: 'accountant', label: 'Accountant / Bursar', email: 'accountant@demo.school', desc: 'Fee billing, MoMo receipts, expenses' },
    { role: 'admin', label: 'Records Officer / Admin', email: 'admin@demo.school', desc: 'Admissions & student directories' }
  ];

  const handleReset = () => {
    if (window.confirm('Reset all demo data back to the original demonstration state? Any test records you added will be restored.')) {
      resetAllData();
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FFF8ED]/95 backdrop-blur-md border-b border-[#E7E2D9] px-4 py-2.5 flex items-center justify-between gap-3">
      {/* Left: Mobile hamburger & search trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-[#666666] hover:text-[#171717] hover:bg-stone-200/50 lg:hidden cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Button */}
        <button
          onClick={onOpenSearch}
          className="hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 bg-white border border-[#E7E2D9] rounded-xl text-xs text-[#666666] hover:border-[#FFA51F] hover:shadow-xs transition-all w-64 cursor-pointer"
        >
          <Search className="w-4 h-4 text-[#FFA51F] shrink-0" />
          <span className="truncate">Search students, classes, receipts...</span>
          <kbd className="ml-auto text-[10px] bg-stone-100 border border-stone-200 px-1.5 py-0.5 rounded text-stone-500 font-mono">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right Controls: Fast Demo Role Switcher + Reset + Notifications + Profile */}
      <div className="flex items-center gap-2.5">
        {/* Mobile Search Button */}
        <button
          onClick={onOpenSearch}
          className="sm:hidden p-2 rounded-xl text-[#666666] hover:bg-stone-200/50 cursor-pointer"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* DEMO ROLE SWITCHER PILL */}
        <div className="relative">
          <button
            onClick={() => {
              setRoleDropdownOpen(!roleDropdownOpen);
              setProfileDropdownOpen(false);
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#FFA51F]/60 rounded-xl text-xs font-bold text-[#171717] hover:bg-[#FFF8ED] transition-colors shadow-xs cursor-pointer"
            title="Switch demonstration role instantly"
          >
            <span className="w-2 h-2 rounded-full bg-[#FFA51F] animate-pulse" />
            <span className="text-[#666666] font-normal hidden md:inline">Demo Role:</span>
            <span className="text-[#B26A00] font-bold truncate max-w-[140px] capitalize">
              {currentUser.role.replace('_', ' ')}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#666666]" />
          </button>

          {/* Role Dropdown */}
          {roleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#E7E2D9] py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-[#E7E2D9] bg-[#FFF8ED]/50">
                <p className="text-xs font-bold text-[#171717]">Quick Demo Role Switcher</p>
                <p className="text-[11px] text-[#666666]">
                  Click to switch roles and explore distinct dashboards & permissions:
                </p>
              </div>
              <div className="max-h-80 overflow-y-auto py-1">
                {rolesList.map((r) => {
                  const isActive = currentUser.role === r.role;
                  return (
                    <button
                      key={r.role}
                      onClick={() => {
                        switchRole(r.role);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 flex items-start gap-2.5 transition-colors cursor-pointer ${
                        isActive ? 'bg-[#FFF8ED] border-l-4 border-l-[#FFA51F]' : 'hover:bg-stone-50'
                      }`}
                    >
                      <UserCheck
                        className={`w-4 h-4 mt-0.5 shrink-0 ${
                          isActive ? 'text-[#FFA51F]' : 'text-stone-400'
                        }`}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className={`text-xs font-bold ${isActive ? 'text-[#B26A00]' : 'text-[#171717]'}`}>
                            {r.label}
                          </p>
                        </div>
                        <p className="text-[10px] text-[#666666]">{r.desc}</p>
                        <p className="text-[10px] text-[#B26A00] font-mono mt-0.5">{r.email}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Reset Demo Data Button */}
        <button
          onClick={handleReset}
          className="p-2 rounded-xl text-[#666666] hover:text-[#171717] hover:bg-stone-200/50 cursor-pointer transition-colors"
          title="Reset Demo Data to Initial State"
        >
          <RotateCcw className="w-4 h-4 text-stone-600" />
        </button>

        {/* Notifications Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-xl text-[#666666] hover:text-[#171717] hover:bg-stone-200/50 cursor-pointer transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#DC5252] text-white text-[9px] font-extrabold flex items-center justify-center animate-pulse">
              {unreadNotificationCount}
            </span>
          )}
        </button>

        {/* User Avatar & Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setProfileDropdownOpen(!profileDropdownOpen);
              setRoleDropdownOpen(false);
            }}
            className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-[#FFA51F]/40 cursor-pointer transition-all"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover border border-[#FFA51F]"
            />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#E7E2D9] py-2 z-50 animate-in fade-in zoom-in-95 duration-150 text-xs">
              <div className="px-4 py-2 border-b border-[#E7E2D9]">
                <p className="font-bold text-[#171717]">{currentUser.name}</p>
                <p className="text-[11px] text-[#666666] font-mono">{currentUser.email}</p>
                <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FFA51F]/20 text-[#B26A00]">
                  {currentUser.title}
                </span>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    switchRole('owner');
                  }}
                  className="w-full text-left px-4 py-2 text-[#171717] hover:bg-stone-50 flex items-center gap-2 cursor-pointer"
                >
                  <ShieldAlert className="w-4 h-4 text-[#FFA51F]" />
                  <span>Switch to Owner</span>
                </button>
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    handleReset();
                  }}
                  className="w-full text-left px-4 py-2 text-[#171717] hover:bg-stone-50 flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-stone-500" />
                  <span>Reset Demo Data</span>
                </button>
              </div>
              <div className="border-t border-[#E7E2D9] pt-1">
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    window.location.href = '/login';
                  }}
                  className="w-full text-left px-4 py-2 text-[#DC5252] hover:bg-red-50 flex items-center gap-2 cursor-pointer font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out / Switch User</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
