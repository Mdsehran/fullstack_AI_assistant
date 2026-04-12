import DashboardConfig from "../models/DashboardConfig";

export async function getDashboardConfig(projectId: string) {
  const config = await DashboardConfig.findOne({ projectId });

  if (!config) {
    throw new Error("Dashboard config not found");
  }

  return config;
}