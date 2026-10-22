import {
  User,
  Issue,
  Sprint,
  Project,
  Invitation,
  AppState,
  Activity,
  Comment,
  WorkLog,
  IssueLink,
  Attachment,
} from '../types';

const STORAGE_KEY = 'jira_clone_data';
const AUTH_KEY = 'jira_clone_auth';

const DEFAULT_ADMIN: User = {
  id: 'usr_iqrar',
  name: 'Iqrar Hussain',
  email: 'iqrar@cinemorastudios.agency',
  password: 'I&s&c123$$',
  avatar: '👨‍💼',
  role: 'admin',
  assignedIssues: 0,
  completedIssues: 0,
  createdAt: new Date().toISOString(),
};

const DEFAULT_ASHMAAD: User = {
  id: 'usr_ashmaad',
  name: 'Ashmaad',
  email: 'ashmaad@cinemorastudios.agency',
  password: 'A&s&c123$$',
  avatar: '👨‍💻',
  role: 'admin',
  assignedIssues: 0,
  completedIssues: 0,
  createdAt: new Date().toISOString(),
};

const DEFAULT_PROJECT: Project = {
  id: 'project-cinemora',
  name: 'Cinemora Studios',
  key: 'CIN',
  description: 'Cinemora Studios internal creative, content, web, and AI agency workspace.',
  createdAt: new Date().toISOString(),
  adminId: 'usr_iqrar',
};

// ── Core DB ────────────────────────────────────────────────────────────────

export const initializeDatabase = (): AppState => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (existing) {
    try {
      const parsed = JSON.parse(existing) as AppState;
      // Seamlessly migrate previous TaskFlow defaults to Cinemora Studios without wiping issues/sprints
      let modified = false;
      if (parsed.project && (parsed.project.name === 'TaskFlow Project' || parsed.project.key === 'TASK')) {
        parsed.project.name = 'Cinemora Studios';
        parsed.project.key = 'CIN';
        parsed.project.description = 'Cinemora Studios internal creative, content, web, and AI agency workspace.';
        modified = true;
      }
      if (Array.isArray(parsed.users)) {
        const adminUser = parsed.users.find(u => u.role === 'admin' || u.id === 'usr_iqrar' || u.id === 'admin-1' || u.email === 'iqrar@cinemorastudios.com' || u.email === 'admin@company.com');
        if (adminUser) {
          adminUser.name = 'Iqrar Hussain';
          adminUser.email = 'iqrar@cinemorastudios.agency';
          adminUser.password = 'I&s&c123$$';
          adminUser.role = 'admin';
          modified = true;
        } else if (!parsed.users.some(u => u.email.trim().toLowerCase() === 'iqrar@cinemorastudios.agency')) {
          parsed.users.unshift(DEFAULT_ADMIN);
          modified = true;
        }

        const ashmaadUser = parsed.users.find(u => {
          const em = u.email.trim().toLowerCase();
          return em === 'ashmaad@cinemorastudios.agency' || em === 'ishmaad@cinemorastudios.agency' || u.id === 'usr_ashmaad';
        });
        if (ashmaadUser) {
          ashmaadUser.name = 'Ashmaad';
          ashmaadUser.email = 'ashmaad@cinemorastudios.agency';
          ashmaadUser.password = 'A&s&c123$$';
          ashmaadUser.role = 'admin';
          modified = true;
        } else {
          parsed.users.push(DEFAULT_ASHMAAD);
          modified = true;
        }
      }
      if (modified) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      }
      return parsed;
    } catch {
      // corrupt data – re-initialise
    }
  }
  const initial: AppState = {
    project: DEFAULT_PROJECT,
    users: [DEFAULT_ADMIN, DEFAULT_ASHMAAD],
    issues: [],
    sprints: [],
    invitations: [],
    activities: [],
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
};

export const getData = (): AppState => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw) as AppState;
    } catch {
      /* fall through */
    }
  }
  return initializeDatabase();
};

export const saveData = (data: AppState): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// ── Activity logging ───────────────────────────────────────────────────────

