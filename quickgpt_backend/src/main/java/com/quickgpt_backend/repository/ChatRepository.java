package com.quickgpt_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.quickgpt_backend.model.Chat;

public interface ChatRepository extends JpaRepository<Chat, Long> {

    @Query(value = "SELECT DISTINCT ON (page_id) * FROM chat ORDER BY page_id, id ASC", nativeQuery = true)
    List<Chat> findDistinctFirstRowPerPageId();

    List<Chat> findByPageIdOrderByIdAsc(Integer pageId);
}
