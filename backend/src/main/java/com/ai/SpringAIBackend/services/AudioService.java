package com.ai.SpringAIBackend.services;

import io.github.givimad.whisperjni.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import javax.sound.sampled.AudioInputStream;
import javax.sound.sampled.AudioSystem;
import javax.sound.sampled.AudioFormat;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

@Service
public class AudioService {

    private final WhisperJNI whisper;

    public AudioService() {
        try {
            WhisperJNI.loadLibrary();
            WhisperJNI.setLibraryLogger(null);
            this.whisper = new WhisperJNI();
        } catch (Exception e) {
            throw new RuntimeException("Failed to load Whisper native library", e);
        }
    }

    public String transcribeAudio(MultipartFile multipartFile) {
        File tempInput = null;
        File tempWav = null;
        WhisperContext context = null;

        try {
            // 1. Save uploaded file temporarily
            tempInput = File.createTempFile("upload-", ".tmp");
            multipartFile.transferTo(tempInput);

            // 2. Prepare wav destination file
            tempWav = File.createTempFile("converted-", ".wav");

            // 3. Attempt conversion, use safe fallback if format is unrecognized by Java AudioSystem
            try {
                convertTo16kHzMonoWav(tempInput, tempWav);
            } catch (Exception e) {
                // If browser sends WebM/Blob and Java AudioSystem fails, copy as fallback
                Files.copy(tempInput.toPath(), tempWav.toPath(), StandardCopyOption.REPLACE_EXISTING);
            }

            // 4. Decode WAV file into float samples array
            float[] samples = decodeWaveFileToFloats(tempWav);

            // 5. Initialize Whisper context
            context = whisper.init(Path.of("ggml-tiny.en.bin"));
            WhisperFullParams params = new WhisperFullParams();

            // 6. Run transcription
            int result = whisper.full(context, params, samples, samples.length);
            if (result != 0) {
                throw new RuntimeException("Transcription failed with error code: " + result);
            }

            // 7. Extract text segments
            StringBuilder transcript = new StringBuilder();
            int numSegments = whisper.fullNSegments(context);
            for (int i = 0; i < numSegments; i++) {
                transcript.append(whisper.fullGetSegmentText(context, i)).append(" ");
            }

            return transcript.toString().trim();

        } catch (Exception e) {
            throw new RuntimeException("Error during local transcription: " + e.getMessage(), e);
        } finally {
            // 8. Cleanup resources and temp files
            if (context != null) {
                try { context.close(); } catch (Exception ignored) {}
            }
            if (tempInput != null) tempInput.delete();
            if (tempWav != null) tempWav.delete();
        }
    }

    private void convertTo16kHzMonoWav(File source, File destination) throws Exception {
        try (AudioInputStream sourceStream = AudioSystem.getAudioInputStream(source)) {
            AudioFormat targetFormat = new AudioFormat(
                    AudioFormat.Encoding.PCM_SIGNED,
                    16000.0f, 16, 1, 2, 16000.0f, false
            );
            try (AudioInputStream convertedStream = AudioSystem.getAudioInputStream(targetFormat, sourceStream)) {
                AudioSystem.write(convertedStream, javax.sound.sampled.AudioFileFormat.Type.WAVE, destination);
            }
        }
    }

    private float[] decodeWaveFileToFloats(File wavFile) throws Exception {
        try (AudioInputStream audioStream = AudioSystem.getAudioInputStream(wavFile)) {
            byte[] audioBytes = audioStream.readAllBytes();
            float[] samples = new float[audioBytes.length / 2];
            for (int i = 0; i < samples.length; i++) {
                int low = audioBytes[2 * i] & 0xFF;
                int high = audioBytes[2 * i + 1];
                int sample = (high << 8) | low;
                samples[i] = sample / 32768.0f;
            }
            return samples;
        }
    }
}
