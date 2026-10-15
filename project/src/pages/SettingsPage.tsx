import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import {
  Settings,
  School,
  Calendar,
  Award,
  Users,
  RotateCcw,
  Save,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { school, updateSchool, users, academicYears, terms, resetAllData } = useApp();

  const [name, setName] = useState(school.name);
  const [motto, setMotto] = useState(school.motto);
  const [gesReg, setGesReg] = useState(school.gesRegistrationNo);
  const [address, setAddress] = useState(school.address);
  const [phone, setPhone] = useState(school.phone);
  const [email, setEmail] = useState(school.email);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchool({
      name,
      motto,
      gesRegistrationNo: gesReg,
      address,
      phone,
      email
    });
  };

  const handleReset = () => {
    if (
      window.confirm(
        'Are you sure you want to restore demo data back to factory state? Any custom records will be refreshed.'
      )
    ) {
      resetAllData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E7E2D9] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#FFA51F]/20 text-[#B26A00]">
              Configuration & Administration
            </span>
            <span className="text-xs text-[#666666]">School Identity & Operational Defaults</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-[#171717] mt-1">
            SchoolFlow System Settings
          </h1>
          <p className="text-xs text-[#666666]">
            Configure school branding, Ghana Education Service accreditation, grading scales, and demo states.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          icon={<RotateCcw className="w-3.5 h-3.5" />}
        >
          Reset Demo Data
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* School Profile Form (2 cols) */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="School Profile & Accreditation Details"
            subtitle="These details appear on official receipts, terminal report cards, and SMS broadcast sender IDs"
          />

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[#171717] mb-1">
                Official School Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E7E2D9] focus:outline-none focus:border-[#FFA51F] font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[#171717] mb-1">
                  School Motto
                </label>
                <input
                  type="text"
                  value={motto}
                  onChange={(e) => setMotto(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E7E2D9] focus:outline-none focus:border-[#FFA51F]"
                />
              </div>
              <div>
                <label className="block font-bold text-[#171717] mb-1">
                  Ghana Education Service (GES) Registration No *
                </label>
                <input
                  type="text"
                  required
                  value={gesReg}
                  onChange={(e) => setGesReg(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E7E2D9] focus:outline-none focus:border-[#FFA51F] font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#171717] mb-1">
                Campus Physical Address *
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E7E2D9] focus:outline-none focus:border-[#FFA51F]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[#171717] mb-1">
                  Official Phone Lines *
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E7E2D9] focus:outline-none focus:border-[#FFA51F]"
                />
              </div>
              <div>
                <label className="block font-bold text-[#171717] mb-1">
                  Official Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E7E2D9] focus:outline-none focus:border-[#FFA51F]"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#E7E2D9]">
              <Button
                variant="primary"
                type="submit"
                icon={<Save className="w-3.5 h-3.5" />}
              >
                Save School Configuration
              </Button>
            </div>
          </form>
        </Card>

        {/* Right: Academic Grading & Active Session */}
        <div className="space-y-6">
          {/* Active Session Card */}
          <Card>
            <CardHeader
              title="Active Academic Term"
              subtitle="Current operational session"
            />
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-[#FFF8ED] rounded-xl border border-[#FFA51F]/30 space-y-1">
                <span className="font-bold text-[#B26A00] block text-sm">
                  2025/2026 Academic Year
                </span>
                <span className="text-[#171717] font-semibold block">
                  Term 2 (January – April 2026)
                </span>
                <span className="text-[11px] text-[#666666] block">
                  Status: Mid-Term Moderation Period
                </span>
              </div>
            </div>
          </Card>

          {/* Ghana Basic Education Grading Scale (1-9) */}
          <Card>
            <CardHeader
              title="Ghana GES 9-Point Scale"
              subtitle="Standard Basic Education assessment moderation"
            />
            <div className="space-y-1.5 text-xs">
              {[
                { grade: 'Grade 1', range: '80% – 100%', remark: 'Highest / Excellent' },
                { grade: 'Grade 2', range: '70% – 79%', remark: 'Higher / Very Good' },
                { grade: 'Grade 3', range: '65% – 69%', remark: 'High / Good' },
                { grade: 'Grade 4', range: '60% – 64%', remark: 'High Average / Credit' },
                { grade: 'Grade 5', range: '50% – 59%', remark: 'Average / Pass' },
                { grade: 'Grade 6', range: '45% – 49%', remark: 'Low Average' },
                { grade: 'Grade 7-9', range: 'Below 45%', remark: 'Remedial' }
              ].map((g) => (
                <div
                  key={g.grade}
                  className="flex items-center justify-between p-2 rounded-lg bg-stone-50 text-[11px]"
                >
                  <span className="font-bold text-[#171717]">{g.grade}</span>
                  <span className="font-mono text-[#666666]">{g.range}</span>
                  <span className="font-semibold text-[#B26A00]">{g.remark}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Staff Accounts & Demonstration Identities */}
      <Card>
        <CardHeader
          title="Demonstration Staff Accounts & Permissions"
          subtitle="Pre-seeded roles for presentation to school proprietors, headteachers, and accountants"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {users.map((u) => (
            <div
              key={u.id}
              className="p-3.5 rounded-xl border border-[#E7E2D9] bg-white space-y-2"
            >
              <div className="flex items-center gap-2.5">
                <img
                  src={u.avatar}
                  alt={u.name}
                  className="w-9 h-9 rounded-full object-cover border border-[#FFA51F]"
                />
                <div>
                  <h4 className="font-bold text-[#171717]">{u.name}</h4>
                  <Badge variant="primary" size="sm">{u.title}</Badge>
                </div>
              </div>
              <div className="text-[11px] text-[#666666] space-y-0.5 pt-1">
                <p>Email: <span className="font-mono text-[#171717]">{u.email}</span></p>
                <p>Role: <span className="font-semibold text-[#B26A00] uppercase">{u.role.replace('_', ' ')}</span></p>
                <p>Demo Password: <span className="font-mono font-bold text-[#171717]">demo123</span></p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
