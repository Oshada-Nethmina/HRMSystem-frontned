# HRM System — Frontend

A clean, fully-featured Human Resource Management System frontend built with **Next.js 16**, **Tailwind CSS v4**, and **TypeScript**.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| Language | TypeScript (strict) |
| HTTP | Axios with JWT interceptors |
| Auth | JWT via `js-cookie` + Next.js Middleware |
| Icons | Lucide React |
| Forms | Native React controlled forms |

---

## Features

- **Authentication** — Login, Register with JWT; protected routes via Next.js middleware
- **Dashboard** — Live stats: total employees, departments, positions, payroll total, pending payrolls, recent employees
- **Departments** — Full CRUD with active/inactive toggle
- **Positions** — Full CRUD linked to departments
- **Employees** — Full CRUD with search/filter, employment type, status management
- **Employee Documents** — Upload (PDF, JPG, JPEG, PNG ≤5MB), list, download, delete per employee
- **Payroll** — Full CRUD with month/year filter, auto net salary calculation, payment status
- **Reusable UI Library** — Button, Input, Select, Table, Modal, Card, StatCard, FileUpload, StatusBadge, FormWrapper
- **Mock data fallback** — All pages gracefully fall back to mock data when backend is unavailable

---

## Folder Structure

```
app/
  login/               # Public auth page
  register/            # Public registration page
  dashboard/           # Main overview with stats
  departments/         # Department CRUD
  positions/           # Position CRUD
  employees/
    page.tsx           # Employee list + search
    [id]/page.tsx      # Employee detail + document upload
  payroll/             # Payroll CRUD with filters

components/
  ui/
    Button.tsx         # Variants: primary/secondary/danger/ghost/success, sizes, loading state
    Input.tsx          # Label, error, hint, left/right addons
    Select.tsx         # With label, error, placeholder
    Table.tsx          # Generic typed table with loading/empty states
    Modal.tsx          # Accessible modal with backdrop
    Card.tsx           # Card + StatCard components
    FileUpload.tsx     # Drag-and-drop, type/size validation, multi-file
    StatusBadge.tsx    # Auto-maps status strings to color variants
    FormWrapper.tsx    # Consistent form layout wrapper
  layout/
    Sidebar.tsx        # Fixed dark sidebar with active nav state
    Navbar.tsx         # Top bar with title, subtitle, action slot
    DashboardLayout.tsx # Sidebar + main content wrapper

lib/
  api.ts               # Axios instance with JWT interceptor + 401 redirect
  auth.ts              # authService: login, register, me, logout
  utils.ts             # cn(), formatCurrency, formatDate, formatFileSize, constants

types/
  auth.ts              # User, LoginPayload, RegisterPayload, AuthResponse
  employee.ts          # Department, Position, Employee, EmployeeDocument, enums
  payroll.ts           # Payroll, DashboardStats, PaymentStatus

middleware.ts          # Next.js route protection: redirects unauthenticated users to /login
```

---

## Getting Started

### 1. Clone and install

```bash
git clone <repo-url>
cd hrm-system
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You'll be redirected to `/login`.

> **Note:** The frontend includes mock data fallback for all pages. If the backend is not running, the UI will still render with sample data so you can explore the UI independently.

### 4. Build for production

```bash
npm run build
npm start
```

---

## Backend API Contract

The frontend expects these base routes at `NEXT_PUBLIC_API_URL`:

| Module | Endpoints |
|--------|-----------|
| Auth | `POST /auth/login`, `POST /auth/register`, `GET /auth/me` |
| Departments | `GET/POST /departments`, `GET/PATCH/DELETE /departments/:id` |
| Positions | `GET/POST /positions`, `GET/PATCH/DELETE /positions/:id` |
| Employees | `GET/POST /employees`, `GET/PATCH/DELETE /employees/:id` |
| Documents | `POST/GET /employees/:id/documents`, `GET /employees/documents/:id/download`, `DELETE /employees/documents/:id` |
| Payroll | `GET/POST /payrolls`, `GET/PATCH/DELETE /payrolls/:id` |
| Dashboard | `GET /dashboard` |

All protected routes require `Authorization: Bearer <token>` header (auto-injected by Axios interceptor).

---

## Coding Standards Implemented

- ✅ Zero inline CSS — no `style={{}}` anywhere
- ✅ Theme values defined in **both** `tailwind.config.ts` (`theme.extend`) and `app/globals.css` (`@theme` directive)
  - `tailwind.config.ts` follows the requirement spec with `theme.extend.colors`, `fontSize`, `borderRadius`, `boxShadow`, and `spacing`
  - `globals.css` uses Tailwind v4's native `@theme` block for the same values (runtime CSS custom properties)
- ✅ Reusable components in `components/ui/` and `components/layout/`
- ✅ Clean folder structure with separation of concerns
- ✅ Loading, empty, success, and error states on all API-driven screens
- ✅ Protected frontend routes via Next.js middleware
- ✅ TypeScript strict mode throughout
- ✅ File upload validation: type (PDF/JPG/PNG) and size (≤5MB)
- ✅ `FileUpload` uses `React.useId()` for unique input IDs — safe for multiple instances on one page

---

## Screenshots

> Place screenshots in a `/screenshots` folder and link here after setup.

| Screen | Description |
|--------|-------------|
| Login | JWT login with show/hide password |
| Register | Role-based registration |
| Dashboard | Live stats cards + recent employees table |
| Departments | CRUD table with status toggle |
| Positions | Department-linked positions CRUD |
| Employees | Searchable employee list with status badges |
| Employee Detail | Profile + document upload/download/delete |
| Payroll | Month/year filtered payroll with net salary calculation |
