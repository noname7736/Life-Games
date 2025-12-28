
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Worker, AuditEntry } from '../types';

interface TruthScannerProps {
  workers: Worker[];
  anomalies: AuditEntry[];
  reportAnomaly: (workerId: string, violation: string, penalty: string) => void;
  addLog: (m: string, s?: string) => void;
}

const TruthScanner: React.FC<TruthScannerProps> = ({ workers, anomalies, reportAnomaly, addLog }) => {
  const [selectedWorker, setSelectedWorker] = useState('');
  const [violationType, setViolationType] = useState('Mobile Usage Breach');
  const [penaltyAmt, setPenaltyAmt] = useState('1000');

  const handleSubmitAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorker) return;
    reportAnomaly(selectedWorker, violationType, penaltyAmt);
    setSelectedWorker('');
    addLog(`>>> [AUDIT] MANUAL_EXECUTION: ${selectedWorker} - ${violationType}`, "critical");
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="grid grid-cols-12 gap-10">
        
        {/* DATA VISUALIZATION */}
        <div className="col-span-8 bg-neutral-900/30 p-12 rounded-[50px] border border-neutral-800 backdrop-blur-3xl shadow-2xl">
          <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-10">Worker Asset Distribution</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workers}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="name" stroke="#444" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#444" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '15px' }}
                  itemStyle={{ fontSize: '12px', fontWeight: '900', color: '#d4af37' }}
                />
                <Bar dataKey="sp" name="Asset (SP)" fill="#b91c1c" radius={[8, 8, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* MANUAL INTERVENTION */}
        <div className="col-span-4 bg-red-950/10 border-2 border-red-900/30 p-10 rounded-[50px] shadow-2xl">
          <h3 className="text-xl font-black text-red-600 uppercase mb-8 tracking-widest">Execute Discipline</h3>
          <form onSubmit={handleSubmitAudit} className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-neutral-600 uppercase mb-2 block">Select Target Identity</label>
              <select 
                value={selectedWorker} 
                onChange={(e) => setSelectedWorker(e.target.value)}
                className="w-full bg-black border border-neutral-800 p-4 rounded-xl text-white outline-none focus:border-red-600"
              >
                <option value="">Choose Worker...</option>
                {workers.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black text-neutral-600 uppercase mb-2 block">Reason for Intervention</label>
              <select 
                value={violationType} 
                onChange={(e) => setViolationType(e.target.value)}
                className="w-full bg-black border border-neutral-800 p-4 rounded-xl text-white outline-none focus:border-red-600"
              >
                <option>Mobile Usage Breach</option>
                <option>Unauthorized Absence</option>
                <option>Quality Sabotage</option>
                <option>Constitutional Disrespect</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black text-neutral-600 uppercase mb-2 block">Deduction Amount (SP)</label>
              <input 
                type="number" 
                value={penaltyAmt}
                onChange={(e) => setPenaltyAmt(e.target.value)}
                className="w-full bg-black border border-neutral-800 p-4 rounded-xl text-white outline-none focus:border-red-600"
              />
            </div>
            <button 
              type="submit" 
              disabled={!selectedWorker}
              className="w-full bg-red-800 text-white font-black py-5 rounded-2xl uppercase tracking-widest hover:bg-red-700 transition-all disabled:opacity-20 shadow-lg"
            >
              Confirm Punishment
            </button>
          </form>
        </div>
      </div>

      {/* THE MASTER LEDGER */}
      <div className="bg-black border border-neutral-800 rounded-[50px] overflow-hidden shadow-2xl">
        <div className="p-10 border-b border-neutral-900 bg-neutral-900/20">
          <h3 className="text-3xl font-black text-white uppercase tracking-tighter">THE MASTER AUDIT LEDGER</h3>
        </div>
        <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead className="bg-neutral-950 text-neutral-600 text-[9px] uppercase tracking-widest font-black sticky top-0 z-10">
              <tr>
                <th className="p-8">Timestamp</th>
                <th className="p-8">Identity</th>
                <th className="p-8 text-center">Operation</th>
                <th className="p-8 text-center">Amount (SP)</th>
                <th className="p-8">Strategic Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900">
              {anomalies.map((a) => (
                <tr key={a.id} className="hover:bg-neutral-900/50 transition-colors">
                  <td className="p-8 text-[10px] font-bold text-neutral-500">{a.timestamp}</td>
                  <td className="p-8">
                    <div className="font-black text-white">{a.workerName}</div>
                    <div className="text-[8px] text-neutral-700">ID: {a.workerId}</div>
                  </td>
                  <td className="p-8 text-center">
                    <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase ${a.type === 'REWARD' ? 'bg-green-900/20 text-green-500' : 'bg-red-900/20 text-red-500'}`}>
                      {a.type}
                    </span>
                  </td>
                  <td className={`p-8 text-center font-black ${a.amount >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {a.amount > 0 ? `+${a.amount}` : a.amount}
                  </td>
                  <td className="p-8 text-[11px] text-neutral-400 italic font-heading">"{a.reason}"</td>
                </tr>
              ))}
              {anomalies.length === 0 && <tr><td colSpan={5} className="p-20 text-center opacity-20 font-black uppercase tracking-[1em]">Ledger Clear</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TruthScanner;
