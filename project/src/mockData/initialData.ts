import {
  School,
  User,
  AcademicYear,
  Term,
  SchoolClass,
  Subject,
  Guardian,
  Student,
  FeeSchedule,
  FeePayment,
  FeeAdjustment,
  Expense,
  FinancialActivity,
  AttendanceRecord,
  ResultSubmission,
  ReportCard,
  NotificationItem,
  ParentCommunication,
  AuditEvent,
  ClassPlacement
} from '../types';

export const initialSchool: School = {
  id: 'sch-001',
  name: 'Heritage Crown Academy',
  motto: 'Excellence, Integrity & Leadership',
  gesRegistrationNo: 'GES/GAR/AMA/PRI/2014/089',
  address: 'Plot 42, Boundary Road, East Legon, Accra, Ghana',
  phone: '+233 30 254 8890 / +233 24 456 7890',
  email: 'info@heritagecrown.edu.gh',
  currentAcademicYearId: 'ay-2025-2026',
  currentTermId: 'term-2',
  currency: 'GH₵',
  logoUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=120&auto=format&fit=crop&q=80'
};

export const initialUsers: User[] = [
  {
    id: 'user-owner',
    name: 'Dr. Kwame Mensah',
    email: 'owner@demo.school',
    role: 'owner',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '+233 24 411 2233',
    title: 'School Proprietor & Board Chairman',
    schoolId: 'sch-001'
  },
  {
    id: 'user-headteacher',
    name: 'Mrs. Comfort Addo',
    email: 'headteacher@demo.school',
    role: 'headteacher',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    phone: '+233 20 812 3456',
    title: 'Headmistress & Academic Director',
    schoolId: 'sch-001'
  },
  {
    id: 'user-teacher',
    name: 'Mr. Samuel Osei',
    email: 'teacher@demo.school',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '+233 24 987 6543',
    title: 'Primary Class Teacher (Basic 4A)',
    assignedClassId: 'cls-b4a',
    assignedSubjectIds: ['sub-eng-4a', 'sub-mth-4a', 'sub-rme-4a'],
    schoolId: 'sch-001'
  },
  {
    id: 'user-subjectteacher',
    name: 'Ms. Akua Boateng',
    email: 'subjectteacher@demo.school',
    role: 'subject_teacher',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    phone: '+233 55 678 1234',
    title: 'Integrated Science & ICT Specialist',
    assignedSubjectIds: ['sub-sci-4a', 'sub-sci-5', 'sub-ict-5', 'sub-ict-6'],
    schoolId: 'sch-001'
  },
  {
    id: 'user-accountant',
    name: 'Mr. Emmanuel Donkor',
    email: 'accountant@demo.school',
    role: 'accountant',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    phone: '+233 27 334 5566',
    title: 'Bursar & Finance Officer',
    schoolId: 'sch-001'
  },
  {
    id: 'user-admin',
    name: 'Ms. Grace Asante',
    email: 'admin@demo.school',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    phone: '+233 24 556 7788',
    title: 'Records Administrator & Admissions Officer',
    schoolId: 'sch-001'
  }
];

export const initialAcademicYears: AcademicYear[] = [
  {
    id: 'ay-2024-2025',
    name: '2024/2025 Academic Year',
    startDate: '2024-09-09',
    endDate: '2025-07-25',
    isCurrent: false,
    status: 'completed'
  },
  {
    id: 'ay-2025-2026',
    name: '2025/2026 Academic Year',
    startDate: '2025-09-08',
    endDate: '2026-07-24',
    isCurrent: true,
    status: 'active'
  },
  {
    id: 'ay-2026-2027',
    name: '2026/2027 Academic Year',
    startDate: '2026-09-07',
    endDate: '2027-07-23',
    isCurrent: false,
    status: 'upcoming'
  }
];

export const initialTerms: Term[] = [
  {
    id: 'term-1',
    academicYearId: 'ay-2025-2026',
    name: 'Term 1',
    startDate: '2025-09-08',
    endDate: '2025-12-18',
    isCurrent: false
  },
  {
    id: 'term-2',
    academicYearId: 'ay-2025-2026',
    name: 'Term 2',
    startDate: '2026-01-12',
    endDate: '2026-04-10',
    isCurrent: true
  },
  {
    id: 'term-3',
    academicYearId: 'ay-2025-2026',
    name: 'Term 3',
    startDate: '2026-05-04',
    endDate: '2026-07-24',
    isCurrent: false
  }
];

export const initialClasses: SchoolClass[] = [
  { id: 'cls-nur1', name: 'Nursery 1', level: 'Nursery', gradeNumber: 1, capacity: 25, classTeacherId: 'user-admin', room: 'Block A, Room 1' },
  { id: 'cls-kg1', name: 'Kindergarten 1 (KG 1)', level: 'KG', gradeNumber: 3, capacity: 30, classTeacherId: 'user-admin', room: 'Block A, Room 3' },
  { id: 'cls-kg2', name: 'Kindergarten 2 (KG 2)', level: 'KG', gradeNumber: 4, capacity: 30, classTeacherId: 'user-admin', room: 'Block A, Room 4' },
  { id: 'cls-b1', name: 'Basic 1', level: 'Primary', gradeNumber: 5, capacity: 35, classTeacherId: 'user-admin', room: 'Block B, Room 1' },
  { id: 'cls-b2', name: 'Basic 2', level: 'Primary', gradeNumber: 6, capacity: 35, classTeacherId: 'user-admin', room: 'Block B, Room 2' },
  { id: 'cls-b3', name: 'Basic 3', level: 'Primary', gradeNumber: 7, capacity: 35, classTeacherId: 'user-admin', room: 'Block B, Room 3' },
  { id: 'cls-b4a', name: 'Basic 4A', level: 'Primary', gradeNumber: 8, capacity: 35, classTeacherId: 'user-teacher', room: 'Block C, Room 1' },
  { id: 'cls-b4b', name: 'Basic 4B', level: 'Primary', gradeNumber: 8, capacity: 35, classTeacherId: 'user-admin', room: 'Block C, Room 2' },
  { id: 'cls-b5', name: 'Basic 5', level: 'Primary', gradeNumber: 9, capacity: 35, classTeacherId: 'user-admin', room: 'Block C, Room 3' },
  { id: 'cls-b6', name: 'Basic 6', level: 'Primary', gradeNumber: 10, capacity: 35, classTeacherId: 'user-admin', room: 'Block C, Room 4' },
  { id: 'cls-jhs1', name: 'JHS 1A', level: 'JHS', gradeNumber: 11, capacity: 40, classTeacherId: 'user-admin', room: 'JHS Wing, Room 1' },
  { id: 'cls-jhs2', name: 'JHS 2', level: 'JHS', gradeNumber: 12, capacity: 40, classTeacherId: 'user-admin', room: 'JHS Wing, Room 2' },
  { id: 'cls-jhs3', name: 'JHS 3 (BECE Candidates)', level: 'JHS', gradeNumber: 13, capacity: 40, classTeacherId: 'user-headteacher', room: 'JHS Wing, Room 3' },
];

