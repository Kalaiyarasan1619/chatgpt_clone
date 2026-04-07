package com.quickgpt_backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.quickgpt_backend.dto.ChatRequest;
import com.quickgpt_backend.dto.ChatResponse;
import com.quickgpt_backend.model.Chat;
import com.quickgpt_backend.repository.ChatRepository;



@Service
public class ChatService {

    @Autowired
    private ChatRepository chatRepository;

    private final WebClient webClient = WebClient.create("http://localhost:8000");

    public String getAIResponse(String message) {

        

        ChatRequest request = new ChatRequest();
        request.setMessage(message);
        
        ChatResponse response = webClient.post()
        .uri("/ai")
        .bodyValue(request)
        .retrieve()
        .bodyToMono(ChatResponse.class)
        .block();

return response.getReply();
    }

    public void saveChat(String message, String response) {
        Chat chat = new Chat();
        chat.setMessage(message);
        chat.setResponse(response);
        chatRepository.save(chat);
    }

    public List<Chat> getAllChats(){
        return chatRepository.findAll();
    }

    

    
}
