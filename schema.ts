import { pgTable, text, serial, integer, timestamp, boolean, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const departments = pgTable("departments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role", { enum: ["admin", "employee"] }).notNull().default("employee"),
  departmentId: integer("department_id"),
  position: text("position"),
  gender: text("gender", { enum: ["male", "female"] }),
  dateOfBirth: timestamp("date_of_birth"),
  joinDate: timestamp("join_date"),
  education: text("education", { enum: ["sma", "smk", "d3", "s1", "s2", "s3"] }),
  avatar: text("avatar"),
  address: text("address"),
  phone: text("phone"),
  email: text("email"),
});

export const shifts = pgTable("shifts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  startTime: text("start_time").notNull(), // Format: HH:mm
  endTime: text("end_time").notNull(), // Format: HH:mm
  allowedLocations: text("allowed_locations").array(),
});

export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  shiftId: integer("shift_id").notNull(),
  checkInTime: timestamp("check_in_time").notNull(),
  checkOutTime: timestamp("check_out_time"),
  checkInPhoto: text("check_in_photo").notNull(),
  checkOutPhoto: text("check_out_photo"),
  checkInLocation: text("check_in_location").notNull(), // Format: lat,lng
  checkOutLocation: text("check_out_location"),
  status: text("status", { enum: ["present", "late", "absent"] }).notNull(),
  notes: text("notes"),
  approved: boolean("approved").default(false),
});

export const leaves = pgTable("leaves", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  reason: text("reason").notNull(),
  status: text("status", { enum: ["pending", "approved", "rejected"] }).notNull().default("pending"),
  approvedBy: integer("approved_by"),
  approvedAt: timestamp("approved_at"),
  attachments: text("attachments"),
});

export const payrolls = pgTable("payrolls", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  period: text("period").notNull(), // Format: YYYY-MM
  basicSalary: numeric("basic_salary").notNull(),
  allowances: numeric("allowances").default("0"),
  overtime: numeric("overtime").default("0"),
  deductions: numeric("deductions").default("0"),
  tax: numeric("tax").default("0"),
  netSalary: numeric("net_salary").notNull(),
  status: text("status", { enum: ["pending", "paid"] }).notNull().default("pending"),
  paidAt: timestamp("paid_at"),
  notes: text("notes"),
});

export const timeline = pgTable("timeline", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  image: text("image"),
  isAnnouncement: boolean("is_announcement").default(false),
});

export const timelineLikes = pgTable("timeline_likes", {
  id: serial("id").primaryKey(),
  timelineId: integer("timeline_id").notNull(),
  userId: integer("user_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const timelineComments = pgTable("timeline_comments", {
  id: serial("id").primaryKey(),
  timelineId: integer("timeline_id").notNull(),
  userId: integer("user_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertDepartmentSchema = createInsertSchema(departments).omit({ id: true });
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertShiftSchema = createInsertSchema(shifts).omit({ id: true });
export const insertAttendanceSchema = createInsertSchema(attendance).omit({ id: true });
export const insertLeaveSchema = createInsertSchema(leaves).omit({ id: true });
export const insertPayrollSchema = createInsertSchema(payrolls).omit({ id: true });
export const insertTimelineSchema = createInsertSchema(timeline).omit({ id: true });
export const insertTimelineLikeSchema = createInsertSchema(timelineLikes).omit({ id: true });
export const insertTimelineCommentSchema = createInsertSchema(timelineComments).omit({ id: true });

export type Department = typeof departments.$inferSelect;
export type InsertDepartment = z.infer<typeof insertDepartmentSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Shift = typeof shifts.$inferSelect;
export type InsertShift = z.infer<typeof insertShiftSchema>;
export type Attendance = typeof attendance.$inferSelect;
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;
export type Leave = typeof leaves.$inferSelect;
export type InsertLeave = z.infer<typeof insertLeaveSchema>;
export type Payroll = typeof payrolls.$inferSelect;
export type InsertPayroll = z.infer<typeof insertPayrollSchema>;
export type Timeline = typeof timeline.$inferSelect;
export type InsertTimeline = z.infer<typeof insertTimelineSchema>;
export type TimelineLike = typeof timelineLikes.$inferSelect;
export type InsertTimelineLike = z.infer<typeof insertTimelineLikeSchema>;
export type TimelineComment = typeof timelineComments.$inferSelect;
export type InsertTimelineComment = z.infer<typeof insertTimelineCommentSchema>;
