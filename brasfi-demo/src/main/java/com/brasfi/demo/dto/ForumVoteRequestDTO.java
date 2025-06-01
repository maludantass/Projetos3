package com.brasfi.demo.dto; // Ou o seu pacote de DTOs

import com.brasfi.demo.model.VoteType; // Importa sua enumeração VoteType
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ForumVoteRequestDTO {

    @NotNull(message = "O tipo do voto (UPVOTE ou DOWNVOTE) é obrigatório.")
    private VoteType voteType;

    // O voto deve ser para um postId OU para um commentId, mas não ambos.
    // Esta validação de exclusividade mútua ("um ou outro, mas não ambos, e pelo menos um")
    // pode ser feita na camada de serviço ou com uma anotação de validação customizada a nível de classe.
    private Long postId;       // ID do ForumPost a ser votado (se aplicável)
    private Long commentId;    // ID do ForumComment a ser votado (se aplicável)

    // O ID do usuário (votante) será obtido do usuário autenticado no backend.
}