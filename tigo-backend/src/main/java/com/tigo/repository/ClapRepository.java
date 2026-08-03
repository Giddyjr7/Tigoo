package com.tigo.repository;

import com.tigo.entity.Clap;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;

import java.util.Optional;
import java.util.UUID;

public interface ClapRepository extends JpaRepository<Clap, UUID> {
    Optional<Clap> findByPostIdAndUserId(UUID postId, UUID userId);

    // Pessimistic write lock on the per-user clap row, so two concurrent requests from the same
    // user can't both read the same count and lose an update.
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<Clap> findByPostIdAndUserIdForUpdate(UUID postId, UUID userId);
}
