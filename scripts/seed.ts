import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log("✅ Connected to MongoDB");

  const db = mongoose.connection.db!;

  // Clear and reseed dashboardconfigs
  await db.collection("dashboardconfigs").deleteMany({});
  await db.collection("dashboardconfigs").insertOne({
    projectId: "123",
    sections: [
      {
        title: "Overview",
        widgets: [
          { type: "stats", label: "Total Users", value: "9999" },
          { type: "stats", label: "Revenue", value: "$5000" },
          { type: "table", label: "Recent Orders", rows: ["Order #1 - $120", "Order #2 - $340", "Order #3 - $89"] },
          { type: "chart", label: "Weekly Sales", data: [10, 25, 18, 40, 35, 55, 60] },
        ],
      },
    ],
  });
  console.log("✅ Seeded dashboardconfigs");

  // Clear and reseed productinstances
  await db.collection("productinstances").deleteMany({});
  await db.collection("productinstances").insertOne({
    projectId: "123",
    nameSpace: "sales-assistant",
    name: "AI Sales Assistant",
    productType: "chatbot",
    integrations: { shopify: true, crm: true },
  });
  console.log("✅ Seeded productinstances");

  // Clear and reseed projects
  await db.collection("projects").deleteMany({});
  await db.collection("projects").insertOne({
    name: "Demo Project",
    slug: "123",
    users: [],
  });
  console.log("✅ Seeded projects");

  // Clear and reseed users
  await db.collection("users").deleteMany({});
  await db.collection("users").insertOne({
    name: "Admin User",
    email: "admin@demo.com",
    role: "admin",
    projectIds: ["123"],
  });
  console.log("✅ Seeded users");

  console.log("🎉 All done!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});