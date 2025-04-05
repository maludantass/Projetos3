package com.brasfi.demo.controller;

import com.brasfi.demo.dto.UsuarioDto;
import com.brasfi.demo.model.Usuario;
import com.brasfi.demo.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    //Cadastro de usuario
    @PostMapping("/registrar")
    public ResponseEntity<?> registrarUsuario(@RequestBody UsuarioDto dto) {

        if (usuarioRepository.findByEmail(dto.getEmail()).isPresent()){
            return ResponseEntity.badRequest().body("Email já em uso.");
        }

        Usuario novoUsuario = new Usuario(dto.getNome(), dto.getEmail(), dto.getSenha());
        usuarioRepository.save(novoUsuario);

        return ResponseEntity.ok("Usuário registrado com sucesso.");
    }

}
