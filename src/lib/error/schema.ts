import { z } from "zod";

export const jsonErrorSchema = z.object({
  statusCode: z.number(),
  detail: z.string(),
  requestId: z.string().uuid().optional(),
  errors: z
    .array(
      z.object({
        code: z.string().optional(),
        context: z.any().optional(),
        path: z.string().optional(),
        message: z.string().optional(),
      }),
    )
    .optional(),
});

export type JsonError = z.infer<typeof jsonErrorSchema>;
