import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { InviteMemberModal } from '../InviteMemberModal';
import { Plus, Save, Info, Mail, Globe, ShieldCheck, Lock } from 'lucide-react';
import { UserRole } from '../../types';

export const SettingsView: React.FC = () => {
  const { project, currentUser, invitations, inviteUser, logout, updateProject, updatePassword } = useApp();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [projectName, setProjectName] = useState(project.name);
  const [projectDesc, setProjectDesc] = useState(project.description);
  const [saved, setSaved] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState('');

  const isAdmin = currentUser?.role === 'admin';

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim() || newPassword.length < 4) {
      setPwError('Password must be at least 4 characters');
      return;
    }
    updatePassword(newPassword.trim());
    setPwSaved(true);
    setNewPassword('');
    setPwError('');
    setTimeout(() => setPwSaved(false), 3000);
  };

  const handleSaveProject = () => {
    if (!projectName.trim()) return;
    updateProject({ name: projectName.trim(), description: projectDesc.trim() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleInviteSubmit = (email: string, role: UserRole) => {
    inviteUser(email, role);
    setIsInviteModalOpen(false);
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-900/20 text-amber-300 border border-[#1c2232]',
    accepted: 'bg-[#d4a237]/10 text-[#d4a237] border border-[#1c2232]',
    rejected: 'bg-rose-900/20 text-rose-300 border border-[#1c2232]',
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-[#f2f4f8]">Workspace Settings</h2>
        <p className="text-xs text-[#8c93a8] mt-0.5">Manage Cinemora Studios workspace configurations, official agency metadata, and invitations.</p>
      </div>

      <div className="space-y-6">

        {/* ── Project Details ─────────────────────────────────────── */}
        <div className="bg-[#0e111a] p-6 rounded-2xl border border-[#1c2232] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#f2f4f8]">Workspace Specification</h3>
            <span className="text-[10px] font-mono text-[#e5be60]">cinemorastudios.agency</span>
          </div>

          <div className="space-y-4">

            {/* Editable: Project Name */}
            <div>
              <label className="block text-[10px] font-semibold text-[#8c93a8] uppercase tracking-wider mb-1.5">
                Workspace Name
              </label>
              {isAdmin ? (
                <input
                  type="text"
                  value={projectName}
                  onChange={e => setProjectName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#10141f] border border-[#1c2232] rounded-xl text-xs text-[#f2f4f8] focus:outline-none focus:border-[#d4a237]"
                />
              ) : (
                <div className="px-3.5 py-2.5 bg-[#10141f] border border-[#1c2232] rounded-xl text-xs text-[#f2f4f8]">
                  {project.name}
                </div>
              )}
            </div>

            {/* Read-only: Project Key */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-semibold text-[#8c93a8] uppercase tracking-wider mb-1.5">
                  Project Key
                </label>
                <div className="px-3.5 py-2.5 bg-[#10141f] border border-[#1c2232] rounded-xl text-xs text-[#d4a237] font-mono flex items-center justify-between">
                  <span>{project.key}</span>
                  <span className="text-[10px] text-[#8c93a8]">Standard prefix</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-[#8c93a8] uppercase tracking-wider mb-1.5">
                  Agency Domain
                </label>
                <div className="px-3.5 py-2.5 bg-[#10141f] border border-[#1c2232] rounded-xl text-xs text-[#e5be60] font-mono flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5" />
                  <span>cinemorastudios.agency</span>
                </div>
              </div>
            </div>

            {/* Editable: Description */}
            <div>
              <label className="block text-[10px] font-semibold text-[#8c93a8] uppercase tracking-wider mb-1.5">
                Description
              </label>
              {isAdmin ? (
                <textarea
                  value={projectDesc}
                  onChange={e => setProjectDesc(e.target.value)}
                  rows={3}
                  className="w-full px-3.5 py-2.5 bg-[#10141f] border border-[#1c2232] rounded-xl text-xs text-[#f2f4f8] focus:outline-none focus:border-[#d4a237] resize-none"
                  placeholder="Cinemora Studios agency workspace description…"
                />
              ) : (
                <div className="px-3.5 py-2.5 bg-[#10141f] border border-[#1c2232] rounded-xl text-xs text-[#8c93a8] min-h-[60px]">
                  {project.description || <span className="text-[#8c93a8]/40">No description</span>}
                </div>
              )}
            </div>

            {/* Save button — admin only */}
            {isAdmin && (
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={handleSaveProject}
                  disabled={!projectName.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-[#d4a237] text-[#08090d] font-semibold rounded-xl hover:bg-[#e5be60] transition-colors text-xs disabled:opacity-40 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Workspace Details
                </button>
                {saved && (
                  <span className="text-xs text-[#d4a237] font-medium">
                    Changes updated successfully
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Team Invitations — Admin only ──────────────────────── */}
        {isAdmin && (
          <div className="bg-[#0e111a] p-6 rounded-2xl border border-[#1c2232] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#f2f4f8]">Team Access & Invitations</h3>
                <p className="text-[11px] text-[#8c93a8] mt-0.5">Invite agency operators, contractors, or team members.</p>
              </div>
              <button
                onClick={() => setIsInviteModalOpen(true)}
                className="px-3.5 py-2 bg-[#141824] border border-[#1c2232] hover:border-[#e5be60] text-[#f2f4f8] rounded-xl transition-colors flex items-center gap-2 text-xs font-medium cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#d4a237]" />
                Invite Member
              </button>
            </div>

            <div className="flex items-start gap-2.5 p-3.5 bg-[#10141f] border border-[#1c2232] rounded-xl mb-4">
              <Info className="w-4 h-4 text-[#e5be60] flex-shrink-0 mt-0.5" />
              <div className="text-xs text-[#8c93a8] leading-relaxed">
                <span className="font-semibold text-[#f2f4f8]">Team Onboarding:</span> Invited team members sign up with their matching email to be granted the assigned role automatically.
              </div>
            </div>

            {invitations.length === 0 ? (
              <p className="text-xs text-[#8c93a8] text-center py-6">
                No pending invitations. Click "Invite Member" to invite collaborators.
              </p>
            ) : (
              <div className="space-y-2">
                {invitations.map(inv => (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between p-3 bg-[#10141f] rounded-xl border border-[#1c2232]"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Mail className="w-4 h-4 text-[#e5be60] flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="font-mono text-xs text-[#f2f4f8] truncate">{inv.email}</div>
                        <div className="text-[10px] text-[#8c93a8] mt-0.5 capitalize">
                          Role: {inv.role} • Invited on {new Date(inv.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium flex-shrink-0 ml-3 ${statusColors[inv.status] ?? 'bg-[#0e111a] text-[#8c93a8]'}`}>
                      {inv.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Your Account ───────────────────────────────────────── */}
        <div className="bg-[#0e111a] p-6 rounded-2xl border border-[#1c2232] shadow-sm">
          <h3 className="font-bold text-xs uppercase tracking-wider text-[#f2f4f8] mb-4">Active Session</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-[#8c93a8] uppercase tracking-wider mb-1">Name</label>
              <div className="px-3.5 py-2.5 bg-[#10141f] border border-[#1c2232] rounded-xl text-xs text-[#f2f4f8]">
                {currentUser?.name}
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-[#8c93a8] uppercase tracking-wider mb-1">Email</label>
              <div className="px-3.5 py-2.5 bg-[#10141f] border border-[#1c2232] rounded-xl text-xs text-[#f2f4f8] font-mono truncate">
                {currentUser?.email}
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-[#8c93a8] uppercase tracking-wider mb-1">Role</label>
              <div className="px-3.5 py-2.5 bg-[#10141f] border border-[#1c2232] rounded-xl text-xs text-[#d4a237] font-mono flex items-center gap-1.5 capitalize">
                <ShieldCheck className="w-3.5 h-3.5" />
                {currentUser?.role === 'admin' ? 'Founder / Admin' : currentUser?.role}
              </div>
            </div>
          </div>

          {/* Change Password Form */}
          <form onSubmit={handlePasswordChange} className="mt-5 pt-4 border-t border-[#1c2232]">
            <label className="block text-[10px] font-semibold text-[#8c93a8] uppercase tracking-wider mb-2">
              Update Workspace Access Password
            </label>
            <div className="flex gap-2.5 max-w-md">
              <div className="relative flex-1">
                <Lock className="w-3.5 h-3.5 text-[#8c93a8] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (pwError) setPwError('');
                  }}
                  placeholder="Enter new password…"
                  className="w-full pl-9 pr-3 py-2 bg-[#10141f] border border-[#1c2232] rounded-xl text-xs text-[#f2f4f8] focus:outline-none focus:border-[#d4a237]"
                />
              </div>
              <button
                type="submit"
                disabled={!newPassword.trim()}
                className="px-4 py-2 bg-[#d4a237] text-[#08090d] font-semibold rounded-xl hover:bg-[#e5be60] transition-colors text-xs disabled:opacity-40 cursor-pointer whitespace-nowrap"
              >
                Change Password
              </button>
            </div>
            {pwError && <p className="text-[10px] text-rose-400 mt-1.5">{pwError}</p>}
            {pwSaved && <p className="text-[10px] text-[#d4a237] mt-1.5 font-medium">✓ Password updated successfully in local storage.</p>}
          </form>

          <div className="mt-5 pt-4 border-t border-[#1c2232] flex items-center justify-between">
            <span className="text-[11px] text-[#8c93a8]">Browser-persisted internal workspace session</span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-rose-950/40 text-rose-300 border border-rose-900/60 rounded-xl hover:bg-rose-900/40 transition-colors text-xs font-semibold cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {isInviteModalOpen && (
        <InviteMemberModal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          onSubmit={handleInviteSubmit}
        />
      )}
    </div>
  );
};