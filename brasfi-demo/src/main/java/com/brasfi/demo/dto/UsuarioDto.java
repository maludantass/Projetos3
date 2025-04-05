package com.brasfi.demo.dto;

public class UsuarioDto {

    //DTO usado para cadastro de novos usuários

    //Atributos DTO

    private String nome;
    private String email;
    private String senha;

    //Métodos especiais:

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }
}
