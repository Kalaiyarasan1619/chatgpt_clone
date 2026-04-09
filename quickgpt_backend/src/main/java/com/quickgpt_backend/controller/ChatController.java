package com.quickgpt_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.quickgpt_backend.dto.ChatRequest;
import com.quickgpt_backend.dto.ChatResponse;
import com.quickgpt_backend.model.Chat;
import com.quickgpt_backend.service.ChatService;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping
    public ChatResponse chat(@RequestBody ChatRequest request) {
        Integer pageId = request.getPageId();
        if (pageId == null || pageId <= 0) {
            pageId = 1;
        }

        String reply = chatService.getAIResponse(request.getMessage());

        chatService.saveChat(request.getMessage(), reply, pageId);

        return new ChatResponse(reply);
    }

    @GetMapping("/history")
    public List<Chat> getChatHistory() {
        return chatService.getAllChats();
    }

    /**
     * Sidebar “recent”: first stored row per page_id ({@code DISTINCT ON (page_id)} … {@code id ASC}).
     */
    @GetMapping("/recent")
    public List<Chat> getRecentChatsPerPage() {
        return chatService.getRecentDistinctByPageId();
    }

    /** Full message thread for one conversation (page_id). */
    @GetMapping("/page/{pageId}")
    public List<Chat> getChatsByPage(@PathVariable Integer pageId) {
        return chatService.getChatsByPageId(pageId);
    }
}