package com.brasfi.demo.dto; // Ou o seu pacote de DTOs

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ForumPostRequestDTO {

    @NotBlank(message = "O título do post não pode estar em branco.")
    @Size(min = 3, max = 300, message = "O título do post deve ter entre 3 e 300 caracteres.")
    private String title;

    // O conteúdo é opcional se uma URL for fornecida, e vice-versa.
    // Essa lógica de validação (um ou outro deve estar presente)
    // geralmente é tratada na camada de serviço ou com validações customizadas a nível de classe.
    @Size(max = 10000, message = "O conteúdo do post não pode exceder 10000 caracteres.")
    private String content; // Conteúdo textual do post (opcional se url for preenchida)

    @Size(max = 2048, message = "A URL não pode exceder 2048 caracteres.")
    private String url; // URL para posts do tipo link (opcional se content for preenchido)

    @NotNull(message = "O ID da comunidade (ForumCommunity) é obrigatório.")
    private Long forumCommunityId; // ID da ForumCommunity onde o post será criado

    // O ID do autor (User) será obtido do usuário autenticado no backend.
}