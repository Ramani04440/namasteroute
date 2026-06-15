import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  boolean,
  json,
  index,
  unique,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extended with NamasteRoute-specific fields.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  
  // NamasteRoute-specific fields
  preferredLanguage: varchar("preferredLanguage", { length: 10 }).default("en"),
  theme: mysqlEnum("theme", ["light", "dark"]).default("light"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Saved places (favorites) for quick access
 */
export const savedPlaces = mysqlTable(
  "saved_places",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    label: varchar("label", { length: 255 }).notNull(), // "Home", "Office", etc.
    latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
    longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
    address: text("address"),
    placeId: varchar("placeId", { length: 255 }), // Google Places ID
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("saved_places_userId_idx").on(table.userId),
  })
);

export type SavedPlace = typeof savedPlaces.$inferSelect;
export type InsertSavedPlace = typeof savedPlaces.$inferInsert;

/**
 * Route data structure storing journey options
 */
export const routes = mysqlTable(
  "routes",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId"),
    
    // Journey endpoints
    originLatitude: decimal("originLatitude", { precision: 10, scale: 8 }).notNull(),
    originLongitude: decimal("originLongitude", { precision: 11, scale: 8 }).notNull(),
    originAddress: text("originAddress"),
    
    destinationLatitude: decimal("destinationLatitude", { precision: 10, scale: 8 }).notNull(),
    destinationLongitude: decimal("destinationLongitude", { precision: 11, scale: 8 }).notNull(),
    destinationAddress: text("destinationAddress"),
    
    // Route metrics
    durationMinutes: int("durationMinutes").notNull(),
    costInRupees: decimal("costInRupees", { precision: 8, scale: 2 }).notNull(),
    co2EmissionsGrams: decimal("co2EmissionsGrams", { precision: 10, scale: 2 }).notNull(),
    transferCount: int("transferCount").default(0),
    
    // Route composition
    modes: varchar("modes", { length: 255 }).notNull(), // "metro,bus,auto" as CSV
    segments: json("segments"), // Array of segment details
    
    // Safety & comfort
    safetyScore: decimal("safetyScore", { precision: 3, scale: 2 }), // 0-5
    comfortScore: decimal("comfortScore", { precision: 3, scale: 2 }), // 0-5
    womenSafeIndicator: boolean("womenSafeIndicator").default(false),
    
    // Metadata
    isFavorite: boolean("isFavorite").default(false),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("routes_userId_idx").on(table.userId),
    createdAtIdx: index("routes_createdAt_idx").on(table.createdAt),
  })
);

export type Route = typeof routes.$inferSelect;
export type InsertRoute = typeof routes.$inferInsert;

/**
 * Journey tracking - actual trips taken by users
 */
export const journeys = mysqlTable(
  "journeys",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    routeId: int("routeId"),
    
    // Journey state
    status: mysqlEnum("status", [
      "planned",
      "in_progress",
      "completed",
      "cancelled",
    ]).default("planned"),
    
    // Timing
    plannedStartTime: timestamp("plannedStartTime"),
    actualStartTime: timestamp("actualStartTime"),
    plannedEndTime: timestamp("plannedEndTime"),
    actualEndTime: timestamp("actualEndTime"),
    
    // Real-time tracking
    currentLatitude: decimal("currentLatitude", { precision: 10, scale: 8 }),
    currentLongitude: decimal("currentLongitude", { precision: 11, scale: 8 }),
    currentSegmentIndex: int("currentSegmentIndex").default(0),
    
    // Journey outcome
    actualDurationMinutes: int("actualDurationMinutes"),
    actualCostInRupees: decimal("actualCostInRupees", { precision: 8, scale: 2 }),
    delayMinutes: int("delayMinutes").default(0),
    
    // Sustainability tracking
    co2SavedGrams: decimal("co2SavedGrams", { precision: 10, scale: 2 }).default("0"),
    greenPointsEarned: int("greenPointsEarned").default(0),
    
    // User feedback
    rating: int("rating"), // 1-5
    feedback: text("feedback"),
    
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("journeys_userId_idx").on(table.userId),
    statusIdx: index("journeys_status_idx").on(table.status),
    createdAtIdx: index("journeys_createdAt_idx").on(table.createdAt),
  })
);

export type Journey = typeof journeys.$inferSelect;
export type InsertJourney = typeof journeys.$inferInsert;

/**
 * Safety data - incidents, alerts, and safety metrics
 */
export const safetyIncidents = mysqlTable(
  "safety_incidents",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId"),
    
    // Location
    latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
    longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
    area: varchar("area", { length: 255 }),
    
    // Incident details
    incidentType: varchar("incidentType", { length: 100 }).notNull(), // "crowding", "delay", "safety_concern", etc.
    severity: mysqlEnum("severity", ["low", "medium", "high"]).default("medium"),
    description: text("description"),
    
    // Context
    transportMode: varchar("transportMode", { length: 50 }), // "metro", "bus", "auto", etc.
    timeOfDay: varchar("timeOfDay", { length: 50 }), // "morning", "evening", "night"
    
    // Verification
    reportCount: int("reportCount").default(1),
    verified: boolean("verified").default(false),
    
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    expiresAt: timestamp("expiresAt"), // Auto-expire old incidents
  },
  (table) => ({
    locationIdx: index("safety_incidents_location_idx").on(table.latitude),
    createdAtIdx: index("safety_incidents_createdAt_idx").on(table.createdAt),
  })
);

export type SafetyIncident = typeof safetyIncidents.$inferSelect;
export type InsertSafetyIncident = typeof safetyIncidents.$inferInsert;

