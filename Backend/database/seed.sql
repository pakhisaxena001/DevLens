-- Seed sample data for PostgreSQL
INSERT INTO users (id, name, email, password, github_username, verified) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Admin User', 'admin@devlens.com', '$2b$10$JJvL8X2m8g8s8g8s8g8s8g8s8g8s8g8s8g8s8g8s8g8s8g8s8g8s8', 'adminuser', TRUE),
('550e8400-e29b-41d4-a716-446655440002', 'Test User', 'user@devlens.com', '$2b$10$JJvL8X2m8g8s8g8s8g8s8g8s8g8s8g8s8g8s8g8s8g8s8g8s8g8s8', 'testuser', TRUE)
ON CONFLICT DO NOTHING;

INSERT INTO repositories (id, user_id, owner, name, url, description, language, stars) VALUES
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'devlens', 'DevLens', 'https://github.com/devlens/devlens', 'GitHub Repository Analysis Platform', 'JavaScript', 150),
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'testuser', 'sample-repo', 'https://github.com/testuser/sample-repo', 'A sample repository for testing', 'TypeScript', 50)
ON CONFLICT DO NOTHING;

INSERT INTO repository_metrics (id, repository_id, contributors, commits, issues, pull_requests) VALUES
('700e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 25, 500, 15, 45),
('700e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440002', 8, 150, 5, 12)
ON CONFLICT DO NOTHING;

INSERT INTO analyses (id, repository_id, user_id, health_score, code_quality_score, documentation_score, test_coverage, performance_score, security_score) VALUES
('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 85, 85, 90, 78, 82, 88),
('750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 70, 72, 68, 65, 70, 75)
ON CONFLICT DO NOTHING;
