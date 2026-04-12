import { connectDB } from "@/lib/mongodb";
import { getDashboardConfig } from "@/services/admin.service";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const projectId = searchParams.get("projectId")!;

    if (!projectId) {
      return Response.json({ error: "Missing params" }, { status: 400 });
    }

    const config = await getDashboardConfig(projectId);

    return Response.json({ data: config });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}