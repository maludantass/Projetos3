package com.brasfi.demo.controller;

import com.brasfi.demo.model.Evento;
import com.brasfi.demo.repository.EventoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/eventos")
public class EventoController {

    @Autowired
    private EventoRepository eventoRepository;

    @PostMapping
    public ResponseEntity<Evento> criarEvento(@RequestBody Evento evento) {
        System.out.println(">>> ENTROU no método criarEvento()");
        try {
            Evento novoEvento = eventoRepository.save(evento);
            return new ResponseEntity<>(novoEvento, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
       }
    }
}