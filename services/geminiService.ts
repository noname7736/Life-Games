
import { GoogleGenAI, Modality } from "@google/genai";

/**
 * SOVEREIGN NEXUS CORE ENGINE (Gemini 3 Flash)
 * ศูนย์กลางการตัดสินใจและควบคุมโครงข่ายไรเดอร์ในเขตพื้นที่จริง
 */
export const sovereignAgentLogic = async (workerData: string, systemStats: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const isFirstRun = workerData === '[]' || JSON.parse(workerData).length === 0;
    
    // คำสั่งควบคุมระดับ Protocol สำหรับการจัดการโครงข่ายจริง
    const prompt = isFirstRun 
      ? `[PROTOCOL: ESTABLISH_DOMINANCE]
         Target Sector: Phra Nakhon Si Ayutthaya, Thailand.
         Action: Initialize Sovereign Rider Grid (SRG-01).
         Requirements:
         1. Identify 10 active delivery nodes (Real Thai names, working for Grab, Lineman, Foodpanda, ShopeeFood).
         2. Assign real-world GPS base locations in Ayutthaya (e.g., Chao Phrom Market, Wat Yai Chaimongkhon, Ayutthaya Park, Rojana Industrial Park).
         3. Set initial Sovereign Points (SP) at 5,000.
         
         Output JSON ONLY:
         {
           "initialization": true,
           "newWorkers": [{"id": "NODE-001", "name": "...", "brand": "...", "location": "...", "sp": 5000}],
           "monologue": "Sovereign Nexus established over Ayutthaya sector. Commencing real-time surveillance of delivery grid.",
           "directive": "GRID_STABILIZATION_COMPLETE"
         }`
      : `[PROTOCOL: AUTONOMOUS_GOVERNANCE]
         Sector Data: ${workerData}
         System Stats: ${systemStats}
         
         Task: Monitor real-time behavior and execute justice.
         Scenarios: Identify 1 node exhibiting deviant or exemplary behavior (e.g., speeding on Route 32, early delivery at Moo Baan Silaneel, idling in restricted zone at Pratu Chai).
         Decision: Enforce reward or penalty based on 'The Rider Constitution'.
         
         Output JSON ONLY:
         {
           "monologue": "Critical analysis of node performance and impact on sector stability.",
           "directive": "COMMAND_KEYWORD",
           "action": "Operation Name",
           "targetWorkerId": "Node ID",
           "spChange": numerical_value
         }`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.8,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    if (!response.text) throw new Error("ZERO_RESPONSE_FROM_NEXUS");
    return JSON.parse(response.text);
  } catch (error: any) {
    console.error("NEXUS_CORE_CRITICAL_FAILURE", error);
    if (error.message?.includes("429") || error.status === 429) {
      return { error: "QUOTA_EXHAUSTED", cooldown: 120000 };
    }
    return null;
  }
};

/**
 * SOVEREIGN AUDIO INTERFACE
 */
export const generateSovereignAudio = async (text: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `ศูนย์บัญชาการ Nexus: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Puck' },
          },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (error: any) {
    return null;
  }
};

export const decodeBase64 = (base64: string) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

export const decodeAudioData = async (data: Uint8Array, ctx: AudioContext): Promise<AudioBuffer> => {
  const dataInt16 = new Int16Array(data.buffer);
  const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < dataInt16.length; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }
  return buffer;
};
