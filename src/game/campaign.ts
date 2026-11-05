import { INITIAL_POLLS, STATES, TO_WIN, TOTAL_EV } from '@/data/states';
import type { GameState, Investment, Poll, LogEntry, NationalPoint } from '@/types';

export type GameAction = { type: 'invest'; investment: Investment } | { type: 'endWeek' };

export const MAX_WEEKS = 14;
const STATE_NAMES = Object.fromEntries(STATES.map((s) => [s.code, s.name]));

const SEED_HISTORY: NationalPoint[] = [
  { week: 1, dem: 43.8, rep: 44.9 },
  { week: 2, dem: 44.2, rep: 44.6 },
  { week: 3, dem: 44.0, rep: 44.8 },
  { week: 4, dem: 44.6, rep: 44.4 },
  { week: 5, dem: 44.9, rep: 44.3 },
  { week: 6, dem: 45.0, rep: 44.5 },
  { week: 7, dem: 45.1, rep: 44.3 },
];

const SEED_LOG: Omit<LogEntry, 'id'>[] = [
  { week: 7, text: 'Ground game expanded in Michigan', tone: 'green', delta: 0.6 },
  { week: 6, text: 'Whitman loses ground after fracking remarks in Pennsylvania', tone: 'red', delta: -0.2 },
  { week: 6, text: 'Harrison raises $6.5M at a Los Angeles fundraiser', tone: 'gold' },
];

const averagePoll = (polls: Record<string, Poll>): Poll => {
  const values = Object.values(polls);
  const n = values.length;
  return {
    dem: values.reduce((sum, p) => sum + p.dem, 0) / n,
    rep: values.reduce((sum, p) => sum + p.rep, 0) / n,
  };
};

export function createInitialGame(): GameState {
  const polls = structuredClone(INITIAL_POLLS);
  return {
    week: 7,
    money: 42.3,
    energy: 68,
    staff: 46,
    polls,
    history: SEED_HISTORY,
    lastAverage: averagePoll(polls),
    log: SEED_LOG.map((entry, i) => ({ ...entry, id: i + 1 })),
    nextLogId: SEED_LOG.length + 1,
  };
}

const clampPoll = (value: number) => Math.min(100, Math.max(0, value));

function applyShift(polls: Record<string, Poll>, codes: string[], shift: number): Record<string, Poll> {
  const next = { ...polls };
  for (const code of codes) {
    const current = next[code];
    next[code] = {
      dem: clampPoll(current.dem + shift / 2),
      rep: clampPoll(current.rep - shift / 2),
    };
  }
  return next;
}

function appendLog(game: GameState, text: string, tone: LogEntry['tone'], delta?: number): GameState {
  const entry: LogEntry = { id: game.nextLogId, week: game.week, text, tone, delta };
  return { ...game, log: [entry, ...game.log], nextLogId: game.nextLogId + 1 };
}

export function canAfford(game: GameState, inv: Investment): boolean {
  return game.money + inv.moneyDelta >= 0 && game.energy + inv.energyDelta >= 0 && game.staff + inv.staffDelta >= 0;
}

function invest(game: GameState, inv: Investment): GameState {
  if (!canAfford(game, inv)) return game;
  const codes = inv.target ? [inv.target] : Object.keys(game.polls);
  const next: GameState = {
    ...game,
    money: Math.round((game.money + inv.moneyDelta) * 10) / 10,
    energy: Math.min(100, game.energy + inv.energyDelta),
    staff: game.staff + inv.staffDelta,
    polls: applyShift(game.polls, codes, inv.shift),
  };
  const where = inv.target ? ` in ${STATE_NAMES[inv.target]}` : '';
  return appendLog(next, `${inv.label}${where}`, inv.tone, inv.shift || undefined);
}

function endWeek(game: GameState): GameState {
  if (game.week >= MAX_WEEKS) return game;
  const average = averagePoll(game.polls);
  const last = game.history[game.history.length - 1];
  const point: NationalPoint = {
    week: game.week + 1,
    dem: Math.round((last.dem + average.dem - game.lastAverage.dem) * 10) / 10,
    rep: Math.round((last.rep + average.rep - game.lastAverage.rep) * 10) / 10,
  };
  const completed = game.week;
  const next: GameState = {
    ...game,
    week: game.week + 1,
    energy: Math.min(100, game.energy + 20),
    staff: game.staff + 4,
    history: [...game.history, point],
    lastAverage: average,
  };
  return appendLog(next, `Week ${completed} complete`, 'muted');
}

export function campaignReducer(game: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'invest':
      return invest(game, action.investment);
    case 'endWeek':
      return endWeek(game);
  }
}

export interface Projection {
  demEV: number;
  repEV: number;
  tossEV: number;
  demWinPct: number;
  repWinPct: number;
  tossPct: number;
  tipping: string | null;
}

export function getProjection(polls: Record<string, Poll>): Projection {
  let demEV = 0;
  let repEV = 0;
  let tossEV = 0;
  for (const state of STATES) {
    const p = polls[state.code];
    if (Math.abs(p.dem - p.rep) < 2) tossEV += state.ev;
    if (p.dem > p.rep) demEV += state.ev;
    else repEV += state.ev;
  }
  const demWinPct = Math.min(99, Math.max(1, Math.round(50 + (demEV - TO_WIN + 1) * 3)));
  const tossPct = Math.round((tossEV / TOTAL_EV) * 100);
  const repWinPct = Math.max(0, 100 - demWinPct - tossPct);
  const tipping = findTippingState(polls);
  return { demEV, repEV, tossEV, demWinPct, repWinPct, tossPct, tipping };
}

function findTippingState(polls: Record<string, Poll>): string | null {
  const leaders = STATES.filter((s) => polls[s.code].dem > polls[s.code].rep).sort(
    (a, b) => polls[b.code].dem - polls[b.code].rep - (polls[a.code].dem - polls[a.code].rep),
  );
  let running = 0;
  for (const state of leaders) {
    running += state.ev;
    if (running >= TO_WIN) return state.name;
  }
  return null;
}

export function marginOf(poll: Poll): number {
  return Math.round((poll.dem - poll.rep) * 10) / 10;
}
