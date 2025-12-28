
export enum KernelStatus {
  INITIALIZING = 'INITIALIZING',
  SCANNING = 'SCANNING',
  THINKING = 'THINKING',
  EXECUTING = 'EXECUTING',
  STABLE = 'STABLE'
}

export interface NetworkNode {
  id: string;
  location: string;
  status: 'ONLINE' | 'OFFLINE';
  load: number;
}

export interface Worker {
  id: string;
  name: string;
  ap: number; // Activity Points
  sp: number; // Sovereign Points (Money/Assets)
  rank: 'Diamond' | 'Gold' | 'Silver';
  status: 'Active' | 'Warning' | 'Suspended';
  notes: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  workerId: string;
  workerName: string;
  type: 'REWARD' | 'PENALTY' | 'SYSTEM';
  amount: number;
  reason: string;
}

export interface SystemState {
  kernel: KernelStatus;
  uptime: number;
  totalDirectives: number;
  sovereignPoints: number;
  networkIntegrity: number;
}

export interface AgentThought {
  id: string;
  timestamp: string;
  monologue: string;
  directive: string;
  action: string;
}
