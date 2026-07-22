This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

```
fe_chatbot_website
├─ .sixth
│  └─ skills
│     ├─ 00_README_READ_ORDER.md
│     ├─ 01_PROJECT_UI_DIRECTION.md
│     ├─ 02_DESIGN_SYSTEM_TOKENS.md
│     ├─ 03_LAYOUT_RULES_AND_PATTERNS.md
│     ├─ 04_COMPONENT_AND_STATE_STANDARDS.md
│     ├─ 05_RESPONSIVE_ACCESSIBILITY_AND_PRODUCTION.md
│     ├─ 06_CODEX_MASTER_PROMPT.md
│     └─ 07_FINAL_REVIEW_CHECKLIST.md
├─ AGENTS.md
├─ app
│  ├─ (client)
│  │  ├─ chatbot
│  │  │  └─ page.tsx
│  │  ├─ faqchat
│  │  │  └─ page.tsx
│  │  ├─ layout.tsx
│  │  ├─ orderhistory
│  │  │  └─ page.tsx
│  │  └─ page.tsx
│  ├─ Admin
│  │  ├─ Accounts
│  │  │  ├─ components
│  │  │  │  ├─ AccountActionBar.tsx
│  │  │  │  ├─ AccountDesktopRow.tsx
│  │  │  │  ├─ AccountDetailPanel.tsx
│  │  │  │  ├─ accountHelpers.ts
│  │  │  │  ├─ AccountMobileCard.tsx
│  │  │  │  ├─ AccountMobileList.tsx
│  │  │  │  ├─ AccountProfileCard.tsx
│  │  │  │  ├─ AccountRelatedDataCard.tsx
│  │  │  │  ├─ AccountStatusCard.tsx
│  │  │  │  ├─ AccountTable.tsx
│  │  │  │  ├─ AccountTableDesktop.tsx
│  │  │  │  ├─ mockData.ts
│  │  │  │  └─ types.ts
│  │  │  └─ page.tsx
│  │  ├─ Customers
│  │  │  ├─ component
│  │  │  └─ page.tsx
│  │  ├─ dashbroad
│  │  │  ├─ components
│  │  │  │  ├─ AuthLayout.tsx
│  │  │  │  ├─ dashboard
│  │  │  │  │  ├─ AdminShell.tsx
│  │  │  │  │  ├─ AdminSidebar.tsx
│  │  │  │  │  ├─ AdminTopbar.tsx
│  │  │  │  │  ├─ AiQualityCard.tsx
│  │  │  │  │  ├─ DashboardHeader.tsx
│  │  │  │  │  ├─ JobStatusDonutChart.tsx
│  │  │  │  │  ├─ KpiCard.tsx
│  │  │  │  │  ├─ KpiGrid.tsx
│  │  │  │  │  ├─ LiveJobsTable.tsx
│  │  │  │  │  ├─ mockData.ts
│  │  │  │  │  ├─ OnlineTechniciansTable.tsx
│  │  │  │  │  ├─ RecentActivityTimeline.tsx
│  │  │  │  │  ├─ RevenueLineChart.tsx
│  │  │  │  │  ├─ status.ts
│  │  │  │  │  ├─ SystemStatusBanner.tsx
│  │  │  │  │  ├─ TopDeviceBarChart.tsx
│  │  │  │  │  └─ types.ts
│  │  │  │  ├─ LoginForm.tsx
│  │  │  │  ├─ LogoHeader.tsx
│  │  │  │  └─ RoleTabs.tsx
│  │  │  └─ page.tsx
│  │  └─ technicians
│  │     ├─ components
│  │     │  ├─ mockData.ts
│  │     │  ├─ TechnicianExpandedPanel.tsx
│  │     │  ├─ TechnicianFilters.tsx
│  │     │  ├─ TechnicianHeader.tsx
│  │     │  ├─ TechnicianKpiGrid.tsx
│  │     │  ├─ TechnicianPagination.tsx
│  │     │  ├─ TechnicianStatusBadge.tsx
│  │     │  ├─ TechnicianTable.tsx
│  │     │  ├─ types.ts
│  │     │  └─ utils.ts
│  │     └─ page.tsx
│  ├─ auth
│  │  ├─ forgot-password
│  │  │  └─ page.tsx
│  │  ├─ Login
│  │  │  └─ page.tsx
│  │  └─ Register
│  │     └─ page.tsx
│  ├─ components
│  │  ├─ bottomnavComponents.tsx
│  │  ├─ inputComponents.tsx
│  │  └─ navbarComponents.tsx
│  ├─ config
│  │  └─ routes.ts
│  ├─ favicon.ico
│  ├─ globals.css
│  ├─ image
│  │  └─ logo6.webp
│  └─ layout.tsx
├─ CLAUDE.md
├─ eslint.config.mjs
├─ logo.png
├─ middleware.ts
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ public
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ next.svg
│  ├─ vercel.svg
│  └─ window.svg
├─ README.md
└─ tsconfig.json

```
```
fe_chatbot_website
├─ .sixth
│  └─ skills
│     ├─ 00_README_READ_ORDER.md
│     ├─ 01_PROJECT_UI_DIRECTION.md
│     ├─ 02_DESIGN_SYSTEM_TOKENS.md
│     ├─ 03_LAYOUT_RULES_AND_PATTERNS.md
│     ├─ 04_COMPONENT_AND_STATE_STANDARDS.md
│     ├─ 05_RESPONSIVE_ACCESSIBILITY_AND_PRODUCTION.md
│     ├─ 06_CODEX_MASTER_PROMPT.md
│     └─ 07_FINAL_REVIEW_CHECKLIST.md
├─ AGENTS.md
├─ app
│  ├─ (client)
│  │  ├─ chatbot
│  │  │  └─ page.tsx
│  │  ├─ faqchat
│  │  │  └─ page.tsx
│  │  ├─ layout.tsx
│  │  ├─ orderhistory
│  │  │  └─ page.tsx
│  │  └─ page.tsx
│  ├─ Admin
│  │  ├─ Accounts
│  │  │  ├─ components
│  │  │  │  ├─ actions
│  │  │  │  │  ├─ AccountActionBar.tsx
│  │  │  │  │  ├─ AccountActionButton.tsx
│  │  │  │  │  ├─ AccountActionGroup.tsx
│  │  │  │  │  ├─ AccountActionLink.tsx
│  │  │  │  │  └─ AccountConfirmActionDialog.tsx
│  │  │  │  ├─ detail-panel
│  │  │  │  │  ├─ AccountDetailPanel.tsx
│  │  │  │  │  ├─ AccountGpsCard.tsx
│  │  │  │  │  ├─ AccountProfileCard.tsx
│  │  │  │  │  ├─ AccountRelatedDataCard.tsx
│  │  │  │  │  ├─ AccountStatusCard.tsx
│  │  │  │  │  └─ AccountWarningCard.tsx
│  │  │  │  ├─ dialogs
│  │  │  │  │  ├─ AccountChangeRoleDialog.tsx
│  │  │  │  │  ├─ AccountDeleteGuardDialog.tsx
│  │  │  │  │  ├─ AccountLockDialog.tsx
│  │  │  │  │  ├─ AccountResetPasswordDialog.tsx
│  │  │  │  │  └─ AccountVerifyDialog.tsx
│  │  │  │  ├─ filters
│  │  │  │  │  ├─ AccountFilters.tsx
│  │  │  │  │  ├─ AccountRoleFilter.tsx
│  │  │  │  │  ├─ AccountSearchInput.tsx
│  │  │  │  │  ├─ AccountStatusFilter.tsx
│  │  │  │  │  └─ AccountVerifiedFilter.tsx
│  │  │  │  ├─ forms
│  │  │  │  │  ├─ AccountBaseFormFields.tsx
│  │  │  │  │  ├─ AccountCreateForm.tsx
│  │  │  │  │  ├─ AccountLocationFields.tsx
│  │  │  │  │  ├─ AccountPasswordFields.tsx
│  │  │  │  │  ├─ AccountRoleFields.tsx
│  │  │  │  │  └─ AccountUpdateForm.tsx
│  │  │  │  ├─ layout
│  │  │  │  │  ├─ AccountHeader.tsx
│  │  │  │  │  ├─ AccountKpiGrid.tsx
│  │  │  │  │  └─ AccountPageSection.tsx
│  │  │  │  ├─ logs
│  │  │  │  │  ├─ AccountAuditLogFilters.tsx
│  │  │  │  │  ├─ AccountAuditLogItem.tsx
│  │  │  │  │  └─ AccountAuditLogPanel.tsx
│  │  │  │  ├─ shared
│  │  │  │  │  ├─ AccountAvatar.tsx
│  │  │  │  │  ├─ AccountInfoRow.tsx
│  │  │  │  │  ├─ AccountOnlineDot.tsx
│  │  │  │  │  ├─ AccountRoleBadge.tsx
│  │  │  │  │  ├─ AccountStatusBadge.tsx
│  │  │  │  │  └─ AccountVerifiedBadge.tsx
│  │  │  │  └─ table
│  │  │  │     ├─ AccountDesktopRow.tsx
│  │  │  │     ├─ AccountEmptyState.tsx
│  │  │  │     ├─ AccountMobileCard.tsx
│  │  │  │     ├─ AccountMobileList.tsx
│  │  │  │     ├─ AccountTable.tsx
│  │  │  │     └─ AccountTableDesktop.tsx
│  │  │  ├─ create
│  │  │  │  └─ page.tsx
│  │  │  ├─ data
│  │  │  │  └─ mockData.ts
│  │  │  ├─ lib
│  │  │  │  ├─ accountConstants.ts
│  │  │  │  ├─ accountFilters.ts
│  │  │  │  ├─ accountHelpers.ts
│  │  │  │  └─ accountValidation.ts
│  │  │  ├─ page.tsx
│  │  │  ├─ types
│  │  │  │  └─ account.types.ts
│  │  │  └─ [id]
│  │  │     ├─ edit
│  │  │     │  └─ page.tsx
│  │  │     ├─ logs
│  │  │     │  └─ page.tsx
│  │  │     └─ page.tsx
│  │  ├─ dashbroad
│  │  │  ├─ components
│  │  │  │  ├─ AuthLayout.tsx
│  │  │  │  ├─ dashboard
│  │  │  │  │  ├─ AdminShell.tsx
│  │  │  │  │  ├─ AdminSidebar.tsx
│  │  │  │  │  ├─ AdminTopbar.tsx
│  │  │  │  │  ├─ AiQualityCard.tsx
│  │  │  │  │  ├─ DashboardHeader.tsx
│  │  │  │  │  ├─ JobStatusDonutChart.tsx
│  │  │  │  │  ├─ KpiCard.tsx
│  │  │  │  │  ├─ KpiGrid.tsx
│  │  │  │  │  ├─ LiveJobsTable.tsx
│  │  │  │  │  ├─ mockData.ts
│  │  │  │  │  ├─ OnlineTechniciansTable.tsx
│  │  │  │  │  ├─ RecentActivityTimeline.tsx
│  │  │  │  │  ├─ RevenueLineChart.tsx
│  │  │  │  │  ├─ status.ts
│  │  │  │  │  ├─ SystemStatusBanner.tsx
│  │  │  │  │  ├─ TopDeviceBarChart.tsx
│  │  │  │  │  └─ types.ts
│  │  │  │  ├─ LoginForm.tsx
│  │  │  │  ├─ LogoHeader.tsx
│  │  │  │  └─ RoleTabs.tsx
│  │  │  └─ page.tsx
│  │  ├─ dispatch
│  │  │  ├─ components
│  │  │  │  ├─ DispatchDrawer.tsx
│  │  │  │  ├─ DispatchFilters.tsx
│  │  │  │  ├─ DispatchHeader.tsx
│  │  │  │  ├─ DispatchTable.tsx
│  │  │  │  ├─ mockData.ts
│  │  │  │  └─ types.ts
│  │  │  └─ page.tsx
│  │  └─ technicians
│  │     ├─ components
│  │     │  ├─ mockData.ts
│  │     │  ├─ TechnicianExpandedPanel.tsx
│  │     │  ├─ TechnicianFilters.tsx
│  │     │  ├─ TechnicianHeader.tsx
│  │     │  ├─ TechnicianKpiGrid.tsx
│  │     │  ├─ TechnicianPagination.tsx
│  │     │  ├─ TechnicianStatusBadge.tsx
│  │     │  ├─ TechnicianTable.tsx
│  │     │  ├─ types.ts
│  │     │  └─ utils.ts
│  │     └─ page.tsx
│  ├─ auth
│  │  ├─ forgot-password
│  │  │  └─ page.tsx
│  │  ├─ Login
│  │  │  └─ page.tsx
│  │  └─ Register
│  │     └─ page.tsx
│  ├─ components
│  │  ├─ bottomnavComponents.tsx
│  │  ├─ inputComponents.tsx
│  │  └─ navbarComponents.tsx
│  ├─ config
│  │  └─ routes.ts
│  ├─ favicon.ico
│  ├─ globals.css
│  ├─ image
│  │  └─ logo6.webp
│  └─ layout.tsx
├─ CLAUDE.md
├─ eslint.config.mjs
├─ logo.png
├─ middleware.ts
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ public
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ next.svg
│  ├─ vercel.svg
│  └─ window.svg
├─ README.md
└─ tsconfig.json

```
```
fe_chatbot_website
├─ .sixth
│  └─ skills
│     ├─ 00_README_READ_ORDER.md
│     ├─ 01_PROJECT_UI_DIRECTION.md
│     ├─ 02_DESIGN_SYSTEM_TOKENS.md
│     ├─ 03_LAYOUT_RULES_AND_PATTERNS.md
│     ├─ 04_COMPONENT_AND_STATE_STANDARDS.md
│     ├─ 05_RESPONSIVE_ACCESSIBILITY_AND_PRODUCTION.md
│     ├─ 06_CODEX_MASTER_PROMPT.md
│     └─ 07_FINAL_REVIEW_CHECKLIST.md
├─ AGENTS.md
├─ app
│  ├─ (client)
│  │  ├─ chatbot
│  │  │  └─ page.tsx
│  │  ├─ faqchat
│  │  │  └─ page.tsx
│  │  ├─ layout.tsx
│  │  ├─ orderhistory
│  │  │  └─ page.tsx
│  │  └─ page.tsx
│  ├─ Admin
│  │  ├─ Accounts
│  │  │  ├─ components
│  │  │  │  ├─ actions
│  │  │  │  │  ├─ AccountActionBar.tsx
│  │  │  │  │  ├─ AccountActionButton.tsx
│  │  │  │  │  ├─ AccountActionGroup.tsx
│  │  │  │  │  ├─ AccountActionLink.tsx
│  │  │  │  │  └─ AccountConfirmActionDialog.tsx
│  │  │  │  ├─ detail-panel
│  │  │  │  │  ├─ AccountDetailPanel.tsx
│  │  │  │  │  ├─ AccountGpsCard.tsx
│  │  │  │  │  ├─ AccountProfileCard.tsx
│  │  │  │  │  ├─ AccountRelatedDataCard.tsx
│  │  │  │  │  ├─ AccountStatusCard.tsx
│  │  │  │  │  └─ AccountWarningCard.tsx
│  │  │  │  ├─ dialogs
│  │  │  │  │  ├─ AccountChangeRoleDialog.tsx
│  │  │  │  │  ├─ AccountDeleteGuardDialog.tsx
│  │  │  │  │  ├─ AccountDetailModal.tsx
│  │  │  │  │  ├─ AccountLockDialog.tsx
│  │  │  │  │  ├─ AccountResetPasswordDialog.tsx
│  │  │  │  │  └─ AccountVerifyDialog.tsx
│  │  │  │  ├─ filters
│  │  │  │  │  ├─ AccountFilters.tsx
│  │  │  │  │  ├─ AccountRoleFilter.tsx
│  │  │  │  │  ├─ AccountSearchInput.tsx
│  │  │  │  │  ├─ AccountStatusFilter.tsx
│  │  │  │  │  └─ AccountVerifiedFilter.tsx
│  │  │  │  ├─ forms
│  │  │  │  │  ├─ AccountBaseFormFields.tsx
│  │  │  │  │  ├─ AccountCreateForm.tsx
│  │  │  │  │  ├─ AccountLocationFields.tsx
│  │  │  │  │  ├─ AccountPasswordFields.tsx
│  │  │  │  │  ├─ AccountRoleFields.tsx
│  │  │  │  │  └─ AccountUpdateForm.tsx
│  │  │  │  ├─ layout
│  │  │  │  │  ├─ AccountHeader.tsx
│  │  │  │  │  ├─ AccountKpiGrid.tsx
│  │  │  │  │  └─ AccountPageSection.tsx
│  │  │  │  ├─ logs
│  │  │  │  │  ├─ AccountAuditLogFilters.tsx
│  │  │  │  │  ├─ AccountAuditLogItem.tsx
│  │  │  │  │  └─ AccountAuditLogPanel.tsx
│  │  │  │  ├─ shared
│  │  │  │  │  ├─ AccountAvatar.tsx
│  │  │  │  │  ├─ AccountInfoRow.tsx
│  │  │  │  │  ├─ AccountOnlineDot.tsx
│  │  │  │  │  ├─ AccountRoleBadge.tsx
│  │  │  │  │  ├─ AccountStatusBadge.tsx
│  │  │  │  │  ├─ AccountVerifiedBadge.tsx
│  │  │  │  │  ├─ AdminPagination.tsx
│  │  │  │  │  └─ Pagination.tsx
│  │  │  │  └─ table
│  │  │  │     ├─ AccountDesktopRow.tsx
│  │  │  │     ├─ AccountEmptyState.tsx
│  │  │  │     ├─ AccountMobileCard.tsx
│  │  │  │     ├─ AccountMobileList.tsx
│  │  │  │     ├─ AccountTable.tsx
│  │  │  │     └─ AccountTableDesktop.tsx
│  │  │  ├─ create
│  │  │  │  └─ page.tsx
│  │  │  ├─ data
│  │  │  │  └─ mockData.ts
│  │  │  ├─ lib
│  │  │  │  ├─ accountConstants.ts
│  │  │  │  ├─ accountFilters.ts
│  │  │  │  ├─ accountHelpers.ts
│  │  │  │  └─ accountValidation.ts
│  │  │  ├─ page.tsx
│  │  │  ├─ types
│  │  │  │  └─ account.types.ts
│  │  │  └─ [id]
│  │  │     ├─ edit
│  │  │     │  └─ page.tsx
│  │  │     ├─ logs
│  │  │     │  └─ page.tsx
│  │  │     └─ page.tsx
│  │  ├─ ai-consulting
│  │  │  ├─ components
│  │  │  │  ├─ AiKpiDashboard
│  │  │  │  │  └─ index.tsx
│  │  │  │  ├─ AiTranscriptTable
│  │  │  │  │  └─ index.tsx
│  │  │  │  └─ TranscriptDetailPanel
│  │  │  │     └─ index.tsx
│  │  │  └─ page.tsx
│  │  ├─ chats
│  │  │  ├─ components
│  │  │  │  ├─ ChatActionDrawer
│  │  │  │  │  └─ index.tsx
│  │  │  │  ├─ Chatfillter
│  │  │  │  │  └─ ChatFilterBar.tsx
│  │  │  │  ├─ ChatThreadPanel
│  │  │  │  │  ├─ AttachmentBlock.tsx
│  │  │  │  │  ├─ index.tsx
│  │  │  │  │  └─ MessageBubble.tsx
│  │  │  │  └─ SessionListPanel
│  │  │  │     ├─ ChatSessionRow.tsx
│  │  │  │     └─ index.tsx
│  │  │  ├─ hooks
│  │  │  │  ├─ useChatMessages.ts
│  │  │  │  └─ useChatSessions.ts
│  │  │  ├─ mocks
│  │  │  │  └─ chatMock.ts
│  │  │  ├─ page.tsx
│  │  │  └─ types
│  │  │     └─ chat.types.ts
│  │  ├─ dashbroad
│  │  │  ├─ components
│  │  │  │  ├─ AuthLayout.tsx
│  │  │  │  ├─ dashboard
│  │  │  │  │  ├─ AdminShell.tsx
│  │  │  │  │  ├─ AdminSidebar.tsx
│  │  │  │  │  ├─ AdminTopbar.tsx
│  │  │  │  │  ├─ AiQualityCard.tsx
│  │  │  │  │  ├─ DashboardHeader.tsx
│  │  │  │  │  ├─ JobStatusDonutChart.tsx
│  │  │  │  │  ├─ KpiCard.tsx
│  │  │  │  │  ├─ KpiGrid.tsx
│  │  │  │  │  ├─ LiveJobsTable.tsx
│  │  │  │  │  ├─ mockData.ts
│  │  │  │  │  ├─ OnlineTechniciansTable.tsx
│  │  │  │  │  ├─ RecentActivityTimeline.tsx
│  │  │  │  │  ├─ RevenueLineChart.tsx
│  │  │  │  │  ├─ status.ts
│  │  │  │  │  ├─ SystemStatusBanner.tsx
│  │  │  │  │  ├─ TopDeviceBarChart.tsx
│  │  │  │  │  └─ types.ts
│  │  │  │  ├─ LoginForm.tsx
│  │  │  │  ├─ LogoHeader.tsx
│  │  │  │  └─ RoleTabs.tsx
│  │  │  └─ page.tsx
│  │  ├─ dispatch
│  │  │  ├─ components
│  │  │  │  ├─ DispatchDrawer.tsx
│  │  │  │  ├─ DispatchFilters.tsx
│  │  │  │  ├─ DispatchHeader.tsx
│  │  │  │  ├─ DispatchTable.tsx
│  │  │  │  ├─ mockData.ts
│  │  │  │  └─ types.ts
│  │  │  └─ page.tsx
│  │  ├─ moderation
│  │  │  ├─ components
│  │  │  │  ├─ EvidenceViewerPanel
│  │  │  │  │  └─ index.tsx
│  │  │  │  ├─ ModerationActionDrawer
│  │  │  │  │  └─ index.tsx
│  │  │  │  └─ ReportSlaTable
│  │  │  │     └─ index.tsx
│  │  │  └─ page.tsx
│  │  ├─ quotes
│  │  │  ├─ components
│  │  │  │  ├─ QuoteActionDrawer
│  │  │  │  │  └─ index.tsx
│  │  │  │  ├─ QuoteDetailPanel
│  │  │  │  │  └─ index.tsx
│  │  │  │  └─ QuoteMatrixTable
│  │  │  │     └─ index.tsx
│  │  │  └─ page.tsx
│  │  ├─ rag-knowledge
│  │  │  ├─ components
│  │  │  │  ├─ ChunkViewerPanel
│  │  │  │  │  └─ index.tsx
│  │  │  │  ├─ DocumentLifecycleGrid
│  │  │  │  │  └─ index.tsx
│  │  │  │  └─ KnowledgeActionDrawer
│  │  │  │     └─ index.tsx
│  │  │  └─ page.tsx
│  │  ├─ repair-sessions
│  │  │  ├─ components
│  │  │  │  ├─ AssignmentHistoryTimeline.tsx
│  │  │  │  ├─ CancelRepairSessionModal.tsx
│  │  │  │  ├─ DispatchActionPanel.tsx
│  │  │  │  ├─ ReassignTechnicianModal.tsx
│  │  │  │  ├─ RepairSessionAddressCard.tsx
│  │  │  │  ├─ RepairSessionAiSummaryCard.tsx
│  │  │  │  ├─ RepairSessionCustomerCard.tsx
│  │  │  │  ├─ RepairSessionDangerBadge.tsx
│  │  │  │  ├─ RepairSessionDetailPanel.tsx
│  │  │  │  ├─ RepairSessionDeviceCard.tsx
│  │  │  │  ├─ RepairSessionFilterBar.tsx
│  │  │  │  ├─ RepairSessionInfoCard.tsx
│  │  │  │  ├─ RepairSessionKpiCard.tsx
│  │  │  │  ├─ RepairSessionList.tsx
│  │  │  │  ├─ RepairSessionListItem.tsx
│  │  │  │  ├─ RepairSessionListPanel.tsx
│  │  │  │  ├─ RepairSessionMobileCard.tsx
│  │  │  │  ├─ RepairSessionsKpiGrid.tsx
│  │  │  │  ├─ RepairSessionsPageHeader.tsx
│  │  │  │  ├─ RepairSessionStatusBadge.tsx
│  │  │  │  ├─ RepairSessionStatusTabs.tsx
│  │  │  │  ├─ RepairSessionStuckBadge.tsx
│  │  │  │  ├─ RepairSessionSymptomCard.tsx
│  │  │  │  ├─ RepairSessionTimeline.tsx
│  │  │  │  ├─ RepairSessionWorkspace.tsx
│  │  │  │  ├─ UnassignTechnicianModal.tsx
│  │  │  │  ├─ UpdateStatusDisabledTooltip.tsx
│  │  │  │  └─ _InfoCard.tsx
│  │  │  ├─ constants
│  │  │  │  └─ repairSession.constants.ts
│  │  │  ├─ hooks
│  │  │  │  ├─ useRepairSessionActions.ts
│  │  │  │  ├─ useRepairSessionDetail.ts
│  │  │  │  ├─ useRepairSessionFilters.ts
│  │  │  │  ├─ useRepairSessions.ts
│  │  │  │  └─ useStuckRepairSessions.ts
│  │  │  ├─ mocks
│  │  │  │  └─ repairSessions.mock.ts
│  │  │  ├─ page.tsx
│  │  │  ├─ services
│  │  │  │  └─ repairSessionService.ts
│  │  │  ├─ types
│  │  │  │  └─ repairSession.types.ts
│  │  │  └─ utils
│  │  │     ├─ repairSessionFormatters.ts
│  │  │     ├─ repairSessionRules.ts
│  │  │     └─ repairSessionStatusMeta.ts
│  │  ├─ reviews
│  │  │  ├─ components
│  │  │  │  ├─ ReviewCompactList
│  │  │  │  │  └─ index.tsx
│  │  │  │  ├─ ReviewDetailContent
│  │  │  │  │  └─ index.tsx
│  │  │  │  └─ ReviewModerationDrawer
│  │  │  │     └─ index.tsx
│  │  │  └─ page.tsx
│  │  └─ technicians
│  │     ├─ components
│  │     │  ├─ mockData.ts
│  │     │  ├─ TechnicianExpandedPanel.tsx
│  │     │  ├─ TechnicianFilters.tsx
│  │     │  ├─ TechnicianHeader.tsx
│  │     │  ├─ TechnicianKpiGrid.tsx
│  │     │  ├─ TechnicianPagination.tsx
│  │     │  ├─ TechnicianStatusBadge.tsx
│  │     │  ├─ TechnicianTable.tsx
│  │     │  ├─ types.ts
│  │     │  └─ utils.ts
│  │     └─ page.tsx
│  ├─ auth
│  │  ├─ forgot-password
│  │  │  └─ page.tsx
│  │  ├─ Login
│  │  │  └─ page.tsx
│  │  └─ Register
│  │     └─ page.tsx
│  ├─ components
│  │  ├─ bottomnavComponents.tsx
│  │  ├─ inputComponents.tsx
│  │  └─ navbarComponents.tsx
│  ├─ config
│  │  └─ routes.ts
│  ├─ favicon.ico
│  ├─ globals.css
│  ├─ image
│  │  └─ logo6.webp
│  └─ layout.tsx
├─ CLAUDE.md
├─ eslint.config.mjs
├─ flow-layout-quan-ly-bao-gia-theo-be.md
├─ logo.png
├─ middleware.ts
├─ next.config.ts
├─ nghiepvu1.md
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ public
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ next.svg
│  ├─ vercel.svg
│  └─ window.svg
├─ README.md
└─ tsconfig.json

```
```
fe_chatbot_website
├─ .sixth
│  └─ skills
│     ├─ 00_README_READ_ORDER.md
│     ├─ 01_PROJECT_UI_DIRECTION.md
│     ├─ 02_DESIGN_SYSTEM_TOKENS.md
│     ├─ 03_LAYOUT_RULES_AND_PATTERNS.md
│     ├─ 04_COMPONENT_AND_STATE_STANDARDS.md
│     ├─ 05_RESPONSIVE_ACCESSIBILITY_AND_PRODUCTION.md
│     ├─ 06_CODEX_MASTER_PROMPT.md
│     └─ 07_FINAL_REVIEW_CHECKLIST.md
├─ AGENTS.md
├─ app
│  ├─ (client)
│  │  ├─ chatbot
│  │  │  └─ page.tsx
│  │  ├─ faqchat
│  │  │  └─ page.tsx
│  │  ├─ layout.tsx
│  │  ├─ orderhistory
│  │  │  └─ page.tsx
│  │  └─ page.tsx
│  ├─ Admin
│  │  ├─ Accounts
│  │  │  ├─ components
│  │  │  │  ├─ actions
│  │  │  │  │  ├─ AccountActionBar.tsx
│  │  │  │  │  ├─ AccountActionButton.tsx
│  │  │  │  │  ├─ AccountActionGroup.tsx
│  │  │  │  │  ├─ AccountActionLink.tsx
│  │  │  │  │  └─ AccountConfirmActionDialog.tsx
│  │  │  │  ├─ detail-panel
│  │  │  │  │  ├─ AccountDetailPanel.tsx
│  │  │  │  │  ├─ AccountGpsCard.tsx
│  │  │  │  │  ├─ AccountProfileCard.tsx
│  │  │  │  │  ├─ AccountRelatedDataCard.tsx
│  │  │  │  │  ├─ AccountStatusCard.tsx
│  │  │  │  │  └─ AccountWarningCard.tsx
│  │  │  │  ├─ dialogs
│  │  │  │  │  ├─ AccountChangeRoleDialog.tsx
│  │  │  │  │  ├─ AccountDeleteGuardDialog.tsx
│  │  │  │  │  ├─ AccountDetailModal.tsx
│  │  │  │  │  ├─ AccountLockDialog.tsx
│  │  │  │  │  ├─ AccountResetPasswordDialog.tsx
│  │  │  │  │  └─ AccountVerifyDialog.tsx
│  │  │  │  ├─ filters
│  │  │  │  │  ├─ AccountFilters.tsx
│  │  │  │  │  ├─ AccountRoleFilter.tsx
│  │  │  │  │  ├─ AccountSearchInput.tsx
│  │  │  │  │  ├─ AccountStatusFilter.tsx
│  │  │  │  │  └─ AccountVerifiedFilter.tsx
│  │  │  │  ├─ forms
│  │  │  │  │  ├─ AccountBaseFormFields.tsx
│  │  │  │  │  ├─ AccountCreateForm.tsx
│  │  │  │  │  ├─ AccountLocationFields.tsx
│  │  │  │  │  ├─ AccountPasswordFields.tsx
│  │  │  │  │  ├─ AccountRoleFields.tsx
│  │  │  │  │  └─ AccountUpdateForm.tsx
│  │  │  │  ├─ layout
│  │  │  │  │  ├─ AccountHeader.tsx
│  │  │  │  │  ├─ AccountKpiGrid.tsx
│  │  │  │  │  └─ AccountPageSection.tsx
│  │  │  │  ├─ logs
│  │  │  │  │  ├─ AccountAuditLogFilters.tsx
│  │  │  │  │  ├─ AccountAuditLogItem.tsx
│  │  │  │  │  └─ AccountAuditLogPanel.tsx
│  │  │  │  ├─ shared
│  │  │  │  │  ├─ AccountAvatar.tsx
│  │  │  │  │  ├─ AccountInfoRow.tsx
│  │  │  │  │  ├─ AccountOnlineDot.tsx
│  │  │  │  │  ├─ AccountRoleBadge.tsx
│  │  │  │  │  ├─ AccountStatusBadge.tsx
│  │  │  │  │  ├─ AccountVerifiedBadge.tsx
│  │  │  │  │  ├─ AdminPagination.tsx
│  │  │  │  │  └─ Pagination.tsx
│  │  │  │  └─ table
│  │  │  │     ├─ AccountDesktopRow.tsx
│  │  │  │     ├─ AccountEmptyState.tsx
│  │  │  │     ├─ AccountMobileCard.tsx
│  │  │  │     ├─ AccountMobileList.tsx
│  │  │  │     ├─ AccountTable.tsx
│  │  │  │     └─ AccountTableDesktop.tsx
│  │  │  ├─ create
│  │  │  │  └─ page.tsx
│  │  │  ├─ data
│  │  │  │  └─ mockData.ts
│  │  │  ├─ lib
│  │  │  │  ├─ accountConstants.ts
│  │  │  │  ├─ accountFilters.ts
│  │  │  │  ├─ accountHelpers.ts
│  │  │  │  └─ accountValidation.ts
│  │  │  ├─ page.tsx
│  │  │  ├─ types
│  │  │  │  └─ account.types.ts
│  │  │  └─ [id]
│  │  │     ├─ edit
│  │  │     │  └─ page.tsx
│  │  │     ├─ logs
│  │  │     │  └─ page.tsx
│  │  │     └─ page.tsx
│  │  ├─ ai-consulting
│  │  │  ├─ components
│  │  │  │  ├─ AiKpiDashboard
│  │  │  │  │  └─ index.tsx
│  │  │  │  ├─ AiTranscriptTable
│  │  │  │  │  └─ index.tsx
│  │  │  │  └─ TranscriptDetailPanel
│  │  │  │     └─ index.tsx
│  │  │  └─ page.tsx
│  │  ├─ chats
│  │  │  ├─ components
│  │  │  │  ├─ ChatActionDrawer
│  │  │  │  │  └─ index.tsx
│  │  │  │  ├─ Chatfillter
│  │  │  │  │  └─ ChatFilterBar.tsx
│  │  │  │  ├─ ChatThreadPanel
│  │  │  │  │  ├─ AttachmentBlock.tsx
│  │  │  │  │  ├─ index.tsx
│  │  │  │  │  └─ MessageBubble.tsx
│  │  │  │  └─ SessionListPanel
│  │  │  │     ├─ ChatSessionRow.tsx
│  │  │  │     └─ index.tsx
│  │  │  ├─ hooks
│  │  │  │  ├─ useChatMessages.ts
│  │  │  │  └─ useChatSessions.ts
│  │  │  ├─ mocks
│  │  │  │  └─ chatMock.ts
│  │  │  ├─ page.tsx
│  │  │  └─ types
│  │  │     └─ chat.types.ts
│  │  ├─ dashbroad
│  │  │  ├─ components
│  │  │  │  ├─ AuthLayout.tsx
│  │  │  │  ├─ dashboard
│  │  │  │  │  ├─ AdminShell.tsx
│  │  │  │  │  ├─ AdminSidebar.tsx
│  │  │  │  │  ├─ AdminTopbar.tsx
│  │  │  │  │  ├─ AiQualityCard.tsx
│  │  │  │  │  ├─ DashboardHeader.tsx
│  │  │  │  │  ├─ JobStatusDonutChart.tsx
│  │  │  │  │  ├─ KpiCard.tsx
│  │  │  │  │  ├─ KpiGrid.tsx
│  │  │  │  │  ├─ LiveJobsTable.tsx
│  │  │  │  │  ├─ mockData.ts
│  │  │  │  │  ├─ OnlineTechniciansTable.tsx
│  │  │  │  │  ├─ RecentActivityTimeline.tsx
│  │  │  │  │  ├─ RevenueLineChart.tsx
│  │  │  │  │  ├─ status.ts
│  │  │  │  │  ├─ SystemStatusBanner.tsx
│  │  │  │  │  ├─ TopDeviceBarChart.tsx
│  │  │  │  │  └─ types.ts
│  │  │  │  ├─ LoginForm.tsx
│  │  │  │  ├─ LogoHeader.tsx
│  │  │  │  └─ RoleTabs.tsx
│  │  │  └─ page.tsx
│  │  ├─ dispatch
│  │  │  ├─ components
│  │  │  │  ├─ DispatchDrawer.tsx
│  │  │  │  ├─ DispatchFilters.tsx
│  │  │  │  ├─ DispatchHeader.tsx
│  │  │  │  ├─ DispatchTable.tsx
│  │  │  │  ├─ mockData.ts
│  │  │  │  └─ types.ts
│  │  │  └─ page.tsx
│  │  ├─ moderation
│  │  │  ├─ components
│  │  │  │  ├─ EvidenceViewerPanel
│  │  │  │  │  └─ index.tsx
│  │  │  │  ├─ ModerationActionDrawer
│  │  │  │  │  └─ index.tsx
│  │  │  │  └─ ReportSlaTable
│  │  │  │     └─ index.tsx
│  │  │  └─ page.tsx
│  │  ├─ quotes
│  │  │  ├─ components
│  │  │  │  ├─ QuoteActionDrawer
│  │  │  │  │  └─ index.tsx
│  │  │  │  ├─ QuoteDetailPanel
│  │  │  │  │  └─ index.tsx
│  │  │  │  ├─ QuoteFilterBar
│  │  │  │  │  └─ index.tsx
│  │  │  │  └─ QuoteMatrixTable
│  │  │  │     └─ index.tsx
│  │  │  ├─ mocks
│  │  │  │  └─ quotesMock.ts
│  │  │  ├─ page.tsx
│  │  │  └─ types
│  │  │     └─ quote.types.ts
│  │  ├─ rag-knowledge
│  │  │  ├─ components
│  │  │  │  ├─ ChunkViewerPanel
│  │  │  │  │  └─ index.tsx
│  │  │  │  ├─ DocumentLifecycleGrid
│  │  │  │  │  └─ index.tsx
│  │  │  │  └─ KnowledgeActionDrawer
│  │  │  │     └─ index.tsx
│  │  │  └─ page.tsx
│  │  ├─ repair-sessions
│  │  │  ├─ components
│  │  │  │  ├─ AssignmentHistoryTimeline.tsx
│  │  │  │  ├─ CancelRepairSessionModal.tsx
│  │  │  │  ├─ DispatchActionPanel.tsx
│  │  │  │  ├─ ReassignTechnicianModal.tsx
│  │  │  │  ├─ RepairSessionAddressCard.tsx
│  │  │  │  ├─ RepairSessionAiSummaryCard.tsx
│  │  │  │  ├─ RepairSessionCustomerCard.tsx
│  │  │  │  ├─ RepairSessionDangerBadge.tsx
│  │  │  │  ├─ RepairSessionDetailPanel.tsx
│  │  │  │  ├─ RepairSessionDeviceCard.tsx
│  │  │  │  ├─ RepairSessionFilterBar.tsx
│  │  │  │  ├─ RepairSessionInfoCard.tsx
│  │  │  │  ├─ RepairSessionKpiCard.tsx
│  │  │  │  ├─ RepairSessionList.tsx
│  │  │  │  ├─ RepairSessionListItem.tsx
│  │  │  │  ├─ RepairSessionListPanel.tsx
│  │  │  │  ├─ RepairSessionMobileCard.tsx
│  │  │  │  ├─ RepairSessionsKpiGrid.tsx
│  │  │  │  ├─ RepairSessionsPageHeader.tsx
│  │  │  │  ├─ RepairSessionStatusBadge.tsx
│  │  │  │  ├─ RepairSessionStatusTabs.tsx
│  │  │  │  ├─ RepairSessionStuckBadge.tsx
│  │  │  │  ├─ RepairSessionSymptomCard.tsx
│  │  │  │  ├─ RepairSessionTimeline.tsx
│  │  │  │  ├─ RepairSessionWorkspace.tsx
│  │  │  │  ├─ UnassignTechnicianModal.tsx
│  │  │  │  ├─ UpdateStatusDisabledTooltip.tsx
│  │  │  │  └─ _InfoCard.tsx
│  │  │  ├─ constants
│  │  │  │  └─ repairSession.constants.ts
│  │  │  ├─ hooks
│  │  │  │  ├─ useRepairSessionActions.ts
│  │  │  │  ├─ useRepairSessionDetail.ts
│  │  │  │  ├─ useRepairSessionFilters.ts
│  │  │  │  ├─ useRepairSessions.ts
│  │  │  │  └─ useStuckRepairSessions.ts
│  │  │  ├─ mocks
│  │  │  │  └─ repairSessions.mock.ts
│  │  │  ├─ page.tsx
│  │  │  ├─ services
│  │  │  │  └─ repairSessionService.ts
│  │  │  ├─ types
│  │  │  │  └─ repairSession.types.ts
│  │  │  └─ utils
│  │  │     ├─ repairSessionFormatters.ts
│  │  │     ├─ repairSessionRules.ts
│  │  │     └─ repairSessionStatusMeta.ts
│  │  ├─ reviews
│  │  │  ├─ components
│  │  │  │  ├─ ReviewCompactList
│  │  │  │  │  └─ index.tsx
│  │  │  │  ├─ ReviewDetailContent
│  │  │  │  │  └─ index.tsx
│  │  │  │  └─ ReviewModerationDrawer
│  │  │  │     └─ index.tsx
│  │  │  └─ page.tsx
│  │  └─ technicians
│  │     ├─ components
│  │     │  ├─ mockData.ts
│  │     │  ├─ TechnicianExpandedPanel.tsx
│  │     │  ├─ TechnicianFilters.tsx
│  │     │  ├─ TechnicianHeader.tsx
│  │     │  ├─ TechnicianKpiGrid.tsx
│  │     │  ├─ TechnicianPagination.tsx
│  │     │  ├─ TechnicianStatusBadge.tsx
│  │     │  ├─ TechnicianTable.tsx
│  │     │  ├─ types.ts
│  │     │  └─ utils.ts
│  │     └─ page.tsx
│  ├─ auth
│  │  ├─ forgot-password
│  │  │  └─ page.tsx
│  │  ├─ Login
│  │  │  └─ page.tsx
│  │  └─ Register
│  │     └─ page.tsx
│  ├─ components
│  │  ├─ bottomnavComponents.tsx
│  │  ├─ inputComponents.tsx
│  │  ├─ navbarComponents.tsx
│  │  └─ Pagination.tsx
│  ├─ config
│  │  └─ routes.ts
│  ├─ favicon.ico
│  ├─ globals.css
│  ├─ image
│  │  └─ logo6.webp
│  └─ layout.tsx
├─ CLAUDE.md
├─ eslint.config.mjs
├─ flow-layout-quan-ly-bao-gia-theo-be.md
├─ logo.png
├─ middleware.ts
├─ next.config.ts
├─ nghiepvu1.md
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ public
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ next.svg
│  ├─ vercel.svg
│  └─ window.svg
├─ README.md
└─ tsconfig.json

```
```
fe_chatbot_website
├─ .sixth
│  └─ skills
│     ├─ 00_README_READ_ORDER.md
│     ├─ 01_PROJECT_UI_DIRECTION.md
│     ├─ 02_DESIGN_SYSTEM_TOKENS.md
│     ├─ 03_LAYOUT_RULES_AND_PATTERNS.md
│     ├─ 04_COMPONENT_AND_STATE_STANDARDS.md
│     ├─ 05_RESPONSIVE_ACCESSIBILITY_AND_PRODUCTION.md
│     ├─ 06_CODEX_MASTER_PROMPT.md
│     ├─ 07_FINAL_REVIEW_CHECKLIST.md
│     └─ coding
│        ├─ AGENTS.md
│        ├─ Examples.md
│        └─ README.md
├─ AGENTS.md
├─ app
│  ├─ (client)
│  │  ├─ chatbot
│  │  │  └─ page.tsx
│  │  ├─ faqchat
│  │  │  └─ page.tsx
│  │  ├─ layout.tsx
│  │  ├─ orderhistory
│  │  │  └─ page.tsx
│  │  └─ page.tsx
│  ├─ admin
│  │  ├─ accounts
│  │  │  ├─ components
│  │  │  │  ├─ actions
│  │  │  │  │  ├─ AccountActionBar.tsx
│  │  │  │  │  ├─ AccountActionButton.tsx
│  │  │  │  │  ├─ AccountActionGroup.tsx
│  │  │  │  │  ├─ AccountActionLink.tsx
│  │  │  │  │  └─ AccountConfirmActionDialog.tsx
│  │  │  │  ├─ detail-panel
│  │  │  │  │  ├─ AccountDetailPanel.tsx
│  │  │  │  │  ├─ AccountGpsCard.tsx
│  │  │  │  │  ├─ AccountProfileCard.tsx
│  │  │  │  │  ├─ AccountRelatedDataCard.tsx
│  │  │  │  │  ├─ AccountStatusCard.tsx
│  │  │  │  │  └─ AccountWarningCard.tsx
│  │  │  │  ├─ dialogs
│  │  │  │  │  ├─ AccountChangeRoleDialog.tsx
│  │  │  │  │  ├─ AccountDeleteGuardDialog.tsx
│  │  │  │  │  ├─ AccountDetailModal.tsx
│  │  │  │  │  ├─ AccountLockDialog.tsx
│  │  │  │  │  ├─ AccountResetPasswordDialog.tsx
│  │  │  │  │  └─ AccountVerifyDialog.tsx
│  │  │  │  ├─ filters
│  │  │  │  │  ├─ AccountFilters.tsx
│  │  │  │  │  ├─ AccountRoleFilter.tsx
│  │  │  │  │  ├─ AccountSearchInput.tsx
│  │  │  │  │  ├─ AccountStatusFilter.tsx
│  │  │  │  │  └─ AccountVerifiedFilter.tsx
│  │  │  │  ├─ forms
│  │  │  │  │  ├─ AccountBaseFormFields.tsx
│  │  │  │  │  ├─ AccountCreateForm.tsx
│  │  │  │  │  ├─ AccountLocationFields.tsx
│  │  │  │  │  ├─ AccountPasswordFields.tsx
│  │  │  │  │  ├─ AccountRoleFields.tsx
│  │  │  │  │  └─ AccountUpdateForm.tsx
│  │  │  │  ├─ layout
│  │  │  │  │  ├─ AccountHeader.tsx
│  │  │  │  │  ├─ AccountKpiGrid.tsx
│  │  │  │  │  └─ AccountPageSection.tsx
│  │  │  │  ├─ logs
│  │  │  │  │  ├─ AccountAuditLogFilters.tsx
│  │  │  │  │  ├─ AccountAuditLogItem.tsx
│  │  │  │  │  └─ AccountAuditLogPanel.tsx
│  │  │  │  ├─ shared
│  │  │  │  │  ├─ AccountAvatar.tsx
│  │  │  │  │  ├─ AccountInfoRow.tsx
│  │  │  │  │  ├─ AccountOnlineDot.tsx
│  │  │  │  │  ├─ AccountRoleBadge.tsx
│  │  │  │  │  ├─ AccountStatusBadge.tsx
│  │  │  │  │  ├─ AccountVerifiedBadge.tsx
│  │  │  │  │  ├─ AdminPagination.tsx
│  │  │  │  │  └─ Pagination.tsx
│  │  │  │  └─ table
│  │  │  │     ├─ AccountDesktopRow.tsx
│  │  │  │     ├─ AccountEmptyState.tsx
│  │  │  │     ├─ AccountMobileCard.tsx
│  │  │  │     ├─ AccountMobileList.tsx
│  │  │  │     ├─ AccountTable.tsx
│  │  │  │     └─ AccountTableDesktop.tsx
│  │  │  ├─ constants
│  │  │  │  └─ account.constants.ts
│  │  │  ├─ create
│  │  │  │  └─ page.tsx
│  │  │  ├─ hooks
│  │  │  │  ├─ index.ts
│  │  │  │  └─ useAccounts.ts
│  │  │  ├─ mocks
│  │  │  │  └─ accounts.mock.ts
│  │  │  ├─ page.tsx
│  │  │  ├─ services
│  │  │  │  ├─ accountAdmin.service.ts
│  │  │  │  └─ index.ts
│  │  │  ├─ types
│  │  │  │  └─ account.types.ts
│  │  │  ├─ utils
│  │  │  │  ├─ accountFilters.ts
│  │  │  │  ├─ accountFormatters.ts
│  │  │  │  └─ accountValidation.ts
│  │  │  └─ [id]
│  │  │     ├─ edit
│  │  │     │  └─ page.tsx
│  │  │     ├─ logs
│  │  │     │  └─ page.tsx
│  │  │     └─ page.tsx
│  │  ├─ ai-consulting
│  │  │  ├─ components
│  │  │  │  ├─ AiKpiDashboard
│  │  │  │  │  └─ index.tsx
│  │  │  │  ├─ AiTranscriptTable
│  │  │  │  │  └─ index.tsx
│  │  │  │  └─ TranscriptDetailPanel
│  │  │  │     └─ index.tsx
│  │  │  └─ page.tsx
│  │  ├─ chats
│  │  │  ├─ components
│  │  │  │  ├─ ChatActionDrawer
│  │  │  │  │  └─ index.tsx
│  │  │  │  ├─ Chatfillter
│  │  │  │  │  └─ ChatFilterBar.tsx
│  │  │  │  ├─ ChatThreadPanel
│  │  │  │  │  ├─ AttachmentBlock.tsx
│  │  │  │  │  ├─ index.tsx
│  │  │  │  │  └─ MessageBubble.tsx
│  │  │  │  └─ SessionListPanel
│  │  │  │     ├─ ChatSessionRow.tsx
│  │  │  │     └─ index.tsx
│  │  │  ├─ hooks
│  │  │  │  ├─ index.ts
│  │  │  │  └─ useChatsApi.ts
│  │  │  ├─ mocks
│  │  │  │  └─ chatMock.ts
│  │  │  ├─ page.tsx
│  │  │  ├─ services
│  │  │  │  ├─ chat.service.ts
│  │  │  │  └─ index.ts
│  │  │  └─ types
│  │  │     └─ chat.types.ts
│  │  ├─ dashboard
│  │  │  ├─ components
│  │  │  │  ├─ AuthLayout.tsx
│  │  │  │  ├─ dashboard
│  │  │  │  │  ├─ AdminShell.tsx
│  │  │  │  │  ├─ AdminSidebar.tsx
│  │  │  │  │  ├─ AdminTopbar.tsx
│  │  │  │  │  ├─ AiQualityCard.tsx
│  │  │  │  │  ├─ DashboardHeader.tsx
│  │  │  │  │  ├─ JobStatusDonutChart.tsx
│  │  │  │  │  ├─ KpiCard.tsx
│  │  │  │  │  ├─ KpiGrid.tsx
│  │  │  │  │  ├─ LiveJobsTable.tsx
│  │  │  │  │  ├─ mockData.ts
│  │  │  │  │  ├─ OnlineTechniciansTable.tsx
│  │  │  │  │  ├─ RecentActivityTimeline.tsx
│  │  │  │  │  ├─ RevenueLineChart.tsx
│  │  │  │  │  ├─ status.ts
│  │  │  │  │  ├─ SystemStatusBanner.tsx
│  │  │  │  │  ├─ TopDeviceBarChart.tsx
│  │  │  │  │  └─ types.ts
│  │  │  │  ├─ LoginForm.tsx
│  │  │  │  ├─ LogoHeader.tsx
│  │  │  │  └─ RoleTabs.tsx
│  │  │  └─ page.tsx
│  │  ├─ dispatch
│  │  │  ├─ components
│  │  │  │  ├─ DispatchDrawer.tsx
│  │  │  │  ├─ DispatchFilters.tsx
│  │  │  │  ├─ DispatchHeader.tsx
│  │  │  │  └─ DispatchTable.tsx
│  │  │  ├─ mocks
│  │  │  │  └─ dispatch.mock.ts
│  │  │  ├─ page.tsx
│  │  │  └─ types
│  │  │     └─ dispatch.types.ts
│  │  ├─ moderation
│  │  │  ├─ components
│  │  │  │  ├─ EvidenceViewerPanel
│  │  │  │  │  └─ index.tsx
│  │  │  │  ├─ ModerationActionDrawer
│  │  │  │  │  └─ index.tsx
│  │  │  │  └─ ReportSlaTable
│  │  │  │     └─ index.tsx
│  │  │  └─ page.tsx
│  │  ├─ quotes
│  │  │  ├─ components
│  │  │  │  ├─ QuoteActionDrawer
│  │  │  │  │  └─ index.tsx
│  │  │  │  ├─ QuoteDetailPanel
│  │  │  │  │  └─ index.tsx
│  │  │  │  ├─ QuoteFilterBar
│  │  │  │  │  └─ index.tsx
│  │  │  │  └─ QuoteMatrixTable
│  │  │  │     └─ index.tsx
│  │  │  ├─ mocks
│  │  │  │  └─ quotesMock.ts
│  │  │  ├─ page.tsx
│  │  │  └─ types
│  │  │     └─ quote.types.ts
│  │  ├─ rag-knowledge
│  │  │  ├─ components
│  │  │  │  ├─ ChunkViewerPanel
│  │  │  │  │  └─ index.tsx
│  │  │  │  ├─ DocumentLifecycleGrid
│  │  │  │  │  └─ index.tsx
│  │  │  │  └─ KnowledgeActionDrawer
│  │  │  │     └─ index.tsx
│  │  │  └─ page.tsx
│  │  ├─ repair-sessions
│  │  │  ├─ components
│  │  │  │  ├─ AssignmentHistoryTimeline.tsx
│  │  │  │  ├─ CancelRepairSessionModal.tsx
│  │  │  │  ├─ DispatchActionPanel.tsx
│  │  │  │  ├─ ReassignTechnicianModal.tsx
│  │  │  │  ├─ RepairSessionAddressCard.tsx
│  │  │  │  ├─ RepairSessionAiSummaryCard.tsx
│  │  │  │  ├─ RepairSessionCustomerCard.tsx
│  │  │  │  ├─ RepairSessionDangerBadge.tsx
│  │  │  │  ├─ RepairSessionDetailPanel.tsx
│  │  │  │  ├─ RepairSessionDeviceCard.tsx
│  │  │  │  ├─ RepairSessionFilterBar.tsx
│  │  │  │  ├─ RepairSessionInfoCard.tsx
│  │  │  │  ├─ RepairSessionKpiCard.tsx
│  │  │  │  ├─ RepairSessionList.tsx
│  │  │  │  ├─ RepairSessionListItem.tsx
│  │  │  │  ├─ RepairSessionListPanel.tsx
│  │  │  │  ├─ RepairSessionMobileCard.tsx
│  │  │  │  ├─ RepairSessionsKpiGrid.tsx
│  │  │  │  ├─ RepairSessionsPageHeader.tsx
│  │  │  │  ├─ RepairSessionStatusBadge.tsx
│  │  │  │  ├─ RepairSessionStatusTabs.tsx
│  │  │  │  ├─ RepairSessionStuckBadge.tsx
│  │  │  │  ├─ RepairSessionSymptomCard.tsx
│  │  │  │  ├─ RepairSessionTimeline.tsx
│  │  │  │  ├─ RepairSessionWorkspace.tsx
│  │  │  │  ├─ UnassignTechnicianModal.tsx
│  │  │  │  ├─ UpdateStatusDisabledTooltip.tsx
│  │  │  │  └─ _InfoCard.tsx
│  │  │  ├─ constants
│  │  │  │  └─ repairSession.constants.ts
│  │  │  ├─ hooks
│  │  │  │  └─ useRepairSessionFilters.ts
│  │  │  ├─ mocks
│  │  │  │  └─ repairSessions.mock.ts
│  │  │  ├─ page.tsx
│  │  │  ├─ types
│  │  │  │  └─ repairSession.types.ts
│  │  │  └─ utils
│  │  │     ├─ repairSessionFormatters.ts
│  │  │     ├─ repairSessionRules.ts
│  │  │     └─ repairSessionStatusMeta.ts
│  │  ├─ reviews
│  │  │  ├─ components
│  │  │  │  ├─ ReviewCompactList
│  │  │  │  │  └─ index.tsx
│  │  │  │  ├─ ReviewDetailContent
│  │  │  │  │  └─ index.tsx
│  │  │  │  └─ ReviewModerationDrawer
│  │  │  │     └─ index.tsx
│  │  │  └─ page.tsx
│  │  └─ technicians
│  │     ├─ components
│  │     │  ├─ TechnicianExpandedPanel.tsx
│  │     │  ├─ TechnicianFilters.tsx
│  │     │  ├─ TechnicianHeader.tsx
│  │     │  ├─ TechnicianKpiGrid.tsx
│  │     │  ├─ TechnicianPagination.tsx
│  │     │  ├─ TechnicianStatusBadge.tsx
│  │     │  └─ TechnicianTable.tsx
│  │     ├─ hooks
│  │     │  ├─ index.ts
│  │     │  └─ useTechnicians.ts
│  │     ├─ mocks
│  │     │  └─ technicians.mock.ts
│  │     ├─ page.tsx
│  │     ├─ services
│  │     │  ├─ index.ts
│  │     │  └─ technicianAdmin.service.ts
│  │     ├─ types
│  │     │  └─ technician.types.ts
│  │     └─ utils
│  │        └─ technicianStatusMeta.ts
│  ├─ auth
│  │  ├─ forgot-password
│  │  │  └─ page.tsx
│  │  ├─ hooks
│  │  │  └─ useAuthApi.ts
│  │  ├─ login
│  │  │  └─ page.tsx
│  │  ├─ register
│  │  │  └─ page.tsx
│  │  ├─ services
│  │  │  └─ auth.service.ts
│  │  └─ utils
│  │     └─ session.ts
│  ├─ components
│  │  ├─ bottomnavComponents.tsx
│  │  ├─ client
│  │  │  └─ header
│  │  │     ├─ ClientHeader.tsx
│  │  │     ├─ constants.ts
│  │  │     ├─ HeaderActions.tsx
│  │  │     ├─ HeaderLogo.tsx
│  │  │     ├─ HeaderNav.tsx
│  │  │     ├─ LoginButton.tsx
│  │  │     ├─ ocean-theme-transition.css
│  │  │     ├─ README.md
│  │  │     ├─ ThemeToggleButton.tsx
│  │  │     ├─ types.ts
│  │  │     ├─ useOceanThemeTransition.ts
│  │  │     ├─ UserMenu.tsx
│  │  │     └─ useThemeToggle.ts
│  │  ├─ inputComponents.tsx
│  │  ├─ navbarComponents.tsx
│  │  └─ Pagination.tsx
│  ├─ config
│  │  └─ routes.ts
│  ├─ favicon.ico
│  ├─ globals.css
│  ├─ hooks
│  │  ├─ common
│  │  │  ├─ index.ts
│  │  │  ├─ useAiApi.ts
│  │  │  ├─ useAsyncAction.ts
│  │  │  ├─ useAuthApi.ts
│  │  │  ├─ useChatHistoryApi.ts
│  │  │  ├─ useChatsApi.ts
│  │  │  ├─ useDevicesApi.ts
│  │  │  ├─ useMechanicAiApi.ts
│  │  │  ├─ useNotificationsApi.ts
│  │  │  ├─ useRagApi.ts
│  │  │  ├─ useUploadApi.ts
│  │  │  └─ useUsersApi.ts
│  │  ├─ customer
│  │  ├─ index.ts
│  │  └─ useUtilities.ts
│  ├─ image
│  │  └─ logo6.webp
│  ├─ layout.tsx
│  └─ services
│     ├─ apiClient.ts
│     ├─ authorization.service.ts
│     └─ common
│        ├─ ai.service.ts
│        ├─ auth.service.ts
│        ├─ chat-history.service.ts
│        ├─ chats.service.ts
│        ├─ devices.service.ts
│        ├─ index.ts
│        ├─ mechanic-ai.service.ts
│        ├─ notifications.service.ts
│        ├─ rag.service.ts
│        ├─ types.ts
│        ├─ upload.service.ts
│        └─ users.service.ts
├─ eslint.config.mjs
├─ frontend-test.err.log
├─ frontend-test.out.log
├─ logo.png
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ proxy.ts
├─ public
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ next.svg
│  ├─ vercel.svg
│  └─ window.svg
├─ README.md
├─ tsconfig.admin-pages.json
├─ tsconfig.common-api.json
└─ tsconfig.json

```
```
fe_chatbot_website
├─ .sixth
│  └─ skills
│     ├─ coding
│     │  ├─ AGENTS.md
│     │  ├─ Examples.md
│     │  └─ README.md
│     └─ layout
│        ├─ 00_README_READ_ORDER.md
│        ├─ 01_PROJECT_UI_DIRECTION.md
│        ├─ 02_DESIGN_SYSTEM_TOKENS.md
│        ├─ 03_LAYOUT_RULES_AND_PATTERNS.md
│        ├─ 04_COMPONENT_AND_STATE_STANDARDS.md
│        ├─ 05_RESPONSIVE_ACCESSIBILITY_AND_PRODUCTION.md
│        ├─ 06_CODEX_MASTER_PROMPT.md
│        └─ 07_FINAL_REVIEW_CHECKLIST.md
├─ AGENTS.md
├─ app
│  ├─ (client)
│  │  ├─ chatbot
│  │  │  └─ page.tsx
│  │  ├─ faqchat
│  │  │  └─ page.tsx
│  │  ├─ layout.tsx
│  │  ├─ orderhistory
│  │  │  └─ page.tsx
│  │  └─ page.tsx
│  ├─ admin
│  │  ├─ accounts
│  │  │  ├─ components
│  │  │  │  ├─ actions
│  │  │  │  │  ├─ AccountActionBar.tsx
│  │  │  │  │  ├─ AccountActionButton.tsx
│  │  │  │  │  ├─ AccountActionGroup.tsx
│  │  │  │  │  ├─ AccountActionLink.tsx
│  │  │  │  │  └─ AccountConfirmActionDialog.tsx
│  │  │  │  ├─ detail-panel
│  │  │  │  │  ├─ AccountDetailPanel.tsx
│  │  │  │  │  ├─ AccountGpsCard.tsx
│  │  │  │  │  ├─ AccountProfileCard.tsx
│  │  │  │  │  ├─ AccountRelatedDataCard.tsx
│  │  │  │  │  ├─ AccountStatusCard.tsx
│  │  │  │  │  └─ AccountWarningCard.tsx
│  │  │  │  ├─ dialogs
│  │  │  │  │  ├─ AccountChangeRoleDialog.tsx
│  │  │  │  │  ├─ AccountDeleteGuardDialog.tsx
│  │  │  │  │  ├─ AccountDetailModal.tsx
│  │  │  │  │  ├─ AccountLockDialog.tsx
│  │  │  │  │  ├─ AccountResetPasswordDialog.tsx
│  │  │  │  │  └─ AccountVerifyDialog.tsx
│  │  │  │  ├─ filters
│  │  │  │  │  ├─ AccountFilters.tsx
│  │  │  │  │  ├─ AccountRoleFilter.tsx
│  │  │  │  │  ├─ AccountSearchInput.tsx
│  │  │  │  │  ├─ AccountStatusFilter.tsx
│  │  │  │  │  └─ AccountVerifiedFilter.tsx
│  │  │  │  ├─ forms
│  │  │  │  │  ├─ AccountBaseFormFields.tsx
│  │  │  │  │  ├─ AccountCreateForm.tsx
│  │  │  │  │  ├─ AccountLocationFields.tsx
│  │  │  │  │  ├─ AccountPasswordFields.tsx
│  │  │  │  │  ├─ AccountRoleFields.tsx
│  │  │  │  │  └─ AccountUpdateForm.tsx
│  │  │  │  ├─ layout
│  │  │  │  │  ├─ AccountHeader.tsx
│  │  │  │  │  ├─ AccountKpiGrid.tsx
│  │  │  │  │  └─ AccountPageSection.tsx
│  │  │  │  ├─ logs
│  │  │  │  │  ├─ AccountAuditLogFilters.tsx
│  │  │  │  │  ├─ AccountAuditLogItem.tsx
│  │  │  │  │  └─ AccountAuditLogPanel.tsx
│  │  │  │  ├─ shared
│  │  │  │  │  ├─ AccountAvatar.tsx
│  │  │  │  │  ├─ AccountInfoRow.tsx
│  │  │  │  │  ├─ AccountOnlineDot.tsx
│  │  │  │  │  ├─ AccountRoleBadge.tsx
│  │  │  │  │  ├─ AccountStatusBadge.tsx
│  │  │  │  │  ├─ AccountVerifiedBadge.tsx
│  │  │  │  │  ├─ AdminPagination.tsx
│  │  │  │  │  └─ Pagination.tsx
│  │  │  │  └─ table
│  │  │  │     ├─ AccountDesktopRow.tsx
│  │  │  │     ├─ AccountEmptyState.tsx
│  │  │  │     ├─ AccountMobileCard.tsx
│  │  │  │     ├─ AccountMobileList.tsx
│  │  │  │     ├─ AccountTable.tsx
│  │  │  │     └─ AccountTableDesktop.tsx
│  │  │  ├─ constants
│  │  │  │  └─ account.constants.ts
│  │  │  ├─ create
│  │  │  │  └─ page.tsx
│  │  │  ├─ hooks
│  │  │  │  ├─ index.ts
│  │  │  │  └─ useAccounts.ts
│  │  │  ├─ mocks
│  │  │  │  └─ accounts.mock.ts
│  │  │  ├─ page.tsx
│  │  │  ├─ services
│  │  │  │  ├─ accountAdmin.service.ts
│  │  │  │  └─ index.ts
│  │  │  ├─ types
│  │  │  │  └─ account.types.ts
│  │  │  ├─ utils
│  │  │  │  ├─ accountFilters.ts
│  │  │  │  ├─ accountFormatters.ts
│  │  │  │  └─ accountValidation.ts
│  │  │  └─ [id]
│  │  │     ├─ edit
│  │  │     │  └─ page.tsx
│  │  │     ├─ logs
│  │  │     │  └─ page.tsx
│  │  │     └─ page.tsx
│  │  ├─ ai-consulting
│  │  │  ├─ components
│  │  │  │  ├─ AiKpiDashboard
│  │  │  │  │  └─ index.tsx
│  │  │  │  ├─ AiTranscriptTable
│  │  │  │  │  └─ index.tsx
│  │  │  │  └─ TranscriptDetailPanel
│  │  │  │     └─ index.tsx
│  │  │  └─ page.tsx
│  │  ├─ ai-reasoning-logs
│  │  │  ├─ components
│  │  │  │  ├─ AiReasoningBadges.tsx
│  │  │  │  ├─ AiReasoningFilterBar.tsx
│  │  │  │  ├─ AiReasoningHeader.tsx
│  │  │  │  ├─ AiReasoningKpiGrid.tsx
│  │  │  │  ├─ AiReasoningLogDetail.tsx
│  │  │  │  └─ AiReasoningLogList.tsx
│  │  │  ├─ data
│  │  │  │  └─ mockAiReasoningLogs.ts
│  │  │  ├─ lib
│  │  │  │  └─ aiReasoningHelpers.ts
│  │  │  ├─ page.tsx
│  │  │  └─ types
│  │  │     └─ aiReasoning.types.ts
│  │  ├─ chats
│  │  │  ├─ components
│  │  │  │  ├─ ChatActionDrawer
│  │  │  │  │  └─ index.tsx
│  │  │  │  ├─ Chatfillter
│  │  │  │  │  └─ ChatFilterBar.tsx
│  │  │  │  ├─ ChatThreadPanel
│  │  │  │  │  ├─ AttachmentBlock.tsx
│  │  │  │  │  ├─ index.tsx
│  │  │  │  │  └─ MessageBubble.tsx
│  │  │  │  └─ SessionListPanel
│  │  │  │     ├─ ChatSessionRow.tsx
│  │  │  │     └─ index.tsx
│  │  │  ├─ hooks
│  │  │  │  ├─ index.ts
│  │  │  │  └─ useChatsApi.ts
│  │  │  ├─ mocks
│  │  │  │  └─ chatMock.ts
│  │  │  ├─ page.tsx
│  │  │  ├─ services
│  │  │  │  ├─ chat.service.ts
│  │  │  │  └─ index.ts
│  │  │  └─ types
│  │  │     └─ chat.types.ts
│  │  ├─ dashboard
│  │  │  ├─ components
│  │  │  │  ├─ AuthLayout.tsx
│  │  │  │  ├─ dashboard
│  │  │  │  │  ├─ AdminShell.tsx
│  │  │  │  │  ├─ AdminSidebar.tsx
│  │  │  │  │  ├─ AdminTopbar.tsx
│  │  │  │  │  ├─ AiQualityCard.tsx
│  │  │  │  │  ├─ DashboardHeader.tsx
│  │  │  │  │  ├─ JobStatusDonutChart.tsx
│  │  │  │  │  ├─ KpiCard.tsx
│  │  │  │  │  ├─ KpiGrid.tsx
│  │  │  │  │  ├─ LiveJobsTable.tsx
│  │  │  │  │  ├─ mockData.ts
│  │  │  │  │  ├─ OnlineTechniciansTable.tsx
│  │  │  │  │  ├─ RecentActivityTimeline.tsx
│  │  │  │  │  ├─ RevenueLineChart.tsx
│  │  │  │  │  ├─ status.ts
│  │  │  │  │  ├─ SystemStatusBanner.tsx
│  │  │  │  │  ├─ TopDeviceBarChart.tsx
│  │  │  │  │  └─ types.ts
│  │  │  │  ├─ LoginForm.tsx
│  │  │  │  ├─ LogoHeader.tsx
│  │  │  │  └─ RoleTabs.tsx
│  │  │  └─ page.tsx
│  │  ├─ Devices
│  │  │  ├─ components
│  │  │  │  ├─ DeviceDesktopRow.tsx
│  │  │  │  ├─ DeviceDetailPanel.tsx
│  │  │  │  ├─ DeviceFilters.tsx
│  │  │  │  ├─ DeviceHeader.tsx
│  │  │  │  ├─ DeviceInfoBox.tsx
│  │  │  │  ├─ DeviceKpiGrid.tsx
│  │  │  │  ├─ DeviceMobileCard.tsx
│  │  │  │  ├─ DeviceRepairHistory.tsx
│  │  │  │  ├─ DeviceTable.tsx
│  │  │  │  └─ EmptyDeviceState.tsx
│  │  │  ├─ data
│  │  │  │  └─ mockdevice.ts
│  │  │  ├─ page.tsx
│  │  │  └─ types
│  │  │     └─ device.types.ts
│  │  ├─ dispatch
│  │  │  ├─ components
│  │  │  │  ├─ DispatchDrawer.tsx
│  │  │  │  ├─ DispatchFilters.tsx
│  │  │  │  ├─ DispatchHeader.tsx
│  │  │  │  ├─ DispatchTable.tsx
│  │  │  │  └─ types.ts
│  │  │  ├─ hooks
│  │  │  │  ├─ index.ts
│  │  │  │  └─ useDispatchApi.ts
│  │  │  ├─ mocks
│  │  │  │  ├─ dispatch.mock.ts
│  │  │  │  └─ types.ts
│  │  │  ├─ page.tsx
│  │  │  ├─ services
│  │  │  │  ├─ dispatch.service.ts
│  │  │  │  └─ index.ts
│  │  │  └─ types
│  │  │     └─ dispatch.types.ts
│  │  ├─ moderation
│  │  │  ├─ components
│  │  │  │  ├─ EvidenceViewerPanel
│  │  │  │  │  └─ index.tsx
│  │  │  │  ├─ ModerationActionDrawer
│  │  │  │  │  └─ index.tsx
│  │  │  │  └─ ReportSlaTable
│  │  │  │     └─ index.tsx
│  │  │  └─ page.tsx
│  │  ├─ quotes
│  │  │  ├─ components
│  │  │  │  ├─ QuoteActionDrawer
│  │  │  │  │  └─ index.tsx
│  │  │  │  ├─ QuoteDetailPanel
│  │  │  │  │  └─ index.tsx
│  │  │  │  ├─ QuoteFilterBar
│  │  │  │  │  └─ index.tsx
│  │  │  │  └─ QuoteMatrixTable
│  │  │  │     └─ index.tsx
│  │  │  ├─ hooks
│  │  │  │  ├─ index.ts
│  │  │  │  └─ useQuotesApi.ts
│  │  │  ├─ mocks
│  │  │  │  └─ quotesMock.ts
│  │  │  ├─ page.tsx
│  │  │  ├─ services
│  │  │  │  ├─ index.ts
│  │  │  │  └─ quote.service.ts
│  │  │  └─ types
│  │  │     └─ quote.types.ts
│  │  ├─ rag-knowledge
│  │  │  ├─ components
│  │  │  │  ├─ ChunkViewerPanel
│  │  │  │  │  └─ index.tsx
│  │  │  │  ├─ DocumentLifecycleGrid
│  │  │  │  │  └─ index.tsx
│  │  │  │  └─ KnowledgeActionDrawer
│  │  │  │     └─ index.tsx
│  │  │  └─ page.tsx
│  │  ├─ repair-sessions
│  │  │  ├─ components
│  │  │  │  ├─ AssignmentHistoryTimeline.tsx
│  │  │  │  ├─ CancelRepairSessionModal.tsx
│  │  │  │  ├─ DispatchActionPanel.tsx
│  │  │  │  ├─ ReassignTechnicianModal.tsx
│  │  │  │  ├─ RepairSessionAddressCard.tsx
│  │  │  │  ├─ RepairSessionAiSummaryCard.tsx
│  │  │  │  ├─ RepairSessionCustomerCard.tsx
│  │  │  │  ├─ RepairSessionDangerBadge.tsx
│  │  │  │  ├─ RepairSessionDetailPanel.tsx
│  │  │  │  ├─ RepairSessionDeviceCard.tsx
│  │  │  │  ├─ RepairSessionFilterBar.tsx
│  │  │  │  ├─ RepairSessionInfoCard.tsx
│  │  │  │  ├─ RepairSessionKpiCard.tsx
│  │  │  │  ├─ RepairSessionList.tsx
│  │  │  │  ├─ RepairSessionListItem.tsx
│  │  │  │  ├─ RepairSessionListPanel.tsx
│  │  │  │  ├─ RepairSessionMobileCard.tsx
│  │  │  │  ├─ RepairSessionsKpiGrid.tsx
│  │  │  │  ├─ RepairSessionsPageHeader.tsx
│  │  │  │  ├─ RepairSessionStatusBadge.tsx
│  │  │  │  ├─ RepairSessionStatusTabs.tsx
│  │  │  │  ├─ RepairSessionStuckBadge.tsx
│  │  │  │  ├─ RepairSessionSymptomCard.tsx
│  │  │  │  ├─ RepairSessionTimeline.tsx
│  │  │  │  ├─ RepairSessionWorkspace.tsx
│  │  │  │  ├─ UnassignTechnicianModal.tsx
│  │  │  │  ├─ UpdateStatusDisabledTooltip.tsx
│  │  │  │  └─ _InfoCard.tsx
│  │  │  ├─ constants
│  │  │  │  └─ repairSession.constants.ts
│  │  │  ├─ hooks
│  │  │  │  ├─ index.ts
│  │  │  │  ├─ useRepairSessionFilters.ts
│  │  │  │  └─ useRepairSessionsApi.ts
│  │  │  ├─ mocks
│  │  │  │  └─ repairSessions.mock.ts
│  │  │  ├─ page.tsx
│  │  │  ├─ services
│  │  │  │  ├─ index.ts
│  │  │  │  └─ repairSession.service.ts
│  │  │  ├─ types
│  │  │  │  └─ repairSession.types.ts
│  │  │  └─ utils
│  │  │     ├─ repairSessionFormatters.ts
│  │  │     ├─ repairSessionRules.ts
│  │  │     └─ repairSessionStatusMeta.ts
│  │  ├─ Reviews
│  │  │  ├─ components
│  │  │  │  ├─ detail
│  │  │  │  │  └─ ReviewDetailPanel.tsx
│  │  │  │  ├─ filter
│  │  │  │  │  └─ ReviewFilterBar.tsx
│  │  │  │  ├─ layout
│  │  │  │  │  ├─ ReviewHeader.tsx
│  │  │  │  │  └─ ReviewKpiGrid.tsx
│  │  │  │  ├─ shared
│  │  │  │  │  ├─ ReviewRatingStars.tsx
│  │  │  │  │  ├─ ReviewSentimentBadge.tsx
│  │  │  │  │  └─ ReviewTagBadge.tsx
│  │  │  │  └─ table
│  │  │  │     └─ ReviewTable.tsx
│  │  │  ├─ Data
│  │  │  │  └─ mockReviews.ts
│  │  │  ├─ lib
│  │  │  │  └─ reviewHelpers.ts
│  │  │  ├─ page.tsx
│  │  │  └─ types
│  │  │     └─ review.types.ts
│  │  ├─ techinical-document
│  │  │  ├─ components
│  │  │  │  ├─ TechnicalDocumentFilterBar.tsx
│  │  │  │  ├─ TechnicalDocumentFormModal.tsx
│  │  │  │  ├─ TechnicalDocumentKpiGrid.tsx
│  │  │  │  └─ TechnicalDocumentTable.tsx
│  │  │  ├─ lib
│  │  │  │  └─ technicalDocumentHelpers.ts
│  │  │  ├─ mocks
│  │  │  │  └─ technicalDocumentsMock.ts
│  │  │  ├─ page.tsx
│  │  │  └─ types
│  │  │     └─ technicalDocument.types.ts
│  │  ├─ technicians
│  │  │  ├─ components
│  │  │  │  ├─ TechnicianExpandedPanel.tsx
│  │  │  │  ├─ TechnicianFilters.tsx
│  │  │  │  ├─ TechnicianHeader.tsx
│  │  │  │  ├─ TechnicianKpiGrid.tsx
│  │  │  │  ├─ TechnicianPagination.tsx
│  │  │  │  ├─ TechnicianStatusBadge.tsx
│  │  │  │  └─ TechnicianTable.tsx
│  │  │  ├─ hooks
│  │  │  │  ├─ index.ts
│  │  │  │  └─ useTechnicians.ts
│  │  │  ├─ mocks
│  │  │  │  └─ technicians.mock.ts
│  │  │  ├─ page.tsx
│  │  │  ├─ services
│  │  │  │  ├─ index.ts
│  │  │  │  └─ technicianAdmin.service.ts
│  │  │  ├─ types
│  │  │  │  └─ technician.types.ts
│  │  │  └─ utils
│  │  │     └─ technicianStatusMeta.ts
│  │  └─ _shared
│  │     └─ services
│  │        └─ adminSessionSource.ts
│  ├─ auth
│  │  ├─ forgot-password
│  │  │  └─ page.tsx
│  │  ├─ hooks
│  │  │  └─ useAuthApi.ts
│  │  ├─ login
│  │  │  └─ page.tsx
│  │  ├─ register
│  │  │  └─ page.tsx
│  │  ├─ services
│  │  │  └─ auth.service.ts
│  │  ├─ update-profile
│  │  │  └─ page.tsx
│  │  └─ utils
│  │     └─ session.ts
│  ├─ components
│  │  ├─ bottomnavComponents.tsx
│  │  ├─ client
│  │  │  └─ header
│  │  │     ├─ ClientHeader.tsx
│  │  │     ├─ constants.ts
│  │  │     ├─ HeaderActions.tsx
│  │  │     ├─ HeaderLogo.tsx
│  │  │     ├─ HeaderNav.tsx
│  │  │     ├─ LoginButton.tsx
│  │  │     ├─ ocean-theme-transition.css
│  │  │     ├─ README.md
│  │  │     ├─ ThemeToggleButton.tsx
│  │  │     ├─ types.ts
│  │  │     ├─ useOceanThemeTransition.ts
│  │  │     ├─ UserMenu.tsx
│  │  │     └─ useThemeToggle.ts
│  │  ├─ inputComponents.tsx
│  │  ├─ navbarComponents.tsx
│  │  └─ Pagination.tsx
│  ├─ config
│  │  └─ routes.ts
│  ├─ favicon.ico
│  ├─ globals.css
│  ├─ hooks
│  │  ├─ common
│  │  │  ├─ index.ts
│  │  │  ├─ useAiApi.ts
│  │  │  ├─ useAsyncAction.ts
│  │  │  ├─ useAuthApi.ts
│  │  │  ├─ useChatHistoryApi.ts
│  │  │  ├─ useChatsApi.ts
│  │  │  ├─ useDevicesApi.ts
│  │  │  ├─ useMechanicAiApi.ts
│  │  │  ├─ useNotificationsApi.ts
│  │  │  ├─ useRagApi.ts
│  │  │  ├─ useUploadApi.ts
│  │  │  └─ useUsersApi.ts
│  │  ├─ customer
│  │  ├─ index.ts
│  │  ├─ useAccountsApi.ts
│  │  ├─ useChatbotApi.ts
│  │  ├─ useChatsApi.ts
│  │  ├─ useQuotesApi.ts
│  │  ├─ useRepairSessionsApi.ts
│  │  └─ useUtilities.ts
│  ├─ image
│  │  └─ logo6.webp
│  ├─ layout.tsx
│  └─ services
│     ├─ account.service.ts
│     ├─ apiClient.ts
│     ├─ authorization.service.ts
│     ├─ chat.service.ts
│     ├─ chatbot.service.ts
│     ├─ common
│     │  ├─ ai.service.ts
│     │  ├─ auth.service.ts
│     │  ├─ chat-history.service.ts
│     │  ├─ chats.service.ts
│     │  ├─ devices.service.ts
│     │  ├─ index.ts
│     │  ├─ mechanic-ai.service.ts
│     │  ├─ notifications.service.ts
│     │  ├─ rag.service.ts
│     │  ├─ types.ts
│     │  ├─ upload.service.ts
│     │  └─ users.service.ts
│     ├─ customer.service.ts
│     ├─ quote.service.ts
│     └─ repairSession.service.ts
├─ devcheck.err.log
├─ devcheck.out.log
├─ eslint.config.mjs
├─ frontend-test.err.log
├─ frontend-test.out.log
├─ logo.png
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ proxy.ts
├─ public
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ images
│  │  └─ process
│  │     ├─ step-1-request.jpg
│  │     ├─ step-2-receive.jpg
│  │     ├─ step-3-assign.jpg
│  │     └─ step-4-check.jpg
│  ├─ next.svg
│  ├─ vercel.svg
│  ├─ videos
│  │  └─ company-demo.mp4
│  └─ window.svg
├─ README.md
├─ scripts
│  └─ dev.cjs
├─ tsconfig.admin-ops.json
├─ tsconfig.admin-pages.json
├─ tsconfig.common-api.json
└─ tsconfig.json

```
```
fe_chatbot_website
├─ .sixth
│  └─ skills
│     ├─ coding
│     │  ├─ AGENTS.md
│     │  ├─ Examples.md
│     │  └─ README.md
│     └─ layout
│        ├─ 00_README_READ_ORDER.md
│        ├─ 01_PROJECT_UI_DIRECTION.md
│        ├─ 02_DESIGN_SYSTEM_TOKENS.md
│        ├─ 03_LAYOUT_RULES_AND_PATTERNS.md
│        ├─ 04_COMPONENT_AND_STATE_STANDARDS.md
│        ├─ 05_RESPONSIVE_ACCESSIBILITY_AND_PRODUCTION.md
│        ├─ 06_CODEX_MASTER_PROMPT.md
│        └─ 07_FINAL_REVIEW_CHECKLIST.md
├─ AGENTS.md
├─ app
│  ├─ (client)
│  │  ├─ chatbot
│  │  │  └─ page.tsx
│  │  ├─ faqchat
│  │  │  └─ page.tsx
│  │  ├─ layout.tsx
│  │  ├─ orderhistory
│  │  │  └─ page.tsx
│  │  └─ page.tsx
│  ├─ admin
│  │  ├─ accounts
│  │  │  ├─ components
│  │  │  │  ├─ actions
│  │  │  │  │  ├─ AccountActionBar.tsx
│  │  │  │  │  ├─ AccountActionButton.tsx
│  │  │  │  │  ├─ AccountActionGroup.tsx
│  │  │  │  │  ├─ AccountActionLink.tsx
│  │  │  │  │  └─ AccountConfirmActionDialog.tsx
│  │  │  │  ├─ detail-panel
│  │  │  │  │  ├─ AccountDetailPanel.tsx
│  │  │  │  │  ├─ AccountGpsCard.tsx
│  │  │  │  │  ├─ AccountProfileCard.tsx
│  │  │  │  │  ├─ AccountRelatedDataCard.tsx
│  │  │  │  │  ├─ AccountStatusCard.tsx
│  │  │  │  │  └─ AccountWarningCard.tsx
│  │  │  │  ├─ dialogs
│  │  │  │  │  ├─ AccountChangeRoleDialog.tsx
│  │  │  │  │  ├─ AccountDeleteGuardDialog.tsx
│  │  │  │  │  ├─ AccountDetailModal.tsx
│  │  │  │  │  ├─ AccountLockDialog.tsx
│  │  │  │  │  ├─ AccountResetPasswordDialog.tsx
│  │  │  │  │  └─ AccountVerifyDialog.tsx
│  │  │  │  ├─ filters
│  │  │  │  │  ├─ AccountFilters.tsx
│  │  │  │  │  ├─ AccountRoleFilter.tsx
│  │  │  │  │  ├─ AccountSearchInput.tsx
│  │  │  │  │  ├─ AccountStatusFilter.tsx
│  │  │  │  │  └─ AccountVerifiedFilter.tsx
│  │  │  │  ├─ forms
│  │  │  │  │  ├─ AccountBaseFormFields.tsx
│  │  │  │  │  ├─ AccountCreateForm.tsx
│  │  │  │  │  ├─ AccountLocationFields.tsx
│  │  │  │  │  ├─ AccountPasswordFields.tsx
│  │  │  │  │  ├─ AccountRoleFields.tsx
│  │  │  │  │  └─ AccountUpdateForm.tsx
│  │  │  │  ├─ layout
│  │  │  │  │  ├─ AccountHeader.tsx
│  │  │  │  │  ├─ AccountKpiGrid.tsx
│  │  │  │  │  └─ AccountPageSection.tsx
│  │  │  │  ├─ logs
│  │  │  │  │  ├─ AccountAuditLogFilters.tsx
│  │  │  │  │  ├─ AccountAuditLogItem.tsx
│  │  │  │  │  └─ AccountAuditLogPanel.tsx
│  │  │  │  ├─ shared
│  │  │  │  │  ├─ AccountAvatar.tsx
│  │  │  │  │  ├─ AccountInfoRow.tsx
│  │  │  │  │  ├─ AccountOnlineDot.tsx
│  │  │  │  │  ├─ AccountRoleBadge.tsx
│  │  │  │  │  ├─ AccountStatusBadge.tsx
│  │  │  │  │  ├─ AccountVerifiedBadge.tsx
│  │  │  │  │  ├─ AdminPagination.tsx
│  │  │  │  │  └─ Pagination.tsx
│  │  │  │  └─ table
│  │  │  │     ├─ AccountDesktopRow.tsx
│  │  │  │     ├─ AccountEmptyState.tsx
│  │  │  │     ├─ AccountMobileCard.tsx
│  │  │  │     ├─ AccountMobileList.tsx
│  │  │  │     ├─ AccountTable.tsx
│  │  │  │     └─ AccountTableDesktop.tsx
│  │  │  ├─ constants
│  │  │  │  └─ account.constants.ts
│  │  │  ├─ create
│  │  │  │  └─ page.tsx
│  │  │  ├─ hooks
│  │  │  │  ├─ index.ts
│  │  │  │  └─ useAccounts.ts
│  │  │  ├─ mocks
│  │  │  │  └─ accounts.mock.ts
│  │  │  ├─ page.tsx
│  │  │  ├─ services
│  │  │  │  ├─ accountAdmin.service.ts
│  │  │  │  └─ index.ts
│  │  │  ├─ types
│  │  │  │  └─ account.types.ts
│  │  │  ├─ utils
│  │  │  │  ├─ accountFilters.ts
│  │  │  │  ├─ accountFormatters.ts
│  │  │  │  └─ accountValidation.ts
│  │  │  └─ [id]
│  │  │     ├─ edit
│  │  │     │  └─ page.tsx
│  │  │     ├─ logs
│  │  │     │  └─ page.tsx
│  │  │     └─ page.tsx
│  │  ├─ ai-consulting
│  │  │  ├─ components
│  │  │  │  ├─ AiKpiDashboard
│  │  │  │  │  └─ index.tsx
│  │  │  │  ├─ AiTranscriptTable
│  │  │  │  │  └─ index.tsx
│  │  │  │  └─ TranscriptDetailPanel
│  │  │  │     └─ index.tsx
│  │  │  ├─ hooks
│  │  │  │  ├─ index.ts
│  │  │  │  └─ useAiConsultingApi.ts
│  │  │  ├─ page.tsx
│  │  │  ├─ services
│  │  │  │  ├─ aiConsultingAdmin.service.ts
│  │  │  │  └─ index.ts
│  │  │  └─ types
│  │  │     └─ aiConsulting.types.ts
│  │  ├─ ai-reasoning-logs
│  │  │  ├─ components
│  │  │  │  ├─ AiReasoningBadges.tsx
│  │  │  │  ├─ AiReasoningFilterBar.tsx
│  │  │  │  ├─ AiReasoningHeader.tsx
│  │  │  │  ├─ AiReasoningKpiGrid.tsx
│  │  │  │  ├─ AiReasoningLogDetail.tsx
│  │  │  │  └─ AiReasoningLogList.tsx
│  │  │  ├─ data
│  │  │  │  └─ mockAiReasoningLogs.ts
│  │  │  ├─ hooks
│  │  │  │  ├─ index.ts
│  │  │  │  └─ useAiReasoningLogsApi.ts
│  │  │  ├─ lib
│  │  │  │  └─ aiReasoningHelpers.ts
│  │  │  ├─ page.tsx
│  │  │  ├─ services
│  │  │  │  ├─ aiReasoningAdmin.service.ts
│  │  │  │  └─ index.ts
│  │  │  └─ types
│  │  │     └─ aiReasoning.types.ts
│  │  ├─ chats
│  │  │  ├─ components
│  │  │  │  ├─ ChatActionDrawer
│  │  │  │  │  └─ index.tsx
│  │  │  │  ├─ Chatfillter
│  │  │  │  │  └─ ChatFilterBar.tsx
│  │  │  │  ├─ ChatThreadPanel
│  │  │  │  │  ├─ AttachmentBlock.tsx
│  │  │  │  │  ├─ index.tsx
│  │  │  │  │  └─ MessageBubble.tsx
│  │  │  │  └─ SessionListPanel
│  │  │  │     ├─ ChatSessionRow.tsx
│  │  │  │     └─ index.tsx
│  │  │  ├─ hooks
│  │  │  │  ├─ index.ts
│  │  │  │  └─ useChatsApi.ts
│  │  │  ├─ mocks
│  │  │  │  └─ chatMock.ts
│  │  │  ├─ page.tsx
│  │  │  ├─ services
│  │  │  │  ├─ chat.service.ts
│  │  │  │  └─ index.ts
│  │  │  └─ types
│  │  │     └─ chat.types.ts
│  │  ├─ dashboard
│  │  │  ├─ components
│  │  │  │  ├─ AuthLayout.tsx
│  │  │  │  ├─ dashboard
│  │  │  │  │  ├─ AdminShell.tsx
│  │  │  │  │  ├─ AdminSidebar.tsx
│  │  │  │  │  ├─ AdminTopbar.tsx
│  │  │  │  │  ├─ AiQualityCard.tsx
│  │  │  │  │  ├─ DashboardHeader.tsx
│  │  │  │  │  ├─ JobStatusDonutChart.tsx
│  │  │  │  │  ├─ KpiCard.tsx
│  │  │  │  │  ├─ KpiGrid.tsx
│  │  │  │  │  ├─ LiveJobsTable.tsx
│  │  │  │  │  ├─ mockData.ts
│  │  │  │  │  ├─ OnlineTechniciansTable.tsx
│  │  │  │  │  ├─ RecentActivityTimeline.tsx
│  │  │  │  │  ├─ RevenueLineChart.tsx
│  │  │  │  │  ├─ status.ts
│  │  │  │  │  ├─ SystemStatusBanner.tsx
│  │  │  │  │  ├─ TopDeviceBarChart.tsx
│  │  │  │  │  └─ types.ts
│  │  │  │  ├─ LoginForm.tsx
│  │  │  │  ├─ LogoHeader.tsx
│  │  │  │  └─ RoleTabs.tsx
│  │  │  ├─ hooks
│  │  │  │  └─ useDashboardApi.ts
│  │  │  ├─ page.tsx
│  │  │  └─ services
│  │  │     └─ dashboard.service.ts
│  │  ├─ Devices
│  │  │  ├─ components
│  │  │  │  ├─ DeviceDesktopRow.tsx
│  │  │  │  ├─ DeviceDetailPanel.tsx
│  │  │  │  ├─ DeviceFilters.tsx
│  │  │  │  ├─ DeviceHeader.tsx
│  │  │  │  ├─ DeviceInfoBox.tsx
│  │  │  │  ├─ DeviceKpiGrid.tsx
│  │  │  │  ├─ DeviceMobileCard.tsx
│  │  │  │  ├─ DeviceRepairHistory.tsx
│  │  │  │  ├─ DeviceTable.tsx
│  │  │  │  └─ EmptyDeviceState.tsx
│  │  │  ├─ data
│  │  │  │  └─ mockdevice.ts
│  │  │  ├─ hooks
│  │  │  │  └─ useAdminDevices.ts
│  │  │  ├─ page.tsx
│  │  │  ├─ services
│  │  │  │  └─ deviceAdmin.service.ts
│  │  │  └─ types
│  │  │     └─ device.types.ts
│  │  ├─ dispatch
│  │  │  ├─ components
│  │  │  │  ├─ DispatchDrawer.tsx
│  │  │  │  ├─ DispatchFilters.tsx
│  │  │  │  ├─ DispatchHeader.tsx
│  │  │  │  ├─ DispatchTable.tsx
│  │  │  │  └─ types.ts
│  │  │  ├─ hooks
│  │  │  │  ├─ index.ts
│  │  │  │  └─ useDispatchApi.ts
│  │  │  ├─ mocks
│  │  │  │  ├─ dispatch.mock.ts
│  │  │  │  └─ types.ts
│  │  │  ├─ page.tsx
│  │  │  ├─ services
│  │  │  │  ├─ dispatch.service.ts
│  │  │  │  └─ index.ts
│  │  │  └─ types
│  │  │     └─ dispatch.types.ts
│  │  ├─ moderation
│  │  │  ├─ components
│  │  │  │  ├─ EvidenceViewerPanel
│  │  │  │  │  └─ index.tsx
│  │  │  │  ├─ ModerationActionDrawer
│  │  │  │  │  └─ index.tsx
│  │  │  │  └─ ReportSlaTable
│  │  │  │     └─ index.tsx
│  │  │  ├─ hooks
│  │  │  │  ├─ index.ts
│  │  │  │  └─ useModerationApi.ts
│  │  │  ├─ page.tsx
│  │  │  ├─ services
│  │  │  │  ├─ index.ts
│  │  │  │  └─ moderationAdmin.service.ts
│  │  │  └─ types
│  │  │     └─ moderation.types.ts
│  │  ├─ quotes
│  │  │  ├─ components
│  │  │  │  ├─ QuoteActionDrawer
│  │  │  │  │  └─ index.tsx
│  │  │  │  ├─ QuoteDetailPanel
│  │  │  │  │  └─ index.tsx
│  │  │  │  ├─ QuoteFilterBar
│  │  │  │  │  └─ index.tsx
│  │  │  │  └─ QuoteMatrixTable
│  │  │  │     └─ index.tsx
│  │  │  ├─ hooks
│  │  │  │  ├─ index.ts
│  │  │  │  └─ useQuotesApi.ts
│  │  │  ├─ mocks
│  │  │  │  └─ quotesMock.ts
│  │  │  ├─ page.tsx
│  │  │  ├─ services
│  │  │  │  ├─ index.ts
│  │  │  │  └─ quote.service.ts
│  │  │  └─ types
│  │  │     └─ quote.types.ts
│  │  ├─ rag-knowledge
│  │  │  ├─ components
│  │  │  │  ├─ ChunkViewerPanel
│  │  │  │  │  └─ index.tsx
│  │  │  │  ├─ DocumentLifecycleGrid
│  │  │  │  │  └─ index.tsx
│  │  │  │  └─ KnowledgeActionDrawer
│  │  │  │     └─ index.tsx
│  │  │  └─ page.tsx
│  │  ├─ repair-sessions
│  │  │  ├─ components
│  │  │  │  ├─ AssignmentHistoryTimeline.tsx
│  │  │  │  ├─ CancelRepairSessionModal.tsx
│  │  │  │  ├─ DispatchActionPanel.tsx
│  │  │  │  ├─ ReassignTechnicianModal.tsx
│  │  │  │  ├─ RepairSessionAddressCard.tsx
│  │  │  │  ├─ RepairSessionAiSummaryCard.tsx
│  │  │  │  ├─ RepairSessionCustomerCard.tsx
│  │  │  │  ├─ RepairSessionDangerBadge.tsx
│  │  │  │  ├─ RepairSessionDetailPanel.tsx
│  │  │  │  ├─ RepairSessionDeviceCard.tsx
│  │  │  │  ├─ RepairSessionFilterBar.tsx
│  │  │  │  ├─ RepairSessionInfoCard.tsx
│  │  │  │  ├─ RepairSessionKpiCard.tsx
│  │  │  │  ├─ RepairSessionList.tsx
│  │  │  │  ├─ RepairSessionListItem.tsx
│  │  │  │  ├─ RepairSessionListPanel.tsx
│  │  │  │  ├─ RepairSessionMobileCard.tsx
│  │  │  │  ├─ RepairSessionsKpiGrid.tsx
│  │  │  │  ├─ RepairSessionsPageHeader.tsx
│  │  │  │  ├─ RepairSessionStatusBadge.tsx
│  │  │  │  ├─ RepairSessionStatusTabs.tsx
│  │  │  │  ├─ RepairSessionStuckBadge.tsx
│  │  │  │  ├─ RepairSessionSymptomCard.tsx
│  │  │  │  ├─ RepairSessionTimeline.tsx
│  │  │  │  ├─ RepairSessionWorkspace.tsx
│  │  │  │  ├─ UnassignTechnicianModal.tsx
│  │  │  │  ├─ UpdateStatusDisabledTooltip.tsx
│  │  │  │  └─ _InfoCard.tsx
│  │  │  ├─ constants
│  │  │  │  └─ repairSession.constants.ts
│  │  │  ├─ hooks
│  │  │  │  ├─ index.ts
│  │  │  │  ├─ useRepairSessionFilters.ts
│  │  │  │  └─ useRepairSessionsApi.ts
│  │  │  ├─ mocks
│  │  │  │  └─ repairSessions.mock.ts
│  │  │  ├─ page.tsx
│  │  │  ├─ services
│  │  │  │  ├─ index.ts
│  │  │  │  └─ repairSession.service.ts
│  │  │  ├─ types
│  │  │  │  └─ repairSession.types.ts
│  │  │  └─ utils
│  │  │     ├─ repairSessionFormatters.ts
│  │  │     ├─ repairSessionRules.ts
│  │  │     └─ repairSessionStatusMeta.ts
│  │  ├─ Reviews
│  │  │  ├─ components
│  │  │  │  ├─ detail
│  │  │  │  │  └─ ReviewDetailPanel.tsx
│  │  │  │  ├─ filter
│  │  │  │  │  └─ ReviewFilterBar.tsx
│  │  │  │  ├─ layout
│  │  │  │  │  ├─ ReviewHeader.tsx
│  │  │  │  │  └─ ReviewKpiGrid.tsx
│  │  │  │  ├─ shared
│  │  │  │  │  ├─ ReviewRatingStars.tsx
│  │  │  │  │  ├─ ReviewSentimentBadge.tsx
│  │  │  │  │  └─ ReviewTagBadge.tsx
│  │  │  │  └─ table
│  │  │  │     └─ ReviewTable.tsx
│  │  │  ├─ Data
│  │  │  │  └─ mockReviews.ts
│  │  │  ├─ hooks
│  │  │  │  ├─ index.ts
│  │  │  │  └─ useReviewsApi.ts
│  │  │  ├─ lib
│  │  │  │  └─ reviewHelpers.ts
│  │  │  ├─ page.tsx
│  │  │  ├─ services
│  │  │  │  ├─ index.ts
│  │  │  │  └─ reviewAdmin.service.ts
│  │  │  └─ types
│  │  │     └─ review.types.ts
│  │  ├─ techinical-document
│  │  │  ├─ components
│  │  │  │  ├─ TechnicalDocumentFilterBar.tsx
│  │  │  │  ├─ TechnicalDocumentFormModal.tsx
│  │  │  │  ├─ TechnicalDocumentKpiGrid.tsx
│  │  │  │  ├─ TechnicalDocumentsAdminContent.tsx
│  │  │  │  └─ TechnicalDocumentTable.tsx
│  │  │  ├─ hooks
│  │  │  │  └─ useTechnicalDocumentsApi.ts
│  │  │  ├─ lib
│  │  │  │  └─ technicalDocumentHelpers.ts
│  │  │  ├─ mocks
│  │  │  │  └─ technicalDocumentsMock.ts
│  │  │  ├─ page.tsx
│  │  │  ├─ services
│  │  │  │  └─ technicalDocumentAdmin.service.ts
│  │  │  └─ types
│  │  │     └─ technicalDocument.types.ts
│  │  ├─ technicians
│  │  │  ├─ components
│  │  │  │  ├─ TechnicianExpandedPanel.tsx
│  │  │  │  ├─ TechnicianFilters.tsx
│  │  │  │  ├─ TechnicianHeader.tsx
│  │  │  │  ├─ TechnicianKpiGrid.tsx
│  │  │  │  ├─ TechnicianPagination.tsx
│  │  │  │  ├─ TechnicianStatusBadge.tsx
│  │  │  │  └─ TechnicianTable.tsx
│  │  │  ├─ hooks
│  │  │  │  ├─ index.ts
│  │  │  │  └─ useTechnicians.ts
│  │  │  ├─ mocks
│  │  │  │  └─ technicians.mock.ts
│  │  │  ├─ page.tsx
│  │  │  ├─ services
│  │  │  │  ├─ index.ts
│  │  │  │  └─ technicianAdmin.service.ts
│  │  │  ├─ types
│  │  │  │  └─ technician.types.ts
│  │  │  └─ utils
│  │  │     └─ technicianStatusMeta.ts
│  │  └─ _shared
│  │     └─ services
│  │        └─ adminSessionSource.ts
│  ├─ auth
│  │  ├─ forgot-password
│  │  │  └─ page.tsx
│  │  ├─ hooks
│  │  │  └─ useAuthApi.ts
│  │  ├─ login
│  │  │  └─ page.tsx
│  │  ├─ register
│  │  │  └─ page.tsx
│  │  ├─ services
│  │  │  └─ auth.service.ts
│  │  ├─ update-profile
│  │  │  └─ page.tsx
│  │  └─ utils
│  │     └─ session.ts
│  ├─ components
│  │  ├─ bottomnavComponents.tsx
│  │  ├─ client
│  │  │  └─ header
│  │  │     ├─ ClientHeader.tsx
│  │  │     ├─ constants.ts
│  │  │     ├─ HeaderActions.tsx
│  │  │     ├─ HeaderLogo.tsx
│  │  │     ├─ HeaderNav.tsx
│  │  │     ├─ LoginButton.tsx
│  │  │     ├─ ocean-theme-transition.css
│  │  │     ├─ README.md
│  │  │     ├─ ThemeToggleButton.tsx
│  │  │     ├─ types.ts
│  │  │     ├─ useOceanThemeTransition.ts
│  │  │     ├─ UserMenu.tsx
│  │  │     └─ useThemeToggle.ts
│  │  ├─ inputComponents.tsx
│  │  ├─ navbarComponents.tsx
│  │  └─ Pagination.tsx
│  ├─ config
│  │  └─ routes.ts
│  ├─ favicon.ico
│  ├─ globals.css
│  ├─ hooks
│  │  ├─ common
│  │  │  ├─ index.ts
│  │  │  ├─ useAiApi.ts
│  │  │  ├─ useAsyncAction.ts
│  │  │  ├─ useAuthApi.ts
│  │  │  ├─ useChatHistoryApi.ts
│  │  │  ├─ useChatsApi.ts
│  │  │  ├─ useDevicesApi.ts
│  │  │  ├─ useMechanicAiApi.ts
│  │  │  ├─ useNotificationsApi.ts
│  │  │  ├─ useRagApi.ts
│  │  │  ├─ useUploadApi.ts
│  │  │  └─ useUsersApi.ts
│  │  ├─ customer
│  │  ├─ index.ts
│  │  ├─ useAccountsApi.ts
│  │  ├─ useChatbotApi.ts
│  │  ├─ useChatsApi.ts
│  │  ├─ useQuotesApi.ts
│  │  ├─ useRepairSessionsApi.ts
│  │  └─ useUtilities.ts
│  ├─ image
│  │  └─ logo6.webp
│  ├─ layout.tsx
│  └─ services
│     ├─ account.service.ts
│     ├─ apiClient.ts
│     ├─ authorization.service.ts
│     ├─ chat.service.ts
│     ├─ chatbot.service.ts
│     ├─ common
│     │  ├─ ai.service.ts
│     │  ├─ auth.service.ts
│     │  ├─ chat-history.service.ts
│     │  ├─ chats.service.ts
│     │  ├─ devices.service.ts
│     │  ├─ index.ts
│     │  ├─ mechanic-ai.service.ts
│     │  ├─ notifications.service.ts
│     │  ├─ rag.service.ts
│     │  ├─ types.ts
│     │  ├─ upload.service.ts
│     │  └─ users.service.ts
│     ├─ customer.service.ts
│     ├─ quote.service.ts
│     └─ repairSession.service.ts
├─ codex-frontend.err.log
├─ codex-frontend.log
├─ devcheck.err.log
├─ devcheck.out.log
├─ eslint.config.mjs
├─ frontend-test.err.log
├─ frontend-test.out.log
├─ logo.png
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ proxy.ts
├─ public
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ images
│  │  └─ process
│  │     ├─ step-1-request.jpg
│  │     ├─ step-2-receive.jpg
│  │     ├─ step-3-assign.jpg
│  │     └─ step-4-check.jpg
│  ├─ next.svg
│  ├─ vercel.svg
│  ├─ videos
│  │  └─ company-demo.mp4
│  └─ window.svg
├─ README.md
├─ scripts
│  └─ dev.cjs
├─ tsconfig.admin-hooks-extra.json
├─ tsconfig.admin-missing.json
├─ tsconfig.admin-ops.json
├─ tsconfig.admin-pages.json
├─ tsconfig.common-api.json
└─ tsconfig.json

```
```
fe_chatbot_website
├─ .sixth
│  └─ skills
│     ├─ coding
│     │  ├─ AGENTS.md
│     │  ├─ Examples.md
│     │  └─ README.md
│     └─ layout
│        ├─ 00_README_READ_ORDER.md
│        ├─ 01_PROJECT_UI_DIRECTION.md
│        ├─ 02_DESIGN_SYSTEM_TOKENS.md
│        ├─ 03_LAYOUT_RULES_AND_PATTERNS.md
│        ├─ 04_COMPONENT_AND_STATE_STANDARDS.md
│        ├─ 05_RESPONSIVE_ACCESSIBILITY_AND_PRODUCTION.md
│        ├─ 06_CODEX_MASTER_PROMPT.md
│        └─ 07_FINAL_REVIEW_CHECKLIST.md
├─ AGENTS.md
├─ app
│  ├─ (client)
│  │  ├─ chatbot
│  │  │  └─ page.tsx
│  │  ├─ faqchat
│  │  │  └─ page.tsx
│  │  ├─ layout.tsx
│  │  ├─ orderhistory
│  │  │  └─ page.tsx
│  │  └─ page.tsx
│  ├─ admin
│  │  ├─ accounts
│  │  │  ├─ components
│  │  │  │  ├─ actions
│  │  │  │  │  ├─ AccountActionBar.tsx
│  │  │  │  │  ├─ AccountActionButton.tsx
│  │  │  │  │  ├─ AccountActionGroup.tsx
│  │  │  │  │  ├─ AccountActionLink.tsx
│  │  │  │  │  └─ AccountConfirmActionDialog.tsx
│  │  │  │  ├─ detail-panel
│  │  │  │  │  ├─ AccountDetailPanel.tsx
│  │  │  │  │  ├─ AccountGpsCard.tsx
│  │  │  │  │  ├─ AccountProfileCard.tsx
│  │  │  │  │  ├─ AccountRelatedDataCard.tsx
│  │  │  │  │  ├─ AccountStatusCard.tsx
│  │  │  │  │  └─ AccountWarningCard.tsx
│  │  │  │  ├─ dialogs
│  │  │  │  │  ├─ AccountChangeRoleDialog.tsx
│  │  │  │  │  ├─ AccountDeleteGuardDialog.tsx
│  │  │  │  │  ├─ AccountDetailModal.tsx
│  │  │  │  │  ├─ AccountLockDialog.tsx
│  │  │  │  │  ├─ AccountResetPasswordDialog.tsx
│  │  │  │  │  └─ AccountVerifyDialog.tsx
│  │  │  │  ├─ filters
│  │  │  │  │  ├─ AccountFilters.tsx
│  │  │  │  │  ├─ AccountRoleFilter.tsx
│  │  │  │  │  ├─ AccountSearchInput.tsx
│  │  │  │  │  ├─ AccountStatusFilter.tsx
│  │  │  │  │  └─ AccountVerifiedFilter.tsx
│  │  │  │  ├─ forms
│  │  │  │  │  ├─ AccountBaseFormFields.tsx
│  │  │  │  │  ├─ AccountCreateForm.tsx
│  │  │  │  │  ├─ AccountLocationFields.tsx
│  │  │  │  │  ├─ AccountPasswordFields.tsx
│  │  │  │  │  ├─ AccountRoleFields.tsx
│  │  │  │  │  └─ AccountUpdateForm.tsx
│  │  │  │  ├─ layout
│  │  │  │  │  ├─ AccountHeader.tsx
│  │  │  │  │  ├─ AccountKpiGrid.tsx
│  │  │  │  │  └─ AccountPageSection.tsx
│  │  │  │  ├─ logs
│  │  │  │  │  ├─ AccountAuditLogFilters.tsx
│  │  │  │  │  ├─ AccountAuditLogItem.tsx
│  │  │  │  │  └─ AccountAuditLogPanel.tsx
│  │  │  │  ├─ shared
│  │  │  │  │  ├─ AccountAvatar.tsx
│  │  │  │  │  ├─ AccountInfoRow.tsx
│  │  │  │  │  ├─ AccountOnlineDot.tsx
│  │  │  │  │  ├─ AccountRoleBadge.tsx
│  │  │  │  │  ├─ AccountStatusBadge.tsx
│  │  │  │  │  ├─ AccountVerifiedBadge.tsx
│  │  │  │  │  ├─ AdminPagination.tsx
│  │  │  │  │  └─ Pagination.tsx
│  │  │  │  └─ table
│  │  │  │     ├─ AccountDesktopRow.tsx
│  │  │  │     ├─ AccountEmptyState.tsx
│  │  │  │     ├─ AccountMobileCard.tsx
│  │  │  │     ├─ AccountMobileList.tsx
│  │  │  │     ├─ AccountTable.tsx
│  │  │  │     └─ AccountTableDesktop.tsx
│  │  │  ├─ constants
│  │  │  │  └─ account.constants.ts
│  │  │  ├─ create
│  │  │  │  └─ page.tsx
│  │  │  ├─ hooks
│  │  │  │  ├─ index.ts
│  │  │  │  └─ useAccounts.ts
│  │  │  ├─ mocks
│  │  │  │  └─ accounts.mock.ts
│  │  │  ├─ page.tsx
│  │  │  ├─ services
│  │  │  │  ├─ accountAdmin.service.ts
│  │  │  │  └─ index.ts
│  │  │  ├─ types
│  │  │  │  └─ account.types.ts
│  │  │  ├─ utils
│  │  │  │  ├─ accountFilters.ts
│  │  │  │  ├─ accountFormatters.ts
│  │  │  │  └─ accountValidation.ts
│  │  │  └─ [id]
│  │  │     ├─ edit
│  │  │     │  └─ page.tsx
│  │  │     ├─ logs
│  │  │     │  └─ page.tsx
│  │  │     └─ page.tsx
│  │  ├─ ai-consulting
│  │  │  ├─ components
│  │  │  │  ├─ AiKpiDashboard
│  │  │  │  │  └─ index.tsx
│  │  │  │  ├─ AiTranscriptTable
│  │  │  │  │  └─ index.tsx
│  │  │  │  └─ TranscriptDetailPanel
│  │  │  │     └─ index.tsx
│  │  │  ├─ hooks
│  │  │  │  ├─ index.ts
│  │  │  │  └─ useAiConsultingApi.ts
│  │  │  ├─ page.tsx
│  │  │  ├─ services
│  │  │  │  ├─ aiConsultingAdmin.service.ts
│  │  │  │  └─ index.ts
│  │  │  └─ types
│  │  │     └─ aiConsulting.types.ts
│  │  ├─ ai-reasoning-logs
│  │  │  ├─ components
│  │  │  │  ├─ AiReasoningBadges.tsx
│  │  │  │  ├─ AiReasoningFilterBar.tsx
│  │  │  │  ├─ AiReasoningHeader.tsx
│  │  │  │  ├─ AiReasoningKpiGrid.tsx
│  │  │  │  ├─ AiReasoningLogDetail.tsx
│  │  │  │  └─ AiReasoningLogList.tsx
│  │  │  ├─ data
│  │  │  │  └─ mockAiReasoningLogs.ts
│  │  │  ├─ hooks
│  │  │  │  ├─ index.ts
│  │  │  │  └─ useAiReasoningLogsApi.ts
│  │  │  ├─ lib
│  │  │  │  └─ aiReasoningHelpers.ts
│  │  │  ├─ page.tsx
│  │  │  ├─ services
│  │  │  │  ├─ aiReasoningAdmin.service.ts
│  │  │  │  └─ index.ts
│  │  │  └─ types
│  │  │     └─ aiReasoning.types.ts
│  │  ├─ chats
│  │  │  ├─ components
│  │  │  │  ├─ ChatActionDrawer
│  │  │  │  │  └─ index.tsx
│  │  │  │  ├─ Chatfillter
│  │  │  │  │  └─ ChatFilterBar.tsx
│  │  │  │  ├─ ChatThreadPanel
│  │  │  │  │  ├─ AttachmentBlock.tsx
│  │  │  │  │  ├─ index.tsx
│  │  │  │  │  └─ MessageBubble.tsx
│  │  │  │  └─ SessionListPanel
│  │  │  │     ├─ ChatSessionRow.tsx
│  │  │  │     └─ index.tsx
│  │  │  ├─ hooks
│  │  │  │  ├─ index.ts
│  │  │  │  └─ useChatsApi.ts
│  │  │  ├─ mocks
│  │  │  │  └─ chatMock.ts
│  │  │  ├─ page.tsx
│  │  │  ├─ services
│  │  │  │  ├─ chat.service.ts
│  │  │  │  └─ index.ts
│  │  │  └─ types
│  │  │     └─ chat.types.ts
│  │  ├─ dashboard
│  │  │  ├─ components
│  │  │  │  ├─ AuthLayout.tsx
│  │  │  │  ├─ dashboard
│  │  │  │  │  ├─ AdminShell.tsx
│  │  │  │  │  ├─ AdminSidebar.tsx
│  │  │  │  │  ├─ AdminTopbar.tsx
│  │  │  │  │  ├─ AiQualityCard.tsx
│  │  │  │  │  ├─ DashboardHeader.tsx
│  │  │  │  │  ├─ JobStatusDonutChart.tsx
│  │  │  │  │  ├─ KpiCard.tsx
│  │  │  │  │  ├─ KpiGrid.tsx
│  │  │  │  │  ├─ LiveJobsTable.tsx
│  │  │  │  │  ├─ mockData.ts
│  │  │  │  │  ├─ OnlineTechniciansTable.tsx
│  │  │  │  │  ├─ RecentActivityTimeline.tsx
│  │  │  │  │  ├─ RevenueLineChart.tsx
│  │  │  │  │  ├─ status.ts
│  │  │  │  │  ├─ SystemStatusBanner.tsx
│  │  │  │  │  ├─ TopDeviceBarChart.tsx
│  │  │  │  │  └─ types.ts
│  │  │  │  ├─ LoginForm.tsx
│  │  │  │  ├─ LogoHeader.tsx
│  │  │  │  └─ RoleTabs.tsx
│  │  │  ├─ hooks
│  │  │  │  └─ useDashboardApi.ts
│  │  │  ├─ page.tsx
│  │  │  └─ services
│  │  │     └─ dashboard.service.ts
│  │  ├─ Devices
│  │  │  ├─ components
│  │  │  │  ├─ DeviceDesktopRow.tsx
│  │  │  │  ├─ DeviceDetailPanel.tsx
│  │  │  │  ├─ DeviceFilters.tsx
│  │  │  │  ├─ DeviceHeader.tsx
│  │  │  │  ├─ DeviceInfoBox.tsx
│  │  │  │  ├─ DeviceKpiGrid.tsx
│  │  │  │  ├─ DeviceMobileCard.tsx
│  │  │  │  ├─ DeviceRepairHistory.tsx
│  │  │  │  ├─ DeviceTable.tsx
│  │  │  │  └─ EmptyDeviceState.tsx
│  │  │  ├─ data
│  │  │  │  └─ mockdevice.ts
│  │  │  ├─ hooks
│  │  │  │  └─ useAdminDevices.ts
│  │  │  ├─ page.tsx
│  │  │  ├─ services
│  │  │  │  └─ deviceAdmin.service.ts
│  │  │  └─ types
│  │  │     └─ device.types.ts
│  │  ├─ dispatch
│  │  │  ├─ components
│  │  │  │  ├─ DispatchDrawer.tsx
│  │  │  │  ├─ DispatchFilters.tsx
│  │  │  │  ├─ DispatchHeader.tsx
│  │  │  │  ├─ DispatchTable.tsx
│  │  │  │  └─ types.ts
│  │  │  ├─ hooks
│  │  │  │  ├─ index.ts
│  │  │  │  └─ useDispatchApi.ts
│  │  │  ├─ mocks
│  │  │  │  ├─ dispatch.mock.ts
│  │  │  │  └─ types.ts
│  │  │  ├─ page.tsx
│  │  │  ├─ services
│  │  │  │  ├─ dispatch.service.ts
│  │  │  │  └─ index.ts
│  │  │  └─ types
│  │  │     └─ dispatch.types.ts
│  │  ├─ moderation
│  │  │  ├─ components
│  │  │  │  ├─ EvidenceViewerPanel
│  │  │  │  │  └─ index.tsx
│  │  │  │  ├─ ModerationActionDrawer
│  │  │  │  │  └─ index.tsx
│  │  │  │  └─ ReportSlaTable
│  │  │  │     └─ index.tsx
│  │  │  ├─ hooks
│  │  │  │  ├─ index.ts
│  │  │  │  └─ useModerationApi.ts
│  │  │  ├─ page.tsx
│  │  │  ├─ services
│  │  │  │  ├─ index.ts
│  │  │  │  └─ moderationAdmin.service.ts
│  │  │  └─ types
│  │  │     └─ moderation.types.ts
│  │  ├─ quotes
│  │  │  ├─ components
│  │  │  │  ├─ QuoteActionDrawer
│  │  │  │  │  └─ index.tsx
│  │  │  │  ├─ QuoteDetailPanel
│  │  │  │  │  └─ index.tsx
│  │  │  │  ├─ QuoteFilterBar
│  │  │  │  │  └─ index.tsx
│  │  │  │  └─ QuoteMatrixTable
│  │  │  │     └─ index.tsx
│  │  │  ├─ hooks
│  │  │  │  ├─ index.ts
│  │  │  │  └─ useQuotesApi.ts
│  │  │  ├─ mocks
│  │  │  │  └─ quotesMock.ts
│  │  │  ├─ page.tsx
│  │  │  ├─ services
│  │  │  │  ├─ index.ts
│  │  │  │  └─ quote.service.ts
│  │  │  └─ types
│  │  │     └─ quote.types.ts
│  │  ├─ rag-knowledge
│  │  │  ├─ components
│  │  │  │  ├─ ChunkViewerPanel
│  │  │  │  │  └─ index.tsx
│  │  │  │  ├─ DocumentLifecycleGrid
│  │  │  │  │  └─ index.tsx
│  │  │  │  └─ KnowledgeActionDrawer
│  │  │  │     └─ index.tsx
│  │  │  └─ page.tsx
│  │  ├─ repair-sessions
│  │  │  ├─ components
│  │  │  │  ├─ AssignmentHistoryTimeline.tsx
│  │  │  │  ├─ CancelRepairSessionModal.tsx
│  │  │  │  ├─ DispatchActionPanel.tsx
│  │  │  │  ├─ ReassignTechnicianModal.tsx
│  │  │  │  ├─ RepairSessionAddressCard.tsx
│  │  │  │  ├─ RepairSessionAiSummaryCard.tsx
│  │  │  │  ├─ RepairSessionCustomerCard.tsx
│  │  │  │  ├─ RepairSessionDangerBadge.tsx
│  │  │  │  ├─ RepairSessionDetailPanel.tsx
│  │  │  │  ├─ RepairSessionDeviceCard.tsx
│  │  │  │  ├─ RepairSessionFilterBar.tsx
│  │  │  │  ├─ RepairSessionInfoCard.tsx
│  │  │  │  ├─ RepairSessionKpiCard.tsx
│  │  │  │  ├─ RepairSessionList.tsx
│  │  │  │  ├─ RepairSessionListItem.tsx
│  │  │  │  ├─ RepairSessionListPanel.tsx
│  │  │  │  ├─ RepairSessionMobileCard.tsx
│  │  │  │  ├─ RepairSessionsKpiGrid.tsx
│  │  │  │  ├─ RepairSessionsPageHeader.tsx
│  │  │  │  ├─ RepairSessionStatusBadge.tsx
│  │  │  │  ├─ RepairSessionStatusTabs.tsx
│  │  │  │  ├─ RepairSessionStuckBadge.tsx
│  │  │  │  ├─ RepairSessionSymptomCard.tsx
│  │  │  │  ├─ RepairSessionTimeline.tsx
│  │  │  │  ├─ RepairSessionWorkspace.tsx
│  │  │  │  ├─ UnassignTechnicianModal.tsx
│  │  │  │  ├─ UpdateStatusDisabledTooltip.tsx
│  │  │  │  └─ _InfoCard.tsx
│  │  │  ├─ constants
│  │  │  │  └─ repairSession.constants.ts
│  │  │  ├─ hooks
│  │  │  │  ├─ index.ts
│  │  │  │  ├─ useRepairSessionFilters.ts
│  │  │  │  └─ useRepairSessionsApi.ts
│  │  │  ├─ mocks
│  │  │  │  └─ repairSessions.mock.ts
│  │  │  ├─ page.tsx
│  │  │  ├─ services
│  │  │  │  ├─ index.ts
│  │  │  │  └─ repairSession.service.ts
│  │  │  ├─ types
│  │  │  │  └─ repairSession.types.ts
│  │  │  └─ utils
│  │  │     ├─ repairSessionFormatters.ts
│  │  │     ├─ repairSessionRules.ts
│  │  │     └─ repairSessionStatusMeta.ts
│  │  ├─ Reviews
│  │  │  ├─ components
│  │  │  │  ├─ detail
│  │  │  │  │  └─ ReviewDetailPanel.tsx
│  │  │  │  ├─ filter
│  │  │  │  │  └─ ReviewFilterBar.tsx
│  │  │  │  ├─ layout
│  │  │  │  │  ├─ ReviewHeader.tsx
│  │  │  │  │  └─ ReviewKpiGrid.tsx
│  │  │  │  ├─ shared
│  │  │  │  │  ├─ ReviewRatingStars.tsx
│  │  │  │  │  ├─ ReviewSentimentBadge.tsx
│  │  │  │  │  └─ ReviewTagBadge.tsx
│  │  │  │  └─ table
│  │  │  │     └─ ReviewTable.tsx
│  │  │  ├─ Data
│  │  │  │  └─ mockReviews.ts
│  │  │  ├─ hooks
│  │  │  │  ├─ index.ts
│  │  │  │  └─ useReviewsApi.ts
│  │  │  ├─ lib
│  │  │  │  └─ reviewHelpers.ts
│  │  │  ├─ page.tsx
│  │  │  ├─ services
│  │  │  │  ├─ index.ts
│  │  │  │  └─ reviewAdmin.service.ts
│  │  │  └─ types
│  │  │     └─ review.types.ts
│  │  ├─ techinical-document
│  │  │  ├─ components
│  │  │  │  ├─ TechnicalDocumentFilterBar.tsx
│  │  │  │  ├─ TechnicalDocumentFormModal.tsx
│  │  │  │  ├─ TechnicalDocumentKpiGrid.tsx
│  │  │  │  ├─ TechnicalDocumentsAdminContent.tsx
│  │  │  │  └─ TechnicalDocumentTable.tsx
│  │  │  ├─ hooks
│  │  │  │  └─ useTechnicalDocumentsApi.ts
│  │  │  ├─ lib
│  │  │  │  └─ technicalDocumentHelpers.ts
│  │  │  ├─ mocks
│  │  │  │  └─ technicalDocumentsMock.ts
│  │  │  ├─ page.tsx
│  │  │  ├─ services
│  │  │  │  └─ technicalDocumentAdmin.service.ts
│  │  │  └─ types
│  │  │     └─ technicalDocument.types.ts
│  │  ├─ technicians
│  │  │  ├─ components
│  │  │  │  ├─ TechnicianExpandedPanel.tsx
│  │  │  │  ├─ TechnicianFilters.tsx
│  │  │  │  ├─ TechnicianHeader.tsx
│  │  │  │  ├─ TechnicianKpiGrid.tsx
│  │  │  │  ├─ TechnicianPagination.tsx
│  │  │  │  ├─ TechnicianStatusBadge.tsx
│  │  │  │  └─ TechnicianTable.tsx
│  │  │  ├─ hooks
│  │  │  │  ├─ index.ts
│  │  │  │  └─ useTechnicians.ts
│  │  │  ├─ mocks
│  │  │  │  └─ technicians.mock.ts
│  │  │  ├─ page.tsx
│  │  │  ├─ services
│  │  │  │  ├─ index.ts
│  │  │  │  └─ technicianAdmin.service.ts
│  │  │  ├─ types
│  │  │  │  └─ technician.types.ts
│  │  │  └─ utils
│  │  │     └─ technicianStatusMeta.ts
│  │  └─ _shared
│  │     └─ services
│  │        └─ adminSessionSource.ts
│  ├─ auth
│  │  ├─ forgot-password
│  │  │  └─ page.tsx
│  │  ├─ hooks
│  │  │  └─ useAuthApi.ts
│  │  ├─ login
│  │  │  └─ page.tsx
│  │  ├─ register
│  │  │  └─ page.tsx
│  │  ├─ services
│  │  │  └─ auth.service.ts
│  │  ├─ update-profile
│  │  │  └─ page.tsx
│  │  └─ utils
│  │     └─ session.ts
│  ├─ components
│  │  ├─ bottomnavComponents.tsx
│  │  ├─ client
│  │  │  └─ header
│  │  │     ├─ ClientHeader.tsx
│  │  │     ├─ constants.ts
│  │  │     ├─ HeaderActions.tsx
│  │  │     ├─ HeaderLogo.tsx
│  │  │     ├─ HeaderNav.tsx
│  │  │     ├─ LoginButton.tsx
│  │  │     ├─ ocean-theme-transition.css
│  │  │     ├─ README.md
│  │  │     ├─ ThemeToggleButton.tsx
│  │  │     ├─ types.ts
│  │  │     ├─ useOceanThemeTransition.ts
│  │  │     ├─ UserMenu.tsx
│  │  │     └─ useThemeToggle.ts
│  │  ├─ inputComponents.tsx
│  │  ├─ navbarComponents.tsx
│  │  └─ Pagination.tsx
│  ├─ config
│  │  └─ routes.ts
│  ├─ favicon.ico
│  ├─ globals.css
│  ├─ hooks
│  │  ├─ common
│  │  │  ├─ index.ts
│  │  │  ├─ useAiApi.ts
│  │  │  ├─ useAsyncAction.ts
│  │  │  ├─ useAuthApi.ts
│  │  │  ├─ useChatHistoryApi.ts
│  │  │  ├─ useChatsApi.ts
│  │  │  ├─ useDevicesApi.ts
│  │  │  ├─ useMechanicAiApi.ts
│  │  │  ├─ useNotificationsApi.ts
│  │  │  ├─ useRagApi.ts
│  │  │  ├─ useUploadApi.ts
│  │  │  └─ useUsersApi.ts
│  │  ├─ customer
│  │  ├─ index.ts
│  │  ├─ useAccountsApi.ts
│  │  ├─ useChatbotApi.ts
│  │  ├─ useChatsApi.ts
│  │  ├─ useQuotesApi.ts
│  │  ├─ useRepairSessionsApi.ts
│  │  └─ useUtilities.ts
│  ├─ image
│  │  └─ logo6.webp
│  ├─ layout.tsx
│  └─ services
│     ├─ account.service.ts
│     ├─ apiClient.ts
│     ├─ authorization.service.ts
│     ├─ chat.service.ts
│     ├─ chatbot.service.ts
│     ├─ common
│     │  ├─ ai.service.ts
│     │  ├─ auth.service.ts
│     │  ├─ chat-history.service.ts
│     │  ├─ chats.service.ts
│     │  ├─ devices.service.ts
│     │  ├─ index.ts
│     │  ├─ mechanic-ai.service.ts
│     │  ├─ notifications.service.ts
│     │  ├─ rag.service.ts
│     │  ├─ types.ts
│     │  ├─ upload.service.ts
│     │  └─ users.service.ts
│     ├─ customer.service.ts
│     ├─ quote.service.ts
│     └─ repairSession.service.ts
├─ codex-frontend.err.log
├─ codex-frontend.log
├─ devcheck.err.log
├─ devcheck.out.log
├─ eslint.config.mjs
├─ frontend-test.err.log
├─ frontend-test.out.log
├─ logo.png
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ proxy.ts
├─ public
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ images
│  │  └─ process
│  │     ├─ step-1-request.jpg
│  │     ├─ step-2-receive.jpg
│  │     ├─ step-3-assign.jpg
│  │     └─ step-4-check.jpg
│  ├─ next.svg
│  ├─ vercel.svg
│  ├─ videos
│  │  └─ company-demo.mp4
│  └─ window.svg
├─ README.md
├─ scripts
│  └─ dev.cjs
├─ tsconfig.admin-hooks-extra.json
├─ tsconfig.admin-missing.json
├─ tsconfig.admin-ops.json
├─ tsconfig.admin-pages.json
├─ tsconfig.common-api.json
└─ tsconfig.json

```
```
fe_chatbot_website
├─ .sixth
│  └─ skills
│     ├─ coding
│     │  ├─ AGENTS.md
│     │  ├─ Examples.md
│     │  └─ README.md
│     └─ layout
│        ├─ 00_README_READ_ORDER.md
│        ├─ 01_PROJECT_UI_DIRECTION.md
│        ├─ 02_DESIGN_SYSTEM_TOKENS.md
│        ├─ 03_LAYOUT_RULES_AND_PATTERNS.md
│        ├─ 04_COMPONENT_AND_STATE_STANDARDS.md
│        ├─ 05_RESPONSIVE_ACCESSIBILITY_AND_PRODUCTION.md
│        ├─ 06_CODEX_MASTER_PROMPT.md
│        └─ 07_FINAL_REVIEW_CHECKLIST.md
├─ ADMIN_LAYOUT_STYLE_SUMMARY.md
├─ AGENTS.md
├─ app
│  ├─ (client)
│  │  ├─ chatbot
│  │  │  └─ page.tsx
│  │  ├─ faqchat
│  │  │  └─ page.tsx
│  │  ├─ layout.tsx
│  │  ├─ orderhistory
│  │  │  └─ page.tsx
│  │  └─ page.tsx
│  ├─ admin
│  │  ├─ accounts
│  │  │  ├─ components
│  │  │  │  ├─ actions
│  │  │  │  │  ├─ AccountActionBar.tsx
│  │  │  │  │  ├─ AccountActionButton.tsx
│  │  │  │  │  ├─ AccountActionGroup.tsx
│  │  │  │  │  ├─ AccountActionLink.tsx
│  │  │  │  │  └─ AccountConfirmActionDialog.tsx
│  │  │  │  ├─ detail-panel
│  │  │  │  │  ├─ AccountDetailPanel.tsx
│  │  │  │  │  ├─ AccountGpsCard.tsx
│  │  │  │  │  ├─ AccountProfileCard.tsx
│  │  │  │  │  ├─ AccountRelatedDataCard.tsx
│  │  │  │  │  ├─ AccountStatusCard.tsx
│  │  │  │  │  └─ AccountWarningCard.tsx
│  │  │  │  ├─ dialogs
│  │  │  │  │  ├─ AccountChangeRoleDialog.tsx
│  │  │  │  │  ├─ AccountDeleteGuardDialog.tsx
│  │  │  │  │  ├─ AccountDetailModal.tsx
│  │  │  │  │  ├─ AccountLockDialog.tsx
│  │  │  │  │  ├─ AccountResetPasswordDialog.tsx
│  │  │  │  │  └─ AccountVerifyDialog.tsx
│  │  │  │  ├─ filters
│  │  │  │  │  ├─ AccountFilters.tsx
│  │  │  │  │  ├─ AccountRoleFilter.tsx
│  │  │  │  │  ├─ AccountSearchInput.tsx
│  │  │  │  │  ├─ AccountStatusFilter.tsx
│  │  │  │  │  └─ AccountVerifiedFilter.tsx
│  │  │  │  ├─ forms
│  │  │  │  │  ├─ AccountBaseFormFields.tsx
│  │  │  │  │  ├─ AccountCreateForm.tsx
│  │  │  │  │  ├─ AccountLocationFields.tsx
│  │  │  │  │  ├─ AccountPasswordFields.tsx
│  │  │  │  │  ├─ AccountRoleFields.tsx
│  │  │  │  │  └─ AccountUpdateForm.tsx
│  │  │  │  ├─ layout
│  │  │  │  │  ├─ AccountHeader.tsx
│  │  │  │  │  ├─ AccountKpiGrid.tsx
│  │  │  │  │  └─ AccountPageSection.tsx
│  │  │  │  ├─ logs
│  │  │  │  │  ├─ AccountAuditLogFilters.tsx
│  │  │  │  │  ├─ AccountAuditLogItem.tsx
│  │  │  │  │  └─ AccountAuditLogPanel.tsx
│  │  │  │  ├─ shared
│  │  │  │  │  ├─ AccountAvatar.tsx
│  │  │  │  │  ├─ AccountInfoRow.tsx
│  │  │  │  │  ├─ AccountOnlineDot.tsx
│  │  │  │  │  ├─ AccountRoleBadge.tsx
│  │  │  │  │  ├─ AccountStatusBadge.tsx
│  │  │  │  │  ├─ AccountVerifiedBadge.tsx
│  │  │  │  │  ├─ AdminPagination.tsx
│  │  │  │  │  └─ Pagination.tsx
│  │  │  │  └─ table
│  │  │  │     ├─ AccountDesktopRow.tsx
│  │  │  │     ├─ AccountEmptyState.tsx
│  │  │  │     ├─ AccountMobileCard.tsx
│  │  │  │     ├─ AccountMobileList.tsx
│  │  │  │     ├─ AccountTable.tsx
│  │  │  │     └─ AccountTableDesktop.tsx
│  │  │  ├─ constants
│  │  │  │  └─ account.constants.ts
│  │  │  ├─ create
│  │  │  │  └─ page.tsx
│  │  │  ├─ hooks
│  │  │  │  ├─ index.ts
│  │  │  │  └─ useAccounts.ts
│  │  │  ├─ mocks
│  │  │  │  └─ accounts.mock.ts
│  │  │  ├─ page.tsx
│  │  │  ├─ services
│  │  │  │  ├─ accountAdmin.service.ts
│  │  │  │  └─ index.ts
│  │  │  ├─ types
│  │  │  │  └─ account.types.ts
│  │  │  ├─ utils
│  │  │  │  ├─ accountFilters.ts
│  │  │  │  ├─ accountFormatters.ts
│  │  │  │  └─ accountValidation.ts
│  │  │  └─ [id]
│  │  │     ├─ edit
│  │  │     │  └─ page.tsx
│  │  │     ├─ logs
│  │  │     │  └─ page.tsx
│  │  │     └─ page.tsx
│  │  ├─ ai-consulting
│  │  │  ├─ components
│  │  │  │  ├─ AiKpiDashboard
│  │  │  │  │  └─ index.tsx
│  │  │  │  ├─ AiTranscriptTable
│  │  │  │  │  └─ index.tsx
│  │  │  │  └─ TranscriptDetailPanel
│  │  │  │     └─ index.tsx
│  │  │  ├─ hooks
│  │  │  │  ├─ index.ts
│  │  │  │  └─ useAiConsultingApi.ts
│  │  │  ├─ page.tsx
│  │  │  ├─ services
│  │  │  │  ├─ aiConsultingAdmin.service.ts
│  │  │  │  └─ index.ts
│  │  │  └─ types
│  │  │     └─ aiConsulting.types.ts
│  │  ├─ ai-reasoning-logs
│  │  │  ├─ components
│  │  │  │  ├─ AiReasoningBadges.tsx
│  │  │  │  ├─ AiReasoningFilterBar.tsx
│  │  │  │  ├─ AiReasoningHeader.tsx
│  │  │  │  ├─ AiReasoningKpiGrid.tsx
│  │  │  │  ├─ AiReasoningLogDetail.tsx
│  │  │  │  └─ AiReasoningLogList.tsx
│  │  │  ├─ data
│  │  │  │  └─ mockAiReasoningLogs.ts
│  │  │  ├─ hooks
│  │  │  │  ├─ index.ts
│  │  │  │  └─ useAiReasoningLogsApi.ts
│  │  │  ├─ lib
│  │  │  │  └─ aiReasoningHelpers.ts
│  │  │  ├─ page.tsx
│  │  │  ├─ services
│  │  │  │  ├─ aiReasoningAdmin.service.ts
│  │  │  │  └─ index.ts
│  │  │  └─ types
│  │  │     └─ aiReasoning.types.ts
│  │  ├─ chats
│  │  │  ├─ components
│  │  │  │  ├─ ChatActionDrawer
│  │  │  │  │  └─ index.tsx
│  │  │  │  ├─ Chatfillter
│  │  │  │  │  └─ ChatFilterBar.tsx
│  │  │  │  ├─ ChatThreadPanel
│  │  │  │  │  ├─ AttachmentBlock.tsx
│  │  │  │  │  ├─ index.tsx
│  │  │  │  │  └─ MessageBubble.tsx
│  │  │  │  └─ SessionListPanel
│  │  │  │     ├─ ChatSessionRow.tsx
│  │  │  │     └─ index.tsx
│  │  │  ├─ hooks
│  │  │  │  ├─ index.ts
│  │  │  │  └─ useChatsApi.ts
│  │  │  ├─ mocks
│  │  │  │  └─ chatMock.ts
│  │  │  ├─ page.tsx
│  │  │  ├─ services
│  │  │  │  ├─ chat.service.ts
│  │  │  │  └─ index.ts
│  │  │  └─ types
│  │  │     └─ chat.types.ts
│  │  ├─ dashboard
│  │  │  ├─ components
│  │  │  │  ├─ AuthLayout.tsx
│  │  │  │  ├─ dashboard
│  │  │  │  │  ├─ AdminShell.tsx
│  │  │  │  │  ├─ AdminSidebar.tsx
│  │  │  │  │  ├─ AdminTopbar.tsx
│  │  │  │  │  ├─ AiQualityCard.tsx
│  │  │  │  │  ├─ DashboardHeader.tsx
│  │  │  │  │  ├─ JobStatusDonutChart.tsx
│  │  │  │  │  ├─ KpiCard.tsx
│  │  │  │  │  ├─ KpiGrid.tsx
│  │  │  │  │  ├─ LiveJobsTable.tsx
│  │  │  │  │  ├─ mockData.ts
│  │  │  │  │  ├─ OnlineTechniciansTable.tsx
│  │  │  │  │  ├─ RecentActivityTimeline.tsx
│  │  │  │  │  ├─ RevenueLineChart.tsx
│  │  │  │  │  ├─ status.ts
│  │  │  │  │  ├─ SystemStatusBanner.tsx
│  │  │  │  │  ├─ TopDeviceBarChart.tsx
│  │  │  │  │  └─ types.ts
│  │  │  │  ├─ LoginForm.tsx
│  │  │  │  ├─ LogoHeader.tsx
│  │  │  │  └─ RoleTabs.tsx
│  │  │  ├─ hooks
│  │  │  │  └─ useDashboardApi.ts
│  │  │  ├─ page.tsx
│  │  │  └─ services
│  │  │     └─ dashboard.service.ts
│  │  ├─ Devices
│  │  │  ├─ components
│  │  │  │  ├─ DeviceDesktopRow.tsx
│  │  │  │  ├─ DeviceDetailPanel.tsx
│  │  │  │  ├─ DeviceFilters.tsx
│  │  │  │  ├─ DeviceHeader.tsx
│  │  │  │  ├─ DeviceInfoBox.tsx
│  │  │  │  ├─ DeviceKpiGrid.tsx
│  │  │  │  ├─ DeviceMobileCard.tsx
│  │  │  │  ├─ DeviceRepairHistory.tsx
│  │  │  │  ├─ DeviceTable.tsx
│  │  │  │  └─ EmptyDeviceState.tsx
│  │  │  ├─ data
│  │  │  │  └─ mockdevice.ts
│  │  │  ├─ hooks
│  │  │  │  └─ useAdminDevices.ts
│  │  │  ├─ page.tsx
│  │  │  ├─ services
│  │  │  │  └─ deviceAdmin.service.ts
│  │  │  └─ types
│  │  │     └─ device.types.ts
│  │  ├─ dispatch
│  │  │  ├─ components
│  │  │  │  ├─ DispatchDrawer.tsx
│  │  │  │  ├─ DispatchFilters.tsx
│  │  │  │  ├─ DispatchHeader.tsx
│  │  │  │  ├─ DispatchTable.tsx
│  │  │  │  └─ types.ts
│  │  │  ├─ hooks
│  │  │  │  ├─ index.ts
│  │  │  │  └─ useDispatchApi.ts
│  │  │  ├─ mocks
│  │  │  │  ├─ dispatch.mock.ts
│  │  │  │  └─ types.ts
│  │  │  ├─ page.tsx
│  │  │  ├─ services
│  │  │  │  ├─ dispatch.service.ts
│  │  │  │  └─ index.ts
│  │  │  └─ types
│  │  │     └─ dispatch.types.ts
│  │  ├─ moderation
│  │  │  ├─ components
│  │  │  │  ├─ EvidenceViewerPanel
│  │  │  │  │  └─ index.tsx
│  │  │  │  ├─ ModerationActionDrawer
│  │  │  │  │  └─ index.tsx
│  │  │  │  └─ ReportSlaTable
│  │  │  │     └─ index.tsx
│  │  │  ├─ hooks
│  │  │  │  ├─ index.ts
│  │  │  │  └─ useModerationApi.ts
│  │  │  ├─ page.tsx
│  │  │  ├─ services
│  │  │  │  ├─ index.ts
│  │  │  │  └─ moderationAdmin.service.ts
│  │  │  └─ types
│  │  │     └─ moderation.types.ts
│  │  ├─ quotes
│  │  │  ├─ components
│  │  │  │  ├─ QuoteActionDrawer
│  │  │  │  │  └─ index.tsx
│  │  │  │  ├─ QuoteDetailPanel
│  │  │  │  │  └─ index.tsx
│  │  │  │  ├─ QuoteFilterBar
│  │  │  │  │  └─ index.tsx
│  │  │  │  └─ QuoteMatrixTable
│  │  │  │     └─ index.tsx
│  │  │  ├─ hooks
│  │  │  │  ├─ index.ts
│  │  │  │  └─ useQuotesApi.ts
│  │  │  ├─ mocks
│  │  │  │  └─ quotesMock.ts
│  │  │  ├─ page.tsx
│  │  │  ├─ services
│  │  │  │  ├─ index.ts
│  │  │  │  └─ quote.service.ts
│  │  │  └─ types
│  │  │     └─ quote.types.ts
│  │  ├─ rag-knowledge
│  │  │  ├─ components
│  │  │  │  ├─ ChunkViewerPanel
│  │  │  │  │  └─ index.tsx
│  │  │  │  ├─ DocumentLifecycleGrid
│  │  │  │  │  └─ index.tsx
│  │  │  │  └─ KnowledgeActionDrawer
│  │  │  │     └─ index.tsx
│  │  │  └─ page.tsx
│  │  ├─ repair-sessions
│  │  │  ├─ components
│  │  │  │  ├─ AssignmentHistoryTimeline.tsx
│  │  │  │  ├─ CancelRepairSessionModal.tsx
│  │  │  │  ├─ DispatchActionPanel.tsx
│  │  │  │  ├─ ReassignTechnicianModal.tsx
│  │  │  │  ├─ RepairSessionAddressCard.tsx
│  │  │  │  ├─ RepairSessionAiSummaryCard.tsx
│  │  │  │  ├─ RepairSessionCustomerCard.tsx
│  │  │  │  ├─ RepairSessionDangerBadge.tsx
│  │  │  │  ├─ RepairSessionDetailPanel.tsx
│  │  │  │  ├─ RepairSessionDeviceCard.tsx
│  │  │  │  ├─ RepairSessionFilterBar.tsx
│  │  │  │  ├─ RepairSessionInfoCard.tsx
│  │  │  │  ├─ RepairSessionKpiCard.tsx
│  │  │  │  ├─ RepairSessionList.tsx
│  │  │  │  ├─ RepairSessionListItem.tsx
│  │  │  │  ├─ RepairSessionListPanel.tsx
│  │  │  │  ├─ RepairSessionMobileCard.tsx
│  │  │  │  ├─ RepairSessionsKpiGrid.tsx
│  │  │  │  ├─ RepairSessionsPageHeader.tsx
│  │  │  │  ├─ RepairSessionStatusBadge.tsx
│  │  │  │  ├─ RepairSessionStatusTabs.tsx
│  │  │  │  ├─ RepairSessionStuckBadge.tsx
│  │  │  │  ├─ RepairSessionSymptomCard.tsx
│  │  │  │  ├─ RepairSessionTimeline.tsx
│  │  │  │  ├─ RepairSessionWorkspace.tsx
│  │  │  │  ├─ UnassignTechnicianModal.tsx
│  │  │  │  ├─ UpdateStatusDisabledTooltip.tsx
│  │  │  │  └─ _InfoCard.tsx
│  │  │  ├─ constants
│  │  │  │  └─ repairSession.constants.ts
│  │  │  ├─ hooks
│  │  │  │  ├─ index.ts
│  │  │  │  ├─ useRepairSessionFilters.ts
│  │  │  │  └─ useRepairSessionsApi.ts
│  │  │  ├─ mocks
│  │  │  │  └─ repairSessions.mock.ts
│  │  │  ├─ page.tsx
│  │  │  ├─ services
│  │  │  │  ├─ index.ts
│  │  │  │  └─ repairSession.service.ts
│  │  │  ├─ types
│  │  │  │  └─ repairSession.types.ts
│  │  │  └─ utils
│  │  │     ├─ repairSessionFormatters.ts
│  │  │     ├─ repairSessionRules.ts
│  │  │     └─ repairSessionStatusMeta.ts
│  │  ├─ Reviews
│  │  │  ├─ components
│  │  │  │  ├─ detail
│  │  │  │  │  └─ ReviewDetailPanel.tsx
│  │  │  │  ├─ filter
│  │  │  │  │  └─ ReviewFilterBar.tsx
│  │  │  │  ├─ layout
│  │  │  │  │  ├─ ReviewHeader.tsx
│  │  │  │  │  └─ ReviewKpiGrid.tsx
│  │  │  │  ├─ shared
│  │  │  │  │  ├─ ReviewRatingStars.tsx
│  │  │  │  │  ├─ ReviewSentimentBadge.tsx
│  │  │  │  │  └─ ReviewTagBadge.tsx
│  │  │  │  └─ table
│  │  │  │     └─ ReviewTable.tsx
│  │  │  ├─ Data
│  │  │  │  └─ mockReviews.ts
│  │  │  ├─ hooks
│  │  │  │  ├─ index.ts
│  │  │  │  └─ useReviewsApi.ts
│  │  │  ├─ lib
│  │  │  │  └─ reviewHelpers.ts
│  │  │  ├─ page.tsx
│  │  │  ├─ services
│  │  │  │  ├─ index.ts
│  │  │  │  └─ reviewAdmin.service.ts
│  │  │  └─ types
│  │  │     └─ review.types.ts
│  │  ├─ techinical-document
│  │  │  ├─ components
│  │  │  │  ├─ TechnicalDocumentFilterBar.tsx
│  │  │  │  ├─ TechnicalDocumentFormModal.tsx
│  │  │  │  ├─ TechnicalDocumentKpiGrid.tsx
│  │  │  │  ├─ TechnicalDocumentsAdminContent.tsx
│  │  │  │  └─ TechnicalDocumentTable.tsx
│  │  │  ├─ hooks
│  │  │  │  └─ useTechnicalDocumentsApi.ts
│  │  │  ├─ lib
│  │  │  │  └─ technicalDocumentHelpers.ts
│  │  │  ├─ mocks
│  │  │  │  └─ technicalDocumentsMock.ts
│  │  │  ├─ page.tsx
│  │  │  ├─ services
│  │  │  │  └─ technicalDocumentAdmin.service.ts
│  │  │  └─ types
│  │  │     └─ technicalDocument.types.ts
│  │  ├─ technicians
│  │  │  ├─ components
│  │  │  │  ├─ TechnicianExpandedPanel.tsx
│  │  │  │  ├─ TechnicianFilters.tsx
│  │  │  │  ├─ TechnicianHeader.tsx
│  │  │  │  ├─ TechnicianKpiGrid.tsx
│  │  │  │  ├─ TechnicianPagination.tsx
│  │  │  │  ├─ TechnicianStatusBadge.tsx
│  │  │  │  └─ TechnicianTable.tsx
│  │  │  ├─ hooks
│  │  │  │  ├─ index.ts
│  │  │  │  └─ useTechnicians.ts
│  │  │  ├─ mocks
│  │  │  │  └─ technicians.mock.ts
│  │  │  ├─ page.tsx
│  │  │  ├─ services
│  │  │  │  ├─ index.ts
│  │  │  │  └─ technicianAdmin.service.ts
│  │  │  ├─ types
│  │  │  │  └─ technician.types.ts
│  │  │  └─ utils
│  │  │     └─ technicianStatusMeta.ts
│  │  └─ _shared
│  │     └─ services
│  │        └─ adminSessionSource.ts
│  ├─ auth
│  │  ├─ forgot-password
│  │  │  └─ page.tsx
│  │  ├─ hooks
│  │  │  └─ useAuthApi.ts
│  │  ├─ login
│  │  │  └─ page.tsx
│  │  ├─ register
│  │  │  └─ page.tsx
│  │  ├─ services
│  │  │  └─ auth.service.ts
│  │  ├─ update-profile
│  │  │  └─ page.tsx
│  │  └─ utils
│  │     └─ session.ts
│  ├─ components
│  │  ├─ bottomnavComponents.tsx
│  │  ├─ client
│  │  │  └─ header
│  │  │     ├─ ClientHeader.tsx
│  │  │     ├─ constants.ts
│  │  │     ├─ HeaderActions.tsx
│  │  │     ├─ HeaderLogo.tsx
│  │  │     ├─ HeaderNav.tsx
│  │  │     ├─ LoginButton.tsx
│  │  │     ├─ ocean-theme-transition.css
│  │  │     ├─ README.md
│  │  │     ├─ ThemeToggleButton.tsx
│  │  │     ├─ types.ts
│  │  │     ├─ useOceanThemeTransition.ts
│  │  │     ├─ UserMenu.tsx
│  │  │     └─ useThemeToggle.ts
│  │  ├─ inputComponents.tsx
│  │  ├─ navbarComponents.tsx
│  │  └─ Pagination.tsx
│  ├─ config
│  │  └─ routes.ts
│  ├─ favicon.ico
│  ├─ globals.css
│  ├─ hooks
│  │  ├─ common
│  │  │  ├─ index.ts
│  │  │  ├─ useAiApi.ts
│  │  │  ├─ useAsyncAction.ts
│  │  │  ├─ useAuthApi.ts
│  │  │  ├─ useChatHistoryApi.ts
│  │  │  ├─ useChatsApi.ts
│  │  │  ├─ useDevicesApi.ts
│  │  │  ├─ useMechanicAiApi.ts
│  │  │  ├─ useNotificationsApi.ts
│  │  │  ├─ useRagApi.ts
│  │  │  ├─ useUploadApi.ts
│  │  │  └─ useUsersApi.ts
│  │  ├─ customer
│  │  ├─ index.ts
│  │  ├─ useAccountsApi.ts
│  │  ├─ useChatbotApi.ts
│  │  ├─ useChatsApi.ts
│  │  ├─ useQuotesApi.ts
│  │  ├─ useRepairSessionsApi.ts
│  │  └─ useUtilities.ts
│  ├─ image
│  │  └─ logo6.webp
│  ├─ layout.tsx
│  └─ services
│     ├─ account.service.ts
│     ├─ apiClient.ts
│     ├─ authorization.service.ts
│     ├─ chat.service.ts
│     ├─ chatbot.service.ts
│     ├─ common
│     │  ├─ ai.service.ts
│     │  ├─ auth.service.ts
│     │  ├─ chat-history.service.ts
│     │  ├─ chats.service.ts
│     │  ├─ devices.service.ts
│     │  ├─ index.ts
│     │  ├─ mechanic-ai.service.ts
│     │  ├─ notifications.service.ts
│     │  ├─ rag.service.ts
│     │  ├─ types.ts
│     │  ├─ upload.service.ts
│     │  └─ users.service.ts
│     ├─ customer.service.ts
│     ├─ quote.service.ts
│     └─ repairSession.service.ts
├─ codex-frontend.err.log
├─ codex-frontend.log
├─ devcheck.err.log
├─ devcheck.out.log
├─ eslint.config.mjs
├─ frontend-test.err.log
├─ frontend-test.out.log
├─ logo.png
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ proxy.ts
├─ public
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ images
│  │  └─ process
│  │     ├─ step-1-request.jpg
│  │     ├─ step-2-receive.jpg
│  │     ├─ step-3-assign.jpg
│  │     └─ step-4-check.jpg
│  ├─ next.svg
│  ├─ vercel.svg
│  ├─ videos
│  │  └─ company-demo.mp4
│  └─ window.svg
├─ README.md
├─ scripts
│  └─ dev.cjs
├─ tsconfig.admin-hooks-extra.json
├─ tsconfig.admin-missing.json
├─ tsconfig.admin-ops.json
├─ tsconfig.admin-pages.json
├─ tsconfig.common-api.json
└─ tsconfig.json

```