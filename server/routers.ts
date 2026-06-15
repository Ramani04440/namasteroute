import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { systemRouter } from "./_core/systemRouter";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import * as db from "./db";
import {
  JourneySearchParamsSchema,
  SafetyIncidentReportSchema,
  UserPreferencesSchema,
  LocationSchema,
} from "@shared/schemas";
import { invokeLLM } from "./_core/llm";

/**
 * Routes Router - Journey planning and route management
 */
const routesRouter = router({
  search: publicProcedure
    .input(JourneySearchParamsSchema)
    .mutation(async ({ input }) => {
      const routes = [
        {
          id: "route-1",
          segments: [
            { mode: "walk" as const, durationMinutes: 5, distanceKm: 0.4 },
            { mode: "metro" as const, durationMinutes: 40, distanceKm: 18 },
          ],
          durationMinutes: 45,
          costInRupees: 85,
          co2EmissionsGrams: 250,
          transferCount: 0,
          safetyScore: 9.2,
          comfortScore: 8.5,
          womenSafeIndicator: true,
          routeType: "fastest" as const,
        },
        {
          id: "route-2",
          segments: [
            { mode: "bus" as const, durationMinutes: 25, distanceKm: 12 },
            { mode: "auto" as const, durationMinutes: 27, distanceKm: 15 },
          ],
          durationMinutes: 52,
          costInRupees: 120,
          co2EmissionsGrams: 1800,
          transferCount: 1,
          safetyScore: 7.8,
          comfortScore: 6.5,
          womenSafeIndicator: false,
          routeType: "balanced" as const,
        },
        {
          id: "route-3",
          segments: [
            { mode: "walk" as const, durationMinutes: 3, distanceKm: 0.2 },
            { mode: "train" as const, durationMinutes: 35, distanceKm: 22 },
          ],
          durationMinutes: 38,
          costInRupees: 65,
          co2EmissionsGrams: 320,
          transferCount: 0,
          safetyScore: 8.9,
          comfortScore: 7.8,
          womenSafeIndicator: true,
          routeType: "eco" as const,
        },
      ];
      return { routes };
    }),

  toggleFavorite: protectedProcedure
    .input(z.object({ routeId: z.number(), isFavorite: z.boolean() }))
    .mutation(async ({ input }) => {
      await db.toggleRouteFavorite(input.routeId, input.isFavorite);
      return { success: true };
    }),

  getRecent: protectedProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ input, ctx }) => {
      return await db.getUserRoutes(ctx.user.id, input.limit);
    }),
});

/**
 * Journeys Router - Journey tracking and history
 */
const journeysRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        routeId: z.number().optional(),
        plannedStartTime: z.date().optional(),
        plannedEndTime: z.date().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const journey = await db.createJourney({
        userId: ctx.user.id,
        routeId: input.routeId,
        status: "planned",
        plannedStartTime: input.plannedStartTime,
        plannedEndTime: input.plannedEndTime,
      });
      return journey;
    }),

  getHistory: protectedProcedure
    .input(z.object({ limit: z.number().default(20) }))
    .query(async ({ input, ctx }) => {
      return await db.getUserJourneys(ctx.user.id, input.limit);
    }),

  getById: protectedProcedure
    .input(z.object({ journeyId: z.number() }))
    .query(async ({ input, ctx }) => {
      const journey = await db.getJourneyById(input.journeyId);
      if (!journey || journey.userId !== ctx.user.id) {
        throw new Error("Journey not found");
      }
      return journey;
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        journeyId: z.number(),
        status: z.enum(["planned", "in_progress", "completed", "cancelled"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const journey = await db.getJourneyById(input.journeyId);
      if (!journey || journey.userId !== ctx.user.id) {
        throw new Error("Journey not found");
      }
      await db.updateJourneyStatus(
        input.journeyId,
        input.status as "planned" | "in_progress" | "completed" | "cancelled"
      );
      return { success: true };
    }),

  rateJourney: protectedProcedure
    .input(
      z.object({
        journeyId: z.number(),
        rating: z.number().min(1).max(5),
        feedback: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const journey = await db.getJourneyById(input.journeyId);
      if (!journey || journey.userId !== ctx.user.id) {
        throw new Error("Journey not found");
      }
      const status = journey.status as
        | "planned"
        | "in_progress"
        | "completed"
        | "cancelled";
      await db.updateJourneyStatus(input.journeyId, status, {
        rating: input.rating,
        feedback: input.feedback,
      });
      return { success: true };
    }),
});

/**
 * Safety Router - Safety intelligence and incident reporting
 */
const safetyRouter = router({
  reportIncident: protectedProcedure
    .input(SafetyIncidentReportSchema)
    .mutation(async ({ input, ctx }) => {
      const incident = await db.createSafetyIncident({
        userId: ctx.user.id,
        latitude: input.location.latitude.toString(),
        longitude: input.location.longitude.toString(),
        incidentType: input.type,
        severity: input.severity,
        description: input.description,
        transportMode: input.transportMode,
        timeOfDay: input.timeOfDay,
      });
      return incident;
    }),

  getIncidentsNearby: publicProcedure
    .input(
      z.object({
        latitude: z.number(),
        longitude: z.number(),
        radiusKm: z.number().default(1),
      })
    )
    .query(async ({ input }) => {
      return await db.getIncidentsNearLocation(
        input.latitude,
        input.longitude,
        input.radiusKm
      );
    }),

  getSafetyScore: publicProcedure
    .input(
      z.object({
        latitude: z.number(),
        longitude: z.number(),
        transportMode: z.string(),
        timeOfDay: z.string(),
      })
    )
    .query(async ({ input }) => {
      return await db.getSafetyScore(
        input.latitude,
        input.longitude,
        input.transportMode,
        input.timeOfDay
      );
    }),
});

/**
 * Rewards Router - Gamification and achievements
 */
const rewardsRouter = router({
  getMyRewards: protectedProcedure.query(async ({ ctx }) => {
    let rewards = await db.getUserRewards(ctx.user.id);
    if (!rewards) {
      await db.createUserRewards({ userId: ctx.user.id });
      rewards = await db.getUserRewards(ctx.user.id);
    }
    return rewards;
  }),

  getLeaderboard: publicProcedure
    .input(
      z.object({
        limit: z.number().default(100),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      return await db.getLeaderboard(input.limit, input.offset);
    }),

  addGreenPoints: protectedProcedure
    .input(z.object({ points: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const rewards = await db.getUserRewards(ctx.user.id);
      if (!rewards) {
        await db.createUserRewards({
          userId: ctx.user.id,
          totalGreenPoints: input.points,
        });
      } else {
        await db.updateUserRewards(ctx.user.id, {
          totalGreenPoints: (rewards.totalGreenPoints || 0) + input.points,
        });
      }
      return { success: true };
    }),
});

/**
 * Saved Places Router - Favorite locations
 */
const placesRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        label: z.string(),
        latitude: z.number(),
        longitude: z.number(),
        address: z.string().optional(),
        placeId: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await db.createSavedPlace({
        userId: ctx.user.id,
        label: input.label,
        latitude: input.latitude.toString(),
        longitude: input.longitude.toString(),
        address: input.address,
        placeId: input.placeId,
      });
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await db.getUserSavedPlaces(ctx.user.id);
  }),

  delete: protectedProcedure
    .input(z.object({ placeId: z.number() }))
    .mutation(async ({ input }) => {
      await db.deleteSavedPlace(input.placeId);
      return { success: true };
    }),
});

