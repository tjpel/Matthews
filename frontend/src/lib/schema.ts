import { z } from "zod";

export const address = z.string().min(1, "This field is required");

export const property = z.object({
  netIncome: z.number().min(1),
  buildingSF: z.number().min(1),
  parkingSpaces: z.number(),
  studioUnits: z.number(),
  oneBedroomUnits: z.number(),
  twoBedroomUnits: z.number(),
  threeBedroomUnits: z.number()
});

export const estimator = z.object({
  address,
}).merge(property);

export type PropertyData = z.infer<typeof property>;
