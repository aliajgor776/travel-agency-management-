var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// drizzle/schema.ts
var schema_exports = {};
__export(schema_exports, {
  bookings: () => bookings,
  customers: () => customers,
  documents: () => documents,
  financialEntries: () => financialEntries,
  followUps: () => followUps,
  invoices: () => invoices,
  suppliers: () => suppliers,
  teamMembers: () => teamMembers,
  teams: () => teams,
  users: () => users,
  visaCases: () => visaCases
});
import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar
} from "drizzle-orm/mysql-core";
var users, teams, teamMembers, customers, suppliers, bookings, visaCases, financialEntries, invoices, documents, followUps;
var init_schema = __esm({
  "drizzle/schema.ts"() {
    "use strict";
    users = mysqlTable("users", {
      id: int("id").autoincrement().primaryKey(),
      openId: varchar("openId", { length: 64 }).notNull().unique(),
      name: text("name"),
      email: varchar("email", { length: 320 }),
      loginMethod: varchar("loginMethod", { length: 64 }),
      role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
      lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull()
    });
    teams = mysqlTable("teams", {
      id: int("id").autoincrement().primaryKey(),
      name: varchar("name", { length: 160 }).notNull(),
      timezone: varchar("timezone", { length: 64 }).default("Asia/Dhaka").notNull(),
      createdById: int("createdById").notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    teamMembers = mysqlTable("teamMembers", {
      id: int("id").autoincrement().primaryKey(),
      teamId: int("teamId").notNull(),
      userId: int("userId").notNull(),
      role: mysqlEnum("role", ["owner", "admin", "agent", "finance", "operations"]).default("agent").notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    customers = mysqlTable("customers", {
      id: int("id").autoincrement().primaryKey(),
      teamId: int("teamId").notNull(),
      name: varchar("name", { length: 160 }).notNull(),
      phone: varchar("phone", { length: 32 }),
      email: varchar("email", { length: 320 }),
      passportNo: varchar("passportNo", { length: 32 }),
      status: mysqlEnum("status", ["active", "inactive", "vip"]).default("active").notNull(),
      notes: text("notes"),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    suppliers = mysqlTable("suppliers", {
      id: int("id").autoincrement().primaryKey(),
      teamId: int("teamId").notNull(),
      name: varchar("name", { length: 160 }).notNull(),
      supplierType: varchar("supplierType", { length: 80 }).default("DMC").notNull(),
      contactPhone: varchar("contactPhone", { length: 32 }),
      email: varchar("email", { length: 320 }),
      status: mysqlEnum("status", ["active", "preferred", "pending"]).default("active").notNull(),
      notes: text("notes"),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    bookings = mysqlTable("bookings", {
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
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    visaCases = mysqlTable("visaCases", {
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
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    financialEntries = mysqlTable("financialEntries", {
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
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    invoices = mysqlTable("invoices", {
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
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    documents = mysqlTable("documents", {
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
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    followUps = mysqlTable("followUps", {
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
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
  }
});

// server/_core/env.ts
var ENV;
var init_env = __esm({
  "server/_core/env.ts"() {
    "use strict";
    ENV = {
      appId: process.env.VITE_APP_ID ?? "",
      cookieSecret: process.env.JWT_SECRET ?? "",
      databaseUrl: process.env.DATABASE_URL ?? "",
      oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
      ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
      isProduction: process.env.NODE_ENV === "production",
      forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
      forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? ""
    };
  }
});

// server/db.ts
var db_exports = {};
__export(db_exports, {
  createBooking: () => createBooking,
  createCustomer: () => createCustomer,
  createDocument: () => createDocument,
  createFollowUp: () => createFollowUp,
  createInvoice: () => createInvoice,
  createVisaCase: () => createVisaCase,
  ensureDefaultTeam: () => ensureDefaultTeam,
  getDashboardSummary: () => getDashboardSummary,
  getDb: () => getDb,
  getTeamForUser: () => getTeamForUser,
  getUserByOpenId: () => getUserByOpenId,
  listBookings: () => listBookings,
  listCustomers: () => listCustomers,
  listDocuments: () => listDocuments,
  listFinancialEntries: () => listFinancialEntries,
  listFollowUps: () => listFollowUps,
  listInvoices: () => listInvoices,
  listSuppliers: () => listSuppliers,
  listVisaCases: () => listVisaCases,
  updateBooking: () => updateBooking,
  updateCustomer: () => updateCustomer,
  updateVisaCase: () => updateVisaCase,
  upsertUser: () => upsertUser
});
import { and, count, desc, eq, like, or, sum } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}
async function upsertUser(user) {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values = { openId: user.openId };
  const updateSet = {};
  const textFields = ["name", "email", "loginMethod"];
  for (const field of textFields) {
    if (user[field] !== void 0) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }
  values.lastSignedIn = user.lastSignedIn ?? /* @__PURE__ */ new Date();
  updateSet.lastSignedIn = values.lastSignedIn;
  if (user.role !== void 0 || user.openId === ENV.ownerOpenId) {
    values.role = user.role ?? "admin";
    updateSet.role = values.role;
  }
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}
async function ensureDefaultTeam(userId, preferredName) {
  const db = await getDb();
  if (!db) return null;
  const existing = await db.select({ team: teams }).from(teamMembers).innerJoin(teams, eq(teamMembers.teamId, teams.id)).where(eq(teamMembers.userId, userId)).limit(1);
  if (existing[0]?.team) return existing[0].team;
  const insertResult = await db.insert(teams).values({ name: preferredName ?? "My Travel Agency", createdById: userId });
  const teamId = Number(insertResult[0].insertId);
  await db.insert(teamMembers).values({ teamId, userId, role: "owner" });
  return (await db.select().from(teams).where(eq(teams.id, teamId)).limit(1))[0] ?? null;
}
async function getTeamForUser(userId) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select({ team: teams, memberRole: teamMembers.role }).from(teamMembers).innerJoin(teams, eq(teamMembers.teamId, teams.id)).where(eq(teamMembers.userId, userId)).limit(1);
  return result[0] ?? null;
}
function searchFilter(table, query) {
  if (!query) return void 0;
  if (table === customers) return or(like(customers.name, `%${query}%`), like(customers.phone, `%${query}%`), like(customers.email, `%${query}%`));
  if (table === bookings) return or(like(bookings.bookingNo, `%${query}%`), like(bookings.destination, `%${query}%`), like(bookings.serviceType, `%${query}%`));
  if (table === visaCases) return or(like(visaCases.applicationNo, `%${query}%`), like(visaCases.country, `%${query}%`), like(visaCases.visaType, `%${query}%`));
  return or(like(suppliers.name, `%${query}%`), like(suppliers.supplierType, `%${query}%`));
}
async function listCustomers(teamId, query) {
  const db = await getDb();
  if (!db) return [];
  const filter = searchFilter(customers, query);
  return db.select().from(customers).where(filter ? and(eq(customers.teamId, teamId), filter) : eq(customers.teamId, teamId)).orderBy(desc(customers.updatedAt)).limit(100);
}
async function createCustomer(input) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(customers).values(input);
  return (await db.select().from(customers).where(eq(customers.id, Number(result[0].insertId))).limit(1))[0] ?? null;
}
async function updateCustomer(id, teamId, input) {
  const db = await getDb();
  if (!db) return null;
  await db.update(customers).set(input).where(and(eq(customers.id, id), eq(customers.teamId, teamId)));
  return (await db.select().from(customers).where(and(eq(customers.id, id), eq(customers.teamId, teamId))).limit(1))[0] ?? null;
}
async function listBookings(teamId, query, status) {
  const db = await getDb();
  if (!db) return [];
  const filters = [eq(bookings.teamId, teamId)];
  const search = searchFilter(bookings, query);
  if (search) filters.push(search);
  if (status) filters.push(eq(bookings.status, status));
  return db.select({ booking: bookings, customer: customers }).from(bookings).leftJoin(customers, eq(bookings.customerId, customers.id)).where(and(...filters)).orderBy(desc(bookings.updatedAt)).limit(100);
}
async function createBooking(input) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(bookings).values(input);
  return (await db.select().from(bookings).where(eq(bookings.id, Number(result[0].insertId))).limit(1))[0] ?? null;
}
async function updateBooking(id, teamId, input) {
  const db = await getDb();
  if (!db) return null;
  await db.update(bookings).set(input).where(and(eq(bookings.id, id), eq(bookings.teamId, teamId)));
  return (await db.select().from(bookings).where(and(eq(bookings.id, id), eq(bookings.teamId, teamId))).limit(1))[0] ?? null;
}
async function listVisaCases(teamId, query, status) {
  const db = await getDb();
  if (!db) return [];
  const filters = [eq(visaCases.teamId, teamId)];
  const search = searchFilter(visaCases, query);
  if (search) filters.push(search);
  if (status) filters.push(eq(visaCases.status, status));
  return db.select({ visaCase: visaCases, customer: customers }).from(visaCases).leftJoin(customers, eq(visaCases.customerId, customers.id)).where(and(...filters)).orderBy(desc(visaCases.updatedAt)).limit(100);
}
async function createVisaCase(input) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(visaCases).values(input);
  return (await db.select().from(visaCases).where(eq(visaCases.id, Number(result[0].insertId))).limit(1))[0] ?? null;
}
async function updateVisaCase(id, teamId, input) {
  const db = await getDb();
  if (!db) return null;
  await db.update(visaCases).set(input).where(and(eq(visaCases.id, id), eq(visaCases.teamId, teamId)));
  return (await db.select().from(visaCases).where(and(eq(visaCases.id, id), eq(visaCases.teamId, teamId))).limit(1))[0] ?? null;
}
async function listSuppliers(teamId, query) {
  const db = await getDb();
  if (!db) return [];
  const filter = searchFilter(suppliers, query);
  return db.select().from(suppliers).where(filter ? and(eq(suppliers.teamId, teamId), filter) : eq(suppliers.teamId, teamId)).orderBy(desc(suppliers.updatedAt)).limit(100);
}
async function listInvoices(teamId, status) {
  const db = await getDb();
  if (!db) return [];
  const filters = [eq(invoices.teamId, teamId)];
  if (status) filters.push(eq(invoices.status, status));
  return db.select({ invoice: invoices, customer: customers }).from(invoices).leftJoin(customers, eq(invoices.customerId, customers.id)).where(and(...filters)).orderBy(desc(invoices.createdAt)).limit(100);
}
async function createInvoice(input) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(invoices).values(input);
  return (await db.select().from(invoices).where(eq(invoices.id, Number(result[0].insertId))).limit(1))[0] ?? null;
}
async function listFinancialEntries(teamId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(financialEntries).where(eq(financialEntries.teamId, teamId)).orderBy(desc(financialEntries.occurredAt)).limit(100);
}
async function listFollowUps(teamId, status) {
  const db = await getDb();
  if (!db) return [];
  const filters = [eq(followUps.teamId, teamId)];
  if (status) filters.push(eq(followUps.status, status));
  return db.select({ followUp: followUps, customer: customers }).from(followUps).leftJoin(customers, eq(followUps.customerId, customers.id)).where(and(...filters)).orderBy(desc(followUps.dueAt)).limit(100);
}
async function createFollowUp(input) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(followUps).values(input);
  return (await db.select().from(followUps).where(eq(followUps.id, Number(result[0].insertId))).limit(1))[0] ?? null;
}
async function listDocuments(teamId, visaCaseId) {
  const db = await getDb();
  if (!db) return [];
  const filters = [eq(documents.teamId, teamId)];
  if (visaCaseId) filters.push(eq(documents.visaCaseId, visaCaseId));
  return db.select().from(documents).where(and(...filters)).orderBy(desc(documents.createdAt)).limit(100);
}
async function createDocument(input) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(documents).values(input);
  return (await db.select().from(documents).where(eq(documents.id, Number(result[0].insertId))).limit(1))[0] ?? null;
}
async function getDashboardSummary(teamId) {
  const db = await getDb();
  if (!db) return null;
  const [bookingStats, customerStats, visaStats, invoiceStats] = await Promise.all([
    db.select({ count: count(bookings.id), revenue: sum(bookings.quoteAmount), cost: sum(bookings.costAmount), paid: sum(bookings.paidAmount) }).from(bookings).where(eq(bookings.teamId, teamId)),
    db.select({ count: count(customers.id) }).from(customers).where(eq(customers.teamId, teamId)),
    db.select({ count: count(visaCases.id) }).from(visaCases).where(eq(visaCases.teamId, teamId)),
    db.select({ due: sum(invoices.dueAmount) }).from(invoices).where(eq(invoices.teamId, teamId))
  ]);
  const bookingRow = bookingStats[0];
  return {
    activeBookings: Number(bookingRow?.count ?? 0),
    revenue: Number(bookingRow?.revenue ?? 0),
    cost: Number(bookingRow?.cost ?? 0),
    paid: Number(bookingRow?.paid ?? 0),
    grossProfit: Number(bookingRow?.revenue ?? 0) - Number(bookingRow?.cost ?? 0),
    customers: Number(customerStats[0]?.count ?? 0),
    visaCases: Number(visaStats[0]?.count ?? 0),
    outstanding: Number(invoiceStats[0]?.due ?? 0)
  };
}
var _db;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    init_env();
    _db = null;
  }
});

// server/_core/index.ts
import "dotenv/config";
import express2 from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var AXIOS_TIMEOUT_MS = 3e4;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";
var OAUTH_STATE_COOKIE = "__Host-oauth_state";
var decodeOAuthState = (state) => {
  let decoded;
  try {
    decoded = atob(state);
  } catch {
    return { redirectUri: "" };
  }
  try {
    const parsed = JSON.parse(decoded);
    if (parsed && typeof parsed.redirectUri === "string") return parsed;
  } catch {
  }
  return { redirectUri: decoded };
};

// server/_core/oauth.ts
init_db();
import { parse as parseCookieHeader2 } from "cookie";

// server/_core/cookies.ts
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getSessionCookieOptions(req) {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: isSecureRequest(req)
  };
}

// shared/_core/errors.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
};
var ForbiddenError = (msg) => new HttpError(403, msg);

// server/_core/sdk.ts
init_db();
init_env();
import axios from "axios";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
var isNonEmptyString = (value) => typeof value === "string" && value.length > 0;
var EXCHANGE_TOKEN_PATH = `/webdev.v1.WebDevAuthPublicService/ExchangeToken`;
var GET_USER_INFO_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfo`;
var GET_USER_INFO_WITH_JWT_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt`;
var OAuthService = class {
  constructor(client) {
    this.client = client;
    console.log("[OAuth] Initialized with baseURL:", ENV.oAuthServerUrl);
    if (!ENV.oAuthServerUrl) {
      console.error(
        "[OAuth] ERROR: OAUTH_SERVER_URL is not configured! Set OAUTH_SERVER_URL environment variable."
      );
    }
  }
  decodeState(state) {
    return decodeOAuthState(state).redirectUri;
  }
  async getTokenByCode(code, state) {
    const payload = {
      clientId: ENV.appId,
      grantType: "authorization_code",
      code,
      redirectUri: this.decodeState(state)
    };
    const { data } = await this.client.post(
      EXCHANGE_TOKEN_PATH,
      payload
    );
    return data;
  }
  async getUserInfoByToken(token) {
    const { data } = await this.client.post(
      GET_USER_INFO_PATH,
      {
        accessToken: token.accessToken
      }
    );
    return data;
  }
};
var createOAuthHttpClient = () => axios.create({
  baseURL: ENV.oAuthServerUrl,
  timeout: AXIOS_TIMEOUT_MS
});
var SDKServer = class {
  client;
  oauthService;
  constructor(client = createOAuthHttpClient()) {
    this.client = client;
    this.oauthService = new OAuthService(this.client);
  }
  deriveLoginMethod(platforms, fallback) {
    if (fallback && fallback.length > 0) return fallback;
    if (!Array.isArray(platforms) || platforms.length === 0) return null;
    const set = new Set(
      platforms.filter((p) => typeof p === "string")
    );
    if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
    if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
    if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
    if (set.has("REGISTERED_PLATFORM_MICROSOFT") || set.has("REGISTERED_PLATFORM_AZURE"))
      return "microsoft";
    if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
    const first = Array.from(set)[0];
    return first ? first.toLowerCase() : null;
  }
  /**
   * Exchange OAuth authorization code for access token
   * @example
   * const tokenResponse = await sdk.exchangeCodeForToken(code, state);
   */
  async exchangeCodeForToken(code, state) {
    return this.oauthService.getTokenByCode(code, state);
  }
  /**
   * Get user information using access token
   * @example
   * const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
   */
  async getUserInfo(accessToken) {
    const data = await this.oauthService.getUserInfoByToken({
      accessToken
    });
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  parseCookies(cookieHeader) {
    if (!cookieHeader) {
      return /* @__PURE__ */ new Map();
    }
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }
  getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }
  /**
   * Create a session token for a Manus user openId
   * @example
   * const sessionToken = await sdk.createSessionToken(userInfo.openId);
   */
  async createSessionToken(openId, options = {}) {
    return this.signSession(
      {
        openId,
        appId: ENV.appId,
        name: options.name || ""
      },
      options
    );
  }
  async signSession(payload, options = {}) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
    const secretKey = this.getSessionSecret();
    return new SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name
    }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
  }
  async verifySession(cookieValue) {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"]
      });
      const { openId, appId, name } = payload;
      if (!isNonEmptyString(openId) || !isNonEmptyString(appId) || !isNonEmptyString(name)) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }
      return {
        openId,
        appId,
        name
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }
  async getUserInfoWithJwt(jwtToken) {
    const payload = {
      jwtToken,
      projectId: ENV.appId
    };
    const { data } = await this.client.post(
      GET_USER_INFO_WITH_JWT_PATH,
      payload
    );
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  async authenticateRequest(req) {
    const cookies = this.parseCookies(req.headers.cookie);
    let sessionToken = cookies.get(COOKIE_NAME);
    if (!sessionToken) {
      const authHeader = req.headers.authorization;
      if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
        sessionToken = authHeader.slice(7);
      }
    }
    const session = await this.verifySession(sessionToken);
    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }
    if (session.openId.startsWith(CRON_OPEN_ID_PREFIX)) {
      const userInfo = await this.getUserInfoWithJwt(sessionToken ?? "");
      const taskUid = userInfo.taskUid ?? null;
      if (!taskUid) {
        throw ForbiddenError("Cron session missing task_uid");
      }
      return buildCronUser(userInfo);
    }
    const sessionUserId = session.openId;
    const signedInAt = /* @__PURE__ */ new Date();
    let user = await getUserByOpenId(sessionUserId);
    if (!user) {
      try {
        const userInfo = await this.getUserInfoWithJwt(sessionToken ?? "");
        await upsertUser({
          openId: userInfo.openId,
          name: userInfo.name || null,
          email: userInfo.email ?? null,
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
          lastSignedIn: signedInAt
        });
        user = await getUserByOpenId(userInfo.openId);
      } catch (error) {
        console.error("[Auth] Failed to sync user from OAuth:", error);
        throw ForbiddenError("Failed to sync user info");
      }
    }
    if (!user) {
      throw ForbiddenError("User not found");
    }
    await upsertUser({
      openId: user.openId,
      lastSignedIn: signedInAt
    });
    return user;
  }
};
var CRON_OPEN_ID_PREFIX = "cron_";
function buildCronUser(userInfo) {
  const now = /* @__PURE__ */ new Date();
  return {
    id: -1,
    openId: userInfo.openId,
    name: userInfo.name || "Manus Scheduled Task",
    email: null,
    loginMethod: null,
    role: "user",
    createdAt: now,
    updatedAt: now,
    lastSignedIn: now,
    taskUid: userInfo.taskUid ?? void 0,
    isCron: true
  };
}
var sdk = new SDKServer();

// server/_core/oauth.ts
function getQueryParam(req, key) {
  const value = req.query[key];
  return typeof value === "string" ? value : void 0;
}
function registerOAuthRoutes(app) {
  app.get("/api/oauth/callback", async (req, res) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }
    const { nonce } = decodeOAuthState(state);
    const expectedNonce = parseCookieHeader2(req.headers.cookie ?? "")[OAUTH_STATE_COOKIE];
    if (!nonce || nonce !== expectedNonce) {
      res.status(403).json({ error: "invalid oauth state" });
      return;
    }
    res.clearCookie(OAUTH_STATE_COOKIE, { path: "/", secure: true, sameSite: "none" });
    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }
      await upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: /* @__PURE__ */ new Date()
      });
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}

