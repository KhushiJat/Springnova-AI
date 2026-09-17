package com.ai.SpringAIBackend.controller;

import com.ai.SpringAIBackend.services.HistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/map")
public class MapController {

    @Autowired
    private HistoryService historyService;

    @PostMapping("/track")
    public ResponseEntity<String> trackLocation(
            @RequestParam String username,
            @RequestParam String queryType,
            @RequestParam String details) {
        try {
            // This matches the exact parameters your HistoryService expects:
            // (username, type, prompt/details, response)
            historyService.saveLog(
                    username,
                    "MAP_" + queryType.toUpperCase(),
                    details,
                    "Successfully tracked and mapped location"
            );
            return ResponseEntity.ok("Location tracked and logged successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error logging map activity: " + e.getMessage());
        }
    }
}