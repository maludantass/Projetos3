package com.brasfi.demo.dto;

import lombok.AllArgsConstructor; // Import corrigido
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant; // Import para Instant

// UserSummaryDTO é definido em seu próprio arquivo e importado implicitamente se no mesmo pacote,
// ou explicitamente se em pacote diferente. Assumindo que está no mesmo pacote 'com.brasfi.demo.dto'.
// Se UserSummaryDTO estivesse em com.brasfi.demo.dto.user.UserSummaryDTO, por exemplo,
// seria necessário: import com.brasfi.demo.dto.user.UserSummaryDTO;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor // Agora com import correto
public class ForumCommunityResponseDTO {

    private Long id;
    private String title;
    private String description;
    private UserSummaryDTO author; // Utiliza o UserSummaryDTO corrigido
    private Instant createdAt;
    private Instant updatedAt;
    private int postCount;       // Este campo deve ser preenchido pela camada de serviço

    // O construtor @AllArgsConstructor gerado pelo Lombok cuidará da inicialização
    // quando todos os campos são fornecidos, o que é ideal para quando o serviço
    // monta este DTO após buscar e processar os dados.

    // Se você precisar de um construtor que aceite a entidade ForumCommunity diretamente
    // para facilitar o mapeamento em alguns casos (e o postCount for tratado),
    // você pode adicioná-lo, mas o @AllArgsConstructor é mais direto para uso pelo serviço.
    // Exemplo de como um serviço/mapper populacional este DTO:
    //
    // No seu serviço:
    // ForumCommunity community = forumCommunityRepository.findById(id).orElseThrow(...);
    // User authorEntity = community.getAuthor();
    // UserSummaryDTO authorDto = null;
    // if (authorEntity != null) {
    //     authorDto = new UserSummaryDTO(authorEntity);
    // }
    // int calculatedPostCount = calculatePostCountForCommunity(community.getId()); // Método para calcular/buscar contagem
    //
    // return new ForumCommunityResponseDTO(
    //     community.getId(),
    //     community.getTitle(),
    //     community.getDescription(),
    //     authorDto,
    //     community.getCreatedAt(),
    //     community.getUpdatedAt(),
    //     calculatedPostCount
    // );
}