
import React, { useState, useRef } from 'react';
import { generateSovereignAudio, decodeBase64, decodeAudioData } from '../services/geminiService';

interface DominanceProps {
  addLog: (m: string, s?: string) => void;
}

const Dominance: React.FC<DominanceProps> = ({ addLog }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [customDecree, setCustomDecree] = useState('');
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const playDecree = async (text: string, id: string = 'custom') => {
    if (!text || isGenerating) return;
    
    setIsGenerating(true);
    addLog(`>>> [VOICE] SYNTHESIZING DECREE: "${text.substring(0, 40)}..."`, "warning");
    
    const base64Data = await generateSovereignAudio(text);
    
    if (base64Data) {
      try {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        const ctx = audioContextRef.current;
        const audioBytes = decodeBase64(base64Data);
        const audioBuffer = await decodeAudioData(audioBytes, ctx);
        
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        
        setActiveAudioId(id);
        source.start();
        source.onended = () => {
          setActiveAudioId(null);
          setIsGenerating(false);
          addLog(`>>> [VOICE] SIGNAL DELIVERED TO ALL SECTORS`, "info");
        };
      } catch (err) {
        console.error("AUDIO_PLAYBACK_ERROR", err);
        setIsGenerating(false);
      }
    } else {
      addLog(">>> [VOICE] FAILURE: TTS ENGINE NOT RESPONDING", "critical");
      setIsGenerating(false);
    }
  };

  const presets = [
    { id: 'p1', title: '🚨 ประกาศเก็บมือถือ (Sovereign Force)', text: 'ประกาศสำคัญจากศูนย์บัญชาการมหาธรรมนูญ ถึงวินมอเตอร์ไซค์และรถตุ๊กตุ๊กทุกท่านในเขตอยุธยา ถึงเวลาทำงานแล้ว กรุณาฝากมือถือไว้ที่จุดพักพลังงานทันที หากพบการฝ่าฝืน ระบบจะตัดแต้มมหาลาภของท่านร้อยเปอร์เซ็นต์ มือทำงาน ตาดูยอด ปากห้ามบ่น ผลคือรวย!' },
    { id: 'p2', title: '📢 ข้อความประกาศวินัย (Daily Protocol)', text: 'วินัยคือบ่อเกิดแห่งความมั่งคั่ง ใครซื่อสัตย์ต่อเวลา ระบบจะมอบรางวัลอย่างงาม ใครเกียจคร้าน อยุธยาจักไม่ต้องการท่าน จงรักษาความสัตย์ซื่อต่ออาชีพของท่านให้ถึงที่สุด' },
    { id: 'p3', title: '💎 พิธีมอบรางวัล MVP (Victory Cry)', text: 'ยินดีกับผู้ได้รับรางวัลยอดเยี่ยมประจำสัปดาห์ ท่านได้พิสูจน์แล้วว่าความขยันนำมาซึ่งความรวย แต้มมหาลาภระดับไดมอนด์ได้ถูกโอนเข้าบัญชีของท่านแล้ว จงรักษามาตรฐานนี้ไว้เพื่อความรุ่งเรืองของตระกูลธรรม' }
  ];

  return (
    <div className="space-y-12 animate-in slide-in-from-bottom duration-1000">
      
      {/* MASTER VOICE INPUT - ศูนย์ควบคุมเสียง */}
      <div className="bg-red-900/10 border border-red-900/40 p-16 rounded-[60px] relative overflow-hidden backdrop-blur-3xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-red-600/20 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-red-900/10 blur-[150px] rounded-full" />
        
        <div className="relative z-10">
          <div className="flex justify-between items-end mb-10">
             <div>
                <h2 className="text-5xl font-black text-white uppercase tracking-tighter mb-4">🔊 SOVEREIGN VOICE DECREE</h2>
                <p className="text-neutral-500 text-sm uppercase tracking-[0.5em] font-black">Direct strategic audio broadcast to all Ayutthaya sectors</p>
             </div>
             <div className="flex gap-4 items-center mb-2">
                <span className="text-[11px] font-black text-red-900 uppercase tracking-widest">Signal Status:</span>
                <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase border ${activeAudioId ? 'bg-red-600 border-red-500 text-white animate-pulse' : 'bg-black border-neutral-800 text-neutral-600'}`}>
                   {activeAudioId ? 'LIVE_BROADCASTING' : 'READY_TO_TRANSMIT'}
                </span>
             </div>
          </div>
          
          <div className="flex gap-8">
            <div className="flex-1 relative">
              <textarea 
                value={customDecree}
                onChange={(e) => setCustomDecree(e.target.value)}
                placeholder="พิมพ์คำสั่งมหาธรรมนูญที่ต้องการให้ Agent ประกาศก้องอยุธยา..."
                className="w-full bg-black/80 border-2 border-neutral-800 p-10 rounded-[40px] text-2xl font-medium text-neutral-100 focus:border-red-700 outline-none transition-all h-56 custom-scrollbar font-heading italic shadow-inner placeholder:opacity-30"
              />
              <div className="absolute bottom-6 right-8 text-[11px] text-neutral-700 font-black uppercase tracking-widest">
                Master Input Authority: Ayutthaya_Supreme
              </div>
            </div>
            
            <button 
              onClick={() => playDecree(customDecree)}
              disabled={isGenerating || !customDecree}
              className={`w-64 rounded-[40px] font-black text-sm uppercase tracking-[0.3em] flex flex-col items-center justify-center gap-6 transition-all duration-500 group relative ${
                isGenerating 
                  ? 'bg-neutral-800 opacity-50 cursor-not-allowed' 
                  : 'bg-gradient-to-br from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 text-white shadow-[0_20px_50px_rgba(185,28,28,0.4)] hover:scale-[1.05] active:scale-[0.98]'
              }`}
            >
              {isGenerating ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                  <span className="text-[10px] text-white animate-pulse">Encoding...</span>
                </div>
              ) : (
                <>
                  <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-all shadow-inner">
                    <span className="text-6xl">🎤</span>
                  </div>
                  <span>Transmit Decree</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-10">
        {/* AUDIO LIBRARY - คลังสัญญาณเสียง */}
        <div className="col-span-8 bg-neutral-900/40 p-12 rounded-[50px] border border-neutral-800 backdrop-blur-2xl shadow-xl">
          <div className="flex justify-between items-center mb-12 border-b border-neutral-800 pb-8">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">📜 Strategic Preset Library</h2>
            <div className="flex gap-4">
               <button className="text-[11px] font-black text-neutral-600 hover:text-white transition-colors uppercase tracking-widest">Update Presets</button>
               <button className="text-[11px] font-black text-neutral-600 hover:text-white transition-colors uppercase tracking-widest">Cloud Sync</button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {presets.map((p) => (
              <div 
                key={p.id}
                onClick={() => playDecree(p.text, p.id)}
                className={`group flex items-center justify-between p-10 rounded-[35px] border transition-all duration-500 cursor-pointer ${
                  activeAudioId === p.id 
                    ? 'bg-red-900/20 border-red-600 shadow-[0_0_50px_rgba(185,28,28,0.2)]' 
                    : 'bg-black/60 border-neutral-800 hover:border-red-900/40 hover:translate-x-3 shadow-lg'
                }`}
              >
                <div className="flex items-center gap-10 flex-1">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 ${
                    activeAudioId === p.id ? 'bg-red-600 shadow-[0_0_30px_red]' : 'bg-neutral-900 group-hover:bg-red-950 shadow-inner'
                  }`}>
                    <span className={`text-white text-2xl transition-transform duration-500 ${activeAudioId === p.id ? 'scale-125' : 'group-hover:scale-110'}`}>
                       {activeAudioId === p.id ? '⏸' : '▶'}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-white mb-2 group-hover:text-red-500 transition-colors uppercase tracking-tight">{p.title}</h4>
                    <p className="text-[11px] text-neutral-600 font-black uppercase tracking-[0.4em]">Protocol: Master_Authority_Voice</p>
                  </div>
                </div>
                
                {activeAudioId === p.id ? (
                  <div className="flex gap-2 h-10 items-end">
                    {[1,2,3,4,5,6,7,8].map(i => (
                      <div key={i} className="w-1.5 bg-red-600 animate-pulse" style={{ height: `${30 + Math.random() * 70}%`, animationDelay: `${i * 0.1}s` }} />
                    ))}
                  </div>
                ) : (
                  <span className="text-[11px] text-neutral-800 font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Select Sourse</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* FIELD AUDIT ACCESS - ทางเข้าการตรวจสอบจริง */}
        <div className="col-span-4 flex flex-col gap-10">
          <div className="bg-black border border-neutral-800 p-12 rounded-[50px] flex flex-col items-center text-center shadow-2xl relative group overflow-hidden">
            <div className="absolute inset-0 bg-red-900/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <h3 className="text-xl font-black text-red-700 uppercase mb-10 tracking-[0.4em]">Real-time Audit Sync</h3>
            <div className="bg-white p-10 rounded-[45px] shadow-[0_0_100px_rgba(185,28,28,0.2)] mb-10 transform transition-all duration-700 group-hover:scale-105 group-hover:rotate-1">
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://sovereign.trakultham.ayu/audit-portal&color=b91c1c" 
                alt="Field Audit QR"
                className="w-56 h-56"
              />
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed font-black uppercase tracking-[0.2em]">
               Install in physical field sectors for
               <br/><span className="text-white text-sm">INSTANT DISCIPLINE ENFORCEMENT</span>
            </p>
            <div className="mt-8 pt-8 border-t border-neutral-900 w-full flex justify-center gap-4">
               <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
               <span className="text-[10px] text-neutral-700 font-bold uppercase tracking-widest">Link Active</span>
            </div>
          </div>

          <div className="bg-neutral-900/60 border border-neutral-800 p-12 rounded-[50px] flex-1 flex flex-col justify-center relative overflow-hidden backdrop-blur-xl">
             <div className="absolute top-0 left-0 w-full h-1 bg-red-900/20" />
             <h4 className="text-[12px] font-black text-neutral-600 uppercase mb-10 text-center tracking-[0.5em]">Identity Authentication</h4>
             <div className="flex justify-around items-center">
                <div className="flex flex-col items-center gap-6 group cursor-pointer">
                  <div className="text-7xl group-hover:scale-125 group-hover:-rotate-6 transition-all duration-500 filter drop-shadow-[0_0_15px_rgba(185,28,28,0.3)]">🌶️</div>
                  <p className="text-[12px] font-black text-red-600 uppercase tracking-widest">PHU-HIRAN</p>
                </div>
                <div className="w-[2px] h-20 bg-neutral-800" />
                <div className="flex flex-col items-center gap-6 group cursor-pointer">
                  <div className="text-7xl group-hover:scale-125 group-hover:rotate-6 transition-all duration-500 filter drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]">🫚</div>
                  <p className="text-[12px] font-black text-yellow-600 uppercase tracking-widest">PRA-TUAN</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dominance;
