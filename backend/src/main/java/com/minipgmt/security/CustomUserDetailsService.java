package com.minipgmt.security;

import com.minipgmt.domain.User;
import com.minipgmt.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * Custom UserDetailsService implementation
 * Loads user by email or ID for Spring Security
 */
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Try to parse as UUID first (for token-based auth)
        try {
            UUID userId = UUID.fromString(username);
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userId));
            return UserPrincipal.create(user);
        } catch (IllegalArgumentException e) {
            // If not UUID, treat as email
            User user = userRepository.findByEmailAndIsActiveTrue(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));
            return UserPrincipal.create(user);
        }
    }

    @Transactional(readOnly = true)
    public UserDetails loadUserById(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userId));
        return UserPrincipal.create(user);
    }
}
