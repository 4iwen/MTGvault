import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const bcrypt = require('bcryptjs') as {
	hash(data: string, saltOrRounds: number | string): Promise<string>;
	compare(data: string, hash: string): Promise<boolean>;
};

export const hashPin = (pin: string) => bcrypt.hash(pin, 10);
export const verifyPin = (pin: string, hash: string) => bcrypt.compare(pin, hash);
