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
    <div className="h-screen flex bg-[#101914] text-[#E9F5E9] overflow-hidden select-none">

      {/* ── LEFT SIDEBAR NAVIGATION ───────────────────────────────────── */}
      <aside className="w-64 bg-[#17231B] border-r border-[#304A39] flex flex-col flex-shrink-0 z-40 relative">
        
        {/* Brand header */}
        <div className="p-4 border-b border-[#304A39] flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#1B2B21] border border-[#304A39] flex items-center justify-center flex-shrink-0 relative">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#B8F28B] to-[#77C98A] flex items-center justify-center text-[#101914] font-extrabold text-[10px]">
              CS
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#B8F28B] ring-2 ring-[#17231B]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-[#E9F5E9] truncate">Cinemora Studios</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#77C98A]">Agency Workspace</span>
            </div>
          </div>
        </div>

        {/* Create Issue Action */}
        <div className="p-3">
          <button
            onClick={() => setIsCreateIssueOpen(true)}
            className="w-full py-2 px-3 bg-[#B8F28B] hover:bg-[#77C98A] text-[#101914] font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Issue / Task</span>
            <kbd className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-[#101914]/15 font-mono">C</kbd>
          </button>
        </div>

        {/* Navigation items */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#A7BDAA]/70">
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
                    ? 'bg-[#1B2B21] text-[#B8F28B] border border-[#304A39] shadow-sm'
                    : 'text-[#A7BDAA] hover:text-[#E9F5E9] hover:bg-[#1B2B21]/60'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#B8F28B]' : 'text-[#A7BDAA]'}`} />
                <span className="flex-1 text-left">{tab.label}</span>
                {tab.badge !== null && tab.badge > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-[#B8F28B]/20 text-[#B8F28B]' : 'bg-[#132018] text-[#A7BDAA]'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-4 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#A7BDAA]/70">
            Official Domain
          </div>
          <a
            href="https://www.cinemorastudios.agency"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#A7BDAA] hover:text-[#B8F28B] hover:bg-[#1B2B21]/60 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#77C98A]" />
            <span className="truncate">cinemorastudios.agency</span>
          </a>
        </div>

        {/* Sidebar Footer with current user */}
        <div className="p-3 border-t border-[#304A39]">
          <div className="p-2 rounded-xl bg-[#132018] border border-[#304A39] flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#77C98A] to-[#304A39] flex items-center justify-center text-[#E9F5E9] text-xs font-bold flex-shrink-0">
              {getInitials(currentUser?.name || 'User')}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-[#E9F5E9] truncate">{currentUser?.name}</div>
              <div className="text-[10px] text-[#77C98A] capitalize flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B8F28B]" />
                {currentUser?.role === 'admin' ? 'Founder / Admin' : currentUser?.role}
              </div>
            </div>
            <button
              onClick={() => logout()}
              title="Sign Out"
              className="p-1 text-[#A7BDAA] hover:text-red-400 hover:bg-[#1B2B21] rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ─────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header className="h-14 bg-[#17231B] border-b border-[#304A39] px-6 flex items-center justify-between gap-4 flex-shrink-0 z-30">
          
          {/* Breadcrumb & Project Key */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="px-2 py-0.5 rounded-md bg-[#1B2B21] border border-[#304A39] text-[#B8F28B] text-xs font-mono font-bold">
              {project.key}
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#A7BDAA] hidden sm:inline">Cinemora Studios</span>
              <span className="text-[#304A39] hidden sm:inline">/</span>
              <span className="text-[#E9F5E9] font-medium capitalize">{activeTab}</span>
            </div>
          </div>

          {/* Quick Search */}
          <div className="flex-1 max-w-md mx-2">
            <button
              onClick={openSearch}
              className="w-full flex items-center gap-2.5 px-3 py-1.5 bg-[#101914] border border-[#304A39] hover:border-[#77C98A] rounded-xl text-xs text-[#A7BDAA] transition-all cursor-pointer text-left"
            >
              <Search className="w-3.5 h-3.5 text-[#A7BDAA]" />
              <span className="flex-1 truncate">Search issues, keys, or tasks…</span>
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 bg-[#17231B] border border-[#304A39] rounded text-[10px] text-[#A7BDAA] font-mono">
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
              className="p-2 text-[#A7BDAA] hover:text-[#E9F5E9] hover:bg-[#1B2B21] rounded-lg transition-colors cursor-pointer"
            >
              <Keyboard className="w-4 h-4" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => { closeAllMenus(); setShowNotifications(v => !v); }}
                className="p-2 text-[#A7BDAA] hover:text-[#E9F5E9] hover:bg-[#1B2B21] rounded-lg transition-colors relative cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute 1 top-1 right-1 w-2 h-2 bg-[#B8F28B] rounded-full ring-2 ring-[#17231B]" />
                )}
              </button>

              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                  <div className="absolute right-0 top-full mt-2 w-80 bg-[#17231B] border border-[#304A39] rounded-2xl shadow-2xl z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-[#304A39] flex items-center justify-between">
                      <h3 className="font-semibold text-[#E9F5E9] text-xs">Activity Notifications</h3>
                      <span className="text-[10px] text-[#A7BDAA]">{recentActivities.length} recent</span>
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-[#304A39]/50">
                      {recentActivities.length === 0 ? (
                        <p className="px-4 py-8 text-center text-xs text-[#A7BDAA]">No recent activity logged</p>
                      ) : recentActivities.map(act => {
                        const actUser = users.find(u => u.id === act.userId);
                        return (
                          <div key={act.id} className="px-4 py-3 hover:bg-[#1B2B21] transition-colors">
                            <div className="flex items-start gap-2.5">
                              <div className="w-6 h-6 rounded-lg bg-[#1B2B21] border border-[#304A39] flex items-center justify-center text-[10px] font-bold text-[#77C98A] flex-shrink-0 mt-0.5">
                                {actUser?.name.split(' ').map(n => n[0]).join('') ?? '?'}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-[#E9F5E9] leading-relaxed">
                                  <span className="font-medium text-[#B8F28B]">{actUser?.name ?? 'Someone'}</span>{' '}{act.details}
                                </p>
                                <p className="text-[10px] text-[#A7BDAA] mt-1 font-mono">
                                  {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="px-4 py-2 border-t border-[#304A39] bg-[#132018]">
                      <button
                        onClick={() => { setActiveTab('activity'); setShowNotifications(false); }}
                        className="text-xs text-[#B8F28B] hover:underline"
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
                className="p-2 text-[#A7BDAA] hover:text-[#E9F5E9] hover:bg-[#1B2B21] rounded-lg transition-colors cursor-pointer"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
              {showHelpMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowHelpMenu(false)} />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-[#17231B] border border-[#304A39] rounded-2xl shadow-2xl py-2 z-50">
                    <div className="px-4 py-1.5 border-b border-[#304A39] mb-1">
                      <p className="text-[10px] font-semibold text-[#A7BDAA] uppercase tracking-wider">Cinemora Resources</p>
                    </div>
                    <button
                      onClick={() => { setShowThemePanel(true); setShowHelpMenu(false); }}
                      className="w-full px-4 py-2 text-left text-xs text-[#E9F5E9] hover:bg-[#1B2B21] flex items-center gap-2.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#B8F28B]" /> Design System Specs
                    </button>
                    <button
                      onClick={() => { setShowShortcutsModal(true); setShowHelpMenu(false); }}
                      className="w-full px-4 py-2 text-left text-xs text-[#E9F5E9] hover:bg-[#1B2B21] flex items-center gap-2.5"
                    >
                      <Keyboard className="w-3.5 h-3.5 text-[#77C98A]" /> Keyboard Shortcuts
                    </button>
                    <button
                      onClick={() => { setShowBugModal(true); setShowHelpMenu(false); }}
                      className="w-full px-4 py-2 text-left text-xs text-[#E9F5E9] hover:bg-[#1B2B21] flex items-center gap-2.5"
                    >
                      <Bug className="w-3.5 h-3.5 text-[#A7BDAA]" /> Submit Issue Report
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Profile trigger */}
            <div className="relative ml-1">
              <button
                onClick={() => { closeAllMenus(); setShowUserMenu(v => !v); }}
                className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#77C98A] to-[#1B2B21] border border-[#304A39] flex items-center justify-center text-[#E9F5E9] text-xs font-semibold hover:border-[#B8F28B] transition-all cursor-pointer"
                title={currentUser?.name}
              >
                {getInitials(currentUser?.name || 'User')}
              </button>

              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                  <div className="absolute right-0 top-full mt-2 w-64 bg-[#17231B] border border-[#304A39] rounded-2xl shadow-2xl py-2 z-50">
                    <div className="px-4 py-3 border-b border-[#304A39]">
                      <div className="font-semibold text-xs text-[#E9F5E9] truncate">{currentUser?.name}</div>
                      <div className="text-[11px] text-[#A7BDAA] truncate">{currentUser?.email}</div>
                      <div className="text-[10px] text-[#77C98A] capitalize mt-1 font-mono">Role: {currentUser?.role}</div>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => { setShowProfileModal(true); setShowUserMenu(false); }}
                        className="w-full px-4 py-2 text-left text-xs text-[#E9F5E9] hover:bg-[#1B2B21] flex items-center gap-2.5"
                      >
                        <User className="w-3.5 h-3.5 text-[#A7BDAA]" /> Profile Overview
                      </button>
                      <button
                        onClick={() => { setActiveTab('settings'); setShowUserMenu(false); }}
                        className="w-full px-4 py-2 text-left text-xs text-[#E9F5E9] hover:bg-[#1B2B21] flex items-center gap-2.5"
                      >
                        <Settings className="w-3.5 h-3.5 text-[#A7BDAA]" /> Workspace Settings
                      </button>
                      <button
                        onClick={() => { setShowThemePanel(true); setShowUserMenu(false); }}
                        className="w-full px-4 py-2 text-left text-xs text-[#E9F5E9] hover:bg-[#1B2B21] flex items-center gap-2.5"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#B8F28B]" /> Design System
                      </button>
                    </div>
                    <div className="border-t border-[#304A39] pt-1">
                      <button
                        onClick={() => { logout(); setShowUserMenu(false); }}
                        className="w-full px-4 py-2 text-left text-xs text-red-400 hover:bg-[#1B2B21] flex items-center gap-2.5"
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
        <main className="flex-1 overflow-y-auto bg-[#101914] p-6">
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
          <div className="relative w-full max-w-xl bg-[#17231B] border border-[#304A39] rounded-2xl shadow-2xl overflow-hidden z-10">
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#304A39]">
              <Search className="w-4 h-4 text-[#A7BDAA] flex-shrink-0" />
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by issue title, key, or details…"
                className="flex-1 text-xs text-[#E9F5E9] placeholder-[#A7BDAA]/50 outline-none bg-transparent"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-[#A7BDAA] hover:text-[#E9F5E9]">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <kbd className="hidden sm:inline-flex px-1.5 py-0.5 bg-[#1B2B21] border border-[#304A39] rounded text-[10px] text-[#A7BDAA] font-mono">Esc</kbd>
            </div>
            {searchQuery.trim() ? (
              <div className="max-h-80 overflow-y-auto divide-y divide-[#304A39]/40">
                {searchResults.length === 0 ? (
                  <p className="px-4 py-8 text-center text-xs text-[#A7BDAA]">No issues matched "{searchQuery}"</p>
                ) : searchResults.map(issue => (
                  <button
                    key={issue.id}
                    onClick={() => { setSearchSelectedIssue(issue); closeSearch(); }}
                    className="w-full px-4 py-3 text-left hover:bg-[#1B2B21] flex items-center gap-3 transition-colors"
                  >
                    <span className="text-xs text-[#B8F28B] font-mono w-16 flex-shrink-0">{issue.key}</span>
                    <span className="text-xs text-[#E9F5E9] flex-1 truncate">{issue.title}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full flex-shrink-0 font-medium ${
                      issue.status === 'done' ? 'bg-[#B8F28B]/10 text-[#B8F28B] border border-[#304A39]' :
                      issue.status === 'in-progress' ? 'bg-[#77C98A]/10 text-[#77C98A] border border-[#304A39]' :
                      issue.status === 'in-review' ? 'bg-blue-900/20 text-blue-300 border border-[#304A39]' :
                      'bg-[#1B2B21] text-[#A7BDAA] border border-[#304A39]'
                    }`}>{issue.status}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#A7BDAA] flex-shrink-0" />
                  </button>
                ))}
              </div>
            ) : (
              <p className="px-4 py-6 text-center text-xs text-[#A7BDAA]">Type an issue key or keywords to search across the entire workspace</p>
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
          <div className="bg-[#17231B] border border-[#304A39] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#304A39]">
              <div className="flex items-center gap-2">
                <Keyboard className="w-4 h-4 text-[#B8F28B]" />
                <h2 className="text-sm font-semibold text-[#E9F5E9]">Keyboard Shortcuts</h2>
              </div>
              <button onClick={() => setShowShortcutsModal(false)} className="p-1 hover:bg-[#1B2B21] rounded-lg text-[#A7BDAA]">
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
                <div key={label} className="flex items-center justify-between py-2 border-b border-[#304A39]/40 last:border-0">
                  <span className="text-xs text-[#E9F5E9]">{label}</span>
                  <div className="flex items-center gap-1">
                    {keys.map(k => (
                      <kbd key={k} className="px-2 py-0.5 bg-[#1B2B21] border border-[#304A39] rounded text-[11px] font-mono text-[#B8F28B]">{k}</kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-3 border-t border-[#304A39] bg-[#132018] flex justify-end">
              <button onClick={() => setShowShortcutsModal(false)} className="px-4 py-1.5 text-xs bg-[#B8F28B] text-[#101914] font-semibold rounded-xl hover:bg-[#77C98A]">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── REPORT A BUG ───────────────────────────────────────────────── */}
      {showBugModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#17231B] border border-[#304A39] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#304A39]">
              <div className="flex items-center gap-2">
                <Bug className="w-4 h-4 text-[#77C98A]" />
                <h2 className="text-sm font-semibold text-[#E9F5E9]">Submit Feedback / Issue</h2>
              </div>
              <button onClick={() => setShowBugModal(false)} className="p-1 hover:bg-[#1B2B21] rounded-lg text-[#A7BDAA]">
                <X className="w-4 h-4" />
              </button>
            </div>
            {bugSubmitted ? (
              <div className="px-6 py-10 text-center">
                <CheckCircle2 className="w-10 h-10 text-[#B8F28B] mx-auto mb-3" />
                <p className="font-semibold text-sm text-[#E9F5E9]">Report Received</p>
                <p className="text-xs text-[#A7BDAA] mt-1">Stored in internal workspace activity log.</p>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-2 p-3 bg-[#1B2B21] border border-[#304A39] rounded-xl text-xs text-[#A7BDAA]">
                  <AlertTriangle className="w-4 h-4 text-[#77C98A] flex-shrink-0 mt-0.5" />
                  <p>Internal Cinemora feedback tool. Records are saved locally in the browser.</p>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-[#A7BDAA] uppercase tracking-wider mb-1.5">Description</label>
                  <textarea
                    value={bugText}
                    onChange={e => setBugText(e.target.value)}
                    rows={4}
                    placeholder="Describe observations, requirements, or issues…"
                    className="w-full px-3 py-2 bg-[#132018] border border-[#304A39] rounded-xl text-xs text-[#E9F5E9] placeholder-[#A7BDAA]/40 focus:outline-none focus:border-[#B8F28B] resize-none"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setShowBugModal(false)} className="px-3 py-1.5 text-xs text-[#A7BDAA] hover:text-[#E9F5E9]">Cancel</button>
                  <button
                    onClick={handleBugSubmit}
                    disabled={!bugText.trim()}
                    className="px-4 py-1.5 text-xs bg-[#B8F28B] text-[#101914] font-semibold rounded-xl hover:bg-[#77C98A] disabled:opacity-40"
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
          <div className="bg-[#17231B] border border-[#304A39] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#304A39]">
              <h2 className="text-sm font-semibold text-[#E9F5E9]">Cinemora Profile</h2>
              <button onClick={() => setShowProfileModal(false)} className="p-1 hover:bg-[#1B2B21] rounded-lg text-[#A7BDAA]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#B8F28B] to-[#77C98A] flex items-center justify-center text-[#101914] text-xl font-bold">
                  {getInitials(currentUser?.name || 'User')}
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-semibold text-[#A7BDAA] uppercase tracking-wider mb-1">Full Name</label>
                  <div className="px-3 py-2 bg-[#132018] border border-[#304A39] rounded-xl text-xs text-[#E9F5E9]">{currentUser?.name}</div>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-[#A7BDAA] uppercase tracking-wider mb-1">Work Email</label>
                  <div className="px-3 py-2 bg-[#132018] border border-[#304A39] rounded-xl text-xs text-[#E9F5E9] font-mono">{currentUser?.email}</div>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-[#A7BDAA] uppercase tracking-wider mb-1">Role / Permissions</label>
                  <div className="px-3 py-2 bg-[#132018] border border-[#304A39] rounded-xl text-xs text-[#77C98A] font-semibold flex items-center gap-1.5 capitalize">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#B8F28B]" />
                    {currentUser?.role === 'admin' ? 'Founder / Admin (Full Access)' : currentUser?.role}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-[#1B2B21] border border-[#304A39] rounded-xl p-3 text-center">
                    <div className="text-xl font-bold text-[#B8F28B]">{issues.filter(i => i.assigneeId === currentUser?.id).length}</div>
                    <div className="text-[10px] text-[#A7BDAA] mt-0.5">Assigned Tasks</div>
                  </div>
                  <div className="bg-[#1B2B21] border border-[#304A39] rounded-xl p-3 text-center">
                    <div className="text-xl font-bold text-[#77C98A]">{issues.filter(i => i.assigneeId === currentUser?.id && i.status === 'done').length}</div>
                    <div className="text-[10px] text-[#A7BDAA] mt-0.5">Completed Tasks</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-3 border-t border-[#304A39] bg-[#132018] flex justify-end gap-2">
              <button onClick={() => { setShowProfileModal(false); setActiveTab('settings'); }} className="px-3 py-1.5 text-xs text-[#A7BDAA] hover:text-[#E9F5E9]">Account Settings</button>
              <button onClick={() => setShowProfileModal(false)} className="px-4 py-1.5 text-xs bg-[#B8F28B] text-[#101914] font-semibold rounded-xl hover:bg-[#77C98A]">Done</button>
            </div>
          </div>
        </div>
      )}

      {/* ── THEME PANEL ────────────────────────────────────────────────── */}
      {showThemePanel && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#17231B] border border-[#304A39] rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#304A39]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#B8F28B]" />
                <h2 className="text-sm font-semibold text-[#E9F5E9]">Cinemora Design Tokens</h2>
              </div>
              <button onClick={() => setShowThemePanel(false)} className="p-1 hover:bg-[#1B2B21] rounded-lg text-[#A7BDAA]"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl border border-[#B8F28B] bg-[#1B2B21]">
                <div className="w-5 h-5 rounded-md bg-[#B8F28B] flex-shrink-0" />
                <div>
                  <div className="font-semibold text-xs text-[#E9F5E9]">Cinemora Dark Green</div>
                  <div className="text-[10px] text-[#A7BDAA]">Official agency theme #101914 / #B8F28B</div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-[#B8F28B] ml-auto" />
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 text-[10px] font-mono text-[#A7BDAA]">
                <div className="p-2 bg-[#132018] rounded-lg border border-[#304A39] flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-[#101914] border border-[#304A39]" />
                  <span>#101914 Base</span>
                </div>
                <div className="p-2 bg-[#132018] rounded-lg border border-[#304A39] flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-[#17231B] border border-[#304A39]" />
                  <span>#17231B Surface</span>
                </div>
                <div className="p-2 bg-[#132018] rounded-lg border border-[#304A39] flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-[#1B2B21] border border-[#304A39]" />
                  <span>#1B2B21 Card</span>
                </div>
                <div className="p-2 bg-[#132018] rounded-lg border border-[#304A39] flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-[#B8F28B]" />
                  <span>#B8F28B Accent</span>
                </div>
              </div>
            </div>
            <div className="px-6 py-3 border-t border-[#304A39] bg-[#132018] flex justify-end">
              <button onClick={() => setShowThemePanel(false)} className="px-4 py-1.5 text-xs bg-[#B8F28B] text-[#101914] font-semibold rounded-xl hover:bg-[#77C98A]">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};