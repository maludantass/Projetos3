package com.brasfi.demo.dto; // Certifique-se que este é o seu pacote de DTOs

import com.brasfi.demo.model.User; // Importa SUA entidade User
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
// Adicionei AllArgsConstructor caso seja útil, mas o construtor manual é mais importante aqui.
import lombok.AllArgsConstructor;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor // Adicionado para flexibilidade, mas o construtor customizado é chave.
public class UserSummaryDTO {
    private Long id;
    private String username; // Usaremos o username como nome de exibição

    public UserSummaryDTO(User user) {
        if (user != null) {
            this.id = user.getId();
            this.username = user.getUsername(); // Corrigido para usar getUsername()
        }
    }
}