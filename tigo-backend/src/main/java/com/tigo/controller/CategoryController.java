package com.tigo.controller;

import com.tigo.dto.CategoryDto;
import com.tigo.entity.Category;
import com.tigo.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryRepository categoryRepository;

    @GetMapping
    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream().map(cat -> {
            CategoryDto dto = new CategoryDto();
            dto.setId(cat.getId());
            dto.setName(cat.getName());
            dto.setSlug(cat.getSlug());
            return dto;
        }).collect(Collectors.toList());
    }
}
