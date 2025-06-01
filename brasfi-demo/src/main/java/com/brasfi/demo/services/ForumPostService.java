package com.brasfi.demo.services; // Seu pacote de serviços

import com.brasfi.demo.dto.ForumPostRequestDTO;
import com.brasfi.demo.dto.ForumPostResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ForumPostService {

    /**
     * Cria um novo post dentro de uma comunidade.
     * O autor é determinado a partir do usuário autenticado.
     *
     * @param requestDTO DTO contendo os dados para o novo post.
     * @return ForumPostResponseDTO do post criado.
     */
    ForumPostResponseDTO createPost(ForumPostRequestDTO requestDTO);

    /**
     * Lista todos os posts de uma comunidade específica, com paginação.
     *
     * @param communityId O ID da ForumCommunity.
     * @param pageable Objeto de paginação.
     * @return Uma página de ForumPostResponseDTO.
     */
    Page<ForumPostResponseDTO> getPostsByCommunity(Long communityId, Pageable pageable);

    /**
     * Busca um post específico pelo seu ID.
     *
     * @param postId O ID do post.
     * @return ForumPostResponseDTO do post encontrado.
     * @throws RuntimeException (ou sua exceção customizada, ex: ResourceNotFoundException) se não encontrado.
     */
    ForumPostResponseDTO getPostById(Long postId);

    /**
     * Atualiza um post existente.
     * Apenas o autor original do post pode atualizar.
     *
     * @param postId O ID do post a ser atualizado.
     * @param requestDTO DTO contendo os novos dados para o post.
     * @return ForumPostResponseDTO do post atualizado.
     * @throws RuntimeException (ou sua exceção customizada) se não encontrado ou sem permissão.
     */
    ForumPostResponseDTO updatePost(Long postId, ForumPostRequestDTO requestDTO);

    /**
     * Deleta um post.
     * Apenas o autor original do post pode deletar.
     * A deleção cascateará para comentários e votos associados ao post.
     *
     * @param postId O ID do post a ser deletado.
     * @throws RuntimeException (ou sua exceção customizada) se não encontrado ou sem permissão.
     */
    void deletePost(Long postId);

    /**
     * Pesquisa posts dentro de uma comunidade específica cujo título contém a string fornecida.
     *
     * @param communityId O ID da ForumCommunity onde pesquisar.
     * @param titleQuery A string para pesquisar no título.
     * @param pageable Objeto de paginação.
     * @return Uma página de ForumPostResponseDTO.
     */
    Page<ForumPostResponseDTO> searchPostsByTitleInCommunity(Long communityId, String titleQuery, Pageable pageable);

    /**
     * Lista todos os posts criados por um autor específico (identificado pelo username).
     *
     * @param username O username do autor.
     * @param pageable Objeto de paginação.
     * @return Uma página de ForumPostResponseDTO.
     */
    Page<ForumPostResponseDTO> getPostsByAuthorUsername(String username, Pageable pageable);
}