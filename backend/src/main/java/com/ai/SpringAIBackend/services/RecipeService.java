package com.ai.SpringAIBackend.services;

import org.springframework.ai.chat.model.ChatModel;
import org.springframework.stereotype.Service;

@Service
public class RecipeService {

    private final ChatModel chatModel;

    public RecipeService(ChatModel chatModel) {
        this.chatModel = chatModel;
    }

    public String createRecipe(String ingredients,
                               String cuisine,
                               String dietaryRestriction) {
        String prompt = String.format("Create a %s recipe using these ingredients: %s. Dietary restrictions: %s",
                cuisine, ingredients, dietaryRestriction);
        return chatModel.call(prompt);
    }
}