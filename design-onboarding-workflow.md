# Employee Onboarding & Enterprise Workflow — Enhancement Design

## A. Employee Onboarding Module (Enhanced)

### Current State
- Only Company Onboarding Pipeline (5-stage table)
- No single employee add form
- No bulk import wizard
- No column mapping
- No diff preview / correct-incorrect trace
- No history tracking

### Target State

The module will have 3 tabs: **Tasks** | **Requests** | **History**

#### Tab 1: Tasks (Pending Actions)
- Employee import batch approvals pending
- Individual employee verification queue
- Budget request approvals triggered by onboarding overflow

#### Tab 2: Requests (Active Workflow Items)
- Active import batches with status (Parsing → Column Mapping → Preview → Validation → Maker Submit → Checker Approve)
- Individual employee add requests
- Show current state, owner, SLA expiry, next action

#### Tab 3: History (Completed)
- All past import batches with results (new/modified/missing counts)
- Individual employee onboarding history
- Full audit trail

### Import Wizard (6 Steps)

**Step 1: Upload File** — Drag-drop .xlsx/.xls/.csv, max 10MB, max 10,000 rows

**Step 2: Column Mapping** — Auto-detect headers, drag-drop to map:
- Required: employee_code, name, phone, salary
- Optional: nrc, department, position, branch_code, join_date

**Step 3: Data Preview** — Full table preview with all rows

**Step 4: Diff Engine Validation** — Color-coded categorization:
- Green (NEW): Not in DB → will insert
- Yellow (MODIFIED): Changed fields → will update with effective-dated history
- Red (MISSING): In DB but not in file → flag for decision
- Grey (UNCHANGED): No change → no action

**Step 5: Maker Submit** — Review summary, submit for checker approval

**Step 6: Checker Approve** — Different user reviews diff, handles missing employees (Freeze/Suspend/Ignore), approves or rejects with reason

### Single Employee Add
- Form with all fields (Personal, Employment, Payroll, Budget)
- Real-time validation (duplicate employee_code, NRC, salary > 0)
- Auto-calculates EWA cap from salary
- Budget eligibility check with overflow request if needed

### Correct/Incorrect Trace
- After validation, show:
  - Correct rows (green) with count
  - Incorrect rows (red) with specific error per field
  - Warning rows (yellow) with soft validation issues
  - Ability to correct inline or download error report

### History
- Import batch timeline: who uploaded, when, how many rows
- Correct/incorrect counts per batch
- Checker decisions with reasons
- Audit log of all actions

---

## B. Enterprise Workflow Module (Unified)

### Current State
- Only a flat "Active Cases" table with 5 rows
- No tabs, no detail panel, no state machine visualization
- No task/request distinction
- No SLA visualization
- No activity timeline

### Target State

3 tabs: **Requests** | **Tasks** | **History**

#### Tab 1: Requests (All Workflow Requests)
Shows ALL workflow requests across the platform:
- Company Onboarding requests
- Employee Import batch requests
- Employee Verification requests
- Budget Adjustment requests
- Settlement requests
- Write-off requests

Each row shows:
- Case ID (e.g., EWF-001)
- Request Type
- Subject / Entity
- Current State
- State Owner (who owns this step)
- SLA Timer (with visual countdown)
- Created / Updated
- Priority

Clicking a row opens a **detail panel** (side sheet) showing:
- **State Machine Visualization**: visual stepper showing all states, current state highlighted, completed states green, future states grey
- **Current Owner**: who is responsible now
- **SLA Status**: time remaining, overdue indicator
- **Actions**: Approve, Reject, Return, Escalate (role-based)
- **Related Records**: linked employees, companies, transactions

#### Tab 2: Tasks (My Work Items)
Shows tasks assigned to the current user:
- **My Work**: Directly assigned
- **Team Queue**: Assigned to role/department
- **Pending**: Open tasks awaiting action
- **Waiting Me**: Cases blocked by current user
- **Waiting Others**: Cases owned by another team
- **Overdue**: SLA breached (red)
- **Completed**: Finished tasks

