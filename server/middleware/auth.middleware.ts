import { Request, Response, NextFunction } from "express";
import { User } from "../models/User.js";

export interface AuthenticatedRequest extends Request {
  auth?: {
    userId: string;
    sessionId?: string;
  };
  dbUser?: any;
}

export const authenticateUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // Check Authorization header or custom clerk header for preview/dev mode
    const authHeader = req.headers.authorization;
    const clerkIdHeader = req.headers["x-clerk-user-id"] || req.query.clerkId;

    let clerkId = "";

    if (authHeader && authHeader.startsWith("Bearer ")) {
      // In production, token verification or Clerk middleware can parse this.
      // For robust dev/preview fallback, extract or accept token.
      const token = authHeader.split(" ")[1];
      if (token && token.length > 10) {
        // If token is passed, we can map or decode, or if x-clerk-user-id is provided use it.
        clerkId = String(clerkIdHeader || "user_mock_clerk_id");
      }
    }

    if (clerkIdHeader) {
      clerkId = String(clerkIdHeader);
    }

    // Fallback default user for testing if no auth header in dev preview
    if (!clerkId && process.env.NODE_ENV !== "production") {
      clerkId = "user_default_dev_id";
    }

    if (!clerkId) {
      return res.status(401).json({ success: false, message: "Unauthorized: Missing authentication credentials" });
    }

    req.auth = { userId: clerkId };

    // Fetch user from MongoDB
    let user = await User.findOne({ clerkId });
    if (!user) {
      // Auto-sync or create if missing during development
      user = await User.create({
        clerkId,
        email: `${clerkId}@kaamsathi.test`,
        name: "KaamSathi User",
        role: "customer",
        profileCompleted: false
      });
    }

    req.dbUser = user;
    next();
  } catch (error: any) {
    return res.status(401).json({ success: false, message: "Authentication failed", error: error.message });
  }
};

export const requireRole = (allowedRoles: string | string[]) => {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.dbUser) {
      return res.status(401).json({ success: false, message: "Unauthorized: User not authenticated" });
    }

    if (!roles.includes(req.dbUser.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted to roles: ${roles.join(", ")}. Current role: ${req.dbUser.role}`
      });
    }

    next();
  };
};

export const requireCustomer = requireRole("customer");
export const requireWorker = requireRole("worker");
export const requireAdmin = requireRole("admin");

export const requireProfileCompletion = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.dbUser) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  if (!req.dbUser.profileCompleted) {
    return res.status(403).json({
      success: false,
      profileCompleted: false,
      message: "Profile completion required before accessing this resource"
    });
  }

  next();
};
