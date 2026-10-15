import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import {
  MessageSquare,
  Send,
  Smartphone,
  Mail,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  Phone,
  AlertTriangle,
  FileText
} from 'lucide-react';

export const CommunicationPage: React.FC = () => {
  const {
    guardians,
    students,
    classes,
    parentCommunications,
    sendParentCommunication,
    currentUser
  } = useApp();

  const [channel, setChannel] = useState<'SMS' | 'Email' | 'Both'>('SMS');
  const [targetType, setTargetType] = useState<'all' | 'class' | 'individual'>('all');
  const [targetClassId, setTargetClassId] = useState('cls-b4a');
  const [targetGuardianId, setTargetGuardianId] = useState(guardians[0]?.id || 'grd-001');

  const [subjectTitle, setSubjectTitle] = useState('Term 2 Mid-Term Parent Consultation');
  const [messageBody, setMessageBody] = useState(
    'Dear Parents, please be reminded that Mid-Term break commences Friday 27th February. Open Day and academic report review takes place from 9am to 2pm.'
  );

  const templates = [
    {
      id: 'receipt',
      label: 'Fee Payment Receipt',
      title: 'Official School Fees Receipt Confirmation',
      message:
        'Dear Parent, Heritage Crown Academy confirms receipt of payment for your ward. Receipt has been posted to student ledger. Thank you.'
    },
    {
      id: 'reminder',
      label: 'Fee Arrears Reminder',
      title: 'Term 2 Fee Clearance Notice',
      message:
        'Notice: Outstanding school fee balances are due before examination clearance slips are issued. Kindly settle all balances at the bursar office or via MoMo.'
    },
    {
      id: 'absence',
      label: 'Morning Absence Notice',
      title: 'Student Attendance Notification',
      message:
        'Notice: Your ward was marked absent at today morning roll call. If this is an authorized illness or doctor visit, kindly notify the class teacher.'
    },
    {
      id: 'exam',
      label: 'Exam Results Ready',
      title: 'Terminal Academic Results Published',
      message:
        'Terminal examination reports have been approved by the Headmistress and are now accessible via school records office.'
    }
  ];

  const handleApplyTemplate = (tpl: typeof templates[0]) => {
    setSubjectTitle(tpl.title);
    setMessageBody(tpl.message);
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageBody.trim()) return;

    let recipientCount = 428;
    if (targetType === 'class') recipientCount = 32;
    if (targetType === 'individual') recipientCount = 1;

    sendParentCommunication({
      title: subjectTitle,
      message: messageBody,
      channel,
      targetType,
      targetClassId: targetType === 'class' ? targetClassId : undefined,
      targetGuardianId: targetType === 'individual' ? targetGuardianId : undefined,
      eventType: 'announcement',
      recipientCount,
      sentBy: currentUser.name
    });

    alert(`Simulated ${channel} dispatch completed! Sent to ${recipientCount} guardian(s). Delivery log updated.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E7E2D9] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#FFA51F]/20 text-[#B26A00]">
              Outbound Communication Gateway
            </span>
            <span className="text-xs text-[#666666]">Ghana Telco SMS & Email Notifications</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-[#171717] mt-1">
            Parent Communication & Broadcasts
          </h1>
          <p className="text-xs text-[#666666]">
            Dispatch official SMS and email notices to parents and guardians. Multi-child guardian linkages supported.
          </p>
        </div>
      </div>

      {/* Composer and Phone Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Message Composer (2 cols) */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Compose Outbound Parent Notice"
            subtitle="Broadcast to all guardians, specific grade cohorts, or individual parents"
          />

          <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
            {/* Template Quick Selection */}
            <div>
              <span className="text-[11px] font-bold text-[#666666] block mb-1.5">
                Quick Template Selector:
              </span>
              <div className="flex flex-wrap gap-2">
                {templates.map((tpl) => (
                  <button
                    type="button"
                    key={tpl.id}
                    onClick={() => handleApplyTemplate(tpl)}
                    className="px-2.5 py-1 rounded-lg border border-[#E7E2D9] bg-stone-50 hover:bg-[#FFF8ED] hover:border-[#FFA51F] font-semibold text-[#171717] cursor-pointer transition-all text-xs"
                  >
                    {tpl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Audience & Channel */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-100">
              <div>
                <label className="block font-bold text-[#171717] mb-1">Dispatch Channel</label>
                <div className="flex gap-2">
                  {(['SMS', 'Email', 'Both'] as const).map((ch) => (
                    <button
                      type="button"
                      key={ch}
                      onClick={() => setChannel(ch)}
                      className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        channel === ch
                          ? 'bg-[#FFA51F] text-[#171717] border-[#FFA51F]'
                          : 'bg-white border-[#E7E2D9] text-[#666666] hover:bg-stone-50'
                      }`}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#171717] mb-1">Target Audience</label>
                <div className="flex gap-2">
                  {(['all', 'class', 'individual'] as const).map((tgt) => (
                    <button
                      type="button"
                      key={tgt}
                      onClick={() => setTargetType(tgt)}
                      className={`flex-1 py-2 px-2 rounded-xl border text-xs font-bold capitalize transition-all cursor-pointer ${
                        targetType === tgt
                          ? 'bg-[#FFA51F] text-[#171717] border-[#FFA51F]'
                          : 'bg-white border-[#E7E2D9] text-[#666666] hover:bg-stone-50'
                      }`}
                    >
                      {tgt === 'all' ? 'All School' : tgt === 'class' ? 'By Class' : 'Individual'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sub-selectors */}
            {targetType === 'class' && (
              <div>
                <label className="block font-bold text-[#171717] mb-1">Select Class:</label>
                <select
                  value={targetClassId}
                  onChange={(e) => setTargetClassId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E7E2D9] bg-white font-medium"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({students.filter((s) => s.currentClassId === c.id).length} pupils)
                    </option>
                  ))}
                </select>
              </div>
            )}

            {targetType === 'individual' && (
              <div>
                <label className="block font-bold text-[#171717] mb-1">Select Guardian / Parent:</label>
                <select
                  value={targetGuardianId}
                  onChange={(e) => setTargetGuardianId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E7E2D9] bg-white font-medium"
                >
                  {guardians.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({g.relationship}) — {g.phone}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Subject */}
            <div>
              <label className="block font-bold text-[#171717] mb-1">Broadcast Title / Header</label>
              <input
                type="text"
                required
                value={subjectTitle}
                onChange={(e) => setSubjectTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E7E2D9] focus:outline-none focus:border-[#FFA51F]"
              />
            </div>

            {/* Body */}
            <div>
              <label className="block font-bold text-[#171717] mb-1">
                Message Content (SMS character count: {messageBody.length} / 160)
              </label>
              <textarea
                required
                rows={4}
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E7E2D9] focus:outline-none focus:border-[#FFA51F]"
              />
            </div>

            <div className="flex justify-end pt-2 border-t border-[#E7E2D9]">
              <Button
                variant="primary"
                size="md"
                type="submit"
                icon={<Send className="w-4 h-4" />}
              >
                Dispatch {channel} Broadcast
              </Button>
            </div>
          </form>
        </Card>

        {/* Right: Realistic Smartphone Mockup Preview */}
        <Card className="flex flex-col items-center justify-center p-6 bg-stone-100 border border-[#E7E2D9]">
          <span className="text-[11px] font-bold text-[#666666] mb-3 uppercase tracking-wider flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-[#FFA51F]" />
            Live Guardian Mobile SMS Mockup
          </span>

          {/* Smartphone Frame */}
          <div className="w-64 bg-white border-4 border-stone-800 rounded-3xl p-3 shadow-xl space-y-3">
            {/* Phone Speaker & Notch */}
            <div className="w-16 h-1 bg-stone-800 rounded-full mx-auto" />

            {/* Message App Header */}
            <div className="text-center border-b border-stone-100 pb-2">
              <span className="block font-bold text-[11px] text-[#171717]">SchoolFlow-SMS</span>
              <span className="text-[9px] text-[#666666]">Sender ID: HCA-ACCRA</span>
            </div>

            {/* SMS Bubble */}
            <div className="bg-[#FFF8ED] border border-[#FFA51F]/40 p-3 rounded-2xl rounded-tl-xs text-[11px] text-[#171717] leading-relaxed shadow-xs">
              <p className="font-bold text-[#B26A00] mb-1">{subjectTitle}</p>
              <p>{messageBody || 'Start typing message content...'}</p>
              <span className="block text-[8px] text-[#666666] text-right mt-1.5">
                Just now • Delivered
              </span>
            </div>

            <p className="text-[9px] text-center text-[#666666] italic">
              Recipient: +233 24 412 3456 (Mr. Patrick Mensah)
            </p>
          </div>
        </Card>
      </div>

      {/* Message History & Delivery Log */}
      <Card>
        <CardHeader
          title="Outbound Broadcast Delivery History"
          subtitle="Simulated telco gateway log across MTN, Telecel, and AirtelTigo networks"
        />

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F5F4] text-[#666666] font-semibold border-b border-[#E7E2D9]">
              <tr>
                <th className="p-3">Title / Subject</th>
                <th className="p-3">Channel</th>
                <th className="p-3">Scope</th>
                <th className="p-3">Recipients</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Sent By</th>
                <th className="p-3 text-center">Gateway Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {parentCommunications.map((com) => (
                <tr key={com.id} className="hover:bg-stone-50">
                  <td className="p-3 font-bold text-[#171717]">{com.title}</td>
                  <td className="p-3">
                    <Badge variant="primary" size="sm">{com.channel}</Badge>
                  </td>
                  <td className="p-3 capitalize text-[#666666]">{com.targetType}</td>
                  <td className="p-3 font-semibold text-[#171717]">
                    {com.recipientCount} guardian(s)
                  </td>
                  <td className="p-3 text-[#666666]">
                    {new Date(com.sentAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                  <td className="p-3 text-[#666666]">{com.sentBy}</td>
                  <td className="p-3 text-center">
                    <span className="inline-flex items-center gap-1 font-bold text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      DELIVERED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