Each task shows:
- Task ID
- Case ID (parent)
- Step Name
- Owner
- SLA Due Date (with countdown timer)
- Escalation Level
- Priority

Actions per task: Claim, Complete, Delegate, Escalate

#### Tab 3: History (Full Audit Trail)
Complete timeline for any selected case:
- Every activity with type (Created, Approved, Rejected, Returned, Escalated, etc.)
- Who performed the action
- When (timestamp)
- What was done
- Comments/reasons
- State transitions (from → to)
- Document uploads
- API calls

### Case Detail Panel (Side Sheet)
When clicking any request/case, opens a full detail panel with:
1. **Header**: Case ID, Type, Priority, Current Status
2. **State Machine**: Visual stepper showing all workflow states
3. **Current Step**: Who owns it, SLA deadline, actions available
4. **Documents**: All attached documents with version history
5. **Timeline**: Full activity log (clickable, chronological)
6. **Related Cases**: Links to parent/child cases
7. **Activity Table**: Filterable by type, date, actor

### SLA Visualization
- Progress bar showing SLA countdown
- Color coding: Green (>50%), Yellow (<50%), Red (<25% or overdue)
- Escalation level indicator (0-3 levels)

### Workflow States (Universal)
```
Draft → Submitted → Checking → Waiting_Document → Checking → Risk_Review → Credit_Review → Finance_Review → Approved → Completed → Closed
                                      ↓                                                                                           ↓
                                 Returned                                                                                     Rejected
                                                                                                  Cancelled
```

---

## C. Integration Points

### Onboarding ↔ Workflow
- Every import batch creates a workflow case
- Employee add creates a verification case
- Budget overflow from onboarding creates a budget request case
- All linked together in the unified workflow view

### Verification → Budget Approval
- Employee onboarding triggers budget eligibility check
- If budget overflow → auto-create Budget Request case
- Budget Request goes through HR → Risk → Finance approval
- Employee status stays "Approved" until budget approved
- Then moves to "Active"

---

## D. New Mock Data Types Needed

```typescript
// Workflow Case
interface WorkflowCase {
  id: string;
  type: "employee_import" | "employee_verification" | "budget_request" | "company_onboarding" | "settlement" | "writeoff";
  title: string;
  status: string;
  currentStep: string;
  currentOwner: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  createdAt: string;
  updatedAt: string;
  slaDueAt: string;
  slaRemaining: string;
  escalationLevel: number;
  relatedId?: string;
}

// Workflow State Machine
interface WorkflowStateMachine {
  states: string[];
  currentState: string;
  transitions: { from: string; to: string; action: string }[];
}

// Work Item (Task)
interface WorkItem {
  id: string;
  caseId: string;
  caseTitle: string;
  stepName: string;
  ownerType: "user" | "role" | "queue";
  ownerId: string;
  ownerName: string;
  status: "Pending" | "Assigned" | "InProgress" | "Completed" | "Escalated" | "Overdue";
  priority: string;
  slaDueAt: string;
  escalationLevel: number;
}

// Activity Timeline
interface Activity {
  id: string;
  caseId: string;
  type: string;
  actor: string;
  action: string;
  timestamp: string;
  details?: string;
  fromState?: string;
  toState?: string;
}

// Import Batch
interface ImportBatch {
  id: string;
  fileName: string;
  uploadedBy: string;
  uploadedAt: string;
  totalRows: number;
  status: string;
  newCount: number;
  modifiedCount: number;
  missingCount: number;
  unchangedCount: number;
  correctCount: number;
  incorrectCount: number;
  columnMapping: { fileColumn: string; systemField: string }[];
  checkerId?: string;
  checkedAt?: string;
}

// Import Row (for preview)
interface ImportRow {
  id: number;
  category: "new" | "modified" | "missing" | "unchanged";
  validation: "correct" | "incorrect" | "warning";
  data: Record<string, string>;
  errors: string[];
  warnings: string[];
}
```
