import Project from "../models/Project";
import User from "../models/User";
// Basic checks
export async function canAccessProject(userId: string, projectId: string) {
  const project = await Project.findById(projectId);

  if (!project) return false;

  const isMember = project.users.some(
    (id: any) => id.toString() === userId
  );

  return isMember;
}

export async function isProjectAdmin(userId: string, projectId: string) {
  const user = await User.findById(userId);

  if (!user) return false;

  return user.role === "admin";
}

// 🔥 Guard functions (paste HERE)
export async function requireProjectAccess(userId: string, projectId: string) {
  const allowed = await canAccessProject(userId, projectId);

  if (!allowed) {
    throw new Error("Unauthorized access to project");
  }
}

export async function requireAdmin(userId: string, projectId: string) {
  const isAdmin = await isProjectAdmin(userId, projectId);

  if (!isAdmin) {
    throw new Error("Admin access required");
  }
}