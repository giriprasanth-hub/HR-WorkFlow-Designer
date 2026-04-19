# HR Workflow Designer

## What is this project?
The HR Workflow Designer is an interactive, visual drag-and-drop web application that allows Human Resource professionals to design, visualize, and configure internal HR processes. Built with React and ReactFlow, it provides a canvas where users can compose node-based workflows representing tasks, approvals, automated actions, and state transitions.

## Why this project?
HR processes like Employee Onboarding, Leave Approvals, Performance Reviews, and Offboarding can often become opaque, decentralized, or confusing when tracked purely on spreadsheets or email threads. This visual designer solves that problem by:
- **Clarifying Processes**: Visual flowcharts instantly communicate the order of operations to all stakeholders.
- **Configurability**: Allows non-technical business users to drag-and-drop elements and define properties such as Task Assignees, specific Approver Roles (e.g. Manager, HRBP, Director), and specific Automated webhook triggers without writing code.
- **Single Source of Truth**: Provides a standardized, structured JSON-based blueprint for how an organization wants a workflow to execute.

## Where to use?
This application is designed to serve as the frontend administration layer (or "Workflow Builder") of an HR Management System (HRMS). It can be embedded within:
- **Internal Company Portals**: Where HR administrators map out the standard operating procedures.
- **Applicant Tracking Systems (ATS)**: To define the steps tracking a candidate moving efficiently through interview rounds.
- **Compliance & Auditing Environments**: To define strict step-by-step clearance protocols.

## How to use this project?

### Initial Setup
Ensure you have Node.js and `npm` installed. From your terminal, navigate to the project root directory and run:

```bash
# Install all dependencies
npm install

# Start the local development server (typically available at http://localhost:5173/)
npm run dev
```

### Usage Instructions
1. **Adding Nodes**: Drag workflow steps from the Left Sidebar (e.g., Start, Task, Approval, Automated, End) and drop them onto the central canvas grid.
2. **Connecting Nodes**: Hover over a node to reveal connection handles, then click and drag a line to another node to establish a directional flow (e.g., "Start -> HR Approval -> End").
3. **Configuring Properties**: Click on any node on the canvas to open the Properties Panel on the right side. From here, you can:
   - Provide custom Titles (`"Initial Phone Screen"`)
   - Assign Tasks to specific parties (e.g., `"Recruiting Team"`)
   - Specify required Approver Roles
   - Select Automated Actions (e.g., system emails)
4. **Testing Workflows**: Utilize the "Sandbox Panel" (if active) or review the raw generated state to test how your configured workflow JSON translates.


