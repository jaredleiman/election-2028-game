import type { Poll, StateInfo } from '@/types';

type StateRow = [
  code: string,
  name: string,
  ev: number,
  dem: number,
  rep: number,
  moe: number,
  urban: number,
  college: number,
  age65: number,
  age1834: number,
];

const ROWS: StateRow[] = [
  ['AL', 'Alabama', 9, 38.9, 58.1, 3.1, 59, 30, 17, 20],
  ['AK', 'Alaska', 3, 40.2, 53.8, 4.0, 66, 31, 12, 25],
  ['AZ', 'Arizona', 11, 46.8, 48.6, 2.4, 89, 33, 18, 22],
  ['AR', 'Arkansas', 6, 37.6, 57.2, 3.4, 56, 24, 18, 21],
  ['CA', 'California', 54, 58.9, 36.4, 1.8, 95, 36, 15, 27],
  ['CO', 'Colorado', 10, 52.1, 43.6, 2.6, 87, 44, 15, 25],
  ['CT', 'Connecticut', 7, 55.3, 40.1, 3.0, 88, 41, 19, 21],
  ['DE', 'Delaware', 3, 54.6, 41.3, 3.6, 83, 33, 19, 20],
  ['DC', 'District of Columbia', 3, 81.0, 12.0, 4.2, 100, 62, 12, 30],
  ['FL', 'Florida', 30, 46.5, 49.8, 2.0, 91, 32, 22, 19],
  ['GA', 'Georgia', 16, 47.2, 48.4, 2.2, 75, 35, 15, 23],
  ['HI', 'Hawaii', 4, 60.4, 35.1, 3.8, 90, 35, 20, 21],
  ['ID', 'Idaho', 4, 33.8, 62.4, 3.7, 71, 28, 17, 20],
  ['IL', 'Illinois', 19, 53.7, 42.0, 2.3, 88, 37, 16, 23],
  ['IN', 'Indiana', 11, 41.0, 55.1, 3.0, 72, 28, 18, 21],
  ['IA', 'Iowa', 6, 43.2, 52.5, 3.2, 64, 30, 19, 20],
  ['KS', 'Kansas', 6, 42.0, 52.9, 3.3, 73, 34, 17, 21],
  ['KY', 'Kentucky', 8, 36.9, 59.8, 3.4, 58, 25, 18, 20],
  ['LA', 'Louisiana', 8, 40.4, 56.8, 3.5, 73, 25, 15, 23],
  ['ME', 'Maine', 4, 51.6, 42.4, 3.9, 39, 33, 24, 18],
  ['MD', 'Maryland', 10, 58.2, 37.2, 2.8, 88, 42, 16, 23],
  ['MA', 'Massachusetts', 11, 60.1, 36.8, 2.5, 92, 47, 17, 24],
  ['MI', 'Michigan', 15, 48.5, 46.4, 2.4, 74, 30, 18, 21],
  ['MN', 'Minnesota', 10, 50.3, 44.6, 2.7, 74, 38, 17, 22],
  ['MS', 'Mississippi', 6, 39.1, 58.2, 3.6, 50, 23, 17, 21],
  ['MO', 'Missouri', 10, 41.4, 55.8, 2.9, 70, 30, 18, 21],
  ['MT', 'Montana', 4, 40.1, 53.9, 3.8, 56, 33, 20, 19],
  ['NE', 'Nebraska', 5, 39.0, 55.7, 3.5, 73, 33, 17, 21],
  ['NV', 'Nevada', 6, 47.1, 48.0, 2.9, 94, 27, 17, 22],
  ['NH', 'New Hampshire', 4, 49.8, 46.4, 3.3, 62, 38, 18, 20],
  ['NJ', 'New Jersey', 14, 53.8, 44.5, 2.2, 95, 40, 17, 22],
  ['NM', 'New Mexico', 5, 52.4, 44.3, 3.1, 79, 32, 19, 22],
  ['NY', 'New York', 28, 55.9, 41.7, 2.0, 88, 40, 17, 24],
  ['NC', 'North Carolina', 16, 46.6, 49.0, 2.3, 66, 34, 18, 21],
  ['ND', 'North Dakota', 3, 34.6, 61.8, 4.1, 59, 29, 17, 20],
  ['OH', 'Ohio', 17, 44.0, 52.9, 2.6, 78, 28, 19, 21],
  ['OK', 'Oklahoma', 7, 35.8, 60.7, 3.6, 66, 27, 17, 21],
  ['OR', 'Oregon', 8, 52.2, 43.4, 3.0, 82, 36, 19, 20],
  ['PA', 'Pennsylvania', 19, 48.2, 47.1, 1.8, 71.3, 41.8, 19.6, 23.7],
  ['RI', 'Rhode Island', 4, 57.0, 39.6, 3.9, 91, 36, 18, 21],
  ['SC', 'South Carolina', 9, 40.9, 55.6, 3.4, 67, 28, 19, 21],
  ['SD', 'South Dakota', 3, 36.1, 60.2, 3.9, 57, 28, 18, 20],
  ['TN', 'Tennessee', 11, 40.3, 56.7, 3.0, 66, 29, 17, 21],
  ['TX', 'Texas', 40, 45.0, 52.1, 2.1, 91, 36, 15, 24],
  ['UT', 'Utah', 6, 35.4, 58.3, 3.5, 91, 40, 14, 23],
  ['VT', 'Vermont', 3, 60.4, 33.5, 4.0, 35, 43, 22, 18],
  ['VA', 'Virginia', 13, 51.0, 45.3, 2.5, 76, 42, 17, 22],
  ['WA', 'Washington', 12, 55.2, 38.7, 2.7, 84, 41, 17, 23],
  ['WV', 'West Virginia', 4, 31.1, 65.3, 4.0, 49, 20, 21, 18],
  ['WI', 'Wisconsin', 10, 48.0, 47.6, 2.4, 70, 36, 20, 21],
  ['WY', 'Wyoming', 3, 29.8, 66.1, 4.5, 64, 30, 17, 19],
];

export const STATES: StateInfo[] = ROWS.map(([code, name, ev, , , moe, urban, college, age65, age1834]) => ({
  code,
  name,
  ev,
  moe,
  urban,
  college,
  age65,
  age1834,
}));

export const INITIAL_POLLS: Record<string, Poll> = Object.fromEntries(
  ROWS.map(([code, , , dem, rep]) => [code, { dem, rep }]),
);

export const TOTAL_EV = 538;
export const TO_WIN = 270;

export const STATE_EVENTS: Record<string, { text: string; impact: number }[]> = {
  PA: [
    { text: 'Steelworker retraining grant announced in Pittsburgh metro', impact: 0.4 },
    { text: 'Fracking regulation debate heats up in southwestern PA', impact: -0.2 },
    { text: 'SEIU endorsement secured in Philadelphia', impact: 0.3 },
  ],
};

export const GENERIC_EVENTS: { text: string; impact: number }[] = [
  { text: 'Major regional union local endorses the campaign', impact: 0.4 },
  { text: 'Rural broadband funding becomes a local talking point', impact: -0.2 },
  { text: 'Editorial boards split over the infrastructure plan', impact: 0.2 },
  { text: 'Grassroots volunteer sign-ups surge across county offices', impact: 0.5 },
  { text: 'Inflation coverage weighs on the incumbent message', impact: -0.3 },
];
