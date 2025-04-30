package com.brasfi.demo.controller;

import org.springframework.web.bind.annotation.*;

import com.brasfi.demo.model.User;
import com.brasfi.demo.services.UserService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Permitir chamadas do React (ou configure direito depois)
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userService.registerUser(user);
    }
}
