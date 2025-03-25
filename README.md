# Pipecat Cloud Vision Bot

A web-based user interface for interacting with a Pipecat Cloud Vision Bot using React, Next.js, and the Pipecat React SDK.

## Project Overview

This application enables a visual conversation with an AI-powered vision bot. Users can interact with an AI assistant that processes and responds to visual input in real-time using Pipecat Cloud by Daily for backend services.

## Tech Stack

- **Frontend**: Next.js with React and TypeScript
- **UI Framework**: Tailwind CSS, ShadCN components
- **Camera Integration**: WebRTC-based custom camera hook
- **Backend Service**: Pipecat Cloud by Daily
- **SDK/Packages**:
  - `@pipecat-ai/client-js`
  - `@pipecat-ai/client-react`
  - `@pipecat-ai/daily-transport`

## Development Plan

### Stage 1: Project Setup ✅

- [x] Initialize Next.js Project
- [x] Install Dependencies
- [x] Set up Environment Variables

### Stage 2: Core UI Structure (In Progress)

- [x] Create Basic Layout
- [x] Implement Camera Component
- [ ] Create Pipecat Client Provider

### Stage 3: Pipecat SDK Integration

- [ ] Establish Connection
- [ ] Implement Camera Stream Handling
- [ ] Implement Basic Interaction Controls

### Stage 4: Camera Integration Details

- [ ] Analyze the dailyco-camera-3-18-25 repository
- [ ] Adapt Camera Component
- [ ] Implement Rear Camera Functionality

### Stage 5: Testing and Refinement

- [ ] Local Testing
- [ ] Pipecat Cloud Integration Testing
- [ ] Iterate and Refine

## Current Implementation

The project currently includes:

1. **Basic UI Components**:
   - Welcome screen
   - Camera feed
   - Status bar
   - Controls
   - Caption display

2. **Custom Hooks**:
   - `useCustomCamera`: For camera access and management
   - `useSessionTimer`: For tracking session duration
   - `useAudioLevels`: For audio processing

3. **Core Application Flow**:
   - User welcome and permissions
   - Camera setup
   - Connection handling

## TODO Priorities

1. **Integrate Pipecat Client SDK**:
   - Set up RTVIClient provider context
   - Implement connection with Pipecat backend

2. **Connect Camera to Pipecat**:
   - Ensure the camera component works with Pipecat React SDK
   - Ensure rear camera selection functions properly

3. **Implement Real-time Communication**:
   - Set up message handling for the Vision Bot
   - Implement real-time captioning based on bot responses

## Important Resources

- [Pipecat Documentation](https://docs.pipecat.ai/client/)
- [Pipecat React SDK Documentation](https://docs.pipecat.ai/client/react/introduction)
- [Pipecat React SDK Components](https://docs.pipecat.ai/client/react/components)
- [Pipecat React SDK Hooks](https://docs.pipecat.ai/client/react/hooks)
- [Pipecat Client Web Repository](https://github.com/pipecat-ai/pipecat-client-web)
- [Daily Bots Web Demo](https://vision.dailybots.ai/)
- [Daily Bots Web Demo Repository](https://github.com/daily-demos/daily-bots-web-demo/tree/khk/vision-for-launch)
- [Camera Component Reference](https://github.com/Rob-24-ai/dailyco-camera-3-18-25)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with the required environment variables:
   ```
   PIPECAT_API_URL=your_api_url
   # Add any other required variables
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Configuration

For Pipecat SDK configuration, you'll need to:

1. Set up a Pipecat Cloud account
2. Configure your Vision Bot on Pipecat Cloud
3. Obtain necessary API keys and endpoints
4. Update the environment variables accordingly

## Contributing

Please follow the staged development approach outlined in the Development Plan and ensure all changes are properly tested before submitting.
