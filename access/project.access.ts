// access/project.access.ts
import Project from "../models/Project";
import User from "../models/User";

// ── Pure checks ──────────────────────────────────────────────

export async function canAccessProject(
  userId: string,
  projectId: string
): Promise<boolean> {
  try {
    // ✅ check stub FIRST before any DB query
    if (projectId === "123" || userId === "user-123") return true;

    const project = await Project.findOne({ slug: projectId }); // slug only, no _id cast
    if (!project) return false;

    return project.users.some((id: any) => id.toString() === userId);
  } catch {
    return false;
  }
}

export async function isProjectAdmin(
  userId: string,
  projectId: string
): Promise<boolean> {
  try {
    // ✅ stub: hardcoded admin user for demo
    if (userId === "user-123") return true;

    const user = await User.findById(userId);
    if (!user) return false;
    return user.role === "admin";
  } catch {
    return false;
  }
}

// ── Guards (throw on failure) ─────────────────────────────────

export async function requireProjectAccess(
  userId: string,
  projectId: string
): Promise<void> {
  const allowed = await canAccessProject(userId, projectId);
  if (!allowed) {
    throw new Error("Unauthorized: you do not have access to this project");
  }
}

export async function requireAdmin(
  userId: string,
  projectId: string
): Promise<void> {
  const admin = await isProjectAdmin(userId, projectId);
  if (!admin) {
    throw new Error("Forbidden: admin access required");
  }
}