/**
 * Safety scores - computed metrics per area/mode/time
 */
export const safetyScores = mysqlTable(
  "safety_scores",
  {
    id: int("id").autoincrement().primaryKey(),
    
    // Location grid (approximate area)
    latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
    longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
    gridResolution: varchar("gridResolution", { length: 50 }).default("500m"), // Grid size
    
    // Context
    transportMode: varchar("transportMode", { length: 50 }).notNull(),
    timeOfDay: varchar("timeOfDay", { length: 50 }).notNull(), // "morning", "afternoon", "evening", "night"
    dayOfWeek: varchar("dayOfWeek", { length: 20 }), // "weekday", "weekend"
    
    // Score
    score: decimal("score", { precision: 3, scale: 2 }).notNull(), // 0-5
    womenSafeScore: decimal("womenSafeScore", { precision: 3, scale: 2 }), // 0-5
    incidentCount: int("incidentCount").default(0),
    
    // Metadata
    lastUpdated: timestamp("lastUpdated").defaultNow().onUpdateNow().notNull(),
    expiresAt: timestamp("expiresAt"), // Refresh periodically
  },
  (table) => ({
    locationModeTimeIdx: unique("safety_scores_unique").on(
      table.latitude
    ),
  })
);

export type SafetyScore = typeof safetyScores.$inferSelect;
export type InsertSafetyScore = typeof safetyScores.$inferInsert;

/**
 * Rewards and gamification
 */
export const userRewards = mysqlTable(
  "user_rewards",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().unique(),
    
    // Points & coins
    totalGreenPoints: int("totalGreenPoints").default(0),
    totalGreenCoins: decimal("totalGreenCoins", { precision: 10, scale: 2 }).default("0"),
    
    // Streaks
    currentStreak: int("currentStreak").default(0),
    longestStreak: int("longestStreak").default(0),
    lastStreakDate: timestamp("lastStreakDate"),
    
    // Achievements
    badges: json("badges"), // Array of badge IDs earned
    totalJourneysCompleted: int("totalJourneysCompleted").default(0),
    totalCo2Saved: decimal("totalCo2Saved", { precision: 12, scale: 2 }).default("0"),
    
    // Leaderboard rank
    leaderboardRank: int("leaderboardRank"),
    
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("user_rewards_userId_idx").on(table.userId),
    leaderboardIdx: index("user_rewards_leaderboard_idx").on(table.totalGreenPoints),
  })
);

export type UserRewards = typeof userRewards.$inferSelect;
export type InsertUserRewards = typeof userRewards.$inferInsert;

/**
 * Chat history for AI travel assistant
 */
export const chatMessages = mysqlTable(
  "chat_messages",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    conversationId: varchar("conversationId", { length: 64 }).notNull(),
    
    // Message content
    role: mysqlEnum("role", ["user", "assistant"]).notNull(),
    content: text("content").notNull(),
    
    // Context
    context: json("context"), // Journey context, location, preferences
    
    // Metadata
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("chat_messages_userId_idx").on(table.userId),
    conversationIdIdx: index("chat_messages_conversationId_idx").on(table.conversationId),
  })
);

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;

/**
 * Real-time transit status cache
 */
export const transitStatus = mysqlTable(
  "transit_status",
  {
    id: int("id").autoincrement().primaryKey(),
    
    // Transit line/service
    serviceId: varchar("serviceId", { length: 100 }).notNull(),
    serviceName: varchar("serviceName", { length: 255 }).notNull(),
    serviceType: varchar("serviceType", { length: 50 }).notNull(), // "metro", "bus", "train"
    
    // Status
    status: mysqlEnum("status", [
      "operational",
      "delayed",
      "cancelled",
      "disrupted",
    ]).default("operational"),
    
    // Details
    delayMinutes: int("delayMinutes").default(0),
    crowdLevel: mysqlEnum("crowdLevel", [
      "low",
      "moderate",
      "high",
      "very_high",
    ]).default("moderate"),
    alert: text("alert"), // Alert message if any
    
    // Metadata
    lastUpdated: timestamp("lastUpdated").defaultNow().onUpdateNow().notNull(),
    expiresAt: timestamp("expiresAt"), // Auto-expire stale data
  },
  (table) => ({
    serviceIdIdx: index("transit_status_serviceId_idx").on(table.serviceId),
    statusIdx: index("transit_status_status_idx").on(table.status),
  })
);

export type TransitStatus = typeof transitStatus.$inferSelect;
export type InsertTransitStatus = typeof transitStatus.$inferInsert;

/**
 * Frequent journeys for quick access
 */
export const frequentJourneys = mysqlTable(
  "frequent_journeys",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    
    // Journey endpoints
    originLatitude: decimal("originLatitude", { precision: 10, scale: 8 }).notNull(),
    originLongitude: decimal("originLongitude", { precision: 11, scale: 8 }).notNull(),
    originLabel: varchar("originLabel", { length: 255 }),
    
    destinationLatitude: decimal("destinationLatitude", { precision: 10, scale: 8 }).notNull(),
    destinationLongitude: decimal("destinationLongitude", { precision: 11, scale: 8 }).notNull(),
    destinationLabel: varchar("destinationLabel", { length: 255 }),
    
    // Frequency tracking
    tripCount: int("tripCount").default(1),
    lastUsed: timestamp("lastUsed").defaultNow(),
    
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("frequent_journeys_userId_idx").on(table.userId),
  })
);

export type FrequentJourney = typeof frequentJourneys.$inferSelect;
export type InsertFrequentJourney = typeof frequentJourneys.$inferInsert;
