import {
  School,
  User,
  UserRole,
  AcademicYear,
  Term,
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
  AuditEvent
} from '../types';

import {
  initialSchool,
  initialUsers,
  initialAcademicYears,
  initialTerms,
  initialClasses,
  initialSubjects,
  initialGuardians,
  initialStudents,
  initialClassPlacements,
  initialFeeSchedules,
  initialFeePayments,
  initialFeeAdjustments,
  initialExpenses,
  initialFinancialActivities,
  initialAttendanceRecords,
  initialResultSubmissions,
  initialReportCards,
  initialNotifications,
  initialParentCommunications,
  initialAuditEvents
} from '../mockData/initialData';

const STORAGE_KEYS = {
  CURRENT_USER: 'schoolflow_current_user',
  SCHOOL: 'schoolflow_school',
  USERS: 'schoolflow_users',
  ACADEMIC_YEARS: 'schoolflow_academic_years',
  TERMS: 'schoolflow_terms',
  CLASSES: 'schoolflow_classes',
  SUBJECTS: 'schoolflow_subjects',
  GUARDIANS: 'schoolflow_guardians',
  STUDENTS: 'schoolflow_students',
  PLACEMENTS: 'schoolflow_placements',
  FEE_SCHEDULES: 'schoolflow_fee_schedules',
  PAYMENTS: 'schoolflow_payments',
  ADJUSTMENTS: 'schoolflow_adjustments',
  EXPENSES: 'schoolflow_expenses',
  ACTIVITIES: 'schoolflow_activities',
  ATTENDANCE: 'schoolflow_attendance',
  RESULTS: 'schoolflow_results',
  REPORT_CARDS: 'schoolflow_report_cards',
  NOTIFICATIONS: 'schoolflow_notifications',
  COMMUNICATIONS: 'schoolflow_communications',
  AUDIT: 'schoolflow_audit'
};

function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return fallback;
  }
}

