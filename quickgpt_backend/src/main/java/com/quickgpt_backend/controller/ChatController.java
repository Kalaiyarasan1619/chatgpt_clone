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
@CrossOrigin
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping
    public ChatResponse chat(@RequestBody ChatRequest request) {

        String reply = chatService.getAIResponse(request.getMessage());

        chatService.saveChat(request.getMessage(), reply);

        return new ChatResponse(reply);
    }

    @GetMapping("/history")
    public List<Chat> getChatHistory() {
    return chatService.getAllChats();
}
}