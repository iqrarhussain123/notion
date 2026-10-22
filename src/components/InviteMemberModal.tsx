import React, { useState } from 'react';
import { UserRole } from '../types';
import { Mail, X, ShieldCheck } from 'lucide-react';

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string, role: UserRole) => void;
}

export const InviteMemberModal: React.FC<InviteMemberModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('member');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, role);
    setEmail('');
    setRole('member');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0e111a] border border-[#1c2232] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1c2232] bg-[#0e111a]">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#d4a237]" />
            <h2 className="text-sm font-bold text-[#f2f4f8]">Invite Team Collaborator</h2>
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
              Work Email Address *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0e111a] border border-[#1c2232] rounded-xl text-xs text-[#f2f4f8] focus:outline-none focus:border-[#d4a237]"
              placeholder="collaborator@cinemorastudios.agency"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-[#8c93a8] uppercase tracking-wider mb-1.5">
              Assigned Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-3.5 py-2.5 bg-[#0e111a] border border-[#1c2232] rounded-xl text-xs text-[#f2f4f8] focus:outline-none focus:border-[#d4a237]"
            >
              <option value="member">Team Member (Task Drag & Sprint Delivery)</option>
              <option value="admin">Co-Founder / Admin (Full Workspace, Sprint & Team Management)</option>
            </select>
            <p className="text-[10px] text-[#8c93a8] mt-1.5 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#e5be60]" />
              Admins have permissions to launch sprints, create deliverables, and manage settings.
            </p>
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
              Send Invitation
            </button>
          </div>
        </form>

        <div className="p-3.5 bg-[#0e111a] border-t border-[#1c2232] text-center">
          <p className="text-[10px] text-[#8c93a8]">
            💡 Invited member signs up with this email to automatically receive this role.
          </p>
        </div>
      </div>
    </div>
  );
};