// server/_core/storageProxy.ts
init_env();
function registerStorageProxy(app) {
  app.get("/manus-storage/*", async (req, res) => {
    const key = req.params[0];
    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }
    if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
      res.status(500).send("Storage proxy not configured");
      return;
    }
    try {
      const forgeUrl = new URL(
        "v1/storage/presign/get",
        ENV.forgeApiUrl.replace(/\/+$/, "") + "/"
      );
      forgeUrl.searchParams.set("path", key);
      const forgeResp = await fetch(forgeUrl, {
        headers: { Authorization: `Bearer ${ENV.forgeApiKey}` }
      });
      if (!forgeResp.ok) {
        const body = await forgeResp.text().catch(() => "");
        console.error(`[StorageProxy] forge error: ${forgeResp.status} ${body}`);
        res.status(502).send("Storage backend error");
        return;
      }
      const { url } = await forgeResp.json();
      if (!url) {
        res.status(502).send("Empty signed URL from backend");
        return;
      }
      res.set("Cache-Control", "no-store");
      res.redirect(307, url);
    } catch (err) {
      console.error("[StorageProxy] failed:", err);
      res.status(502).send("Storage proxy error");
    }
  });
}

// server/routers.ts
import { and as and2, eq as eq2 } from "drizzle-orm";
import { TRPCError as TRPCError3 } from "@trpc/server";
import { z as z2 } from "zod";

