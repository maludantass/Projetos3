package com.brasfi.demo.services; // Seu pacote de serviços

import com.brasfi.demo.dto.ForumCommentRequestDTO;
import com.brasfi.demo.dto.ForumCommentResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ForumCommentService {

    /**
     * Cria um novo comentário em um post ou como resposta a outro comentário.
     * O autor é determinado a partir do usuário autenticado.
     *
     * @param requestDTO DTO contendo os dados para o novo comentário.
     * @return ForumCommentResponseDTO do comentário criado.
     */
    ForumCommentResponseDTO createComment(ForumCommentRequestDTO requestDTO);

    /**
     * Lista os comentários de nível superior de um post específico, com paginação.
     *
     * @param postId O ID do ForumPost.
     * @param pageable Objeto de paginação.
     * @return Uma página de ForumCommentResponseDTO.
     */
    Page<ForumCommentResponseDTO> getCommentsByPost(Long postId, Pageable pageable);

    /**
     * Lista as respostas diretas a um comentário pai específico, com paginação.
     *
     * @param parentCommentId O ID do comentário pai.
     * @param pageable Objeto de paginação.
     * @return Uma página de ForumCommentResponseDTO contendo as respostas.
     */
    Page<ForumCommentResponseDTO> getRepliesForComment(Long parentCommentId, Pageable pageable);

    /**
     * Atualiza o texto de um comentário existente.
     * Apenas o autor original do comentário pode atualizar.
     *
     * @param commentId O ID do comentário a ser atualizado.
     * @param text O novo texto para o comentário.
     * @return ForumCommentResponseDTO do comentário atualizado.
     * @throws RuntimeException (ou sua exceção customizada) se não encontrado ou sem permissão.
     */
    ForumCommentResponseDTO updateComment(Long commentId, String text);

    /**
     * Deleta um comentário.
     * Apenas o autor original do comentário pode deletar.
     * A deleção cascateará para respostas aninhadas e votos associados ao comentário.
     *
     * @param commentId O ID do comentário a ser deletado.
     * @throws RuntimeException (ou sua exceção customizada) se não encontrado ou sem permissão.
     */
    void deleteComment(Long commentId);

    /**
     * Busca um comentário específico pelo seu ID e o retorna como DTO.
     * Útil para quando se quer carregar um comentário individualmente.
     *
     * @param commentId O ID do comentário.
     * @return ForumCommentResponseDTO do comentário encontrado.
     * @throws RuntimeException (ou sua exceção customizada) se não encontrado.
     */
    ForumCommentResponseDTO getCommentDtoById(Long commentId);
}