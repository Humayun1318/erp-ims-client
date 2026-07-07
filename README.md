# Mini ERP — Inventory & Sales Management System (Client)

A role-aware React frontend for the Mini ERP backend — one interface where Admins, Managers, and Employees each see exactly the modules their role permits, built on an AWS Console-inspired design system chosen deliberately for a data-dense, multi-role operational tool.

## Project Description

This is the client for a Mini ERP system managing products, customers, and sales. It doesn't ship three separate apps for three roles — it ships **one set of shared page components** (Products, Customers, Sales, Dashboard) that read the authenticated user's role and adjust what's rendered: an Employee sees a read-only product catalog and can create sales, a Manager gets full CRUD on products/customers plus the dashboard, and an Admin additionally gets user management and system tooling. The backend enforces every permission independently — the frontend's role gating is a UX convenience, not the security boundary.

## Core Features

- **JWT + Google OAuth Authentication** — local email/password login and Google OAuth, backed by an axios interceptor that transparently refreshes an expired access token and retries the original request (with request queuing to avoid duplicate refresh calls).
- **Role-Based Sidebar & Routing** — three sidebar configs (Admin/Manager/Employee) map straight to backend permissions; routes are generated from whichever config matches the logged-in user's role.
- **Product Management** — full CRUD, multi-image upload (Cloudinary, add/remove before save), SKU + category, search, category filter, three independent numeric range filters (selling price, purchase price, stock), six-field sort, and pagination — every query param wired to the backend's actual `getProductsQuerySchema`.
- **Customer Management** — full CRUD for Admin/Manager; read-only list for Employee (needed only to attach a customer to a sale).
- **Sales Management** — dynamic multi-line-item sale creation via searchable Customer and Product pickers, live client-side total preview, and a read-only detail view (sales are immutable once created — no edit form). The server, not the client, computes unit price and grand total.
- **Dashboard** — four AWS-style stat cards (Total Products, Customers, Sales, Low Stock Alerts) plus a low-stock resource table; Admin/Manager only, matching the backend's route guard.
- **Design System** — a custom AWS Console-derived visual language (`design.md`): orange accent, dense 13px typography, monospace identifiers, resource-table and service-dashboard-card patterns, restrained motion — applied consistently across marketing pages, auth screens, and every dashboard module, in both light and dark variants.
- **Form Validation** — every mutating form (Product, Customer, Sale) uses `react-hook-form` + `zod` via `@hookform/resolvers`, with server-matching validation rules (e.g. price/stock non-negativity, min ≤ max on every range filter).
- **Toast Feedback** — `sonner` for success/error feedback on every mutation, surfacing the backend's actual `AppError` message where available.
- **Reusable Picker Components** — `CustomerPicker` and `ProductPicker`: debounced search, popover-based selection, stock-awareness (out-of-stock products are shown but disabled).

## Technology Stack

| Category | Technology |
|---|---|
| **Framework** | React 19, Vite |
| **Language** | TypeScript |
| **Routing** | React Router 7 |
| **State / Data Fetching** | Redux Toolkit + RTK Query, with a custom `axiosBaseQuery` adapter over Axios (not `fetchBaseQuery`) |
| **HTTP Client** | Axios, with request/response interceptors handling JWT refresh-on-expiry |
| **Forms & Validation** | React Hook Form, Zod, `@hookform/resolvers` |
| **UI Components** | shadcn/ui (Radix UI primitives: Dialog, AlertDialog, DropdownMenu, Popover, Select, Accordion, Tooltip, etc.) |
| **Styling** | Tailwind CSS v4 (`@tailwindcss/vite`), `tailwind-merge`, `class-variance-authority`, `tw-animate-css` |
| **Icons** | lucide-react |
| **Notifications** | Sonner |
| **Charts** | Recharts (Admin Analytics) |
| **Dates** | date-fns, react-day-picker |
| **Theming** | next-themes (light/dark mode) |

## Project Architecture

The frontend mirrors the backend's philosophy of **shared logic, role-gated presentation** rather than duplicating UI per role:

- **One page component per business module** (`ProductsPage`, `CustomersPage`, `SalesPage`, `DashboardPage`) is used by every role that has access to it. Inside each page, a single `canManage` (or equivalent) boolean — derived from the authenticated user's role — decides whether mutating UI (Create/Edit/Delete buttons, forms) renders at all. Read-only roles get the exact same data view with the controls simply absent, not disabled-and-visible.
- **Role → Sidebar mapping is the single source of truth for access.** `admin.sidebar.ts`, `manager.sidebar.ts`, and `employee.sidebar.ts` each declare only the routes that role's backend permissions actually allow; `roleSidebarMap` resolves the logged-in user's role to their sidebar, and `generateRoutes` flattens that config into the actual `<Route>` elements mounted for the session. A route that isn't in a role's sidebar config simply isn't registered for that session.
- **RTK Query per feature module** (`product.api.ts`, `customer.api.ts`, `sale.api.ts`, `dashboard.api.ts`, `auth.api.ts`), each injected into a single `baseApi`, sharing one Axios instance and one set of `tagTypes` for cache invalidation. A Sale creation invalidates not just the Sales list, but also Products (stock changed) and Dashboard (totals changed) — reflecting the backend's own transactional coupling between those three.
- **Validation schemas live next to their form** (`product.validation.ts`, `customer.validation.ts`, `sale.validation.ts`, `product.filter.validation.ts`) and are written to match the backend's Zod schemas field-for-field, so a rejected form submission and a rejected API call fail for the same reason.
- **Picker components (`CustomerPicker`, `ProductPicker`) are shared, not duplicated** between the Sale creation form and any future feature needing the same lookup-and-select pattern.

