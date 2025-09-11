// Multi-file starter: import across modules.

import { toTitleCase } from './utils/strings';
import { sum } from './utils/math';

export type User = {
  id: string;
  name: string;
  email?: string;
};

export function greet(user: User) {
  const who = user.name ?? 'friend';
  const greeting = 'Hello, ' + toTitleCase(who) + '!';
  const s = sum(20, 22);
  return greeting + ' (sum=' + s + ')';
}

const u: User = { id: '42', name: 'sarah' };
console.log(greet(u));

