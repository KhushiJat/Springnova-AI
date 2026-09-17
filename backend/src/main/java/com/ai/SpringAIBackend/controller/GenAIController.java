package com.ai.SpringAIBackend.controller;

import com.ai.SpringAIBackend.model.ChatMessage;
import com.ai.SpringAIBackend.services.*;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class GenAIController {

    private final ChatService chatService;
    private final ImageService imageService;
    private final RecipeService recipeService;
    private final AudioService audioService;
    private final HistoryService historyService; // Added HistoryService

    public GenAIController(ChatService chatService, ImageService imageService,
                           RecipeService recipeService, AudioService audioService,
                           HistoryService historyService) {
        this.chatService = chatService;
        this.imageService = imageService;
        this.recipeService = recipeService;
        this.audioService = audioService;
        this.historyService = historyService;
    }

    @GetMapping("ask-ai")
    public String getResponse(@RequestParam String prompt, @RequestParam(defaultValue = "guest") String username){
        String aiResponse = chatService.getResponse(prompt);
        historyService.saveLog(username, "CHAT", prompt, aiResponse);
        return aiResponse;
    }

    @GetMapping("ask-ai-options")
    public String getResponseOptions(@RequestParam String prompt, @RequestParam(defaultValue = "guest") String username){
        String aiResponse = chatService.getResponseOptions(prompt);
        historyService.saveLog(username, "CHAT_OPTIONS", prompt, aiResponse);
        return aiResponse;
    }

    @GetMapping("generate-image")
    public List<String> generateImages(HttpServletResponse response,
                                       @RequestParam String prompt,
                                       @RequestParam(defaultValue = "guest") String username,
                                       @RequestParam(defaultValue = "hd") String quality,
                                       @RequestParam(defaultValue = "1") int n,
                                       @RequestParam(defaultValue = "1024") int width,
                                       @RequestParam(defaultValue = "1024") int height) throws IOException {
        List<String> imageUrls = imageService.generateImage(prompt, quality, n, width, height);
        historyService.saveLog(username, "IMAGE", prompt, String.join(",", imageUrls));
        return imageUrls;
    }

    @GetMapping("recipe-creator")
    public String recipeCreator(@RequestParam String ingredients,
                                @RequestParam(defaultValue = "guest") String username,
                                @RequestParam(defaultValue = "any") String cuisine,
                                @RequestParam(defaultValue = "") String dietaryRestriction) {
        String recipe = recipeService.createRecipe(ingredients, cuisine, dietaryRestriction);
        String inputSummary = "Cuisine: " + cuisine + ", Ingredients: " + ingredients + ", Dietary: " + dietaryRestriction;
        historyService.saveLog(username, "RECIPE", inputSummary, recipe);
        return recipe;
    }

    @PostMapping("transcribe-audio")
    public ResponseEntity<String> transcribeAudio(@RequestParam("file") MultipartFile file,
                                                  @RequestParam(defaultValue = "guest") String username) {
        try {
            String transcription = audioService.transcribeAudio(file);
            historyService.saveLog(username, "AUDIO", file.getOriginalFilename(), transcription);
            return ResponseEntity.ok(transcription);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    // Endpoint to retrieve all history types for a given user
    @GetMapping("history")
    public List<ChatMessage> getAllHistory(@RequestParam String username) {
        return historyService.getHistoryForUser(username);
    }
}