package com.brasfi.demo.model;

import jakarta.persistence.*;

@Entity
public class Usuario {

    //Atributos da classe Usuário:

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome_de_usuario;
    private String email;
    private String senha;

    private boolean ismembro;

    //Métodos especiais:

    //Construtor para classe usuário, inicializando qualquer pssoa sem ser membro
    public Usuario(String nome, String email, String senha){

        this.nome_de_usuario = nome;
        this.email = email;
        this.senha = senha;

        this.ismembro = true;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome_de_usuario() {
        return nome_de_usuario;
    }

    public void setNome_de_usuario(String nome_de_usuario) {
        this.nome_de_usuario = nome_de_usuario;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isIsmembro() {
        return ismembro;
    }

    public void setIsmembro(boolean ismembro) {
        this.ismembro = ismembro;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }


}