export const initialSubjects: Subject[] = [
  { id: 'sub-eng-4a', code: 'ENG-P4', name: 'English Language', department: 'Languages', classIds: ['cls-b4a', 'cls-b4b'] },
  { id: 'sub-mth-4a', code: 'MTH-P4', name: 'Mathematics', department: 'Mathematics', classIds: ['cls-b4a', 'cls-b4b'] },
  { id: 'sub-sci-4a', code: 'SCI-P4', name: 'Integrated Science', department: 'Science', classIds: ['cls-b4a', 'cls-b4b'] },
  { id: 'sub-rme-4a', code: 'RME-P4', name: 'Religious & Moral Education', department: 'Social Sciences', classIds: ['cls-b4a', 'cls-b4b'] },
  { id: 'sub-sci-5', code: 'SCI-P5', name: 'Integrated Science', department: 'Science', classIds: ['cls-b5'] },
  { id: 'sub-ict-5', code: 'ICT-P5', name: 'Computing (ICT)', department: 'Technology', classIds: ['cls-b5'] },
  { id: 'sub-ict-6', code: 'ICT-P6', name: 'Computing (ICT)', department: 'Technology', classIds: ['cls-b6'] },
  { id: 'sub-soc-4a', code: 'SOC-P4', name: 'Our World Our People (OWOP)', department: 'Social Sciences', classIds: ['cls-b4a'] },
  { id: 'sub-art-4a', code: 'ART-P4', name: 'Creative Arts & Design', department: 'Arts', classIds: ['cls-b4a'] }
];

export const initialGuardians: Guardian[] = [
  {
    id: 'grd-001',
    name: 'Mr. Patrick Mensah',
    phone: '+233 24 412 3456',
    email: 'patrick.mensah@gmail.com',
    relationship: 'Father',
    occupation: 'Senior Logistics Manager, Tema Port',
    address: 'House No. 14, Trassaco Valley, East Legon, Accra',
    studentIds: ['stu-001', 'stu-008'] // Has 2 children in school: Kofi in Basic 4A and Nana in Basic 1
  },
  {
    id: 'grd-002',
    name: 'Dr. Evelyn Ofori',
    phone: '+233 20 765 4321',
    email: 'dr.evelyn.ofori@korlebu.org',
    relationship: 'Mother',
    occupation: 'Pediatric Consultant, Korle Bu',
    address: 'Plot 18, Adjiringanor, Accra',
    studentIds: ['stu-002']
  },
  {
    id: 'grd-003',
    name: 'Alhaji Ibrahim Salifu',
    phone: '+233 24 998 7766',
    email: 'i.salifu@salifutrading.com',
    relationship: 'Father',
    occupation: 'Managing Director, Salifu Holdings',
    address: 'Estate 7, Airport Residential Area, Accra',
    studentIds: ['stu-003']
  },
  {
    id: 'grd-004',
    name: 'Mrs. Bernice Darko',
    phone: '+233 50 123 4567',
    email: 'bernice.darko@ecobank.com',
    relationship: 'Mother',
    occupation: 'Branch Manager, Ecobank Ghana',
    address: 'Hse 8, Spintex Road, Accra',
    studentIds: ['stu-004']
  },
  {
    id: 'grd-005',
    name: 'Mr. Daniel Antwi',
    phone: '+233 26 555 8899',
    email: 'dantwi@ghanaoil.com.gh',
    relationship: 'Father',
    occupation: 'Operations Engineer, GOIL',
    address: '12 Mango Tree Lane, Cantonments, Accra',
    studentIds: ['stu-005']
  },
  {
    id: 'grd-006',
    name: 'Madam Cynthia Frimpong',
    phone: '+233 24 333 4455',
    email: 'cynthia.frimpong@yahoo.com',
    relationship: 'Aunt & Legal Guardian',
    occupation: 'Pharmacist, Star Care Pharmacy',
    address: 'Plot 5B, American House, East Legon, Accra',
    studentIds: ['stu-006']
  },
  {
    id: 'grd-007',
    name: 'Lawyer Kojo Annan',
    phone: '+233 27 778 9900',
    email: 'annan@lexchambersgh.com',
    relationship: 'Father',
    occupation: 'Partner, Lex Chambers Ghana',
    address: '32 Ringway Estates, Osu, Accra',
    studentIds: ['stu-007']
  },
  {
    id: 'grd-008',
    name: 'Mr. Isaac Quaye',
    phone: '+233 24 888 1122',
    email: 'iquaye@nestle.com',
    relationship: 'Father',
    occupation: 'Quality Assurance Lead, Nestlé',
    address: 'Flat 4, Regimanuel Gray Estates, Kwabenya',
    studentIds: ['stu-009']
  },
  {
    id: 'grd-009',
    name: 'Mrs. Gloria Agyemang',
    phone: '+233 55 444 3322',
    email: 'gloria.agyemang@vodafone.com',
    relationship: 'Mother',
    occupation: 'Telecoms Infrastructure Architect',
    address: 'Hse 21, Dzorwulu, Accra',
    studentIds: ['stu-010']
  }
];

