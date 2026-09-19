import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const teams = mysqlTable("teams", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  timezone: varchar("timezone", { length: 64 }).default("Asia/Dhaka").notNull(),
  createdById: int("createdById").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const teamMembers = mysqlTable("teamMembers", {
  id: int("id").autoincrement().primaryKey(),
  teamId: int("teamId").notNull(),
  userId: int("userId").notNull(),
  role: mysqlEnum("role", ["owner", "admin", "agent", "finance", "operations"]).default("agent").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const customers = mysqlTable("customers", {
  id: int("id").autoincrement().primaryKey(),
  teamId: int("teamId").notNull(),
  name: varchar("name", { length: 160 }).notNull(),
  phone: varchar("phone", { length: 32 }),
  email: varchar("email", { length: 320 }),
  passportNo: varchar("passportNo", { length: 32 }),
  status: mysqlEnum("status", ["active", "inactive", "vip"]).default("active").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const suppliers = mysqlTable("suppliers", {
  id: int("id").autoincrement().primaryKey(),
  teamId: int("teamId").notNull(),
  name: varchar("name", { length: 160 }).notNull(),
  supplierType: varchar("supplierType", { length: 80 }).default("DMC").notNull(),
  contactPhone: varchar("contactPhone", { length: 32 }),
  email: varchar("email", { length: 320 }),
  status: mysqlEnum("status", ["active", "preferred", "pending"]).default("active").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const bookings = mysqlTable("bookings", {
  id: int("id").autoincrement().primaryKey(),
  teamId: int("teamId").notNull(),
  customerId: int("customerId").notNull(),
  supplierId: int("supplierId"),
  assignedToId: int("assignedToId"),
  bookingNo: varchar("bookingNo", { length: 40 }).notNull().unique(),
  serviceType: varchar("serviceType", { length: 80 }).notNull(),
  destination: varchar("destination", { length: 160 }),
  status: mysqlEnum("status", ["enquiry", "quoted", "negotiation", "confirmed", "ticketed", "completed", "cancelled"]).default("enquiry").notNull(),
  travelDate: timestamp("travelDate"),
  quoteAmount: int("quoteAmount").default(0).notNull(),
  costAmount: int("costAmount").default(0).notNull(),
  paidAmount: int("paidAmount").default(0).notNull(),
  currency: varchar("currency", { length: 8 }).default("BDT").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const visaCases = mysqlTable("visaCases", {
  id: int("id").autoincrement().primaryKey(),
  teamId: int("teamId").notNull(),
  customerId: int("customerId").notNull(),
  assignedToId: int("assignedToId"),
  applicationNo: varchar("applicationNo", { length: 40 }).notNull().unique(),
  country: varchar("country", { length: 100 }).notNull(),
  visaType: varchar("visaType", { length: 100 }).notNull(),
  status: mysqlEnum("status", ["lead", "documents_pending", "in_review", "submitted", "approved", "rejected", "completed"]).default("lead").notNull(),
  appointmentDate: timestamp("appointmentDate"),
  decisionDate: timestamp("decisionDate"),
  serviceFee: int("serviceFee").default(0).notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const financialEntries = mysqlTable("financialEntries", {
  id: int("id").autoincrement().primaryKey(),
  teamId: int("teamId").notNull(),
  bookingId: int("bookingId"),
  type: mysqlEnum("type", ["income", "expense", "payment", "refund"]).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  amount: int("amount").notNull(),
  currency: varchar("currency", { length: 8 }).default("BDT").notNull(),
  occurredAt: timestamp("occurredAt").defaultNow().notNull(),
  notes: text("notes"),
  createdById: int("createdById").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const invoices = mysqlTable("invoices", {
  id: int("id").autoincrement().primaryKey(),
  teamId: int("teamId").notNull(),
  customerId: int("customerId").notNull(),
  bookingId: int("bookingId"),
  invoiceNo: varchar("invoiceNo", { length: 40 }).notNull().unique(),
  status: mysqlEnum("status", ["draft", "sent", "partially_paid", "paid", "overdue", "void"]).default("draft").notNull(),
  subtotal: int("subtotal").default(0).notNull(),
  tax: int("tax").default(0).notNull(),
  total: int("total").default(0).notNull(),
  dueAmount: int("dueAmount").default(0).notNull(),
  issueDate: timestamp("issueDate").defaultNow().notNull(),
  dueDate: timestamp("dueDate"),
  notes: text("notes"),
  createdById: int("createdById").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const documents = mysqlTable("documents", {
  id: int("id").autoincrement().primaryKey(),
  teamId: int("teamId").notNull(),
  customerId: int("customerId"),
  visaCaseId: int("visaCaseId"),
  bookingId: int("bookingId"),
  fileKey: varchar("fileKey", { length: 512 }).notNull(),
  fileUrl: varchar("fileUrl", { length: 700 }).notNull(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  mimeType: varchar("mimeType", { length: 120 }).notNull(),
  sizeBytes: int("sizeBytes").default(0).notNull(),
  uploadedById: int("uploadedById").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const followUps = mysqlTable("followUps", {
  id: int("id").autoincrement().primaryKey(),
  teamId: int("teamId").notNull(),
  customerId: int("customerId"),
  bookingId: int("bookingId"),
  channel: mysqlEnum("channel", ["whatsapp", "sms", "email", "call", "internal"]).default("whatsapp").notNull(),
  status: mysqlEnum("status", ["queued", "sent", "failed", "done"]).default("queued").notNull(),
  dueAt: timestamp("dueAt").notNull(),
  message: text("message").notNull(),
  createdById: int("createdById").notNull(),
  sentAt: timestamp("sentAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Team = typeof teams.$inferSelect;
export type Customer = typeof customers.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type VisaCase = typeof visaCases.$inferSelect;
export type Supplier = typeof suppliers.$inferSelect;
export type FinancialEntry = typeof financialEntries.$inferSelect;
export type Invoice = typeof invoices.$inferSelect;
export type Document = typeof documents.$inferSelect;
export type FollowUp = typeof followUps.$inferSelect;
