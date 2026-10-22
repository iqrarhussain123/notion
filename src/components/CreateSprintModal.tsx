import React, { useState } from 'react';
import { SprintStatus } from '../types';
import { Calendar, X } from 'lucide-react';

interface CreateSprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (sprint: {
    name: string;
    goal: string;
    startDate: string;
    endDate: string;
    status: SprintStatus;
  }) => void;
}

export const CreateSprintModal: React.FC<CreateSprintModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    goal: '',
    startDate: '',
    endDate: '',
    status: 'planned' as SprintStatus,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: '',
      goal: '',
      startDate: '',
      endDate: '',
      status: 'planned',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0e111a] border border-[#1c2232] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1c2232] bg-[#0e111a]">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#d4a237]" />
            <h2 className="text-sm font-bold text-[#f2f4f8]">Plan New Sprint</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#141824] rounded-lg text-[#8c93a8] hover:text-[#f2f4f8] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-[#10141f]">
          <div>
            <label className="block text-[10px] font-semibold text-[#8c93a8] uppercase tracking-wider mb-1.5">
              Sprint Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#0e111a] border border-[#1c2232] rounded-xl text-xs text-[#f2f4f8] focus:outline-none focus:border-[#d4a237]"
              placeholder="e.g. Sprint 14 — AI Agent Pipeline"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-[#8c93a8] uppercase tracking-wider mb-1.5">
              Sprint Goal
            </label>
            <textarea
              value={formData.goal}
              onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#0e111a] border border-[#1c2232] rounded-xl text-xs text-[#f2f4f8] focus:outline-none focus:border-[#d4a237] resize-none"
              rows={3}
              placeholder="Primary milestone outcome..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-semibold text-[#8c93a8] uppercase tracking-wider mb-1.5">
                Start Date *
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 bg-[#0e111a] border border-[#1c2232] rounded-xl text-xs text-[#f2f4f8] focus:outline-none focus:border-[#d4a237]"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-[#8c93a8] uppercase tracking-wider mb-1.5">
                Target End Date *
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 bg-[#0e111a] border border-[#1c2232] rounded-xl text-xs text-[#f2f4f8] focus:outline-none focus:border-[#d4a237]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-[#8c93a8] uppercase tracking-wider mb-1.5">
              Initial Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as SprintStatus })
              }
              className="w-full px-3.5 py-2.5 bg-[#0e111a] border border-[#1c2232] rounded-xl text-xs text-[#f2f4f8] focus:outline-none focus:border-[#d4a237]"
            >
              <option value="planned">Planned</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex gap-2.5 justify-end pt-4 border-t border-[#1c2232]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-[#8c93a8] hover:text-[#f2f4f8] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#d4a237] text-[#08090d] font-semibold rounded-xl text-xs hover:bg-[#e5be60] transition-colors shadow-sm cursor-pointer"
            >
              Create Sprint
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
