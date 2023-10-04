import { z } from "zod";

const geometrySchema = z.object({
  type: z.string(),
  coordinates: z.array(z.number())
});

export const addressSchema = z.object({
  address: z.object({
    latitude: z.number(),
    longitude: z.number(),
    geometry: geometrySchema,
    country: z.string(),
    countryCode: z.string(),
    countryFlag: z.string(),
    county: z.string(),
    distance: z.number(),
    city: z.string(),
    stateCode: z.string(),
    state: z.string(),
    layer: z.string(),
    formattedAddress: z.string(),
  })
  .refine(
    data => !!data.latitude && !!data.longitude, // Add your own validation logic here
    {
      message: "You must add a valid address", // Custom error message
    }
  ),
});

export const propertySchema = z.object({
  grossIncome: z.number().refine(value => value > 0, { message: "Required" }),
  bedrooms: z.number().refine(value => !isNaN(value), { message: "Required" }),
  bathrooms: z.number().refine(value => !isNaN(value), { message: "Required" }),
  size: z.number().refine(value => value > 0, { message: "Required" }),
  buildingSF: z.number().refine(value => value > 0, { message: "Required" }),
  numberOfUnits: z.number().refine(value => value > 0, { message: "Required" }),
  numberOfFloors: z.number().refine(value => value > 0, { message: "Required" }),
  pricePerACLand: z.number().refine(value => value > 0, { message: "Required" }),
  pricePerSFLand: z.number().refine(value => value > 0, { message: "Required" }),
  numberOf1BedroomsUnits: z.number().refine(value => value >= 0, { message: "Required" }),
  numberOf2BedroomsUnits: z.number().refine(value => value >= 0, { message: "Required" }),
  floorAreaRatio: z.number().refine(value => value > 0, { message: "Required" }),
  numberOfParkingSpaces: z.number().refine(value => value >= 0, { message: "Required" }),
  numberOfStudiosUnits: z.number().refine(value => value >= 0, { message: "Required" }),
  typicalFloorSF: z.number().refine(value => value > 0, { message: "Required" }),
  numberOf3BedroomsUnits: z.number().refine(value => value >= 0, { message: "Required" }),
  landAreaAC: z.number().refine(value => value > 0, { message: "Required" }),
  landAreaSF: z.number().refine(value => value > 0, { message: "Required" }),
  starRating: z.number().refine(value => value >= 0 && value <= 5, { message: "Rating must be between 0 and 5" }),
  netIncome: z.number().refine(value => value > 0, { message: "Required" }),
  yearBuilt: z.number().refine(value => value > 0, { message: "Required" }),
  age: z.number().refine(value => value >= 0, { message: "Required" }),
});

export const contactSchema = z.object({
  firstName: z.string().min(1, { message: "Required" }),
  lastName: z.string().min(1, { message: "Required" }),
  email: z.string().email({ message: "Required" }),
  phone: z.string().min(1, { message: "Required" }),
});