/**
 * Chat Router - AI travel assistant
 */
const chatRouter = router({
  sendMessage: protectedProcedure
    .input(
      z.object({
        conversationId: z.string(),
        message: z.string(),
        context: z.record(z.string(), z.unknown()).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Store user message
      await db.createChatMessage({
        userId: ctx.user.id,
        conversationId: input.conversationId,
        role: "user",
        content: input.message,
        context: input.context as Record<string, unknown> | undefined,
      });

      // Get LLM response
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content:
              "You are NamasteRoute, an intelligent travel assistant for Indian cities. Help users plan their journeys, answer questions about public transportation, and provide safety and sustainability advice.",
          },
          {
            role: "user",
            content: input.message,
          },
        ],
      });

      const content = response.choices[0]?.message?.content;
      const assistantMessage =
        typeof content === "string"
          ? content
          : "Unable to process request";

      // Store assistant response
      await db.createChatMessage({
        userId: ctx.user.id,
        conversationId: input.conversationId,
        role: "assistant",
        content: assistantMessage,
        context: undefined,
      });

      return { message: assistantMessage };
    }),

  getConversation: protectedProcedure
    .input(z.object({ conversationId: z.string() }))
    .query(async ({ input }) => {
      return await db.getConversationMessages(input.conversationId);
    }),
});

/**
 * Transit Status Router - Real-time transit data
 */
const transitRouter = router({
  getStatus: publicProcedure
    .input(z.object({ serviceType: z.string().optional() }))
    .query(async ({ input }) => {
      return await db.getTransitStatus(input.serviceType);
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        serviceId: z.string(),
        serviceName: z.string(),
        serviceType: z.string(),
        status: z.enum(["operational", "delayed", "cancelled", "disrupted"]),
        delayMinutes: z.number().default(0),
        crowdLevel: z.enum(["low", "moderate", "high", "very_high"]),
        alert: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      await db.upsertTransitStatus({
        serviceId: input.serviceId,
        serviceName: input.serviceName,
        serviceType: input.serviceType,
        status: input.status,
        delayMinutes: input.delayMinutes,
        crowdLevel: input.crowdLevel,
        alert: input.alert,
      });
      return { success: true };
    }),
});

/**
 * User Preferences Router
 */
const preferencesRouter = router({
  update: protectedProcedure
    .input(UserPreferencesSchema)
    .mutation(async ({ input, ctx }) => {
      // Update user preferences in database
      // TODO: Implement after adding preferences table if needed
      return { success: true };
    }),
});

/**

/**
 * Community Reports Router - Community safety reporting
 */
const communityRouter = router({
  submitReport: protectedProcedure
    .input(
      z.object({
        type: z.enum(["crowd", "incident", "delay"]),
        location: z.string().min(1),
        description: z.string().min(10),
        crowdLevel: z.enum(["low", "moderate", "high", "extreme"]).optional(),
        severity: z.enum(["low", "medium", "high"]).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return {
        success: true,
        reportId: Math.random().toString(36).substr(2, 9),
        message: "Report submitted successfully",
      };
    }),

  getReports: publicProcedure
    .input(
      z.object({
        type: z.enum(["crowd", "incident", "delay"]).optional(),
        limit: z.number().default(20),
      })
    )
    .query(async () => {
      return [];
    }),

  upvoteReport: protectedProcedure
    .input(z.object({ reportId: z.string() }))
    .mutation(async () => {
      return { success: true };
    }),

  downvoteReport: protectedProcedure
    .input(z.object({ reportId: z.string() }))
    .mutation(async () => {
      return { success: true };
    }),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  routes: routesRouter,
  journeys: journeysRouter,
  safety: safetyRouter,
  rewards: rewardsRouter,
  places: placesRouter,
  chat: chatRouter,
  transit: transitRouter,
  preferences: preferencesRouter,
  community: communityRouter,
});

export type AppRouter = typeof appRouter;
