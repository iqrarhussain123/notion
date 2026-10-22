import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CreateSprintModal } from '../CreateSprintModal';
import { CreateIssueModal } from '../CreateIssueModal';
import { IssueDetailModal } from '../IssueDetailModal';
import { Issue, IssueStatus, IssueType, IssuePriority, SprintStatus } from '../../types';
import { Plus, ChevronDown, ChevronRight, ArrowRight, BookOpen, CheckSquare, Bug, Target } from 'lucide-react';

export const BacklogView: React.FC = () => {
  const {
    issues, sprints, currentUser,
    startSprint, completeSprint, addSprint, addIssue, updateIssue,
  } = useApp();

  const [isCreateSprintOpen, setIsCreateSprintOpen] = useState(false);
  const [isCreateIssueOpen, setIsCreateIssueOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [collapsedSprints, setCollapsedSprints] = useState<Set<string>>(new Set());

  const isAdmin = currentUser?.role === 'admin';

  // Issues with no sprint assignment
  const backlogIssues = issues.filter(i => !i.sprintId);

  // Sprints that can receive issues (active or planned)
  const openSprints = sprints.filter(s => s.status === 'active' || s.status === 'planned');

  const toggleSprint = (sprintId: string) => {
    setCollapsedSprints(prev => {
      const next = new Set(prev);
      next.has(sprintId) ? next.delete(sprintId) : next.add(sprintId);
      return next;
    });
  };

  /**
   * Move a backlog issue into a sprint.
   * Sets sprintId and promotes status from 'backlog' → 'todo' if needed.
   */
  const moveToSprint = (issue: Issue, sprintId: string) => {
    updateIssue(issue.id, {
      sprintId,
      status: issue.status === 'backlog' ? 'todo' : issue.status,
    });
  };

  /**
   * Remove an issue from its sprint back to backlog.
   */
  const removeFromSprint = (issue: Issue) => {
    updateIssue(issue.id, {
      sprintId: undefined,
      status: 'backlog',
    });
  };

  const statusColors: Record<string, string> = {
    active: 'bg-[#77C98A]/10 text-[#77C98A] border border-[#304A39]',
    planned: 'bg-amber-900/20 text-amber-300 border border-[#304A39]',
    completed: 'bg-[#132018] text-[#A7BDAA] border border-[#304A39]',
  };

  const issueTypeIcons: Record<IssueType, React.ReactNode> = {
    story: <BookOpen className="w-3.5 h-3.5 text-[#77C98A]" />,
    task: <CheckSquare className="w-3.5 h-3.5 text-[#B8F28B]" />,
    bug: <Bug className="w-3.5 h-3.5 text-rose-400" />,
    epic: <Target className="w-3.5 h-3.5 text-purple-400" />,
  };

  const priorityDot: Record<IssuePriority, string> = {
    lowest: 'bg-[#A7BDAA]',
    low: 'bg-[#77C98A]',
    medium: 'bg-amber-400',
    high: 'bg-orange-400',
    highest: 'bg-rose-400',
  };

  const issueStatusBadge = (status: IssueStatus): string => {
    const map: Record<IssueStatus, string> = {
      done: 'bg-[#B8F28B]/10 text-[#B8F28B] border border-[#304A39]',
      'in-progress': 'bg-[#77C98A]/10 text-[#77C98A] border border-[#304A39]',
      'in-review': 'bg-blue-900/20 text-blue-300 border border-[#304A39]',
      todo: 'bg-[#132018] text-[#A7BDAA] border border-[#304A39]',
      backlog: 'bg-[#132018] text-[#A7BDAA] border border-[#304A39]',
    };
    return map[status] ?? 'bg-[#132018] text-[#A7BDAA] border border-[#304A39]';
  };

  const handleCreateSprintSubmit = (data: {
    name: string; goal: string; startDate: string; endDate: string; status: SprintStatus;
  }) => { addSprint(data); setIsCreateSprintOpen(false); };

  const handleCreateIssueSubmit = (issueData: {
    key: string; title: string; description: string;
    type: IssueType; priority: IssuePriority; status: IssueStatus;
    assigneeId?: string; sprintId?: string; labels: string[]; estimatedHours?: number;
  }) => {
    if (!currentUser) return;
    addIssue({
      ...issueData,
      reporterId: currentUser.id,
      comments: [], workLogs: [], links: [], attachments: [],
    });
    setIsCreateIssueOpen(false);
  };

  return (
    <div className="space-y-6">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#E9F5E9]">Agency Backlog & Sprint Planning</h2>
          <p className="text-xs text-[#A7BDAA] mt-0.5">Organize deliverables, assign to active milestones, and manage sprints.</p>
        </div>
        <div className="flex gap-2.5">
          <button
            onClick={() => setIsCreateIssueOpen(true)}
            className="px-3.5 py-2 bg-[#17231B] border border-[#304A39] text-[#E9F5E9] hover:border-[#77C98A] rounded-xl transition-all flex items-center gap-2 text-xs font-medium cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#B8F28B]" /> Create Issue
          </button>
          {isAdmin && (
            <button
              onClick={() => setIsCreateSprintOpen(true)}
              className="px-3.5 py-2 bg-[#B8F28B] text-[#101914] hover:bg-[#77C98A] rounded-xl transition-all flex items-center gap-2 text-xs font-semibold cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> Plan Sprint
            </button>
          )}
        </div>
      </div>

      {/* Sprint sections */}
      {sprints.map(sprint => {
        const sprintIssues = issues.filter(i => i.sprintId === sprint.id);
        const completedCount = sprintIssues.filter(i => i.status === 'done').length;
        const isCollapsed = collapsedSprints.has(sprint.id);
        const canReceiveIssues = sprint.status === 'active' || sprint.status === 'planned';

        return (
          <div key={sprint.id} className="bg-[#17231B] border border-[#304A39] rounded-2xl overflow-hidden shadow-sm">
            {/* Sprint header */}
            <div className="flex items-center justify-between p-4 bg-[#17231B]">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <button
                  onClick={() => toggleSprint(sprint.id)}
                  className="text-[#A7BDAA] hover:text-[#E9F5E9] flex-shrink-0 cursor-pointer"
                >
                  {isCollapsed
                    ? <ChevronRight className="w-4 h-4" />
                    : <ChevronDown className="w-4 h-4" />}
                </button>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-sm text-[#E9F5E9]">{sprint.name}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium ${statusColors[sprint.status]}`}>
                      {sprint.status}
                    </span>
                  </div>
                  {sprint.goal && (
                    <p className="text-xs text-[#A7BDAA] mt-0.5 truncate">{sprint.goal}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                <span className="text-xs text-[#A7BDAA] font-mono">{completedCount}/{sprintIssues.length} done</span>
                {sprint.status === 'planned' && isAdmin && (
                  <button
                    onClick={() => startSprint(sprint.id)}
                    className="px-3 py-1.5 bg-[#B8F28B] text-[#101914] font-semibold rounded-xl hover:bg-[#77C98A] transition-colors text-xs cursor-pointer"
                  >
                    Start Sprint
                  </button>
                )}
                {sprint.status === 'active' && isAdmin && (
                  <button
                    onClick={() => completeSprint(sprint.id)}
                    className="px-3 py-1.5 bg-[#77C98A] text-[#101914] font-semibold rounded-xl hover:bg-[#B8F28B] transition-colors text-xs cursor-pointer"
                  >
                    Complete Sprint
                  </button>
                )}
              </div>
            </div>

            {/* Sprint issue list */}
            {!isCollapsed && (
              <div className="border-t border-[#304A39]/60 bg-[#132018]">
                {sprintIssues.length === 0 ? (
                  <p className="text-xs text-[#A7BDAA] text-center py-8">
                    No issues in this sprint yet.{' '}
                    {canReceiveIssues && (
                      <span className="text-[#B8F28B]">
                        Hover backlog items below to assign them here.
                      </span>
                    )}
                  </p>
                ) : (
                  <div className="divide-y divide-[#304A39]/40">
                    {sprintIssues.map(issue => (
                      <SprintIssueRow
                        key={issue.id}
                        issue={issue}
                        typeIcon={issueTypeIcons[issue.type]}
                        priorityDot={priorityDot[issue.priority]}
                        statusBadge={issueStatusBadge(issue.status)}
                        isAdmin={isAdmin}
                        onOpen={() => setSelectedIssue(issue)}
                        onRemoveFromSprint={() => removeFromSprint(issue)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* ── Backlog section ───────────────────────────────────────────── */}
      <div className="bg-[#17231B] border border-[#304A39] rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#304A39] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm text-[#E9F5E9]">Unassigned Backlog</h3>
            <span className="px-2 py-0.5 rounded-full bg-[#1B2B21] border border-[#304A39] text-[#B8F28B] text-xs font-mono font-semibold">
              {backlogIssues.length}
            </span>
          </div>
          {openSprints.length > 0 && backlogIssues.length > 0 && (
            <p className="text-xs text-[#A7BDAA]">
              Hover an issue to move it into an active or planned sprint
            </p>
          )}
        </div>

        {backlogIssues.length === 0 ? (
          <p className="text-xs text-[#A7BDAA] text-center py-10">
            Backlog is currently clear. Click "Create Issue" to log upcoming deliverables.
          </p>
        ) : (
          <div className="divide-y divide-[#304A39]/40 bg-[#132018]">
            {backlogIssues.map(issue => (
              <BacklogIssueRow
                key={issue.id}
                issue={issue}
                typeIcon={issueTypeIcons[issue.type]}
                priorityDot={priorityDot[issue.priority]}
                openSprints={openSprints}
                onOpen={() => setSelectedIssue(issue)}
                onMoveToSprint={moveToSprint}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {isCreateSprintOpen && (
        <CreateSprintModal
          isOpen={isCreateSprintOpen}
          onClose={() => setIsCreateSprintOpen(false)}
          onSubmit={handleCreateSprintSubmit}
        />
      )}
      {isCreateIssueOpen && (
        <CreateIssueModal
          isOpen={isCreateIssueOpen}
          onClose={() => setIsCreateIssueOpen(false)}
          onSubmit={handleCreateIssueSubmit}
        />
      )}
      {selectedIssue && (
        <IssueDetailModal issue={selectedIssue} onClose={() => setSelectedIssue(null)} />
      )}
    </div>
  );
};

// ── Sprint issue row ────────────────────────────────────────────────────────

interface SprintIssueRowProps {
  issue: Issue;
  typeIcon: React.ReactNode;
  priorityDot: string;
  statusBadge: string;
  isAdmin: boolean;
  onOpen: () => void;
  onRemoveFromSprint: () => void;
}

const SprintIssueRow: React.FC<SprintIssueRowProps> = ({
  issue, typeIcon, priorityDot, statusBadge, isAdmin, onOpen, onRemoveFromSprint,
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="px-4 py-3 hover:bg-[#1B2B21] flex items-center gap-3 group transition-colors"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="flex-shrink-0">{typeIcon}</span>
      <span className="text-xs font-mono font-semibold text-[#B8F28B] w-20 flex-shrink-0">{issue.key}</span>

      <span
        className="text-xs text-[#E9F5E9] flex-1 truncate group-hover:text-[#B8F28B] cursor-pointer"
        onClick={onOpen}
      >
        {issue.title}
      </span>

      <div className="flex items-center gap-2.5 flex-shrink-0">
        <div className={`w-2 h-2 rounded-full ${priorityDot}`} title={`Priority: ${issue.priority}`} />
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusBadge}`}>{issue.status}</span>

        {isAdmin && hovered && (
          <button
            onClick={e => { e.stopPropagation(); onRemoveFromSprint(); }}
            title="Move back to Backlog"
            className="ml-1 px-2 py-0.5 text-[10px] bg-[#17231B] border border-[#304A39] text-[#A7BDAA] hover:text-rose-400 hover:border-rose-900 rounded-lg transition-colors cursor-pointer"
          >
            ← Backlog
          </button>
        )}
      </div>
    </div>
  );
};

// ── Backlog issue row ───────────────────────────────────────────────────────

interface BacklogIssueRowProps {
  issue: Issue;
  typeIcon: React.ReactNode;
  priorityDot: string;
  openSprints: Array<{ id: string; name: string; status: string }>;
  onOpen: () => void;
  onMoveToSprint: (issue: Issue, sprintId: string) => void;
}

const BacklogIssueRow: React.FC<BacklogIssueRowProps> = ({
  issue, typeIcon, priorityDot, openSprints, onOpen, onMoveToSprint,
}) => {
  const [hovered, setHovered] = useState(false);
  const [showSprintPicker, setShowSprintPicker] = useState(false);

  const handleMoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (openSprints.length === 1) {
      onMoveToSprint(issue, openSprints[0].id);
    } else {
      setShowSprintPicker(v => !v);
    }
  };

  return (
    <div
      className="px-4 py-3 hover:bg-[#1B2B21] flex items-center gap-3 group relative transition-colors"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setShowSprintPicker(false); }}
    >
      <span className="flex-shrink-0">{typeIcon}</span>
      <span className="text-xs font-mono font-semibold text-[#B8F28B] w-20 flex-shrink-0">{issue.key}</span>

      <span
        className="text-xs text-[#E9F5E9] flex-1 truncate group-hover:text-[#B8F28B] cursor-pointer"
        onClick={onOpen}
      >
        {issue.title}
      </span>

      <div className="flex items-center gap-2.5 flex-shrink-0">
        <div className={`w-2 h-2 rounded-full ${priorityDot}`} title={`Priority: ${issue.priority}`} />
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#17231B] border border-[#304A39] text-[#A7BDAA] capitalize">
          {issue.type}
        </span>

        {hovered && openSprints.length > 0 && (
          <div className="relative">
            <button
              onClick={handleMoveClick}
              title={openSprints.length === 1 ? `Move to ${openSprints[0].name}` : 'Move to sprint…'}
              className="ml-1 flex items-center gap-1 px-2.5 py-1 text-xs bg-[#B8F28B] text-[#101914] font-semibold rounded-lg hover:bg-[#77C98A] transition-colors cursor-pointer"
            >
              <ArrowRight className="w-3 h-3" />
              <span>{openSprints.length === 1 ? openSprints[0].name : 'Assign Sprint'}</span>
            </button>

            {showSprintPicker && openSprints.length > 1 && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowSprintPicker(false)}
                />
                <div className="absolute right-0 top-full mt-1 w-52 bg-[#17231B] border border-[#304A39] rounded-xl shadow-2xl z-20 overflow-hidden divide-y divide-[#304A39]/50">
                  {openSprints.map(sprint => (
                    <button
                      key={sprint.id}
                      onClick={e => {
                        e.stopPropagation();
                        onMoveToSprint(issue, sprint.id);
                        setShowSprintPicker(false);
                      }}
                      className="w-full px-3 py-2 text-left text-xs text-[#E9F5E9] hover:bg-[#1B2B21] flex items-center justify-between cursor-pointer"
                    >
                      <span className="truncate">{sprint.name}</span>
                      <span className={`text-[9px] ml-2 px-1.5 py-0.5 rounded-full font-mono ${
                        sprint.status === 'active' ? 'bg-[#77C98A]/20 text-[#77C98A]' : 'bg-amber-900/30 text-amber-300'
                      }`}>
                        {sprint.status}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};