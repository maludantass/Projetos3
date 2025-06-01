package com.brasfi.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ForumCommentUpdateRequestDTO {

    @NotBlank(message = "O texto do comentário não pode estar em branco.")
    @Size(min = 1, max = 5000, message = "O comentário deve ter entre 1 e 5000 caracteres.")
    private String text;
}