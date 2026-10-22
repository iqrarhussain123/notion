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
      <div className="bg-[#17231B] border border-[#304A39] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#304A39] bg-[#17231B]">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#B8F28B]" />
            <h2 className="text-sm font-bold text-[#E9F5E9]">Invite Team Collaborator</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#1B2B21] rounded-lg text-[#A7BDAA] hover:text-[#E9F5E9] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-[#132018]">
          <div>
            <label className="block text-[10px] font-semibold text-[#A7BDAA] uppercase tracking-wider mb-1.5">
              Work Email Address *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#17231B] border border-[#304A39] rounded-xl text-xs text-[#E9F5E9] focus:outline-none focus:border-[#B8F28B]"
              placeholder="collaborator@cinemorastudios.agency"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-[#A7BDAA] uppercase tracking-wider mb-1.5">
              Assigned Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-3.5 py-2.5 bg-[#17231B] border border-[#304A39] rounded-xl text-xs text-[#E9F5E9] focus:outline-none focus:border-[#B8F28B]"
            >
              <option value="member">Team Member (Task Drag & Sprint Delivery)</option>
              <option value="admin">Co-Founder / Admin (Full Workspace, Sprint & Team Management)</option>
            </select>
            <p className="text-[10px] text-[#A7BDAA] mt-1.5 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#77C98A]" />
              Admins have permissions to launch sprints, create deliverables, and manage settings.
            </p>
          </div>

          <div className="flex gap-2.5 justify-end pt-4 border-t border-[#304A39]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-[#A7BDAA] hover:text-[#E9F5E9] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#B8F28B] text-[#101914] font-semibold rounded-xl text-xs hover:bg-[#77C98A] transition-colors shadow-sm cursor-pointer"
            >
              Send Invitation
            </button>
          </div>
        </form>

        <div className="p-3.5 bg-[#17231B] border-t border-[#304A39] text-center">
          <p className="text-[10px] text-[#A7BDAA]">
            💡 Invited member signs up with this email to automatically receive this role.
          </p>
        </div>
      </div>
    </div>
  );
};
