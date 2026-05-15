import { z } from "zod";

/** Body of `POST /api/dealer/login`. */
export const DealerLoginSchema = z.object({
  phoneNumber: z
    .string()
    .trim()
    .regex(/^\+[1-9]\d{6,14}$/, {
      error: "Enter your phone number in international format, e.g. +919876543210.",
    }),
  dealerCode: z.string().trim().min(1, { error: "Dealer code is required." }),
  password: z.string().min(1, { error: "Password is required." }),
  deviceId: z.string().trim().min(1, { error: "Device identifier is missing." }),
  deviceLabel: z.string().trim().max(120).optional(),
});

export type DealerLoginInput = z.infer<typeof DealerLoginSchema>;
