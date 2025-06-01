package com.brasfi.demo.services; // Seu pacote de serviços

import com.brasfi.demo.dto.ForumCommunityRequestDTO;
import com.brasfi.demo.dto.ForumCommunityResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
// Seu UserPrincipal ou a forma como você representa o usuário autenticado
// import org.springframework.security.core.userdetails.UserDetails;

public interface ForumCommunityService {

    /**
     * Cria uma nova comunidade (tópico) no fórum.
     * O autor é determinado a partir do usuário autenticado.
     *
     * @param requestDTO DTO contendo os dados para a nova comunidade.
     * @return ForumCommunityResponseDTO da comunidade criada.
     */
    ForumCommunityResponseDTO createCommunity(ForumCommunityRequestDTO requestDTO);

    /**
     * Lista todas as comunidades do fórum com paginação.
     *
     * @param pageable Objeto de paginação.
     * @return Uma página de ForumCommunityResponseDTO.
     */
    Page<ForumCommunityResponseDTO> getAllCommunities(Pageable pageable);

    /**
     * Busca uma comunidade específica pelo seu ID.
     *
     * @param communityId O ID da comunidade.
     * @return ForumCommunityResponseDTO da comunidade encontrada.
     * @throws RuntimeException (ou sua exceção customizada, ex: ResourceNotFoundException) se não encontrada.
     */
    ForumCommunityResponseDTO getCommunityById(Long communityId);

    /**
     * Busca uma comunidade específica pelo seu título.
     *
     * @param title O título da comunidade.
     * @return ForumCommunityResponseDTO da comunidade encontrada.
     * @throws RuntimeException (ou sua exceção customizada) se não encontrada.
     */
    ForumCommunityResponseDTO getCommunityByTitle(String title);

    /**
     * Pesquisa comunidades cujo título contém a string fornecida.
     *
     * @param titleQuery A string para pesquisar no título.
     * @param pageable Objeto de paginação.
     * @return Uma página de ForumCommunityResponseDTO.
     */
    Page<ForumCommunityResponseDTO> searchCommunitiesByTitle(String titleQuery, Pageable pageable);

    /**
     * Lista todas as comunidades criadas por um autor específico (identificado pelo username).
     *
     * @param username O username do autor.
     * @param pageable Objeto de paginação.
     * @return Uma página de ForumCommunityResponseDTO.
     */
    Page<ForumCommunityResponseDTO> getCommunitiesByAuthorUsername(String username, Pageable pageable);

    /**
     * Atualiza uma comunidade existente.
     * Apenas o autor original ou um administrador pode atualizar.
     *
     * @param communityId O ID da comunidade a ser atualizada.
     * @param requestDTO DTO contendo os novos dados.
     * @return ForumCommunityResponseDTO da comunidade atualizada.
     * @throws RuntimeException (ou sua exceção customizada) se não encontrada ou sem permissão.
     */
    ForumCommunityResponseDTO updateCommunity(Long communityId, ForumCommunityRequestDTO requestDTO);

    /**
     * Deleta uma comunidade.
     * Apenas o autor original ou um administrador pode deletar.
     *
     * @param communityId O ID da comunidade a ser deletada.
     * @throws RuntimeException (ou sua exceção customizada) se não encontrada ou sem permissão.
     */
    void deleteCommunity(Long communityId);
}