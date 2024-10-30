-- Users Table: Stores user information.
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) CHECK (role IN ('student', 'instructor', 'admin')), -- Limit roles
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- OAuth Table: Manages OAuth authentication for users.
CREATE TABLE oauth (
    oauth_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL CHECK (provider IN ('google', 'linkedin')), -- Limit providers
    provider_user_id VARCHAR(255) UNIQUE NOT NULL,
    access_token VARCHAR(255),
    refresh_token VARCHAR(255),
    expires_at TIMESTAMP
);

-- Skills Table: Defines various skills users can have or learn.
CREATE TABLE skills (
    skill_id SERIAL PRIMARY KEY,
    skill_name VARCHAR(100) NOT NULL,
    skill_category VARCHAR(100) CHECK (skill_category IN ('technical', 'leadership', 'communication')) -- Categories constraint
);

-- UserSkills Table: Connects users to skills they have acquired, with proficiency level.
CREATE TABLE user_skills (
    user_skill_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    skill_id INT REFERENCES skills(skill_id) ON DELETE CASCADE,
    proficiency_level VARCHAR(50) CHECK (proficiency_level IN ('beginner', 'intermediate', 'expert')), -- Limit proficiency levels
    acquired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, skill_id) -- Ensures a user has only one entry per skill
);

-- Content Table: Stores content information on the platform.
CREATE TABLE content (
    content_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content_type VARCHAR(50) CHECK (content_type IN ('video', 'article', 'quiz')), -- Content type constraint
    skill_id INT REFERENCES skills(skill_id) ON DELETE SET NULL, -- Skill linkage (optional)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ContentAccess Table: Tracks user access and progress in content.
CREATE TABLE content_access (
    access_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    content_id INT REFERENCES content(content_id) ON DELETE CASCADE,
    progress DECIMAL(5, 2) DEFAULT 0.0 CHECK (progress >= 0 AND progress <= 100), -- 0-100 percentage
    completed BOOLEAN DEFAULT FALSE,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, content_id) -- Ensure only one access record per user-content pair
);

-- Evaluations Table: Defines evaluations like quizzes or assignments tied to content.
CREATE TABLE evaluations (
    evaluation_id SERIAL PRIMARY KEY,
    content_id INT REFERENCES content(content_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    evaluation_type VARCHAR(50) CHECK (evaluation_type IN ('quiz', 'assignment')), -- Limit evaluation types
    passing_score DECIMAL(5, 2) CHECK (passing_score >= 0 AND passing_score <= 100) -- 0-100 range
);

-- UserEvaluations Table: Tracks user performance in evaluations.
CREATE TABLE user_evaluations (
    user_evaluation_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    evaluation_id INT REFERENCES evaluations(evaluation_id) ON DELETE CASCADE,
    score DECIMAL(5, 2) CHECK (score >= 0 AND score <= 100), -- 0-100 score range
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    passed BOOLEAN NOT NULL,
    UNIQUE (user_id, evaluation_id) -- One entry per user-evaluation pair
);

-- Schedule Table: Manages scheduling of events, classes, and content releases.
CREATE TABLE schedule (
    schedule_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    created_by INT REFERENCES users(user_id) ON DELETE SET NULL, -- Creator linkage
    CHECK (end_time > start_time) -- End time must be after start time
);

-- UserSchedule Table: Links users to scheduled events for attendance tracking.
CREATE TABLE user_schedule (
    user_schedule_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    schedule_id INT REFERENCES schedule(schedule_id) ON DELETE CASCADE,
    attended BOOLEAN DEFAULT FALSE,
    attendance_timestamp TIMESTAMP,
    UNIQUE (user_id, schedule_id) -- One entry per user-schedule pair
);

-- Platform Table: Defines platforms where content can be shared (e.g., LinkedIn).
CREATE TABLE platform (
    platform_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    url VARCHAR(255)
);

-- ContentPlatform Table: Links content to platforms where it is published.
CREATE TABLE content_platform (
    content_platform_id SERIAL PRIMARY KEY,
    content_id INT REFERENCES content(content_id) ON DELETE CASCADE,
    platform_id INT REFERENCES platform(platform_id) ON DELETE CASCADE,
    publish_date TIMESTAMP,
    UNIQUE (content_id, platform_id) -- One entry per content-platform pair
);

-- Feedback Table: Allows users to provide feedback on content.
CREATE TABLE feedback (
    feedback_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    content_id INT REFERENCES content(content_id) ON DELETE CASCADE,
    rating INT CHECK (rating BETWEEN 1 AND 5), -- Rating from 1 to 5
    comment TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes to improve performance on frequently queried fields.
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_content_title ON content(title);
CREATE INDEX idx_schedule_time ON schedule(start_time, end_time);
CREATE INDEX idx_user_skill ON user_skills(user_id, skill_id);
CREATE INDEX idx_content_platform ON content_platform(content_id, platform_id);

