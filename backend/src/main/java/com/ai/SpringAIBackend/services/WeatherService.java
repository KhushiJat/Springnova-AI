package com.ai.SpringAIBackend.services;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class WeatherService {

    private final String API_KEY = "64d20765689fc5a3c75f5881e952098f";

    public String getWeather(String city) {
        try {
            String url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + API_KEY + "&units=metric";
            RestTemplate restTemplate = new RestTemplate();
            String response = restTemplate.getForObject(url, String.class);

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);

            String cityName = root.get("name").asText();
            String description = root.get("weather").get(0).get("description").asText();
            double temp = root.get("main").get("temp").asDouble();
            double humidity = root.get("main").get("humidity").asDouble();
            double windSpeed = root.get("wind").get("speed").asDouble();

            return String.format("Current weather in %s: %.1f°C, %s. Humidity: %.0f%%, Wind Speed: %.1f m/s.",
                    cityName, temp, description, humidity, windSpeed);
        } catch (Exception e) {
            return "Sorry, I couldn't fetch the weather for that location right now.";
        }
    }
}