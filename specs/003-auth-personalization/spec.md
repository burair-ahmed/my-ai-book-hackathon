# Functional Specification: Auth & Personalization

## Overview
Implement a secure authentication system for the AI Robotics Book using Better Auth (integrated with Neon). This system will not only protect user sessions but also collect user background information (hardware/software) to personalize the AI assistant's responses and the overall learning journey.

## User Scenarios

### Scenario 1: New User Onboarding
A user visits the book and wants to interact with the personalized chatbot. They are prompted to sign up. During sign-up, they answer 2-3 questions about their experience level (e.g., "Do you have a background in C++?", "Have you worked with Arduino/ROS 2?").

### Scenario 2: Personalized Chat
A signed-in user asks, "How do I implement a PID controller?". The chatbot, knowing the user has an Arduino/C++ background, provides code snippets tailored for the Arduino IDE rather than a generic Python script.

## Functional Requirements

### 1. Authentication
- **Provider**: Better Auth with Neon Auth backend.
- **Methods**: Email/Password for the initial version.
- **Session Management**: Persistent sessions across browser refreshes.

### 2. Personalization Profile
- **Storage**: Store user metadata (software/hardware background) in a dedicated table in Neon Postgres.
- **Data Collection**: A multi-step sign-up form or a post-signup onboarding wizard.
- **Updateable**: Users can update their background profile from their user settings.

### 3. AI Personalization
- **Context Injection**: The `API_URL/api/chat` endpoint must fetch the user's background from the database and inject it as a "System Instruction" to the Gemini model.

## UI/UX Design
- **Theme**: Stick to the "Glassmorphism" aesthetic.
- **Prompt**: A subtle "Sign In to Personalize Experience" banner or floating button if not authenticated.
