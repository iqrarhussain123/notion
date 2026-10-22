import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IssueDetailModal } from '../IssueDetailModal';
import { InviteMemberModal } from '../InviteMemberModal';
import { Issue } from '../../types';
import { ShieldCheck, UserPlus } from 'lucide-react';

export const TeamView: React.FC = () => {
  const { users, issues, currentUser, inviteUser } = useApp();
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#E9F5E9]">Agency Team Roster</h2>
          <p className="text-xs text-[#A7BDAA] mt-0.5">Cinemora Studios team members, roles, permissions, and active workload.</p>
        </div>
        {currentUser?.role === 'admin' && (
          <button
            onClick={() => setIsInviteOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#B8F28B] text-[#101914] text-xs font-semibold rounded-xl hover:bg-[#77C98A] transition-colors cursor-pointer self-start sm:self-auto shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            Invite Member / Co-Founder
          </button>
        )}
      </div>

      {users.length === 0 ? (
        <div className="bg-[#17231B] border border-[#304A39] rounded-2xl p-12 text-center">
          <p className="text-[#A7BDAA] text-xs">No team members registered yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {users.map(user => {
            const userIssues = issues.filter(i => i.assigneeId === user.id);
            const completed = userIssues.filter(i => i.status === 'done').length;
            const inProgress = userIssues.filter(i => i.status === 'in-progress').length;
            const isExpanded = expandedUser === user.id;

            return (
              <div key={user.id} className="bg-[#17231B] border border-[#304A39] rounded-2xl overflow-hidden shadow-sm">
                <div
                  className="p-5 cursor-pointer hover:bg-[#1B2B21]/50 transition-colors"
                  onClick={() => setExpandedUser(isExpanded ? null : user.id)}
                >
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#B8F28B] to-[#77C98A] flex items-center justify-center text-[#101914] font-bold text-sm flex-shrink-0">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-[#E9F5E9] truncate">{user.name}</h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono flex items-center gap-1 ${
                          user.role === 'admin'
                            ? 'bg-[#B8F28B]/10 text-[#B8F28B] border border-[#304A39]'
                            : 'bg-[#77C98A]/10 text-[#77C98A] border border-[#304A39]'
                        }`}>
                          {user.role === 'admin' && <ShieldCheck className="w-3 h-3" />}
                          {user.role === 'admin' ? 'Founder / Admin' : 'Member'}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-[#A7BDAA] truncate mt-0.5">{user.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5 text-center">
                    <div className="bg-[#132018] border border-[#304A39] rounded-xl p-2.5">
                      <div className="text-lg font-bold font-mono text-[#E9F5E9]">{userIssues.length}</div>
                      <div className="text-[10px] text-[#A7BDAA] mt-0.5">Assigned</div>
                    </div>
                    <div className="bg-[#132018] border border-[#304A39] rounded-xl p-2.5">
                      <div className="text-lg font-bold font-mono text-amber-400">{inProgress}</div>
                      <div className="text-[10px] text-[#A7BDAA] mt-0.5">Active</div>
                    </div>
                    <div className="bg-[#132018] border border-[#304A39] rounded-xl p-2.5">
                      <div className="text-lg font-bold font-mono text-[#B8F28B]">{completed}</div>
                      <div className="text-[10px] text-[#A7BDAA] mt-0.5">Done</div>
                    </div>
                  </div>
                </div>

                {/* Expanded issue list */}
                {isExpanded && userIssues.length > 0 && (
                  <div className="border-t border-[#304A39]/60 bg-[#132018]">
                    <div className="px-4 py-2 text-[10px] font-semibold text-[#A7BDAA] uppercase tracking-wider font-mono">
                      Assigned Deliverables ({userIssues.length})
                    </div>
                    <div className="divide-y divide-[#304A39]/40">
                      {userIssues.map(issue => (
                        <div
                          key={issue.id}
                          onClick={() => setSelectedIssue(issue)}
                          className="px-4 py-2.5 hover:bg-[#1B2B21] cursor-pointer flex items-center gap-2.5 group transition-colors"
                        >
                          <span className="text-xs font-mono text-[#B8F28B] w-16 flex-shrink-0">{issue.key}</span>
                          <span className="text-xs text-[#E9F5E9] flex-1 truncate group-hover:text-[#B8F28B]">{issue.title}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full flex-shrink-0 ${
                            issue.status === 'done' ? 'bg-[#B8F28B]/10 text-[#B8F28B] border border-[#304A39]'
                            : issue.status === 'in-progress' ? 'bg-[#77C98A]/10 text-[#77C98A] border border-[#304A39]'
                            : issue.status === 'in-review' ? 'bg-blue-900/20 text-blue-300 border border-[#304A39]'
                            : 'bg-[#17231B] text-[#A7BDAA] border border-[#304A39]'
                          }`}>
                            {issue.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {isExpanded && userIssues.length === 0 && (
                  <div className="border-t border-[#304A39]/60 px-4 py-4 text-center text-xs text-[#A7BDAA] bg-[#132018]">
                    No deliverables currently assigned
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {selectedIssue && (
        <IssueDetailModal
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
        />
      )}

      {isInviteOpen && (
        <InviteMemberModal
          isOpen={isInviteOpen}
          onClose={() => setIsInviteOpen(false)}
          onSubmit={(email, role) => {
            inviteUser(email, role);
            setIsInviteOpen(false);
          }}
        />
      )}
    </div>
  );
};