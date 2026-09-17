package com.ai.SpringAIBackend.services;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.IntStream;

@Service
public class ImageService {

    public List<String> generateImage(String prompt, String quality, int n, int width, int height) {
        // Keep the user prompt clean and natural without forced buzzwords
        return IntStream.range(0, n)
                .mapToObj(i -> "https://image.pollinations.ai/prompt/"
                        + java.net.URLEncoder.encode(prompt, java.nio.charset.StandardCharsets.UTF_8)
                        + "?width=" + width
                        + "&height=" + height
                        + "&nologo=true")
                .toList();
    }
}


