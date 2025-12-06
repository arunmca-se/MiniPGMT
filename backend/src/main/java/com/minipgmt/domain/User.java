package com.minipgmt.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

/**
 * User Entity
 * Represents a user in the system with authentication and authorization
 */
@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_users_email", columnList = "email")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity {

    @NotBlank(message = "Name is required")
    @Size(max = 255, message = "Name must not exceed 255 characters")
    @Column(name = "name", nullable = false)
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @NotBlank(message = "Password is required")
    @Size(max = 255)
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Size(max = 500)
    @Column(name = "avatar_url")
    private String avatarUrl;

    @NotNull(message = "Role is required")
    @Column(name = "role", nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private UserRole role;

    @Column(name = "is_active")
    private Boolean isActive = true;

    /**
     * User roles in the system
     */
    public enum UserRole {
        ADMIN,      // Full system access
        MEMBER,     // Standard project member
        VIEWER      // Read-only access
    }
}
