import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { sendMessageService } from "@/services/chat.service";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { userId, projectId, productInstanceId, message } = body;

    if (!message || !projectId || !productInstanceId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await sendMessageService({ projectId, productInstanceId, message });

    return NextResponse.json({ reply: result.reply, steps: result.steps });
  } catch (err: any) {
    console.error("Chat route error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}