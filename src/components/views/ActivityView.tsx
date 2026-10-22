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
    badgeClass: 'bg-[#d4a237]/10 text-[#d4a237] border border-[#1c2232]',
    icon: <CheckCircle2 className="w-3 h-3 text-[#d4a237]" />,
    label: 'Issue Created',
  },
  issue_updated: {
    badgeClass: 'bg-[#e5be60]/10 text-[#e5be60] border border-[#1c2232]',
    icon: <Pencil className="w-3 h-3 text-[#e5be60]" />,
    label: 'Issue Updated',
  },
  issue_assigned: {
    badgeClass: 'bg-purple-900/20 text-purple-300 border border-[#1c2232]',
    icon: <UserPlus className="w-3 h-3 text-purple-400" />,
    label: 'Assigned',
  },
  comment_added: {
    badgeClass: 'bg-[#141824] text-[#f2f4f8] border border-[#1c2232]',
    icon: <MessageSquare className="w-3 h-3 text-[#8c93a8]" />,
    label: 'Comment',
  },
  status_changed: {
    badgeClass: 'bg-amber-900/20 text-amber-300 border border-[#1c2232]',
    icon: <RefreshCw className="w-3 h-3 text-amber-400" />,
    label: 'Status Changed',
  },
  sprint_created: {
    badgeClass: 'bg-[#e5be60]/15 text-[#e5be60] border border-[#1c2232]',
    icon: <CalendarDays className="w-3 h-3 text-[#e5be60]" />,
    label: 'Sprint Created',
  },
  sprint_started: {
    badgeClass: 'bg-[#d4a237]/15 text-[#d4a237] border border-[#1c2232]',
    icon: <Rocket className="w-3 h-3 text-[#d4a237]" />,
    label: 'Sprint Started',
  },
  sprint_completed: {
    badgeClass: 'bg-[#10141f] text-[#8c93a8] border border-[#1c2232]',
    icon: <Flag className="w-3 h-3 text-[#8c93a8]" />,
    label: 'Sprint Completed',
  },
  user_invited: {
    badgeClass: 'bg-pink-900/20 text-pink-300 border border-[#1c2232]',
    icon: <Mail className="w-3 h-3 text-pink-400" />,
    label: 'Team Invited',
  },
  work_logged: {
    badgeClass: 'bg-amber-900/20 text-amber-300 border border-[#1c2232]',
    icon: <Timer className="w-3 h-3 text-amber-400" />,
    label: 'Hours Logged',
  },
  file_attached: {
    badgeClass: 'bg-blue-900/20 text-blue-300 border border-[#1c2232]',
    icon: <Paperclip className="w-3 h-3 text-blue-400" />,
    label: 'Asset Attached',
  },
};

export const ActivityView: React.FC = () => {
  const { activities, users } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2.5">
        <Activity className="w-5 h-5 text-[#d4a237]" />
        <div>
          <h2 className="text-xl font-bold text-[#f2f4f8]">Agency Activity Feed</h2>
          <p className="text-xs text-[#8c93a8] mt-0.5">Audit trail of workspace edits, sprint transitions, and collaboration.</p>
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="bg-[#0e111a] border border-[#1c2232] rounded-2xl p-12 text-center">
          <Activity className="w-10 h-10 text-[#e5be60]/40 mx-auto mb-3" />
          <p className="text-[#f2f4f8] font-medium text-sm">No activity recorded yet</p>
          <p className="text-[#8c93a8] text-xs mt-1">
            Actions like creating deliverables, commenting, and logging hours will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.slice(0, 50).map(activity => {
            const user = users.find(u => u.id === activity.userId);

            const activityConfig =
              activityTypeStyles[activity.type] ?? {
                badgeClass: 'bg-[#10141f] text-[#8c93a8] border border-[#1c2232]',
                icon: <Activity className="w-3 h-3 text-[#8c93a8]" />,
                label: 'Activity',
              };

            return (
              <div
                key={activity.id}
                className="bg-[#0e111a] border border-[#1c2232] p-4 rounded-2xl flex items-start gap-3.5 hover:border-[#e5be60] transition-all"
              >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-xl bg-[#141824] border border-[#1c2232] flex items-center justify-center text-[#d4a237] text-xs font-mono font-bold flex-shrink-0 mt-0.5">
                  {user?.name
                    .split(' ')
                    .map(n => n[0])
                    .join('') ?? '?'}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-xs text-[#f2f4f8]">
                      {user?.name ?? 'System User'}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full font-medium ${activityConfig.badgeClass}`}
                    >
                      {activityConfig.icon}
                      {activityConfig.label}
                    </span>
                  </div>

                  <p className="text-xs text-[#8c93a8] mt-1.5 leading-relaxed">
                    {activity.details}
                  </p>

                  <div className="text-[10px] text-[#8c93a8]/60 font-mono mt-2">
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