const logActivity = (
  type: Activity['type'],
  userId: string,
  details: string,
  issueId?: string,
  sprintId?: string,
  metadata?: unknown
): void => {
  const data = getData();
  const activity: Activity = {
    id: `activity-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    type,
    userId,
    issueId,
    sprintId,
    details,
    metadata,
    createdAt: new Date().toISOString(),
  };
  data.activities = data.activities ?? [];
  data.activities.unshift(activity);
  if (data.activities.length > 200) data.activities.length = 200;
  saveData(data);
};

// ── Auth ──────────────────────────────────────────────────────────────────

export const login = (email: string, password: string): User | null => {
  const data = getData();
  const normalized = email.trim().toLowerCase();

  let user = data.users.find(u => u.email.trim().toLowerCase() === normalized);

  // Initialize Iqrar or Ashmaad if not yet in users list
  if (!user && normalized === 'iqrar@cinemorastudios.agency') {
    user = { ...DEFAULT_ADMIN };
    data.users.unshift(user);
    saveData(data);
  } else if (!user && (normalized === 'ashmaad@cinemorastudios.agency' || normalized === 'ishmaad@cinemorastudios.agency')) {
    user = { ...DEFAULT_ASHMAAD };
    data.users.push(user);
    saveData(data);
  }

  if (!user) {
    return null;
  }

  // Verify password:
  // For Iqrar: I&s&c123$$ | For Ashmaad: A&s&c123$$
  const isIqrar = normalized === 'iqrar@cinemorastudios.agency';
  const isAshmaad = normalized === 'ashmaad@cinemorastudios.agency' || normalized === 'ishmaad@cinemorastudios.agency';

  const passwordValid = 
    (isIqrar && (password === 'I&s&c123$$' || user.password === password)) ||
    (isAshmaad && (password === 'A&s&c123$$' || user.password === password)) ||
    user.password === password;

  if (!passwordValid) {
    return null;
  }

  // Keep saved password synchronized if master credential is provided
  if (isIqrar && password === 'I&s&c123$$' && user.password !== 'I&s&c123$$') {
    user.password = 'I&s&c123$$';
    saveData(data);
  } else if (isAshmaad && password === 'A&s&c123$$' && user.password !== 'A&s&c123$$') {
    user.password = 'A&s&c123$$';
    saveData(data);
  }

  const { password: _pw, ...safe } = user;
  localStorage.setItem(AUTH_KEY, JSON.stringify(safe));
  return safe;
};

export const signup = (name: string, email: string, password: string): User | null => {
  const data = getData();
  const normalized = email.trim().toLowerCase();

  // If user already exists, check if it's an existing account
  const existing = data.users.find(u => u.email.trim().toLowerCase() === normalized);
  if (existing) {
    return login(email, password);
  }

  // Check if there is an invitation for this member/co-founder
  const invitation = data.invitations.find(
    inv => inv.email.trim().toLowerCase() === normalized && inv.status === 'pending'
  );

  const newUser: User = {
    id: `user-${Date.now()}`,
    name: name.trim() || 'Team Member',
    email: normalized,
    password,
    avatar: invitation?.role === 'admin' ? '👨‍💻' : '👤',
    role: invitation?.role ?? 'member',
    assignedIssues: 0,
    completedIssues: 0,
    createdAt: new Date().toISOString(),
  };

  data.users.push(newUser);
  if (invitation) {
    invitation.status = 'accepted';
  }
  saveData(data);

  const { password: _pw, ...safe } = newUser;
  localStorage.setItem(AUTH_KEY, JSON.stringify(safe));
  return safe;
};

export const logout = (): void => localStorage.removeItem(AUTH_KEY);

export const getCurrentUser = (): User | null => {
  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
};

// ── Users ──────────────────────────────────────────────────────────────────

export const updateUser = (userId: string, updates: Partial<User>): void => {
  const data = getData();
  const idx = data.users.findIndex(u => u.id === userId);
  if (idx !== -1) {
    data.users[idx] = { ...data.users[idx], ...updates };
    saveData(data);
  }
};

export const updatePassword = (userId: string, newPassword: string): boolean => {
  const data = getData();
  const user = data.users.find(u => u.id === userId);
  if (!user) return false;
  user.password = newPassword;
  saveData(data);
  return true;
};

// ── Issues ────────────────────────────────────────────────────────────────

export const addIssue = (issue: Issue): void => {
  const data = getData();
  data.issues.push(issue);
  saveData(data);
  logActivity('issue_created', issue.reporterId, `created ${issue.key}: ${issue.title}`, issue.id);
};

export const updateIssue = (issueId: string, updates: Partial<Issue>): void => {
  const data = getData();
  const idx = data.issues.findIndex(i => i.id === issueId);
  if (idx === -1) return;

  const old = data.issues[idx];
  const actorId = getCurrentUser()?.id ?? old.reporterId;

  if (updates.status && updates.status !== old.status) {
    logActivity('status_changed', actorId, `moved ${old.key} from "${old.status}" to "${updates.status}"`, issueId);
  }
  if (updates.assigneeId !== undefined && updates.assigneeId !== old.assigneeId) {
    logActivity('issue_assigned', actorId, `reassigned ${old.key}`, issueId);
  }
  if (!updates.status && updates.assigneeId === undefined) {
    logActivity('issue_updated', actorId, `updated ${old.key}`, issueId);
  }

  data.issues[idx] = { ...old, ...updates, updatedAt: new Date().toISOString() };
  saveData(data);
};

export const deleteIssue = (issueId: string): void => {
  const data = getData();
  data.issues = data.issues.filter(i => i.id !== issueId);
  saveData(data);
};

// ── Sprints ───────────────────────────────────────────────────────────────

export const addSprint = (sprint: Sprint): void => {
  const data = getData();
  data.sprints.push(sprint);
  saveData(data);
  const actorId = getCurrentUser()?.id ?? 'admin-1';
  logActivity('sprint_created', actorId, `created sprint "${sprint.name}"`, undefined, sprint.id);
};

export const updateSprint = (sprintId: string, updates: Partial<Sprint>): void => {
  const data = getData();
  const idx = data.sprints.findIndex(s => s.id === sprintId);
  if (idx !== -1) {
    data.sprints[idx] = { ...data.sprints[idx], ...updates };
    saveData(data);
  }
};

export const deleteSprint = (sprintId: string): void => {
  const data = getData();
  data.sprints = data.sprints.filter(s => s.id !== sprintId);
  saveData(data);
};

/**
 * Start a sprint.
 * Any currently active sprint is properly completed first:
 * – its status becomes "completed"
 * – incomplete issues are returned to the backlog
 */
export const startSprint = (sprintId: string): void => {
  const data = getData();
  const actorId = getCurrentUser()?.id ?? 'admin-1';

  // Properly wrap up any currently active sprint
  data.sprints.forEach(s => {
    if (s.status === 'active') {
      s.status = 'completed';
      data.issues.forEach(issue => {
        if (issue.sprintId === s.id && issue.status !== 'done') {
          issue.sprintId = undefined;
          issue.status = 'backlog';
        }
      });
      logActivity('sprint_completed', actorId, `auto-completed sprint "${s.name}" on new sprint start`, undefined, s.id);
    }
  });

  const sprint = data.sprints.find(s => s.id === sprintId);
  if (sprint) {
    sprint.status = 'active';
    sprint.startDate = new Date().toISOString();
    saveData(data);
    logActivity('sprint_started', actorId, `started sprint "${sprint.name}"`, undefined, sprintId);
  }
};

/**
 * Complete the active sprint.
 * Done issues stay; all others return to backlog.
 */
export const completeSprint = (sprintId: string): void => {
  const data = getData();
  const sprint = data.sprints.find(s => s.id === sprintId);
  if (!sprint || sprint.status !== 'active') return;

  const actorId = getCurrentUser()?.id ?? 'admin-1';
  const sprintIssues = data.issues.filter(i => i.sprintId === sprintId);
  const incompleteCount = sprintIssues.filter(i => i.status !== 'done').length;

  sprint.status = 'completed';
  sprint.endDate = new Date().toISOString();

  data.issues.forEach(issue => {
    if (issue.sprintId === sprintId && issue.status !== 'done') {
      issue.sprintId = undefined;
      issue.status = 'backlog';
    }
  });

  saveData(data);
  logActivity(
    'sprint_completed',
    actorId,
    `completed sprint "${sprint.name}" — ${incompleteCount} issue(s) returned to backlog`,
    undefined,
    sprintId
  );
};

// ── Invitations ───────────────────────────────────────────────────────────

export const addInvitation = (invitation: Invitation): void => {
  const data = getData();
  data.invitations.push(invitation);
  saveData(data);
  const actorId = getCurrentUser()?.id ?? 'admin-1';
  logActivity('user_invited', actorId, `invited ${invitation.email} as ${invitation.role}`);
};

// ── Project ───────────────────────────────────────────────────────────────

export const updateProject = (updates: Partial<Project>): void => {
  const data = getData();
  data.project = { ...data.project, ...updates };
  saveData(data);
};

// ── Comments ──────────────────────────────────────────────────────────────

export const addComment = (issueId: string, userId: string, text: string): void => {
  const data = getData();
  const issue = data.issues.find(i => i.id === issueId);
  if (!issue) return;

  const comment: Comment = {
    id: `comment-${Date.now()}`,
    userId,
    text,
    createdAt: new Date().toISOString(),
  };
  issue.comments.push(comment);
  issue.updatedAt = new Date().toISOString();
  saveData(data);
  logActivity('comment_added', userId, `commented on ${issue.key}`, issueId);
};

// ── Work Logs ─────────────────────────────────────────────────────────────

export const addWorkLog = (
  issueId: string,
  userId: string,
  timeSpent: number,
  description: string
): void => {
  const data = getData();
  const issue = data.issues.find(i => i.id === issueId);
  if (!issue) return;

  const workLog: WorkLog = {
    id: `worklog-${Date.now()}`,
    userId,
    timeSpent,
    description,
    createdAt: new Date().toISOString(),
  };
  issue.workLogs = issue.workLogs ?? [];
  issue.workLogs.push(workLog);
  issue.updatedAt = new Date().toISOString();
  saveData(data);
  logActivity('work_logged', userId, `logged ${timeSpent}h on ${issue.key}`, issueId);
};

// ── Issue Links ───────────────────────────────────────────────────────────

export const addIssueLink = (
  issueId: string,
  targetIssueId: string,
  linkType: IssueLink['type']
): void => {
  const data = getData();
  const issue = data.issues.find(i => i.id === issueId);
  if (!issue) return;

  issue.links = issue.links ?? [];
  // Prevent duplicate links
  const exists = issue.links.some(
    l => l.targetIssueId === targetIssueId && l.type === linkType
  );
  if (exists) return;

  const link: IssueLink = {
    id: `link-${Date.now()}`,
    type: linkType,
    targetIssueId,
  };
  issue.links.push(link);
  issue.updatedAt = new Date().toISOString();
  saveData(data);
};

export const removeIssueLink = (issueId: string, linkId: string): void => {
  const data = getData();
  const issue = data.issues.find(i => i.id === issueId);
  if (!issue?.links) return;
  issue.links = issue.links.filter(l => l.id !== linkId);
  issue.updatedAt = new Date().toISOString();
  saveData(data);
};

// ── Attachments ───────────────────────────────────────────────────────────

export const addAttachment = (issueId: string, userId: string, file: File): Promise<void> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const data = getData();
      const issue = data.issues.find(i => i.id === issueId);
      if (!issue) { reject(new Error('Issue not found')); return; }

      const attachment: Attachment = {
        id: `attachment-${Date.now()}`,
        name: file.name,
        size: file.size,
        type: file.type,
        data: reader.result as string,
        uploadedBy: userId,
        uploadedAt: new Date().toISOString(),
      };
      issue.attachments = issue.attachments ?? [];
      issue.attachments.push(attachment);
      issue.updatedAt = new Date().toISOString();
      saveData(data);
      logActivity('file_attached', userId, `attached "${file.name}" to ${issue.key}`, issueId);
      resolve();
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

export const removeAttachment = (issueId: string, attachmentId: string): void => {
  const data = getData();
  const issue = data.issues.find(i => i.id === issueId);
  if (!issue?.attachments) return;
  issue.attachments = issue.attachments.filter(a => a.id !== attachmentId);
  issue.updatedAt = new Date().toISOString();
  saveData(data);
};