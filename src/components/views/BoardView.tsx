import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IssueStatus, Issue } from '../../types';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import { IssueCard } from '../IssueCard';
import { DroppableColumn } from '../DroppableColumn';
import { IssueDetailModal } from '../IssueDetailModal';
import { Info, ShieldCheck, Zap } from 'lucide-react';

export const BoardView: React.FC = () => {
  const { issues, sprints, updateIssue, users, currentUser } = useApp();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  const isAdmin = currentUser?.role === 'admin';

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const activeSprint = sprints.find(s => s.status === 'active');

  const statuses: { id: IssueStatus; label: string }[] = [
    { id: 'todo',        label: 'TO DO' },
    { id: 'in-progress', label: 'IN PROGRESS' },
    { id: 'in-review',   label: 'IN REVIEW' },
    { id: 'done',        label: 'DONE' },
  ];

  const getIssuesByStatus = (status: IssueStatus) =>
    issues.filter(
      i =>
        i.status === status &&
        (!activeSprint || i.sprintId === activeSprint.id)
    );

  /**
   * Option B permission check:
   * A user may drag a card only if they are:
   *   (a) an admin, OR
   *   (b) the assignee of that specific issue
   */
  const canDragIssue = (issue: Issue): boolean => {
    if (!currentUser) return false;
    if (isAdmin) return true;
    return issue.assigneeId === currentUser.id;
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const issueId  = active.id as string;
    const newStatus = over.id as IssueStatus;
    const current  = issues.find(i => i.id === issueId);

    // Double-check permission server-side style (in case disabled prop was bypassed)
    if (!current || !canDragIssue(current)) return;

    if (current.status !== newStatus) {
      updateIssue(issueId, { status: newStatus });
    }
  };

  const activeIssue = activeId ? issues.find(i => i.id === activeId) : null;

  // Count how many cards the current member can drag (for the info banner)
  const draggableCount = isAdmin
    ? null
    : issues.filter(
        i =>
          i.assigneeId === currentUser?.id &&
          i.sprintId === activeSprint?.id
      ).length;

  return (
    <div className="h-full flex flex-col">
      {/* Sprint label & Permissions Header */}
      {activeSprint ? (
        <div className="mb-4 flex items-center justify-between flex-wrap gap-3 bg-[#0e111a] border border-[#1c2232] p-3.5 rounded-2xl">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-[#d4a237] animate-pulse" />
            <span className="text-xs text-[#8c93a8]">Active Sprint:</span>
            <span className="text-xs font-bold text-[#f2f4f8] tracking-wide">{activeSprint.name}</span>
            {activeSprint.goal && (
              <span className="text-xs text-[#8c93a8] hidden md:inline">• {activeSprint.goal}</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Permission banner for non-admin members */}
            {!isAdmin && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-[#141824] border border-[#1c2232] rounded-xl text-xs text-[#e5be60]">
                <Info className="w-3.5 h-3.5 flex-shrink-0" />
                <span>
                  Moving{' '}
                  <strong className="text-[#d4a237]">
                    {draggableCount === 0 ? '0' : draggableCount}
                  </strong>{' '}
                  assigned tasks
                </span>
              </div>
            )}

            {/* Admin badge */}
            {isAdmin && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-[#141824] border border-[#1c2232] rounded-xl text-xs text-[#d4a237] font-medium">
                <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0 text-[#d4a237]" />
                <span>Founder / Admin Mode</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mb-4 p-4 bg-[#0e111a] border border-[#1c2232] rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-xs text-[#8c93a8]">
            <Zap className="w-4 h-4 text-[#e5be60]" />
            <span>No sprint currently active. Switch to Backlog to launch a planned sprint or work directly on backlog tasks.</span>
          </div>
        </div>
      )}

      {/* Kanban Board Dnd Columns */}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-6 flex-1 items-start">
          {statuses.map(status => {
            const statusIssues = getIssuesByStatus(status.id);
            return (
              <DroppableColumn
                key={status.id}
                id={status.id}
                title={status.label}
                count={statusIssues.length}
              >
                <div className="space-y-3 min-h-[100px]">
                  {statusIssues.map(issue => (
                    <IssueCard
                      key={issue.id}
                      issue={issue}
                      onClick={() => setSelectedIssue(issue)}
                      assignee={users.find(u => u.id === issue.assigneeId)}
                      canDrag={canDragIssue(issue)}
                    />
                  ))}
                </div>
              </DroppableColumn>
            );
          })}
        </div>

        {/* Ghost card shown while dragging */}
        <DragOverlay>
          {activeIssue && (
            <div className="opacity-90 rotate-2 scale-105 shadow-2xl">
              <IssueCard
                issue={activeIssue}
                onClick={() => {}}
                assignee={users.find(u => u.id === activeIssue.assigneeId)}
                canDrag={true}
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {selectedIssue && (
        <IssueDetailModal
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
        />
      )}
    </div>
  );
};