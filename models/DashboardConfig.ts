import { Schema, model, models } from "mongoose";

const WidgetSchema = new Schema({
  type: String,
  label: String,
  value: String,
});

const SectionSchema = new Schema({
  title: String,
  widgets: [WidgetSchema],
});

const DashboardConfigSchema = new Schema({
  projectId: String, // ✅ FIXED (no ObjectId)
  sections: [SectionSchema],
});

const DashboardConfig =
  models.DashboardConfig || model("DashboardConfig", DashboardConfigSchema);

export default DashboardConfig;