import { z } from 'zod';

import { baseConfigSchema } from '@/lib/config/schema.ts';
import { prepareConfig } from '@/lib/config/util.ts';

const configSchema = z
  .object({
    ALLOWED_DOMAINS: z.array(z.string()).default(['*']),
    SERVICE: z.string().default('handler'),
    SECRET_MANAGER_APP_CONFIG_PATH: z.string().optional(),
  })
  .and(baseConfigSchema);

export const APP_CONFIG = prepareConfig({
  name: 'handler',
  schema: configSchema,
});
