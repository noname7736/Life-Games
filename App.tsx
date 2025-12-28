
import React, { useState, useEffect, useCallback } from 'react';
import { KernelStatus, SystemState, AgentThought } from './types';
import { sovereignAgentLogic } from './services/geminiService';
import { AYUTTHAYA_NODES, SLOGAN, SYSTEM_ID, MOCK_WORKERS, MOCK_ANOMALIES, CONSTITUTION_DIRECTIVES } from './constants';
import Broadcaster from './components/Broadcaster';
import Dominance from './components/Dominance';
import TruthScanner from './components/TruthScanner';
import Constitution from './components/Constitution';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'agent' | 'broadcast' | 'dominance' | 'scanner' | 'laws'>('agent');
  const [state, setState] = useState<SystemState>({
    kernel: KernelStatus.INITIALIZING,
    uptime: 0,
    totalDirectives: 0,
    sovereignPoints: 2450000,
    networkIntegrity: 100,
    activeWorkers: MOCK_WORKERS.length
  });

  const [logs, setLogs] = useState<{t: string, m: string, s: string}[]>([]);
  const [thought, setThought] = useState<AgentThought | null>(null);
  const [workers, setWorkers] = useState(MOCK_WORKERS);
  const [anomalies, setAnomalies] = useState(MOCK_ANOMALIES);
  const [directiveIndex, setDirectiveIndex] = useState(0);

  const addLog = useCallback((m: string, s: string = 'info') => {
    setLogs(prev => [{ t: new Date().toLocaleTimeString(), m, s }, ...prev].slice(0, 100));
  }, []);

  // HIGH FREQUENCY BROADCAST PULSE (1 SECOND)
  useEffect(() => {
    const ticker = setInterval(() => {
      setDirectiveIndex(prev => (prev + 1) % CONSTITUTION_DIRECTIVES.length);
    }, 1000);
    return () => clearInterval(ticker);
  }, []);

  useEffect(() => {
    const boot = async () => {
      addLog(">>> [SYS] AgentGPT MASTER KERNEL v12.0 BOOTING...", "warning");
      await new Promise(r => setTimeout(r, 1000));
      setState(prev => ({ ...prev, kernel: KernelStatus.STABLE }));
      addLog(">>> [AUTH] AGENT ACCESS GRANTED. LOCAL INTELLIGENCE ONLINE.", "info");
    };
    boot();
  }, [addLog]);

  useEffect(() => {
    const timer = setInterval(() => setState(prev => ({ ...prev, uptime: prev.uptime + 1 })), 1000);
    return () => clearInterval(timer);
  }, []);

  // AgentGPT REASONING LOOP
  useEffect(() => {
    if (state.kernel !== KernelStatus.STABLE) return;

    const runAgentIntelligence = async () => {
      setState(prev => ({ ...prev, kernel: KernelStatus.THINKING }));
      
      const workerPayload = JSON.stringify(workers.map(w => ({ id: w.id, ap: w.ap, sp: w.sp, name: w.name })));
      const sysStats = `TotalSP: ${state.sovereignPoints}, AnomalyCount: ${anomalies.length}`;
      
      // เรียกใช้ AgentGPT แทน Gemini API
      const decision = await sovereignAgentLogic(workerPayload, sysStats);
      
      if (decision) {
        setThought({
          id: `AGPT-${Date.now().toString().slice(-6)}`,
          timestamp: new Date().toLocaleTimeString(),
          monologue: decision.monologue,
          directive: decision.directive,
          action: decision.action
        });

        if (decision.targetWorkerId && decision.spChange !== 0) {
          setWorkers(prev => prev.map(w => 
            w.id === decision.targetWorkerId 
              ? { ...w, sp: Math.max(0, w.sp + decision.spChange), status: decision.spChange < 0 ? 'Warning' as any : 'Active' as any } 
              : w
          ));
          addLog(`>>> [AGENT_DECREE] ${decision.action} ON ${decision.targetWorkerId}: ${decision.spChange} SP`, decision.spChange < 0 ? "critical" : "info");
        }

        setState(prev => ({
          ...prev,
          kernel: KernelStatus.EXECUTING,
          totalDirectives: prev.totalDirectives + 1,
          sovereignPoints: prev.sovereignPoints + decision.spChange
        }));
      }

      setTimeout(() => setState(prev => ({ ...prev, kernel: KernelStatus.STABLE })), 2000);
    };

    const interval = setInterval(runAgentIntelligence, 30000); // ประมวลผลทุก 30 วินาที
    runAgentIntelligence();
    return () => clearInterval(interval);
  }, [state.kernel === KernelStatus.STABLE, workers, anomalies.length, addLog]);

  const handleAudit = (workerId: string, violation: string, penalty: string) => {
    const spPenalty = parseInt(penalty.replace(/\D/g, '')) || 500;
    setWorkers(prev => prev.map(w => w.id === workerId ? { ...w, sp: Math.max(0, w.sp - spPenalty), status: 'Warning' } : w));
    setAnomalies(prev => [{ id: `A-${Date.now()}`, timestamp: new Date().toLocaleTimeString(), workerName: workers.find(w => w.id === workerId)?.name || 'Unknown', violation, penalty }, ...prev]);
    setState(prev => ({ ...prev, sovereignPoints: prev.sovereignPoints - spPenalty }));
    addLog(`>>> [AUDIT] MANUAL_INTERVENTION: ${workerId} (-${spPenalty} SP)`, "critical");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#d4af37] font-mono flex flex-col border-[12px] border-neutral-900 overflow-hidden relative">
      
      {/* 1S HIGH INTENSITY CONSTITUTION BROADCAST */}
      <div className="bg-red-700 h-10 flex items-center overflow-hidden border-b-2 border-red-900 relative z-[60] shadow-[0_4px_30px_rgba(185,28,28,0.6)]">
        <div className="bg-black text-white font-black px-6 h-full flex items-center animate-pulse border-r-4 border-yellow-500 text-[10px] uppercase tracking-tighter">
           AgentGPT_SOVEREIGN_HFB
        </div>
        <div className="flex-1 px-8 overflow-hidden relative">
           <div className="text-white text-sm font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 flex items-center h-full">
              {CONSTITUTION_DIRECTIVES[directiveIndex]}
           </div>
           <div className="absolute inset-0 bg-white/10 animate-pulse pointer-events-none" />
        </div>
        <div className="bg-yellow-500 text-black font-black px-4 h-full flex items-center text-[10px]">
           PULSE: 1000ms
        </div>
      </div>

      <header className="bg-neutral-900 p-6 flex justify-between items-center border-b-2 border-red-900/50 z-50">
        <div className="flex items-center gap-6">
          <div className={`w-5 h-5 rounded-full ${state.kernel === KernelStatus.THINKING ? 'bg-yellow-500 animate-ping shadow-[0_0_15px_yellow]' : 'bg-red-600 animate-pulse shadow-[0_0_15px_red]'}`} />
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">AgentGPT Sovereign</h1>
            <p className="text-[10px] text-red-700 font-bold tracking-[0.6em] uppercase">Autonomous Local Governance</p>
          </div>
        </div>
        <nav className="flex gap-2">
          {['agent', 'broadcast', 'dominance', 'scanner', 'laws'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === tab ? 'bg-red-800 text-white shadow-[0_0_15px_rgba(153,27,27,0.5)]' : 'text-neutral-500 hover:text-white'}`}>{tab}</button>
          ))}
        </nav>
        <div className="text-right">
          <p className="text-[10px] text-neutral-600 uppercase mb-1">Central Sovereign Fund</p>
          <p className="text-3xl font-black text-white">{state.sovereignPoints.toLocaleString()} <span className="text-sm text-yellow-600">SP</span></p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-10 relative custom-scrollbar">
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#b91c1c_1px,transparent_1px)] bg-[size:32px_32px]" />
        
        <div className="max-w-[1500px] mx-auto z-10 relative">
          {activeTab === 'agent' && (
            <div className="grid grid-cols-12 gap-10">
              <div className="col-span-8 space-y-10">
                <section className="bg-neutral-900/40 border border-red-900/20 rounded-[40px] p-16 backdrop-blur-xl relative overflow-hidden group shadow-inner">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-red-600 shadow-[0_0_20px_red] animate-scan" />
                  <h3 className="text-[12px] font-black text-red-900 uppercase tracking-[1em] mb-12 flex items-center gap-4">
                    <span className="w-2 h-2 bg-red-600 rounded-full animate-ping" /> AgentGPT Reasoning Core
                  </h3>
                  {thought ? (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom duration-500">
                      <p className="text-3xl font-light text-neutral-100 italic font-heading leading-relaxed">"{thought.monologue}"</p>
                      <div className="bg-black/90 p-12 rounded-[32px] border-l-[16px] border-red-800 shadow-2xl relative">
                        <span className="absolute top-4 right-6 text-[8px] text-yellow-600 font-black tracking-widest">LOCAL_AUTONOMOUS_DECISION</span>
                        <span className="text-[11px] text-red-600 font-black uppercase tracking-[0.5em] block mb-4">Supreme Sovereign Directive</span>
                        <p className="text-5xl font-black text-white uppercase tracking-tighter leading-tight drop-shadow-md">{thought.directive}</p>
                        <div className="mt-8 pt-8 border-t border-neutral-900 flex justify-between text-[11px] text-neutral-600 font-black uppercase">
                           <span>Mode: AgentGPT-OFFLINE</span>
                           <span>Ticket: {thought.id}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-40 text-center opacity-10 animate-pulse"><p className="text-5xl font-black tracking-[1em]">Scanning Ayutthaya Grid...</p></div>
                  )}
                </section>
                <div className="grid grid-cols-3 gap-8">
                  {AYUTTHAYA_NODES.map(node => (
                    <div key={node.id} className="bg-black border border-neutral-800 p-8 rounded-[32px] group hover:border-red-900 transition-all shadow-xl hover:shadow-red-900/10">
                      <div className="flex justify-between mb-6">
                        <span className="text-[10px] text-neutral-600 font-black uppercase">{node.id}</span>
                        <div className={`w-3 h-3 rounded-full ${node.status === 'ONLINE' ? 'bg-green-600 shadow-[0_0_10px_green]' : 'bg-red-600 animate-pulse'}`} />
                      </div>
                      <h4 className="text-lg font-black text-white group-hover:text-red-500 uppercase tracking-tighter">{node.location}</h4>
                      <div className="mt-4 w-full bg-neutral-900 h-1 rounded-full overflow-hidden">
                        <div className="h-full bg-red-600 shadow-[0_0_10px_red]" style={{ width: `${node.load}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-span-4 flex flex-col gap-10">
                <div className="bg-black border border-neutral-800 rounded-[40px] flex-1 overflow-hidden flex flex-col shadow-2xl">
                  <div className="bg-neutral-900 p-5 border-b border-neutral-800 flex justify-between text-[10px] font-black uppercase">
                    <span>Agent_Kernel_Feed</span>
                    <span className="text-red-700">LOCAL_STABLE</span>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 flex flex-col-reverse custom-scrollbar bg-black/40">
                    {logs.map((log, i) => (
                      <div key={i} className={`mb-4 p-4 rounded-xl border-l-4 text-[10px] font-mono leading-relaxed transition-all transform hover:scale-[1.02] ${log.s === 'critical' ? 'bg-red-900/10 border-red-600 text-red-500' : 'bg-neutral-900 border-neutral-700 text-neutral-500'}`}>
                        <span className="opacity-40">[{log.t}]</span> {log.m}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-red-950/20 p-8 rounded-[32px] border border-red-900/30 text-center shadow-xl animate-pulse">
                   <p className="text-3xl font-black text-red-800 italic uppercase">"{SLOGAN}"</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'broadcast' && <Broadcaster addLog={addLog} />}
          {activeTab === 'dominance' && <Dominance addLog={addLog} />}
          {activeTab === 'scanner' && <TruthScanner workers={workers} anomalies={anomalies} reportAnomaly={handleAudit} addLog={addLog} />}
          {activeTab === 'laws' && <Constitution />}
        </div>
      </main>

      <footer className="bg-black border-t border-neutral-900 p-5 flex justify-between text-[10px] font-black text-neutral-700 uppercase tracking-widest relative z-50">
        <div className="flex gap-10"><span>Uptime: {state.uptime}S</span><span>Ayutthaya_Nodes: Active</span></div>
        <div className="flex gap-4"><span className="text-red-900 animate-pulse font-black italic">AGENT_AUTHENTICATED: SUPREME_GOVERNOR</span></div>
      </footer>

      <style>{`
        @keyframes scan { 0% { top: 0; } 100% { top: 100%; } }
        .animate-scan { position: absolute; animation: scan 15s linear infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #b91c1c; }
        .font-heading { font-family: 'Kanit', sans-serif; }
      `}</style>
    </div>
  );
};

export default App;
