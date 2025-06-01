package com.brasfi.demo.dto; // Ou o seu pacote de DTOs

import com.brasfi.demo.model.VoteType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ForumVoteResponseDTO {

    private String message;             // Mensagem de sucesso (ex: "Voto registrado.")
    private Long votedItemId;           // ID do item que foi votado (seja postId ou commentId)
    private String itemType;            // "POST" ou "COMMENT" para o frontend saber qual item atualizar
    private VoteType newVoteStatus;     // O status final do voto do usuário no item (UPVOTE, DOWNVOTE, ou null se o voto foi removido)
    private int newVoteScore;           // O novo placar de votos do item (upvotes - downvotes)

}