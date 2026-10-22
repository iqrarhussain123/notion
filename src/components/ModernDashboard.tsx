import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { BoardView } from './views/BoardView';
import { BacklogView } from './views/BacklogView';
import { SprintsView } from './views/SprintsView';
import { DashboardView } from './views/DashboardView';
import { ActivityView } from './views/ActivityView';
import { TeamView } from './views/TeamView';
import { SettingsView } from './views/SettingsView';
import { CreateIssueModal } from './CreateIssueModal';
import { IssueDetailModal } from './IssueDetailModal';
import { Issue } from '../types';
import {
  Bell, HelpCircle, Search, Plus, Settings, BarChart3,
  Users, Calendar, List, LayoutDashboard, Activity,
  X, User, LogOut,
  CheckCircle2, AlertTriangle, Keyboard,
  Bug, ShieldCheck, ChevronRight, ExternalLink,
  Sparkles
} from 'lucide-react';
import cinemoraLogo from '../assets/cinemora-logo.png';

type TabType = 'board' | 'backlog' | 'sprints' | 'dashboard' | 'activity' | 'team' | 'settings';

export const ModernDashboard: React.FC = () => {
  const { currentUser, logout, project, addIssue, issues, activities, users } = useApp();

  const [activeTab, setActiveTab] = useState<TabType>('board');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelpMenu, setShowHelpMenu] = useState(false);
  const [isCreateIssueOpen, setIsCreateIssueOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showThemePanel, setShowThemePanel] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [showBugModal, setShowBugModal] = useState(false);
  const [bugSubmitted, setBugSubmitted] = useState(false);
  const [bugText, setBugText] = useState('');

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [searchSelectedIssue, setSearchSelectedIssue] = useState<Issue | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const tabs = [
    { id: 'board' as TabType,      label: 'Board',     icon: LayoutDashboard, badge: issues.filter(i => i.status !== 'done').length },
    { id: 'backlog' as TabType,    label: 'Backlog',   icon: List,            badge: issues.filter(i => !i.sprintId).length },
    { id: 'sprints' as TabType,    label: 'Sprints',   icon: Calendar,        badge: null },
    { id: 'dashboard' as TabType,  label: 'Metrics',   icon: BarChart3,       badge: null },
    { id: 'activity' as TabType,   label: 'Activity',  icon: Activity,        badge: null },
    { id: 'team' as TabType,       label: 'Team',      icon: Users,           badge: users.length },
    { id: 'settings' as TabType,   label: 'Settings',  icon: Settings,        badge: null },
  ];

  const renderView = () => {
    switch (activeTab) {
      case 'board':     return <BoardView />;
      case 'backlog':   return <BacklogView />;
      case 'sprints':   return <SprintsView />;
      case 'dashboard': return <DashboardView />;
      case 'activity':  return <ActivityView />;
      case 'team':      return <TeamView />;
      case 'settings':  return <SettingsView />;
      default:          return <BoardView />;
    }
  };

  const getInitials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').toUpperCase();

  const handleCreateIssueSubmit = (issueData: {
    key: string; title: string; description: string;
    type: import('../types').IssueType;
    priority: import('../types').IssuePriority;
    status: import('../types').IssueStatus;
    assigneeId?: string; sprintId?: string;
    labels: string[]; estimatedHours?: number;
  }) => {
    addIssue({
      ...issueData,
      reporterId: currentUser!.id,
      comments: [], workLogs: [], links: [], attachments: [],
    });
    setIsCreateIssueOpen(false);
  };

  // Search filtering
  const searchResults = searchQuery.trim().length >= 1
    ? issues
        .filter(i =>
          i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (i.description ?? '').toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 8)
    : [];

  const openSearch = () => {
    setShowSearch(true);
    setTimeout(() => searchRef.current?.focus(), 50);
  };

  const closeSearch = () => {
    setShowSearch(false);
    setSearchQuery('');
  };

  // Global keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        showSearch ? closeSearch() : openSearch();
        return;
      }
      if (e.key === 'Escape') {
        closeSearch();
        setShowShortcutsModal(false);
        setShowBugModal(false);
        setShowProfileModal(false);
        setShowThemePanel(false);
        closeAllMenus();
        return;
      }
      // Press C to create issue (only when no input active)
      const tag = (document.activeElement as HTMLElement)?.tagName;
      if (e.key === 'c' && !e.ctrlKey && !e.metaKey && tag !== 'INPUT' && tag !== 'TEXTAREA') {
        setIsCreateIssueOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [showSearch]);

  const recentActivities = activities.slice(0, 8);
  const unreadCount = Math.min(recentActivities.length, 9);

  const closeAllMenus = () => {
    setShowUserMenu(false);
    setShowNotifications(false);
    setShowHelpMenu(false);
  };

  const handleBugSubmit = () => {
    if (!bugText.trim()) return;
    setBugSubmitted(true);
    setBugText('');
    setTimeout(() => { setBugSubmitted(false); setShowBugModal(false); }, 2000);
  };

  return (
    <div className="h-screen flex bg-[#08090d] text-[#f2f4f8] overflow-hidden select-none">

      {/* ── LEFT SIDEBAR NAVIGATION ───────────────────────────────────── */}
      <aside className="w-64 bg-[#0e111a] border-r border-[#1c2232] flex flex-col flex-shrink-0 z-40 relative">
        
        {/* Brand header */}
        <div className="p-4 border-b border-[#1c2232] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#141824] border border-[#1c2232] p-1.5 flex items-center justify-center flex-shrink-0 relative shadow-md">
            <img src={cinemoraLogo} alt="Cinemora Studios" className="w-full h-full object-contain rounded-lg" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#d4a237] ring-2 ring-[#0e111a]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-[#f2f4f8] truncate">Cinemora Studios</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#d4a237]">Agency Workspace</span>
            </div>
          </div>
        </div>

        {/* Create Issue Action */}
        <div className="p-3">
          <button
            onClick={() => setIsCreateIssueOpen(true)}
            className="w-full py-2 px-3 bg-[#d4a237] hover:bg-[#e5be60] text-[#08090d] font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Issue / Task</span>
            <kbd className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-[#08090d]/15 font-mono">C</kbd>
          </button>
        </div>

        {/* Navigation items */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#8c93a8]/70">
            Workspace
          </div>

          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#141824] text-[#d4a237] border border-[#1c2232] shadow-sm'
                    : 'text-[#8c93a8] hover:text-[#f2f4f8] hover:bg-[#141824]/60'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#d4a237]' : 'text-[#8c93a8]'}`} />
                <span className="flex-1 text-left">{tab.label}</span>
                {tab.badge !== null && tab.badge > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-[#d4a237]/20 text-[#d4a237]' : 'bg-[#10141f] text-[#8c93a8]'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-4 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#8c93a8]/70">
            Official Domain
          </div>
          <a
            href="https://www.cinemorastudios.agency"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#8c93a8] hover:text-[#d4a237] hover:bg-[#141824]/60 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#e5be60]" />
            <span className="truncate">cinemorastudios.agency</span>
          </a>
        </div>

        {/* Sidebar Footer with current user */}
        <div className="p-3 border-t border-[#1c2232]">
          <div className="p-2 rounded-xl bg-[#10141f] border border-[#1c2232] flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#e5be60] to-[#1c2232] flex items-center justify-center text-[#f2f4f8] text-xs font-bold flex-shrink-0">
              {getInitials(currentUser?.name || 'User')}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-[#f2f4f8] truncate">{currentUser?.name}</div>
              <div className="text-[10px] text-[#e5be60] capitalize flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4a237]" />
                {currentUser?.role === 'admin' ? 'Founder / Admin' : currentUser?.role}
              </div>
            </div>
            <button
              onClick={() => logout()}
              title="Sign Out"
              className="p-1 text-[#8c93a8] hover:text-red-400 hover:bg-[#141824] rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ─────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header className="h-14 bg-[#0e111a] border-b border-[#1c2232] px-6 flex items-center justify-between gap-4 flex-shrink-0 z-30">
          
          {/* Breadcrumb & Project Key */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="px-2 py-0.5 rounded-md bg-[#141824] border border-[#1c2232] text-[#d4a237] text-xs font-mono font-bold">
              {project.key}
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#8c93a8] hidden sm:inline">Cinemora Studios</span>
              <span className="text-[#1c2232] hidden sm:inline">/</span>
              <span className="text-[#f2f4f8] font-medium capitalize">{activeTab}</span>
            </div>
          </div>

          {/* Quick Search */}
          <div className="flex-1 max-w-md mx-2">
            <button
              onClick={openSearch}
              className="w-full flex items-center gap-2.5 px-3 py-1.5 bg-[#08090d] border border-[#1c2232] hover:border-[#e5be60] rounded-xl text-xs text-[#8c93a8] transition-all cursor-pointer text-left"
            >
              <Search className="w-3.5 h-3.5 text-[#8c93a8]" />
              <span className="flex-1 truncate">Search issues, keys, or tasks…</span>
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 bg-[#0e111a] border border-[#1c2232] rounded text-[10px] text-[#8c93a8] font-mono">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Keyboard shortcuts trigger */}
            <button
              onClick={() => setShowShortcutsModal(true)}
              title="Keyboard Shortcuts"
              className="p-2 text-[#8c93a8] hover:text-[#f2f4f8] hover:bg-[#141824] rounded-lg transition-colors cursor-pointer"
            >
              <Keyboard className="w-4 h-4" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => { closeAllMenus(); setShowNotifications(v => !v); }}
                className="p-2 text-[#8c93a8] hover:text-[#f2f4f8] hover:bg-[#141824] rounded-lg transition-colors relative cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute 1 top-1 right-1 w-2 h-2 bg-[#d4a237] rounded-full ring-2 ring-[#0e111a]" />
                )}
              </button>

              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                  <div className="absolute right-0 top-full mt-2 w-80 bg-[#0e111a] border border-[#1c2232] rounded-2xl shadow-2xl z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-[#1c2232] flex items-center justify-between">
                      <h3 className="font-semibold text-[#f2f4f8] text-xs">Activity Notifications</h3>
                      <span className="text-[10px] text-[#8c93a8]">{recentActivities.length} recent</span>
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-[#1c2232]/50">
                      {recentActivities.length === 0 ? (
                        <p className="px-4 py-8 text-center text-xs text-[#8c93a8]">No recent activity logged</p>
                      ) : recentActivities.map(act => {
                        const actUser = users.find(u => u.id === act.userId);
                        return (
                          <div key={act.id} className="px-4 py-3 hover:bg-[#141824] transition-colors">
                            <div className="flex items-start gap-2.5">
                              <div className="w-6 h-6 rounded-lg bg-[#141824] border border-[#1c2232] flex items-center justify-center text-[10px] font-bold text-[#e5be60] flex-shrink-0 mt-0.5">
                                {actUser?.name.split(' ').map(n => n[0]).join('') ?? '?'}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-[#f2f4f8] leading-relaxed">
                                  <span className="font-medium text-[#d4a237]">{actUser?.name ?? 'Someone'}</span>{' '}{act.details}
                                </p>
                                <p className="text-[10px] text-[#8c93a8] mt-1 font-mono">
                                  {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="px-4 py-2 border-t border-[#1c2232] bg-[#10141f]">
                      <button
                        onClick={() => { setActiveTab('activity'); setShowNotifications(false); }}
                        className="text-xs text-[#d4a237] hover:underline"
                      >
                        View all activity feed →
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Help Menu */}
            <div className="relative">
              <button
                onClick={() => { closeAllMenus(); setShowHelpMenu(v => !v); }}
                className="p-2 text-[#8c93a8] hover:text-[#f2f4f8] hover:bg-[#141824] rounded-lg transition-colors cursor-pointer"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
              {showHelpMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowHelpMenu(false)} />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-[#0e111a] border border-[#1c2232] rounded-2xl shadow-2xl py-2 z-50">
                    <div className="px-4 py-1.5 border-b border-[#1c2232] mb-1">
                      <p className="text-[10px] font-semibold text-[#8c93a8] uppercase tracking-wider">Cinemora Resources</p>
                    </div>
                    <button
                      onClick={() => { setShowThemePanel(true); setShowHelpMenu(false); }}
                      className="w-full px-4 py-2 text-left text-xs text-[#f2f4f8] hover:bg-[#141824] flex items-center gap-2.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#d4a237]" /> Design System Specs
                    </button>
                    <button
                      onClick={() => { setShowShortcutsModal(true); setShowHelpMenu(false); }}
                      className="w-full px-4 py-2 text-left text-xs text-[#f2f4f8] hover:bg-[#141824] flex items-center gap-2.5"
                    >
                      <Keyboard className="w-3.5 h-3.5 text-[#e5be60]" /> Keyboard Shortcuts
                    </button>
                    <button
                      onClick={() => { setShowBugModal(true); setShowHelpMenu(false); }}
                      className="w-full px-4 py-2 text-left text-xs text-[#f2f4f8] hover:bg-[#141824] flex items-center gap-2.5"
                    >
                      <Bug className="w-3.5 h-3.5 text-[#8c93a8]" /> Submit Issue Report
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Profile trigger */}
            <div className="relative ml-1">
              <button
                onClick={() => { closeAllMenus(); setShowUserMenu(v => !v); }}
                className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#e5be60] to-[#141824] border border-[#1c2232] flex items-center justify-center text-[#f2f4f8] text-xs font-semibold hover:border-[#d4a237] transition-all cursor-pointer"
                title={currentUser?.name}
              >
                {getInitials(currentUser?.name || 'User')}
              </button>

              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                  <div className="absolute right-0 top-full mt-2 w-64 bg-[#0e111a] border border-[#1c2232] rounded-2xl shadow-2xl py-2 z-50">
                    <div className="px-4 py-3 border-b border-[#1c2232]">
                      <div className="font-semibold text-xs text-[#f2f4f8] truncate">{currentUser?.name}</div>
                      <div className="text-[11px] text-[#8c93a8] truncate">{currentUser?.email}</div>
                      <div className="text-[10px] text-[#e5be60] capitalize mt-1 font-mono">Role: {currentUser?.role}</div>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => { setShowProfileModal(true); setShowUserMenu(false); }}
                        className="w-full px-4 py-2 text-left text-xs text-[#f2f4f8] hover:bg-[#141824] flex items-center gap-2.5"
                      >
                        <User className="w-3.5 h-3.5 text-[#8c93a8]" /> Profile Overview
                      </button>
                      <button
                        onClick={() => { setActiveTab('settings'); setShowUserMenu(false); }}
                        className="w-full px-4 py-2 text-left text-xs text-[#f2f4f8] hover:bg-[#141824] flex items-center gap-2.5"
                      >
                        <Settings className="w-3.5 h-3.5 text-[#8c93a8]" /> Workspace Settings
                      </button>
                      <button
                        onClick={() => { setShowThemePanel(true); setShowUserMenu(false); }}
                        className="w-full px-4 py-2 text-left text-xs text-[#f2f4f8] hover:bg-[#141824] flex items-center gap-2.5"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#d4a237]" /> Design System
                      </button>
                    </div>
                    <div className="border-t border-[#1c2232] pt-1">
                      <button
                        onClick={() => { logout(); setShowUserMenu(false); }}
                        className="w-full px-4 py-2 text-left text-xs text-red-400 hover:bg-[#141824] flex items-center gap-2.5"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* View Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#08090d] p-6">
          {renderView()}
        </main>
      </div>

      {/* ══════════ MODALS & OVERLAYS ══════════ */}

      {isCreateIssueOpen && (
        <CreateIssueModal
          isOpen={isCreateIssueOpen}
          onClose={() => setIsCreateIssueOpen(false)}
          onSubmit={handleCreateIssueSubmit}
        />
      )}

      {/* ── SEARCH OVERLAY ─────────────────────────────────────────────── */}
      {showSearch && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeSearch} />
          <div className="relative w-full max-w-xl bg-[#0e111a] border border-[#1c2232] rounded-2xl shadow-2xl overflow-hidden z-10">
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#1c2232]">
              <Search className="w-4 h-4 text-[#8c93a8] flex-shrink-0" />
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by issue title, key, or details…"
                className="flex-1 text-xs text-[#f2f4f8] placeholder-[#8c93a8]/50 outline-none bg-transparent"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-[#8c93a8] hover:text-[#f2f4f8]">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <kbd className="hidden sm:inline-flex px-1.5 py-0.5 bg-[#141824] border border-[#1c2232] rounded text-[10px] text-[#8c93a8] font-mono">Esc</kbd>
            </div>
            {searchQuery.trim() ? (
              <div className="max-h-80 overflow-y-auto divide-y divide-[#1c2232]/40">
                {searchResults.length === 0 ? (
                  <p className="px-4 py-8 text-center text-xs text-[#8c93a8]">No issues matched "{searchQuery}"</p>
                ) : searchResults.map(issue => (
                  <button
                    key={issue.id}
                    onClick={() => { setSearchSelectedIssue(issue); closeSearch(); }}
                    className="w-full px-4 py-3 text-left hover:bg-[#141824] flex items-center gap-3 transition-colors"
                  >
                    <span className="text-xs text-[#d4a237] font-mono w-16 flex-shrink-0">{issue.key}</span>
                    <span className="text-xs text-[#f2f4f8] flex-1 truncate">{issue.title}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full flex-shrink-0 font-medium ${
                      issue.status === 'done' ? 'bg-[#d4a237]/10 text-[#d4a237] border border-[#1c2232]' :
                      issue.status === 'in-progress' ? 'bg-[#e5be60]/10 text-[#e5be60] border border-[#1c2232]' :
                      issue.status === 'in-review' ? 'bg-blue-900/20 text-blue-300 border border-[#1c2232]' :
                      'bg-[#141824] text-[#8c93a8] border border-[#1c2232]'
                    }`}>{issue.status}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#8c93a8] flex-shrink-0" />
                  </button>
                ))}
              </div>
            ) : (
              <p className="px-4 py-6 text-center text-xs text-[#8c93a8]">Type an issue key or keywords to search across the entire workspace</p>
            )}
          </div>
        </div>
      )}

      {searchSelectedIssue && (
        <IssueDetailModal issue={searchSelectedIssue} onClose={() => setSearchSelectedIssue(null)} />
      )}

      {/* ── KEYBOARD SHORTCUTS ─────────────────────────────────────────── */}
      {showShortcutsModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0e111a] border border-[#1c2232] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1c2232]">
              <div className="flex items-center gap-2">
                <Keyboard className="w-4 h-4 text-[#d4a237]" />
                <h2 className="text-sm font-semibold text-[#f2f4f8]">Keyboard Shortcuts</h2>
              </div>
              <button onClick={() => setShowShortcutsModal(false)} className="p-1 hover:bg-[#141824] rounded-lg text-[#8c93a8]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-2">
              {[
                { keys: ['⌘', 'K'], label: 'Global Issue Search' },
                { keys: ['C'],       label: 'Quick Create Task' },
                { keys: ['Esc'],     label: 'Dismiss Any Modal or Dropdown' },
                { keys: ['Enter'],   label: 'Submit Active Comment' },
                { keys: ['Tab'],     label: 'Navigate Form Fields' },
              ].map(({ keys, label }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-[#1c2232]/40 last:border-0">
                  <span className="text-xs text-[#f2f4f8]">{label}</span>
                  <div className="flex items-center gap-1">
                    {keys.map(k => (
                      <kbd key={k} className="px-2 py-0.5 bg-[#141824] border border-[#1c2232] rounded text-[11px] font-mono text-[#d4a237]">{k}</kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-3 border-t border-[#1c2232] bg-[#10141f] flex justify-end">
              <button onClick={() => setShowShortcutsModal(false)} className="px-4 py-1.5 text-xs bg-[#d4a237] text-[#08090d] font-semibold rounded-xl hover:bg-[#e5be60]">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── REPORT A BUG ───────────────────────────────────────────────── */}
      {showBugModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0e111a] border border-[#1c2232] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1c2232]">
              <div className="flex items-center gap-2">
                <Bug className="w-4 h-4 text-[#e5be60]" />
                <h2 className="text-sm font-semibold text-[#f2f4f8]">Submit Feedback / Issue</h2>
              </div>
              <button onClick={() => setShowBugModal(false)} className="p-1 hover:bg-[#141824] rounded-lg text-[#8c93a8]">
                <X className="w-4 h-4" />
              </button>
            </div>
            {bugSubmitted ? (
              <div className="px-6 py-10 text-center">
                <CheckCircle2 className="w-10 h-10 text-[#d4a237] mx-auto mb-3" />
                <p className="font-semibold text-sm text-[#f2f4f8]">Report Received</p>
                <p className="text-xs text-[#8c93a8] mt-1">Stored in internal workspace activity log.</p>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-2 p-3 bg-[#141824] border border-[#1c2232] rounded-xl text-xs text-[#8c93a8]">
                  <AlertTriangle className="w-4 h-4 text-[#e5be60] flex-shrink-0 mt-0.5" />
                  <p>Internal Cinemora feedback tool. Records are saved locally in the browser.</p>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-[#8c93a8] uppercase tracking-wider mb-1.5">Description</label>
                  <textarea
                    value={bugText}
                    onChange={e => setBugText(e.target.value)}
                    rows={4}
                    placeholder="Describe observations, requirements, or issues…"
                    className="w-full px-3 py-2 bg-[#10141f] border border-[#1c2232] rounded-xl text-xs text-[#f2f4f8] placeholder-[#8c93a8]/40 focus:outline-none focus:border-[#d4a237] resize-none"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setShowBugModal(false)} className="px-3 py-1.5 text-xs text-[#8c93a8] hover:text-[#f2f4f8]">Cancel</button>
                  <button
                    onClick={handleBugSubmit}
                    disabled={!bugText.trim()}
                    className="px-4 py-1.5 text-xs bg-[#d4a237] text-[#08090d] font-semibold rounded-xl hover:bg-[#e5be60] disabled:opacity-40"
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── PROFILE MODAL ──────────────────────────────────────────────── */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0e111a] border border-[#1c2232] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1c2232]">
              <h2 className="text-sm font-semibold text-[#f2f4f8]">Cinemora Profile</h2>
              <button onClick={() => setShowProfileModal(false)} className="p-1 hover:bg-[#141824] rounded-lg text-[#8c93a8]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#d4a237] to-[#e5be60] flex items-center justify-center text-[#08090d] text-xl font-bold">
                  {getInitials(currentUser?.name || 'User')}
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-semibold text-[#8c93a8] uppercase tracking-wider mb-1">Full Name</label>
                  <div className="px-3 py-2 bg-[#10141f] border border-[#1c2232] rounded-xl text-xs text-[#f2f4f8]">{currentUser?.name}</div>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-[#8c93a8] uppercase tracking-wider mb-1">Work Email</label>
                  <div className="px-3 py-2 bg-[#10141f] border border-[#1c2232] rounded-xl text-xs text-[#f2f4f8] font-mono">{currentUser?.email}</div>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-[#8c93a8] uppercase tracking-wider mb-1">Role / Permissions</label>
                  <div className="px-3 py-2 bg-[#10141f] border border-[#1c2232] rounded-xl text-xs text-[#e5be60] font-semibold flex items-center gap-1.5 capitalize">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#d4a237]" />
                    {currentUser?.role === 'admin' ? 'Founder / Admin (Full Access)' : currentUser?.role}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-[#141824] border border-[#1c2232] rounded-xl p-3 text-center">
                    <div className="text-xl font-bold text-[#d4a237]">{issues.filter(i => i.assigneeId === currentUser?.id).length}</div>
                    <div className="text-[10px] text-[#8c93a8] mt-0.5">Assigned Tasks</div>
                  </div>
                  <div className="bg-[#141824] border border-[#1c2232] rounded-xl p-3 text-center">
                    <div className="text-xl font-bold text-[#e5be60]">{issues.filter(i => i.assigneeId === currentUser?.id && i.status === 'done').length}</div>
                    <div className="text-[10px] text-[#8c93a8] mt-0.5">Completed Tasks</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-3 border-t border-[#1c2232] bg-[#10141f] flex justify-end gap-2">
              <button onClick={() => { setShowProfileModal(false); setActiveTab('settings'); }} className="px-3 py-1.5 text-xs text-[#8c93a8] hover:text-[#f2f4f8]">Account Settings</button>
              <button onClick={() => setShowProfileModal(false)} className="px-4 py-1.5 text-xs bg-[#d4a237] text-[#08090d] font-semibold rounded-xl hover:bg-[#e5be60]">Done</button>
            </div>
          </div>
        </div>
      )}

      {/* ── THEME PANEL ────────────────────────────────────────────────── */}
      {showThemePanel && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0e111a] border border-[#1c2232] rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1c2232]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#d4a237]" />
                <h2 className="text-sm font-semibold text-[#f2f4f8]">Cinemora Design Tokens</h2>
              </div>
              <button onClick={() => setShowThemePanel(false)} className="p-1 hover:bg-[#141824] rounded-lg text-[#8c93a8]"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl border border-[#d4a237] bg-[#141824]">
                <div className="w-5 h-5 rounded-md bg-[#d4a237] flex-shrink-0" />
                <div>
                  <div className="font-semibold text-xs text-[#f2f4f8]">Cinemora Dark Green</div>
                  <div className="text-[10px] text-[#8c93a8]">Official agency theme #08090d / #d4a237</div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-[#d4a237] ml-auto" />
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 text-[10px] font-mono text-[#8c93a8]">
                <div className="p-2 bg-[#10141f] rounded-lg border border-[#1c2232] flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-[#08090d] border border-[#1c2232]" />
                  <span>#08090d Base</span>
                </div>
                <div className="p-2 bg-[#10141f] rounded-lg border border-[#1c2232] flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-[#0e111a] border border-[#1c2232]" />
                  <span>#0e111a Surface</span>
                </div>
                <div className="p-2 bg-[#10141f] rounded-lg border border-[#1c2232] flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-[#141824] border border-[#1c2232]" />
                  <span>#141824 Card</span>
                </div>
                <div className="p-2 bg-[#10141f] rounded-lg border border-[#1c2232] flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-[#d4a237]" />
                  <span>#d4a237 Accent</span>
                </div>
              </div>
            </div>
            <div className="px-6 py-3 border-t border-[#1c2232] bg-[#10141f] flex justify-end">
              <button onClick={() => setShowThemePanel(false)} className="px-4 py-1.5 text-xs bg-[#d4a237] text-[#08090d] font-semibold rounded-xl hover:bg-[#e5be60]">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};