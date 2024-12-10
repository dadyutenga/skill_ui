-- Users Table: Stores user information
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    profile_picture TEXT,
    bio TEXT,
    goals TEXT,
    CONSTRAINT email_format CHECK (email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$')
);

-- Content Table: Stores details about each piece of content (videos, articles, documentaries, books)
CREATE TABLE content (
    content_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content_type VARCHAR(50) CHECK (content_type IN ('video', 'article', 'documentary', 'book')) NOT NULL,
    source_url TEXT,
    thumbnail_url TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    content_length INT CHECK (content_length > 0) -- Length in minutes
);

-- Skills Table: Stores different skills available on the platform
CREATE TABLE skills (
    skill_id SERIAL PRIMARY KEY,
    skill_name VARCHAR(100) UNIQUE NOT NULL,
    skill_category VARCHAR(50) NOT NULL,
    description TEXT
);

-- UserSkills Table: Tracks skills acquired by users
CREATE TABLE user_skills (
    user_skill_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    skill_id INT REFERENCES skills(skill_id) ON DELETE CASCADE,
    level VARCHAR(50) CHECK (level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    progress_percentage INT CHECK (progress_percentage BETWEEN 0 AND 100),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- ContentSkills Table: Links content to the skills it covers
CREATE TABLE content_skills (
    content_skill_id SERIAL PRIMARY KEY,
    content_id INT REFERENCES content(content_id) ON DELETE CASCADE,
    skill_id INT REFERENCES skills(skill_id) ON DELETE CASCADE
);

-- LearningPaths Table: Defines learning journeys or pathways for popular skills
CREATE TABLE learning_paths (
    path_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    skill_id INT REFERENCES skills(skill_id) ON DELETE SET NULL
);

-- PathContent Table: Links content to specific learning paths
CREATE TABLE path_content (
    path_content_id SERIAL PRIMARY KEY,
    path_id INT REFERENCES learning_paths(path_id) ON DELETE CASCADE,
    content_id INT REFERENCES content(content_id) ON DELETE CASCADE,
    sequence INT CHECK (sequence > 0) -- Order of content within the path
);

-- UserLearningPathProgress Table: Tracks user progress within a learning path
CREATE TABLE user_learning_path_progress (
    progress_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    path_id INT REFERENCES learning_paths(path_id) ON DELETE CASCADE,
    progress_percentage INT CHECK (progress_percentage BETWEEN 0 AND 100),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Quizzes Table: Stores quiz questions associated with content
CREATE TABLE quizzes (
    quiz_id SERIAL PRIMARY KEY,
    content_id INT REFERENCES content(content_id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    options TEXT[] -- Array of options for multiple-choice questions
);

-- UserQuizResponses Table: Tracks user responses to quizzes
CREATE TABLE user_quiz_responses (
    response_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    quiz_id INT REFERENCES quizzes(quiz_id) ON DELETE CASCADE,
    user_answer TEXT,
    is_correct BOOLEAN
);

-- Mentors Table: Stores details about role models and industry experts
CREATE TABLE mentors (
    mentor_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    bio TEXT,
    expertise TEXT,
    profile_picture TEXT
);

-- MentorContent Table: Links mentors to specific content they contributed to
CREATE TABLE mentor_content (
    mentor_content_id SERIAL PRIMARY KEY,
    mentor_id INT REFERENCES mentors(mentor_id) ON DELETE CASCADE,
    content_id INT REFERENCES content(content_id) ON DELETE CASCADE
);

-- Notifications Table: Stores notifications for users about new content, updates, etc.
CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Certificates Table: Stores certifications earned by users
CREATE TABLE certificates (
    certificate_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    skill_id INT REFERENCES skills(skill_id) ON DELETE SET NULL,
    certificate_title VARCHAR(255) NOT NULL,
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Constraints and Foreign Key Relationships
ALTER TABLE user_skills
ADD CONSTRAINT fk_user_skill_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
ADD CONSTRAINT fk_user_skill_skill FOREIGN KEY (skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE;

ALTER TABLE content_skills
ADD CONSTRAINT fk_content_skill_content FOREIGN KEY (content_id) REFERENCES content(content_id) ON DELETE CASCADE,
ADD CONSTRAINT fk_content_skill_skill FOREIGN KEY (skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE;

ALTER TABLE path_content
ADD CONSTRAINT fk_path_content_path FOREIGN KEY (path_id) REFERENCES learning_paths(path_id) ON DELETE CASCADE,
ADD CONSTRAINT fk_path_content_content FOREIGN KEY (content_id) REFERENCES content(content_id) ON DELETE CASCADE;

ALTER TABLE user_learning_path_progress
ADD CONSTRAINT fk_progress_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
ADD CONSTRAINT fk_progress_path FOREIGN KEY (path_id) REFERENCES learning_paths(path_id) ON DELETE CASCADE;

ALTER TABLE user_quiz_responses
ADD CONSTRAINT fk_response_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
ADD CONSTRAINT fk_response_quiz FOREIGN KEY (quiz_id) REFERENCES quizzes(quiz_id) ON DELETE CASCADE;

