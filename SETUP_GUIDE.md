# Simple Setup Guide for Farm Management System

## What You Need to Download (Before Starting)

1. **XAMPP** (for MySQL database) - Download from: https://www.apachefriends.org/
   - Click "Download" for Windows
   - Choose the latest version (7.4 or 8.0+)

2. **VS Code** (to run the project) - Download from: https://code.visualstudio.com/
   - Click "Download for Windows"

3. **Python 3.9+** (if not already installed) - Download from: https://www.python.org/
   - Click "Download Python"
   - IMPORTANT: Check the box that says "Add Python to PATH" during installation

---

## Step 1: Install XAMPP

1. Find the XAMPP file you downloaded and double-click it
2. Click "Next" through all the installation screens (keep clicking Next)
3. When asked what components to install, make sure **MySQL** is checked
4. Click "Finish" when installation is complete
5. Open XAMPP from your desktop or Start menu

---

## Step 2: Start MySQL in XAMPP

1. In XAMPP, you'll see a Control Panel
2. Find the row that says "MySQL"
3. Click the **"Start"** button next to MySQL
4. The button should turn green and say "Running"
5. **Keep XAMPP open** (don't close it while using the project)

---

## Step 3: Set Up the Database

1. While XAMPP is running, open your web browser (Chrome, Edge, etc.)
2. Type this address: `http://localhost/phpmyadmin`
3. You should see the phpMyAdmin page (database management)
4. Click on the **"Import"** tab at the top
5. Click **"Choose File"** and select the file: `database/farm_management.sql`
6. Click the **"Go"** button at the bottom
7. Wait for it to finish - you should see a success message
8. The database is now ready!

---

## Step 4: Open the Project in VS Code

1. Open VS Code from your desktop or Start menu
2. Click **"File"** in the top menu
3. Click **"Open Folder..."**
4. Find and select the `farm_management_system` folder
5. Click **"Select Folder"**

---

## Step 5: Install Python Dependencies

1. In VS Code, go to **"Terminal"** in the top menu
2. Click **"New Terminal"** (a terminal window will open at the bottom)
3. Type this command and press Enter:
   ```
   pip install -r requirements.txt
   ```
4. Wait for it to finish installing (this may take a few minutes)

---

## Step 6: Run the Application

1. In the same terminal window, type this command and press Enter:
   ```
   python app.py
   ```
2. You should see a message like: `Running on http://127.0.0.1:5000`
3. **Keep this terminal window open** (don't close it)
4. Open your web browser
5. Type this address: `http://localhost:5000`
6. The Farm Management System should now open!

---

## How to Log In

Use these login details:

| Username | Password | What You Can Do |
|----------|----------|-----------------|
| `admin` | `password` | Full access - can do everything |
| `manager` | `password` | Full access - can do everything |
| `worker` | `password` | Read-only - can only view data |

---

## How to Use the Site

### Dashboard (First Page)
- Shows statistics: number of farms, crops, livestock, and monthly profit
- Displays alerts for things that need attention
- Shows charts for financial trends and crop distribution
- Quick action buttons to add new items

### Navigation (Left Side Menu)
- **Dashboard**: Main overview page
- **Farms**: Add, edit, or view farm information
- **Crops**: Manage crops, planting dates, and harvest tracking
- **Livestock**: Track animals, health status, and breeds
- **Equipment**: Manage farm equipment and maintenance schedules
- **Inventory**: Track supplies, stock levels, and suppliers
- **Labour**: Manage workers and their assignments
- **Tasks**: Create and assign tasks to workers
- **Financial**: Record income and expenses
- **Reports**: View detailed reports and analytics

### Common Actions
- **Add New Item**: Click the "Add" button on any page
- **Edit Item**: Click the "Edit" button next to any item
- **Delete Item**: Click the "Delete" button (only for Admin/Manager)
- **Search**: Use the search bar at the top to find items
- **Filter**: Use filter options to narrow down results

---

## Important Database Information

### What the Database Does
- Stores all your farm data securely
- Keeps track of relationships (farms → crops, farms → livestock, etc.)
- Automatically updates when you add, edit, or delete items
- Provides data for reports and charts

### Database Tables (What's Stored)
- **Users**: Login information and permissions
- **Farms**: Farm locations and details
- **Crops**: Planting and harvest information
- **Livestock**: Animal records and health status
- **Equipment**: Machinery and maintenance schedules
- **Inventory**: Supplies and stock levels
- **Labour**: Worker information
- **Tasks**: Task assignments and status
- **Financial Records**: Income and expenses
- **Reports**: Generated reports and analytics

### Database Connection
- The system automatically connects to MySQL when you run it
- No additional setup needed after importing the SQL file
- All data is saved permanently in the database

---

## Troubleshooting Common Problems

### Problem: "Error connecting to MySQL"
**Solution:** Make sure XAMPP is open and MySQL is started (green button)

### Problem: "Unknown database 'farm_management'"
**Solution:** Import the SQL file again in phpMyAdmin (Step 3)

### Problem: "Python command not found"
**Solution:** Make sure Python is installed and added to PATH during installation

### Problem: Port 5000 already in use
**Solution:** Close other programs using port 5000, or edit the last line of `app.py` to use port 5001

### Problem: Login says "Invalid credentials"
**Solution:** Make sure you imported the SQL file correctly to create the demo users

---

## How to Stop the Application

1. Go to the terminal window where `python app.py` is running
2. Press `Ctrl + C` on your keyboard
3. The application will stop
4. You can close VS Code and XAMPP when done

---

## Quick Reference Summary

**Always do this order:**
1. Open XAMPP → Start MySQL
2. Open VS Code → Open project folder
3. Open terminal → Run `pip install -r requirements.txt` (first time only)
4. Run `python app.py`
5. Open browser → Go to `http://localhost:5000`

**Login details:**
- Username: `admin` Password: `password`

**Database access:**
- Go to `http://localhost/phpmyadmin` to view database directly

That's it! You now have everything you need to run the Farm Management System on your computer.