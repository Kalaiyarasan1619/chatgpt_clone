package com.quickgpt_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
public class ChatResponse {
    private String reply;

    

    public ChatResponse() {
    }

    public String getReply() {
        return reply;
    }

    public void setReply(String reply) {
        this.reply = reply;
    }

    public ChatResponse(String reply) {
        this.reply = reply;
    }
}
