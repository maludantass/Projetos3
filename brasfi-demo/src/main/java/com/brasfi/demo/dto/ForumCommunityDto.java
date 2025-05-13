package com.brasfi.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ForumCommunityDto {

    private Long id;
    private String name;
    private String description;
    private Integer numberOfPosts; 
}