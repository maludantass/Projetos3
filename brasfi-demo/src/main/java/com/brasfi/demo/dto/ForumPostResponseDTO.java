package com.brasfi.demo.dto; // Ou o seu pacote de DTOs

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

// UserSummaryDTO é definido em seu próprio arquivo e importado implicitamente se no mesmo pacote,
// ou explicitamente se em pacote diferente. Assumindo que está no mesmo pacote 'com.brasfi.demo.dto'.
// import com.brasfi.demo.dto.UserSummaryDTO; (Se necessário)

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ForumPostResponseDTO {

    private Long id;
    private String title;
    private String content; // Pode ser nulo se for um post de link
    private String url;     // Pode ser nulo se for um post de texto
    private UserSummaryDTO author; // Usando o UserSummaryDTO corrigido (com username)
    private Long forumCommunityId; // ID da comunidade à qual o post pertence
    private String forumCommunityTitle; // Título da comunidade para exibição rápida
    private Instant createdAt;
    private Instant updatedAt;

    // Campos calculados/agregados pela camada de serviço:
    private int voteScore;    // (upvotes - downvotes)
    private int commentCount; // Contagem total de comentários

    // Nota: A lista de comentários (List<ForumCommentResponseDTO>)
    // geralmente é tratada em um endpoint mais específico ou com paginação
    // para evitar sobrecarregar este DTO, especialmente em listagens.
    // Para uma visualização detalhada de um post, essa lista seria carregada.
}