# StockFlow — Warehouse Management System (WMS)

A full-stack modern Warehouse Management System (MERN) designed for multi-facility stock control, inter-warehouse transfer workflows, audit logging, and role-based administration.

---

##  Key Features

###  Warehouse Management
- **Multi-Facility Directory**: View and manage warehouse locations, address information, and storage limits.
- **Real-Time Capacity Utilization**: Live capacity gauges calculated directly from inventory units stored vs. max capacity.
- **CRUD Operations**: Create new facilities, update parameters, and safely delete empty warehouses.
- **Facility-Level Inventory & Transfers**: Filter stock and monitor active inbound/outbound transfer requests per warehouse.

### Inventory & Stock Control
- **Unified Inventory**: Monitor stock levels across all facilities with real-time SKU and product search.
- **Stock Health Monitoring**: Automatic categorization into **In Stock**, **Low Stock Warning**, and **Out of Stock**.
- **Product Management**: Add new products with SKU, category, initial quantity, and minimum threshold alert levels.
- **Instant Stock Adjustments**: Fast modal to modify quantity with live backend API synchronization.
- **Direct Transfer Triggers**: Start an inter-warehouse transfer directly from any product row.

### Inter-Warehouse Stock Transfers
- **End-to-End Workflow Lifecycle**: `PENDING` $\rightarrow$ `APPROVED` $\rightarrow$ `IN_TRANSIT` $\rightarrow$ `COMPLETED` (or `REJECTED` / `CANCELLED`).
- **Interactive Manifest**: Add multiple products with stock availability checks against the origin warehouse.
- **Approval Workflows**: Destination warehouses and managers can approve or reject incoming requests.
- **Atomic Stock Settlements**: Completing a transfer automatically deducts units from the source warehouse and credits the destination warehouse.

### Administration & Security
- **Clerk Authentication**: Secure authentication with JWT verification on both frontend and backend.
- **Role-Based Access Control (RBAC)**: Support for `ADMIN`, `MANAGER`, `STAFF`, and `USER` roles.
- **Audit Logs**: Automatic logging of critical actions (warehouse creation, transfers approved/completed, stock updates).
- **User Management**: View and manage system users and access roles.

---

## Technology Stack

- **Frontend**:
  - React 18 & Vite
  - React Router v6 (Protected & Role Routes)
  - `@clerk/clerk-react`
  - TailwindCSS & Lucide Icons
  - Axios with dynamic JWT session interceptors
- **Backend**:
  - Node.js & Express
  - MongoDB & Mongoose
  - `@clerk/express` (Authentication & Claims Verification)
  - CORS & Dotenv

---

##  Project Architecture

```
WareHouse_Management/
├── backend/
│   ├── src/
│   │   ├── config/          # Database connection
│   │   ├── controllers/     # Warehouse, Inventory, Transfer, User, Audit controllers
│   │   ├── middleware/      # Clerk Auth, Role verification, Error handler
│   │   ├── models/          # Mongoose schemas (Warehouse, Inventory, Transfer, AuditLog)
│   │   ├── routes/          # Express API routes
│   │   ├── utils/           # Audit logger utility
│   │   └── server.js        # Express app entry & Vercel serverless export
│   ├── .env.example
│   ├── package.json
│   └── vercel.json          # Backend serverless configuration
├── frontend/
│   ├── src/
│   │   ├── admin/           # Admin Dashboard, Users, Audit Logs
│   │   ├── components/      # Common, Inventory, Warehouse, Transfer, Layout components
│   │   ├── context/         # Auth, Warehouse, Inventory, Transfer Contexts
│   │   ├── hooks/           # useInventory, useWarehouses, useTransfers, useAuth
│   │   ├── pages/           # Dashboard, Warehouses, Inventory, Transfers, Settings, Auth
│   │   ├── routes/          # AppRoutes, ProtectedRoute, RoleRoute
│   │   ├── services/        # Axios API clients
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json          # Frontend SPA routing configuration
├── .gitignore
└── README.md
```

---

##  Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas database cluster or local MongoDB instance
- [Clerk](https://clerk.com/) account for authentication keys

---

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   npm install
   ```

2. Create a `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Configure your `.env` variables:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/warehouse_management?retryWrites=true&w=majority
   CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```

4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The backend will be running at `http://localhost:5000`.*

---

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   npm install
   ```

2. Create a `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Configure your `.env` variables:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *The frontend will be available at `http://localhost:5173`.*

---

## API Reference Overview

### Warehouses (`/api/warehouses`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/warehouses` | Get all warehouses with capacity utilization |
| `GET` | `/api/warehouses/:id` | Get single warehouse details |
| `GET` | `/api/warehouses/:id/stats` | Get warehouse statistics |
| `GET` | `/api/warehouses/:id/inventory` | Get all items stored in warehouse |
| `POST` | `/api/warehouses` | Create a new warehouse |
| `PUT` | `/api/warehouses/:id` | Update warehouse details |
| `DELETE` | `/api/warehouses/:id` | Delete empty warehouse |

### Inventory (`/api/inventory`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/inventory` | List all inventory items |
| `GET` | `/api/inventory/low-stock` | List items below minimum threshold |
| `GET` | `/api/inventory/search?q=` | Search inventory items |
| `GET` | `/api/inventory/warehouse/:id`| Get inventory by warehouse |
| `GET` | `/api/inventory/:id` | Get single inventory item |
| `POST` | `/api/inventory` | Create new inventory item |
| `PATCH` | `/api/inventory/:id/stock` | Update stock quantity |

### Transfers (`/api/transfers`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/transfers` | List all transfer requests |
| `GET` | `/api/transfers/stats` | Get transfer status count statistics |
| `GET` | `/api/transfers/:id` | Get transfer details & items |
| `POST` | `/api/transfers` | Create a new transfer request |
| `PATCH` | `/api/transfers/:id/approve` | Approve transfer request |
| `PATCH` | `/api/transfers/:id/reject` | Reject transfer request |
| `PATCH` | `/api/transfers/:id/ship` | Mark transfer as in-transit |
| `PATCH` | `/api/transfers/:id/complete` | Complete transfer & update stock |
| `PATCH` | `/api/transfers/:id/cancel` | Cancel transfer request |

### Admin & Audit (`/api/admin`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/admin/users` | List system users |
| `GET` | `/api/admin/audit-logs` | Retrieve system audit logs |

---

## Deployment (Vercel)

### Frontend Deployment
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**:
  - `VITE_CLERK_PUBLISHABLE_KEY`
  - `VITE_API_URL` (Points to deployed backend URL + `/api`)

### Backend Deployment
- **Root Directory**: `backend`
- **Framework Preset**: Other
- **Environment Variables**:
  - `MONGODB_URI`
  - `CLERK_SECRET_KEY`
  - `CLERK_PUBLISHABLE_KEY`
  - `CLIENT_URL` (Points to deployed frontend domain)
  - `NODE_ENV=production`

---

## 📄 License
This project is licensed under the MIT License.
