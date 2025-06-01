package com.brasfi.demo.dto; // Ou o seu pacote de DTOs

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.List; // Para a lista de respostas
import java.util.ArrayList; // Para inicializar a lista de respostas

// UserSummaryDTO é definido em seu próprio arquivo e importado implicitamente se no mesmo pacote,
// ou explicitamente se em pacote diferente. Assumindo que está no mesmo pacote 'com.brasfi.demo.dto'.
// import com.brasfi.demo.dto.UserSummaryDTO; (Se necessário)

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ForumCommentResponseDTO {

    private Long id;
    private String text;
    private UserSummaryDTO author; // Usando o UserSummaryDTO corrigido (com username)
    private Long postId;           // ID do post pai
    private Long parentCommentId;  // ID do comentário pai, se houver (pode ser nulo)
    private Instant createdAt;
    private Instant updatedAt;

    // Campos calculados/agregados pela camada de serviço:
    private int voteScore;    // (upvotes - downvotes)
    private int replyCount;   // Contagem de respostas diretas a ESTE comentário

    // Para suportar o aninhamento na resposta:
    // Esta lista pode ser preenchida pela camada de serviço, por exemplo,
    // carregando um ou dois níveis de respostas, ou pode ser vazia se as respostas
    // forem carregadas sob demanda pelo frontend.
    private List<ForumCommentResponseDTO> replies = new ArrayList<>();

    // Construtor principal que o serviço/mapper usará.
    // O @AllArgsConstructor do Lombok já cria um construtor com todos os campos.
    // Se você precisar de um construtor customizado para mapeamento, pode adicioná-lo.
    // Exemplo (sem @AllArgsConstructor):
    /*
    public ForumCommentResponseDTO(Long id, String text, UserSummaryDTO author, Long postId,
                                   Long parentCommentId, Instant createdAt, Instant updatedAt,
                                   int voteScore, int replyCount, List<ForumCommentResponseDTO> replies) {
        this.id = id;
        this.text = text;
        this.author = author;
        this.postId = postId;
        this.parentCommentId = parentCommentId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.voteScore = voteScore;
        this.replyCount = replyCount;
        this.replies = replies != null ? replies : new ArrayList<>();
    }
    */
}