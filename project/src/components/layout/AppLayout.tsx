import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { ToastContainer } from '../common/ToastContainer';
import { GlobalSearchModal } from '../common/GlobalSearchModal';
import { NotificationDrawer } from '../common/NotificationDrawer';
import { StudentProfileModal } from '../student/StudentProfileModal';

export const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [viewingStudentId, setViewingStudentId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#FFF8ED] text-[#171717] flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* TopBar */}
        <TopBar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenSearch={() => setSearchOpen(true)}
          onOpenNotifications={() => setNotificationsOpen(true)}
        />

        {/* Workspace Body */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet context={{ openStudentProfile: (id: string) => setViewingStudentId(id) }} />
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <ToastContainer />
      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectStudent={(id) => setViewingStudentId(id)}
      />
      <NotificationDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
      <StudentProfileModal
        isOpen={Boolean(viewingStudentId)}
        onClose={() => setViewingStudentId(null)}
        studentId={viewingStudentId}
      />
    </div>
  );
};
