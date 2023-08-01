import { z } from "zod";

const allFieldsRequired = (obj: Object) => {
  return Object.values(obj).every((value) => !!value);
};

export const schemaStep1 = z
  .object({
    name: z.string().min(4, "Name must be at least 4 characters"),
    email: z.string().email({ message: "Email must be in a valid form" }),
    phone: z.number().refine((value) => !isNaN(value), {
      message: "Phone must be a number",
    }),
  })
  .refine(allFieldsRequired, { message: "This field is required" });

export const schemaStep2 = z
  .object({
    plan: z.string().refine((value) => !!value, {
      message: "Please select at least one option",
      path: ["plan"],
    }),
  })
  .refine(allFieldsRequired, { message: "This field is required" });
