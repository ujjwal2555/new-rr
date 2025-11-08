import { pgTable, text, integer, timestamp, decimal, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  loginId: text("login_id").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull(), // 'admin' | 'hr' | 'payroll' | 'employee'
  department: text("department").notNull(),
  mobile: text("mobile"),
  company: text("company"),
  manager: text("manager"),
  location: text("location"),
  yearOfJoining: integer("year_of_joining").notNull(),
  basicSalary: integer("basic_salary").notNull(),
  hra: integer("hra").notNull(),
  otherEarnings: integer("other_earnings").notNull(),
  annualLeave: integer("annual_leave").notNull().default(12),
  sickLeave: integer("sick_leave").notNull().default(6),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const attendance = pgTable("attendance", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  date: text("date").notNull(), // YYYY-MM-DD format
  inTime: text("in_time").notNull(),
  outTime: text("out_time"),
  status: text("status").notNull(), // 'Present' | 'Absent' | 'Half' | 'Leave'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const leaves = pgTable("leaves", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text("type").notNull(), // 'Annual' | 'Sick' | 'Casual'
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  reason: text("reason").notNull(),
  status: text("status").notNull(), // 'Pending' | 'Approved' | 'Rejected' | 'Cancelled'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const payruns = pgTable("payruns", {
  id: text("id").primaryKey(),
  month: text("month").notNull(), // YYYY-MM format
  generatedBy: text("generated_by").notNull().references(() => users.id),
  totalPayroll: integer("total_payroll").notNull(),
  items: json("items").notNull(), // Array of { userId, gross, deductions, net }
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const settings = pgTable("settings", {
  id: text("id").primaryKey(),
  pfPercent: decimal("pf_percent", { precision: 5, scale: 2 }).notNull(),
  professionalTax: integer("professional_tax").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  loginId: true,
  createdAt: true,
}).extend({
  password: z.string().optional(), // Password is optional in insert (will be auto-generated if not provided)
});

export const insertAttendanceSchema = createInsertSchema(attendance).omit({
  id: true,
  createdAt: true,
});

export const insertLeaveSchema = createInsertSchema(leaves).omit({
  id: true,
  createdAt: true,
});

export const insertPayrunSchema = createInsertSchema(payruns).omit({
  id: true,
  createdAt: true,
});

export const insertSettingsSchema = createInsertSchema(settings).omit({
  id: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Attendance = typeof attendance.$inferSelect;
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;

export type Leave = typeof leaves.$inferSelect;
export type InsertLeave = z.infer<typeof insertLeaveSchema>;

export type Payrun = typeof payruns.$inferSelect;
export type InsertPayrun = z.infer<typeof insertPayrunSchema>;

export type Settings = typeof settings.$inferSelect;
export type InsertSettings = z.infer<typeof insertSettingsSchema>;
