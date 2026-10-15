# SchoolFlow — Commercial School Management System (Ghana Edition)
### Complete Interactive Frontend Prototype

**SchoolFlow** is an enterprise-grade School Management System specifically engineered for private basic schools in Ghana (Nursery, Kindergarten, Primary, and Junior High School / JHS).

This commercial prototype provides sales-ready interactive workflows, realistic demonstration datasets (Ghana Education Service standards, Ghanaian cedi `GH₵` currency, Ghanaian names and contacts), role-adaptive access control, and complete demonstration journeys for school proprietors, headteachers, class teachers, subject specialists, bursars, and records officers.

---

## 🌟 Key Highlights & Design System

- **Ghana Basic Education Standard**: Built around Nursery 1-2, KG 1-2, Basic 1-6 (Primary), and JHS 1-3 with Ghana Education Service (GES) Continuous Assessment (30% Class Score / 70% Terminal Exam) and 9-point grading scale.
- **Visual Design Reference**: Curated warm cream background (`#FFF8ED`), white workspace surfaces (`#FFFFFF`), primary orange accents (`#FFA51F` with hover `#F29412`), pale gold highlights (`#E9B24A`), dark readable typography (`#171717`), subtle borders (`#E7E2D9`), positive green (`#72D94B`), and error red (`#DC5252`).
- **Project Accounting (Key Differentiator)**: Ring-fenced event ledgers (e.g., Annual Kakum & Cape Coast Castle Tour, Inter-Schools Sports Championship, JHS Computer Lab Upgrade) tracking budget vs. student contributions vs. disbursements without falsely mislabeling remaining funds as profit.
- **Ghanaian MoMo & Computerized Receipts**: Instant generation of official printable fee receipts with transaction references (MTN Mobile Money, Telecel Cash, Bank Transfers, Cheques).
- **Persistent Local Data Layer**: Full `localStorage` state persistence across page refreshes with an instant 1-click **Reset Demo Data** mechanism.
- **Fast Role Switcher**: Interactive pill in the top navigation bar enabling presenters to switch between all 6 roles with a single click during live client demonstrations.

---

## 👥 Demonstration User Accounts

All demonstration accounts use the default demo password: **`demo123`**

| Role | Name | Email | Focus & Permitted Capabilities |
| :--- | :--- | :--- | :--- |
| **School Owner / Proprietor** | Dr. Kwame Mensah | `owner@demo.school` | Executive KPIs, fee collection trends, expense authorization, project accounting, audit trail |
| **Headteacher / Academic Admin** | Mrs. Comfort Addo | `headteacher@demo.school` | Curriculum moderation, exam results review/return/approval, annual student promotion batch workflow |
| **Primary Class Teacher** | Mr. Samuel Osei | `teacher@demo.school` | Basic 4A designated administration, morning roll call register, marks entry for authorized subjects |
| **Assistant / Subject Teacher** | Ms. Akua Boateng | `subjectteacher@demo.school` | Specialist marks entry (Integrated Science & Computing ICT), draft saving, revision feedback |
| **Accountant / Bursar** | Mr. Emmanuel Donkor | `accountant@demo.school` | Fee schedules, student ledgers, MoMo payments, official printable receipts, expense logging |
| **Records Administrator** | Ms. Grace Asante | `admin@demo.school` | Multi-step student admission form, guardian linking, permanent identity placement history, CSV export/import |

---

## 🚀 Installation & Running Locally

### Prerequisites
- **Node.js**: v18.0.0 or later (v20+ recommended)
- **npm**: v9.0.0 or later

### Quick Start Commands
```bash
# 1. Navigate to the project directory
cd project

# 2. Install dependencies
npm install

# 3. Start the local development server
npm run dev

# 4. Open in browser
# Navigate to http://localhost:5173
```

### Production Build & Type Verification
```bash
# Build production bundle and run TypeScript type checks
npm run build

# Preview production build locally
npm run preview
```

---

## 🗺️ Implemented Modules & Routes

| Route | Module Name | Role-Specific Capabilities |
| :--- | :--- | :--- |
| `/login` | **Authentication Gateway** | Branded login form + 1-Click Fast Demo Role access cards |
| `/` | **Dynamic Role Dashboard** | Automatically renders the dashboard tailored to active user role (Owner, Headteacher, Teacher, Subject Teacher, Bursar, Admin) |
| `/students` | **Student Records & Directory** | Permanent student identity registry, filter by class/status, multi-step registration modal, shared student profile |
| `/attendance` | **Attendance Workflow** | Daily roll call register, Present/Absent/Late/Excused marks, bulk mark present, draft/submit status, audit correction notes |
| `/academics` | **Curriculum & Moderation** | Results moderation pipeline (Approve/Return), 30/70 continuous marks entry, student promotion batches, class configuration |
| `/finances` | **Fees & Expenses** | Pupil fee ledgers, fee schedules, Mobile Money payment recording, printable receipts, expense logging & owner approval |
| `/activities` | **Project Accounting** | Ring-fenced activity ledgers (Kakum tour, Sports festival, Lab renovation) with live income vs. expenditure reconciliation |
| `/communications` | **Parent Broadcasts** | Outbound SMS & Email notification composer, pre-built event templates, live smartphone SMS preview mockup, delivery logs |
| `/reports` | **Reporting Center** | Print-ready official statements (Collection reports, Arrears & Defaulters list, Income & Expenditure, Enrollment) + CSV export |
| `/audit` | **Audit Trail** | System-wide immutable activity log tracking actors, timestamps, affected records, and governance actions |
| `/settings` | **School Configuration** | Ghana GES registration info, school motto, grading scale reference (1-9), staff accounts overview, demo reset |

