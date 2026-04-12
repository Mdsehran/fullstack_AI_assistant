import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { sendMessageService } from "@/services/chat.service";
import { requireProjectAccess } from "@/access/project.access";
import { z } from "zod";

const schema = z.object({
  userId: z.string().min(1),
  projectId: z.string().min(1),
  productInstanceId: z.string().min(1),
  message: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { userId, projectId, productInstanceId, message } = parsed.data;

    await requireProjectAccess(userId, projectId);

    const result = await sendMessageService({
      projectId,
      productInstanceId,
      message,
    });

    return NextResponse.json({ reply: result.reply, steps: result.steps });
  } catch (err: any) {
    console.error("Chat route error:", err.message);
    const status = err.message.startsWith("Unauthorized") ? 403 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}