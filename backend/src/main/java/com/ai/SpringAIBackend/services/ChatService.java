package com.ai.SpringAIBackend.services;

import com.ai.SpringAIBackend.repositories.ChatRepository;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.ollama.api.OllamaOptions;
import org.springframework.stereotype.Service;

@Service
public class ChatService {
    private final ChatModel chatModel;
    private final ChatRepository chatRepository;

    public ChatService(ChatModel chatModel, ChatRepository chatRepository) {
        this.chatModel = chatModel;
        this.chatRepository = chatRepository;
    }

    public String getResponse(String prompt){
        return chatModel.call(prompt);
    }

    public String getResponseOptions(String prompt){
        ChatResponse response = chatModel.call(
                new Prompt(
                        prompt,
                        OllamaOptions.create()
                                .withModel("llama3.2")
                                .withTemperature(0.4F)
                ));
        return response.getResult().getOutput().getContent();
    }
}