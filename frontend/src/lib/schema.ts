import { z } from "zod";

export const NUM_MAX = 10**9; // 1B

const REQ = "This field is required";
const PHONE_REGEX = /^\(\d{3}\) \d{3}-\d{4}$/;

export const address = z.string().min(1, REQ);

function num(min: number): z.ZodNumber {
  return z.number({
    invalid_type_error: REQ
  }).min(min)
    .max(NUM_MAX);
}

export const property = z.object({
  netIncome: num(1),
  buildingSF: num(1),
  parkingSpaces: num(0),
  studioUnits: num(0),
  oneBedroomUnits: num(0),
  twoBedroomUnits: num(0),
  threeBedroomUnits: num(0)
});

export const contact = z.object({
  name: z.string().min(1, REQ),
  email: z.string().min(1, REQ).email(),
  phone: z.string().min(1, REQ).refine(s => s.match(PHONE_REGEX), "Invalid phone number"),
  message: z.string()
})

export type PropertyData = z.infer<typeof property>;
export type ContactData = z.infer<typeof contact>;
