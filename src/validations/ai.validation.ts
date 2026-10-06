import { z } from 'zod';

export const generateAiTripSchema = z.object({
  body: z.object({
    destination: z.string().optional(),
    days: z.number().min(1, 'Days must be at least 1').or(z.string().transform((val) => Number(val))),
    budget: z.number().min(0, 'Budget must be positive').or(z.string().transform((val) => Number(val))),
    travelStyle: z.string().optional().default('leisure'),
    tripDate: z.string().optional(),
  }),
});
