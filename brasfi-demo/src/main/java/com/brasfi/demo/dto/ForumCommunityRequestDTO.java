package com.brasfi.demo.dto;

import jakarta.validation.constraints.Email;
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
public class ForumCommunityRequestDTO {

    @NotBlank(message = "O título da comunidade não pode estar em branco.")
    @Size(min = 3, max = 100, message = "O título deve ter entre 3 e 100 caracteres.")
    private String title;

    @NotBlank(message = "A descrição da comunidade não pode estar em branco.")
    @Size(min = 10, max = 500, message = "A descrição deve ter entre 10 e 500 caracteres.")
    private String description;

    @NotBlank(message = "O email do autor não pode estar em branco.")
    @Email(message = "O formato do email é inválido.")
    private String authorEmail;
}