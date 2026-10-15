import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import {
  FolderKanban,
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Receipt
} from 'lucide-react';
import { FinancialActivity } from '../types';

export const FinancialActivitiesPage: React.FC = () => {
  const {
    financialActivities,
    addFinancialActivity,
    addActivityTransaction,
    currentUser
  } = useApp();

  const [selectedActivityId, setSelectedActivityId] = useState<string>(
    financialActivities[0]?.id || 'act-001'
  );

  // New Activity Modal
  const [newActivityModalOpen, setNewActivityModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<any>('Educational Trip');
  const [newBudget, setNewBudget] = useState('');
  const [newAllocated, setNewAllocated] = useState('');
  const [newStartDate, setNewStartDate] = useState('2026-03-15');
  const [newEndDate, setNewEndDate] = useState('2026-03-25');

  // New Transaction Modal
  const [newTxModalOpen, setNewTxModalOpen] = useState(false);
  const [txType, setTxType] = useState<'income' | 'expense'>('income');
  const [txTitle, setTxTitle] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [txRef, setTxRef] = useState('');

  const activeActivity =
    financialActivities.find((a) => a.id === selectedActivityId) ||
    financialActivities[0];

  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    const created = addFinancialActivity({
      title: newTitle,
      description: newDesc,
      category: newCategory,
      budget: Number(newBudget),
      fundsAllocated: Number(newAllocated || newBudget),
      incomeReceived: 0,
      expensesSpent: 0,
      outstandingObligations: 0,
      startDate: newStartDate,
      endDate: newEndDate,
      status: 'in_progress'
    });
    setNewActivityModalOpen(false);
    setSelectedActivityId(created.id);
    setNewTitle('');
    setNewDesc('');
    setNewBudget('');
  };

  const handleCreateTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeActivity) return;

    addActivityTransaction(activeActivity.id, {
      type: txType,
      title: txTitle,
      amount: Number(txAmount),
      date: new Date().toISOString().split('T')[0],
      reference: txRef || `TX-${Math.floor(1000 + Math.random() * 9000)}`,
      recordedBy: currentUser.name
    });

    setNewTxModalOpen(false);
    setTxTitle('');
    setTxAmount('');
    setTxRef('');
  };

  if (!activeActivity) return null;

  const netBalance = activeActivity.incomeReceived - activeActivity.expensesSpent;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E7E2D9] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#FFA51F]/20 text-[#B26A00]">
              Ring-Fenced Project Accounting
            </span>
            <span className="text-xs text-[#666666]">Ghana Basic Education Key Differentiator</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-[#171717] mt-1">
            Financial Activities & Project Ledgers
          </h1>
          <p className="text-xs text-[#666666]">
            Dedicated income and expense tracking for educational tours, sports festivals, and infrastructure projects.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['owner', 'accountant'].includes(currentUser.role) && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setNewActivityModalOpen(true)}
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              New School Activity
            </Button>
          )}
        </div>
      </div>

      {/* Activity Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {financialActivities.map((act) => {
          const isSelected = act.id === activeActivity.id;
          const rem = act.incomeReceived - act.expensesSpent;

          return (
            <div
              key={act.id}
              onClick={() => setSelectedActivityId(act.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer text-xs space-y-2 ${
                isSelected
                  ? 'bg-white border-[#FFA51F] shadow-md ring-2 ring-[#FFA51F]/20'
                  : 'bg-white/70 border-[#E7E2D9] hover:border-stone-400'
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFF8ED] text-[#B26A00]">
                  {act.category}
                </span>
                <Badge variant={act.status === 'reconciled' ? 'success' : 'primary'} size="sm">
                  {act.status.toUpperCase()}
                </Badge>
              </div>

              <h4 className="font-bold text-sm text-[#171717] line-clamp-1">{act.title}</h4>
              <p className="text-[#666666] line-clamp-2 leading-relaxed">{act.description}</p>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <span className="text-[#666666] block text-[10px]">Net Remaining</span>
                  <span className="font-extrabold text-sm text-[#B26A00]">
                    GH₵ {rem.toLocaleString()}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[#666666] block text-[10px]">Budget</span>
                  <span className="font-semibold text-[#171717]">
                    GH₵ {act.budget.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Activity Detail Workspace */}
      <div className="space-y-6">
        {/* KPI Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4" hoverable>
            <p className="text-xs font-semibold text-[#666666]">Approved Budget</p>
            <h3 className="text-2xl font-extrabold text-[#171717] mt-1">
              GH₵ {activeActivity.budget.toLocaleString()}
            </h3>
            <p className="text-[11px] text-[#666666] mt-2">Board Authorized</p>
          </Card>

          <Card className="p-4" hoverable>
            <p className="text-xs font-semibold text-[#666666]">Income Collected</p>
            <h3 className="text-2xl font-extrabold text-emerald-700 mt-1">
              GH₵ {activeActivity.incomeReceived.toLocaleString()}
            </h3>
            <p className="text-[11px] text-emerald-800 font-semibold mt-2">
              From student tour levies & sponsorships
            </p>
          </Card>

          <Card className="p-4" hoverable>
            <p className="text-xs font-semibold text-[#666666]">Disbursed Expenses</p>
            <h3 className="text-2xl font-extrabold text-[#171717] mt-1">
              GH₵ {activeActivity.expensesSpent.toLocaleString()}
            </h3>
            <p className="text-[11px] text-[#666666] mt-2">Transport, food & supplies</p>
          </Card>

          <Card className="p-4" hoverable>
            <p className="text-xs font-semibold text-[#666666]">Remaining Funds</p>
            <h3 className="text-2xl font-extrabold text-[#B26A00] mt-1">
              GH₵ {netBalance.toLocaleString()}
            </h3>
            <p className="text-[11px] text-[#666666] mt-2">
              Before refunds or obligations (Not profit)
            </p>
          </Card>
        </div>

        {/* Transactions Table for this Activity */}
        <Card>
          <CardHeader
            title={`Transaction Register: ${activeActivity.title}`}
            subtitle="Transparent audit log of all income entries and disbursements specific to this activity"
            action={
              ['owner', 'accountant'].includes(currentUser.role) && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setNewTxModalOpen(true)}
                  icon={<Plus className="w-3.5 h-3.5" />}
                >
                  Record Project Transaction
                </Button>
              )
            }
          />

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F5F4] text-[#666666] font-semibold border-b border-[#E7E2D9]">
                <tr>
                  <th className="p-3">Type</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Reference</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Recorded By</th>
                  <th className="p-3 text-right">Inflow / Outflow</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {activeActivity.transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-stone-50">
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center gap-1 font-bold text-xs px-2 py-0.5 rounded-full ${
                          tx.type === 'income'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-100 text-[#171717]'
                        }`}
                      >
                        {tx.type === 'income' ? (
                          <ArrowDownRight className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <ArrowUpRight className="w-3.5 h-3.5 text-[#DC5252]" />
                        )}
                        {tx.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-[#171717]">{tx.title}</td>
                    <td className="p-3 font-mono text-[#666666]">{tx.reference}</td>
                    <td className="p-3 text-[#666666]">{tx.date}</td>
                    <td className="p-3 text-[#666666]">{tx.recordedBy}</td>
                    <td
                      className={`p-3 text-right font-mono font-extrabold text-sm ${
                        tx.type === 'income' ? 'text-emerald-700' : 'text-[#171717]'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : '-'} GH₵ {tx.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* New Activity Modal */}
      <Modal
        isOpen={newActivityModalOpen}
        onClose={() => setNewActivityModalOpen(false)}
        title="Create School Activity / Project Ledger"
        subtitle="Initialize ring-fenced accounting budget for tours, sports, or school projects"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateActivity} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#171717] mb-1">
              Activity Title *
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Annual Speech & Prize Giving Day"
              className="w-full p-2.5 rounded-xl border border-[#E7E2D9] focus:outline-none focus:border-[#FFA51F]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#171717] mb-1">
              Description / Objectives
            </label>
            <textarea
              rows={2}
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Summary of student scope and logistics..."
              className="w-full p-2 rounded-xl border border-[#E7E2D9]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#171717] mb-1">
                Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-[#E7E2D9] bg-white"
              >
                <option value="Educational Trip">Educational Trip</option>
                <option value="Sports Festival">Sports Festival</option>
                <option value="School Event">School Event</option>
                <option value="Building Repair">Building Repair</option>
                <option value="Equipment Purchase">Equipment Purchase</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-[#171717] mb-1">
                Approved Budget (GH₵) *
              </label>
              <input
                type="number"
                required
                value={newBudget}
                onChange={(e) => setNewBudget(e.target.value)}
                placeholder="e.g. 5000"
                className="w-full p-2.5 rounded-xl border border-[#E7E2D9] font-bold"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#E7E2D9]">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setNewActivityModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Create Project Ledger
            </Button>
          </div>
        </form>
      </Modal>

      {/* New Transaction Modal */}
      <Modal
        isOpen={newTxModalOpen}
        onClose={() => setNewTxModalOpen(false)}
        title="Record Project Transaction"
        subtitle={`Add entry to: ${activeActivity.title}`}
        maxWidth="md"
      >
        <form onSubmit={handleCreateTransaction} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#171717] mb-1">Transaction Nature</label>
            <div className="flex gap-4 font-bold">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="txType"
                  checked={txType === 'income'}
                  onChange={() => setTxType('income')}
                />
                <span className="text-emerald-700">Income / Contribution Inflow</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="txType"
                  checked={txType === 'expense'}
                  onChange={() => setTxType('expense')}
                />
                <span className="text-[#DC5252]">Expense Outflow</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#171717] mb-1">Description *</label>
            <input
              type="text"
              required
              value={txTitle}
              onChange={(e) => setTxTitle(e.target.value)}
              placeholder="e.g. Bus Tolls & Refreshment packs"
              className="w-full p-2.5 rounded-xl border border-[#E7E2D9]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#171717] mb-1">Amount (GH₵) *</label>
              <input
                type="number"
                required
                value={txAmount}
                onChange={(e) => setTxAmount(e.target.value)}
                placeholder="e.g. 800"
                className="w-full p-2.5 rounded-xl border border-[#E7E2D9] font-bold"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#171717] mb-1">Receipt / Voucher Ref</label>
              <input
                type="text"
                value={txRef}
                onChange={(e) => setTxRef(e.target.value)}
                placeholder="e.g. VCH-0042"
                className="w-full p-2.5 rounded-xl border border-[#E7E2D9] font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#E7E2D9]">
            <Button variant="ghost" type="button" onClick={() => setNewTxModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Post Transaction
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
