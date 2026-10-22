import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Activity,
  CheckCircle2,
  Pencil,
  UserPlus,
  MessageSquare,
  RefreshCw,
  CalendarDays,
  Rocket,
  Flag,
  Mail,
  Timer,
  Paperclip,
} from 'lucide-react';

const activityTypeStyles: Record<
  string,
  {
    badgeClass: string;
    icon: React.ReactNode;
    label: string;
  }
> = {
  issue_created: {
    badgeClass: 'bg-[#B8F28B]/10 text-[#B8F28B] border border-[#304A39]',
    icon: <CheckCircle2 className="w-3 h-3 text-[#B8F28B]" />,
    label: 'Issue Created',
  },
  issue_updated: {
    badgeClass: 'bg-[#77C98A]/10 text-[#77C98A] border border-[#304A39]',
    icon: <Pencil className="w-3 h-3 text-[#77C98A]" />,
    label: 'Issue Updated',
  },
  issue_assigned: {
    badgeClass: 'bg-purple-900/20 text-purple-300 border border-[#304A39]',
    icon: <UserPlus className="w-3 h-3 text-purple-400" />,
    label: 'Assigned',
  },
  comment_added: {
    badgeClass: 'bg-[#1B2B21] text-[#E9F5E9] border border-[#304A39]',
    icon: <MessageSquare className="w-3 h-3 text-[#A7BDAA]" />,
    label: 'Comment',
  },
  status_changed: {
    badgeClass: 'bg-amber-900/20 text-amber-300 border border-[#304A39]',
    icon: <RefreshCw className="w-3 h-3 text-amber-400" />,
    label: 'Status Changed',
  },
  sprint_created: {
    badgeClass: 'bg-[#77C98A]/15 text-[#77C98A] border border-[#304A39]',
    icon: <CalendarDays className="w-3 h-3 text-[#77C98A]" />,
    label: 'Sprint Created',
  },
  sprint_started: {
    badgeClass: 'bg-[#B8F28B]/15 text-[#B8F28B] border border-[#304A39]',
    icon: <Rocket className="w-3 h-3 text-[#B8F28B]" />,
    label: 'Sprint Started',
  },
  sprint_completed: {
    badgeClass: 'bg-[#132018] text-[#A7BDAA] border border-[#304A39]',
    icon: <Flag className="w-3 h-3 text-[#A7BDAA]" />,
    label: 'Sprint Completed',
  },
  user_invited: {
    badgeClass: 'bg-pink-900/20 text-pink-300 border border-[#304A39]',
    icon: <Mail className="w-3 h-3 text-pink-400" />,
    label: 'Team Invited',
  },
  work_logged: {
    badgeClass: 'bg-amber-900/20 text-amber-300 border border-[#304A39]',
    icon: <Timer className="w-3 h-3 text-amber-400" />,
    label: 'Hours Logged',
  },
  file_attached: {
    badgeClass: 'bg-blue-900/20 text-blue-300 border border-[#304A39]',
    icon: <Paperclip className="w-3 h-3 text-blue-400" />,
    label: 'Asset Attached',
  },
};

export const ActivityView: React.FC = () => {
  const { activities, users } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2.5">
        <Activity className="w-5 h-5 text-[#B8F28B]" />
        <div>
          <h2 className="text-xl font-bold text-[#E9F5E9]">Agency Activity Feed</h2>
          <p className="text-xs text-[#A7BDAA] mt-0.5">Audit trail of workspace edits, sprint transitions, and collaboration.</p>
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="bg-[#17231B] border border-[#304A39] rounded-2xl p-12 text-center">
          <Activity className="w-10 h-10 text-[#77C98A]/40 mx-auto mb-3" />
          <p className="text-[#E9F5E9] font-medium text-sm">No activity recorded yet</p>
          <p className="text-[#A7BDAA] text-xs mt-1">
            Actions like creating deliverables, commenting, and logging hours will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.slice(0, 50).map(activity => {
            const user = users.find(u => u.id === activity.userId);

            const activityConfig =
              activityTypeStyles[activity.type] ?? {
                badgeClass: 'bg-[#132018] text-[#A7BDAA] border border-[#304A39]',
                icon: <Activity className="w-3 h-3 text-[#A7BDAA]" />,
                label: 'Activity',
              };

            return (
              <div
                key={activity.id}
                className="bg-[#17231B] border border-[#304A39] p-4 rounded-2xl flex items-start gap-3.5 hover:border-[#77C98A] transition-all"
              >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-xl bg-[#1B2B21] border border-[#304A39] flex items-center justify-center text-[#B8F28B] text-xs font-mono font-bold flex-shrink-0 mt-0.5">
                  {user?.name
                    .split(' ')
                    .map(n => n[0])
                    .join('') ?? '?'}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-xs text-[#E9F5E9]">
                      {user?.name ?? 'System User'}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full font-medium ${activityConfig.badgeClass}`}
                    >
                      {activityConfig.icon}
                      {activityConfig.label}
                    </span>
                  </div>

                  <p className="text-xs text-[#A7BDAA] mt-1.5 leading-relaxed">
                    {activity.details}
                  </p>

                  <div className="text-[10px] text-[#A7BDAA]/60 font-mono mt-2">
                    {new Date(activity.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};