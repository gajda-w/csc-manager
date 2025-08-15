import type { z } from "zod";

export type AnyZodSchema =
  | z.ZodIntersection<z.ZodTypeAny, z.ZodTypeAny>
  | z.Schema
  | z.ZodObject;
