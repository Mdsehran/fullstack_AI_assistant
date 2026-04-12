import { connectDB } from "@/lib/mongodb";
import DashboardConfig from "@/models/DashboardConfig";

export async function GET() {
  try {
    await connectDB();

    await DashboardConfig.deleteMany({});

    const config = await DashboardConfig.create({
      projectId: "123",
      sections: [
        {
          title: "Overview",
          widgets: [
            {
              type: "stats",
              label: "Total Users",
              value: "1200",
            },
            {
              type: "stats",
              label: "Revenue",
              value: "$5000",
            },
          ],
        },
      ],
    });

    return Response.json({
      message: "Seeded successfully",
      data: config,
    });
  } catch (error: any) {
    return Response.json({ error: error.message });
  }
}