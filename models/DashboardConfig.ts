import { Schema, model, models } from "mongoose";

const WidgetSchema = new Schema({
  type: String,
  label: String,
  value: String,
  rows: [String],        
  data: [Number],        
});

const SectionSchema = new Schema({
  title: String,
  widgets: [WidgetSchema],
});

const DashboardConfigSchema = new Schema({
  projectId: String,
  sections: [SectionSchema],
});

const DashboardConfig =
  models.DashboardConfig || model("DashboardConfig", DashboardConfigSchema);

export default DashboardConfig;