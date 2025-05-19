-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('jailer', 'family')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Prisoners table
CREATE TABLE prisoners (
    id SERIAL PRIMARY KEY,
    prisoner_id VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    age INTEGER NOT NULL,
    gender VARCHAR(10) NOT NULL,
    cell_number VARCHAR(20) NOT NULL,
    admission_date DATE NOT NULL,
    expected_release_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL,
    category VARCHAR(20) NOT NULL,
    crime_type VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Health records table
CREATE TABLE health_records (
    id SERIAL PRIMARY KEY,
    prisoner_id INTEGER REFERENCES prisoners(id),
    status VARCHAR(20) NOT NULL,
    last_checkup DATE NOT NULL,
    conditions TEXT[],
    medications TEXT[],
    dietary_restrictions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Work assignments table
CREATE TABLE work_assignments (
    id SERIAL PRIMARY KEY,
    prisoner_id INTEGER REFERENCES prisoners(id),
    assignment VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    hours_per_week INTEGER NOT NULL,
    wage_rate DECIMAL(10,2) NOT NULL,
    performance VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Legal information table
CREATE TABLE legal_info (
    id SERIAL PRIMARY KEY,
    prisoner_id INTEGER REFERENCES prisoners(id),
    case_number VARCHAR(50) NOT NULL,
    sentence VARCHAR(100) NOT NULL,
    next_court_date DATE,
    parole_eligibility_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Behavior records table
CREATE TABLE behavior_records (
    id SERIAL PRIMARY KEY,
    prisoner_id INTEGER REFERENCES prisoners(id),
    conduct VARCHAR(20) NOT NULL,
    last_incident TEXT,
    privileges TEXT[],
    restrictions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Visit requests table
CREATE TABLE visit_requests (
    id SERIAL PRIMARY KEY,
    prisoner_id INTEGER REFERENCES prisoners(id),
    visitor_id INTEGER REFERENCES users(id),
    visit_date DATE NOT NULL,
    visit_time TIME NOT NULL,
    duration INTEGER NOT NULL,
    type VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Wages table
CREATE TABLE wages (
    id SERIAL PRIMARY KEY,
    prisoner_id INTEGER REFERENCES prisoners(id),
    amount DECIMAL(10,2) NOT NULL,
    payment_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Family connections table
CREATE TABLE family_connections (
    id SERIAL PRIMARY KEY,
    prisoner_id INTEGER REFERENCES prisoners(id),
    family_member_id INTEGER REFERENCES users(id),
    relationship VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 