import { z } from "zod";

export const sendMessageSchema = z.object({
  userId: z.string().min(1),
  projectId: z.string().min(1),
  productInstanceId: z.string().min(1),
  message: z.string().min(1),
});