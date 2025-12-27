create table IF NOT EXISTS `topics`
(
    id  bigint auto_increment primary key,
    name        varchar(255)  not null,
    created_at  datetime(6)   not null,
    description varchar(1000) null,
    updated_at  datetime(6)   null
);

INSERT INTO topics (name, created_at, description, updated_at) VALUES ('Angular', '2025-12-26 19:59:20.603957', 'Frontend framework by Google for building scalable, enterprise-grade web applications.', '2025-12-26 19:59:20.611682');
INSERT INTO topics (name, created_at, description, updated_at) VALUES ('DevOps', '2025-12-26 19:59:32.124890', 'Practices and tools for automating software delivery, CI/CD, infrastructure, and operations.', '2025-12-26 19:59:32.125486');
INSERT INTO topics (name, created_at, description, updated_at) VALUES ('Spring Boot', '2025-12-26 19:59:38.346044', 'Java framework for building production-ready backend services and REST APIs.', '2025-12-26 19:59:38.346294');
INSERT INTO topics (name, created_at, description, updated_at) VALUES ('Docker', '2025-12-26 19:59:46.161932', 'Containerization platform for packaging, shipping, and running applications consistently.', '2025-12-26 19:59:46.162229');
INSERT INTO topics (name, created_at, description, updated_at) VALUES ('Kubernetes', '2025-12-26 19:59:51.678607', 'Container orchestration system for deploying, scaling, and managing containerized applications.', '2025-12-26 19:59:51.679092');
INSERT INTO topics (name, created_at, description, updated_at) VALUES ('Python', '2025-12-26 19:59:55.937390', 'High-level programming language used for backend development, data science, and automation.', '2025-12-26 19:59:55.937839');
INSERT INTO topics (name, created_at, description, updated_at) VALUES ('JavaScript', '2025-12-26 20:00:00.287173', 'Core language of the web, used for frontend, backend, and full-stack development.', '2025-12-26 20:00:00.287501');
INSERT INTO topics (name, created_at, description, updated_at) VALUES ('Cloud Computing', '2025-12-26 20:00:04.712643', 'Building and running applications using cloud platforms like AWS, Azure, and GCP.', '2025-12-26 20:00:04.713124');
