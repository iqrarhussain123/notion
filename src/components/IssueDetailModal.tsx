import React, { useState } from 'react';
import { Issue, IssueStatus, IssuePriority, IssueType } from '../types';
import { useApp } from '../context/AppContext';
import { X, Clock, MessageSquare, Link2, Paperclip, Trash2, Plus } from 'lucide-react';

interface IssueDetailModalProps {
  issue: Issue;
  onClose: () => void;
}

type Tab = 'details' | 'comments' | 'worklogs' | 'links' | 'attachments';

export const IssueDetailModal: React.FC<IssueDetailModalProps> = ({ issue, onClose }) => {
  const { updateIssue, deleteIssue, addComment, addWorkLog, addIssueLink, removeIssueLink,
    addAttachment, removeAttachment, users, issues } = useApp();

  const [activeTab, setActiveTab] = useState<Tab>('details');
  const [editedIssue, setEditedIssue] = useState<Issue>({ ...issue });
  const [comment, setComment] = useState('');
  const [workHours, setWorkHours] = useState('');
  const [workDesc, setWorkDesc] = useState('');
  const [linkType, setLinkType] = useState<'blocks' | 'is-blocked-by' | 'relates-to' | 'duplicates' | 'is-duplicated-by'>('relates-to');
  const [linkTargetId, setLinkTargetId] = useState('');

  // Keep local state in sync with latest issue data from context
  const liveIssue = issues.find(i => i.id === issue.id) || issue;

  const handleFieldBlur = (field: keyof Issue, value: unknown) => {
    updateIssue(issue.id, { [field]: value } as Partial<Issue>);
  };

  const handleAddComment = () => {
    const text = comment.trim();
    if (!text) return;
    addComment(issue.id, text);
    setComment('');
  };

  const handleLogWork = () => {
    const hours = parseFloat(workHours);
    if (isNaN(hours) || hours <= 0) return;
    addWorkLog(issue.id, hours, workDesc.trim());
    setWorkHours('');
    setWorkDesc('');
  };

  const handleLinkIssue = () => {
    if (!linkTargetId) return;
    addIssueLink(issue.id, linkTargetId, linkType);
    setLinkTargetId('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await addAttachment(issue.id, file);
    } catch (err) {
      console.error('Failed to attach file', err);
    }
    e.target.value = '';
  };

  const handleDelete = () => {
    if (window.confirm(`Delete deliverable ${liveIssue.key}: "${liveIssue.title}"?`)) {
      deleteIssue(issue.id);
      onClose();
    }
  };

  const getUserById = (id?: string) => users.find(u => u.id === id);

  const typeIcons: Record<IssueType, string> = { story: '📖', task: '⚡', bug: '🐛', epic: '🎯' };
  const priorityColors: Record<IssuePriority, string> = {
    lowest: 'text-[#A7BDAA]', low: 'text-[#77C98A]', medium: 'text-amber-400',
    high: 'text-orange-400', highest: 'text-rose-400',
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'details', label: 'Details', icon: null },
    { id: 'comments', label: `Comments (${liveIssue.comments?.length ?? 0})`, icon: <MessageSquare className="w-3.5 h-3.5" /> },
    { id: 'worklogs', label: `Work Logs (${liveIssue.workLogs?.length ?? 0})`, icon: <Clock className="w-3.5 h-3.5" /> },
    { id: 'links', label: `Links (${liveIssue.links?.length ?? 0})`, icon: <Link2 className="w-3.5 h-3.5" /> },
    { id: 'attachments', label: `Files (${liveIssue.attachments?.length ?? 0})`, icon: <Paperclip className="w-3.5 h-3.5" /> },
  ];

  const linkableIssues = issues.filter(i => i.id !== issue.id);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#17231B] border border-[#304A39] rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#304A39] flex-shrink-0 bg-[#17231B]">
          <div className="flex items-center gap-2.5">
            <span className="text-base">{typeIcons[editedIssue.type]}</span>
            <span className="text-xs font-mono font-bold text-[#B8F28B] bg-[#1B2B21] border border-[#304A39] px-2 py-0.5 rounded-md">
              {liveIssue.key}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDelete}
              className="p-1.5 text-rose-400 hover:bg-rose-950/40 border border-transparent hover:border-rose-900 rounded-lg transition-colors cursor-pointer"
              title="Delete deliverable"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#A7BDAA] hover:text-[#E9F5E9] hover:bg-[#1B2B21] rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 px-6 pt-3 border-b border-[#304A39] flex-shrink-0 bg-[#17231B]">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-lg border-b-2 transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'border-[#B8F28B] text-[#B8F28B] bg-[#1B2B21]'
                  : 'border-transparent text-[#A7BDAA] hover:text-[#E9F5E9]'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 bg-[#132018]">

          {/* ---- DETAILS TAB ---- */}
          {activeTab === 'details' && (
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold text-[#A7BDAA] uppercase tracking-wider mb-1.5">Deliverable Title *</label>
                <input
                  type="text"
                  value={editedIssue.title}
                  onChange={e => setEditedIssue({ ...editedIssue, title: e.target.value })}
                  onBlur={() => handleFieldBlur('title', editedIssue.title)}
                  className="w-full px-3.5 py-2.5 bg-[#17231B] border border-[#304A39] rounded-xl text-xs text-[#E9F5E9] focus:outline-none focus:border-[#B8F28B]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-[#A7BDAA] uppercase tracking-wider mb-1.5">Description & Scope</label>
                <textarea
                  value={editedIssue.description}
                  onChange={e => setEditedIssue({ ...editedIssue, description: e.target.value })}
                  onBlur={() => handleFieldBlur('description', editedIssue.description)}
                  rows={4}
                  placeholder="Add scope details or execution steps..."
                  className="w-full px-3.5 py-2.5 bg-[#17231B] border border-[#304A39] rounded-xl text-xs text-[#E9F5E9] focus:outline-none focus:border-[#B8F28B] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold text-[#A7BDAA] uppercase tracking-wider mb-1.5">Status</label>
                  <select
                    value={editedIssue.status}
                    onChange={e => {
                      const s = e.target.value as IssueStatus;
                      setEditedIssue({ ...editedIssue, status: s });
                      updateIssue(issue.id, { status: s });
                    }}
                    className="w-full px-3.5 py-2.5 bg-[#17231B] border border-[#304A39] rounded-xl text-xs text-[#E9F5E9] focus:outline-none focus:border-[#B8F28B]"
                  >
                    <option value="backlog">Backlog</option>
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="in-review">In Review</option>
                    <option value="done">Done</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-[#A7BDAA] uppercase tracking-wider mb-1.5">Priority</label>
                  <select
                    value={editedIssue.priority}
                    onChange={e => {
                      const p = e.target.value as IssuePriority;
                      setEditedIssue({ ...editedIssue, priority: p });
                      updateIssue(issue.id, { priority: p });
                    }}
                    className={`w-full px-3.5 py-2.5 bg-[#17231B] border border-[#304A39] rounded-xl text-xs focus:outline-none focus:border-[#B8F28B] ${priorityColors[editedIssue.priority]}`}
                  >
                    <option value="lowest">Lowest</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="highest">Highest</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-[#A7BDAA] uppercase tracking-wider mb-1.5">Type</label>
                  <select
                    value={editedIssue.type}
                    onChange={e => {
                      const t = e.target.value as IssueType;
                      setEditedIssue({ ...editedIssue, type: t });
                      updateIssue(issue.id, { type: t });
                    }}
                    className="w-full px-3.5 py-2.5 bg-[#17231B] border border-[#304A39] rounded-xl text-xs text-[#E9F5E9] focus:outline-none focus:border-[#B8F28B]"
                  >
                    <option value="task">⚡ Task</option>
                    <option value="story">📖 Story</option>
                    <option value="bug">🐛 Bug</option>
                    <option value="epic">🎯 Epic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-[#A7BDAA] uppercase tracking-wider mb-1.5">Assignee</label>
                  <select
                    value={editedIssue.assigneeId ?? ''}
                    onChange={e => {
                      const val = e.target.value || undefined;
                      setEditedIssue({ ...editedIssue, assigneeId: val });
                      updateIssue(issue.id, { assigneeId: val });
                    }}
                    className="w-full px-3.5 py-2.5 bg-[#17231B] border border-[#304A39] rounded-xl text-xs text-[#E9F5E9] focus:outline-none focus:border-[#B8F28B]"
                  >
                    <option value="">Unassigned</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-[#A7BDAA] uppercase tracking-wider mb-1.5">Estimated Hours</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={editedIssue.estimatedHours ?? ''}
                    onChange={e => setEditedIssue({ ...editedIssue, estimatedHours: e.target.value ? parseFloat(e.target.value) : undefined })}
                    onBlur={() => handleFieldBlur('estimatedHours', editedIssue.estimatedHours)}
                    className="w-full px-3.5 py-2.5 bg-[#17231B] border border-[#304A39] rounded-xl text-xs text-[#E9F5E9] focus:outline-none focus:border-[#B8F28B]"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-[#A7BDAA] uppercase tracking-wider mb-1.5">Tags / Labels</label>
                  <input
                    type="text"
                    value={editedIssue.labels?.join(', ') ?? ''}
                    onChange={e => setEditedIssue({ ...editedIssue, labels: e.target.value.split(',').map(l => l.trim()).filter(Boolean) })}
                    onBlur={() => handleFieldBlur('labels', editedIssue.labels)}
                    className="w-full px-3.5 py-2.5 bg-[#17231B] border border-[#304A39] rounded-xl text-xs text-[#E9F5E9] focus:outline-none focus:border-[#B8F28B]"
                    placeholder="frontend, ai-system, brand"
                  />
                </div>
              </div>

              <div className="text-[11px] text-[#A7BDAA] font-mono pt-3 border-t border-[#304A39]/60 flex items-center justify-between">
                <span>Reporter: {getUserById(liveIssue.reporterId)?.name ?? 'Unknown'}</span>
                <span>Created: {new Date(liveIssue.createdAt).toLocaleDateString()}</span>
                <span>Updated: {new Date(liveIssue.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          )}

          {/* ---- COMMENTS TAB ---- */}
          {activeTab === 'comments' && (
            <div className="space-y-4">
              <div className="space-y-3">
                {(liveIssue.comments ?? []).length === 0 && (
                  <p className="text-xs text-[#A7BDAA] text-center py-8">No comments recorded yet.</p>
                )}
                {(liveIssue.comments ?? []).map(c => {
                  const author = getUserById(c.userId);
                  return (
                    <div key={c.id} className="bg-[#17231B] border border-[#304A39] p-3.5 rounded-xl">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-5 h-5 rounded-md bg-[#1B2B21] border border-[#304A39] text-[#B8F28B] flex items-center justify-center text-[10px] font-mono font-bold">
                          {author?.name.split(' ').map(n => n[0]).join('') ?? '?'}
                        </div>
                        <span className="font-semibold text-xs text-[#E9F5E9]">{author?.name ?? 'Unknown'}</span>
                        <span className="text-[10px] text-[#A7BDAA] font-mono">{new Date(c.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-[#E9F5E9]/90 ml-7 leading-relaxed">{c.text}</p>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-2 pt-3 border-t border-[#304A39]">
                <input
                  type="text"
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleAddComment()}
                  placeholder="Write a comment… (Press Enter to post)"
                  className="flex-1 px-3.5 py-2.5 bg-[#17231B] border border-[#304A39] rounded-xl text-xs text-[#E9F5E9] focus:outline-none focus:border-[#B8F28B]"
                />
                <button
                  onClick={handleAddComment}
                  disabled={!comment.trim()}
                  className="px-4 py-2.5 bg-[#B8F28B] text-[#101914] font-semibold rounded-xl text-xs hover:bg-[#77C98A] transition-colors disabled:opacity-40 cursor-pointer"
                >
                  Post
                </button>
              </div>
            </div>
          )}

          {/* ---- WORK LOGS TAB ---- */}
          {activeTab === 'worklogs' && (
            <div className="space-y-4">
              <div className="space-y-2.5">
                {(liveIssue.workLogs ?? []).length === 0 && (
                  <p className="text-xs text-[#A7BDAA] text-center py-8">No hours logged yet on this deliverable.</p>
                )}
                {(liveIssue.workLogs ?? []).map(wl => {
                  const author = getUserById(wl.userId);
                  return (
                    <div key={wl.id} className="bg-[#17231B] border border-[#304A39] p-3 rounded-xl flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-5 h-5 rounded-md bg-[#1B2B21] border border-[#304A39] text-[#77C98A] flex items-center justify-center text-[10px] font-mono font-bold">
                            {author?.name.split(' ').map(n => n[0]).join('') ?? '?'}
                          </div>
                          <span className="font-semibold text-xs text-[#E9F5E9]">{author?.name ?? 'Unknown'}</span>
                          <span className="text-[10px] text-[#A7BDAA] font-mono">{new Date(wl.createdAt).toLocaleString()}</span>
                        </div>
                        {wl.description && <p className="text-xs text-[#A7BDAA] ml-7">{wl.description}</p>}
                      </div>
                      <span className="bg-[#1B2B21] border border-[#304A39] text-[#B8F28B] px-2 py-0.5 rounded-lg text-xs font-mono font-bold whitespace-nowrap ml-4">
                        {wl.timeSpent}h
                      </span>
                    </div>
                  );
                })}
                {(liveIssue.workLogs ?? []).length > 0 && (
                  <div className="text-right text-xs font-mono font-semibold text-[#B8F28B] pt-1">
                    Total Time: {(liveIssue.workLogs ?? []).reduce((s, wl) => s + wl.timeSpent, 0)}h
                    {liveIssue.estimatedHours ? ` / ${liveIssue.estimatedHours}h estimated` : ''}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#304A39] space-y-2">
                <h4 className="text-[10px] font-semibold text-[#A7BDAA] uppercase tracking-wider">Log Hours Spent</h4>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0.25"
                    step="0.25"
                    value={workHours}
                    onChange={e => setWorkHours(e.target.value)}
                    placeholder="Hours"
                    className="w-24 px-3 py-2 bg-[#17231B] border border-[#304A39] rounded-xl text-xs text-[#E9F5E9] focus:outline-none focus:border-[#B8F28B]"
                  />
                  <input
                    type="text"
                    value={workDesc}
                    onChange={e => setWorkDesc(e.target.value)}
                    placeholder="What tasks did you complete?"
                    className="flex-1 px-3 py-2 bg-[#17231B] border border-[#304A39] rounded-xl text-xs text-[#E9F5E9] focus:outline-none focus:border-[#B8F28B]"
                  />
                  <button
                    onClick={handleLogWork}
                    disabled={!workHours || parseFloat(workHours) <= 0}
                    className="px-4 py-2 bg-[#B8F28B] text-[#101914] font-semibold rounded-xl text-xs hover:bg-[#77C98A] transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    Log
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ---- LINKS TAB ---- */}
          {activeTab === 'links' && (
            <div className="space-y-4">
              <div className="space-y-2">
                {(liveIssue.links ?? []).length === 0 && (
                  <p className="text-xs text-[#A7BDAA] text-center py-8">No linked deliverables.</p>
                )}
                {(liveIssue.links ?? []).map(link => {
                  const target = issues.find(i => i.id === link.targetIssueId);
                  return (
                    <div key={link.id} className="flex items-center justify-between bg-[#17231B] border border-[#304A39] p-3 rounded-xl">
                      <div className="flex items-center gap-2.5">
                        <span className="text-[10px] text-[#77C98A] bg-[#1B2B21] border border-[#304A39] px-2 py-0.5 rounded-md font-mono">{link.type}</span>
                        <span className="text-xs font-mono font-semibold text-[#B8F28B]">{target?.key}</span>
                        <span className="text-xs text-[#E9F5E9]">{target?.title ?? 'Unknown issue'}</span>
                      </div>
                      <button
                        onClick={() => removeIssueLink(issue.id, link.id)}
                        className="p-1 hover:bg-rose-950/40 rounded text-[#A7BDAA] hover:text-rose-400 transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-[#304A39] space-y-2">
                <h4 className="text-[10px] font-semibold text-[#A7BDAA] uppercase tracking-wider">Connect Deliverable</h4>
                <div className="flex gap-2">
                  <select
                    value={linkType}
                    onChange={e => setLinkType(e.target.value as typeof linkType)}
                    className="w-36 px-2.5 py-2 bg-[#17231B] border border-[#304A39] rounded-xl text-xs text-[#E9F5E9] focus:outline-none focus:border-[#B8F28B]"
                  >
                    <option value="relates-to">Relates to</option>
                    <option value="blocks">Blocks</option>
                    <option value="is-blocked-by">Blocked by</option>
                    <option value="duplicates">Duplicates</option>
                    <option value="is-duplicated-by">Duplicated by</option>
                  </select>
                  <select
                    value={linkTargetId}
                    onChange={e => setLinkTargetId(e.target.value)}
                    className="flex-1 px-3 py-2 bg-[#17231B] border border-[#304A39] rounded-xl text-xs text-[#E9F5E9] focus:outline-none focus:border-[#B8F28B]"
                  >
                    <option value="">Select target issue...</option>
                    {linkableIssues.map(i => (
                      <option key={i.id} value={i.id}>{i.key}: {i.title}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleLinkIssue}
                    disabled={!linkTargetId}
                    className="px-4 py-2 bg-[#B8F28B] text-[#101914] font-semibold rounded-xl text-xs hover:bg-[#77C98A] transition-colors disabled:opacity-40 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Link
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ---- ATTACHMENTS TAB ---- */}
          {activeTab === 'attachments' && (
            <div className="space-y-4">
              <div className="space-y-2">
                {(liveIssue.attachments ?? []).length === 0 && (
                  <p className="text-xs text-[#A7BDAA] text-center py-8">No files or assets attached.</p>
                )}
                {(liveIssue.attachments ?? []).map(att => (
                  <div key={att.id} className="flex items-center justify-between bg-[#17231B] border border-[#304A39] p-3 rounded-xl">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Paperclip className="w-4 h-4 text-[#77C98A] flex-shrink-0" />
                      <div className="min-w-0">
                        <a
                          href={att.data}
                          download={att.name}
                          className="text-xs font-medium text-[#B8F28B] hover:underline truncate block"
                        >
                          {att.name}
                        </a>
                        <span className="text-[10px] text-[#A7BDAA] font-mono">
                          {(att.size / 1024).toFixed(1)} KB · {getUserById(att.uploadedBy)?.name} · {new Date(att.uploadedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeAttachment(issue.id, att.id)}
                      className="p-1 hover:bg-rose-950/40 rounded text-[#A7BDAA] hover:text-rose-400 transition-colors ml-2 flex-shrink-0 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-[#304A39]">
                <label className="flex items-center justify-center gap-2 px-4 py-3 border border-dashed border-[#304A39] hover:border-[#77C98A] bg-[#17231B] rounded-xl cursor-pointer transition-colors">
                  <Plus className="w-4 h-4 text-[#77C98A]" />
                  <span className="text-xs text-[#E9F5E9] font-medium">Attach File / Asset</span>
                  <input type="file" className="hidden" onChange={handleFileUpload} />
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};