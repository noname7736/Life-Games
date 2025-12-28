
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { KernelStatus, SystemState, AgentThought, Worker, AuditEntry } from './types';
import { sovereignAgentLogic, generateSovereignAudio, decodeBase64, decodeAudioData } from './services/geminiService';
import { SLOGAN, CONSTITUTION_DIRECTIVES } from './constants';
import { BarChart, Bar, Tooltip, ResponsiveContainer, Cell, YAxis } from 'recharts';

const DEPLOYMENT_CYCLE = 60000; // รอบการทำงาน 60 วินาทีเพื่อความเสถียรของ API

const App: React.FC = () => {
  const [workers, setWorkers] = useState<Worker[]>(() => JSON.parse(localStorage.getItem('nexus_v4_workers') || '[]'));
  const [auditLog, setAuditLog] = useState<AuditEntry[]>(() => JSON.parse(localStorage.getItem('nexus_v4_audit') || '[]'));
  const [state, setState] = useState<SystemState>(() => JSON.parse(localStorage.getItem('nexus_v4_state') || JSON.stringify({
    kernel: KernelStatus.INITIALIZING, uptime: 0, totalDirectives: 0, sovereignPoints: 5000000, networkIntegrity: 100
  })));

  const [thought, setThought] = useState<AgentThought | null>(null);
  const [logs, setLogs] = useState<{t: string, m: string, c: string}[]>([]);
  const [ticker, setTicker] = useState(0);
  const [isCooldown, setIsCooldown] = useState(false);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [isSystemActive, setIsSystemActive] = useState(false);
  const audioCtx = useRef<AudioContext | null>(null);

  // Persistence Engine
  useEffect(() => {
    localStorage.setItem('nexus_v4_workers', JSON.stringify(workers));
    localStorage.setItem('nexus_v4_audit', JSON.stringify(auditLog));
    localStorage.setItem('nexus_v4_state', JSON.stringify(state));
  }, [workers, auditLog, state]);

  const addLog = useCallback((m: string, c: string = 'text-neutral-500') => {
    setLogs(p => [{ t: new Date().toLocaleTimeString(), m, c }, ...p].slice(0, 60));
  }, []);

  const runCommandCycle = async () => {
    if (isCooldown || !isSystemActive) return;

    setState(p => ({ ...p, kernel: KernelStatus.THINKING }));
    addLog(">>> [COMMAND] ANALYZING AYUTTHAYA GRID TELEMETRY...", "text-yellow-600");
    
    const response = await sovereignAgentLogic(JSON.stringify(workers), JSON.stringify(state));
    
    if (response?.error === "QUOTA_EXHAUSTED") {
      const wait = response.cooldown || 120000;
      setIsCooldown(true);
      setCooldownRemaining(Math.ceil(wait / 1000));
      addLog(`>>> [CRITICAL] API LIMIT REACHED. REFRESHING IN ${wait/1000}s`, "text-red-600");
      return;
    }

    if (response) {
      if (response.initialization && response.newWorkers) {
        const batch = response.newWorkers.map((w: any) => ({
          id: w.id, name: w.name, ap: 100, sp: w.sp, rank: 'Gold', status: 'Active', notes: `${w.brand} @ ${w.location}`
        }));
        setWorkers(batch);
        addLog(`>>> [NEXUS] GRID ESTABLISHED. 10 ACTIVE NODES CONNECTED`, "text-green-500");
        announce(response.monologue);
      }

      if (response.targetWorkerId) {
        const target = workers.find(w => w.id === response.targetWorkerId);
        if (target) {
          setWorkers(p => p.map(w => w.id === response.targetWorkerId ? { ...w, sp: Math.max(0, w.sp + response.spChange) } : w));
          
          setThought({
            id: `TX-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString(),
            monologue: response.monologue,
            directive: response.directive,
            action: response.action
          });

          announce(`${response.directive}. ${response.monologue}`);

          setAuditLog(p => [{
            id: `AUD-${Date.now()}`,
            timestamp: new Date().toLocaleString(),
            workerId: response.targetWorkerId,
            workerName: target.name,
            type: response.spChange >= 0 ? 'REWARD' : 'PENALTY',
            amount: response.spChange,
            reason: response.monologue
          }, ...p].slice(0, 100));

          setState(p => ({ 
            ...p, 
            sovereignPoints: p.sovereignPoints + response.spChange,
            totalDirectives: p.totalDirectives + 1 
          }));

          addLog(`>>> [NEXUS_DECISION] ${response.action} EXECUTED ON ${target.name}`, response.spChange < 0 ? "text-red-500" : "text-green-500");
        }
      }
    }
    setTimeout(() => setState(p => ({ ...p, kernel: KernelStatus.STABLE })), 4000);
  };

  useEffect(() => {
    if (!isSystemActive) return;
    const interval = setInterval(runCommandCycle, DEPLOYMENT_CYCLE);
    runCommandCycle();
    return () => clearInterval(interval);
  }, [workers.length, isCooldown, isSystemActive]);

  useEffect(() => {
    if (isCooldown && cooldownRemaining > 0) {
      const timer = setInterval(() => setCooldownRemaining(r => r - 1), 1000);
      if (cooldownRemaining <= 1) setIsCooldown(false);
      return () => clearInterval(timer);
    }
  }, [isCooldown, cooldownRemaining]);

  const announce = async (text: string) => {
    try {
      const base64 = await generateSovereignAudio(text);
      if (base64) {
        if (!audioCtx.current) audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const ctx = audioCtx.current;
        if (ctx.state === 'suspended') await ctx.resume();
        const buffer = await decodeAudioData(decodeBase64(base64), ctx);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start();
      }
    } catch (e) {
      console.warn("Nexus Audio Transmission Failed");
    }
  };

  useEffect(() => {
    const t1 = setInterval(() => setState(p => ({ ...p, uptime: p.uptime + 1 })), 1000);
    const t2 = setInterval(() => setTicker(p => (p + 1) % CONSTITUTION_DIRECTIVES.length), 5000);
    return () => { clearInterval(t1); clearInterval(t2); };
  }, []);

  // System Activation UI
  if (!isSystemActive) {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center text-[#d4af37] font-mono p-10 cursor-crosshair">
        <div className="w-96 h-96 border-4 border-[#d4af37] rounded-full flex flex-col items-center justify-center gap-6 animate-pulse shadow-[0_0_100px_rgba(212,175,55,0.2)]">
          <span className="text-8xl">👁️</span>
          <h1 className="text-2xl font-black uppercase tracking-[0.5em]">Nexus Override</h1>
        </div>
        <button 
          onClick={() => {
            setIsSystemActive(true);
            if (!audioCtx.current) audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
          }}
          className="mt-20 px-12 py-6 bg-[#d4af37] text-black font-black text-xl uppercase tracking-[1em] hover:bg-white hover:scale-110 transition-all shadow-[0_0_50px_rgba(212,175,55,0.4)]"
        >
          Activate Governance
        </button>
        <p className="mt-10 text-[10px] opacity-30 uppercase tracking-[0.5em] font-black">Authorized Personnel Only • Ayutthaya Sector</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black text-[#d4af37] font-mono flex flex-col border-[12px] border-neutral-900 overflow-hidden cursor-none select-none">
      
      {/* HEADER: GLOBAL STATUS */}
      <div className={`h-10 flex items-center overflow-hidden border-b border-black transition-colors duration-700 ${isCooldown ? 'bg-orange-950' : 'bg-red-950'}`}>
        <div className="bg-black text-white px-10 h-full flex items-center font-black italic text-[11px] animate-pulse uppercase tracking-tighter shadow-2xl">Nexus_v4.1_Deployed</div>
        <div className="flex-1 px-6 text-white text-[10px] font-black whitespace-nowrap overflow-hidden tracking-[0.5em] uppercase italic">
           {isCooldown ? `⚠️ SECURITY RECOVERY IN PROGRESS: ${cooldownRemaining}s` : CONSTITUTION_DIRECTIVES[ticker]}
        </div>
        <div className="bg-black text-yellow-500 px-10 h-full flex items-center font-black text-[10px] tracking-[0.3em]">NODE: AYU_SUPREME</div>
      </div>

      {/* CORE COMMAND VIEW */}
      <main className="flex-1 grid grid-cols-12 gap-10 p-12 relative">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className={`absolute top-0 left-0 w-full h-1 animate-scan z-50 shadow-[0_0_50px] ${isCooldown ? 'bg-orange-500 shadow-orange-500' : 'bg-red-700 shadow-red-700'}`} />

        {/* LEFT: REASONING & ANALYSIS */}
        <div className="col-span-8 flex flex-col gap-10">
          <section className="flex-1 bg-neutral-950 border border-neutral-800 rounded-[80px] p-24 relative flex flex-col justify-center overflow-hidden shadow-[inset_0_0_200px_rgba(0,0,0,1)]">
            <div className="absolute top-12 right-16 flex items-center gap-8">
              <span className="text-[11px] text-neutral-800 font-black tracking-[2em] uppercase">Core Heartbeat</span>
              <div className={`w-5 h-5 rounded-full ${isCooldown ? 'bg-orange-900 animate-pulse' : state.kernel === KernelStatus.THINKING ? 'bg-yellow-500 animate-ping shadow-[0_0_30px_yellow]' : 'bg-red-800 shadow-[0_0_20px_red]'}`} />
            </div>

            {isCooldown ? (
              <div className="text-center space-y-16">
                 <h2 className="text-6xl font-black text-orange-700 uppercase tracking-[0.5em] animate-pulse">System Overload</h2>
                 <p className="text-2xl text-neutral-600 max-w-3xl mx-auto italic font-heading leading-relaxed">"ระบบความปลอดภัยขั้นสูงกำลังประมวลผลการเชื่อมต่อใหม่ กรุณารอสักครู่เพื่อให้ Nexus กลับสู่สภาวะปกครอง..."</p>
                 <div className="w-full h-3 bg-neutral-900 rounded-full overflow-hidden max-w-2xl mx-auto">
                    <div className="h-full bg-orange-600 transition-all duration-1000 linear" style={{ width: `${(cooldownRemaining / 120) * 100}%` }} />
                 </div>
              </div>
            ) : thought ? (
              <div className="space-y-14 animate-in fade-in slide-in-from-bottom-24 duration-1000">
                <div className="flex items-center gap-6 mb-4">
                   <div className="w-16 h-[3px] bg-red-900" />
                   <h2 className="text-xs font-black text-red-900 uppercase tracking-[2.5em]">Nexus Intelligence Trace</h2>
                </div>
                <p className="text-7xl font-light text-neutral-50 font-heading italic leading-[1.05] tracking-tight max-w-6xl">
                  "{thought.monologue}"
                </p>
                <div className="bg-neutral-900/40 p-16 rounded-[60px] border-l-[25px] border-red-800 shadow-2xl backdrop-blur-xl group">
                   <span className="text-xs text-red-800 font-black uppercase tracking-[1.5em] mb-6 block group-hover:animate-pulse">Active Execution Decree</span>
                   <h3 className="text-8xl font-black text-white uppercase tracking-tighter leading-none italic">{thought.directive}</h3>
                   <div className="mt-8 pt-8 border-t border-neutral-800 flex justify-between items-center opacity-30">
                      <span className="text-[10px] font-black tracking-widest uppercase">Target: {thought.action}</span>
                      <span className="text-[10px] font-black tracking-widest uppercase">{thought.timestamp}</span>
                   </div>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-14 opacity-20">
                 <div className="text-[15rem] animate-pulse">🏛️</div>
                 <p className="text-4xl font-black uppercase tracking-[1.5em] text-neutral-800 animate-pulse">Monitoring Ayutthaya Grid...</p>
                 <div className="flex justify-center gap-4">
                    {[1,2,3,4,5,6].map(i => <div key={i} className="w-3 h-3 bg-neutral-900 rounded-full animate-bounce" style={{animationDelay: `${i*0.1}s`}} />)}
                 </div>
              </div>
            )}
          </section>

          {/* ASSET DISTRIBUTION VIZ */}
          <div className="h-[360px] grid grid-cols-2 gap-10">
            <div className="bg-neutral-950 border border-neutral-800 rounded-[60px] p-14 flex flex-col shadow-2xl">
              <h4 className="text-[11px] font-black text-neutral-700 uppercase mb-12 tracking-[1.5em] border-b border-neutral-900 pb-6">Asset Power Distribution (SP)</h4>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={workers}>
                    <YAxis hide />
                    <Tooltip contentStyle={{backgroundColor:'#000', border:'1px solid #444', borderRadius:'25px', padding:'20px'}} itemStyle={{color:'#d4af37', fontSize:'12px', fontWeight:'900'}} />
                    <Bar dataKey="sp" radius={[12, 12, 0, 0]} barSize={20}>
                      {workers.map((e, i) => <Cell key={i} fill={e.sp > 5000 ? '#d4af37' : '#7f1d1d'} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-neutral-950 border border-neutral-800 rounded-[60px] p-14 overflow-hidden flex flex-col shadow-2xl">
              <h4 className="text-[11px] font-black text-neutral-700 uppercase mb-12 tracking-[1.5em] border-b border-neutral-900 pb-6">Supreme Audit Ledger</h4>
              <div className="flex-1 overflow-y-auto space-y-6 custom-scrollbar pr-8">
                {auditLog.map(a => (
                  <div key={a.id} className="text-[11px] border-b border-neutral-900 pb-6 flex justify-between items-start group">
                    <div className="max-w-[75%]">
                      <span className="text-red-900 font-black tracking-[0.3em] uppercase block mb-2">{a.workerName}</span>
                      <p className="text-neutral-500 italic leading-relaxed group-hover:text-white transition-colors">"{a.reason}"</p>
                    </div>
                    <span className={`font-black text-sm tabular-nums ${a.amount >= 0 ? 'text-green-600' : 'text-red-700'}`}>
                      {a.amount >= 0 ? '+' : ''}{a.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
                {auditLog.length === 0 && <p className="text-center opacity-10 uppercase tracking-widest text-[9px] mt-20">No recorded anomalies</p>}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: REAL-TIME TELEMETRY */}
        <div className="col-span-4 flex flex-col gap-10">
          <div className="bg-neutral-950 border border-neutral-800 rounded-[70px] p-14 flex flex-col flex-[1.6] overflow-hidden shadow-2xl relative">
            <div className="flex justify-between items-center mb-12 border-b border-neutral-900 pb-10">
              <h3 className="text-xl font-black text-white uppercase tracking-tighter">Node Registry</h3>
              <span className="px-5 py-1.5 bg-red-950/40 text-red-600 text-[10px] font-black rounded-full tracking-[0.2em] animate-pulse shadow-inner">{workers.length} CONNECTED</span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-6 custom-scrollbar pr-2">
              {workers.map(w => (
                <div key={w.id} className="bg-neutral-900/20 p-8 rounded-[40px] border border-neutral-900 flex justify-between items-center group hover:bg-red-950/10 transition-all duration-500">
                  <div className="flex items-center gap-6">
                    <div className={`w-3.5 h-3.5 rounded-full ${w.sp > 5000 ? 'bg-yellow-500 animate-pulse' : 'bg-red-900'} shadow-[0_0_15px] shadow-current`} />
                    <div>
                      <p className="text-base font-black text-white uppercase tracking-tight group-hover:text-red-500 transition-colors">{w.name}</p>
                      <p className="text-[9px] text-neutral-600 font-black uppercase tracking-[0.3em] mt-1">{w.notes}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-yellow-600 tracking-tighter tabular-nums">{w.sp.toLocaleString()}</p>
                    <p className="text-[7px] text-neutral-800 font-black uppercase tracking-widest">SOV_POWER</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-[60px] flex-1 p-14 flex flex-col overflow-hidden shadow-2xl">
            <h4 className="text-[11px] font-black text-neutral-700 uppercase mb-10 tracking-[1.5em] border-b border-neutral-900 pb-6">Nexus Flow Feed</h4>
            <div className="flex-1 overflow-y-auto space-y-5 custom-scrollbar">
               {logs.map((l, i) => (
                 <div key={i} className={`text-[10px] border-l-3 pl-6 py-2 border-neutral-900 animate-in slide-in-from-left duration-500 ${l.c}`}>
                    <span className="opacity-20 mr-3 text-[9px] font-bold tabular-nums">[{l.t}]</span> {l.m}
                 </div>
               ))}
            </div>
          </div>

          <div className="bg-red-950/10 border-2 border-red-900/30 p-12 rounded-[60px] text-center shadow-inner relative group overflow-hidden">
            <div className="absolute inset-0 bg-red-900/5 translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
            <p className="text-[11px] text-red-900 font-black uppercase tracking-[1.5em] mb-6 relative z-10">Sovereign_Mandate</p>
            <p className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none relative z-10">"{SLOGAN}"</p>
          </div>
        </div>
      </main>

      {/* FOOTER: SYSTEM TELEMETRY */}
      <footer className="p-6 bg-neutral-950 border-t border-neutral-900 flex justify-between text-[10px] font-black uppercase text-neutral-800 tracking-[0.6em] z-[60]">
        <div className="flex gap-16 items-center">
          <span className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-green-700 rounded-full animate-pulse" /> NETWORK_STABILITY: OPTIMAL</span>
          <span>UPTIME: {state.uptime}S</span>
          <span>REGION: AYUTTHAYA_CORE</span>
        </div>
        <div className={`animate-pulse font-black italic tracking-[0.2em] ${isCooldown ? 'text-orange-700' : 'text-red-900'}`}>
          Sovereign_Nexus_v4.1_Final_Lock
        </div>
        <div className="flex gap-8 items-center tabular-nums">
           <span>{new Date().toLocaleDateString()}</span>
           <span className="text-white opacity-50">{new Date().toLocaleTimeString()}</span>
        </div>
      </footer>

      <style>{`
        @keyframes scan { 0% { top: 0; } 100% { top: 100%; } }
        .animate-scan { position: absolute; animation: scan 18s linear infinite; pointer-events: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #333; }
        .font-heading { font-family: 'Kanit', sans-serif; }
      `}</style>
    </div>
  );
};

export default App;
