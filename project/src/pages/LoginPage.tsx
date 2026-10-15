import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { Button } from '../components/common/Button';
import {
  School,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  ArrowRight,
  BookOpen,
  DollarSign,
  UserCheck
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { switchRole } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('owner@demo.school');
  const [password, setPassword] = useState('demo123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');

  const demoAccounts: {
    role: UserRole;
    name: string;
    email: string;
    roleLabel: string;
    description: string;
    icon: React.ReactNode;
  }[] = [
    {
      role: 'owner',
      name: 'Dr. Kwame Mensah',
      email: 'owner@demo.school',
      roleLabel: 'School Owner / Proprietor',
      description: 'Executive KPIs, fee collections, expense approvals & project balances',
      icon: <ShieldCheck className="w-5 h-5 text-[#B26A00]" />
    },
    {
      role: 'headteacher',
      name: 'Mrs. Comfort Addo',
      email: 'headteacher@demo.school',
      roleLabel: 'Headteacher / Academic Admin',
      description: 'Result moderation & approval, promotion batches, curriculum config',
      icon: <GraduationCap className="w-5 h-5 text-indigo-700" />
    },
    {
      role: 'teacher',
      name: 'Mr. Samuel Osei',
      email: 'teacher@demo.school',
      roleLabel: 'Primary Class Teacher (Basic 4A)',
      description: 'Daily class register, attendance submission, subject mark entries',
      icon: <BookOpen className="w-5 h-5 text-emerald-700" />
    },
    {
      role: 'subject_teacher',
      name: 'Ms. Akua Boateng',
      email: 'subjectteacher@demo.school',
      roleLabel: 'Assistant / Subject Teacher',
      description: 'Science & ICT marks entry, draft saving, revision feedback',
      icon: <Sparkles className="w-5 h-5 text-purple-700" />
    },
    {
      role: 'accountant',
      name: 'Mr. Emmanuel Donkor',
      email: 'accountant@demo.school',
      roleLabel: 'Accountant / Bursar',
      description: 'Fee collection, MoMo receipts, project accounting (Kakum tour), expenses',
      icon: <DollarSign className="w-5 h-5 text-emerald-600" />
    },
    {
      role: 'admin',
      name: 'Ms. Grace Asante',
      email: 'admin@demo.school',
      roleLabel: 'School Administrator / Records',
      description: 'Multi-step student admissions, guardian linkages, class placements',
      icon: <UserCheck className="w-5 h-5 text-blue-700" />
    }
  ];

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = demoAccounts.find((d) => d.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      switchRole(matched.role);
      navigate('/');
    } else {
      setError('Invalid demo credentials. Select a quick demo role below.');
    }
  };

  const handleQuickLogin = (role: UserRole) => {
    switchRole(role);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#FFF8ED] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Brand Crest */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#FFA51F] text-[#171717] shadow-lg shadow-[#FFA51F]/30 mb-4">
          <School className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-[#171717] tracking-tight">
          SchoolFlow
        </h1>
        <p className="mt-1 text-xs text-[#666666]">
          Commercial Basic School Management System • Ghana Edition
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        {/* Login Form Box */}
        <div className="bg-white py-8 px-6 shadow-xl shadow-stone-200/50 rounded-3xl border border-[#E7E2D9] sm:px-10">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-[#171717]">Sign in to your portal</h2>
            <p className="text-xs text-[#666666] mt-0.5">
              Enter credentials or select a demonstration identity below.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-[#DC5252]">
              {error}
            </div>
          )}

          <form onSubmit={handleStandardLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1">
                Demo Email or Username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#666666] absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-[#E7E2D9] focus:outline-none focus:border-[#FFA51F] bg-[#FFF8ED]/30"
                  placeholder="name@demo.school"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#666666] absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs pl-9 pr-10 py-2.5 rounded-xl border border-[#E7E2D9] focus:outline-none focus:border-[#FFA51F] bg-[#FFF8ED]/30"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#666666] hover:text-[#171717]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-[#666666] mt-1">Default demo password: <span className="font-mono font-bold text-[#171717]">demo123</span></p>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-stone-300 text-[#FFA51F] focus:ring-[#FFA51F]"
                />
                <span className="text-[#666666]">Remember this device</span>
              </label>
              <span className="text-[11px] text-[#B26A00] font-semibold">Demo Sandbox Mode</span>
            </div>

            <Button variant="primary" size="lg" className="w-full mt-2" type="submit">
              Sign In to Dashboard
            </Button>
          </form>

          {/* Quick Demo Access Options */}
          <div className="mt-8 pt-6 border-t border-[#E7E2D9]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold text-[#171717] uppercase tracking-wider">
                1-Click Demo Accounts (Fast Presentation)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFA51F]/20 text-[#B26A00] font-bold">
                Instant Access
              </span>
            </div>
            <p className="text-xs text-[#666666] mb-4">
              Switch roles to present the distinct workflows to school owners, headteachers, teachers, and bursars:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {demoAccounts.map((acc) => (
                <div
                  key={acc.role}
                  onClick={() => handleQuickLogin(acc.role)}
                  className="p-3 rounded-xl border border-[#E7E2D9] hover:border-[#FFA51F] hover:bg-[#FFF8ED] transition-all cursor-pointer group flex items-start gap-2.5"
                >
                  <div className="p-2 rounded-lg bg-stone-100 group-hover:bg-white shrink-0">
                    {acc.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-[#171717] group-hover:text-[#B26A00] truncate">
                      {acc.roleLabel}
                    </p>
                    <p className="text-[11px] text-[#171717] font-medium">{acc.name}</p>
                    <p className="text-[10px] text-[#666666] line-clamp-2 mt-0.5 leading-tight">
                      {acc.description}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-[#FFA51F] group-hover:translate-x-0.5 transition-all self-center" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-[#666666] mt-6">
          Heritage Crown Academy • Ghana Basic Education Management Prototype
        </p>
      </div>
    </div>
  );
};
