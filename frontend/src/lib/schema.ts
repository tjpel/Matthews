import { z } from "zod";

export const address = z.string().min(1, "This field is required");

function n(min: number): z.ZodNumber {
  return z.number({
    invalid_type_error: "Required field"
  }).min(min);
}

export const property = z.object({
  netIncome: n(1),
  buildingSF: n(1),
  parkingSpaces: n(0),
  studioUnits: n(0),
  oneBedroomUnits: n(0),
  twoBedroomUnits: n(0),
  threeBedroomUnits: n(0)
});

export type PropertyData = z.infer<typeof property>;
