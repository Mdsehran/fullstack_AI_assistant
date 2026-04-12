import { connectDB } from "@/lib/mongodb";
import { sendMessageService } from "@/services/chat.service";
import { requireProjectAccess } from "@/access/project.access";
import { sendMessageSchema } from "@/schemas/chat.schema";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    // Zod validation
    const parsed = sendMessageSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        {error: parsed.error.issues },
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

    return Response.json({ success: true, data: result });

  } catch (error: any) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}