package com.ai.SpringAIBackend.controller;

import com.ai.SpringAIBackend.services.HistoryService;
import com.ai.SpringAIBackend.services.WeatherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class WeatherController {

    @Autowired
    private WeatherService weatherService;

    @Autowired
    private HistoryService historyService;

    @GetMapping("/weather")
    public ResponseEntity<String> getWeather(
            @RequestParam String city,
            @RequestParam(defaultValue = "admin") String username) {

        try {
            // Calls your existing method that returns a string summary from OpenWeather
            String response = weatherService.getWeather(city);

            // Log to activity history safely
            historyService.saveLog(username, "WEATHER", "Checked weather for " + city, response);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching weather: " + e.getMessage());
        }
    }
}