function setItem<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error writing ${key} to localStorage:`, err);
  }
}

export const DataService = {
  // Reset all data to factory initial state
  resetAllData: () => {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
  },

  // Current User / Session
  getCurrentUser: (): User => {
    return getItem<User>(STORAGE_KEYS.CURRENT_USER, initialUsers[0]);
  },
  setCurrentUser: (user: User): void => {
    setItem(STORAGE_KEYS.CURRENT_USER, user);
  },
  setCurrentUserByRole: (role: UserRole): User => {
    const users = DataService.getUsers();
    const found = users.find((u) => u.role === role) || users[0];
    DataService.setCurrentUser(found);
    return found;
  },

  // School
  getSchool: (): School => getItem<School>(STORAGE_KEYS.SCHOOL, initialSchool),
  updateSchool: (data: Partial<School>): School => {
    const current = DataService.getSchool();
    const updated = { ...current, ...data };
    setItem(STORAGE_KEYS.SCHOOL, updated);
    DataService.logAudit('School Settings Updated', `Updated school profile details.`);
    return updated;
  },

  // Users
  getUsers: (): User[] => getItem<User[]>(STORAGE_KEYS.USERS, initialUsers),

  // Academic Years & Terms
  getAcademicYears: (): AcademicYear[] => getItem<AcademicYear[]>(STORAGE_KEYS.ACADEMIC_YEARS, initialAcademicYears),
  getTerms: (): Term[] => getItem<Term[]>(STORAGE_KEYS.TERMS, initialTerms),

  // Classes & Subjects
  getClasses: (): SchoolClass[] => getItem<SchoolClass[]>(STORAGE_KEYS.CLASSES, initialClasses),
  addClass: (cls: Omit<SchoolClass, 'id'>): SchoolClass => {
    const classes = DataService.getClasses();
    const newClass: SchoolClass = { ...cls, id: `cls-${Date.now()}` };
    const updated = [...classes, newClass];
    setItem(STORAGE_KEYS.CLASSES, updated);
    DataService.logAudit('Class Created', `Created new class: ${newClass.name}`);
    return newClass;
  },
  updateClass: (id: string, data: Partial<SchoolClass>): void => {
    const classes = DataService.getClasses();
    const updated = classes.map((c) => (c.id === id ? { ...c, ...data } : c));
    setItem(STORAGE_KEYS.CLASSES, updated);
    DataService.logAudit('Class Updated', `Updated class configuration for ID: ${id}`);
  },

  getSubjects: (): Subject[] => getItem<Subject[]>(STORAGE_KEYS.SUBJECTS, initialSubjects),

  // Guardians
  getGuardians: (): Guardian[] => getItem<Guardian[]>(STORAGE_KEYS.GUARDIANS, initialGuardians),
  addGuardian: (guardian: Omit<Guardian, 'id'>): Guardian => {
    const list = DataService.getGuardians();
    const newGuardian: Guardian = { ...guardian, id: `grd-${Date.now()}` };
    setItem(STORAGE_KEYS.GUARDIANS, [...list, newGuardian]);
    return newGuardian;
  },
  updateGuardian: (id: string, data: Partial<Guardian>): void => {
    const list = DataService.getGuardians();
    setItem(STORAGE_KEYS.GUARDIANS, list.map(g => g.id === id ? { ...g, ...data } : g));
  },

  // Students
  getStudents: (): Student[] => getItem<Student[]>(STORAGE_KEYS.STUDENTS, initialStudents),
  getStudentById: (id: string): Student | undefined => {
    return DataService.getStudents().find((s) => s.id === id);
  },
  addStudent: (data: Omit<Student, 'id' | 'admissionNumber'>, placementClassId: string): Student => {
    const students = DataService.getStudents();
    const yearPrefix = new Date().getFullYear();
    const seq = String(students.length + 1).padStart(3, '0');
    const admissionNumber = `HCA/${yearPrefix}/${seq}`;
    const newStudent: Student = {
      ...data,
      id: `stu-${Date.now()}`,
      admissionNumber,
      status: 'active'
    };
    setItem(STORAGE_KEYS.STUDENTS, [newStudent, ...students]);

    // Also link student to guardian
    if (newStudent.guardianId) {
      const guardians = DataService.getGuardians();
      const updatedG = guardians.map((g) => {
        if (g.id === newStudent.guardianId) {
          return { ...g, studentIds: Array.from(new Set([...g.studentIds, newStudent.id])) };
        }
        return g;
      });
      setItem(STORAGE_KEYS.GUARDIANS, updatedG);
    }

    // Create initial class placement
    const placements = DataService.getClassPlacements();
    const newPlacement: ClassPlacement = {
      id: `cp-${Date.now()}`,
      studentId: newStudent.id,
      classId: placementClassId,
      academicYearId: 'ay-2025-2026',
      termId: 'term-2',
      status: 'active'
    };
    setItem(STORAGE_KEYS.PLACEMENTS, [...placements, newPlacement]);

    DataService.logAudit('Student Registered', `Registered new student: ${newStudent.firstName} ${newStudent.lastName} (${admissionNumber})`);
    return newStudent;
  },
  updateStudent: (id: string, data: Partial<Student>): void => {
    const students = DataService.getStudents();
    const updated = students.map((s) => (s.id === id ? { ...s, ...data } : s));
    setItem(STORAGE_KEYS.STUDENTS, updated);
    DataService.logAudit('Student Updated', `Updated details for student ID: ${id}`);
  },

  // Class Placements & Promotions
  getClassPlacements: (): ClassPlacement[] => getItem<ClassPlacement[]>(STORAGE_KEYS.PLACEMENTS, initialClassPlacements),
  promoteStudentsBatch: (promotions: { studentId: string; newClassId: string; action: 'promote' | 'repeat' | 'transfer' }[], targetYearId: string): void => {
    const students = DataService.getStudents();
    const currentPlacements = DataService.getClassPlacements();
    const updatedStudents = [...students];
    const newPlacements: ClassPlacement[] = [...currentPlacements];

    promotions.forEach((p) => {
      const stIdx = updatedStudents.findIndex((s) => s.id === p.studentId);
      if (stIdx !== -1) {
        const oldClassId = updatedStudents[stIdx].currentClassId;
        updatedStudents[stIdx].currentClassId = p.newClassId;

        newPlacements.push({
          id: `cp-${Date.now()}-${p.studentId}`,
          studentId: p.studentId,
          classId: p.newClassId,
          academicYearId: targetYearId,
          termId: 'term-1',
          status: p.action === 'promote' ? 'promoted' : p.action === 'repeat' ? 'repeated' : 'transferred',
          previousClassId: oldClassId,
          promotedAt: new Date().toISOString()
        });
      }
    });

    setItem(STORAGE_KEYS.STUDENTS, updatedStudents);
    setItem(STORAGE_KEYS.PLACEMENTS, newPlacements);
    DataService.logAudit('Batch Promotion Executed', `Processed promotion batch for ${promotions.length} students to ${targetYearId}`);
  },

  // Attendance
  getAttendanceRecords: (): AttendanceRecord[] => getItem<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, initialAttendanceRecords),
  saveAttendanceRecord: (record: AttendanceRecord): void => {
    const list = DataService.getAttendanceRecords();
    const existingIndex = list.findIndex((a) => a.id === record.id || (a.classId === record.classId && a.date === record.date));
    let updated: AttendanceRecord[];
    if (existingIndex >= 0) {
      updated = [...list];
      updated[existingIndex] = record;
    } else {
      updated = [record, ...list];
    }
    setItem(STORAGE_KEYS.ATTENDANCE, updated);
    DataService.logAudit(
      record.status === 'submitted' ? 'Attendance Submitted' : 'Attendance Saved (Draft)',
      `Register for class ${record.classId} on ${record.date} marked ${record.status}`
    );
  },

  // Results & Moderation
  getResultSubmissions: (): ResultSubmission[] => getItem<ResultSubmission[]>(STORAGE_KEYS.RESULTS, initialResultSubmissions),
  saveResultSubmission: (submission: ResultSubmission): void => {
    const list = DataService.getResultSubmissions();
    const idx = list.findIndex((r) => r.id === submission.id);
    let updated: ResultSubmission[];
    if (idx >= 0) {
      updated = [...list];
      updated[idx] = submission;
    } else {
      updated = [submission, ...list];
    }
    setItem(STORAGE_KEYS.RESULTS, updated);
    DataService.logAudit('Results Updated', `Submission ${submission.id} status changed to ${submission.status}`);
  },
  approveResultSubmission: (id: string, notes?: string): void => {
    const user = DataService.getCurrentUser();
    const list = DataService.getResultSubmissions();
    const updated = list.map((r) => {
      if (r.id === id) {
        return {
          ...r,
          status: 'approved' as const,
          reviewedBy: user.name,
          reviewedAt: new Date().toISOString(),
          reviewNotes: notes || 'Moderated and approved by academic office.'
        };
      }
      return r;
    });
    setItem(STORAGE_KEYS.RESULTS, updated);
    DataService.logAudit('Results Approved', `Submission ID ${id} approved by ${user.name}`);
  },
  rejectResultSubmission: (id: string, reason: string): void => {
    const user = DataService.getCurrentUser();
    const list = DataService.getResultSubmissions();
    const updated = list.map((r) => {
      if (r.id === id) {
        return {
          ...r,
          status: 'rejected' as const,
          reviewedBy: user.name,
          reviewedAt: new Date().toISOString(),
          reviewNotes: reason
        };
      }
      return r;
    });
    setItem(STORAGE_KEYS.RESULTS, updated);
    DataService.logAudit('Results Returned For Revision', `Submission ID ${id} returned by ${user.name}: ${reason}`);
  },
  publishResultSubmission: (id: string): void => {
    const list = DataService.getResultSubmissions();
    const updated = list.map((r) => (r.id === id ? { ...r, status: 'published' as const } : r));
    setItem(STORAGE_KEYS.RESULTS, updated);
    DataService.logAudit('Report Cards Published', `Published final marks for result submission ${id}`);
  },

  // Report Cards
  getReportCards: (): ReportCard[] => getItem<ReportCard[]>(STORAGE_KEYS.REPORT_CARDS, initialReportCards),

  // Fee Schedules
  getFeeSchedules: (): FeeSchedule[] => getItem<FeeSchedule[]>(STORAGE_KEYS.FEE_SCHEDULES, initialFeeSchedules),

  // Fee Payments
  getFeePayments: (): FeePayment[] => getItem<FeePayment[]>(STORAGE_KEYS.PAYMENTS, initialFeePayments),
  recordFeePayment: (data: Omit<FeePayment, 'id' | 'receiptNumber'>): FeePayment => {
    const payments = DataService.getFeePayments();
    const receiptNumber = `REC-2026-${String(payments.length + 101).padStart(4, '0')}`;
    const newPayment: FeePayment = {
      ...data,
      id: `pay-${Date.now()}`,
      receiptNumber
    };
    setItem(STORAGE_KEYS.PAYMENTS, [newPayment, ...payments]);

    // Add audit log
    const student = DataService.getStudentById(data.studentId);
    const studentName = student ? `${student.firstName} ${student.lastName}` : data.studentId;
    DataService.logAudit('Fee Payment Recorded', `Receipt ${receiptNumber}: GH₵${data.amountPaid.toLocaleString()} paid for ${studentName} via ${data.paymentMethod}`);

    // Auto-create notification for owner
    DataService.addNotification({
      title: 'Fee Payment Received',
      message: `GH₵${data.amountPaid.toLocaleString()} collected for ${studentName}. Receipt #${receiptNumber}`,
      type: 'success',
      targetRoles: ['owner', 'accountant'],
      link: '/finances'
    });

    return newPayment;
  },

  // Fee Adjustments
  getFeeAdjustments: (): FeeAdjustment[] => getItem<FeeAdjustment[]>(STORAGE_KEYS.ADJUSTMENTS, initialFeeAdjustments),
  addFeeAdjustment: (adj: Omit<FeeAdjustment, 'id'>): FeeAdjustment => {
    const list = DataService.getFeeAdjustments();
    const newAdj: FeeAdjustment = { ...adj, id: `adj-${Date.now()}` };
    setItem(STORAGE_KEYS.ADJUSTMENTS, [newAdj, ...list]);
    DataService.logAudit('Fee Adjustment Applied', `Adjusted fee of GH₵${adj.amount} for student ${adj.studentId} (${adj.type})`);
    return newAdj;
  },

  // Student Fee Balances Calculation
  getStudentFinancialSummary: (studentId: string) => {
    const student = DataService.getStudentById(studentId);
    if (!student) return { totalBilled: 0, totalPaid: 0, adjustments: 0, balance: 0 };

    // Find fee schedule items for this student's class
    const schedules = DataService.getFeeSchedules().filter(
      (fs) => fs.classId === student.currentClassId || fs.classId === 'all'
    );
    const totalBilled = schedules.reduce((acc, s) => acc + s.amount, 0) || 2850; // default standard term bill if no specific schedule

    const payments = DataService.getFeePayments().filter((p) => p.studentId === studentId);
    const totalPaid = payments.reduce((acc, p) => acc + p.amountPaid, 0);

    const adjustments = DataService.getFeeAdjustments().filter((a) => a.studentId === studentId);
    const totalAdjustments = adjustments.reduce((acc, a) => acc + a.amount, 0); // negative is discount

    const netBilled = totalBilled + totalAdjustments;
    const balance = netBilled - totalPaid;

    return {
      totalBilled,
      totalAdjustments,
      netBilled,
      totalPaid,
      balance,
      isFullyPaid: balance <= 0,
      payments,
      adjustments
    };
  },

  // Expenses
  getExpenses: (): Expense[] => getItem<Expense[]>(STORAGE_KEYS.EXPENSES, initialExpenses),
  recordExpense: (data: Omit<Expense, 'id' | 'expenseNumber'>): Expense => {
    const expenses = DataService.getExpenses();
    const expenseNumber = `EXP-2026-${String(expenses.length + 1).padStart(3, '0')}`;
    const newExpense: Expense = {
      ...data,
      id: `exp-${Date.now()}`,
      expenseNumber
    };
    setItem(STORAGE_KEYS.EXPENSES, [newExpense, ...expenses]);

    DataService.logAudit('Expense Recorded', `${expenseNumber}: GH₵${data.amount.toLocaleString()} for ${data.title} (${data.approvalStatus})`);

    // If pending approval, notify owner
    if (data.approvalStatus === 'pending') {
      DataService.addNotification({
        title: 'New Expense Awaiting Approval',
        message: `${expenseNumber}: GH₵${data.amount.toLocaleString()} for ${data.title}`,
        type: 'warning',
        targetRoles: ['owner'],
        link: '/finances'
      });
    }

    return newExpense;
  },
  approveExpense: (id: string): void => {
    const user = DataService.getCurrentUser();
    const expenses = DataService.getExpenses();
    const updated = expenses.map((e) =>
      e.id === id
        ? {
            ...e,
            approvalStatus: 'approved' as const,
            approvedBy: user.name,
            approvedAt: new Date().toISOString()
          }
        : e
    );
    setItem(STORAGE_KEYS.EXPENSES, updated);
    DataService.logAudit('Expense Approved', `Expense ${id} approved by ${user.name}`);
  },
  rejectExpense: (id: string, reason: string): void => {
    const user = DataService.getCurrentUser();
    const expenses = DataService.getExpenses();
    const updated = expenses.map((e) =>
      e.id === id
        ? {
            ...e,
            approvalStatus: 'rejected' as const,
            approvedBy: user.name,
            approvedAt: new Date().toISOString(),
            rejectionReason: reason
          }
        : e
    );
    setItem(STORAGE_KEYS.EXPENSES, updated);
    DataService.logAudit('Expense Rejected', `Expense ${id} rejected by ${user.name}: ${reason}`);
  },

  // Financial Activities & Projects
  getFinancialActivities: (): FinancialActivity[] => getItem<FinancialActivity[]>(STORAGE_KEYS.ACTIVITIES, initialFinancialActivities),
  addFinancialActivity: (activity: Omit<FinancialActivity, 'id' | 'transactions'>): FinancialActivity => {
    const list = DataService.getFinancialActivities();
    const newAct: FinancialActivity = {
      ...activity,
      id: `act-${Date.now()}`,
      transactions: []
    };
    setItem(STORAGE_KEYS.ACTIVITIES, [newAct, ...list]);
    DataService.logAudit('Financial Activity Created', `Created project/activity: ${activity.title}`);
    return newAct;
  },
  addActivityTransaction: (activityId: string, tx: Omit<import('../types').ActivityTransaction, 'id' | 'activityId'>) => {
    const list = DataService.getFinancialActivities();
    const newTx: import('../types').ActivityTransaction = {
      ...tx,
      id: `tx-${Date.now()}`,
      activityId
    };

    const updated = list.map((act) => {
      if (act.id === activityId) {
        const transactions = [newTx, ...act.transactions];
        const incomeReceived = transactions
          .filter((t) => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
        const expensesSpent = transactions
          .filter((t) => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);

        return {
          ...act,
          incomeReceived,
          expensesSpent,
          transactions
        };
      }
      return act;
    });

    setItem(STORAGE_KEYS.ACTIVITIES, updated);
    DataService.logAudit(
      'Activity Transaction Recorded',
      `Recorded ${tx.type} of GH₵${tx.amount.toLocaleString()} for activity ${activityId}`
    );
    return newTx;
  },

  // Notifications
  getNotifications: (): NotificationItem[] => getItem<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, initialNotifications),
  addNotification: (item: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>): NotificationItem => {
    const list = DataService.getNotifications();
    const newNotif: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}`,
      read: false,
      createdAt: new Date().toISOString()
    };
    setItem(STORAGE_KEYS.NOTIFICATIONS, [newNotif, ...list]);
    return newNotif;
  },
  markNotificationRead: (id: string): void => {
    const list = DataService.getNotifications();
    setItem(STORAGE_KEYS.NOTIFICATIONS, list.map((n) => (n.id === id ? { ...n, read: true } : n)));
  },
  markAllNotificationsRead: (role?: UserRole): void => {
    const list = DataService.getNotifications();
    const updated = list.map((n) => {
      if (!role || n.targetRoles.includes(role)) {
        return { ...n, read: true };
      }
      return n;
    });
    setItem(STORAGE_KEYS.NOTIFICATIONS, updated);
  },

  // Parent Communications
  getParentCommunications: (): ParentCommunication[] => getItem<ParentCommunication[]>(STORAGE_KEYS.COMMUNICATIONS, initialParentCommunications),
  sendParentCommunication: (data: Omit<ParentCommunication, 'id' | 'sentAt' | 'status'>): ParentCommunication => {
    const list = DataService.getParentCommunications();
    const newComm: ParentCommunication = {
      ...data,
      id: `com-${Date.now()}`,
      status: 'delivered',
      sentAt: new Date().toISOString()
    };
    setItem(STORAGE_KEYS.COMMUNICATIONS, [newComm, ...list]);
    DataService.logAudit('Parent Message Broadcast', `Sent ${data.channel} broadcast (${data.eventType}) to ${data.recipientCount} guardians.`);
    return newComm;
  },

  // Audit Log
  getAuditEvents: (): AuditEvent[] => getItem<AuditEvent[]>(STORAGE_KEYS.AUDIT, initialAuditEvents),
  logAudit: (action: string, details: string): void => {
    const user = DataService.getCurrentUser();
    const list = DataService.getAuditEvents();
    const newEvent: AuditEvent = {
      id: `aud-${Date.now()}`,
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      action,
      details,
      timestamp: new Date().toISOString()
    };
    setItem(STORAGE_KEYS.AUDIT, [newEvent, ...list.slice(0, 100)]);
  }
};
