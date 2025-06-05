package com.brasfi.demo.dto;

import com.brasfi.demo.model.VoteType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ForumVoteRequestDTO {

    @NotNull(message = "O tipo do voto (UPVOTE ou DOWNVOTE) é obrigatório.")
    private VoteType voteType;

    private Long postId;
    private Long commentId;
    
    @NotBlank(message = "O email do votante não pode estar em branco.")
    @Email(message = "O formato do email é inválido.")
    private String voterEmail;
}