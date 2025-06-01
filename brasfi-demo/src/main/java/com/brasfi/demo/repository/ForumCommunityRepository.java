package com.brasfi.demo.repository;

import com.brasfi.demo.model.ForumCommunity;
import com.brasfi.demo.model.User; // Necessário para o método findByAuthor
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ForumCommunityRepository extends JpaRepository<ForumCommunity, Long> {

    /**
     * Encontra uma ForumCommunity (Tópico) pelo seu título.
     * (Anteriormente findByName, atualizado para refletir a mudança no nome do campo na entidade).
     *
     * @param title O título do tópico a ser buscado.
     * @return Um Optional contendo a ForumCommunity se encontrada, ou vazio caso contrário.
     */
    Optional<ForumCommunity> findByTitle(String title);

    /**
     * Encontra todas as ForumCommunities (Tópicos) cujo título contém a string fornecida,
     * ignorando a capitalização (maiúsculas/minúsculas).
     * Retorna resultados paginados.
     *
     * @param titleQuery String a ser pesquisada no título dos tópicos.
     * @param pageable Informações de paginação e ordenação.
     * @return Uma página (Page) de ForumCommunities que correspondem ao critério.
     */
    Page<ForumCommunity> findByTitleContainingIgnoreCase(String titleQuery, Pageable pageable);

    /**
     * Encontra todas as ForumCommunities (Tópicos) criadas por um autor (User) específico.
     * Retorna resultados paginados.
     *
     * @param author O usuário (autor) dos tópicos.
     * @param pageable Informações de paginação e ordenação.
     * @return Uma página (Page) de ForumCommunities criadas pelo autor especificado.
     */
    Page<ForumCommunity> findByAuthor(User author, Pageable pageable);

    /**
     * Encontra todas as ForumCommunities (Tópicos) e as ordena pela data de criação
     * de forma descendente (mais recentes primeiro).
     * Este é um exemplo de método explícito para essa finalidade.
     *
     * @param pageable Informações de paginação (a ordenação por createdAt DESC é definida no nome do método).
     * @return Uma página (Page) de ForumCommunities ordenadas.
     */
    Page<ForumCommunity> findAllByOrderByCreatedAtDesc(Pageable pageable);

    /**
     * Encontra todas as ForumCommunities (Tópicos) criadas por um autor específico,
     * ordenadas pela data de criação de forma descendente.
     *
     * @param author O usuário (autor) dos tópicos.
     * @param pageable Informações de paginação.
     * @return Uma página (Page) de ForumCommunities criadas pelo autor especificado, ordenadas.
     */
    Page<ForumCommunity> findByAuthorOrderByCreatedAtDesc(User author, Pageable pageable);

}