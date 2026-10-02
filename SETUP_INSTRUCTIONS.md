# Farm Management System — Setup Instructions

A Flask + MySQL web application for managing farms, crops, livestock,
equipment, inventory, labour, tasks, finances, and reports.

---

## 1. Prerequisites

| Requirement | Notes |
|---|---|
| Python 3.9+ | Check with `python --version` |
| MySQL 8.0+ (or MariaDB) | Easiest via [XAMPP](https://www.apachefriends.org/) — just start **MySQL** from the XAMPP Control Panel |
| pip | Comes with Python |

---

## 2. Open the project in VS Code

1. Open **VS Code**
2. `File → Open Folder…` and select the `farm_management_system` folder
3. Open the built-in terminal: `View → Terminal` (or `Ctrl + ~`)

---

## 3. Install Python dependencies

In the VS Code terminal:

```bash
pip install -r requirements.txt
```

---

## 4. Create the database

### Option A — Command line (recommended)

```bash
mysql -u root -p < database/farm_management.sql
```

(Enter your MySQL root password when prompted. If root has no password,
just press Enter.)

### Option B — phpMyAdmin (XAMPP)

1. Start **Apache** and **MySQL** in the XAMPP Control Panel
2. Open http://localhost/phpmyadmin
3. Click **Import** → choose `database/farm_management.sql` → **Go**

This creates the `farm_management` database, all tables, indexes, and
sample data (3 farms, crops, livestock, equipment, inventory, workers,
tasks, and 12 months of financial records).

---

## 5. Configure environment (optional)

The app reads connection settings from a `.env` file. If your MySQL root
user has a password, create a file named `.env` in the project root:

```ini
SECRET_KEY=dev-secret-change-in-production
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=farm_management
```

(See `.env.example` for a template. If you skip this, the app uses
defaults: localhost:3306, user `root`, empty password.)

---

## 6. Run the application

```bash
python app.py
```

Then open your browser at:

**http://localhost:5000**

---

## 7. Login

| Username | Password | Role | Permissions |
|---|---|---|---|
| `admin` | `password` | Admin | Full access (create/edit/delete) |
| `manager` | `password` | Manager | Full access (create/edit/delete) |
| `worker` | `password` | Worker | Read-only |

---

## 8. Run the automated tests

With MySQL running and the database imported:

```bash
python test_system.py
```

This checks the database connection, tables, sample data, login flow,
role permissions, and every major API endpoint.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `Error connecting to MySQL` | Make sure MySQL is running (XAMPP Control Panel → MySQL → Start) |
| `Unknown database 'farm_management'` | Import the SQL file (step 4) |
| `Access denied for user 'root'` | Set your MySQL password in the `.env` file (step 5) |
| Port 5000 already in use | Edit the last line of `app.py` to `port=5001` |
| Login always says "Invalid credentials" | Re-import the SQL file so the demo users are created |
| Charts are empty | Sample financial data covers the last 12 months; add more transactions via the Financial page |

---

## Project structure

```
farm_management_system/
├── app.py                      # Flask application (all routes)
├── requirements.txt            # Python dependencies
├── test_system.py              # Automated test script
├── .env.example                # Environment variable template
├── database/
│   └── farm_management.sql     # Schema + sample data
├── static/
│   ├── css/style.css           # Styles (professional light theme)
│   └── js/main.js              # Shared helpers (tables, charts, search)
└── templates/                  # Jinja2 HTML pages
    ├── base.html               # Layout + sidebar
    ├── login.html, dashboard.html
    ├── farms.html, crops.html, livestock.html
    ├── equipment.html, inventory.html
    ├── labour.html, tasks.html
    └── financial.html, reports.html
```
