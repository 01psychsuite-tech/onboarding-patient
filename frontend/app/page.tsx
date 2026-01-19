"use client"

import { PipecatClient } from "@pipecat-ai/client-js";
import { PipecatClientProvider, usePipecatClient,PipecatClientAudio } from "@pipecat-ai/client-react";
// import { DailyTransport } from "@pipecat-ai/daily-transport";
// import { SmallWebRTCTransport } from "@pipecat-ai/small-webrtc-transport";
import { useEffect, useState } from "react";


function VoiceBot({client}:{client:PipecatClient}) {
  const startConversation = async () => {
    const response = await fetch("http://localhost:7860/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        createDailyRoom: false,
        enableDefaultIceServers: true,
        transport: "webrtc"
      })
    });
    const { sessionId } = await response.json();

    await client.connect({
      webrtcUrl:"http://localhost:7860/sessions/"+sessionId+"/api/offer"
    });
  };
  
  return (
    <button onClick={startConversation}>
      Start Conversation
    </button>
  );
}

export default function Home() {
  const [client, setClient] = useState<PipecatClient | null>(null);

  useEffect(() => {
    import("@pipecat-ai/small-webrtc-transport").then(({ SmallWebRTCTransport }) => {
      const pcClient = new PipecatClient({
        transport: new SmallWebRTCTransport(),
        enableMic: true,
        enableCam: false,
      });
      setClient(pcClient);
    });
  }, []);

  if (!client) return <div>Loading...</div>;

  return (
    <PipecatClientProvider client={client!}>
      <VoiceBot client={client!}/>
      <PipecatClientAudio />
    </PipecatClientProvider>
  );
}
