import { z } from "zod";
export const schemaStep1 = z.object({
  name: z.string().min(4, "Name must be at least 4 characters"),
  email: z
    .string()
    .min(4, "Email must be at least 4 characters")
    .email()
    .refine((val) => val.endsWith(".com"), { message: "Email must be valid" }),
  phone: z.number().refine((value) => !isNaN(value), {
    message: "Phone must be a number",
  }),
});

export const schemaStep2 = z
  .object({
    selectedOption: z.string().refine((value) => !!value, {
      message: "Please select at least one option",
      path: ["selectedOption"],
    }),
  })
  .refine((data) => !!data.selectedOption, {
    message: "Please select at least one option",
  });
