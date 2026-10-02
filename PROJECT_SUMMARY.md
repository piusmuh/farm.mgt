# Farm Management System — Project Summary

A complete **Flask + MySQL** database project for managing agricultural
operations: farms, crops, livestock, equipment, inventory, labour, tasks,
finances, and reports — with role-based access control and a clean,
professional web interface.

---

## Features

### Modules
| Module | Capabilities |
|---|---|
| **Dashboard** | Live stats, financial trend charts (3/6/12 months), crop distribution, livestock health, critical alerts, recent activity, predictive insights |
| **Farms** | Full CRUD, per-farm statistics, safe delete with dependency checks |
| **Crops** | Full CRUD, planting/harvest tracking, yield comparison reports |
| **Livestock** | Full CRUD, health status tracking, health analytics |
| **Equipment** | Full CRUD, condition tracking, maintenance-due alerts |
| **Inventory** | Full CRUD, quantity/unit pricing, total value calculation, low-stock alerts |
| **Labour** | Worker registry, task assignment, worker task views |
| **Tasks** | Kanban-style statuses, priorities, due dates, creator-based permissions |
| **Financial** | Revenue/expense records, category filtering, date ranges, monthly summary |
| **Reports** | Farm performance, financial summaries, crop yield comparison, seasonal trends, comprehensive multi-dimensional analysis, Uganda-specific seasonal insights |

### Security
- Session-based authentication with hashed passwords (Werkzeug PBKDF2)
- Role-based access control enforced **server-side** (`admin` / `manager` / `worker`)
- Workers are read-only; destructive endpoints check roles before executing
- Parameterized SQL queries throughout (no SQL injection)
- Safe delete logic that checks foreign-key dependencies before removing records

### Database
- 13 InnoDB tables with proper foreign keys and indexes
- Sample data covering 12 months of operations for realistic charts/reports
- JSON serialization layer for dates and decimals

---

## Technology Stack

| Layer | Technology |
|---|---|
| Backend | Python 3, Flask 2.3 |
| Database | MySQL 8.0+ (mysql-connector-python) |
| Frontend | Bootstrap 5, Chart.js, Font Awesome, vanilla JS |
| Config | python-dotenv (`.env` file support) |

---

## Quick Start

```bash
pip install -r requirements.txt
mysql -u root -p < database/farm_management.sql
python app.py
```

Open **http://localhost:5000** and log in with `admin` / `password`.

Full details: see `SETUP_INSTRUCTIONS.md`.

---

## Testing

```bash
python test_system.py
```

Runs 50+ automated checks: database connection, schema, sample data,
login flow, role permissions, and every major API endpoint.

---

## Demo Accounts

| Username | Password | Role |
|---|---|---|
| admin | password | Admin (full access) |
| manager | password | Manager (full access) |
| worker | password | Worker (read-only) |