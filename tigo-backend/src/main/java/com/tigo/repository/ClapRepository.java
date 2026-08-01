package com.tigo.repository;
import com.tigo.entity.Clap;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
public interface ClapRepository extends JpaRepository<Clap, UUID> {}
