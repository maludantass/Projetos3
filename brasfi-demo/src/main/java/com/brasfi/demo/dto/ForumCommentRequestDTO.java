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
public class ForumCommentRequestDTO {

    @NotBlank(message = "O texto do comentário não pode estar em branco.")
    @Size(min = 1, max = 5000, message = "O comentário deve ter entre 1 e 5000 caracteres.")
    private String text;

    @NotNull(message = "O ID do post (ForumPost) é obrigatório.")
    private Long postId;

    private Long parentCommentId;

    @NotBlank(message = "O email do autor não pode estar em branco.")
    @Email(message = "O formato do email é inválido.")
    private String authorEmail;
}