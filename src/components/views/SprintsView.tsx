import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IssueDetailModal } from '../IssueDetailModal';
import { Issue } from '../../types';
import {
  Calendar,
  ChevronDown,
  ChevronRight,
  BookOpen,
  CheckSquare,
  Bug,
  Trophy,
} from 'lucide-react';

export const SprintsView: React.FC = () => {
  const { sprints, issues, currentUser, startSprint, completeSprint } = useApp();
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [collapsedSprints, setCollapsedSprints] = useState<Set<string>>(new Set());

  const isAdmin = currentUser?.role === 'admin';

  const toggleSprint = (sprintId: string) => {
    setCollapsedSprints(prev => {
      const next = new Set(prev);
      next.has(sprintId) ? next.delete(sprintId) : next.add(sprintId);
      return next;
    });
  };

  const statusOrder = { active: 0, planned: 1, completed: 2 };
  const sortedSprints = [...sprints].sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);

  const issueTypeIcons: Record<string, React.ReactNode> = {
    story: <BookOpen className="w-3.5 h-3.5 text-[#77C98A]" />,
    task: <CheckSquare className="w-3.5 h-3.5 text-[#B8F28B]" />,
    bug: <Bug className="w-3.5 h-3.5 text-rose-400" />,
    epic: <Trophy className="w-3.5 h-3.5 text-purple-400" />,
  };

  const statusBadge: Record<string, string> = {
    active: 'bg-[#77C98A]/10 text-[#77C98A] border border-[#304A39]',
    planned: 'bg-amber-900/20 text-amber-300 border border-[#304A39]',
    completed: 'bg-[#132018] text-[#A7BDAA] border border-[#304A39]',
  };

  if (sortedSprints.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-[#E9F5E9]">Sprint Milestones</h2>
          <p className="text-xs text-[#A7BDAA] mt-0.5">Track production iterations and time-boxed agency releases.</p>
        </div>
        <div className="bg-[#17231B] border border-[#304A39] rounded-2xl p-12 text-center">
          <Calendar className="w-10 h-10 text-[#77C98A]/50 mx-auto mb-3" />
          <p className="text-[#E9F5E9] font-medium text-sm">No sprints planned yet</p>
          <p className="text-[#A7BDAA] text-xs mt-1">
            Navigate to Backlog and click "Plan Sprint" to set up your team's next sprint.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#E9F5E9]">Sprint Milestones</h2>
        <p className="text-xs text-[#A7BDAA] mt-0.5">Track production iterations, goals, and completion velocity.</p>
      </div>

      <div className="space-y-4">
        {sortedSprints.map(sprint => {
          const sprintIssues = issues.filter(i => i.sprintId === sprint.id);
          const done = sprintIssues.filter(i => i.status === 'done').length;
          const total = sprintIssues.length;
          const progress = total > 0 ? Math.round((done / total) * 100) : 0;
          const isCollapsed = collapsedSprints.has(sprint.id);

          return (
            <div key={sprint.id} className="bg-[#17231B] border border-[#304A39] rounded-2xl overflow-hidden shadow-sm">
              {/* Sprint Header */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <button
                      onClick={() => toggleSprint(sprint.id)}
                      className="mt-0.5 text-[#A7BDAA] hover:text-[#E9F5E9] flex-shrink-0 cursor-pointer"
                    >
                      {isCollapsed
                        ? <ChevronRight className="w-4 h-4" />
                        : <ChevronDown className="w-4 h-4" />}
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-sm text-[#E9F5E9]">{sprint.name}</h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${statusBadge[sprint.status]}`}>
                          {sprint.status}
                        </span>
                      </div>
                      {sprint.goal && (
                        <p className="text-xs text-[#A7BDAA] mt-1">{sprint.goal}</p>
                      )}
                      <div className="flex items-center gap-4 text-[10px] text-[#A7BDAA] font-mono mt-2">
                        {sprint.startDate && <span>Starts: {new Date(sprint.startDate).toLocaleDateString()}</span>}
                        {sprint.endDate && <span>Ends: {new Date(sprint.endDate).toLocaleDateString()}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Actions & Progress */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right hidden sm:block">
                      <div className="text-xs font-mono font-bold text-[#B8F28B]">{progress}%</div>
                      <div className="text-[10px] text-[#A7BDAA]">{done}/{total} done</div>
                    </div>

                    {isAdmin && sprint.status === 'planned' && (
                      <button
                        onClick={() => startSprint(sprint.id)}
                        className="px-3 py-1.5 bg-[#B8F28B] text-[#101914] font-semibold text-xs rounded-xl hover:bg-[#77C98A] transition-colors cursor-pointer"
                      >
                        Start Sprint
                      </button>
                    )}

                    {isAdmin && sprint.status === 'active' && (
                      <button
                        onClick={() => completeSprint(sprint.id)}
                        className="px-3 py-1.5 bg-[#77C98A] text-[#101914] font-semibold text-xs rounded-xl hover:bg-[#B8F28B] transition-colors cursor-pointer"
                      >
                        Complete Sprint
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4 h-2 bg-[#132018] rounded-full overflow-hidden border border-[#304A39]">
                  <div
                    className="h-full bg-gradient-to-r from-[#77C98A] to-[#B8F28B] rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Collapsible Issue List */}
              {!isCollapsed && (
                <div className="border-t border-[#304A39]/60 bg-[#132018]">
                  {sprintIssues.length === 0 ? (
                    <p className="text-xs text-[#A7BDAA] text-center py-6">
                      No issues assigned to this sprint.
                    </p>
                  ) : (
                    <div className="divide-y divide-[#304A39]/40">
                      {sprintIssues.map(issue => (
                        <div
                          key={issue.id}
                          onClick={() => setSelectedIssue(issue)}
                          className="px-5 py-3 hover:bg-[#1B2B21] flex items-center gap-3 cursor-pointer group transition-colors"
                        >
                          <span className="flex-shrink-0">{issueTypeIcons[issue.type]}</span>
                          <span className="text-xs font-mono font-semibold text-[#B8F28B] w-20 flex-shrink-0">{issue.key}</span>
                          <span className="text-xs text-[#E9F5E9] flex-1 truncate group-hover:text-[#B8F28B]">{issue.title}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            issue.status === 'done' ? 'bg-[#B8F28B]/10 text-[#B8F28B] border border-[#304A39]' :
                            issue.status === 'in-progress' ? 'bg-[#77C98A]/10 text-[#77C98A] border border-[#304A39]' :
                            issue.status === 'in-review' ? 'bg-blue-900/20 text-blue-300 border border-[#304A39]' :
                            'bg-[#17231B] text-[#A7BDAA] border border-[#304A39]'
                          }`}>{issue.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
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