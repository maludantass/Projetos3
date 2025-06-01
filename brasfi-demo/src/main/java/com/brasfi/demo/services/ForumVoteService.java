package com.brasfi.demo.services; // Seu pacote de serviços

import com.brasfi.demo.dto.ForumVoteRequestDTO;
import com.brasfi.demo.dto.ForumVoteResponseDTO;

public interface ForumVoteService {

    /**
     * Processa uma requisição de voto para um post ou comentário.
     * - Se o usuário ainda não votou no item, um novo voto é criado.
     * - Se o usuário já votou no item com o mesmo tipo de voto, o voto é removido (toggle off).
     * - Se o usuário já votou no item com um tipo de voto diferente, o voto é atualizado.
     * O usuário é determinado a partir do contexto de segurança.
     *
     * @param requestDTO DTO contendo os dados do voto (postId ou commentId, e voteType).
     * @return ForumVoteResponseDTO indicando o resultado da operação e o novo placar de votos do item.
     * @throws RuntimeException (ou suas exceções customizadas) se o item não for encontrado,
     * se o requestDTO for inválido (ex: postId e commentId preenchidos ou ambos nulos),
     * ou se o usuário não for encontrado.
     */
    ForumVoteResponseDTO processVote(ForumVoteRequestDTO requestDTO);

}