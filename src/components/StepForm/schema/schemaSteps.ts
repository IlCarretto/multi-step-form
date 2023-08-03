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

const planSchema = z.object({
  serviceName: z.string().nonempty(),
  price: z.number(),
});

export const schemaStep2 = z.object({
  plan: planSchema.optional().refine((val) => !!val, {
    message: "Please select a plan",
    path: ["plan"],
  }),
});
