import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IssueDetailModal } from '../IssueDetailModal';
import { Issue } from '../../types';
import {
  BookOpen,
  CheckSquare,
  Bug,
  Target,
  FileText,
  Activity,
  Layers,
  Clock,
  Sparkles,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { issues, sprints, users } = useApp();
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  const byStatus = {
    backlog: issues.filter(i => i.status === 'backlog').length,
    todo: issues.filter(i => i.status === 'todo').length,
    'in-progress': issues.filter(i => i.status === 'in-progress').length,
    'in-review': issues.filter(i => i.status === 'in-review').length,
    done: issues.filter(i => i.status === 'done').length,
  };

  const byType = {
    task: issues.filter(i => i.type === 'task').length,
    story: issues.filter(i => i.type === 'story').length,
    bug: issues.filter(i => i.type === 'bug').length,
    epic: issues.filter(i => i.type === 'epic').length,
  };

  const activeSprint = sprints.find(s => s.status === 'active');
  const activeSprintIssues = activeSprint ? issues.filter(i => i.sprintId === activeSprint.id) : [];
  const activeSprintDone = activeSprintIssues.filter(i => i.status === 'done').length;
  const activeSprintProgress = activeSprintIssues.length > 0
    ? Math.round((activeSprintDone / activeSprintIssues.length) * 100)
    : 0;

  const recentIssues = [...issues]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 8);

  const typeIcons: Record<string, React.ReactNode> = {
    story: <BookOpen className="w-3.5 h-3.5 text-[#77C98A]" />,
    task: <CheckSquare className="w-3.5 h-3.5 text-[#B8F28B]" />,
    bug: <Bug className="w-3.5 h-3.5 text-rose-400" />,
    epic: <Target className="w-3.5 h-3.5 text-purple-400" />,
  };

  const statCards = [
    { label: 'Unassigned Backlog', count: byStatus.backlog, accent: 'text-[#A7BDAA]' },
    { label: 'To Do',              count: byStatus.todo,    accent: 'text-[#77C98A]' },
    { label: 'In Progress',        count: byStatus['in-progress'], accent: 'text-amber-400' },
    { label: 'In Review',          count: byStatus['in-review'],   accent: 'text-blue-400' },
    { label: 'Completed Deliverables', count: byStatus.done,   accent: 'text-[#B8F28B]' },
    { label: 'Total Tracked Issues', count: issues.length,   accent: 'text-[#E9F5E9]' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#E9F5E9]">Agency Operations Dashboard</h2>
        <p className="text-xs text-[#A7BDAA] mt-0.5">Real-time sprint velocity, issue distribution, and team capacity analytics.</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {statCards.map(card => (
          <div key={card.label} className="bg-[#17231B] border border-[#304A39] p-4 rounded-2xl">
            <div className={`text-2xl font-bold font-mono ${card.accent}`}>{card.count}</div>
            <div className="text-[11px] text-[#A7BDAA] font-medium mt-1 truncate">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Issue Types Breakdown */}
        <div className="bg-[#17231B] border border-[#304A39] p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#E9F5E9] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#77C98A]" /> Issue Types Breakdown
            </h3>
            <span className="text-[10px] text-[#A7BDAA] font-mono">{issues.length} total</span>
          </div>

          <div className="space-y-3.5">
            {Object.entries(byType).map(([type, count]) => {
              const pct = issues.length > 0 ? Math.round((count / issues.length) * 100) : 0;
              return (
                <div key={type} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center">
                        {typeIcons[type] ?? <FileText className="w-3.5 h-3.5 text-[#A7BDAA]" />}
                      </span>
                      <span className="capitalize text-[#E9F5E9] font-medium">{type}</span>
                    </div>
                    <span className="text-[11px] font-mono text-[#A7BDAA]">
                      {count} <span className="text-[#304A39]">({pct}%)</span>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#132018] rounded-full overflow-hidden border border-[#304A39]/50">
                    <div
                      className="h-full bg-gradient-to-r from-[#77C98A] to-[#B8F28B] rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Sprint Progress Widget */}
        <div className="bg-[#17231B] border border-[#304A39] p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#E9F5E9] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#B8F28B]" /> Active Sprint Status
            </h3>
            {activeSprint && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#B8F28B]/10 text-[#B8F28B] font-mono border border-[#304A39]">
                Active
              </span>
            )}
          </div>

          {activeSprint ? (
            <div className="space-y-4">
              <div>
                <div className="font-bold text-sm text-[#E9F5E9]">{activeSprint.name}</div>
                {activeSprint.goal && (
                  <div className="text-xs text-[#A7BDAA] mt-0.5">{activeSprint.goal}</div>
                )}
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#A7BDAA]">{activeSprintDone} of {activeSprintIssues.length} deliverables completed</span>
                  <span className="font-mono font-bold text-[#B8F28B]">{activeSprintProgress}%</span>
                </div>
                <div className="h-2.5 bg-[#132018] rounded-full overflow-hidden border border-[#304A39]">
                  <div
                    className="h-full bg-[#B8F28B] rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${activeSprintProgress}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center pt-2">
                {[
                  { label: 'To Do', count: activeSprintIssues.filter(i => i.status === 'todo').length, color: 'text-[#77C98A]' },
                  { label: 'Active', count: activeSprintIssues.filter(i => i.status === 'in-progress').length, color: 'text-amber-400' },
                  { label: 'Review', count: activeSprintIssues.filter(i => i.status === 'in-review').length, color: 'text-blue-400' },
                  { label: 'Done', count: activeSprintDone, color: 'text-[#B8F28B]' },
                ].map(s => (
                  <div key={s.label} className="bg-[#132018] border border-[#304A39] rounded-xl p-2.5">
                    <div className={`text-base font-bold font-mono ${s.color}`}>{s.count}</div>
                    <div className="text-[10px] text-[#A7BDAA] mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="text-xs text-[#A7BDAA]">No sprint currently active</div>
              <div className="text-[11px] text-[#77C98A] mt-1">Start or plan sprints from the Backlog tab</div>
            </div>
          )}
        </div>
      </div>

      {/* Team Capacity / Performance */}
      <div className="bg-[#17231B] border border-[#304A39] p-5 rounded-2xl shadow-sm">
        <h3 className="font-bold text-xs uppercase tracking-wider text-[#E9F5E9] mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#77C98A]" /> Team Load & Production Capacity
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {users.map(user => {
            const assigned = issues.filter(i => i.assigneeId === user.id).length;
            const completed = issues.filter(i => i.assigneeId === user.id && i.status === 'done').length;
            return (
              <div key={user.id} className="flex items-center gap-3 p-3 bg-[#132018] border border-[#304A39] rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-[#1B2B21] border border-[#304A39] flex items-center justify-center text-[#B8F28B] text-xs font-bold font-mono flex-shrink-0">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-[#E9F5E9] truncate">{user.name}</div>
                  <div className="text-[10px] text-[#A7BDAA] font-mono mt-0.5">
                    <span className="text-[#B8F28B]">{assigned}</span> assigned • <span className="text-[#77C98A]">{completed}</span> done
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recently Updated Issues */}
      <div className="bg-[#17231B] border border-[#304A39] rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#304A39] flex items-center justify-between">
          <h3 className="font-bold text-xs uppercase tracking-wider text-[#E9F5E9] flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#B8F28B]" /> Recently Modified Issues
          </h3>
          <span className="text-[10px] text-[#A7BDAA]">Latest activity</span>
        </div>
        {recentIssues.length === 0 ? (
          <p className="text-xs text-[#A7BDAA] text-center py-8">No issues logged yet.</p>
        ) : (
          <div className="divide-y divide-[#304A39]/40 bg-[#132018]">
            {recentIssues.map(issue => (
              <div
                key={issue.id}
                onClick={() => setSelectedIssue(issue)}
                className="px-4 py-3 hover:bg-[#1B2B21] cursor-pointer flex items-center gap-3 group transition-colors"
              >
                <span className="flex items-center flex-shrink-0">
                  {typeIcons[issue.type] ?? (
                    <FileText className="w-3.5 h-3.5 text-[#A7BDAA]" />
                  )}
                </span>
                <span className="text-xs font-mono font-semibold text-[#B8F28B] w-20 flex-shrink-0">{issue.key}</span>
                <span className="text-xs text-[#E9F5E9] flex-1 truncate group-hover:text-[#B8F28B]">{issue.title}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full flex-shrink-0 font-medium ${
                  issue.status === 'done' ? 'bg-[#B8F28B]/10 text-[#B8F28B] border border-[#304A39]'
                  : issue.status === 'in-progress' ? 'bg-[#77C98A]/10 text-[#77C98A] border border-[#304A39]'
                  : issue.status === 'in-review' ? 'bg-blue-900/20 text-blue-300 border border-[#304A39]'
                  : 'bg-[#17231B] text-[#A7BDAA] border border-[#304A39]'
                }`}>
                  {issue.status}
                </span>
                <span className="text-[10px] text-[#A7BDAA] font-mono flex-shrink-0 hidden sm:block">
                  {new Date(issue.updatedAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedIssue && (
        <IssueDetailModal
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
        />
      )}
    </div>
  );
};