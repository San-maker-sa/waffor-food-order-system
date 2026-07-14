package com.foodsystem.orderservice.controller;

import com.foodsystem.orderservice.entity.UserEntity;
import com.foodsystem.orderservice.repository.UserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        log.info("[UserService] Registering user with email: {}", request.getEmail());

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("Email already in use."));
        }

        UserEntity user = new UserEntity();
        user.setId(UUID.randomUUID().toString());
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword()); // Plain text for simplicity in this project
        user.setRole(request.getRole().toUpperCase());

        userRepository.save(user);
        log.info("[UserService] User registered successfully: {}", user.getId());

        return ResponseEntity.status(HttpStatus.CREATED).body(new AuthResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        log.info("[UserService] User login attempt: {}", request.getEmail());

        return userRepository.findByEmail(request.getEmail())
                .map(user -> {
                    if (user.getPassword().equals(request.getPassword())) {
                        log.info("[UserService] User login successful: {}", user.getId());
                        return ResponseEntity.ok(new AuthResponse(
                                user.getId(),
                                user.getName(),
                                user.getEmail(),
                                user.getRole()
                        ));
                    } else {
                        log.warn("[UserService] Invalid password for email: {}", request.getEmail());
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body(new ErrorResponse("Invalid email or password."));
                    }
                })
                .orElseGet(() -> {
                    log.warn("[UserService] User not found for email: {}", request.getEmail());
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body(new ErrorResponse("Invalid email or password."));
                });
    }

    @Data
    public static class RegisterRequest {
        private String name;
        private String email;
        private String password;
        private String role; // CUSTOMER, SHOPKEEPER, DELIVERY
    }

    @Data
    public static class LoginRequest {
        private String email;
        private String password;
    }

    @Data
    @RequiredArgsConstructor
    public static class AuthResponse {
        private final String id;
        private final String name;
        private final String email;
        private final String role;
    }

    @Data
    @RequiredArgsConstructor
    public static class ErrorResponse {
        private final String message;
    }
}
