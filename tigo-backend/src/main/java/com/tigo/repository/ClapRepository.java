package com.tigo.repository;

import com.tigo.entity.Clap;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ClapRepository extends JpaRepository<Clap, UUID> {
    Optional<Clap> findByPostIdAndUserId(UUID postId, UUID userId);
}
