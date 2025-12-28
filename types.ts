
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
  status: 'ONLINE' | 'OFFLINE' | 'INTERCEPTED';
  load: number;
  lastPing: number;
}

export interface SystemState {
  kernel: KernelStatus;
  uptime: number;
  totalDirectives: number;
  sovereignPoints: number;
  networkIntegrity: number;
  activeWorkers: number;
}

export interface AgentThought {
  id: string;
  timestamp: string;
  monologue: string;
  directive: string;
  action: string;
}