export const initialStudents: Student[] = [
  // Basic 4A students
  {
    id: 'stu-001',
    admissionNumber: 'HCA/2022/041',
    firstName: 'Kofi',
    lastName: 'Mensah',
    dateOfBirth: '2016-04-15',
    gender: 'Male',
    admissionDate: '2022-09-06',
    currentClassId: 'cls-b4a',
    guardianId: 'grd-001',
    emergencyContact: '+233 24 412 3456 (Father)',
    address: 'House No. 14, Trassaco Valley, East Legon, Accra',
    status: 'active',
    photoUrl: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'stu-002',
    admissionNumber: 'HCA/2022/042',
    firstName: 'Ama',
    lastName: 'Serwaa Ofori',
    dateOfBirth: '2016-07-22',
    gender: 'Female',
    admissionDate: '2022-09-06',
    currentClassId: 'cls-b4a',
    guardianId: 'grd-002',
    emergencyContact: '+233 20 765 4321 (Mother)',
    address: 'Plot 18, Adjiringanor, Accra',
    status: 'active',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'stu-003',
    admissionNumber: 'HCA/2022/045',
    firstName: 'Zainab',
    lastName: 'Salifu',
    dateOfBirth: '2016-02-18',
    gender: 'Female',
    admissionDate: '2022-09-06',
    currentClassId: 'cls-b4a',
    guardianId: 'grd-003',
    emergencyContact: '+233 24 998 7766 (Father)',
    address: 'Estate 7, Airport Residential Area, Accra',
    status: 'active',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'stu-004',
    admissionNumber: 'HCA/2022/049',
    firstName: 'Kwabena',
    lastName: 'Darko',
    dateOfBirth: '2016-09-10',
    gender: 'Male',
    admissionDate: '2022-09-06',
    currentClassId: 'cls-b4a',
    guardianId: 'grd-004',
    emergencyContact: '+233 50 123 4567 (Mother)',
    address: 'Hse 8, Spintex Road, Accra',
    status: 'active',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'stu-005',
    admissionNumber: 'HCA/2022/053',
    firstName: 'Abena',
    lastName: 'Antwi',
    dateOfBirth: '2016-11-05',
    gender: 'Female',
    admissionDate: '2022-09-06',
    currentClassId: 'cls-b4a',
    guardianId: 'grd-005',
    emergencyContact: '+233 26 555 8899 (Father)',
    address: '12 Mango Tree Lane, Cantonments, Accra',
    status: 'active'
  },
  {
    id: 'stu-006',
    admissionNumber: 'HCA/2022/058',
    firstName: 'Yaw',
    lastName: 'Frimpong',
    dateOfBirth: '2016-05-30',
    gender: 'Male',
    admissionDate: '2022-09-06',
    currentClassId: 'cls-b4a',
    guardianId: 'grd-006',
    emergencyContact: '+233 24 333 4455 (Guardian)',
    address: 'Plot 5B, American House, East Legon, Accra',
    status: 'active'
  },
  {
    id: 'stu-007',
    admissionNumber: 'HCA/2022/061',
    firstName: 'Paa Kwesi',
    lastName: 'Annan',
    dateOfBirth: '2016-08-14',
    gender: 'Male',
    admissionDate: '2022-09-06',
    currentClassId: 'cls-b4a',
    guardianId: 'grd-007',
    emergencyContact: '+233 27 778 9900 (Father)',
    address: '32 Ringway Estates, Osu, Accra',
    status: 'active'
  },
  // Basic 1 sibling of student 001
  {
    id: 'stu-008',
    admissionNumber: 'HCA/2025/112',
    firstName: 'Nana Akosua',
    lastName: 'Mensah',
    dateOfBirth: '2019-03-12',
    gender: 'Female',
    admissionDate: '2025-09-08',
    currentClassId: 'cls-b1',
    guardianId: 'grd-001',
    emergencyContact: '+233 24 412 3456 (Father)',
    address: 'House No. 14, Trassaco Valley, East Legon, Accra',
    status: 'active'
  },
  // Basic 5 students
  {
    id: 'stu-009',
    admissionNumber: 'HCA/2021/019',
    firstName: 'Jessica',
    lastName: 'Quaye',
    dateOfBirth: '2015-01-25',
    gender: 'Female',
    admissionDate: '2021-09-07',
    currentClassId: 'cls-b5',
    guardianId: 'grd-008',
    emergencyContact: '+233 24 888 1122 (Father)',
    address: 'Flat 4, Regimanuel Gray Estates, Kwabenya',
    status: 'active'
  },
  {
    id: 'stu-010',
    admissionNumber: 'HCA/2021/024',
    firstName: 'Derrick',
    lastName: 'Agyemang',
    dateOfBirth: '2015-06-19',
    gender: 'Male',
    admissionDate: '2021-09-07',
    currentClassId: 'cls-b5',
    guardianId: 'grd-009',
    emergencyContact: '+233 55 444 3322 (Mother)',
    address: 'Hse 21, Dzorwulu, Accra',
    status: 'active'
  },
  {
    id: 'stu-011',
    admissionNumber: 'HCA/2021/030',
    firstName: 'Kwame',
    lastName: 'Boadi',
    dateOfBirth: '2015-10-04',
    gender: 'Male',
    admissionDate: '2021-09-07',
    currentClassId: 'cls-b5',
    guardianId: 'grd-004',
    emergencyContact: '+233 50 123 4567',
    address: 'Spintex, Accra',
    status: 'active'
  },
  {
    id: 'stu-012',
    admissionNumber: 'HCA/2020/008',
    firstName: 'Kelvin',
    lastName: 'Appiah',
    dateOfBirth: '2014-04-11',
    gender: 'Male',
    admissionDate: '2020-09-08',
    currentClassId: 'cls-jhs1',
    guardianId: 'grd-005',
    emergencyContact: '+233 26 555 8899',
    address: 'Cantonments, Accra',
    status: 'active'
  }
];