## Folder Structure

```
src/
├── pages/
│   ├── Home.tsx                        # Marketing landing page
│   └── auth/
│       ├── Login.tsx
│       ├── Register.tsx
│       ├── AuthLayout.tsx              # Shared split-panel layout for auth screens
│       ├── AnimatedLoginIllustration.tsx
│       └── AnimatedRegisterIllustration.tsx
├── pages/dashboard/
│   ├── shared/                         # Used by every role that has access
│   │   ├── product/
│   │   │   ├── ProductsPage.tsx
│   │   │   ├── ProductFormDialog.tsx
│   │   │   ├── ProductFilterPanel.tsx
│   │   │   ├── ProductPicker.tsx
│   │   │   ├── product.api.ts
│   │   │   ├── product.validation.ts
│   │   │   └── product.filter.validation.ts
│   │   ├── customer/
│   │   │   ├── CustomersPage.tsx
│   │   │   ├── CustomerFormDialog.tsx
│   │   │   ├── CustomerPicker.tsx
│   │   │   ├── customer.api.ts
│   │   │   └── customer.validation.ts
│   │   ├── sale/
│   │   │   ├── SalesPage.tsx
│   │   │   ├── SaleFormDialog.tsx
│   │   │   ├── SaleDetailDialog.tsx
│   │   │   ├── sale.api.ts
│   │   │   ├── sale.types.ts
│   │   │   └── sale.validation.ts
│   │   └── dashboard/
│   │       ├── DashboardPage.tsx
│   │       ├── StatCard.tsx
│   │       ├── LowStockPanel.tsx
│   │       ├── dashboard.api.ts
│   │       └── dashboard.types.ts
│   └── Admin/                          # Admin-only, no shared equivalent
│       ├── AnalyticsPage.tsx
│       ├── AllUsersPage.tsx
│       └── CornJobPage.tsx
├── routes/
│   ├── admin.sidebar.ts
│   ├── manager.sidebar.ts
│   ├── employee.sidebar.ts
│   ├── routes.constants.ts             # roleSidebarMap
│   └── generateRoutes.ts
├── redux/
│   ├── baseApi.ts                      # createApi + axiosBaseQuery + tagTypes
│   ├── axiosBaseQuery.ts
│   └── features/
│       └── auth/auth.api.ts
├── lib/
│   └── axios.ts                        # axiosInstance + interceptors (JWT refresh)
├── components/
│   ├── ui/                             # shadcn/ui primitives
│   └── Sidebar.tsx
├── layouts/
│   └── DashboardLayout.tsx             # Role-aware sidebar + <Routes> mount point
├── hooks/
│   └── useAuth.ts (or equivalent role accessor via useUserInfoQuery)
├── config/
│   └── index.ts                        # baseUrl etc.
└── types/
    └── index.ts                        # ISidebarItem and other shared types
```

## Design System

All visual decisions trace back to a single source of truth: `design.md`, an AWS Management Console-inspired specification chosen because this app has the same underlying shape as AWS's own console — one interface, multiple roles, dense operational data (resource tables, stock counts, sale totals) that benefits from information density over decoration.

