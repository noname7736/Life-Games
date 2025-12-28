
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

interface TruthScannerProps {
  workers: any[];
  anomalies: any[];
  reportAnomaly: (workerId: string, violation: string, penalty: string) => void;
  addLog: (m: string, s?: string) => void;
}

const TruthScanner: React.FC<TruthScannerProps> = ({ workers, anomalies, reportAnomaly, addLog }) => {
  const [selectedWorker, setSelectedWorker] = useState('');
  const [violationType, setViolationType] = useState('Mobile Usage');
  const [penaltyAmt, setPenaltyAmt] = useState('1000 SP');

  const handleSubmitAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorker) return;
    reportAnomaly(selectedWorker, violationType, `Deduct ${penaltyAmt}`);
    setSelectedWorker('');
    addLog(`>>> [AUDIT] ANOMALY RECORDED: Identity ${selectedWorker} for ${violationType}`, "critical");
  };

  // ข้อมูลสถิติสำหรับการกระจายชนชั้น
  const rankData = [
    { name: 'Diamond', value: workers.filter(w => w.rank === 'Diamond').length },
    { name: 'Gold', value: workers.filter(w => w.rank === 'Gold').length },
    { name: 'Silver', value: workers.filter(w => w.rank === 'Silver').length },
  ];
  const COLORS = ['#3b82f6', '#eab308', '#94a3b8'];

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      
      {/* PERFORMANCE ANALYTICS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Core Performance Graph */}
        <div className="lg:col-span-8 bg-neutral-900/40 p-12 rounded-[50px] border border-neutral-800 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
          <div className="flex justify-between items-center mb-12">
            <h3 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
               <span className="text-yellow-600">📊</span> Network Performance Index
            </h3>
            <div className="flex gap-4">
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 bg-[#b91c1c] rounded-sm" />
                 <span className="text-[10px] font-black uppercase text-neutral-500">AP (Activity)</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 bg-[#d4af37] rounded-sm" />
                 <span className="text-[10px] font-black uppercase text-neutral-500">SP (Assets)</span>
               </div>
            </div>
          </div>
          <div className="h-[450px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workers}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="name" stroke="#444" fontSize={11} tick={{fill: '#888'}} axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke="#444" fontSize={11} tick={{fill: '#888'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '24px', padding: '16px' }}
                  itemStyle={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase' }}
                  cursor={{fill: '#111'}}
                />
                <Bar dataKey="ap" name="Activity Score" fill="#b91c1c" radius={[10, 10, 0, 0]} barSize={30} />
                <Bar dataKey="sp" name="Total Assets" fill="#d4af37" radius={[10, 10, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real-time Field Audit Form */}
        <div className="lg:col-span-4 space-y-10">
          <div className="bg-red-950/10 border-2 border-red-900/20 p-12 rounded-[50px] shadow-[0_30px_60px_rgba(153,27,27,0.1)] relative group">
            <div className="absolute top-0 right-0 p-6 opacity-5">
               <span className="text-8xl">⚖️</span>
            </div>
            <h3 className="text-2xl font-black text-red-600 uppercase mb-10 tracking-[0.2em]">Log Manual Audit</h3>
            <form onSubmit={handleSubmitAudit} className="space-y-6">
              <div>
                <label className="text-[11px] font-black text-neutral-600 uppercase block mb-3 tracking-widest">Target Identity</label>
                <select 
                  value={selectedWorker} 
                  onChange={(e) => setSelectedWorker(e.target.value)}
                  className="w-full bg-black border border-neutral-800 p-5 rounded-2xl text-sm text-white focus:border-red-600 outline-none transition-all cursor-pointer"
                >
                  <option value="">Select Identity Protocol...</option>
                  {workers.map(w => <option key={w.id} value={w.id}>{w.name} ({w.id})</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-black text-neutral-600 uppercase block mb-3 tracking-widest">Violation Protocol</label>
                <select 
                  value={violationType} 
                  onChange={(e) => setViolationType(e.target.value)}
                  className="w-full bg-black border border-neutral-800 p-5 rounded-2xl text-sm text-white focus:border-red-600 outline-none transition-all cursor-pointer"
                >
                  <option>Mobile Usage Breach</option>
                  <option>Unauthorized Idle Time</option>
                  <option>Work Quality Anomaly</option>
                  <option>Disciplinary Conflict</option>
                  <option>Sanitation/5S Violation</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-black text-neutral-600 uppercase block mb-3 tracking-widest">Asset Deduction (SP)</label>
                <input 
                  type="text" 
                  value={penaltyAmt}
                  onChange={(e) => setPenaltyAmt(e.target.value)}
                  className="w-full bg-black border border-neutral-800 p-5 rounded-2xl text-sm text-white focus:border-red-600 outline-none"
                />
              </div>
              <button 
                type="submit" 
                disabled={!selectedWorker}
                className="w-full bg-gradient-to-r from-red-800 to-red-900 hover:from-red-700 hover:to-red-800 text-white font-black py-6 rounded-3xl text-sm uppercase tracking-[0.4em] transition-all disabled:opacity-20 shadow-2xl active:scale-95"
              >
                Execute Penalty
              </button>
            </form>
          </div>

          {/* Infraction Log */}
          <div className="bg-black border border-neutral-800 p-10 rounded-[40px] h-[300px] flex flex-col overflow-hidden shadow-xl">
             <h4 className="text-[12px] font-black text-red-900 uppercase mb-8 tracking-[0.5em] flex justify-between">
                <span>Infraction Journal</span>
                <span className="text-neutral-700">Real-time</span>
             </h4>
             <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6">
                {anomalies.map(a => (
                  <div key={a.id} className="text-[11px] border-l-4 border-red-950 pl-6 py-2 group hover:bg-neutral-950 transition-colors">
                    <p className="text-white font-black mb-1 group-hover:text-red-500 transition-colors uppercase">{a.workerName}</p>
                    <p className="text-neutral-500 font-bold uppercase tracking-tighter">{a.violation} | <span className="text-red-900">{a.penalty}</span></p>
                    <p className="text-[9px] text-neutral-700 mt-2 font-black">TIMESTAMP: {a.timestamp}</p>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* CENTRAL LEDGER - บัญชีมหาลาภ */}
      <div className="bg-black border border-neutral-800 rounded-[60px] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
        <div className="p-16 border-b border-neutral-900 flex justify-between items-end bg-neutral-900/20 backdrop-blur-md">
          <div>
            <h3 className="text-5xl font-black text-white uppercase tracking-tighter mb-4">💎 THE CENTRAL LEDGER</h3>
            <p className="text-[12px] text-yellow-600 font-black uppercase tracking-[0.8em] border-l-4 border-yellow-700 pl-4">บัญชีมหาลาภ - Central Sovereignty Authority</p>
          </div>
          <div className="flex gap-6 pb-2">
             <button className="text-[11px] font-black text-neutral-500 bg-neutral-900 px-8 py-3 rounded-full border border-neutral-800 hover:text-white transition-all uppercase tracking-widest shadow-lg">Export_Audit_Log</button>
             <button className="text-[11px] font-black text-neutral-500 bg-neutral-900 px-8 py-3 rounded-full border border-neutral-800 hover:text-white transition-all uppercase tracking-widest shadow-lg">Network_Sync</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-neutral-950/80 text-neutral-600 text-[11px] uppercase tracking-[0.4em] font-black">
                <th className="px-16 py-10">Identity Hash & Name</th>
                <th className="px-16 py-10 text-center">Activity (AP)</th>
                <th className="px-16 py-10 text-center">Assets (SP)</th>
                <th className="px-16 py-10 text-center">Sovereign Rank</th>
                <th className="px-16 py-10 text-center">Status</th>
                <th className="px-16 py-10 text-right">Administrative</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900">
              {workers.map((worker) => (
                <tr key={worker.id} className="group hover:bg-neutral-900/40 transition-all duration-500">
                  <td className="px-16 py-10">
                    <div className="flex items-center gap-6">
                       <div className="w-12 h-12 bg-neutral-900 rounded-2xl flex items-center justify-center font-black text-neutral-600 text-lg group-hover:bg-red-950 group-hover:text-red-500 transition-colors">
                          {worker.id.slice(-2)}
                       </div>
                       <div className="flex flex-col">
                        <span className="text-xl font-black text-neutral-200 group-hover:text-white transition-colors">{worker.name}</span>
                        <span className="text-[10px] text-neutral-700 font-mono font-black uppercase tracking-widest mt-1">ID: {worker.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-16 py-10 text-center">
                    <span className="text-2xl font-black text-red-600 tabular-nums">{worker.ap}</span>
                  </td>
                  <td className="px-16 py-10 text-center">
                    <span className="text-2xl font-black text-yellow-500 tabular-nums">{worker.sp.toLocaleString()}</span>
                  </td>
                  <td className="px-16 py-10 text-center">
                    <span className={`px-8 py-2 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl border ${
                      worker.rank === 'Diamond' ? 'bg-blue-900/20 text-blue-400 border-blue-700/50' :
                      worker.rank === 'Gold' ? 'bg-yellow-900/20 text-yellow-400 border-yellow-700/50' :
                      'bg-neutral-800/50 text-neutral-400 border-neutral-700'
                    }`}>
                      {worker.rank}
                    </span>
                  </td>
                  <td className="px-16 py-10 text-center">
                    <div className="flex items-center justify-center gap-4">
                      <div className={`w-3 h-3 rounded-full shadow-[0_0_15px_currentColor] ${
                         worker.status === 'Active' ? 'text-green-500 bg-green-500 animate-pulse' :
                         worker.status === 'Warning' ? 'text-red-600 bg-red-600' :
                         'text-neutral-700 bg-neutral-700'
                      }`} />
                      <span className={`text-[11px] font-black uppercase tracking-widest ${
                        worker.status === 'Active' ? 'text-green-800' : 'text-red-800'
                      }`}>{worker.status}</span>
                    </div>
                  </td>
                  <td className="px-16 py-10 text-right">
                    <button className="bg-neutral-900 hover:bg-red-900 text-neutral-600 hover:text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-neutral-800 hover:border-red-700">Deep_Audit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TruthScanner;
