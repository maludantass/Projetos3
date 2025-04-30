package com.brasfi.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.brasfi.demo.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByUsername(String username);
}
