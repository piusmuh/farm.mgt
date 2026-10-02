-- ============================================================
-- Farm Management System - Database Schema
-- MySQL 8.0+ / MariaDB 10.4+
--
-- To install:
--   mysql -u root -p < database/farm_management.sql
-- (or import via phpMyAdmin in XAMPP)
-- ============================================================

CREATE DATABASE IF NOT EXISTS farm_management
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE farm_management;

-- -----------------------
-- Core tables
-- -----------------------

-- Users table for authentication and role management
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'manager', 'worker') DEFAULT 'worker',
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Farms table for farm information
CREATE TABLE IF NOT EXISTS farms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(200) NOT NULL,
    size_acres DECIMAL(10,2),
    owner_name VARCHAR(100),
    established_date DATE,
    description TEXT,
    status ENUM('active', 'inactive', 'sold') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Crops table
CREATE TABLE IF NOT EXISTS crops (
    id INT AUTO_INCREMENT PRIMARY KEY,
    farm_id INT NOT NULL,
    crop_name VARCHAR(100) NOT NULL,
    variety VARCHAR(100),
    planting_date DATE,
    harvest_date DATE,
    area_acres DECIMAL(8,2),
    expected_yield DECIMAL(10,2),
    actual_yield DECIMAL(10,2),
    status ENUM('planted', 'growing', 'ready_harvest', 'harvested', 'failed') DEFAULT 'planted',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Livestock table
CREATE TABLE IF NOT EXISTS livestock (
    id INT AUTO_INCREMENT PRIMARY KEY,
    farm_id INT NOT NULL,
    animal_type VARCHAR(50) NOT NULL,
    breed VARCHAR(100),
    tag_number VARCHAR(50) UNIQUE,
    birth_date DATE,
    gender ENUM('male', 'female'),
    weight DECIMAL(8,2),
    health_status ENUM('healthy', 'sick', 'injured', 'deceased') DEFAULT 'healthy',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Equipment table
CREATE TABLE IF NOT EXISTS equipment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    farm_id INT NOT NULL,
    equipment_name VARCHAR(100) NOT NULL,
    equipment_type VARCHAR(50),
    brand VARCHAR(100),
    model VARCHAR(100),
    purchase_date DATE,
    purchase_price DECIMAL(12,2),
    condition_status ENUM('excellent', 'good', 'fair', 'poor', 'broken') DEFAULT 'good',
    maintenance_due DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Financial records
CREATE TABLE IF NOT EXISTS financial_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    farm_id INT NOT NULL,
    transaction_type ENUM('revenue', 'expense') NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    amount DECIMAL(12,2) NOT NULL,
    transaction_date DATE NOT NULL,
    payment_method ENUM('cash', 'check', 'card', 'bank_transfer') DEFAULT 'cash',
    reference_number VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Inventory
CREATE TABLE IF NOT EXISTS inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    farm_id INT NOT NULL,
    item_name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    quantity DECIMAL(10,2) NOT NULL,
    unit VARCHAR(20),
    unit_price DECIMAL(10,2),
    supplier VARCHAR(100),
    purchase_date DATE,
    expiry_date DATE,
    location VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Reports (references users and farms)
CREATE TABLE IF NOT EXISTS reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    farm_id INT NOT NULL,
    report_type VARCHAR(50) NOT NULL,
    report_date DATE NOT NULL,
    data JSON,
    notes TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Labour (parent for tasks.assigned_to)
CREATE TABLE IF NOT EXISTS labour (
    id INT AUTO_INCREMENT PRIMARY KEY,
    farm_id INT NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(30),
    role ENUM('worker','supervisor','manager','other') DEFAULT 'worker',
    hired_date DATE NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tasks
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    farm_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    assigned_to INT NULL,             -- labour.id
    status ENUM('todo','in_progress','completed','blocked','cancelled') DEFAULT 'todo',
    priority ENUM('low','medium','high','critical') DEFAULT 'medium',
    due_date DATE NULL,
    completed_date DATE NULL,
    created_by INT NULL,              -- users.id
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES labour(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Maintenance schedules for equipment
CREATE TABLE IF NOT EXISTS maintenance_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    equipment_id INT NOT NULL,
    maintenance_date DATE NOT NULL,
    maintenance_type ENUM('routine', 'repair', 'inspection', 'overhaul'),
    description TEXT,
    cost DECIMAL(10,2),
    performed_by VARCHAR(100),
    next_maintenance_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Crop yield tracking over time
CREATE TABLE IF NOT EXISTS crop_yield_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    crop_id INT NOT NULL,
    harvest_date DATE NOT NULL,
    yield_amount DECIMAL(10,2),
    quality_rating ENUM('poor', 'fair', 'good', 'excellent'),
    market_price DECIMAL(8,2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (crop_id) REFERENCES crops(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Weather data for farm monitoring
CREATE TABLE IF NOT EXISTS weather_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    farm_id INT NOT NULL,
    record_date DATE NOT NULL,
    temperature DECIMAL(5,2),
    rainfall DECIMAL(8,2),
    humidity DECIMAL(5,2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- User preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    preference_key VARCHAR(100) NOT NULL,
    preference_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_preference (user_id, preference_key),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------
-- Indexes (plain CREATE INDEX - MySQL does not support IF NOT EXISTS here)
-- -----------------------
CREATE INDEX idx_crops_farm_id ON crops(farm_id);
CREATE INDEX idx_livestock_farm_id ON livestock(farm_id);
CREATE INDEX idx_equipment_farm_id ON equipment(farm_id);
CREATE INDEX idx_financial_farm_id ON financial_records(farm_id);
CREATE INDEX idx_inventory_farm_id ON inventory(farm_id);
CREATE INDEX idx_reports_farm_id ON reports(farm_id);
CREATE INDEX idx_financial_date ON financial_records(transaction_date);
CREATE INDEX idx_financial_type ON financial_records(transaction_type);
CREATE INDEX idx_labour_farm_id ON labour(farm_id);
CREATE INDEX idx_tasks_farm_id ON tasks(farm_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_weather_farm_date ON weather_data(farm_id, record_date);
CREATE INDEX idx_maintenance_equipment ON maintenance_logs(equipment_id);
CREATE INDEX idx_yield_crop ON crop_yield_history(crop_id);

-- -----------------------
-- Sample data (parents first)
-- Password for all demo users: "password"
-- -----------------------

-- Users (werkzeug pbkdf2 hashes of "password")
INSERT INTO users (username, email, password_hash, role, full_name, phone) VALUES
('admin', 'admin@farm.com', 'pbkdf2:sha256:600000$Ro5bHQVSEIe8qLbH$0424c42649577929e883093ddffaca9186a8e959d6779ec50023f80e300ab7c8', 'admin', 'Farm Administrator', '+256700000001'),
('manager', 'manager@farm.com', 'pbkdf2:sha256:600000$Ro5bHQVSEIe8qLbH$0424c42649577929e883093ddffaca9186a8e959d6779ec50023f80e300ab7c8', 'manager', 'Farm Manager', '+256700000002'),
('worker', 'worker@farm.com', 'pbkdf2:sha256:600000$Ro5bHQVSEIe8qLbH$0424c42649577929e883093ddffaca9186a8e959d6779ec50023f80e300ab7c8', 'worker', 'Farm Worker', '+256700000003');

-- Farms
INSERT INTO farms (name, location, size_acres, owner_name, established_date, description) VALUES
('Green Valley Farm', 'Mukono District, Uganda', 150.50, 'John Ssemakula', '2020-01-15', 'Organic vegetable and grain farm'),
('Sunrise Ranch', 'Jinja District, Uganda', 200.75, 'Jane Nabirye', '2018-03-20', 'Cattle and dairy operation'),
('Harvest Hills', 'Wakiso District, Uganda', 75.25, 'Mike Okello', '2021-06-10', 'Specialty crop farm');

-- Crops (mix of growing and harvested, recent dates)
INSERT INTO crops (farm_id, crop_name, variety, planting_date, harvest_date, area_acres, expected_yield, actual_yield, status) VALUES
(1, 'Maize', 'Longe 5', '2026-03-15', '2026-08-10', 50.0, 2500.0, 2450.0, 'harvested'),
(1, 'Beans', 'NABE 15', '2026-04-20', '2026-07-25', 30.0, 1500.0, 1420.0, 'harvested'),
(1, 'Tomatoes', 'Roma', '2026-05-15', NULL, 5.0, 200.0, NULL, 'growing'),
(1, 'Coffee', 'Arabica', '2025-10-01', NULL, 20.0, 800.0, NULL, 'growing'),
(2, 'Alfalfa', 'Premium', '2026-02-01', '2026-05-30', 40.0, 800.0, 760.0, 'harvested'),
(2, 'Napier Grass', 'Bana Grass', '2026-01-10', NULL, 25.0, 3000.0, NULL, 'growing'),
(3, 'Strawberries', 'Sweet Charlie', '2026-03-10', '2026-06-15', 10.0, 100.0, 95.0, 'harvested'),
(3, 'Cabbage', 'Giant Copenhagen', '2026-06-01', NULL, 8.0, 400.0, NULL, 'growing');

-- Livestock
INSERT INTO livestock (farm_id, animal_type, breed, tag_number, birth_date, gender, weight, health_status) VALUES
(2, 'Cattle', 'Holstein', 'C001', '2023-03-15', 'female', 450.0, 'healthy'),
(2, 'Cattle', 'Angus', 'C002', '2022-11-20', 'male', 600.0, 'healthy'),
(2, 'Cattle', 'Holstein', 'C003', '2024-01-10', 'female', 220.0, 'sick'),
(2, 'Pig', 'Yorkshire', 'P001', '2024-02-15', 'male', 150.0, 'healthy'),
(2, 'Chicken', 'Rhode Island Red', 'CH001', '2024-03-01', 'female', 3.5, 'healthy'),
(2, 'Goat', 'Boer', 'G001', '2024-05-20', 'female', 45.0, 'healthy'),
(3, 'Sheep', 'Dorper', 'S001', '2024-04-12', 'male', 60.0, 'injured');

-- Equipment
INSERT INTO equipment (farm_id, equipment_name, equipment_type, brand, model, purchase_date, purchase_price, condition_status, maintenance_due) VALUES
(1, 'John Deere Tractor', 'Tractor', 'John Deere', '6R Series', '2022-01-15', 85000.00, 'excellent', '2026-09-15'),
(1, 'Combine Harvester', 'Harvester', 'Case IH', 'Axial-Flow', '2021-08-20', 120000.00, 'good', '2026-09-02'),
(2, 'Milking Machine', 'Dairy Equipment', 'DeLaval', 'VMS V300', '2022-03-10', 45000.00, 'excellent', '2026-10-10'),
(3, 'Irrigation System', 'Irrigation', 'Rain Bird', 'Center Pivot', '2023-01-05', 25000.00, 'good', '2026-08-30'),
(1, 'Knapsack Sprayer', 'Sprayer', 'Hozelock', 'Plus 12L', '2024-06-10', 120.00, 'fair', '2026-08-28');

-- Financial records (last ~12 months so charts and reports have data)
INSERT INTO financial_records (farm_id, transaction_type, category, description, amount, transaction_date, payment_method) VALUES
(1, 'revenue', 'Crop Sales', 'Maize harvest sale', 15000.00, '2025-09-15', 'bank_transfer'),
(1, 'expense', 'Seeds', 'Maize seed purchase', 2500.00, '2025-09-20', 'check'),
(2, 'revenue', 'Dairy Sales', 'Milk sales - October', 8500.00, '2025-10-31', 'bank_transfer'),
(2, 'expense', 'Feed', 'Cattle feed purchase', 3200.00, '2025-10-15', 'check'),
(1, 'revenue', 'Crop Sales', 'Bean harvest sale', 12000.00, '2025-11-10', 'bank_transfer'),
(1, 'expense', 'Fertilizer', 'Organic fertilizer', 1800.00, '2025-11-20', 'card'),
(3, 'revenue', 'Berry Sales', 'Strawberry harvest sale', 4500.00, '2025-12-20', 'cash'),
(3, 'expense', 'Labour', 'Seasonal workers', 2800.00, '2025-12-15', 'cash'),
(2, 'revenue', 'Dairy Sales', 'Milk sales - January', 9200.00, '2026-01-31', 'bank_transfer'),
(2, 'expense', 'Veterinary', 'Vaccination program', 1500.00, '2026-01-18', 'cash'),
(1, 'revenue', 'Crop Sales', 'Coffee cherry sale', 22000.00, '2026-02-14', 'bank_transfer'),
(1, 'expense', 'Equipment', 'Sprayer and tools', 900.00, '2026-02-22', 'card'),
(3, 'revenue', 'Berry Sales', 'Strawberry sale - March', 5100.00, '2026-03-18', 'cash'),
(3, 'expense', 'Seeds', 'Cabbage seedlings', 1200.00, '2026-03-25', 'cash'),
(1, 'expense', 'Labour', 'Planting labour', 3400.00, '2026-04-05', 'cash'),
(2, 'revenue', 'Livestock Sales', 'Surplus heifer sale', 18000.00, '2026-04-28', 'bank_transfer'),
(2, 'expense', 'Feed', 'Concentrate purchase', 4100.00, '2026-05-08', 'check'),
(1, 'revenue', 'Crop Sales', 'Bean harvest sale', 13500.00, '2026-05-30', 'bank_transfer'),
(3, 'revenue', 'Vegetable Sales', 'Cabbage and greens', 6800.00, '2026-06-21', 'cash'),
(3, 'expense', 'Fertilizer', 'Foliar feed', 950.00, '2026-06-28', 'cash'),
(1, 'expense', 'Fuel', 'Diesel for tractor', 2200.00, '2026-07-06', 'card'),
(2, 'revenue', 'Dairy Sales', 'Milk sales - July', 10500.00, '2026-07-31', 'bank_transfer'),
(1, 'revenue', 'Crop Sales', 'Maize harvest sale', 24500.00, '2026-08-12', 'bank_transfer'),
(1, 'expense', 'Labour', 'Harvest labour', 5200.00, '2026-08-15', 'cash'),
(2, 'expense', 'Maintenance', 'Milking machine service', 800.00, '2026-08-20', 'cash'),
(3, 'revenue', 'Vegetable Sales', 'Tomato and cabbage sales', 7400.00, '2026-08-24', 'cash');

-- Inventory
INSERT INTO inventory (farm_id, item_name, category, quantity, unit, unit_price, supplier, purchase_date, expiry_date, location) VALUES
(1, 'Maize Seed (Longe 5)', 'Seeds', 100.0, 'kg', 25.00, 'Seed Co. Uganda', '2026-02-01', '2027-02-01', 'Storage Shed A'),
(1, 'Organic Fertilizer', 'Fertilizer', 8.0, 'bags', 36.00, 'Fertilizer Inc.', '2026-03-15', '2027-03-15', 'Storage Shed B'),
(2, 'Cattle Feed', 'Feed', 200.0, 'kg', 0.50, 'Feed Supply Ltd', '2026-06-01', '2027-01-01', 'Feed Store'),
(2, 'Vaccines', 'Medical', 10.0, 'vials', 15.00, 'Vet Supply Uganda', '2026-05-10', '2027-05-10', 'Refrigerator'),
(3, 'Strawberry Seedlings', 'Plants', 500.0, 'plants', 2.50, 'Nursery Co.', '2026-01-05', NULL, 'Greenhouse'),
(1, 'NPK Fertilizer', 'Fertilizer', 6.0, 'bags', 85.00, 'Agro Depot', '2026-04-12', '2027-04-12', 'Storage Shed A');

-- Labour (parents for tasks)
INSERT INTO labour (farm_id, first_name, last_name, phone, role, hired_date, notes) VALUES
(1, 'Paul', 'Okello', '+256700000011', 'worker', '2023-03-01', 'Seasonal worker'),
(2, 'Sarah', 'Namutebi', '+256700000012', 'supervisor', '2022-06-15', 'Head supervisor'),
(3, 'David', 'Mukisa', '+256700000013', 'worker', '2024-01-10', 'Full-time worker');

-- Tasks
INSERT INTO tasks (farm_id, title, description, assigned_to, status, priority, due_date, created_by) VALUES
(1, 'Weed maize field rows 2-4', 'Manual weeding. Bring hoe and gloves.', 1, 'todo', 'medium', '2026-09-05', 2),
(2, 'Inspect milking equipment', 'Check grease points and belts.', 2, 'in_progress', 'high', '2026-08-30', 1),
(3, 'Spray cabbage against aphids', 'Use recommended insecticide, morning application.', 3, 'todo', 'high', '2026-08-29', 1),
(1, 'Repair fence at north gate', 'Replace broken posts and wire.', NULL, 'blocked', 'low', '2026-09-20', 2);

-- Maintenance logs
INSERT INTO maintenance_logs (equipment_id, maintenance_date, maintenance_type, description, cost, performed_by, next_maintenance_date) VALUES
(1, '2026-05-10', 'routine', 'Oil change and filter replacement', 250.00, 'John Mechanic', '2026-09-15'),
(2, '2026-02-12', 'inspection', 'Annual safety inspection', 150.00, 'Farm Tech Services', '2026-09-02'),
(4, '2026-06-01', 'repair', 'Replaced damaged sprinkler heads', 90.00, 'Irrigation Pro', '2026-08-30');

-- Crop yield history
INSERT INTO crop_yield_history (crop_id, harvest_date, yield_amount, quality_rating, market_price, notes) VALUES
(1, '2026-08-10', 2450.0, 'good', 8.25, 'Good harvest despite dry spell'),
(2, '2026-07-25', 1420.0, 'excellent', 12.50, 'Premium quality beans'),
(5, '2026-05-30', 760.0, 'good', 5.00, 'Steady alfalfa yield'),
(7, '2026-06-15', 95.0, 'excellent', 14.00, 'Premium strawberries');

-- Weather data (recent observations)
INSERT INTO weather_data (farm_id, record_date, temperature, rainfall, humidity, notes) VALUES
(1, '2026-08-20', 24.5, 12.0, 78.0, 'Light afternoon showers'),
(1, '2026-08-21', 25.0, 0.0, 70.0, 'Sunny most of the day'),
(2, '2026-08-22', 23.0, 18.5, 85.0, 'Heavy morning rain'),
(3, '2026-08-23', 22.5, 8.0, 80.0, 'Overcast with drizzle'),
(1, '2026-08-24', 26.0, 0.0, 65.0, 'Clear and warm'),
(2, '2026-08-25', 24.0, 5.5, 75.0, 'Evening showers');