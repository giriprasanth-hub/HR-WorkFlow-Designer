# HR Workflow Designer

> A visual, drag-and-drop HR workflow builder built with **React + React Flow** for the Tredence Analytics prototype challenge.

---

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Folder Structure](#folder-structure)
4. [How to Run](#how-to-run)
5. [Feature Walkthrough](#feature-walkthrough)
6. [Design Decisions](#design-decisions)
7. [Mock API Layer](#mock-api-layer)
8. [Workflow Validation](#workflow-validation)
9. [Assumptions](#assumptions)
10. [What's Completed vs. What Would Be Added](#whats-completed-vs-what-would-be-added)

---

## Overview

The HR Workflow Designer is an interactive, visual canvas where HR administrators can:

- **Design** internal HR processes (Onboarding, Leave Approval, Document Verification, etc.)
- **Configure** each step using type-specific node forms
- **Simulate** the workflow to see a step-by-step execution log
- **Export/Import** workflows as JSON for sharing or persistence

**Tech Stack:** React 19 · TypeScript · Vite · React Flow 11 · Zustand · Zod · React Hook Form · MSW · Tailwind CSS

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     App (ReactFlowProvider)              │
│                                                         │
│  ┌────────────┐   ┌──────────────────┐   ┌───────────┐  │
│  │  Sidebar   │   │  WorkflowCanvas  │   │  NodeForm │  │
│  │  (dark)    │   │  (ReactFlow)     │   │  Panel    │  │
│  │  - Palette │   │  - Drag & Drop   │   │  - Forms  │  │
│  │  - Actions │   │  - Edge Connect  │   │  - KVEdit │  │
│  └────────────┘   │  - Delete / KB   │   │  - Dynami │  │
│                   └──────────────────┘   └───────────┘  │
│                            ▲                             │
│                   ┌────────┴───────┐                     │
│                   │  SandboxPanel  │                     │
│                   │  (Test/Sim)    │                     │
│                   └────────────────┘                     │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │                  Zustand Store                   │   │
│  │  nodes | edges | selectedNodeId                  │   │
│  │  addNode | updateNode | deleteNode               │   │
│  │  importWorkflow | clearCanvas                    │   │
│  └──────────────────────────────────────────────────┘   │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Mock API (MSW)                      │   │
│  │  GET  /api/automations → fixtures                │   │
│  │  POST /api/simulate   → simulateGraph()          │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

**Key Architecture Principles:**
- **Separation of concerns** — canvas logic, node logic, form logic, and API logic are in distinct folders
- **Registry pattern** — `nodeRegistry.ts` is the single source of truth for all node types, enabling easy extensibility
- **Custom hooks** — `useWorkflowValidation` and `useSimulate` keep UI components lean
- **Type-safe graph** — discriminated union `ExtendedNodeData` ensures each node type has the correct shape

---

## Folder Structure

```
src/
├── api/
│   ├── browser.ts          # MSW worker setup
│   ├── fixtures.ts         # Mock automation definitions
│   ├── handlers.ts         # MSW route handlers
│   └── simulate.ts         # Graph simulation (BFS traversal)
│
├── components/
│   ├── canvas/
│   │   ├── WorkflowCanvas.tsx  # ReactFlow canvas + drag/drop
│   │   └── Sidebar.tsx         # Node palette + actions
│   ├── forms/
│   │   ├── NodeFormPanel.tsx   # Right-side configuration panel
│   │   ├── KeyValueEditor.tsx  # Reusable KV pair editor
│   │   ├── DynamicParamsForm.tsx # Dynamic params by action
│   │   └── schemas.ts          # Zod validation schemas
│   ├── nodes/
│   │   ├── Nodes.tsx           # Visual node components
│   │   └── nodeRegistry.ts     # Node type → component/schema/defaults
│   └── sandbox/
│       └── TestPanel.tsx       # Workflow simulation panel
│
├── hooks/
│   ├── useWorkflowValidation.ts  # Graph validation (cycle, orphan, etc.)
│   └── useSimulate.ts            # API call management for simulation
│
├── store/
│   └── workflowStore.ts          # Zustand global state
│
├── types/
│   └── workflow.types.ts         # TypeScript types/interfaces
│
├── App.tsx
├── main.tsx
└── index.css                     # Global design system + CSS variables
```

---

## How to Run

### Prerequisites
- Node.js ≥ 18
- npm

### Installation & Start

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev
```

> **Note:** The MSW service worker must register successfully for the Mock API to work. The browser console will show `[MSW] Mocking enabled` on first load.

### Production Build

```bash
npm run build
npm run preview
```

---

## Feature Walkthrough

### 1. Building a Workflow

| Action | How |
|---|---|
| Add a node | Drag any item from the left sidebar onto the canvas |
| Connect nodes | Hover over a node to reveal handles, drag to another node |
| Select a node | Click it to open the right configuration panel |
| Delete a node | Select it and press `Delete` / `Backspace`, or click 🗑 in the panel |
| Delete an edge | Select the edge row and press `Delete` |

### 2. Node Types & Required Fields

| Node | Fields |
|---|---|
| **Start** | Title, Metadata (key-value pairs) |
| **Task** | Title, Description, Assignee, Due Date, Custom Fields (KV) |
| **Approval** | Title, Approver Role (Manager / HRBP / Director), Auto-approve threshold |
| **Automated** | Title, Action (from API), Dynamic action parameters |
| **End** | Title, End Message, Generate Summary toggle |

### 3. Simulating / Testing

Click **Test Workflow** (bottom-right button).

The panel will:
1. Display any **validation errors** (missing Start/End, orphan nodes, cycles)
2. Run the mock `/api/simulate` endpoint
3. Show a step-by-step **execution timeline** with status badges (SUCCESS / FAILED / PENDING)
4. Summarise total pass/fail counts

### 4. Export / Import JSON

- **Export**: Click **Export JSON** in the sidebar → downloads `hr-workflow-<timestamp>.json`
- **Import**: Click **Import JSON** → select a previously exported file → canvas restores

---

## Design Decisions

### State Management — Zustand
Zustand was chosen over Redux for its minimal boilerplate and React 18+ compatibility. The store holds `nodes`, `edges`, and `selectedNodeId` as the complete source of truth.

### Node Registry Pattern
`nodeRegistry.ts` maps each `NodeType` to its _React component_, _default data_, _Zod schema_, _color_, and _label_. Adding a new node type requires updating only this file — no changes to canvas logic or routing.

### Form Strategy — Controlled Local State
Forms use local `useState` (not `react-hook-form` subscriptions) and sync to the store on every change via `useEffect`. This avoids stale closure issues when switching between selected nodes and keeps each form remounted (via `key={selectedNode.id}`) for clean state.

### Mock API — MSW (Mock Service Worker)
MSW intercepts actual `fetch()` calls at the Service Worker level, making the mock layer indistinguishable from a real backend. This is the industry-standard approach for frontend prototype testing.

### Simulation — BFS Topological Traversal
The `/api/simulate` handler performs a true BFS traversal of the graph starting from zero-in-degree nodes (Start nodes), respecting edge order. This correctly handles multi-path workflows, unlike the original linear array walk.

### Validation
`useWorkflowValidation` is a pure computational hook (no side effects) that derives errors directly from `nodes` and `edges` state. It detects:
- Missing Start / End node
- Start node with incoming edges
- Orphan nodes (no connections)
- Cycles (DFS-based detection)

---

## Mock API Layer

### `GET /api/automations`

Returns available automation actions for **Automated Step** nodes:

```json
[
  { "id": "send_email",    "label": "Send Email",         "params": ["to", "subject", "body"] },
  { "id": "generate_doc",  "label": "Generate Document",  "params": ["template", "recipient"] },
  { "id": "update_db",     "label": "Update DB Record",   "params": ["table", "recordId", "data"] },
  { "id": "slack_msg",     "label": "Slack Notification", "params": ["channel", "message"] }
]
```

### `POST /api/simulate`

Accepts the serialized workflow graph and returns a step-by-step execution log.

**Request:**
```json
{ "nodes": [...], "edges": [...] }
```

**Response:**
```json
{
  "success": true,
  "logs": [
    { "stepId": "abc", "title": "Start", "status": "SUCCESS", "log": "Workflow initiated." },
    { "stepId": "def", "title": "Collect Docs", "status": "SUCCESS", "log": "Task assigned to HR Team." }
  ]
}
```

---

## Workflow Validation

The validator (in `src/hooks/useWorkflowValidation.ts`) runs on every render and returns a list of `{ nodeId, message, severity }` objects displayed in the Sandbox Panel before simulation.

| Check | Severity |
|---|---|
| No Start node | Error |
| More than one Start node | Warning |
| Start node has incoming edges | Error |
| No End node | Error |
| Node has zero connections | Warning |
| Graph contains a cycle | Error |

---

## Assumptions

1. **No authentication or backend persistence** — all state is in-memory as per spec.
2. **MSW service worker** must be at `/mockServiceWorker.js` (served from `public/`). This file is generated by `npx msw init public/`.
3. The **BFS simulation** assumes a DAG (Directed Acyclic Graph). Cycles are flagged but not executed.
4. Export/Import uses the full Zustand store shape (React Flow `Node` + `Edge` objects) — this is the "workflow JSON schema".
5. The UI is designed for **desktop** screens (HR admin context). Tablet/mobile layout was deprioritised per the focus-on-functionality brief.

---

## What's Completed vs. What Would Be Added

### ✅ Completed
- All 5 node types with full configuration forms
- Drag-and-drop canvas (React Flow)
- Edge connection with smoothstep rendering
- Keyboard delete of selected nodes
- Mock API: GET /automations + POST /simulate
- BFS topological simulation traversal
- Workflow validation (orphans, cycles, missing nodes)
- Export / Import JSON
- Dynamic action parameter forms
- Key-value pair editors (metadata, custom fields)
- Rich visual node design with gradient headers
- Dark sidebar with live node/edge counters
- MiniMap with color-coded nodes
- Empty canvas placeholder

### 🔜 Would Add With More Time
- **Undo / Redo** — via zustand-middleware or immer patches
- **Node version history** — store previous data snapshots per node
- **Auto-layout** — dagre or ELK.js for one-click graph arrangement
- **Workflow validation errors shown on canvas** — red outline + tooltip directly on the node
- **Node templates** — pre-built workflow templates (Onboarding, Leave Approval)
- **Real-time collaboration** — Yjs + WebSocket for multi-user editing
- **Backend persistence** — REST or GraphQL to save workflows to a database
- **Workflow versioning** — tag and compare workflow versions
- **Conditional edges** — branching based on approval outcome (Approved / Rejected)
