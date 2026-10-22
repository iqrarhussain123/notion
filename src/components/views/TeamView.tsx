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
          <h2 className="text-xl font-bold text-[#f2f4f8]">Agency Team Roster</h2>
          <p className="text-xs text-[#8c93a8] mt-0.5">Cinemora Studios team members, roles, permissions, and active workload.</p>
        </div>
        {currentUser?.role === 'admin' && (
          <button
            onClick={() => setIsInviteOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#d4a237] text-[#08090d] text-xs font-semibold rounded-xl hover:bg-[#e5be60] transition-colors cursor-pointer self-start sm:self-auto shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            Invite Member / Co-Founder
          </button>
        )}
      </div>

      {users.length === 0 ? (
        <div className="bg-[#0e111a] border border-[#1c2232] rounded-2xl p-12 text-center">
          <p className="text-[#8c93a8] text-xs">No team members registered yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {users.map(user => {
            const userIssues = issues.filter(i => i.assigneeId === user.id);
            const completed = userIssues.filter(i => i.status === 'done').length;
            const inProgress = userIssues.filter(i => i.status === 'in-progress').length;
            const isExpanded = expandedUser === user.id;

            return (
              <div key={user.id} className="bg-[#0e111a] border border-[#1c2232] rounded-2xl overflow-hidden shadow-sm">
                <div
                  className="p-5 cursor-pointer hover:bg-[#141824]/50 transition-colors"
                  onClick={() => setExpandedUser(isExpanded ? null : user.id)}
                >
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#d4a237] to-[#e5be60] flex items-center justify-center text-[#08090d] font-bold text-sm flex-shrink-0">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-[#f2f4f8] truncate">{user.name}</h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono flex items-center gap-1 ${
                          user.role === 'admin'
                            ? 'bg-[#d4a237]/10 text-[#d4a237] border border-[#1c2232]'
                            : 'bg-[#e5be60]/10 text-[#e5be60] border border-[#1c2232]'
                        }`}>
                          {user.role === 'admin' && <ShieldCheck className="w-3 h-3" />}
                          {user.role === 'admin' ? 'Founder / Admin' : 'Member'}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-[#8c93a8] truncate mt-0.5">{user.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5 text-center">
                    <div className="bg-[#10141f] border border-[#1c2232] rounded-xl p-2.5">
                      <div className="text-lg font-bold font-mono text-[#f2f4f8]">{userIssues.length}</div>
                      <div className="text-[10px] text-[#8c93a8] mt-0.5">Assigned</div>
                    </div>
                    <div className="bg-[#10141f] border border-[#1c2232] rounded-xl p-2.5">
                      <div className="text-lg font-bold font-mono text-amber-400">{inProgress}</div>
                      <div className="text-[10px] text-[#8c93a8] mt-0.5">Active</div>
                    </div>
                    <div className="bg-[#10141f] border border-[#1c2232] rounded-xl p-2.5">
                      <div className="text-lg font-bold font-mono text-[#d4a237]">{completed}</div>
                      <div className="text-[10px] text-[#8c93a8] mt-0.5">Done</div>
                    </div>
                  </div>
                </div>

                {/* Expanded issue list */}
                {isExpanded && userIssues.length > 0 && (
                  <div className="border-t border-[#1c2232]/60 bg-[#10141f]">
                    <div className="px-4 py-2 text-[10px] font-semibold text-[#8c93a8] uppercase tracking-wider font-mono">
                      Assigned Deliverables ({userIssues.length})
                    </div>
                    <div className="divide-y divide-[#1c2232]/40">
                      {userIssues.map(issue => (
                        <div
                          key={issue.id}
                          onClick={() => setSelectedIssue(issue)}
                          className="px-4 py-2.5 hover:bg-[#141824] cursor-pointer flex items-center gap-2.5 group transition-colors"
                        >
                          <span className="text-xs font-mono text-[#d4a237] w-16 flex-shrink-0">{issue.key}</span>
                          <span className="text-xs text-[#f2f4f8] flex-1 truncate group-hover:text-[#d4a237]">{issue.title}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full flex-shrink-0 ${
                            issue.status === 'done' ? 'bg-[#d4a237]/10 text-[#d4a237] border border-[#1c2232]'
                            : issue.status === 'in-progress' ? 'bg-[#e5be60]/10 text-[#e5be60] border border-[#1c2232]'
                            : issue.status === 'in-review' ? 'bg-blue-900/20 text-blue-300 border border-[#1c2232]'
                            : 'bg-[#0e111a] text-[#8c93a8] border border-[#1c2232]'
                          }`}>
                            {issue.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {isExpanded && userIssues.length === 0 && (
                  <div className="border-t border-[#1c2232]/60 px-4 py-4 text-center text-xs text-[#8c93a8] bg-[#10141f]">
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