
import React from 'react';
import { SLOGAN } from '../constants';

const Broadcaster: React.FC = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
      <span className="text-9xl mb-10">📡</span>
      <h3 className="text-2xl font-black uppercase tracking-[1em]">Autonomous Broadcast Active</h3>
      <p className="mt-4 text-xs font-black uppercase tracking-widest italic">"{SLOGAN}"</p>
    </div>
  );
};

export default Broadcaster;
