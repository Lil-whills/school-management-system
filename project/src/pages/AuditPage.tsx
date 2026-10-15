import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { History, ShieldCheck, Filter, Search } from 'lucide-react';

export const AuditPage: React.FC = () => {
  const { auditEvents } = useApp();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filtered = auditEvents.filter((ev) => {
    const matchesSearch =
      ev.action.toLowerCase().includes(search.toLowerCase()) ||
      ev.details.toLowerCase().includes(search.toLowerCase()) ||
      ev.actorName.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || ev.actorRole === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E7E2D9] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#FFA51F]/20 text-[#B26A00]">
              Governance & Integrity
            </span>
            <span className="text-xs text-[#666666]">Ghana Basic School Immutable Activity Log</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-[#171717] mt-1">
            System Audit Trail
          </h1>
          <p className="text-xs text-[#666666]">
            Transparent log tracking fee collections, expense authorizations, mark moderation, and student admissions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Audit Logging Active
          </span>
        </div>
      </div>

      {/* Search & Role Filter */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#666666] absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search audit actions, staff names, or details..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-[#E7E2D9] focus:outline-none focus:border-[#FFA51F] bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#666666] shrink-0" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="text-xs p-2.5 rounded-xl border border-[#E7E2D9] bg-white font-medium"
            >
              <option value="all">All Roles</option>
              <option value="owner">Proprietor / Owner</option>
              <option value="headteacher">Headteacher</option>
              <option value="teacher">Class Teacher</option>
              <option value="subject_teacher">Subject Teacher</option>
              <option value="accountant">Accountant / Bursar</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Audit List */}
      <Card>
        <CardHeader
          title="Recorded Audit Transactions"
          subtitle={`Showing ${filtered.length} logged system events with actor timestamps`}
        />

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F5F4] text-[#666666] font-semibold border-b border-[#E7E2D9]">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Action</th>
                <th className="p-3">Actor & Role</th>
                <th className="p-3">Event Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50">
                  <td className="p-3 font-mono text-[#666666] whitespace-nowrap">
                    {new Date(item.timestamp).toLocaleString([], {
                      dateStyle: 'short',
                      timeStyle: 'medium'
                    })}
                  </td>
                  <td className="p-3 font-bold text-[#171717]">{item.action}</td>
                  <td className="p-3">
                    <span className="font-semibold text-[#171717] block">{item.actorName}</span>
                    <Badge variant="primary" size="sm">
                      {item.actorRole.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </td>
                  <td className="p-3 text-[#171717] leading-relaxed">{item.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
