import React from 'react';
import { Issue, User } from '../types';
import { useDraggable } from '@dnd-kit/core';
import {
  Calendar,
  AlertCircle,
  Zap,
  Target,
  BookOpen,
  Lock,
  GripVertical,
} from 'lucide-react';

interface IssueCardProps {
  issue: Issue;
  onClick: () => void;
  assignee?: User;
  /** If false, drag is disabled and a lock indicator is shown */
  canDrag: boolean;
}

const priorityColors: Record<string, string> = {
  lowest: 'text-[#A7BDAA]',
  low: 'text-[#77C98A]',
  medium: 'text-amber-400',
  high: 'text-orange-400',
  highest: 'text-rose-400',
};

const priorityArrowColor: Record<string, string> = {
  lowest: '#A7BDAA',
  low: '#77C98A',
  medium: '#FBBF24',
  high: '#FB923C',
  highest: '#F87171',
};

const typeIcons: Record<string, React.ReactNode> = {
  story: <BookOpen className="w-3.5 h-3.5 text-[#77C98A]" />,
  task: <Zap className="w-3.5 h-3.5 text-[#B8F28B]" />,
  bug: <AlertCircle className="w-3.5 h-3.5 text-rose-400" />,
  epic: <Target className="w-3.5 h-3.5 text-purple-400" />,
};

const getInitials = (name: string) =>
  name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

export const IssueCard: React.FC<IssueCardProps> = ({
  issue,
  onClick,
  assignee,
  canDrag,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: issue.id,
    disabled: !canDrag,
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-[#1B2B21] rounded-xl border border-[#304A39] p-3.5 transition-all select-none group
        ${isDragging ? 'opacity-50 ring-2 ring-[#B8F28B] shadow-2xl scale-102' : 'shadow-sm hover:border-[#77C98A] hover:bg-[#213529]'}
        ${canDrag ? 'cursor-pointer' : 'cursor-default'}
      `}
      onClick={() => { if (!isDragging) onClick(); }}
    >
      {/* Top row: drag handle, type icon, key, priority */}
      <div className="flex items-center justify-between mb-2 gap-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          {canDrag ? (
            <span
              className="flex-shrink-0 text-[#A7BDAA]/40 group-hover:text-[#B8F28B] transition-colors cursor-grab active:cursor-grabbing p-0.5"
              {...listeners}
              {...attributes}
              onClick={e => e.stopPropagation()}
              title="Drag to change status"
            >
              <GripVertical className="w-3.5 h-3.5" />
            </span>
          ) : (
            <span
              className="flex-shrink-0 text-[#A7BDAA]/30 p-0.5"
              title="Assigned to another member"
            >
              <Lock className="w-3 h-3" />
            </span>
          )}

          <span className="flex-shrink-0">{typeIcons[issue.type]}</span>
          <span className="text-[11px] font-mono text-[#B8F28B] font-semibold truncate">{issue.key}</span>
        </div>

        {/* Priority */}
        {issue.priority && (
          <div className={`flex-shrink-0 flex items-center gap-1 text-[10px] capitalize font-medium ${priorityColors[issue.priority]}`} title={`Priority: ${issue.priority}`}>
            <svg className="w-3 h-3" fill={priorityArrowColor[issue.priority]} viewBox="0 0 20 20">
              <path d="M10 3l7 7-7 7V3z" />
            </svg>
          </div>
        )}
      </div>

      {/* Title */}
      <h4 className="text-xs text-[#E9F5E9] font-medium mb-3 line-clamp-2 leading-relaxed">
        {issue.title}
      </h4>

      {/* Footer: Estimate, Assignee, Labels */}
      <div className="flex items-center justify-between pt-1 border-t border-[#304A39]/60">
        {issue.estimatedHours != null ? (
          <div className="flex items-center gap-1 text-[11px] text-[#A7BDAA] font-mono">
            <Calendar className="w-3 h-3 text-[#77C98A]" />
            <span>{issue.estimatedHours}h</span>
          </div>
        ) : (
          <div />
        )}

        {assignee ? (
          <div
            className="w-5 h-5 rounded-md bg-[#17231B] border border-[#304A39] text-[#B8F28B] flex items-center justify-center text-[9px] font-mono font-bold"
            title={`Assigned to: ${assignee.name}`}
          >
            {getInitials(assignee.name)}
          </div>
        ) : (
          <div
            className="w-5 h-5 rounded-md border border-dashed border-[#304A39] flex items-center justify-center text-[#A7BDAA]/40 text-[9px]"
            title="Unassigned"
          >
            -
          </div>
        )}
      </div>

      {/* Labels */}
      {issue.labels && issue.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2.5">
          {issue.labels.slice(0, 2).map((label, idx) => (
            <span
              key={idx}
              className="px-1.5 py-0.2 bg-[#132018] border border-[#304A39] text-[#A7BDAA] rounded text-[9px] font-mono"
            >
              #{label}
            </span>
          ))}
          {issue.labels.length > 2 && (
            <span className="px-1 py-0.2 bg-[#132018] text-[#A7BDAA] rounded text-[9px]">
              +{issue.labels.length - 2}
            </span>
          )}
        </div>
      )}
    </div>
  );
};