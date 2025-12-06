-- Seed Data for MiniPGMT
-- Insert demo users, projects, and issues for testing

-- Insert demo users (passwords are all 'password123')
-- BCrypt hash for 'password123': $2a$10$La4YC/5T/VfKWQQpdg.oau3jnUp0DbaKuVSm2LEZaQz7.jocE2tWu
INSERT INTO users (id, name, email, password_hash, avatar_url, role, is_active, created_at, updated_at) VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'John Doe', 'john.doe@example.com', '$2a$10$La4YC/5T/VfKWQQpdg.oau3jnUp0DbaKuVSm2LEZaQz7.jocE2tWu', 'https://api.dicebear.com/7.x/avataaars/svg?seed=John', 'ADMIN', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Jane Smith', 'jane.smith@example.com', '$2a$10$La4YC/5T/VfKWQQpdg.oau3jnUp0DbaKuVSm2LEZaQz7.jocE2tWu', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane', 'MEMBER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Mike Johnson', 'mike.johnson@example.com', '$2a$10$La4YC/5T/VfKWQQpdg.oau3jnUp0DbaKuVSm2LEZaQz7.jocE2tWu', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike', 'MEMBER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Sarah Williams', 'sarah.williams@example.com', '$2a$10$La4YC/5T/VfKWQQpdg.oau3jnUp0DbaKuVSm2LEZaQz7.jocE2tWu', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', 'MEMBER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'Tom Brown', 'tom.brown@example.com', '$2a$10$La4YC/5T/VfKWQQpdg.oau3jnUp0DbaKuVSm2LEZaQz7.jocE2tWu', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tom', 'VIEWER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert demo projects
INSERT INTO projects (id, key, name, description, health, progress, due_date, created_by, created_at, updated_at) VALUES
    ('f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'ECOM', 'E-Commerce Platform', 'Building a modern e-commerce platform with microservices architecture', 'ON_TRACK', 75, '2025-12-15', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('f6eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', 'MOBILE', 'Mobile App Redesign', 'Complete redesign of mobile application with new UI/UX', 'AT_RISK', 45, '2026-01-30', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('f7eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', 'API', 'API Gateway Service', 'Implementing centralized API gateway with authentication and rate limiting', 'BEHIND', 30, '2025-12-31', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('f8eebc99-9c0b-4ef8-bb6d-6bb9bd380a19', 'DATA', 'Data Analytics Dashboard', 'Real-time analytics dashboard with interactive visualizations', 'ON_TRACK', 85, '2025-12-10', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert project members
INSERT INTO project_members (project_id, user_id, role, joined_at) VALUES
    ('f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'admin', CURRENT_TIMESTAMP),
    ('f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'member', CURRENT_TIMESTAMP),
    ('f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'member', CURRENT_TIMESTAMP),
    ('f6eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'admin', CURRENT_TIMESTAMP),
    ('f6eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'member', CURRENT_TIMESTAMP),
    ('f6eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'viewer', CURRENT_TIMESTAMP),
    ('f7eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'admin', CURRENT_TIMESTAMP),
    ('f7eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'member', CURRENT_TIMESTAMP),
    ('f8eebc99-9c0b-4ef8-bb6d-6bb9bd380a19', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'admin', CURRENT_TIMESTAMP),
    ('f8eebc99-9c0b-4ef8-bb6d-6bb9bd380a19', 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'member', CURRENT_TIMESTAMP);

-- Insert demo sprints
INSERT INTO sprints (id, project_id, name, goal, start_date, end_date, status, created_by, created_at, updated_at) VALUES
    ('11eebc99-9c0b-4ef8-bb6d-6bb9bd380a20', 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'Sprint 1', 'Complete core shopping cart functionality', '2025-11-25', '2025-12-08', 'ACTIVE', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('12eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'Sprint 2', 'Payment integration and checkout', '2025-12-09', '2025-12-22', 'PLANNED', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert demo issues
INSERT INTO issues (id, key, title, description, type, priority, status, project_id, sprint_id, assignee_id, reporter_id, story_points, due_date, created_at, updated_at) VALUES
    ('21eebc99-9c0b-4ef8-bb6d-6bb9bd380a30', 'ECOM-101', 'Implement shopping cart functionality', '<p>Add shopping cart with quantity management and price calculation.</p><h2>Requirements</h2><ul><li>Add/remove items from cart</li><li>Update quantities</li><li>Calculate total price with taxes</li><li>Persist cart across sessions</li></ul>', 'STORY', 'HIGH', 'IN_PROGRESS', 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', '11eebc99-9c0b-4ef8-bb6d-6bb9bd380a20', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 5, '2025-12-08', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('22eebc99-9c0b-4ef8-bb6d-6bb9bd380a31', 'ECOM-102', 'Payment gateway integration', '<p>Integrate <strong>Stripe</strong> payment gateway for checkout process.</p><h2>Tasks</h2><ol><li>Set up Stripe account and API keys</li><li>Implement payment form with card validation</li><li>Handle payment processing and webhooks</li><li>Add error handling for failed transactions</li></ol><p>Documentation: <a href="https://stripe.com/docs">https://stripe.com/docs</a></p>', 'TASK', 'HIGHEST', 'TODO', 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', '11eebc99-9c0b-4ef8-bb6d-6bb9bd380a20', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 8, '2025-12-05', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('23eebc99-9c0b-4ef8-bb6d-6bb9bd380a32', 'MOBILE-45', 'Fix crash on login screen', '<p>App crashes when user enters invalid credentials.</p><h2>Steps to Reproduce</h2><ol><li>Open the app</li><li>Navigate to login screen</li><li>Enter invalid email/password</li><li>Click "Login" button</li><li>App crashes</li></ol><h2>Expected Behavior</h2><p>Show error message: <em>"Invalid credentials. Please try again."</em></p><blockquote><p>Priority: HIGH - Affects user authentication flow</p></blockquote>', 'BUG', 'HIGHEST', 'IN_PROGRESS', 'f6eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', NULL, 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 3, '2025-12-04', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('24eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'API-23', 'Implement rate limiting', '<p>Add rate limiting to prevent API abuse and ensure fair usage.</p><h2>Implementation</h2><ul><li>Use Redis for distributed rate limiting</li><li>Configure limits: 100 req/min per user, 1000 req/min per IP</li><li>Return <code>429 Too Many Requests</code> with retry-after header</li></ul><p>Reference library: <code>express-rate-limit</code></p>', 'TASK', 'HIGH', 'IN_REVIEW', 'f7eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', NULL, 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 5, '2025-12-10', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('25eebc99-9c0b-4ef8-bb6d-6bb9bd380a34', 'DATA-15', 'Create revenue charts', '<p>Design and implement interactive revenue visualization charts.</p><h2>Chart Types</h2><ul><li>Line chart for monthly revenue trends</li><li>Bar chart for revenue by product category</li><li>Pie chart for revenue distribution</li></ul><p>Use <strong>Recharts</strong> library for implementation.</p>', 'STORY', 'MEDIUM', 'DONE', 'f8eebc99-9c0b-4ef8-bb6d-6bb9bd380a19', NULL, 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 5, '2025-12-01', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert default workflow statuses for each project
INSERT INTO workflow_statuses (id, project_id, name, category, position, color, created_at) VALUES
    ('31eebc99-9c0b-4ef8-bb6d-6bb9bd380a40', 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'To Do', 'TODO', 1, '#9E9E9E', CURRENT_TIMESTAMP),
    ('32eebc99-9c0b-4ef8-bb6d-6bb9bd380a41', 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'In Progress', 'IN_PROGRESS', 2, '#2196F3', CURRENT_TIMESTAMP),
    ('33eebc99-9c0b-4ef8-bb6d-6bb9bd380a42', 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'In Review', 'IN_REVIEW', 3, '#9C27B0', CURRENT_TIMESTAMP),
    ('34eebc99-9c0b-4ef8-bb6d-6bb9bd380a43', 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'Done', 'DONE', 4, '#4CAF50', CURRENT_TIMESTAMP);
