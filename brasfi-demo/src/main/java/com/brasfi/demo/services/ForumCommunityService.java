package com.brasfi.demo.services;

import com.brasfi.demo.dto.ForumCommunityRequestDTO;
import com.brasfi.demo.dto.ForumCommunityResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ForumCommunityService {

    ForumCommunityResponseDTO createCommunity(Long authorId, ForumCommunityRequestDTO requestDTO);

    Page<ForumCommunityResponseDTO> getAllCommunities(Pageable pageable);

    ForumCommunityResponseDTO getCommunityById(Long communityId);

    ForumCommunityResponseDTO getCommunityByTitle(String title);

    Page<ForumCommunityResponseDTO> searchCommunitiesByTitle(String titleQuery, Pageable pageable);

    Page<ForumCommunityResponseDTO> getCommunitiesByAuthorUsername(String username, Pageable pageable);

    ForumCommunityResponseDTO updateCommunity(Long communityId, ForumCommunityRequestDTO requestDTO);

    void deleteCommunity(Long communityId);
}