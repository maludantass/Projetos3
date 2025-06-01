package com.brasfi.demo.repository;

import com.brasfi.demo.model.ForumComment;
import com.brasfi.demo.model.ForumPost;
import com.brasfi.demo.model.ForumVote;
import com.brasfi.demo.model.User;
import com.brasfi.demo.model.VoteType; // Importar VoteType
import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.data.jpa.repository.Query;
// import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ForumVoteRepository extends JpaRepository<ForumVote, Long> { // Alterado para Long ID

    /**
     * Encontra um voto de um usuário específico em um ForumPost específico.
     * Útil para verificar se o usuário já votou neste post.
     *
     * @param user O usuário que votou.
     * @param forumPost O post que foi votado.
     * @return Optional contendo o ForumVote se existir.
     */
    Optional<ForumVote> findByUserAndForumPost(User user, ForumPost forumPost);

    /**
     * Encontra um voto de um usuário específico em um ForumComment específico.
     * Útil para verificar se o usuário já votou neste comentário.
     *
     * @param user O usuário que votou.
     * @param forumComment O comentário que foi votado.
     * @return Optional contendo o ForumVote se existir.
     */
    Optional<ForumVote> findByUserAndForumComment(User user, ForumComment forumComment);

    /**
     * Conta o número de votos de um determinado tipo (UPVOTE ou DOWNVOTE) para um ForumPost específico.
     *
     * @param forumPost O post para o qual contar os votos.
     * @param voteType O tipo de voto a ser contado (UPVOTE ou DOWNVOTE).
     * @return A contagem de votos do tipo especificado para o post.
     */
    long countByForumPostAndVoteType(ForumPost forumPost, VoteType voteType);

    /**
     * Conta o número de votos de um determinado tipo (UPVOTE ou DOWNVOTE) para um ForumComment específico.
     *
     * @param forumComment O comentário para o qual contar os votos.
     * @param voteType O tipo de voto a ser contado (UPVOTE ou DOWNVOTE).
     * @return A contagem de votos do tipo especificado para o comentário.
     */
    long countByForumCommentAndVoteType(ForumComment forumComment, VoteType voteType);

    // O método antigo findTopByForumPostAndUserOrderByVoteIdDesc não é mais aplicável
    // da mesma forma devido à mudança na estrutura do ID e na lógica de votação.
    // A funcionalidade de buscar o voto de um usuário em um post é coberta por findByUserAndForumPost.

    // Se você precisar deletar votos em massa (ex: quando um usuário é deletado),
    // métodos @Modifying @Query podem ser úteis, embora CascadeType.ALL
    // nos relacionamentos da entidade User também possam cuidar disso.
    // Exemplo:
    // @Modifying
    // @Query("DELETE FROM ForumVote fv WHERE fv.user = :user")
    // void deleteVotesByUser(@Param("user") User user);
}