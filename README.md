# Cinemora Studios — Agency Workspace

A premium internal project and deliverable management workspace built for **Cinemora Studios** (`cinemorastudios.agency`). Engineered with React 19, TypeScript, Vite, and Tailwind CSS. Supports sprint milestones, Kanban workflow boards with drag-and-drop, role-based access permissions, hour tracking, deliverable links, file asset attachments, and live activity feeds.

---

## Brand & Design System

The application is styled with Cinemora Studios' bespoke dark green design system:

| Token | Hex Value | Application |
|---|---|---|
| Main Background | `#101914` | Primary viewport background |
| Elevated Surface | `#17231B` | Sidebar, top header, column containers |
| Cards & Panels | `#1B2B21` | Deliverable cards, metrics widgets |
| Borders | `#304A39` | Dividers, card boundaries, input strokes |
| Primary Accent | `#B8F28B` | Active highlights, primary CTA buttons |
| Secondary Accent | `#77C98A` | Badges, sub-headings, indicators |
| Primary Text | `#E9F5E9` | High-contrast body and title typography |
| Muted Text | `#A7BDAA` | Captions, timestamps, secondary labels |

---

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run TypeScript typecheck
npx tsc --noEmit

# Build production bundle (inlined static HTML)
npm run build

# Preview production build locally
npm run preview
```

---

## Architecture & Authentication Notice

- **Architecture:** Client-side static single-page application built with Vite and React 19.
- **Persistence:** All workspace state (deliverables, sprints, user profiles, invitations, activity history) is persisted in browser `localStorage`.
- **Authentication:** Sessions and accounts are managed through client-side state. Because credentials and data are stored in `localStorage` without a server-side authentication authority, this internal application is designed for client-side workspace operations. Credentials must not be committed to source control or exposed in public repositories.
- **Deployment:** Zero-dependency static build produced in `dist/index.html` via `vite-plugin-singlefile`, suitable for Vercel, Cloudflare Pages, Netlify, or any static hosting provider.

---

## Core Features

### 1. Deliverable & Issue Management
- Create deliverables with types (Task, Story, Bug, Epic), priority (Lowest → Highest), and status (Backlog → To Do → In Progress → In Review → Done).
- Full 5-tab detail view: Details, Comments, Work Logs, Links, File Attachments.
- Auto-save on blur for inline editing.
- Time estimates, labels, and assignee attribution.

### 2. Kanban Workflow Board
- Scoped to active sprint milestones.
- Smooth drag-and-drop via `@dnd-kit` with `DragOverlay` ghost rendering.
- Role-based permissions: Admins can move any card; team members move tasks assigned to them.

### 3. Sprint Planning & Backlog
- Create and organize sprint iterations with start dates, end dates, and goals.
- Single-click hover assignment between backlog and active/planned sprints.
- Automatic roll-over of incomplete items upon sprint completion.

### 4. Operations Dashboard & Analytics
- Visual metrics breakdown across deliverable statuses and types.
- Active sprint completion progress and velocity gauges.
- Team capacity and assigned workload breakdown.
- Recently updated items audit feed.

### 5. Collaboration & Activity Audit Trail
- Multi-member discussions on deliverables.
- Hour logging with work descriptions and cumulative totals.
- Complete activity feed tracking creations, reassignments, status changes, and sprint events.

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `⌘K` / `Ctrl+K` | Open global search overlay |
| `C` | Quick create task / deliverable |
| `Esc` | Dismiss active modal or overlay |
| `Enter` | Submit active comment |
| `Tab` | Navigate between form fields |

---

## Official Domain
[cinemorastudios.agency](https://www.cinemorastudios.agency)