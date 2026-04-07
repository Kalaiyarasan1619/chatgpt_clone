package com.quickgpt_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.quickgpt_backend.model.Chat;

public interface ChatRepository extends JpaRepository<Chat, Long> {
}