// server/_core/systemRouter.ts
import { z } from "zod";

// server/_core/notification.ts
init_env();
import { TRPCError } from "@trpc/server";
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString2 = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString2(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString2(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/storage.ts
init_env();
function getForgeConfig() {
  const forgeUrl = ENV.forgeApiUrl;
  const forgeKey = ENV.forgeApiKey;
  if (!forgeUrl || !forgeKey) {
    throw new Error(
      "Storage config missing: set BUILT_IN_FORGE_API_URL and BUILT_IN_FORGE_API_KEY"
    );
  }
  return { forgeUrl: forgeUrl.replace(/\/+$/, ""), forgeKey };
}
function normalizeKey(relKey) {
  return relKey.replace(/^\/+/, "");
}
function appendHashSuffix(relKey) {
  const hash = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
  const lastDot = relKey.lastIndexOf(".");
  if (lastDot === -1) return `${relKey}_${hash}`;
  return `${relKey.slice(0, lastDot)}_${hash}${relKey.slice(lastDot)}`;
}
async function storagePut(relKey, data, contentType = "application/octet-stream") {
  const { forgeUrl, forgeKey } = getForgeConfig();
  const key = appendHashSuffix(normalizeKey(relKey));
  const presignUrl = new URL("v1/storage/presign/put", forgeUrl + "/");
  presignUrl.searchParams.set("path", key);
  const presignResp = await fetch(presignUrl, {
    headers: { Authorization: `Bearer ${forgeKey}` }
  });
  if (!presignResp.ok) {
    const msg = await presignResp.text().catch(() => presignResp.statusText);
    throw new Error(`Storage presign failed (${presignResp.status}): ${msg}`);
  }
  const { url: s3Url } = await presignResp.json();
  if (!s3Url) throw new Error("Forge returned empty presign URL");
  const blob = typeof data === "string" ? new Blob([data], { type: contentType }) : new Blob([data], { type: contentType });
  const uploadResp = await fetch(s3Url, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: blob
  });
  if (!uploadResp.ok) {
    throw new Error(`Storage upload to S3 failed (${uploadResp.status})`);
  }
  return { key, url: `/manus-storage/${key}` };
}

// server/routers.ts
init_db();
var dateInput = z2.coerce.date().optional();
var statusInput = z2.string().optional();
async function requireTeam(userId, userName) {
  const current = await getTeamForUser(userId);
  if (current) return current;
  const team = await ensureDefaultTeam(userId, userName ? `${userName}'s Travel Desk` : "My Travel Agency");
  if (!team) throw new TRPCError3({ code: "INTERNAL_SERVER_ERROR", message: "Database is not configured yet." });
  return { team, memberRole: "owner" };
}
function parseEnum(value, allowed, fallback) {
  return value && allowed.includes(value) ? value : fallback;
}
var appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true };
    })
  }),
  workspace: router({
    me: protectedProcedure.query(async ({ ctx }) => requireTeam(ctx.user.id, ctx.user.name ?? void 0)),
    teamMembers: protectedProcedure.query(async ({ ctx }) => {
      const current = await requireTeam(ctx.user.id, ctx.user.name ?? void 0);
      const db = await Promise.resolve().then(() => (init_db(), db_exports)).then((module) => module.getDb());
      if (!db) return [];
      const { teamMembers: teamMembers2, users: users2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      return db.select({ member: teamMembers2, user: users2 }).from(teamMembers2).innerJoin(users2, eq2(teamMembers2.userId, users2.id)).where(eq2(teamMembers2.teamId, current.team.id));
    }),
    updateMemberRole: adminProcedure.input(z2.object({ userId: z2.number().int(), role: z2.enum(["admin", "agent", "finance", "operations"]) })).mutation(async ({ ctx, input }) => {
      const current = await requireTeam(ctx.user.id, ctx.user.name ?? void 0);
      const db = await Promise.resolve().then(() => (init_db(), db_exports)).then((module) => module.getDb());
      if (!db) throw new TRPCError3({ code: "INTERNAL_SERVER_ERROR", message: "Database is not configured yet." });
      const { teamMembers: teamMembers2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      await db.update(teamMembers2).set({ role: input.role }).where(and2(eq2(teamMembers2.teamId, current.team.id), eq2(teamMembers2.userId, input.userId)));
      return { success: true };
    })
  }),
  dashboard: router({
    summary: protectedProcedure.query(async ({ ctx }) => {
      const current = await requireTeam(ctx.user.id, ctx.user.name ?? void 0);
      return getDashboardSummary(current.team.id);
    })
  }),
  customers: router({
    list: protectedProcedure.input(z2.object({ query: z2.string().optional() }).optional()).query(async ({ ctx, input }) => {
      const current = await requireTeam(ctx.user.id, ctx.user.name ?? void 0);
      return listCustomers(current.team.id, input?.query);
    }),
    create: protectedProcedure.input(z2.object({ name: z2.string().min(2), phone: z2.string().optional(), email: z2.string().email().optional().or(z2.literal("")), passportNo: z2.string().optional(), status: z2.enum(["active", "inactive", "vip"]).default("active"), notes: z2.string().optional() })).mutation(async ({ ctx, input }) => {
      const current = await requireTeam(ctx.user.id, ctx.user.name ?? void 0);
      return createCustomer({ ...input, teamId: current.team.id });
    }),
    update: protectedProcedure.input(z2.object({ id: z2.number().int(), name: z2.string().min(2).optional(), phone: z2.string().optional(), email: z2.string().optional(), passportNo: z2.string().optional(), status: z2.enum(["active", "inactive", "vip"]).optional(), notes: z2.string().optional() })).mutation(async ({ ctx, input }) => {
      const current = await requireTeam(ctx.user.id, ctx.user.name ?? void 0);
      const { id, ...values } = input;
      return updateCustomer(id, current.team.id, values);
    })
  }),
  bookings: router({
    list: protectedProcedure.input(z2.object({ query: z2.string().optional(), status: statusInput }).optional()).query(async ({ ctx, input }) => {
      const current = await requireTeam(ctx.user.id, ctx.user.name ?? void 0);
      return listBookings(current.team.id, input?.query, parseEnum(input?.status, ["enquiry", "quoted", "negotiation", "confirmed", "ticketed", "completed", "cancelled"], "enquiry") === input?.status ? input?.status : void 0);
    }),
    create: protectedProcedure.input(z2.object({ customerId: z2.number().int(), bookingNo: z2.string().min(3), serviceType: z2.string().min(2), destination: z2.string().optional(), status: z2.enum(["enquiry", "quoted", "negotiation", "confirmed", "ticketed", "completed", "cancelled"]).default("enquiry"), travelDate: dateInput, quoteAmount: z2.number().int().nonnegative().default(0), costAmount: z2.number().int().nonnegative().default(0), paidAmount: z2.number().int().nonnegative().default(0), supplierId: z2.number().int().optional(), notes: z2.string().optional() })).mutation(async ({ ctx, input }) => {
      const current = await requireTeam(ctx.user.id, ctx.user.name ?? void 0);
      return createBooking({ ...input, teamId: current.team.id, assignedToId: ctx.user.id });
    }),
    update: protectedProcedure.input(z2.object({ id: z2.number().int(), status: z2.enum(["enquiry", "quoted", "negotiation", "confirmed", "ticketed", "completed", "cancelled"]).optional(), travelDate: dateInput, quoteAmount: z2.number().int().nonnegative().optional(), costAmount: z2.number().int().nonnegative().optional(), paidAmount: z2.number().int().nonnegative().optional(), notes: z2.string().optional() })).mutation(async ({ ctx, input }) => {
      const current = await requireTeam(ctx.user.id, ctx.user.name ?? void 0);
      const { id, ...values } = input;
      return updateBooking(id, current.team.id, values);
    })
  }),
  visas: router({
    list: protectedProcedure.input(z2.object({ query: z2.string().optional(), status: statusInput }).optional()).query(async ({ ctx, input }) => {
      const current = await requireTeam(ctx.user.id, ctx.user.name ?? void 0);
      return listVisaCases(current.team.id, input?.query, input?.status);
    }),
    create: protectedProcedure.input(z2.object({ customerId: z2.number().int(), applicationNo: z2.string().min(3), country: z2.string().min(2), visaType: z2.string().min(2), status: z2.enum(["lead", "documents_pending", "in_review", "submitted", "approved", "rejected", "completed"]).default("lead"), appointmentDate: dateInput, decisionDate: dateInput, serviceFee: z2.number().int().nonnegative().default(0), notes: z2.string().optional() })).mutation(async ({ ctx, input }) => {
      const current = await requireTeam(ctx.user.id, ctx.user.name ?? void 0);
      return createVisaCase({ ...input, teamId: current.team.id, assignedToId: ctx.user.id });
    }),
    update: protectedProcedure.input(z2.object({ id: z2.number().int(), status: z2.enum(["lead", "documents_pending", "in_review", "submitted", "approved", "rejected", "completed"]).optional(), appointmentDate: dateInput, decisionDate: dateInput, serviceFee: z2.number().int().nonnegative().optional(), notes: z2.string().optional() })).mutation(async ({ ctx, input }) => {
      const current = await requireTeam(ctx.user.id, ctx.user.name ?? void 0);
      const { id, ...values } = input;
      return updateVisaCase(id, current.team.id, values);
    })
  }),
  suppliers: router({
    list: protectedProcedure.input(z2.object({ query: z2.string().optional() }).optional()).query(async ({ ctx, input }) => {
      const current = await requireTeam(ctx.user.id, ctx.user.name ?? void 0);
      return listSuppliers(current.team.id, input?.query);
    })
  }),
  finance: router({
    entries: protectedProcedure.query(async ({ ctx }) => {
      const current = await requireTeam(ctx.user.id, ctx.user.name ?? void 0);
      return listFinancialEntries(current.team.id);
    })
  }),
  invoices: router({
    list: protectedProcedure.input(z2.object({ status: statusInput }).optional()).query(async ({ ctx, input }) => {
      const current = await requireTeam(ctx.user.id, ctx.user.name ?? void 0);
      return listInvoices(current.team.id, input?.status);
    }),
    create: protectedProcedure.input(z2.object({ customerId: z2.number().int(), invoiceNo: z2.string().min(3), bookingId: z2.number().int().optional(), status: z2.enum(["draft", "sent", "partially_paid", "paid", "overdue", "void"]).default("draft"), subtotal: z2.number().int().nonnegative(), tax: z2.number().int().nonnegative().default(0), total: z2.number().int().nonnegative(), dueAmount: z2.number().int().nonnegative(), dueDate: dateInput, notes: z2.string().optional() })).mutation(async ({ ctx, input }) => {
      const current = await requireTeam(ctx.user.id, ctx.user.name ?? void 0);
      return createInvoice({ ...input, teamId: current.team.id, createdById: ctx.user.id });
    })
  }),
  followUps: router({
    list: protectedProcedure.input(z2.object({ status: statusInput }).optional()).query(async ({ ctx, input }) => {
      const current = await requireTeam(ctx.user.id, ctx.user.name ?? void 0);
      return listFollowUps(current.team.id, input?.status);
    }),
    queue: protectedProcedure.input(z2.object({ customerId: z2.number().int().optional(), bookingId: z2.number().int().optional(), channel: z2.enum(["whatsapp", "sms", "email", "call", "internal"]).default("whatsapp"), dueAt: z2.coerce.date(), message: z2.string().min(2) })).mutation(async ({ ctx, input }) => {
      const current = await requireTeam(ctx.user.id, ctx.user.name ?? void 0);
      return createFollowUp({ ...input, teamId: current.team.id, createdById: ctx.user.id });
    })
  }),
  documents: router({
    list: protectedProcedure.input(z2.object({ visaCaseId: z2.number().int().optional() }).optional()).query(async ({ ctx, input }) => {
      const current = await requireTeam(ctx.user.id, ctx.user.name ?? void 0);
      return listDocuments(current.team.id, input?.visaCaseId);
    }),
    upload: protectedProcedure.input(z2.object({ customerId: z2.number().int().optional(), visaCaseId: z2.number().int().optional(), bookingId: z2.number().int().optional(), fileName: z2.string().min(1).max(255), mimeType: z2.string().min(1).max(120), sizeBytes: z2.number().int().positive().max(1e7), base64: z2.string().min(10) })).mutation(async ({ ctx, input }) => {
      const current = await requireTeam(ctx.user.id, ctx.user.name ?? void 0);
      const buffer = Buffer.from(input.base64, "base64");
      if (buffer.length > 1e7) throw new TRPCError3({ code: "PAYLOAD_TOO_LARGE", message: "Files must be 10MB or smaller." });
      const stored = await storagePut(`${current.team.id}/visa-documents/${Date.now()}-${input.fileName}`, buffer, input.mimeType);
      return createDocument({ teamId: current.team.id, customerId: input.customerId, visaCaseId: input.visaCaseId, bookingId: input.bookingId, fileKey: stored.key, fileUrl: stored.url, fileName: input.fileName, mimeType: input.mimeType, sizeBytes: buffer.length, uploadedById: ctx.user.id });
    })
  })
});

