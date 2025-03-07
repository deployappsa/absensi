import type { Express, Request } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertShiftSchema, insertAttendanceSchema, insertLeaveSchema } from "@shared/schema";
import { z } from "zod";

// Extend session type to include our custom properties
declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}

// Extend request type to include our user property
interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    password: string;
    name: string;
    role: "admin" | "employee";
  };
}

export async function registerRoutes(app: Express) {
  const httpServer = createServer(app);

  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    const body = insertUserSchema.pick({ username: true, password: true }).parse(req.body);
    const user = await storage.getUserByUsername(body.username);

    if (!user || user.password !== body.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    req.session.userId = user.id;
    res.json({ user });
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ success: true });
    });
  });

  // Middleware to check auth
  const requireAuth = async (req: AuthRequest, res: any, next: any) => {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    next();
  };

  // User routes
  app.get("/api/users/me", requireAuth, (req: AuthRequest, res) => {
    res.json({ user: req.user });
  });

  app.get("/api/users", requireAuth, async (req: AuthRequest, res) => {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    const users = Array.from(storage.users.values());
    res.json({ users });
  });

  // Shift routes
  app.get("/api/shifts", requireAuth, async (_req, res) => {
    const shifts = await storage.listShifts();
    res.json({ shifts });
  });

  app.post("/api/shifts", requireAuth, async (req: AuthRequest, res) => {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    const shift = await storage.createShift(insertShiftSchema.parse(req.body));
    res.json({ shift });
  });

  // Attendance routes
  app.get("/api/attendance", requireAuth, async (req: AuthRequest, res) => {
    const records = await storage.listAttendanceByUser(req.user!.id);
    res.json({ records });
  });

  app.get("/api/attendance/pending", requireAuth, async (req: AuthRequest, res) => {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    const records = await storage.listPendingAttendance();
    res.json({ records });
  });

  app.post("/api/attendance/check-in", requireAuth, async (req: AuthRequest, res) => {
    const attendance = await storage.createAttendance({
      ...insertAttendanceSchema.parse(req.body),
      userId: req.user!.id,
    });
    res.json({ attendance });
  });

  app.post("/api/attendance/:id/check-out", requireAuth, async (req: AuthRequest, res) => {
    const id = z.number().parse(parseInt(req.params.id));
    const attendance = await storage.updateAttendance(id, req.body);
    res.json({ attendance });
  });

  app.patch("/api/attendance/:id/approve", requireAuth, async (req: AuthRequest, res) => {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    const id = z.number().parse(parseInt(req.params.id));
    const { approved } = z.object({ approved: z.boolean() }).parse(req.body);
    const attendance = await storage.updateAttendance(id, { approved });
    res.json({ attendance });
  });

  // Leave routes
  app.get("/api/leaves", requireAuth, async (req: AuthRequest, res) => {
    const leaves = await storage.listLeavesByUser(req.user!.id);
    res.json({ leaves });
  });

  app.post("/api/leaves", requireAuth, async (req: AuthRequest, res) => {
    const leave = await storage.createLeave({
      ...insertLeaveSchema.parse(req.body),
      userId: req.user!.id,
    });
    res.json({ leave });
  });

  app.patch("/api/leaves/:id", requireAuth, async (req: AuthRequest, res) => {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    const id = z.number().parse(parseInt(req.params.id));
    const leave = await storage.updateLeave(id, req.body);
    res.json({ leave });
  });

  return httpServer;
}