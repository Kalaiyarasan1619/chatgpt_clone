package com.quickgpt_backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean
    public WebClient webClient(@Value("${ai.service.url}") String aiServiceUrl) {
        String base = aiServiceUrl == null ? "" : aiServiceUrl.replaceAll("/+$", "");
        return WebClient.builder()
                .baseUrl(base)
                .build();
    }
}
