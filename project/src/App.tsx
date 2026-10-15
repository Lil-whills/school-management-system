import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';

// Pages
import { LoginPage } from './pages/LoginPage';
import { OwnerDashboard } from './pages/OwnerDashboard';
import { HeadteacherDashboard } from './pages/HeadteacherDashboard';
import { ClassTeacherDashboard } from './pages/ClassTeacherDashboard';
import { SubjectTeacherDashboard } from './pages/SubjectTeacherDashboard';
import { AccountantDashboard } from './pages/AccountantDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { StudentsPage } from './pages/StudentsPage';
import { AttendancePage } from './pages/AttendancePage';
import { AcademicsPage } from './pages/AcademicsPage';
import { FinancePage } from './pages/FinancePage';
import { FinancialActivitiesPage } from './pages/FinancialActivitiesPage';
import { CommunicationPage } from './pages/CommunicationPage';
import { ReportsPage } from './pages/ReportsPage';
import { AuditPage } from './pages/AuditPage';
import { SettingsPage } from './pages/SettingsPage';

// Dynamic role dashboard router
const RoleDashboardHome: React.FC = () => {
  const { currentUser } = useApp();

  switch (currentUser.role) {
    case 'owner':
      return <OwnerDashboard />;
    case 'headteacher':
      return <HeadteacherDashboard />;
    case 'teacher':
      return <ClassTeacherDashboard />;
    case 'subject_teacher':
      return <SubjectTeacherDashboard />;
    case 'accountant':
      return <AccountantDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <OwnerDashboard />;
  }
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Application Layout */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<RoleDashboardHome />} />
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/academics" element={<AcademicsPage />} />
            <Route path="/finances" element={<FinancePage />} />
            <Route path="/activities" element={<FinancialActivitiesPage />} />
            <Route path="/communications" element={<CommunicationPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/audit" element={<AuditPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}