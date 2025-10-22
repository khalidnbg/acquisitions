-- Database initialization for development environment
-- This script runs when the PostgreSQL container starts for the first time

-- Create the users table (matching your Drizzle schema)
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"email" varchar(256) NOT NULL,
	"password" varchar(256) NOT NULL,
	"role" varchar(50) DEFAULT 'user',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Create unique index on email
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_unique" ON "users" ("email");

-- Insert a test user for development (password is "password123" hashed with bcrypt)
INSERT INTO "users" ("name", "email", "password", "role") 
VALUES ('Test User', 'test@example.com', '$2b$10$K7L/gE8N7fRKB.32xKScNuu7AhM.VF3mNzJ6QwF7Qv.u/QJ.KuGgi', 'admin')
ON CONFLICT ("email") DO NOTHING;

-- Additional development data can be added here
INSERT INTO "users" ("name", "email", "password", "role") 
VALUES ('John Doe', 'john@example.com', '$2b$10$K7L/gE8N7fRKB.32xKScNuu7AhM.VF3mNzJ6QwF7Qv.u/QJ.KuGgi', 'user')
ON CONFLICT ("email") DO NOTHING;