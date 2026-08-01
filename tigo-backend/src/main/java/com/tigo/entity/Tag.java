package com.tigo.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "tags")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 50, unique = true, nullable = false)
    private String name;

    @Column(length = 60, unique = true, nullable = false)
    private String slug;

    @ManyToMany(mappedBy = "tags")
    private List<Post> posts;
}
