package com.brasfi.demo.controller;

import com.brasfi.demo.model.Post;
import com.brasfi.demo.model.User;
import com.brasfi.demo.repository.UserRepository;
import com.brasfi.demo.services.FeedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
public class FeedController {

    @Autowired
    private FeedService feedService;

    @Autowired
    private UserRepository userRepository;

    // Endpoint para obter todos os posts com seus likes e comentários de um usuário
    @GetMapping("/feed/{userId}")
    public List<Post> getFeed(@PathVariable Long userId) {
        User user = getUserById(userId); // Método que busca o usuário pelo ID (implementar de acordo com seu repositório)
        return feedService.getPostsWithLikesAndComments(user);
    }

    // Endpoint para obter todos os posts curtidos por um usuário
    @GetMapping("/feed/liked/{userId}")
    public List<Post> getLikedPosts(@PathVariable Long userId) {
        User user = getUserById(userId); // Método que busca o usuário pelo ID
        return feedService.getPostsLikedByUser(user);
    }

    //Endpoint pra os videos salvos do usuário:
    @GetMapping("/feed/saved/{userId}")
        public List<Post> getSavedPosts(@PathVariable Long userId) {
        User user = getUserById(userId);  // Obtém o usuário pelo ID
        return user.getSavedPosts();      // Retorna os posts salvos desse usuário
    }

    // Endpoint para obter o feed geral (posts que ainda não expiraram)
    @GetMapping("/feed/general")
    public List<Post> getGeneralFeed() {
        return feedService.getGeneralFeed();  // Chama o serviço para recuperar os posts disponíveis
    }

    private User getUserById(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            return user.get();
        } else {
            throw new RuntimeException("User not found with id: " + userId);
        }
    }
}
