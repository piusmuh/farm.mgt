#!/usr/bin/env python3
"""
Farm Management System - Test Script
Tests the core functionality of the system:
  1. Database connection
  2. Required tables exist
  3. Sample data exists
  4. Flask app starts
  5. Login flow works (admin/password)
  6. Key API endpoints respond correctly
"""

import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

passed = 0
failed = 0


def report(name, ok, detail=""):
    global passed, failed
    if ok:
        passed += 1
        print(f"  [PASS] {name}")
    else:
        failed += 1
        print(f"  [FAIL] {name} {detail}")


def test_database_connection():
    print("\n1. Database connection")
    try:
        from app import get_db_connection
        connection = get_db_connection()
        report("Connect to MySQL", connection is not None)
        if connection:
            connection.close()
            return True
    except Exception as e:
        report("Connect to MySQL", False, f"({e})")
    return False


def test_database_tables():
    print("\n2. Required tables")
    try:
        from app import get_db_connection
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute("SHOW TABLES")
        existing = {row[0] for row in cursor.fetchall()}
        cursor.close()
        connection.close()

        required = [
            'users', 'farms', 'crops', 'livestock', 'equipment',
            'financial_records', 'inventory', 'labour', 'tasks',
            'maintenance_logs', 'crop_yield_history', 'weather_data',
            'user_preferences'
        ]
        missing = [t for t in required if t not in existing]
        report("All required tables exist", not missing,
               f"missing: {missing}" if missing else "")
        return not missing
    except Exception as e:
        report("All required tables exist", False, f"({e})")
        return False


def test_sample_data():
    print("\n3. Sample data")
    try:
        from app import get_db_connection
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        counts = {}
        for table in ['users', 'farms', 'crops', 'livestock', 'financial_records']:
            cursor.execute(f"SELECT COUNT(*) as count FROM {table}")
            counts[table] = cursor.fetchone()['count']

        cursor.close()
        connection.close()

        report("Users seeded", counts['users'] > 0, f"({counts['users']} rows)")
        report("Farms seeded", counts['farms'] > 0, f"({counts['farms']} rows)")
        report("Crops seeded", counts['crops'] > 0, f"({counts['crops']} rows)")
        report("Livestock seeded", counts['livestock'] > 0, f"({counts['livestock']} rows)")
        report("Financial records seeded", counts['financial_records'] > 0,
               f"({counts['financial_records']} rows)")
        return all(v > 0 for v in counts.values())
    except Exception as e:
        report("Sample data", False, f"({e})")
        return False


def test_flask_and_apis():
    print("\n4. Flask app and API endpoints")
    try:
        from app import app
    except Exception as e:
        report("Import Flask app", False, f"({e})")
        return False

    report("Import Flask app", True)

    client = app.test_client()

    # Login page renders
    response = client.get('/login')
    report("GET /login returns 200", response.status_code == 200,
           f"(got {response.status_code})")

    # Unauthenticated API redirects to login
    response = client.get('/api/farms')
    report("Unauthenticated /api/farms redirects", response.status_code == 302,
           f"(got {response.status_code})")

    # Login with demo credentials
    response = client.post('/login', data={'username': 'admin', 'password': 'password'},
                           follow_redirects=False)
    report("Login admin/password works", response.status_code == 302,
           f"(got {response.status_code})")

    if response.status_code != 302:
        return False

    # Authenticated endpoints
    endpoints = [
        '/dashboard', '/farms', '/crops', '/livestock', '/equipment',
        '/inventory', '/labour', '/tasks', '/financial', '/reports',
        '/api/farms', '/api/crops', '/api/livestock', '/api/equipment',
        '/api/inventory', '/api/labour', '/api/tasks', '/api/financial',
        '/api/financial/summary', '/api/dashboard/stats',
        '/api/dashboard/enhanced-stats', '/api/dashboard/fixed-stats',
        '/api/dashboard/optimized-stats', '/api/dashboard/performance-trends',
        '/api/dashboard/predictive-insights', '/api/alerts/critical',
        '/api/charts/revenue-expense', '/api/charts/revenue-expense?period=12',
        '/api/charts/crop-distribution', '/api/charts/livestock-health',
        '/api/reports/performance', '/api/reports/financial-summary',
        '/api/reports/crop-yield-comparison', '/api/reports/comprehensive',
        '/api/reports/comprehensive-analysis', '/api/reports/seasonal-performance',
        '/api/reports/predictive-insights', '/api/analytics/farm-performance',
        '/api/analytics/seasonal-trends', '/api/search?q=maize',
        '/api/user/preferences', '/api/weather',
    ]
    for endpoint in endpoints:
        response = client.get(endpoint)
        report(f"GET {endpoint}", response.status_code == 200,
               f"(got {response.status_code})")

    # Worker role restrictions
    client.get('/logout')
    client.post('/login', data={'username': 'worker', 'password': 'password'})
    response = client.post('/api/farms', json={
        'name': 'Test', 'owner_name': 'T', 'location': 'X', 'size_acres': 1
    })
    report("Worker cannot create farms (403)", response.status_code == 403,
           f"(got {response.status_code})")

    # Bad login rejected
    client.get('/logout')
    response = client.post('/login', data={'username': 'admin', 'password': 'wrong'})
    report("Wrong password rejected", b'Invalid credentials' in response.data,
           "(no error shown)")

    return True


def main():
    print("=" * 60)
    print("Farm Management System - System Test")
    print("=" * 60)

    ok = test_database_connection()
    if ok:
        test_database_tables()
        test_sample_data()
    test_flask_and_apis()

    print("\n" + "=" * 60)
    total = passed + failed
    print(f"Test Results: {passed}/{total} checks passed")
    if failed == 0:
        print("All tests passed! System is ready to use.")
        print("\nTo start the system:")
        print("  1. Make sure MySQL (XAMPP/WAMP/standalone) is running")
        print("  2. Import database/farm_management.sql")
        print("  3. Run: python app.py")
        print("  4. Open: http://localhost:5000")
        print("  5. Login with: admin / password")
    else:
        print("Some checks failed. See SETUP_INSTRUCTIONS.md for setup help.")
    print("=" * 60)
    return failed == 0


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)