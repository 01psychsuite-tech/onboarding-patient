# Pipecat Frontend Integration Research

## Overview
Pipecat provides comprehensive frontend SDKs for building voice and multimodal AI applications in React. The integration supports WebRTC-based real-time communication with Daily.co as the primary transport layer.

## Key Components

### 1. Core SDKs
- **@pipecat-ai/client-js**: Core JavaScript client library
- **@pipecat-ai/client-react**: React-specific components and hooks
- **@pipecat-ai/daily-transport**: WebRTC transport using Daily.co infrastructure

### 2. Transport Options
- **DailyTransport**: Production-ready WebRTC transport using Daily.co's global infrastructure
- **SmallWebRTCTransport**: Alternative WebRTC implementation for simpler use cases

## Installation
```bash
npm install @pipecat-ai/client-js
npm install @pipecat-ai/client-react
npm install @pipecat-ai/daily-transport
npm install @pipecat-ai/small-webrtc-transport
```

## Basic React Integration

### Client Setup
```javascript
import { PipecatClient } from "@pipecat-ai/client-js";
import { PipecatClientProvider, usePipecatClient } from "@pipecat-ai/client-react";
import { DailyTransport } from "@pipecat-ai/daily-transport";

// Create client instance
const client = new PipecatClient({
  transport: new DailyTransport(),
  enableMic: true,
  enableCam: false,
  callbacks: {
    onBotConnected: () => console.log("Bot connected"),
    onBotReady: () => console.log("Bot ready to chat"),
    onTransportStateChanged: (state) => console.log("State:", state)
  }
});
```

### Provider Component
```javascript
function App() {
  return (
    <PipecatClientProvider client={client}>
      <VoiceBot />
    </PipecatClientProvider>
  );
}
```

### Voice Bot Component
```javascript
function VoiceBot() {
  const client = usePipecatClient();
  
  const startConversation = async () => {
    await client.startBotAndConnect({
      endpoint: `${process.env.PIPECAT_API_URL || "/api"}/connect`
    });
  };
  
  return (
    <button onClick={startConversation}>
      Start Conversation
    </button>
  );
}
```

## WebRTC Integration with Daily

### Connection Methods
1. **Direct Connection**: Connect to existing Daily room
```javascript
client.connect({
  url: "https://your.daily.co/room",
  token: "your-daily-token"
});
```

2. **Bot-Initiated Connection**: Start bot and get connection details
```javascript
client.startBotAndConnect({
  endpoint: "/api/start" // Returns Daily room URL and token
});
```

### Audio Handling
```javascript
function handleBotAudio(track, participant) {
  if (participant.local || track.kind !== "audio") return;
  
  const audioElement = document.createElement("audio");
  audioElement.srcObject = new MediaStream([track]);
  document.body.appendChild(audioElement);
  audioElement.play();
}
```

## React Hooks and Components

### Microphone Control
```javascript
import { usePipecatClientMicControl } from "@pipecat-ai/client-react";

function MicToggle() {
  const { enableMic, isMicEnabled } = usePipecatClientMicControl();
  
  return (
    <button onClick={() => enableMic(!isMicEnabled)}>
      {isMicEnabled ? "Disable Microphone" : "Enable Microphone"}
    </button>
  );
}
```

### Audio Component
```javascript
import { PipecatClientAudio } from "@pipecat-ai/client-react";

function AudioRenderer() {
  return (
    <PipecatClientAudio 
      onBotAudioReady={(enabled) => console.log("Audio ready:", enabled)}
    />
  );
}
```

## Transport Configuration

### Daily Transport Options
- **Global Infrastructure**: Low-latency, high-quality audio/video streaming
- **Device Management**: Automatic handling of audio/video devices
- **Room Management**: Daily.co room creation and token management
- **WebRTC Handshake**: Automatic peer connection setup

### Server-Side Requirements
- Pipecat server must include `DailyTransport` server-side implementation
- Endpoint for starting bot and returning connection credentials
- Daily.co API key for room creation

## Event Handling

### Available Events
- `onConnected`: User connected to transport
- `onDisconnected`: User disconnected
- `onBotConnected`: Bot joined the session
- `onBotReady`: Bot ready for interaction
- `onTransportStateChanged`: Transport state changes

### Event Listeners
```javascript
client.on(RTVIEvent.Connected, () => {
  console.log("User connected");
});

client.on(RTVIEvent.BotReady, () => {
  console.log("Bot ready for conversation");
});
```

## Production Considerations

### Security
- Use HTTPS for WebRTC connections
- Secure Daily.co room tokens
- Validate bot endpoints

### Performance
- Leverage Daily's global infrastructure
- Optimize audio quality settings
- Handle connection failures gracefully

### Scalability
- Daily.co handles WebRTC infrastructure scaling
- Bot instances can be horizontally scaled
- Load balancing for bot endpoints

## Development Workflow

1. **Setup**: Install SDKs and configure Daily transport
2. **Integration**: Implement React components with Pipecat provider
3. **Connection**: Set up bot endpoint and Daily room management
4. **Testing**: Verify WebRTC connectivity and audio flow
5. **Deployment**: Configure production Daily.co settings

## Resources
- [Pipecat React SDK Documentation](https://docs.pipecat.ai/client/react/introduction)
- [Daily Transport Documentation](https://docs.pipecat.ai/client/js/transports/daily)
- [GitHub Examples](https://github.com/pipecat-ai/pipecat-client-web-transports)