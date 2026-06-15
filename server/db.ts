import { eq, and, desc, gte, lte, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  routes,
  journeys,
  savedPlaces,
  safetyIncidents,
  safetyScores,
  userRewards,
  chatMessages,
  transitStatus,
  frequentJourneys,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

/**
 * Lazily create the drizzle instance so local tooling can run without a DB.
 */
export async function getDb() {
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

/**
 * User Management
 */
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Routes Management
 */
export async function createRoute(routeData: typeof routes.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(routes).values(routeData);
  return result;
}

export async function getUserRoutes(userId: number, limit: number = 20) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(routes)
    .where(eq(routes.userId, userId))
    .orderBy(desc(routes.createdAt))
    .limit(limit);
}

export async function getFavoriteRoutes(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(routes)
    .where(and(eq(routes.userId, userId), eq(routes.isFavorite, true)))
    .orderBy(desc(routes.createdAt));
}

export async function toggleRouteFavorite(routeId: number, isFavorite: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.update(routes).set({ isFavorite }).where(eq(routes.id, routeId));
}

/**
 * Journeys Management
 */
export async function createJourney(journeyData: typeof journeys.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(journeys).values(journeyData);
  return result;
}

export async function getUserJourneys(userId: number, limit: number = 20) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(journeys)
    .where(eq(journeys.userId, userId))
    .orderBy(desc(journeys.createdAt))
    .limit(limit);
}

export async function getJourneyById(journeyId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(journeys)
    .where(eq(journeys.id, journeyId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function updateJourneyStatus(
  journeyId: number,
  status: "planned" | "in_progress" | "completed" | "cancelled",
  updates?: Record<string, unknown>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .update(journeys)
    .set({ status, ...updates })
    .where(eq(journeys.id, journeyId));
}

/**
 * Saved Places Management
 */
export async function createSavedPlace(
  placeData: typeof savedPlaces.$inferInsert
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(savedPlaces).values(placeData);
}

export async function getUserSavedPlaces(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(savedPlaces)
    .where(eq(savedPlaces.userId, userId))
    .orderBy(desc(savedPlaces.createdAt));
}

export async function deleteSavedPlace(placeId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.delete(savedPlaces).where(eq(savedPlaces.id, placeId));
}

/**
 * Safety Incidents Management
 */
export async function createSafetyIncident(
  incidentData: typeof safetyIncidents.$inferInsert
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(safetyIncidents).values(incidentData);
}

export async function getIncidentsNearLocation(
  latitude: number,
  longitude: number,
  radiusKm: number = 1
) {
  const db = await getDb();
  if (!db) return [];

  // Simple bounding box query (can be improved with spatial indexing)
  const latDelta = radiusKm / 111; // 1 degree ≈ 111 km
  const lonDelta = radiusKm / (111 * Math.cos((latitude * Math.PI) / 180));

  return await db
    .select()
    .from(safetyIncidents)
    .where(
      and(
        gte(safetyIncidents.latitude, String(latitude - latDelta)),
        lte(safetyIncidents.latitude, String(latitude + latDelta))
      )
    )
    .orderBy(desc(safetyIncidents.createdAt));
}

/**
 * Safety Scores Management
 */
export async function getSafetyScore(
  latitude: number,
  longitude: number,
  transportMode: string,
  timeOfDay: string
) {
  const db = await getDb();
  if (!db) return undefined;

  // Find closest safety score (within grid resolution)
  const result = await db
    .select()
    .from(safetyScores)
    .where(
      and(
        eq(safetyScores.transportMode, transportMode),
        eq(safetyScores.timeOfDay, timeOfDay)
      )
    )
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function upsertSafetyScore(
  scoreData: typeof safetyScores.$inferInsert
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .insert(safetyScores)
    .values(scoreData)
    .onDuplicateKeyUpdate({
      set: {
        score: scoreData.score,
        womenSafeScore: scoreData.womenSafeScore,
        incidentCount: scoreData.incidentCount,
        lastUpdated: new Date(),
      },
    });
}

/**
 * User Rewards Management
 */
export async function getUserRewards(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(userRewards)
    .where(eq(userRewards.userId, userId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createUserRewards(
  rewardsData: typeof userRewards.$inferInsert
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(userRewards).values(rewardsData);
}

export async function updateUserRewards(
  userId: number,
  updates: Record<string, unknown>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .update(userRewards)
    .set(updates)
    .where(eq(userRewards.userId, userId));
}

export async function getLeaderboard(
  limit: number = 100,
  offset: number = 0
) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(userRewards)
    .orderBy(desc(userRewards.totalGreenPoints))
    .limit(limit)
    .offset(offset);
}

/**
 * Chat Messages Management
 */
export async function createChatMessage(
  messageData: typeof chatMessages.$inferInsert
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(chatMessages).values(messageData);
}

export async function getConversationMessages(conversationId: string) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages.conversationId, conversationId))
    .orderBy(desc(chatMessages.createdAt));
}

/**
 * Transit Status Management
 */
export async function upsertTransitStatus(
  statusData: typeof transitStatus.$inferInsert
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .insert(transitStatus)
    .values(statusData)
    .onDuplicateKeyUpdate({
      set: {
        status: statusData.status,
        delayMinutes: statusData.delayMinutes,
        crowdLevel: statusData.crowdLevel,
        alert: statusData.alert,
        lastUpdated: new Date(),
      },
    });
}

export async function getTransitStatus(serviceType?: string) {
  const db = await getDb();
  if (!db) return [];

  if (serviceType) {
    return await db
      .select()
      .from(transitStatus)
      .where(eq(transitStatus.serviceType, serviceType))
      .orderBy(desc(transitStatus.lastUpdated));
  }

  return await db
    .select()
    .from(transitStatus)
    .orderBy(desc(transitStatus.lastUpdated));
}

/**
 * Frequent Journeys Management
 */
export async function createFrequentJourney(
  journeyData: typeof frequentJourneys.$inferInsert
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(frequentJourneys).values(journeyData);
}

export async function getUserFrequentJourneys(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(frequentJourneys)
    .where(eq(frequentJourneys.userId, userId))
    .orderBy(desc(frequentJourneys.lastUsed));
}

export async function updateFrequentJourneyUsage(journeyId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Get current trip count first
  const existing = await db
    .select()
    .from(frequentJourneys)
    .where(eq(frequentJourneys.id, journeyId))
    .limit(1);

  if (!existing.length) throw new Error("Journey not found");

  const newTripCount = (existing[0].tripCount || 1) + 1;

  return await db
    .update(frequentJourneys)
    .set({
      tripCount: newTripCount,
      lastUsed: new Date(),
    })
    .where(eq(frequentJourneys.id, journeyId));
}
