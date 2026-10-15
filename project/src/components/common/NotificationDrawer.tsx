import React from 'react';
import { X, CheckCheck, Bell, ExternalLink, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose
}) => {
  const {
    notifications,
    currentUser,
    markNotificationRead,
    markAllNotificationsRead
  } = useApp();
  const navigate = useNavigate();

  if (!isOpen) return null;

  // Filter for role
  const roleNotifications = notifications.filter((n) =>
    n.targetRoles.includes(currentUser.role)
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'alert':
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-[#72D94B] shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-[#FFA51F] shrink-0" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-[#E7E2D9] flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 bg-[#FFF8ED] border-b border-[#E7E2D9] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#FFA51F]/20 flex items-center justify-center text-[#B26A00]">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#171717]">System Notifications</h3>
                <p className="text-xs text-[#666666]">
                  {roleNotifications.filter((n) => !n.read).length} unread alerts for {currentUser.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {roleNotifications.some((n) => !n.read) && (
                <button
                  onClick={() => markAllNotificationsRead()}
                  className="p-1.5 rounded-lg text-xs font-semibold text-[#B26A00] hover:bg-[#FFA51F]/15 flex items-center gap-1 cursor-pointer transition-colors"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span className="hidden sm:inline">Mark All Read</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-[#666666] hover:text-[#171717] hover:bg-black/5 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {roleNotifications.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#666666]">
                <Bell className="w-10 h-10 text-stone-200 mx-auto mb-2" />
                <p>No notifications for your role at this time.</p>
              </div>
            ) : (
              roleNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    notif.read
                      ? 'bg-white border-[#E7E2D9] opacity-75'
                      : 'bg-[#FFF8ED]/40 border-[#FFA51F]/30 shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {getIcon(notif.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-xs font-bold ${notif.read ? 'text-[#171717]' : 'text-[#B26A00]'}`}>
                          {notif.title}
                        </p>
                        <span className="text-[10px] text-[#666666] shrink-0">
                          {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-[#666666] mt-1 leading-relaxed">{notif.message}</p>
                      
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-stone-100">
                        {notif.link ? (
                          <button
                            onClick={() => {
                              onClose();
                              markNotificationRead(notif.id);
                              navigate(notif.link!);
                            }}
                            className="text-xs font-semibold text-[#FFA51F] hover:text-[#F29412] inline-flex items-center gap-1 cursor-pointer"
                          >
                            <span>Open workflow</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        ) : (
                          <span />
                        )}
                        {!notif.read && (
                          <button
                            onClick={() => markNotificationRead(notif.id)}
                            className="text-[11px] font-medium text-[#666666] hover:text-[#171717] cursor-pointer"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
