// Starter: minimal multi-file example
// Import from another file and use types.

import { toTitleCase } from './utils/strings';

export type User = {
  id: string;
  name: string;
};

export function greet(user: User) {
  const who = user.name ?? 'friend';
  return 'Hello, ' + toTitleCase(who) + '!';
}

const u: User = { id: '1', name: 'sarah' };
console.log(greet(u));

