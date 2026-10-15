export type UserRole = 
  | 'owner' 
  | 'headteacher' 
  | 'teacher' 
  | 'subject_teacher' 
  | 'accountant' 
  | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone: string;
  title: string;
  assignedClassId?: string; // e.g. for primary class teacher
  assignedSubjectIds?: string[]; // e.g. for subject teacher
  schoolId: string;
}

export interface School {
  id: string;
  name: string;
  motto: string;
  gesRegistrationNo: string;
  address: string;
  phone: string;
  email: string;
  currentAcademicYearId: string;
  currentTermId: string;
  logoUrl?: string;
  currency: string;
}

export interface AcademicYear {
  id: string;
  name: string; // e.g. "2025/2026"
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  status: 'active' | 'completed' | 'upcoming';
}

export interface Term {
  id: string;
  academicYearId: string;
  name: string; // "Term 1", "Term 2", "Term 3"
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export type ClassLevel = 'Nursery' | 'KG' | 'Primary' | 'JHS';

export interface SchoolClass {
  id: string;
  name: string; // e.g. "Basic 4A", "KG 2", "JHS 1B"
  level: ClassLevel;
  gradeNumber: number; // For progression: 1=Nursery1, 2=Nursery2, 3=KG1, 4=KG2, 5=Basic 1 ... 10=Basic 6, 11=JHS 1, 12=JHS 2, 13=JHS 3
  capacity: number;
  classTeacherId: string;
  room: string;
}

export interface Subject {
  id: string;
  code: string; // "ENG-P4", "MTH-P4", "SCI-P4", "COMP-JHS"
  name: string;
  department: string;
  classIds: string[];
}

export interface TeacherAssignment {
  id: string;
  teacherId: string;
  subjectId: string;
  classId: string;
  role: 'primary' | 'assistant' | 'subject_specialist';
}

export interface Guardian {
  id: string;
  name: string;
  phone: string;
  email: string;
  relationship: string; // "Father", "Mother", "Guardian", "Uncle"
  occupation: string;
  address: string;
  studentIds: string[]; // Linked students
}

export interface Student {
  id: string;
  admissionNumber: string; // e.g. "HCA/2023/048"
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female';
  admissionDate: string;
  currentClassId: string;
  guardianId: string;
  emergencyContact: string;
  address: string;
  status: 'active' | 'transferred' | 'withdrawn' | 'graduated';
  photoUrl?: string;
  medicalNotes?: string;
}

export interface ClassPlacement {
  id: string;
  studentId: string;
  classId: string;
  academicYearId: string;
  termId: string;
  status: 'active' | 'promoted' | 'repeated' | 'transferred';
  promotedAt?: string;
  previousClassId?: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceEntry {
  studentId: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface AttendanceRecord {
  id: string;
  classId: string;
  date: string; // YYYY-MM-DD
  status: 'draft' | 'submitted';
  submittedBy: string;
  submittedAt?: string;
  entries: AttendanceEntry[];
  correctionReason?: string;
  correctionHistory?: {
    date: string;
    changedBy: string;
    reason: string;
  }[];
}

export interface Assessment {
  id: string;
  title: string; // "Mid-Term Test", "End of Term Exam", "Classwork & Homework"
  termId: string;
  academicYearId: string;
  subjectId: string;
  classId: string;
  maxScore: number;
  weightPercentage: number; // e.g. 30% for class, 70% for exam
  date: string;
}

export interface StudentMarkEntry {
  studentId: string;
  classScore: number; // out of 30 or 50
  examScore: number; // out of 70 or 50
  totalScore: number; // 0-100
  grade: string; // 1 to 9 (GES) or A, B, C...
  remark: string; // "Excellent", "Very Good", "Credit", "Pass", "Needs Improvement"
}

export interface ResultSubmission {
  id: string;
  classId: string;
  subjectId: string;
  termId: string;
  academicYearId: string;
  submittedBy: string;
  submittedAt: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'published';
  reviewNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  marks: StudentMarkEntry[];
}

export interface ReportCard {
  id: string;
  studentId: string;
  classId: string;
  termId: string;
  academicYearId: string;
  overallScore: number;
  averageScore: number;
  position: string;
  totalStudentsInClass: number;
  attendancePresent: number;
  attendanceTotal: number;
  classTeacherRemark: string;
  headteacherRemark: string;
  isPublished: boolean;
  publishedAt?: string;
}

export interface FeeSchedule {
  id: string;
  academicYearId: string;
  termId: string;
  classId: string; // or "all"
  category: 'Tuition' | 'PTA Levy' | 'ICT & Science Lab' | 'Feeding & Lunch' | 'Uniform & Books' | 'Examination Fee';
  amount: number;
  dueDate: string;
}

export interface FeePayment {
  id: string;
  receiptNumber: string; // e.g. "REC-2026-0042"
  studentId: string;
  amountPaid: number;
  paymentMethod: 'Cash' | 'Bank Transfer' | 'Mobile Money' | 'Cheque';
  paymentDate: string;
  transactionRef: string;
  recordedBy: string;
  notes?: string;
  termId: string;
  academicYearId: string;
}

export interface FeeAdjustment {
  id: string;
  studentId: string;
  amount: number; // negative for discount/waiver, positive for fine
  type: 'discount' | 'scholarship' | 'waiver' | 'penalty';
  reason: string;
  approvedBy: string;
  date: string;
}

export interface Expense {
  id: string;
  expenseNumber: string; // "EXP-2026-010"
  title: string;
  category: 'Staff Welfare' | 'Utilities & Internet' | 'Facility Maintenance' | 'Teaching Materials' | 'Administrative' | 'Transport & Fuel' | 'Security' | 'School Event';
  amount: number;
  date: string;
  paymentMethod: 'Bank Transfer' | 'Cash' | 'Mobile Money' | 'Cheque';
  vendor: string;
  referenceNo: string;
  attachmentName?: string;
  enteredBy: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  approvedBy?: string;
  approvedAt?: string;
  relatedActivityId?: string;
}

export interface ActivityTransaction {
  id: string;
  activityId: string;
  type: 'income' | 'expense';
  title: string;
  amount: number;
  date: string;
  reference: string;
  recordedBy: string;
}

export interface FinancialActivity {
  id: string;
  title: string;
  description: string;
  category: 'Educational Trip' | 'Sports Festival' | 'Building Repair' | 'Equipment Purchase' | 'School Event';
  budget: number;
  fundsAllocated: number;
  incomeReceived: number;
  expensesSpent: number;
  outstandingObligations: number;
  startDate: string;
  endDate: string;
  status: 'in_progress' | 'reconciled' | 'closed';
  transactions: ActivityTransaction[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  targetRoles: UserRole[];
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface ParentCommunication {
  id: string;
  title: string;
  message: string;
  channel: 'SMS' | 'Email' | 'Both';
  targetType: 'all' | 'class' | 'individual';
  targetClassId?: string;
  targetGuardianId?: string;
  eventType: 'payment_receipt' | 'fee_reminder' | 'absence' | 'announcement' | 'exam_results';
  status: 'delivered' | 'sent' | 'failed';
  recipientCount: number;
  sentAt: string;
  sentBy: string;
}

export interface AuditEvent {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  details: string;
  timestamp: string;
}
