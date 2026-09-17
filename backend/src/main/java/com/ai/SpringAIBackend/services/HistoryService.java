package com.ai.SpringAIBackend.services;

import com.ai.SpringAIBackend.model.ChatMessage;
import com.ai.SpringAIBackend.repositories.ChatRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class HistoryService {

    private final ChatRepository chatRepository;

    public HistoryService(ChatRepository chatRepository) {
        this.chatRepository = chatRepository;
    }

    public void saveLog(String username, String type, String prompt, String response) {
        ChatMessage message = new ChatMessage();
        message.setUsername(username != null ? username : "guest");
        message.setType(type);
        message.setPrompt(prompt);
        message.setResponse(response);
        chatRepository.save(message);
    }

    public List<ChatMessage> getHistoryForUser(String username) {
        return chatRepository.findByUsername(username);
    }
}