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
public class ForumCommentRequestDTO {

    @NotBlank(message = "O texto do comentário não pode estar em branco.")
    @Size(min = 1, max = 5000, message = "O comentário deve ter entre 1 e 5000 caracteres.")
    private String text;

    @NotNull(message = "O ID do post (ForumPost) é obrigatório.")
    private Long postId; // ID do ForumPost ao qual este comentário está associado

    // O parentCommentId é opcional. Se for nulo, é um comentário de nível superior no post.
    // Se fornecido, indica que este comentário é uma resposta a outro comentário.
    private Long parentCommentId;

    // O ID do autor (User) será obtido do usuário autenticado no backend.
}