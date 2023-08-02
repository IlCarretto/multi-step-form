import { z } from "zod";

export const schemaStep1 = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(4, "Name must be at least 4 characters"),
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Email must be in a valid form" }),
  phone: z.number().optional(),
});

export const schemaStep2 = z.object({
  plan: z.object({
    planName: z.string(),
    price: z.number(),
  }),
});
