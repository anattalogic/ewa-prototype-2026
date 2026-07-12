# EWA 3.0 2026 Enterprise UI Prototype — Design Philosophy

## Brand Essence
**What it is:** A unified enterprise SaaS portal for Earned Wage Access operations — replacing 8 legacy systems with one intelligent platform.
**Who it is for:** HR, Sales, Operations, Back Office, Finance, Risk, and Platform Admin teams.
**Why it is different:** Every screen adapts to the viewer's role. Same data, different lens. Workflow-driven, not page-driven.

**3 Personality Adjectives:** Authoritative · Transparent · Precision-engineered

## Design Movement
**Neobrutalist Fintech** — inspired by Bloomberg Terminal's information density combined with Stripe Dashboard's modern clarity. Raw data honesty meets refined enterprise polish.

## Core Principles
1. **Data First, Chrome Second** — Every pixel serves data comprehension. No decorative filler.
2. **Role Transparency** — The system never hides capability from the viewer; it adapts to their authority level.
3. **Workflow Continuity** — No dead ends. Every action leads to the next logical step.
4. **Audit by Design** — Every decision is traceable. Every change is visible.

## Color Philosophy
- **Primary:** Deep Navy (#1e3a5f) — Trust, authority, institutional stability
- **Accent:** Electric Teal (#0ea5e9) — Growth, technology, forward motion
- **Success:** Emerald (#10b981) — Approved, balanced, healthy
- **Warning:** Amber (#f59e0b) — Pending, attention needed, approaching threshold
- **Danger:** Crimson (#ef4444) — Rejected, overdue, critical
- **Neutral:** Slate (#64748b) — Labels, metadata, secondary information

## Layout Paradigm
**Command Center Layout** — A persistent left sidebar (collapsible) for module navigation, a top command bar for view switching and global actions, and a main content area that fills with the selected module's data. No centered layouts. Data tables dominate. Side sheets for detail views.

## Signature Elements
1. **Role Badge** — A colored pill in the top bar showing current view type (HR / Sales / Ops / Finance / Risk / Admin). Changes the entire portal's visible scope.
2. **Status Pills** — Color-coded status indicators on every data row (Pending=amber, Approved=green, Rejected=red, Posted=blue).
3. **Workflow Progress Bar** — A horizontal step indicator showing pipeline stages with maker-checker labels.

## Interaction Philosophy
Hover states reveal secondary actions. Click opens side sheets (not new pages). Bulk selection activates contextual action bars. Every destructive action requires confirmation. Every approval requires a comment.

## Animation
- Subtle fade-in for data loading (300ms)
- Slide-in from right for side sheets (250ms)
- Pulse on new notifications (1s, then settles)
- Number counting animation for KPI cards (500ms)
- Smooth state transitions for status badge changes

## Typography System
- **Display:** `Inter` 700 (bold) for headers and KPI values
- **Body:** `Inter` 400 for table data and descriptions
- **Labels:** `Inter` 500 (medium) for field labels and badges
- **Mono:** `JetBrains Mono` for transaction IDs, GL codes, and audit timestamps
- Hierarchy: Page Title 24px → Section Title 18px → Table Header 13px (uppercase) → Body 14px → Caption 11px

## Brand Voice
**Headlines:** Direct, action-oriented, no fluff
**CTAs:** Specific verbs (Initiate, Verify, Approve, Export) not generic (Submit, Click)
**Microcopy:** Bilingual (English + Myanmar/Burmese), precise, error-specific

**Example lines:**
- "Initiate Repayment — Select a company and period to begin"
- "EWA-005: Amount exceeds available limit of 500,000 MMK."

## Wordmark & Logo
Bold geometric shield symbol combining an upward arrow and clock motif — represents trust, growth, and timely access. Color: Deep Navy (#1e3a5f) with Teal accent (#0ea5e9). Used at 32px in sidebar and as favicon.

## Signature Brand Color
**Deep Navy (#1e3a5f)** — The unmistakable EWA color. Used in the sidebar background, primary buttons, header branding, and active navigation states. Every user instantly associates this color with the platform.

## Style Decisions
- All data tables use zebra striping (subtle grey on even rows)
- KPI cards have a thin top border in their status color (green/amber/red/blue)
- Side sheets slide from right with a dark overlay
- Filter bars are always visible above data tables
- Every module page has a consistent breadcrumb: Portal > Module > Sub-module
- Number formatting: MMK uses comma separators (1,000,000 MMK)
- Dates use format: DD/MM/YYYY
- GL account codes use monospace font
