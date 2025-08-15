import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { env } from '@/lib/env/env.ts';

export const db = drizzle(env('DATABASE_URL') ?? '');

// TODO, musze zrobić migracje bazy. tj postawic baze na postgressie i zrobic deno task db:push
// a potem zrobic query po posty zamiast zahardocodwanego
