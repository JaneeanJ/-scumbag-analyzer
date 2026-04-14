export { Portrait01 } from './Portrait01';
export { Portrait02 } from './Portrait02';
export { Portrait03 } from './Portrait03';
export { Portrait04 } from './Portrait04';
export { Portrait05 } from './Portrait05';
export { Portrait06 } from './Portrait06';
export { Portrait07 } from './Portrait07';
export { Portrait08 } from './Portrait08';

export const portraitComponents = [
  { id: 1, component: import('./Portrait01').then(m => m.Portrait01) },
  { id: 2, component: import('./Portrait02').then(m => m.Portrait02) },
  { id: 3, component: import('./Portrait03').then(m => m.Portrait03) },
  { id: 4, component: import('./Portrait04').then(m => m.Portrait04) },
  { id: 5, component: import('./Portrait05').then(m => m.Portrait05) },
  { id: 6, component: import('./Portrait06').then(m => m.Portrait06) },
  { id: 7, component: import('./Portrait07').then(m => m.Portrait07) },
  { id: 8, component: import('./Portrait08').then(m => m.Portrait08) },
];
