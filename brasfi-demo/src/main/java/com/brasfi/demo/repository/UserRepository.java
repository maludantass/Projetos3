package com.brasfi.demo.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.brasfi.demo.model.User; // Sua entidade User
import org.springframework.stereotype.Repository; // Boa prática adicionar @Repository

@Repository // Adicionar a anotação @Repository é uma boa prática
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Verifica se um usuário existe com o email fornecido.
     * @param email O email a ser verificado.
     * @return true se o usuário existir, false caso contrário.
     */
    boolean existsByEmail(String email);

    /**
     * Encontra um usuário pelo seu endereço de email.
     * @param email O email do usuário.
     * @return Um Optional contendo o User se encontrado, ou vazio caso contrário.
     */
    Optional<User> findByEmail(String email);

    /**
     * Encontra um usuário pelo seu nome de usuário (username).
     * Este método será útil se 'username' for usado como identificador de login
     * ou para buscar usuários por esse campo.
     *
     * @param username O nome de usuário a ser buscado.
     * @return Um Optional contendo o User se encontrado, ou vazio caso contrário.
     */
    Optional<User> findByUsername(String username); // Novo método adicionado

    Optional<User> findByUsernameContainingIgnoreCase(String username); //Para busca no feed com barra de pesquisa

}