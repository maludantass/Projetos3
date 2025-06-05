package com.brasfi.demo.dto;

import jakarta.validation.constraints.Email; 
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

    @Size(max = 10000, message = "O conteúdo do post não pode exceder 10000 caracteres.")
    private String content;

    @Size(max = 2048, message = "A URL não pode exceder 2048 caracteres.")
    private String url;

    @NotNull(message = "O ID da comunidade (ForumCommunity) é obrigatório.")
    private Long forumCommunityId;

    @NotBlank(message = "O email do autor não pode estar em branco.")
    @Email(message = "O formato do email é inválido.")
    private String authorEmail;
}