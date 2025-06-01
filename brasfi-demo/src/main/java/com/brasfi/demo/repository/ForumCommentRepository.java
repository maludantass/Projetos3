package com.brasfi.demo.repository;

import com.brasfi.demo.model.ForumComment;
import com.brasfi.demo.model.ForumPost;
import com.brasfi.demo.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.data.jpa.repository.Query;
// import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List; // Pode ser mantido para casos específicos sem paginação

@Repository
public interface ForumCommentRepository extends JpaRepository<ForumComment, Long> {

    /**
     * Encontra todos os comentários de nível superior (parentComment é nulo) para um ForumPost específico,
     * ordenados pela data de criação ascendente (mais antigos primeiro, para ordem cronológica).
     * Retorna resultados paginados.
     *
     * @param forumPost O post para o qual buscar os comentários de nível superior.
     * @param pageable Informações de paginação e ordenação.
     * @return Uma página (Page) de ForumComments de nível superior.
     */
    Page<ForumComment> findByForumPostAndParentCommentIsNullOrderByCreatedAtAsc(ForumPost forumPost, Pageable pageable);

    /**
     * Encontra todas as respostas diretas (replies) para um ForumComment pai específico,
     * ordenadas pela data de criação ascendente.
     * Retorna resultados paginados.
     *
     * @param parentComment O comentário pai para o qual buscar as respostas.
     * @param pageable Informações de paginação e ordenação.
     * @return Uma página (Page) de ForumComments que são respostas ao comentário pai.
     */
    Page<ForumComment> findByParentCommentOrderByCreatedAtAsc(ForumComment parentComment, Pageable pageable);

    /**
     * Encontra todos os comentários feitos por um autor (User) específico,
     * ordenados pela data de criação descendente (mais recentes primeiro).
     * Retorna resultados paginados.
     * (Considerando que o campo na entidade ForumComment é 'author').
     *
     * @param author O usuário autor dos comentários.
     * @param pageable Informações de paginação e ordenação.
     * @return Uma página (Page) de ForumComments.
     */
    Page<ForumComment> findByAuthorOrderByCreatedAtDesc(User author, Pageable pageable);

    /**
     * Retorna uma lista de todos os comentários para um post específico.
     * Este método pode ser útil para carregar todos os comentários de uma vez,
     * mas para performance, prefira as versões paginadas, especialmente para posts com muitos comentários.
     *
     * @param forumPost O post para o qual buscar os comentários.
     * @return Uma lista de ForumComments.
     */
    List<ForumComment> findByForumPostOrderByCreatedAtAsc(ForumPost forumPost); // Mantendo o seu, mas adicionando ordenação

    /**
     * Conta o número total de comentários (todos os níveis) para um ForumPost específico.
     * @param forumPost O post para o qual contar os comentários.
     * @return A contagem de comentários.
     */
    long countByForumPost(ForumPost forumPost);

    /**
     * Conta o número de respostas diretas (filhos) para um comentário pai específico.
     * @param parentComment O comentário pai.
     * @return A contagem de respostas diretas.
     */
    long countByParentComment(ForumComment parentComment);

    // Se o campo na sua entidade ForumComment para o usuário for 'user' e não 'author':
    // List<ForumComment> findByUser(User user); // Você pode manter este se o campo for 'user'.
    // Page<ForumComment> findByUserOrderByCreatedAtDesc(User user, Pageable pageable); // Versão paginada
}