export const initialClassPlacements: ClassPlacement[] = [
  { id: 'cp-001', studentId: 'stu-001', classId: 'cls-b4a', academicYearId: 'ay-2025-2026', termId: 'term-2', status: 'active', previousClassId: 'cls-b3' },
  { id: 'cp-002', studentId: 'stu-002', classId: 'cls-b4a', academicYearId: 'ay-2025-2026', termId: 'term-2', status: 'active', previousClassId: 'cls-b3' },
  { id: 'cp-003', studentId: 'stu-003', classId: 'cls-b4a', academicYearId: 'ay-2025-2026', termId: 'term-2', status: 'active', previousClassId: 'cls-b3' },
  { id: 'cp-004', studentId: 'stu-004', classId: 'cls-b4a', academicYearId: 'ay-2025-2026', termId: 'term-2', status: 'active', previousClassId: 'cls-b3' },
  { id: 'cp-005', studentId: 'stu-005', classId: 'cls-b4a', academicYearId: 'ay-2025-2026', termId: 'term-2', status: 'active', previousClassId: 'cls-b3' },
  { id: 'cp-006', studentId: 'stu-006', classId: 'cls-b4a', academicYearId: 'ay-2025-2026', termId: 'term-2', status: 'active', previousClassId: 'cls-b3' },
  { id: 'cp-007', studentId: 'stu-007', classId: 'cls-b4a', academicYearId: 'ay-2025-2026', termId: 'term-2', status: 'active', previousClassId: 'cls-b3' },
  { id: 'cp-008', studentId: 'stu-008', classId: 'cls-b1', academicYearId: 'ay-2025-2026', termId: 'term-2', status: 'active' },
  { id: 'cp-009', studentId: 'stu-009', classId: 'cls-b5', academicYearId: 'ay-2025-2026', termId: 'term-2', status: 'active', previousClassId: 'cls-b4a' },
  { id: 'cp-010', studentId: 'stu-010', classId: 'cls-b5', academicYearId: 'ay-2025-2026', termId: 'term-2', status: 'active', previousClassId: 'cls-b4a' }
];

export const initialFeeSchedules: FeeSchedule[] = [
  { id: 'fs-01', academicYearId: 'ay-2025-2026', termId: 'term-2', classId: 'cls-b4a', category: 'Tuition', amount: 1850, dueDate: '2026-01-30' },
  { id: 'fs-02', academicYearId: 'ay-2025-2026', termId: 'term-2', classId: 'cls-b4a', category: 'ICT & Science Lab', amount: 250, dueDate: '2026-01-30' },
  { id: 'fs-03', academicYearId: 'ay-2025-2026', termId: 'term-2', classId: 'cls-b4a', category: 'PTA Levy', amount: 120, dueDate: '2026-01-30' },
  { id: 'fs-04', academicYearId: 'ay-2025-2026', termId: 'term-2', classId: 'cls-b4a', category: 'Feeding & Lunch', amount: 480, dueDate: '2026-01-30' },
  { id: 'fs-05', academicYearId: 'ay-2025-2026', termId: 'term-2', classId: 'cls-b4a', category: 'Examination Fee', amount: 150, dueDate: '2026-02-15' },
  // Total fees scheduled for Basic 4A: GH₵ 2,850 per student
  { id: 'fs-06', academicYearId: 'ay-2025-2026', termId: 'term-2', classId: 'cls-b5', category: 'Tuition', amount: 1950, dueDate: '2026-01-30' },
  { id: 'fs-07', academicYearId: 'ay-2025-2026', termId: 'term-2', classId: 'cls-b1', category: 'Tuition', amount: 1650, dueDate: '2026-01-30' }
];

export const initialFeePayments: FeePayment[] = [
  {
    id: 'pay-001',
    receiptNumber: 'REC-2026-0101',
    studentId: 'stu-001', // Kofi Mensah
    amountPaid: 2850,
    paymentMethod: 'Mobile Money',
    paymentDate: '2026-01-14',
    transactionRef: 'MTN-MM-88492019',
    recordedBy: 'Mr. Emmanuel Donkor',
    notes: 'Full Term 2 fees payment via MTN MoMo',
    termId: 'term-2',
    academicYearId: 'ay-2025-2026'
  },
  {
    id: 'pay-002',
    receiptNumber: 'REC-2026-0102',
    studentId: 'stu-002', // Ama Serwaa Ofori
    amountPaid: 2850,
    paymentMethod: 'Bank Transfer',
    paymentDate: '2026-01-16',
    transactionRef: 'GCB-TRF-003819',
    recordedBy: 'Mr. Emmanuel Donkor',
    notes: 'Full payment from GCB Bank',
    termId: 'term-2',
    academicYearId: 'ay-2025-2026'
  },
  {
    id: 'pay-003',
    receiptNumber: 'REC-2026-0103',
    studentId: 'stu-003', // Zainab Salifu
    amountPaid: 2000,
    paymentMethod: 'Cash',
    paymentDate: '2026-01-20',
    transactionRef: 'CSH-REC-0012',
    recordedBy: 'Mr. Emmanuel Donkor',
    notes: 'Part payment. Balance of GH₵850 promised by mid-term',
    termId: 'term-2',
    academicYearId: 'ay-2025-2026'
  },
  {
    id: 'pay-004',
    receiptNumber: 'REC-2026-0104',
    studentId: 'stu-004', // Kwabena Darko
    amountPaid: 1500,
    paymentMethod: 'Mobile Money',
    paymentDate: '2026-01-25',
    transactionRef: 'TEL-MM-91028374',
    recordedBy: 'Mr. Emmanuel Donkor',
    notes: 'Part payment via Telecel Cash',
    termId: 'term-2',
    academicYearId: 'ay-2025-2026'
  },
  {
    id: 'pay-005',
    receiptNumber: 'REC-2026-0105',
    studentId: 'stu-005', // Abena Antwi
    amountPaid: 2850,
    paymentMethod: 'Cheque',
    paymentDate: '2026-01-28',
    transactionRef: 'CHQ-STANBIC-4401',
    recordedBy: 'Mr. Emmanuel Donkor',
    notes: 'Stanbic Bank Cheque cleared',
    termId: 'term-2',
    academicYearId: 'ay-2025-2026'
  },
  {
    id: 'pay-006',
    receiptNumber: 'REC-2026-0106',
    studentId: 'stu-007', // Paa Kwesi Annan
    amountPaid: 1850,
    paymentMethod: 'Bank Transfer',
    paymentDate: '2026-02-02',
    transactionRef: 'ECO-TRF-77491',
    recordedBy: 'Mr. Emmanuel Donkor',
    notes: 'Tuition fee paid. Ancillary charges balance of GH₵1,000 pending',
    termId: 'term-2',
    academicYearId: 'ay-2025-2026'
  },
  {
    id: 'pay-007',
    receiptNumber: 'REC-2026-0107',
    studentId: 'stu-008', // Nana Akosua Mensah (Basic 1)
    amountPaid: 2400,
    paymentMethod: 'Mobile Money',
    paymentDate: '2026-01-14',
    transactionRef: 'MTN-MM-88492022',
    recordedBy: 'Mr. Emmanuel Donkor',
    notes: 'Paid alongside brother Kofi Mensah',
    termId: 'term-2',
    academicYearId: 'ay-2025-2026'
  }
  // Notice: stu-006 (Yaw Frimpong) has paid 0 yet -> GH₵2,850 in arrears
];

