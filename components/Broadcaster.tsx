
import React, { useState } from 'react';
import { generateBroadcastScript } from '../services/geminiService';
import { SLOGAN } from '../constants';

interface BroadcasterProps {
  addLog: (m: string, s?: string) => void;
}

const Broadcaster: React.FC<BroadcasterProps> = ({ addLog }) => {
  const [topic, setTopic] = useState('');
  const [type, setType] = useState('The Pulse Bot (LINE/OpenChat)');
  const [script, setScript] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [history, setHistory] = useState<{id: string, t: string, topic: string, type: string}[]>([]);

  const handleGenerate = async () => {
    if (!topic) return;
    setIsLoading(true);
    setStatus("วิเคราะห์กลุ่มเป้าหมายในพื้นที่อยุธยา...");
    addLog(`GENERATING_BROADCAST: ${topic}`, "info");
    const result = await generateBroadcastScript(topic, type);
    setScript(result);
    setIsLoading(false);
    setStatus(null);
  };

  const simulateTransmit = () => {
    setStatus("กำลังเข้ารหัสสัญญาณกระจายเสียง...");
    setTimeout(() => {
      setStatus("ส่งสัญญาณ Pulse ไปยังเครือข่าย OpenChat สำเร็จ!");
      addLog(`SIGNAL_TRANSMITTED: ${topic} (${type})`, "info");
      setHistory(prev => [{ id: Date.now().toString(), t: new Date().toLocaleTimeString(), topic, type }, ...prev].slice(0, 10));
      setTimeout(() => setStatus(null), 3000);
    }, 2000);
  };

  return (
    <div className="grid grid-cols-12 gap-6 animate-in slide-in-from-right duration-700">
      <div className="col-span-4 space-y-6">
        <div className="bg-neutral-900/50 p-8 rounded-3xl border border-neutral-800 shadow-2xl backdrop-blur-sm">
          <h2 className="text-2xl font-black text-white mb-6 uppercase flex items-center gap-3 tracking-tighter">
            <span className="text-red-600">📡</span> Transmitter Config
          </h2>
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest block mb-2">Target Sector / Location</label>
              <input 
                type="text" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="เช่น วินหน้าโรจนะประตู 4"
                className="w-full bg-black border border-neutral-800 p-4 rounded-xl text-lg text-neutral-200 focus:border-red-600 outline-none transition-all font-heading"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest block mb-2">Transmission Mode</label>
              <select 
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-black border border-neutral-800 p-4 rounded-xl text-sm text-neutral-200 focus:border-red-600 outline-none cursor-pointer"
              >
                <option>The Pulse Bot (LINE/OpenChat)</option>
                <option>Viral Command (TikTok Script)</option>
                <option>Geo-Fencing (Localized Ads)</option>
                <option>PA System (Physical Audio)</option>
              </select>
            </div>
            <button 
              onClick={handleGenerate}
              disabled={isLoading || !topic}
              className="w-full bg-red-800 hover:bg-red-700 text-white font-black py-5 rounded-2xl text-sm uppercase tracking-widest transition-all disabled:opacity-30 shadow-lg"
            >
              {isLoading ? (
                 <div className="flex items-center justify-center gap-3">
                   <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                   Generating...
                 </div>
              ) : '⚡ Compute Sovereign Directive'}
            </button>
          </div>
        </div>

        {/* Transmission History */}
        <div className="bg-black border border-neutral-800 p-6 rounded-3xl flex-1 h-64 flex flex-col overflow-hidden">
           <h4 className="text-[10px] font-black text-neutral-600 uppercase mb-4 tracking-widest">Recent Transmissions</h4>
           <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
              {history.length > 0 ? history.map(h => (
                <div key={h.id} className="p-3 bg-neutral-900/40 rounded-xl border border-neutral-800">
                  <p className="text-[10px] font-black text-white">{h.topic}</p>
                  <p className="text-[8px] text-red-900 uppercase font-black">{h.type} | {h.t}</p>
                </div>
              )) : (
                <div className="h-full flex items-center justify-center opacity-10">
                  <p className="text-[10px] font-black uppercase tracking-widest">No Logs Yet</p>
                </div>
              )}
           </div>
        </div>

        {status && (
          <div className="bg-black border border-green-900/50 p-5 rounded-2xl text-center shadow-[0_0_20px_rgba(34,197,94,0.1)]">
            <p className="text-[11px] text-green-500 font-black animate-pulse uppercase tracking-widest">{status}</p>
          </div>
        )}
      </div>

      <div className="col-span-8">
        <div className="bg-black border border-neutral-800 rounded-3xl h-full flex flex-col overflow-hidden shadow-2xl relative">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-red-600/30 animate-scan z-10" />
          <div className="bg-neutral-900 p-5 flex justify-between items-center border-b border-neutral-800 relative z-20">
            <div>
              <h3 className="text-sm font-black uppercase text-neutral-400 tracking-widest">Broadcast Output Buffer</h3>
              <p className="text-[8px] text-neutral-600">Generated by Gemini 3 Flash v1.2</p>
            </div>
            {script && (
              <button 
                onClick={simulateTransmit} 
                className="text-[10px] bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-full font-black uppercase tracking-widest transition-all shadow-lg hover:scale-105 active:scale-95"
              >
                Transmit Protocol X
              </button>
            )}
          </div>
          <div className="flex-1 p-12 overflow-y-auto custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] relative z-20">
            {script ? (
              <div className="text-3xl font-medium text-neutral-100 italic leading-[1.6] whitespace-pre-wrap font-heading drop-shadow-lg">
                {script}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-10">
                <span className="text-9xl mb-6">📜</span>
                <p className="font-black uppercase tracking-[0.5em] text-xl">Waiting for Directive Input</p>
              </div>
            )}
          </div>
          <div className="p-6 bg-neutral-900/50 border-t border-neutral-800 text-center relative z-20">
            <p className="text-2xl font-black text-red-900 tracking-[0.4em] uppercase italic opacity-40">"{SLOGAN}"</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Broadcaster;
