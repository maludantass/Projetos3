package com.brasfi.demo.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime; 

@Entity
public class Evento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;
    private LocalDateTime dataInicio; 
    private LocalDateTime dataFim;    
    private String detalhe;

    @Column(length = 1000)
    private String topicos;

    private String link;

    private boolean gravado;
    private String emailUsuario;

    public Evento() {
    }

//get e set
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public LocalDateTime getDataInicio() { return dataInicio; }
    public void setDataInicio(LocalDateTime dataInicio) { this.dataInicio = dataInicio; }

    public LocalDateTime getDataFim() { return dataFim; }
    public void setDataFim(LocalDateTime dataFim) { this.dataFim = dataFim; }

    public String getDetalhe() { return detalhe; }
    public void setDetalhe(String detalhe) { this.detalhe = detalhe; }

    public String getLink() { return link; }
    public void setLink(String link) { this.link = link; }

    public boolean isGravado() { return gravado; }
    public void setGravado(boolean gravado) { this.gravado = gravado; }

    public String getEmailUsuario() {
        return emailUsuario;
    }

    public void setEmailUsuario(String emailUsuario) {
        this.emailUsuario = emailUsuario;
    }

    public String getTopicos() {
        return topicos;
    }

    public void setTopicos(String topicos) {
        this.topicos = topicos;
    }
}