import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { IssueType, IssuePriority, IssueStatus } from '../types';
import {
  X,
  BookOpen,
  CheckSquare,
  Bug,
  Trophy,
  Sparkles,
} from 'lucide-react';

interface CreateIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (issueData: {
    key: string;
    title: string;
    description: string;
    type: IssueType;
    priority: IssuePriority;
    status: IssueStatus;
    assigneeId?: string;
    sprintId?: string;
    labels: string[];
    estimatedHours?: number;
  }) => void;
}

const EMPTY_FORM = {
  type: 'task' as IssueType,
  priority: 'medium' as IssuePriority,
  status: 'todo' as IssueStatus,
  title: '',
  description: '',
  assigneeId: '',
  labels: '',
  estimatedHours: '',
};

export const CreateIssueModal: React.FC<CreateIssueModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const { project, users, issues, sprints } = useApp();
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [titleError, setTitleError] = useState(false);

  if (!isOpen) return null;

  /** Generate next key by finding the highest existing key number */
  const nextKey = (): string => {
    const prefix = `${project.key}-`;
    const maxNum = issues.reduce((max, i) => {
      if (!i.key.startsWith(prefix)) return max;
      const num = parseInt(i.key.slice(prefix.length), 10);
      return isNaN(num) ? max : Math.max(max, num);
    }, 0);
    return `${prefix}${maxNum + 1}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) { setTitleError(true); return; }

    const activeSprint = sprints.find(s => s.status === 'active');
    const sprintId = formData.status !== 'backlog' && activeSprint ? activeSprint.id : undefined;

    onSubmit({
      key: nextKey(),
      title: formData.title.trim(),
      description: formData.description.trim(),
      type: formData.type,
      priority: formData.priority,
      status: formData.status,
      assigneeId: formData.assigneeId || undefined,
      sprintId,
      labels: formData.labels
        ? formData.labels.split(',').map(l => l.trim()).filter(Boolean)
        : [],
      estimatedHours: formData.estimatedHours ? parseFloat(formData.estimatedHours) : undefined,
    });

    setFormData(EMPTY_FORM);
    setTitleError(false);
    onClose();
  };

  const handleClose = () => {
    setFormData(EMPTY_FORM);
    setTitleError(false);
    onClose();
  };

  const typeIcons: Record<IssueType, React.ReactNode> = {
    story: <BookOpen className="w-3.5 h-3.5 text-[#e5be60]" />,
    task: <CheckSquare className="w-3.5 h-3.5 text-[#d4a237]" />,
    bug: <Bug className="w-3.5 h-3.5 text-rose-400" />,
    epic: <Trophy className="w-3.5 h-3.5 text-purple-400" />,
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0e111a] border border-[#1c2232] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1c2232] bg-[#0e111a] sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#d4a237]" />
            <h2 className="text-sm font-bold text-[#f2f4f8]">New Workspace Deliverable</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 hover:bg-[#141824] rounded-lg text-[#8c93a8] hover:text-[#f2f4f8] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-[#10141f]">
          {/* Deliverable Type */}
          <div>
            <label className="block text-[10px] font-semibold text-[#8c93a8] uppercase tracking-wider mb-1.5">
              Type
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['task', 'story', 'bug', 'epic'] as IssueType[]).map(t => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setFormData({ ...formData, type: t })}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-medium capitalize transition-all cursor-pointer ${
                    formData.type === t
                      ? 'bg-[#141824] border-[#d4a237] text-[#f2f4f8] shadow-sm'
                      : 'bg-[#0e111a] border-[#1c2232] text-[#8c93a8] hover:border-[#e5be60]'
                  }`}
                >
                  {typeIcons[t]}
                  <span>{t}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-[10px] font-semibold text-[#8c93a8] uppercase tracking-wider mb-1.5">
              Deliverable Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={e => {
                setFormData({ ...formData, title: e.target.value });
                if (titleError) setTitleError(false);
              }}
              placeholder="e.g. Implement pipeline qualification agent hook"
              className={`w-full px-3.5 py-2.5 bg-[#0e111a] border rounded-xl text-xs text-[#f2f4f8] placeholder-[#8c93a8]/40 focus:outline-none ${
                titleError ? 'border-rose-500' : 'border-[#1c2232] focus:border-[#d4a237]'
              }`}
            />
            {titleError && (
              <p className="text-[10px] text-rose-400 mt-1">Title is required.</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] font-semibold text-[#8c93a8] uppercase tracking-wider mb-1.5">
              Description & Acceptance Criteria
            </label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="Detailed description, assets needed, or technical instructions..."
              className="w-full px-3.5 py-2.5 bg-[#0e111a] border border-[#1c2232] rounded-xl text-xs text-[#f2f4f8] placeholder-[#8c93a8]/40 focus:outline-none focus:border-[#d4a237] resize-none"
            />
          </div>

          {/* Status & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-[#8c93a8] uppercase tracking-wider mb-1.5">
                Initial Status
              </label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as IssueStatus })}
                className="w-full px-3.5 py-2.5 bg-[#0e111a] border border-[#1c2232] rounded-xl text-xs text-[#f2f4f8] focus:outline-none focus:border-[#d4a237]"
              >
                <option value="backlog">Backlog (Unassigned)</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="in-review">In Review</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-[#8c93a8] uppercase tracking-wider mb-1.5">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={e => setFormData({ ...formData, priority: e.target.value as IssuePriority })}
                className="w-full px-3.5 py-2.5 bg-[#0e111a] border border-[#1c2232] rounded-xl text-xs text-[#f2f4f8] focus:outline-none focus:border-[#d4a237]"
              >
                <option value="lowest">Lowest</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="highest">Highest</option>
              </select>
            </div>
          </div>

          {/* Assignee & Hours */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-[#8c93a8] uppercase tracking-wider mb-1.5">
                Assignee
              </label>
              <select
                value={formData.assigneeId}
                onChange={e => setFormData({ ...formData, assigneeId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#0e111a] border border-[#1c2232] rounded-xl text-xs text-[#f2f4f8] focus:outline-none focus:border-[#d4a237]"
              >
                <option value="">Unassigned</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-[#8c93a8] uppercase tracking-wider mb-1.5">
                Estimated Hours
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={formData.estimatedHours}
                onChange={e => setFormData({ ...formData, estimatedHours: e.target.value })}
                placeholder="e.g. 4.5"
                className="w-full px-3.5 py-2.5 bg-[#0e111a] border border-[#1c2232] rounded-xl text-xs text-[#f2f4f8] placeholder-[#8c93a8]/40 focus:outline-none focus:border-[#d4a237]"
              />
            </div>
          </div>

          {/* Labels */}
          <div>
            <label className="block text-[10px] font-semibold text-[#8c93a8] uppercase tracking-wider mb-1.5">
              Tags / Labels (comma-separated)
            </label>
            <input
              type="text"
              value={formData.labels}
              onChange={e => setFormData({ ...formData, labels: e.target.value })}
              placeholder="frontend, outreach, automation"
              className="w-full px-3.5 py-2.5 bg-[#0e111a] border border-[#1c2232] rounded-xl text-xs text-[#f2f4f8] placeholder-[#8c93a8]/40 focus:outline-none focus:border-[#d4a237]"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2.5 justify-end pt-4 border-t border-[#1c2232]">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-xs text-[#8c93a8] hover:text-[#f2f4f8] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#d4a237] text-[#08090d] font-semibold rounded-xl text-xs hover:bg-[#e5be60] transition-colors shadow-sm cursor-pointer"
            >
              Create Deliverable
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
