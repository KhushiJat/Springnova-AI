# Springnova-AI

A robust, full-stack enterprise-grade multimodal AI application built with a **React (Vite)** frontend and a **Spring Boot** REST API backend. It features secure user authentication, local large language model (LLM) integration via **Ollama**, local speech-to-text processing using **Whisper JNI**, AI image generation, smart recipe creation, real-time weather tracking, live map navigation, and persistent activity logs.

---

## Application Overview & Authentication

<div align="center">
  <img src="./spring-AI-Frontend/src/SpringnovaAI_IMG/Signin.png" alt="Sign In View" width="700">
  <p><em>Secure user authentication portal for accessing the platform workspace.</em></p>
</div>

---

## AI Workspaces & Core Modules

The platform integrates multiple AI-driven utility modules structured across an intuitive sidebar navigation layout:

<div align="center">
  <img src="./spring-AI-Frontend/src/SpringnovaAI_IMG/Dashboard1.png" alt="Main AI Dashboard" width="700">
  <p><em>Main interactive dashboard providing access to conversational AI and prompt management.</em></p>
</div>

<div align="center">
  <img src="./spring-AI-Frontend/src/SpringnovaAI_IMG/Dashboard2.png" alt="Secondary Dashboard View" width="700">
  <p><em>Expanded sidebar view showing the full suite of specialized AI utilities.</em></p>
</div>

---

## Conversational AI & Generative Features

<div align="center">
  <img src="./spring-AI-Frontend/src/SpringnovaAI_IMG/Springnova1.png" alt="Ask AI Module" width="700">
  <p><em>Conversational AI interface handling complex multi-paragraph responses and queries.</em></p>
</div>

<div align="center">
  <img src="./spring-AI-Frontend/src/SpringnovaAI_IMG/Springnova2.png" alt="Image Generator" width="700">
  <p><em>AI Image Generator translating text descriptions into high-resolution visual artwork.</em></p>
</div>

<div align="center">
  <img src="./spring-AI-Frontend/src/SpringnovaAI_IMG/Springnova3.png" alt="Recipe Generator" width="700">
  <p><em>Smart Recipe Generator outputting customized ingredient listings and step-by-step cooking instructions.</em></p>
</div>

---

## Utility Dashboards: Weather, Maps & Activity History

<div align="center">
  <img src="./spring-AI-Frontend/src/SpringnovaAI_IMG/Springnova4.png" alt="Weather Forecast Dashboard" width="700">
  <p><em>Live weather tracking dashboard displaying current meteorological updates and conditions.</em></p>
</div>

<div align="center">
  <img src="./spring-AI-Frontend/src/SpringnovaAI_IMG/Springnova5.png" alt="Live Map Tracker" width="700">
  <p><em>Interactive Live Maps and Tracker providing route mapping, coordinates, and navigation directions.</em></p>
</div>

<div align="center">
  <img src="./spring-AI-Frontend/src/SpringnovaAI_IMG/Springnova6.png" alt="Activity History" width="700">
  <p><em>Activity History logging past prompts, model inputs, and generated AI responses with timestamps.</em></p>
</div>

---

## Project Structure & Architecture

### Frontend Architecture (`spring-AI-Frontend`)
* **`src/components/`**: Modular UI components covering the interactive chat interface, image generator, recipe generator, weather forecast dashboard, live map tracker, activity history, and core layout routers.
* **`src/store/`**: State management containers handling application actions and reducers.
* **`src/SpringnovaAI_IMG/`**: Asset directory storing high-resolution application interface screenshots (`Signin.png`, `Dashboard1.png`, `Dashboard2.png`, `Springnova1.png` to `Springnova6.png`).

### Backend Architecture (`SpringAIBackend`)
* **`com.ai.SpringAIBackend.config`**: Core configuration classes for security and web mappings.
* **`com.ai.SpringAIBackend.controller`**: REST controllers exposing endpoints for generative AI tasks, weather forecasting, map tracking, and user authentication.
* **`com.ai.SpringAIBackend.model`**: JPA Entities and Data Transfer Objects (DTOs) mapping internal database structures.
* **`com.ai.SpringAIBackend.repositories`**: Spring Data JPA interfaces for persistence operations.
* **`com.ai.SpringAIBackend.services`**: Core business logic implementations and AI orchestration services (including Ollama integration and local Whisper JNI audio processing).

---

## Key Features

* **Interactive Conversational AI (`Ask AI`)**: Dynamic chat interface powered locally by large language models via Spring AI and Ollama.
* **AI Image Generator**: Text-to-image creation capabilities for on-demand artwork generation.
* **Smart Recipe Generator**: Tailored culinary recommendations based on available ingredients, cuisine preferences, and dietary restrictions.
* **Audio Transcription**: Local speech-to-text processing using Whisper JNI.
* **Weather Forecast Dashboard**: Real-time city meteorological tracking and weather reporting.
* **Live Map Tracker**: Interactive route and GPS coordinate tracking.
* **Activity History**: Comprehensive logs tracking previous prompts and generated responses.

---

## Tech Stack

* **Frontend**: React.js (Single Page Application), Modular Sidebar Layout, Axios / Fetch API.
* **Backend**: Java 17, Spring Boot 3.3.2, Spring AI (`1.0.0-M1`) with Ollama Starter, Spring Security, Whisper JNI (`io.github.givimad:whisper-jni:1.6.0`).
* **Database & Storage**: MySQL database backend, Spring Data JPA / Hibernate persistence layer.

---

## Getting Started

### Prerequisites
* Node.js & npm (for frontend execution)
* Java Development Kit (JDK 17+)
* Maven
* MySQL Server
* Ollama (running locally with your desired model installed)

### Frontend Setup
1. Navigate to the frontend directory (`spring-AI-Frontend`).
2. Install project dependencies:
   ```bash
   npm install
3. Start the development server:
   ```bash
   npm start

### Backend Setup
1. Navigate to the backend directory (`SpringAIBackend`).
2. Configure your MYSQL database parameters and server configs inside:
     src/main/resources/application.properties.
3. Build and run the Spring Boot application using Maven:
   ```bash
   mvn clean spring-boot:run