# HRM System — Frontend

A modern, production-ready Human Resource Management (HRM) frontend built with **Next.js 16**, **TypeScript**, and **Tailwind CSS v4**. The application provides a responsive interface for managing employees, departments, positions, payroll, and employee documents with secure JWT authentication and reusable UI components.

## Highlights

* Modern UI built with Next.js App Router
* Secure JWT Authentication
* Employee & Department Management
* Position Management
* Employee Document Uploads
* Payroll Management with Auto Salary Calculation
* Dashboard with Live Statistics
* Fully Responsive Design
* TypeScript Strict Mode
* Reusable Component Architecture
* Axios API Integration
* Protected Routes using Next.js Middleware
  
## Demo

| Module             | Status |
| ------------------ | ------ |
| Authentication     | ✅      |
| Dashboard          | ✅      |
| Departments        | ✅      |
| Positions          | ✅      |
| Employees          | ✅      |
| Employee Documents | ✅      |
| Payroll            | ✅      |

> Backend API is available separately and communicates through REST endpoints secured with JWT authentication.

## Architecture

```
Frontend (Next.js)
        │
        │ Axios + JWT
        ▼
REST API (NestJS)
        │
        ▼
PostgreSQL Database
```

The frontend communicates with a NestJS REST API using Axios. JWT tokens are automatically attached through Axios interceptors, while Next.js middleware protects authenticated routes.

## Key Features

### Authentication
- JWT Login & Registration
- Protected Routes
- Automatic Token Handling

### Dashboard
- Employee Statistics
- Department & Position Statistics
- Monthly Payroll Summary
- Pending Payroll Overview
- Recent Employees

### Employee Management
- Employee CRUD
- Search & Filtering
- Employment Types
- Status Management

### Employee Documents
- Upload PDF/JPG/JPEG/PNG
- Download Documents
- Delete Documents
- File Validation (≤5 MB)

### Payroll
- Payroll CRUD
- Month & Year Filtering
- Auto Net Salary Calculation
- Payment Status Tracking

### Responsive UI
- Mobile Friendly
- Reusable Components
- Loading & Error States