**Key tokens carried through every page:**
- **Accent**: `#FF9900` (primary) / `#EC7211` (hover) — used only for primary actions and active states, never as large background fields.
- **Chrome vs. content**: navy (`#232F3E`) is reserved for navigation/utility strips; all working content areas are light (`#F2F3F3` canvas, white surfaces) in light mode.
- **Status semantics carry real meaning, not decoration**: green (`#1D8348`) = in stock / operational / running; amber (`#F39C12`) = low stock / pending; red (`#E74C3C`) = out of stock / stopped; blue (`#3498DB`) = provisioning (used specifically on the Register screen, matching AWS's own "resource being created" status).
- **Typography**: 13px dense body text, monospace for identifiers (SKUs, sale line items) — mirroring AWS's own convention of a monospace override for machine-generated values.
- **Signature elements over generic illustrations**: the Home hero and both auth screens replace stock/generic artwork with elements grounded in the actual product — a live resource-table preview on Home, an isometric inventory crate on Login, a "provisioning" badge on Register — rather than reused assets from unrelated projects.
- **Dark mode**: `design.md` defines light-mode tokens only (AWS Console has no public dark theme), so dark-mode pairs were derived by extending the same token *roles* (canvas/surface/border/ink/accent) with dark-appropriate values, keeping `#FF9900` constant since it reads well on both backgrounds. Applied via Tailwind's `dark:` variant, toggled through `next-themes`.
- **Accessibility**: status is always conveyed by color **and** text label (never color alone), focus rings differ by surface (orange on dark chrome, blue `#0073BB` on white content), and `prefers-reduced-motion` disables all decorative SVG animation across both auth illustrations.

## Role-Based Access

| Role | Sidebar Access |
|---|---|
| **Admin** | Dashboard, Products (full CRUD), Customers (full CRUD), Sales (create + view), ERP Analytics, User Management, Automation |
| **Manager** | Dashboard, Products (full CRUD), Customers (full CRUD), Sales (create + view) |
| **Employee** | Products (read-only), Customers (read-only — for sale creation), Sales (create + view) |

Enforced at three layers: (1) the sidebar config only lists routes the role can reach, (2) each shared page component hides mutating UI when the role lacks permission, (3) the backend independently re-checks the role on every request — the frontend never being the actual security boundary.

## Authentication

- **Local login**: email + password, backed by the Passport local strategy on the backend.
- **Google OAuth**: redirect-based flow via `passport-google-oauth20`; on return, the same JWT issuance path as local login.
- **Session handling**: `useUserInfoQuery()` (from `authApi`, an RTK Query hook) is the single source of truth for the logged-in user's identity and role across the entire app — sidebar selection, page-level `canManage` checks, and route guards all read from it rather than decoding the JWT independently on the client.
- **Token refresh**: the shared Axios instance detects an expired-JWT response, queues any concurrent requests that arrive during the refresh, calls the refresh endpoint once, then replays the original request(s) — avoiding a refresh storm when multiple queries fire at once.

## Feature Modules

### Products
Search (`searchTerm`), a category filter, three independent numeric range filters (selling price, purchase price, stock quantity — each validated client-side with the same min ≤ max rule the backend enforces), a six-field sort menu, and pagination — every one of these query parameters maps directly to the backend's `getProductsQuerySchema`. Multi-image upload supports adding and removing images before save, sent as `FormData` (a stringified `data` field alongside file entries) to match the backend's `multer-storage-cloudinary` + `validateRequest` pattern exactly.

### Customers
Full CRUD for Admin/Manager; Employees get the same list and search, read-only, so they can look up a customer while building a sale without being able to alter the customer record.

### Sales
A sale is built from a searchable customer selector and one-or-more searchable product line items (each with a live stock check that disables out-of-stock products in the picker). The client shows an estimated total for feedback, but every real number — unit price, grand total — is confirmed by the backend at submission, never trusted from the form. Sales have no edit UI: they're immutable history once created, matching the backend's design.

### Dashboard
Four stat cards (Products, Customers, Sales, Low Stock Alerts) using the AWS "service dashboard card" pattern (colored left border, large metric value), plus a low-stock resource table using the same visual pattern as the product catalog table. Admin/Manager only, with a client-side redirect guard backing up the backend's own role check.

## Available Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `vite` | Runs the Vite dev server |
| `build` | `tsc -b && vite build` | Type-checks then builds for production |
| `lint` | `eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0` | Lints the codebase, zero warnings tolerated |
| `preview` | `vite preview` | Serves the production build locally for a final check |

## Installation Guide

```bash
# 1. Clone the repository
git clone https://github.com/Humayun1318/erp-ims-client.git
cd <client-repo-name>

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# fill in the values below

# 4. Run the dev server
npm run dev

# 5. Build for production
npm run build

# 6. Preview the production build
npm run preview
```

## Environment Variables

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

## Future Improvements

- **Distinct-category endpoint** — the Product category filter is currently free text matched exactly by the backend (`QueryBuilder.filter()`); a `GET /products/categories` endpoint would let it become a proper dropdown instead of relying on exact-case text entry.
- **Optimistic updates** — RTK Query's `onQueryStarted` for instant UI feedback on Create/Update/Delete before the server responds.
- **Table virtualization** — for very large product/sale datasets beyond what pagination comfortably handles in a single render.
- **E2E testing** — Playwright/Cypress coverage of the full Sale-creation flow (customer + product selection through to confirmation).
- **Skeleton-consistent loading states** — extend the current per-row skeletons to the stat cards and filter panel for a fully consistent loading experience.
- **Accessible combobox upgrade** — replace the current custom `Popover`-based pickers with a `cmdk`-backed combobox if keyboard navigation needs go beyond what's currently implemented.

## Author

**Humayun Kabir**
Full-Stack Developer
GitHub: [github.com/Humayun1318](https://github.com/Humayun1318)
Email: humayunkabir6267@gmail.com