export const initialFeeAdjustments: FeeAdjustment[] = [
  {
    id: 'adj-001',
    studentId: 'stu-006',
    amount: -300,
    type: 'discount',
    reason: 'Approved partial welfare bursary support for orphan ward',
    approvedBy: 'Dr. Kwame Mensah',
    date: '2026-01-20'
  }
];

export const initialExpenses: Expense[] = [
  {
    id: 'exp-001',
    expenseNumber: 'EXP-2026-001',
    title: 'January Staff Transport & Welfare Allowance',
    category: 'Staff Welfare',
    amount: 14500,
    date: '2026-01-31',
    paymentMethod: 'Bank Transfer',
    vendor: 'Heritage Staff Welfare Scheme',
    referenceNo: 'WELF-JAN-2026',
    attachmentName: 'staff_welfare_schedule_jan.pdf',
    enteredBy: 'Mr. Emmanuel Donkor',
    approvalStatus: 'approved',
    approvedBy: 'Dr. Kwame Mensah',
    approvedAt: '2026-01-31'
  },
  {
    id: 'exp-002',
    expenseNumber: 'EXP-2026-002',
    title: 'ECG Prepaid Electricity & Gen-Set Diesel Top-Up',
    category: 'Utilities & Internet',
    amount: 4800,
    date: '2026-02-04',
    paymentMethod: 'Mobile Money',
    vendor: 'ECG & TotalEnergies East Legon',
    referenceNo: 'ECG-PUR-59012',
    attachmentName: 'diesel_fuel_ecg_receipts.pdf',
    enteredBy: 'Mr. Emmanuel Donkor',
    approvalStatus: 'approved',
    approvedBy: 'Dr. Kwame Mensah',
    approvedAt: '2026-02-05'
  },
  {
    id: 'exp-003',
    expenseNumber: 'EXP-2026-003',
    title: 'Term 2 Teaching & Science Lab Consumables',
    category: 'Teaching Materials',
    amount: 3850,
    date: '2026-02-10',
    paymentMethod: 'Bank Transfer',
    vendor: 'Kingdom Books & Stationery Ghana Ltd',
    referenceNo: 'INV-KBS-99014',
    attachmentName: 'kingdom_books_invoice.pdf',
    enteredBy: 'Mr. Emmanuel Donkor',
    approvalStatus: 'approved',
    approvedBy: 'Dr. Kwame Mensah',
    approvedAt: '2026-02-11'
  },
  {
    id: 'exp-004',
    expenseNumber: 'EXP-2026-004',
    title: 'Kakum Tour Bus Charter Advance Deposit',
    category: 'Transport & Fuel',
    amount: 2800,
    date: '2026-02-15',
    paymentMethod: 'Bank Transfer',
    vendor: 'VIP Jeoun Transport Charter Division',
    referenceNo: 'VIP-BUS-0492',
    attachmentName: 'vip_bus_charter_contract.pdf',
    enteredBy: 'Mr. Emmanuel Donkor',
    approvalStatus: 'approved',
    approvedBy: 'Dr. Kwame Mensah',
    approvedAt: '2026-02-15',
    relatedActivityId: 'act-001'
  },
  {
    id: 'exp-005',
    expenseNumber: 'EXP-2026-005',
    title: 'Kakum Tour Student Lunch & Water Packs',
    category: 'School Event',
    amount: 1850,
    date: '2026-02-20',
    paymentMethod: 'Cash',
    vendor: 'Papaye Fast Foods Catering Wing',
    referenceNo: 'PAP-CAT-3019',
    attachmentName: 'papaye_catering_invoice.pdf',
    enteredBy: 'Mr. Emmanuel Donkor',
    approvalStatus: 'approved',
    approvedBy: 'Dr. Kwame Mensah',
    approvedAt: '2026-02-21',
    relatedActivityId: 'act-001'
  },
  {
    id: 'exp-006',
    expenseNumber: 'EXP-2026-006',
    title: 'Primary Wing Washroom Plumbing & Tiling Repairs',
    category: 'Facility Maintenance',
    amount: 2600,
    date: '2026-02-24',
    paymentMethod: 'Mobile Money',
    vendor: 'Apex Plumbing & Renovation Works',
    referenceNo: 'APX-PLUMB-78',
    attachmentName: 'apex_works_signoff.pdf',
    enteredBy: 'Mr. Emmanuel Donkor',
    approvalStatus: 'pending', // PENDING APPROVAL FOR DEMONSTRATION JOURNEY!
    relatedActivityId: undefined
  },
  {
    id: 'exp-007',
    expenseNumber: 'EXP-2026-007',
    title: 'Mid-Term Examination Printing & Answer Booklets',
    category: 'Teaching Materials',
    amount: 1950,
    date: '2026-03-01',
    paymentMethod: 'Cash',
    vendor: 'Universal Press Accra',
    referenceNo: 'UNIV-PR-1120',
    attachmentName: 'exam_printing_quotation.pdf',
    enteredBy: 'Mr. Emmanuel Donkor',
    approvalStatus: 'pending' // PENDING APPROVAL FOR DEMONSTRATION JOURNEY!
  }
];