---

## 📱 Interactive Demonstration Journeys (Sales Validation)

1. **Journey A: School Owner (Proprietor Oversight)**
   - Log in as **Owner** (`owner@demo.school`).
   - Inspect the Executive Dashboard KPIs, the Fee Collection Area Chart, and Section Distribution Pie Chart.
   - Navigate to the **Pending Proprietor Approvals** card and click **Approve Funds** on the pending plumbing repair expense (`GH₵2,600`).
   - Scroll down to **Recent Fee Payments** and click **Print** on any transaction to inspect the official computerized Ghana fee receipt.

2. **Journey B: Headteacher (Academic Moderation & Promotion)**
   - Switch role to **Headteacher** using the top-bar dropdown.
   - Inspect the **Results Moderation & Approval Pipeline**.
   - Click **Inspect Scores** on the submitted Basic 4A Mathematics results to review individual student scores.
   - Click **Approve Results** or **Return with Notes** to demonstrate the two-way moderation workflow.
   - Open the **Promotion Workflow** and preview the batch promotion of Basic 4A pupils to Basic 5 for the 2026/2027 Academic Year.

3. **Journey C: Primary Class Teacher (Daily Administration)**
   - Switch role to **Primary Class Teacher** (Mr. Samuel Osei - Basic 4A).
   - Go to **Mark Daily Register** (`/attendance`).
   - Click **Mark Entire Class Present**, toggle individual pupils (e.g. Yaw Frimpong to Excused), and click **Submit Class Register**.
   - Notice that financial edit permissions and student promotion controls are strictly hidden for this role.

4. **Journey D: Assistant / Subject Teacher (Specialist Marks)**
   - Switch role to **Subject Teacher** (Ms. Akua Boateng).
   - See the active revision alert: *Basic 5 Integrated Science returned by Headmistress*.
   - Open the mark sheet, adjust scores, save draft, and resubmit for academic review.

5. **Journey E: Accountant / Bursar (MoMo Collections & Project Accounting)**
   - Switch role to **Accountant** (Mr. Emmanuel Donkor).
   - Go to `/finances`, click **Record Fee Payment**, select pupil Zainab Salifu, enter `GH₵850` via MTN Mobile Money, and submit.
   - Watch the ledger instantly update to **CLEARED (GH₵ 0.00)** and print the official receipt.
   - Go to `/activities` and inspect the **Annual Kakum Educational Tour** project ledger (`Budget: GH₵6,500`, `Collected: GH₵5,800`, `Spent: GH₵4,650`, `Remaining: GH₵1,150`).

6. **Journey F: Records Administrator (Admissions & Placement)**
   - Switch role to **Records Administrator** (Ms. Grace Asante).
   - Go to `/students`, click **Admit New Student**, and step through the multi-step enrollment form (Personal Details, Guardian Linkage, and Class Placement).
   - Use Global Search (`Ctrl+K`) to look up pupil **Kofi Mensah** and view the linked sibling **Nana Akosua Mensah**.

---

## 🔮 Production Roadmap & Backend Integrations Required

While this prototype is 100% interactive and self-contained with client-side persistence, deploying to commercial production requires:
1. **Production Backend & Database**: PostgreSQL / Supabase / Node.js API with Row-Level Security (RLS) enforcing server-side role permissions.
2. **Ghana Telco SMS Gateway**: Integration with a Ghanaian SMS aggregator (e.g., Hubtel, Arkesel, or MNotify) with approved alphanumeric Sender ID (`HCA-ACCRA`).
3. **Mobile Money Payment Gateway**: Integration with Paystack Ghana, Hubtel, or direct MTN MoMo / Telecel Cash APIs for automated webhook payment reconciliations.
4. **Cloud Storage**: AWS S3 / Cloudinary for student passport photos and expense receipt PDF attachments.
5. **Multi-School Ownership**: Multi-tenant database partitioning using `school_id` foreign keys (already architected into all frontend data models).

---

## 📄 License & Attribution
Designed and built for **Heritage Crown Academy** and commercial private basic schools in Ghana.
Developed with React 19, Vite 8, TypeScript, Tailwind CSS, Lucide Icons, and Recharts.
