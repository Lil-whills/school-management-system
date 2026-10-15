import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  School,
  SchoolClass,
  Subject,
  Guardian,
  Student,
  ClassPlacement,
  AttendanceRecord,
  ResultSubmission,
  ReportCard,
  FeeSchedule,
  FeePayment,
  FeeAdjustment,
  Expense,
  FinancialActivity,
  NotificationItem,
  ParentCommunication,
  AuditEvent,
  AcademicYear,
  Term
} from '../types';
import { DataService } from '../services/dataService';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

interface AppContextType {
  currentUser: User;
  switchRole: (role: UserRole) => void;
  users: User[];
  school: School;
  updateSchool: (data: Partial<School>) => void;
  academicYears: AcademicYear[];
  terms: Term[];
  classes: SchoolClass[];
  addClass: (cls: Omit<SchoolClass, 'id'>) => SchoolClass;
  updateClass: (id: string, data: Partial<SchoolClass>) => void;
  subjects: Subject[];
  guardians: Guardian[];
  addGuardian: (guardian: Omit<Guardian, 'id'>) => Guardian;
  students: Student[];
  addStudent: (data: Omit<Student, 'id' | 'admissionNumber'>, placementClassId: string) => Student;
  updateStudent: (id: string, data: Partial<Student>) => void;
  classPlacements: ClassPlacement[];
  promoteStudentsBatch: (promotions: { studentId: string; newClassId: string; action: 'promote' | 'repeat' | 'transfer' }[], targetYearId: string) => void;
  attendanceRecords: AttendanceRecord[];
  saveAttendance: (record: AttendanceRecord) => void;
  resultSubmissions: ResultSubmission[];
  saveResults: (sub: ResultSubmission) => void;
  approveResults: (id: string, notes?: string) => void;
  rejectResults: (id: string, reason: string) => void;
  publishResults: (id: string) => void;
  reportCards: ReportCard[];
  feeSchedules: FeeSchedule[];
  feePayments: FeePayment[];
  recordPayment: (payment: Omit<FeePayment, 'id' | 'receiptNumber'>) => FeePayment;
  feeAdjustments: FeeAdjustment[];
  addFeeAdjustment: (adj: Omit<FeeAdjustment, 'id'>) => FeeAdjustment;
  getStudentFinancialSummary: (studentId: string) => ReturnType<typeof DataService.getStudentFinancialSummary>;
  expenses: Expense[];
  recordExpense: (data: Omit<Expense, 'id' | 'expenseNumber'>) => Expense;
  approveExpense: (id: string) => void;
  rejectExpense: (id: string, reason: string) => void;
  financialActivities: FinancialActivity[];
  addFinancialActivity: (act: Omit<FinancialActivity, 'id' | 'transactions'>) => FinancialActivity;
  addActivityTransaction: (activityId: string, tx: Omit<import('../types').ActivityTransaction, 'id' | 'activityId'>) => void;
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  parentCommunications: ParentCommunication[];
  sendParentCommunication: (data: Omit<ParentCommunication, 'id' | 'sentAt' | 'status'>) => ParentCommunication;
  auditEvents: AuditEvent[];
  resetAllData: () => void;
  toasts: ToastMessage[];
  addToast: (type: ToastMessage['type'], title: string, message?: string) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUserState] = useState<User>(() => DataService.getCurrentUser());
  const [users, setUsers] = useState<User[]>(() => DataService.getUsers());
  const [school, setSchool] = useState<School>(() => DataService.getSchool());
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>(() => DataService.getAcademicYears());
  const [terms, setTerms] = useState<Term[]>(() => DataService.getTerms());
  const [classes, setClasses] = useState<SchoolClass[]>(() => DataService.getClasses());
  const [subjects, setSubjects] = useState<Subject[]>(() => DataService.getSubjects());
  const [guardians, setGuardians] = useState<Guardian[]>(() => DataService.getGuardians());
  const [students, setStudents] = useState<Student[]>(() => DataService.getStudents());
  const [classPlacements, setClassPlacements] = useState<ClassPlacement[]>(() => DataService.getClassPlacements());
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => DataService.getAttendanceRecords());
  const [resultSubmissions, setResultSubmissions] = useState<ResultSubmission[]>(() => DataService.getResultSubmissions());
  const [reportCards, setReportCards] = useState<ReportCard[]>(() => DataService.getReportCards());
  const [feeSchedules, setFeeSchedules] = useState<FeeSchedule[]>(() => DataService.getFeeSchedules());
  const [feePayments, setFeePayments] = useState<FeePayment[]>(() => DataService.getFeePayments());
  const [feeAdjustments, setFeeAdjustments] = useState<FeeAdjustment[]>(() => DataService.getFeeAdjustments());
  const [expenses, setExpenses] = useState<Expense[]>(() => DataService.getExpenses());
  const [financialActivities, setFinancialActivities] = useState<FinancialActivity[]>(() => DataService.getFinancialActivities());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => DataService.getNotifications());
  const [parentCommunications, setParentCommunications] = useState<ParentCommunication[]>(() => DataService.getParentCommunications());
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(() => DataService.getAuditEvents());
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: ToastMessage['type'], title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const refreshAll = () => {
    setUsers(DataService.getUsers());
    setSchool(DataService.getSchool());
    setAcademicYears(DataService.getAcademicYears());
    setTerms(DataService.getTerms());
    setClasses(DataService.getClasses());
    setSubjects(DataService.getSubjects());
    setGuardians(DataService.getGuardians());
    setStudents(DataService.getStudents());
    setClassPlacements(DataService.getClassPlacements());
    setAttendanceRecords(DataService.getAttendanceRecords());
    setResultSubmissions(DataService.getResultSubmissions());
    setReportCards(DataService.getReportCards());
    setFeeSchedules(DataService.getFeeSchedules());
    setFeePayments(DataService.getFeePayments());
    setFeeAdjustments(DataService.getFeeAdjustments());
    setExpenses(DataService.getExpenses());
    setFinancialActivities(DataService.getFinancialActivities());
    setNotifications(DataService.getNotifications());
    setParentCommunications(DataService.getParentCommunications());
    setAuditEvents(DataService.getAuditEvents());
  };

  const switchRole = (role: UserRole) => {
    const updated = DataService.setCurrentUserByRole(role);
    setCurrentUserState(updated);
    addToast('info', `Switched Role to ${updated.title}`, `Now logged in as ${updated.name}`);
  };

  const updateSchool = (data: Partial<School>) => {
    const updated = DataService.updateSchool(data);
    setSchool(updated);
    addToast('success', 'School Profile Saved');
  };

  const addClass = (cls: Omit<SchoolClass, 'id'>) => {
    const newClass = DataService.addClass(cls);
    setClasses(DataService.getClasses());
    addToast('success', `Class "${newClass.name}" Created`);
    return newClass;
  };

  const updateClass = (id: string, data: Partial<SchoolClass>) => {
    DataService.updateClass(id, data);
    setClasses(DataService.getClasses());
    addToast('success', 'Class Configuration Updated');
  };

  const addGuardian = (g: Omit<Guardian, 'id'>) => {
    const newG = DataService.addGuardian(g);
    setGuardians(DataService.getGuardians());
    return newG;
  };

  const addStudent = (data: Omit<Student, 'id' | 'admissionNumber'>, placementClassId: string) => {
    const newS = DataService.addStudent(data, placementClassId);
    refreshAll();
    addToast('success', `Student Registered`, `${newS.firstName} ${newS.lastName} assigned to class.`);
    return newS;
  };

  const updateStudent = (id: string, data: Partial<Student>) => {
    DataService.updateStudent(id, data);
    setStudents(DataService.getStudents());
    addToast('success', 'Student Profile Updated');
  };

  const promoteStudentsBatch = (promotions: { studentId: string; newClassId: string; action: 'promote' | 'repeat' | 'transfer' }[], targetYearId: string) => {
    DataService.promoteStudentsBatch(promotions, targetYearId);
    refreshAll();
    addToast('success', 'Batch Promotion Completed', `Processed ${promotions.length} student promotions.`);
  };

  const saveAttendance = (record: AttendanceRecord) => {
    DataService.saveAttendanceRecord(record);
    setAttendanceRecords(DataService.getAttendanceRecords());
    setAuditEvents(DataService.getAuditEvents());
    addToast(
      'success',
      record.status === 'submitted' ? 'Attendance Submitted' : 'Attendance Saved (Draft)',
      `Register for ${record.date} recorded.`
    );
  };

  const saveResults = (sub: ResultSubmission) => {
    DataService.saveResultSubmission(sub);
    setResultSubmissions(DataService.getResultSubmissions());
    setAuditEvents(DataService.getAuditEvents());
    addToast('success', sub.status === 'submitted' ? 'Results Submitted for Moderation' : 'Marks Saved as Draft');
  };

  const approveResults = (id: string, notes?: string) => {
    DataService.approveResultSubmission(id, notes);
    setResultSubmissions(DataService.getResultSubmissions());
    setAuditEvents(DataService.getAuditEvents());
    addToast('success', 'Results Approved', 'Grades are now verified and ready for report generation.');
  };

  const rejectResults = (id: string, reason: string) => {
    DataService.rejectResultSubmission(id, reason);
    setResultSubmissions(DataService.getResultSubmissions());
    setAuditEvents(DataService.getAuditEvents());
    addToast('warning', 'Results Returned For Revision', reason);
  };

  const publishResults = (id: string) => {
    DataService.publishResultSubmission(id);
    setResultSubmissions(DataService.getResultSubmissions());
    setAuditEvents(DataService.getAuditEvents());
    addToast('success', 'Report Cards Published', 'Official terminal results published to student records.');
  };

  const recordPayment = (payment: Omit<FeePayment, 'id' | 'receiptNumber'>) => {
    const newPay = DataService.recordFeePayment(payment);
    refreshAll();
    addToast('success', 'Payment Recorded', `Receipt #${newPay.receiptNumber} generated.`);
    return newPay;
  };

  const addFeeAdjustment = (adj: Omit<FeeAdjustment, 'id'>) => {
    const newAdj = DataService.addFeeAdjustment(adj);
    refreshAll();
    addToast('success', 'Fee Adjustment Applied');
    return newAdj;
  };

  const recordExpense = (data: Omit<Expense, 'id' | 'expenseNumber'>) => {
    const exp = DataService.recordExpense(data);
    refreshAll();
    addToast(
      data.approvalStatus === 'approved' ? 'success' : 'info',
      'Expense Recorded',
      data.approvalStatus === 'pending' ? 'Expense submitted for Owner approval.' : 'Approved and posted.'
    );
    return exp;
  };

  const approveExpense = (id: string) => {
    DataService.approveExpense(id);
    refreshAll();
    addToast('success', 'Expense Approved', 'Funds disbursement authorized.');
  };

  const rejectExpense = (id: string, reason: string) => {
    DataService.rejectExpense(id, reason);
    refreshAll();
    addToast('error', 'Expense Rejected', reason);
  };

  const addFinancialActivity = (act: Omit<FinancialActivity, 'id' | 'transactions'>) => {
    const newAct = DataService.addFinancialActivity(act);
    setFinancialActivities(DataService.getFinancialActivities());
    addToast('success', 'Project / Activity Created', newAct.title);
    return newAct;
  };

  const addActivityTransaction = (activityId: string, tx: Omit<import('../types').ActivityTransaction, 'id' | 'activityId'>) => {
    DataService.addActivityTransaction(activityId, tx);
    setFinancialActivities(DataService.getFinancialActivities());
    setAuditEvents(DataService.getAuditEvents());
    addToast('success', 'Transaction Recorded', `${tx.type === 'income' ? 'Income' : 'Expense'} of GH₵${tx.amount.toLocaleString()} added.`);
  };

  const markNotificationRead = (id: string) => {
    DataService.markNotificationRead(id);
    setNotifications(DataService.getNotifications());
  };

  const markAllNotificationsRead = () => {
    DataService.markAllNotificationsRead(currentUser.role);
    setNotifications(DataService.getNotifications());
    addToast('info', 'Notifications Marked Read');
  };

  const sendParentCommunication = (data: Omit<ParentCommunication, 'id' | 'sentAt' | 'status'>) => {
    const comm = DataService.sendParentCommunication(data);
    setParentCommunications(DataService.getParentCommunications());
    setAuditEvents(DataService.getAuditEvents());
    addToast('success', 'Parent Broadcast Sent', `${data.channel} broadcast dispatched to ${data.recipientCount} guardian(s).`);
    return comm;
  };

  const resetAllData = () => {
    DataService.resetAllData();
    refreshAll();
    setCurrentUserState(DataService.getCurrentUser());
    addToast('info', 'Demo Data Reset', 'Application data restored to initial demonstration state.');
  };

  const unreadNotificationCount = notifications.filter(
    (n) => !n.read && n.targetRoles.includes(currentUser.role)
  ).length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchRole,
        users,
        school,
        updateSchool,
        academicYears,
        terms,
        classes,
        addClass,
        updateClass,
        subjects,
        guardians,
        addGuardian,
        students,
        addStudent,
        updateStudent,
        classPlacements,
        promoteStudentsBatch,
        attendanceRecords,
        saveAttendance,
        resultSubmissions,
        saveResults,
        approveResults,
        rejectResults,
        publishResults,
        reportCards,
        feeSchedules,
        feePayments,
        recordPayment,
        feeAdjustments,
        addFeeAdjustment,
        getStudentFinancialSummary: DataService.getStudentFinancialSummary,
        expenses,
        recordExpense,
        approveExpense,
        rejectExpense,
        financialActivities,
        addFinancialActivity,
        addActivityTransaction,
        notifications,
        unreadNotificationCount,
        markNotificationRead,
        markAllNotificationsRead,
        parentCommunications,
        sendParentCommunication,
        auditEvents,
        resetAllData,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