export const initialFinancialActivities: FinancialActivity[] = [
  {
    id: 'act-001',
    title: 'Annual Kakum & Cape Coast Castle Educational Tour',
    description: 'Educational field trip for Basic 4, 5 & 6 students covering nature conservation, canopy walkway and historic heritage.',
    category: 'Educational Trip',
    budget: 6500,
    fundsAllocated: 6500,
    incomeReceived: 5800, // 58 students paid GH₵100 contribution
    expensesSpent: 4650,  // Bus charter GH₵2,800 + Papaye lunches GH₵1,850
    outstandingObligations: 0,
    startDate: '2026-02-14',
    endDate: '2026-02-22',
    status: 'in_progress',
    transactions: [
      { id: 'tx-01', activityId: 'act-001', type: 'income', title: 'Student Tour Registration Levy Collections (58 students)', amount: 5800, date: '2026-02-12', reference: 'STU-TRIP-COL-01', recordedBy: 'Mr. Emmanuel Donkor' },
      { id: 'tx-02', activityId: 'act-001', type: 'expense', title: 'VIP Luxury Coach Charter (Accra - Cape Coast return)', amount: 2800, date: '2026-02-15', reference: 'VIP-BUS-0492', recordedBy: 'Mr. Emmanuel Donkor' },
      { id: 'tx-03', activityId: 'act-001', type: 'expense', title: 'Catered Lunches & Refreshments (Papaye Fast Foods)', amount: 1850, date: '2026-02-20', reference: 'PAP-CAT-3019', recordedBy: 'Mr. Emmanuel Donkor' }
    ]
  },
  {
    id: 'act-002',
    title: 'Inter-Schools Sports & Athletics Championship',
    description: 'Annual inter-houses and regional private schools track, field and soccer festival at Legon Sports Stadium.',
    category: 'Sports Festival',
    budget: 4200,
    fundsAllocated: 4200,
    incomeReceived: 4200,
    expensesSpent: 3950,
    outstandingObligations: 0,
    startDate: '2026-01-20',
    endDate: '2026-01-28',
    status: 'reconciled',
    transactions: [
      { id: 'tx-04', activityId: 'act-002', type: 'income', title: 'PTA Sports Sponsorship Allocation', amount: 4200, date: '2026-01-18', reference: 'PTA-SPT-ALLOC', recordedBy: 'Mr. Emmanuel Donkor' },
      { id: 'tx-05', activityId: 'act-002', type: 'expense', title: 'Custom Medals, Trophies & Ribbons from Trophy Palace', amount: 1750, date: '2026-01-22', reference: 'TRP-INV-889', recordedBy: 'Mr. Emmanuel Donkor' },
      { id: 'tx-06', activityId: 'act-002', type: 'expense', title: 'First Aid Medical Team, Ambulance Standby & Glucose', amount: 1200, date: '2026-01-26', reference: 'MED-REDX-44', recordedBy: 'Mr. Emmanuel Donkor' },
      { id: 'tx-07', activityId: 'act-002', type: 'expense', title: 'Certified Match Officials & Referees Honorarium', amount: 1000, date: '2026-01-27', reference: 'GFA-REF-HON', recordedBy: 'Mr. Emmanuel Donkor' }
    ]
  },
  {
    id: 'act-003',
    title: 'JHS Science & Computer Lab Upgrade Project',
    description: 'Procurement of 12 additional dual-core desktop systems, network cabling, and physics optical equipment.',
    category: 'Building Repair',
    budget: 15000,
    fundsAllocated: 15000,
    incomeReceived: 15000,
    expensesSpent: 12800,
    outstandingObligations: 1200,
    startDate: '2025-11-10',
    endDate: '2026-01-10',
    status: 'in_progress',
    transactions: [
      { id: 'tx-08', activityId: 'act-003', type: 'income', title: 'Capital Development Fund Transfer from Board Account', amount: 15000, date: '2025-11-12', reference: 'TRF-CAP-0992', recordedBy: 'Mr. Emmanuel Donkor' },
      { id: 'tx-09', activityId: 'act-003', type: 'expense', title: '12 Desktop Workstations & Monitors (CompuGhana Ltd)', amount: 10400, date: '2025-11-20', reference: 'INV-CG-9012', recordedBy: 'Mr. Emmanuel Donkor' },
      { id: 'tx-10', activityId: 'act-003', type: 'expense', title: 'Gigabit Switch, Structured Cat6 Cabling & Trunking', amount: 2400, date: '2025-12-05', reference: 'INV-NET-2201', recordedBy: 'Mr. Emmanuel Donkor' }
    ]
  }
];

export const initialAttendanceRecords: AttendanceRecord[] = [
  {
    id: 'att-2026-03-10-b4a',
    classId: 'cls-b4a',
    date: '2026-03-10',
    status: 'submitted',
    submittedBy: 'Mr. Samuel Osei',
    submittedAt: '2026-03-10T08:45:00Z',
    entries: [
      { studentId: 'stu-001', status: 'present' },
      { studentId: 'stu-002', status: 'present' },
      { studentId: 'stu-003', status: 'present' },
      { studentId: 'stu-004', status: 'late', remarks: 'Arrived at 08:20 due to heavy traffic on Spintex Road' },
      { studentId: 'stu-005', status: 'present' },
      { studentId: 'stu-006', status: 'absent', remarks: 'Guardian called - mild malaria fever' },
      { studentId: 'stu-007', status: 'present' }
    ]
  },
  {
    id: 'att-2026-03-11-b4a',
    classId: 'cls-b4a',
    date: '2026-03-11',
    status: 'draft', // DRAFT - TEACHER CAN MARK & SUBMIT IN JOURNEY C!
    submittedBy: 'Mr. Samuel Osei',
    entries: [
      { studentId: 'stu-001', status: 'present' },
      { studentId: 'stu-002', status: 'present' },
      { studentId: 'stu-003', status: 'present' },
      { studentId: 'stu-004', status: 'present' },
      { studentId: 'stu-005', status: 'present' },
      { studentId: 'stu-006', status: 'excused', remarks: 'Doctor clinic review appointment' },
      { studentId: 'stu-007', status: 'present' }
    ]
  }
];