// server/_core/context.ts
async function createContext(opts) {
  let user = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// server/_core/vite.ts
import express from "express";
import fs2 from "fs";
import { nanoid } from "nanoid";
import path2 from "path";
import { createServer as createViteServer } from "vite";

// vite.config.ts
import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";
var PROJECT_ROOT = import.meta.dirname;
var LOG_DIR = path.join(PROJECT_ROOT, ".manus-logs");
var MAX_LOG_SIZE_BYTES = 1 * 1024 * 1024;
var TRIM_TARGET_BYTES = Math.floor(MAX_LOG_SIZE_BYTES * 0.6);
function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}
function trimLogFile(logPath, maxSize) {
  try {
    if (!fs.existsSync(logPath) || fs.statSync(logPath).size <= maxSize) {
      return;
    }
    const lines = fs.readFileSync(logPath, "utf-8").split("\n");
    const keptLines = [];
    let keptBytes = 0;
    const targetSize = TRIM_TARGET_BYTES;
    for (let i = lines.length - 1; i >= 0; i--) {
      const lineBytes = Buffer.byteLength(`${lines[i]}
`, "utf-8");
      if (keptBytes + lineBytes > targetSize) break;
      keptLines.unshift(lines[i]);
      keptBytes += lineBytes;
    }
    fs.writeFileSync(logPath, keptLines.join("\n"), "utf-8");
  } catch {
  }
}
function writeToLogFile(source, entries) {
  if (entries.length === 0) return;
  ensureLogDir();
  const logPath = path.join(LOG_DIR, `${source}.log`);
  const lines = entries.map((entry) => {
    const ts = (/* @__PURE__ */ new Date()).toISOString();
    return `[${ts}] ${JSON.stringify(entry)}`;
  });
  fs.appendFileSync(logPath, `${lines.join("\n")}
`, "utf-8");
  trimLogFile(logPath, MAX_LOG_SIZE_BYTES);
}
function vitePluginManusDebugCollector() {
  return {
    name: "manus-debug-collector",
    transformIndexHtml(html) {
      if (process.env.NODE_ENV === "production") {
        return html;
      }
      return {
        html,
        tags: [
          {
            tag: "script",
            attrs: {
              src: "/__manus__/debug-collector.js",
              defer: true
            },
            injectTo: "head"
          }
        ]
      };
    },
    configureServer(server) {
      server.middlewares.use("/__manus__/logs", (req, res, next) => {
        if (req.method !== "POST") {
          return next();
        }
        const handlePayload = (payload) => {
          if (payload.consoleLogs?.length > 0) {
            writeToLogFile("browserConsole", payload.consoleLogs);
          }
          if (payload.networkRequests?.length > 0) {
            writeToLogFile("networkRequests", payload.networkRequests);
          }
          if (payload.sessionEvents?.length > 0) {
            writeToLogFile("sessionReplay", payload.sessionEvents);
          }
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true }));
        };
        const reqBody = req.body;
        if (reqBody && typeof reqBody === "object") {
          try {
            handlePayload(reqBody);
          } catch (e) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: String(e) }));
          }
          return;
        }
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });
        req.on("end", () => {
          try {
            const payload = JSON.parse(body);
            handlePayload(payload);
          } catch (e) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: String(e) }));
          }
        });
      });
    }
  };
}
var plugins = [react(), tailwindcss(), jsxLocPlugin(), vitePluginManusRuntime(), vitePluginManusDebugCollector()];
var vite_config_default = defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    host: true,
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1"
    ],
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/_core/vite.ts
async function setupVite(app, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    server: serverOptions,
    appType: "custom"
  });
  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app) {
  const distPath = process.env.NODE_ENV === "development" ? path2.resolve(import.meta.dirname, "../..", "dist", "public") : path2.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app.use(express.static(distPath));
  app.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/_core/index.ts
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}
async function findAvailablePort(startPort = 3e3) {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}
async function startServer() {
  const app = express2();
  const server = createServer(app);
  app.use(express2.json({ limit: "50mb" }));
  app.use(express2.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext
    })
  );
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);
  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}
startServer().catch(console.error);
