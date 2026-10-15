import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Student } from '../../types';
import { useApp } from '../../context/AppContext';

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentToEdit?: Student | null;
}

export const StudentFormModal: React.FC<StudentFormModalProps> = ({
  isOpen,
  onClose,
  studentToEdit
}) => {
  const { classes, guardians, addStudent, updateStudent, addGuardian } = useApp();

  // Multi-step form step (1 = Student Demographics, 2 = Guardian & Emergency, 3 = Class Placement)
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('2017-05-10');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [admissionDate, setAdmissionDate] = useState('2026-01-12');
  const [address, setAddress] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('cls-b4a');

  // Guardian Fields
  const [guardianMode, setGuardianMode] = useState<'select' | 'new'>('select');
  const [selectedGuardianId, setSelectedGuardianId] = useState('');
  const [newGuardianName, setNewGuardianName] = useState('');
  const [newGuardianPhone, setNewGuardianPhone] = useState('');
  const [newGuardianEmail, setNewGuardianEmail] = useState('');
  const [newGuardianRelation, setNewGuardianRelation] = useState('Father');

  useEffect(() => {
    if (studentToEdit) {
      setFirstName(studentToEdit.firstName);
      setLastName(studentToEdit.lastName);
      setDateOfBirth(studentToEdit.dateOfBirth);
      setGender(studentToEdit.gender);
      setAdmissionDate(studentToEdit.admissionDate);
      setAddress(studentToEdit.address);
      setEmergencyContact(studentToEdit.emergencyContact);
      setSelectedClassId(studentToEdit.currentClassId);
      setSelectedGuardianId(studentToEdit.guardianId);
      setGuardianMode('select');
    } else {
      setFirstName('');
      setLastName('');
      setDateOfBirth('2017-05-10');
      setGender('Male');
      setAdmissionDate('2026-01-12');
      setAddress('East Legon, Accra');
      setEmergencyContact('+233 24 000 0000');
      setSelectedClassId(classes[0]?.id || 'cls-b4a');
      setSelectedGuardianId(guardians[0]?.id || '');
      setNewGuardianName('');
      setNewGuardianPhone('');
      setNewGuardianEmail('');
      setStep(1);
    }
  }, [studentToEdit, isOpen, classes, guardians]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalGuardianId = selectedGuardianId;

    if (guardianMode === 'new' && newGuardianName && newGuardianPhone) {
      const g = addGuardian({
        name: newGuardianName,
        phone: newGuardianPhone,
        email: newGuardianEmail || `${newGuardianName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        relationship: newGuardianRelation,
        occupation: 'Civil / Private Sector',
        address: address || 'Accra, Ghana',
        studentIds: []
      });
      finalGuardianId = g.id;
    }

    if (studentToEdit) {
      updateStudent(studentToEdit.id, {
        firstName,
        lastName,
        dateOfBirth,
        gender,
        admissionDate,
        currentClassId: selectedClassId,
        guardianId: finalGuardianId || studentToEdit.guardianId,
        emergencyContact,
        address
      });
    } else {
      addStudent(
        {
          firstName,
          lastName,
          dateOfBirth,
          gender,
          admissionDate,
          currentClassId: selectedClassId,
          guardianId: finalGuardianId || guardians[0]?.id || 'grd-001',
          emergencyContact: emergencyContact || '+233 24 123 4567',
          address: address || 'Accra, Ghana',
          status: 'active'
        },
        selectedClassId
      );
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={studentToEdit ? 'Edit Student Record' : 'Register New Student'}
      subtitle={
        studentToEdit
          ? `Updating details for ${studentToEdit.admissionNumber}`
          : 'Step-by-step Ghana GES student enrollment'
      }
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step Indicator */}
        {!studentToEdit && (
          <div className="flex items-center justify-between border-b border-[#E7E2D9] pb-4">
            {[
              { num: 1, label: '1. Demographics' },
              { num: 2, label: '2. Guardian & Contact' },
              { num: 3, label: '3. Placement & Review' }
            ].map((s) => (
              <button
                type="button"
                key={s.num}
                onClick={() => setStep(s.num as any)}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  step === s.num
                    ? 'bg-[#FFA51F] text-[#171717]'
                    : 'text-[#666666] hover:bg-stone-100'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}

        {/* Step 1: Demographics */}
        {(studentToEdit || step === 1) && (
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-[#171717]">Student Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Kwadwo"
                  className="w-full text-xs p-2.5 rounded-xl border border-[#E7E2D9] focus:outline-none focus:border-[#FFA51F]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">
                  Surname / Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Asare"
                  className="w-full text-xs p-2.5 rounded-xl border border-[#E7E2D9] focus:outline-none focus:border-[#FFA51F]"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#E7E2D9] focus:outline-none focus:border-[#FFA51F] bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#E7E2D9] focus:outline-none focus:border-[#FFA51F]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">
                  Admission Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={admissionDate}
                  onChange={(e) => setAdmissionDate(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#E7E2D9] focus:outline-none focus:border-[#FFA51F]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1">
                Residential Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Hse 42, Boundary Road, East Legon, Accra"
                className="w-full text-xs p-2.5 rounded-xl border border-[#E7E2D9] focus:outline-none focus:border-[#FFA51F]"
              />
            </div>
          </div>
        )}

        {/* Step 2: Guardian & Emergency */}
        {(studentToEdit || step === 2) && (
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-[#171717]">Guardian & Contact Details</h4>

            {!studentToEdit && (
              <div className="flex gap-4 text-xs font-semibold">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="guardianMode"
                    checked={guardianMode === 'select'}
                    onChange={() => setGuardianMode('select')}
                  />
                  <span>Select Existing Registered Guardian</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="guardianMode"
                    checked={guardianMode === 'new'}
                    onChange={() => setGuardianMode('new')}
                  />
                  <span>Register New Guardian</span>
                </label>
              </div>
            )}

            {guardianMode === 'select' ? (
              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">
                  Link Guardian <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedGuardianId}
                  onChange={(e) => setSelectedGuardianId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#E7E2D9] focus:outline-none focus:border-[#FFA51F] bg-white"
                >
                  {guardians.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({g.relationship}) — {g.phone}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-[#666666] mt-1">
                  Linking to an existing parent automatically associates any siblings.
                </p>
              </div>
            ) : (
              <div className="space-y-3 bg-[#FFF8ED]/50 p-4 rounded-xl border border-[#FFA51F]/30">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#171717] mb-1">
                      Guardian Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newGuardianName}
                      onChange={(e) => setNewGuardianName(e.target.value)}
                      placeholder="e.g. Dr. Samuel Kofi"
                      className="w-full text-xs p-2.5 rounded-xl border border-[#E7E2D9] focus:outline-none focus:border-[#FFA51F] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#171717] mb-1">
                      Relationship <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newGuardianRelation}
                      onChange={(e) => setNewGuardianRelation(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-[#E7E2D9] focus:outline-none focus:border-[#FFA51F] bg-white"
                    >
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Guardian">Legal Guardian</option>
                      <option value="Uncle">Uncle / Aunt</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#171717] mb-1">
                      Phone Number (for SMS notifications) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={newGuardianPhone}
                      onChange={(e) => setNewGuardianPhone(e.target.value)}
                      placeholder="+233 24 123 4567"
                      className="w-full text-xs p-2.5 rounded-xl border border-[#E7E2D9] focus:outline-none focus:border-[#FFA51F] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#171717] mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={newGuardianEmail}
                      onChange={(e) => setNewGuardianEmail(e.target.value)}
                      placeholder="parent@example.com"
                      className="w-full text-xs p-2.5 rounded-xl border border-[#E7E2D9] focus:outline-none focus:border-[#FFA51F] bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1">
                Emergency Contact Phone & Note <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                placeholder="+233 24 999 8888 (Uncle Mr. Boateng)"
                className="w-full text-xs p-2.5 rounded-xl border border-[#E7E2D9] focus:outline-none focus:border-[#FFA51F]"
              />
            </div>
          </div>
        )}

        {/* Step 3: Class Placement */}
        {(studentToEdit || step === 3) && (
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-[#171717]">Class Assignment & Review</h4>
            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1">
                Assign to Class <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-[#E7E2D9] focus:outline-none focus:border-[#FFA51F] bg-white font-semibold"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.level} • Room: {c.room})
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-[#F5F5F4] p-4 rounded-xl text-xs space-y-1.5">
              <p className="font-bold text-[#171717]">Summary of Enrollment</p>
              <p className="text-[#666666]">
                Student: <span className="font-semibold text-[#171717]">{firstName} {lastName}</span> ({gender})
              </p>
              <p className="text-[#666666]">
                Class: <span className="font-semibold text-[#B26A00]">{classes.find((c) => c.id === selectedClassId)?.name}</span>
              </p>
              <p className="text-[#666666]">
                Academic Year: <span className="font-semibold text-[#171717]">2025/2026 Academic Year (Term 2)</span>
              </p>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex items-center justify-between border-t border-[#E7E2D9] pt-4">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>

          <div className="flex gap-2">
            {!studentToEdit && step > 1 && (
              <Button
                variant="outline"
                type="button"
                onClick={() => setStep((step - 1) as any)}
              >
                Previous
              </Button>
            )}
            {!studentToEdit && step < 3 ? (
              <Button
                variant="primary"
                type="button"
                onClick={() => setStep((step + 1) as any)}
              >
                Next Step
              </Button>
            ) : (
              <Button variant="primary" type="submit">
                {studentToEdit ? 'Save Changes' : 'Confirm Registration'}
              </Button>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
};