export const initialResultSubmissions: ResultSubmission[] = [
  {
    id: 'res-b4a-mth',
    classId: 'cls-b4a',
    subjectId: 'sub-mth-4a',
    termId: 'term-2',
    academicYearId: 'ay-2025-2026',
    submittedBy: 'Mr. Samuel Osei',
    submittedAt: '2026-03-08T14:30:00Z',
    status: 'submitted', // PENDING HEADTEACHER REVIEW FOR DEMO JOURNEY B!
    reviewNotes: 'Term 2 Mid-Term & Class Project Scores submitted for academic review.',
    marks: [
      { studentId: 'stu-001', classScore: 28, examScore: 62, totalScore: 90, grade: '1', remark: 'Excellent performance' },
      { studentId: 'stu-002', classScore: 26, examScore: 58, totalScore: 84, grade: '2', remark: 'Very Good' },
      { studentId: 'stu-003', classScore: 25, examScore: 52, totalScore: 77, grade: '3', remark: 'Good' },
      { studentId: 'stu-004', classScore: 22, examScore: 46, totalScore: 68, grade: '4', remark: 'Credit' },
      { studentId: 'stu-005', classScore: 27, examScore: 59, totalScore: 86, grade: '2', remark: 'Very Good' },
      { studentId: 'stu-006', classScore: 18, examScore: 38, totalScore: 56, grade: '6', remark: 'Pass - Needs encouragement' },
      { studentId: 'stu-007', classScore: 29, examScore: 66, totalScore: 95, grade: '1', remark: 'Outstanding mathematical prowess' }
    ]
  },
  {
    id: 'res-b4a-eng',
    classId: 'cls-b4a',
    subjectId: 'sub-eng-4a',
    termId: 'term-2',
    academicYearId: 'ay-2025-2026',
    submittedBy: 'Mr. Samuel Osei',
    submittedAt: '2026-03-01T10:00:00Z',
    status: 'approved',
    reviewedBy: 'Mrs. Comfort Addo',
    reviewedAt: '2026-03-03T11:20:00Z',
    reviewNotes: 'Approved. Grammar and creative composition sections well moderated.',
    marks: [
      { studentId: 'stu-001', classScore: 27, examScore: 59, totalScore: 86, grade: '2', remark: 'Very Good' },
      { studentId: 'stu-002', classScore: 29, examScore: 65, totalScore: 94, grade: '1', remark: 'Excellent vocabulary and diction' },
      { studentId: 'stu-003', classScore: 26, examScore: 56, totalScore: 82, grade: '2', remark: 'Very Good' },
      { studentId: 'stu-004', classScore: 23, examScore: 51, totalScore: 74, grade: '3', remark: 'Good' },
      { studentId: 'stu-005', classScore: 25, examScore: 54, totalScore: 79, grade: '3', remark: 'Good' },
      { studentId: 'stu-006', classScore: 20, examScore: 42, totalScore: 62, grade: '5', remark: 'Fair' },
      { studentId: 'stu-007', classScore: 28, examScore: 63, totalScore: 91, grade: '1', remark: 'Excellent comprehension' }
    ]
  },
  {
    id: 'res-b5-sci',
    classId: 'cls-b5',
    subjectId: 'sub-sci-5',
    termId: 'term-2',
    academicYearId: 'ay-2025-2026',
    submittedBy: 'Ms. Akua Boateng',
    submittedAt: '2026-03-05T16:00:00Z',
    status: 'rejected', // RETURNED FOR CORRECTION - SUBJECT TEACHER JOURNEY D!
    reviewedBy: 'Mrs. Comfort Addo',
    reviewedAt: '2026-03-06T09:15:00Z',
    reviewNotes: 'Please verify marks for student #009 (Jessica Quaye) - practical assessment component was computed out of 20 instead of 30.',
    marks: [
      { studentId: 'stu-009', classScore: 16, examScore: 54, totalScore: 70, grade: '3', remark: 'Good (Correction Pending)' },
      { studentId: 'stu-010', classScore: 26, examScore: 58, totalScore: 84, grade: '2', remark: 'Very Good' },
      { studentId: 'stu-011', classScore: 24, examScore: 50, totalScore: 74, grade: '3', remark: 'Good' }
    ]
  }
];

