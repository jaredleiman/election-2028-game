export type ScreenId = 'map' | 'allocate' | 'debate' | 'report' | 'fundraising' | 'night';

export interface StateInfo {
  code: string;
  name: string;
  ev: number;
  moe: number;
  urban: number;
  college: number;
  age65: number;
  age1834: number;
}

export interface Poll {
  dem: number;
  rep: number;
}

export type LogTone = 'gold' | 'blue' | 'red' | 'green' | 'muted';

export interface LogEntry {
  id: number;
  week: number;
  text: string;
  tone: LogTone;
  delta?: number;
}

export interface NationalPoint {
  week: number;
  dem: number;
  rep: number;
}

export interface GameState {
  week: number;
  money: number;
  energy: number;
  staff: number;
  polls: Record<string, Poll>;
  history: NationalPoint[];
  lastAverage: Poll;
  log: LogEntry[];
  nextLogId: number;
}

export interface Investment {
  label: string;
  moneyDelta: number;
  energyDelta: number;
  staffDelta: number;
  shift: number;
  target?: string;
  tone: LogTone;
}
