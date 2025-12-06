package com.minipgmt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Main Application Class for MiniPGMT (Mini Project Management Tool)
 *
 * A Jira-like project management application with:
 * - Project and Issue management
 * - Sprint planning
 * - Kanban boards with drag-and-drop
 * - Team collaboration
 * - Time tracking
 * - Reports and analytics
 */
@SpringBootApplication
@EnableJpaAuditing
public class MiniPgmtApplication {

    public static void main(String[] args) {
        SpringApplication.run(MiniPgmtApplication.class, args);
    }
}