export const initialReportCards: ReportCard[] = [
  {
    id: 'rep-001-term1',
    studentId: 'stu-001',
    classId: 'cls-b4a',
    termId: 'term-1',
    academicYearId: 'ay-2025-2026',
    overallScore: 88.5,
    averageScore: 88.5,
    position: '2nd out of 32',
    totalStudentsInClass: 32,
    attendancePresent: 68,
    attendanceTotal: 70,
    classTeacherRemark: 'Kofi is an exemplary student with keen interest in arithmetic and reading.',
    headteacherRemark: 'Commendable performance. Promoted to continue hard work.',
    isPublished: true,
    publishedAt: '2025-12-20'
  },
  {
    id: 'rep-002-term1',
    studentId: 'stu-002',
    classId: 'cls-b4a',
    termId: 'term-1',
    academicYearId: 'ay-2025-2026',
    overallScore: 92.4,
    averageScore: 92.4,
    position: '1st out of 32',
    totalStudentsInClass: 32,
    attendancePresent: 70,
    attendanceTotal: 70,
    classTeacherRemark: 'Ama continues to exhibit intellectual curiosity and leadership skills.',
    headteacherRemark: 'Brilliant student. Winner of the Term 1 Academic Excellence Cup.',
    isPublished: true,
    publishedAt: '2025-12-20'
  }
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-001',
    title: 'Results Awaiting Review',
    message: 'Mr. Samuel Osei submitted Basic 4A Mathematics results for Term 2 moderation.',
    type: 'warning',
    targetRoles: ['owner', 'headteacher'],
    read: false,
    createdAt: '2026-03-08T14:32:00Z',
    link: '/academics'
  },
  {
    id: 'notif-002',
    title: 'Expense Approval Requested',
    message: 'Mr. Emmanuel Donkor submitted an expense of GH₵2,600 (Apex Plumbing) for owner approval.',
    type: 'info',
    targetRoles: ['owner'],
    read: false,
    createdAt: '2026-02-24T11:45:00Z',
    link: '/finances'
  },
  {
    id: 'notif-003',
    title: 'Results Returned For Correction',
    message: 'Headmistress Mrs. Comfort Addo returned Basic 5 Integrated Science marks for moderation adjustment.',
    type: 'alert',
    targetRoles: ['subject_teacher'],
    read: false,
    createdAt: '2026-03-06T09:16:00Z',
    link: '/academics'
  },
  {
    id: 'notif-004',
    title: 'Fee Payment Recorded',
    message: 'GH₵2,850 received from Dr. Evelyn Ofori for Ama Serwaa (Basic 4A). Receipt #REC-2026-0102.',
    type: 'success',
    targetRoles: ['owner', 'accountant'],
    read: true,
    createdAt: '2026-01-16T12:00:00Z',
    link: '/finances'
  },
  {
    id: 'notif-005',
    title: 'Incomplete Attendance Alert',
    message: 'Today attendance for Basic 4A is currently saved in draft and awaiting submission.',
    type: 'info',
    targetRoles: ['headteacher', 'teacher'],
    read: false,
    createdAt: '2026-03-11T08:00:00Z',
    link: '/attendance'
  }
];

export const initialParentCommunications: ParentCommunication[] = [
  {
    id: 'com-001',
    title: 'Official Term 2 Fee Payment Confirmation',
    message: 'Dear Mr. Patrick Mensah, Heritage Crown Academy confirms receipt of GH₵2,850 for Kofi Mensah (Basic 4A). Receipt REC-2026-0101. Thank you.',
    channel: 'SMS',
    targetType: 'individual',
    targetGuardianId: 'grd-001',
    eventType: 'payment_receipt',
    status: 'delivered',
    recipientCount: 1,
    sentAt: '2026-01-14T15:20:00Z',
    sentBy: 'Mr. Emmanuel Donkor'
  },
  {
    id: 'com-002',
    title: 'Term 2 Mid-Term Break & Parent-Teacher Consultation',
    message: 'Dear Parents, please be reminded that Mid-Term break commences Friday 27th February. Open Day and academic report review takes place from 9am to 2pm.',
    channel: 'Both',
    targetType: 'all',
    eventType: 'announcement',
    status: 'delivered',
    recipientCount: 428,
    sentAt: '2026-02-23T09:00:00Z',
    sentBy: 'Mrs. Comfort Addo'
  },
  {
    id: 'com-003',
    title: 'Basic 4A Kakum Educational Tour Permission & Departure Reminder',
    message: 'Notice to Basic 4 parents: The Cape Coast & Kakum bus departs at 6:30am sharp on Friday. Students should be in official sports wear with water bottles.',
    channel: 'SMS',
    targetType: 'class',
    targetClassId: 'cls-b4a',
    eventType: 'announcement',
    status: 'delivered',
    recipientCount: 32,
    sentAt: '2026-02-18T14:15:00Z',
    sentBy: 'Mr. Samuel Osei'
  },
  {
    id: 'com-004',
    title: 'Term 2 Outstanding Fee Balance Reminder',
    message: 'Notice: Term 2 fees arrears are due before examination clearance slips are issued. Kindly settle all balances at the bursar office or via MoMo.',
    channel: 'SMS',
    targetType: 'all',
    eventType: 'fee_reminder',
    status: 'delivered',
    recipientCount: 64,
    sentAt: '2026-02-28T11:00:00Z',
    sentBy: 'Mr. Emmanuel Donkor'
  }
];

export const initialAuditEvents: AuditEvent[] = [
  {
    id: 'aud-001',
    actorId: 'user-accountant',
    actorName: 'Mr. Emmanuel Donkor',
    actorRole: 'accountant',
    action: 'Fee Payment Recorded',
    details: 'Issued receipt REC-2026-0101 for GH₵2,850 to student Kofi Mensah (HCA/2022/041)',
    timestamp: '2026-01-14T15:18:22Z'
  },
  {
    id: 'aud-002',
    actorId: 'user-owner',
    actorName: 'Dr. Kwame Mensah',
    actorRole: 'owner',
    action: 'Expense Approved',
    details: 'Approved EXP-2026-004: VIP Coach Charter for Kakum Tour (GH₵2,800)',
    timestamp: '2026-02-15T10:11:05Z'
  },
  {
    id: 'aud-003',
    actorId: 'user-teacher',
    actorName: 'Mr. Samuel Osei',
    actorRole: 'teacher',
    action: 'Academic Marks Submitted',
    details: 'Submitted Term 2 marks for Basic 4A Mathematics (7 students scored)',
    timestamp: '2026-03-08T14:30:10Z'
  },
  {
    id: 'aud-004',
    actorId: 'user-headteacher',
    actorName: 'Mrs. Comfort Addo',
    actorRole: 'headteacher',
    action: 'Marks Returned For Revision',
    details: 'Returned Basic 5 Integrated Science results to Ms. Akua Boateng with moderation notes',
    timestamp: '2026-03-06T09:15:40Z'
  },
  {
    id: 'aud-005',
    actorId: 'user-admin',
    actorName: 'Ms. Grace Asante',
    actorRole: 'admin',
    action: 'Student Placement Confirmed',
    details: 'Placed newly admitted student Nana Akosua Mensah (HCA/2025/112) into Basic 1',
    timestamp: '2025-09-08T11:00:00Z'
  }
];
