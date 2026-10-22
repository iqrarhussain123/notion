import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { InviteMemberModal } from '../InviteMemberModal';
import { Plus, Save, Info, Mail, Globe, ShieldCheck } from 'lucide-react';
import { UserRole } from '../../types';

export const SettingsView: React.FC = () => {
  const { project, currentUser, invitations, inviteUser, logout, updateProject } = useApp();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [projectName, setProjectName] = useState(project.name);
  const [projectDesc, setProjectDesc] = useState(project.description);
  const [saved, setSaved] = useState(false);

  const isAdmin = currentUser?.role === 'admin';

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
    pending: 'bg-amber-900/20 text-amber-300 border border-[#304A39]',
    accepted: 'bg-[#B8F28B]/10 text-[#B8F28B] border border-[#304A39]',
    rejected: 'bg-rose-900/20 text-rose-300 border border-[#304A39]',
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-[#E9F5E9]">Workspace Settings</h2>
        <p className="text-xs text-[#A7BDAA] mt-0.5">Manage Cinemora Studios workspace configurations, official agency metadata, and invitations.</p>
      </div>

      <div className="space-y-6">

        {/* ── Project Details ─────────────────────────────────────── */}
        <div className="bg-[#17231B] p-6 rounded-2xl border border-[#304A39] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#E9F5E9]">Workspace Specification</h3>
            <span className="text-[10px] font-mono text-[#77C98A]">cinemorastudios.agency</span>
          </div>

          <div className="space-y-4">

            {/* Editable: Project Name */}
            <div>
              <label className="block text-[10px] font-semibold text-[#A7BDAA] uppercase tracking-wider mb-1.5">
                Workspace Name
              </label>
              {isAdmin ? (
                <input
                  type="text"
                  value={projectName}
                  onChange={e => setProjectName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#132018] border border-[#304A39] rounded-xl text-xs text-[#E9F5E9] focus:outline-none focus:border-[#B8F28B]"
                />
              ) : (
                <div className="px-3.5 py-2.5 bg-[#132018] border border-[#304A39] rounded-xl text-xs text-[#E9F5E9]">
                  {project.name}
                </div>
              )}
            </div>

            {/* Read-only: Project Key */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-semibold text-[#A7BDAA] uppercase tracking-wider mb-1.5">
                  Project Key
                </label>
                <div className="px-3.5 py-2.5 bg-[#132018] border border-[#304A39] rounded-xl text-xs text-[#B8F28B] font-mono flex items-center justify-between">
                  <span>{project.key}</span>
                  <span className="text-[10px] text-[#A7BDAA]">Standard prefix</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-[#A7BDAA] uppercase tracking-wider mb-1.5">
                  Agency Domain
                </label>
                <div className="px-3.5 py-2.5 bg-[#132018] border border-[#304A39] rounded-xl text-xs text-[#77C98A] font-mono flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5" />
                  <span>cinemorastudios.agency</span>
                </div>
              </div>
            </div>

            {/* Editable: Description */}
            <div>
              <label className="block text-[10px] font-semibold text-[#A7BDAA] uppercase tracking-wider mb-1.5">
                Description
              </label>
              {isAdmin ? (
                <textarea
                  value={projectDesc}
                  onChange={e => setProjectDesc(e.target.value)}
                  rows={3}
                  className="w-full px-3.5 py-2.5 bg-[#132018] border border-[#304A39] rounded-xl text-xs text-[#E9F5E9] focus:outline-none focus:border-[#B8F28B] resize-none"
                  placeholder="Cinemora Studios agency workspace description…"
                />
              ) : (
                <div className="px-3.5 py-2.5 bg-[#132018] border border-[#304A39] rounded-xl text-xs text-[#A7BDAA] min-h-[60px]">
                  {project.description || <span className="text-[#A7BDAA]/40">No description</span>}
                </div>
              )}
            </div>

            {/* Save button — admin only */}
            {isAdmin && (
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={handleSaveProject}
                  disabled={!projectName.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-[#B8F28B] text-[#101914] font-semibold rounded-xl hover:bg-[#77C98A] transition-colors text-xs disabled:opacity-40 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Workspace Details
                </button>
                {saved && (
                  <span className="text-xs text-[#B8F28B] font-medium">
                    Changes updated successfully
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Team Invitations — Admin only ──────────────────────── */}
        {isAdmin && (
          <div className="bg-[#17231B] p-6 rounded-2xl border border-[#304A39] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#E9F5E9]">Team Access & Invitations</h3>
                <p className="text-[11px] text-[#A7BDAA] mt-0.5">Invite agency operators, contractors, or team members.</p>
              </div>
              <button
                onClick={() => setIsInviteModalOpen(true)}
                className="px-3.5 py-2 bg-[#1B2B21] border border-[#304A39] hover:border-[#77C98A] text-[#E9F5E9] rounded-xl transition-colors flex items-center gap-2 text-xs font-medium cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#B8F28B]" />
                Invite Member
              </button>
            </div>

            <div className="flex items-start gap-2.5 p-3.5 bg-[#132018] border border-[#304A39] rounded-xl mb-4">
              <Info className="w-4 h-4 text-[#77C98A] flex-shrink-0 mt-0.5" />
              <div className="text-xs text-[#A7BDAA] leading-relaxed">
                <span className="font-semibold text-[#E9F5E9]">Team Onboarding:</span> Invited team members sign up with their matching email to be granted the assigned role automatically.
              </div>
            </div>

            {invitations.length === 0 ? (
              <p className="text-xs text-[#A7BDAA] text-center py-6">
                No pending invitations. Click "Invite Member" to invite collaborators.
              </p>
            ) : (
              <div className="space-y-2">
                {invitations.map(inv => (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between p-3 bg-[#132018] rounded-xl border border-[#304A39]"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Mail className="w-4 h-4 text-[#77C98A] flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="font-mono text-xs text-[#E9F5E9] truncate">{inv.email}</div>
                        <div className="text-[10px] text-[#A7BDAA] mt-0.5 capitalize">
                          Role: {inv.role} • Invited on {new Date(inv.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium flex-shrink-0 ml-3 ${statusColors[inv.status] ?? 'bg-[#17231B] text-[#A7BDAA]'}`}>
                      {inv.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Your Account ───────────────────────────────────────── */}
        <div className="bg-[#17231B] p-6 rounded-2xl border border-[#304A39] shadow-sm">
          <h3 className="font-bold text-xs uppercase tracking-wider text-[#E9F5E9] mb-4">Active Session</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-[#A7BDAA] uppercase tracking-wider mb-1">Name</label>
              <div className="px-3.5 py-2.5 bg-[#132018] border border-[#304A39] rounded-xl text-xs text-[#E9F5E9]">
                {currentUser?.name}
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-[#A7BDAA] uppercase tracking-wider mb-1">Email</label>
              <div className="px-3.5 py-2.5 bg-[#132018] border border-[#304A39] rounded-xl text-xs text-[#E9F5E9] font-mono truncate">
                {currentUser?.email}
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-[#A7BDAA] uppercase tracking-wider mb-1">Role</label>
              <div className="px-3.5 py-2.5 bg-[#132018] border border-[#304A39] rounded-xl text-xs text-[#B8F28B] font-mono flex items-center gap-1.5 capitalize">
                <ShieldCheck className="w-3.5 h-3.5" />
                {currentUser?.role === 'admin' ? 'Founder / Admin' : currentUser?.role}
              </div>
            </div>
          </div>
          <div className="mt-5 pt-4 border-t border-[#304A39] flex items-center justify-between">
            <span className="text-[11px] text-[#A7BDAA]">Browser-persisted internal workspace session</span>
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