/**
 * NamasteRoute Shared Types
 * Used across frontend and backend for type safety
 */

// ============================================================================
// Location & Coordinates
// ============================================================================

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Location extends Coordinates {
  address?: string;
  placeId?: string;
}

// ============================================================================
// Routes & Journey Planning
// ============================================================================

export type TransportMode = "metro" | "bus" | "auto" | "cab" | "train" | "walk";

export interface RouteSegment {
  id: string;
  mode: TransportMode;
  startLocation: Location;
  endLocation: Location;
  durationMinutes: number;
  costInRupees: number;
  co2EmissionsGrams: number;
  lineNumber?: string;
  lineName?: string;
  stops?: string[];
  crowdLevel?: "low" | "moderate" | "high" | "very_high";
  safetyScore?: number;
  womenSafe?: boolean;
}

export interface RouteOption {
  id: string;
  segments: RouteSegment[];
  durationMinutes: number;
  costInRupees: number;
  co2EmissionsGrams: number;
  transferCount: number;
  safetyScore: number;
  comfortScore: number;
  womenSafeIndicator: boolean;
  routeType: "fastest" | "cheapest" | "greenest" | "safest" | "balanced";
  isFavorite?: boolean;
}

export interface JourneySearchParams {
  origin: Location;
  destination: Location;
  departureTime?: Date;
  preferences?: {
    maxTransfers?: number;
    avoidModes?: TransportMode[];
    preferModes?: TransportMode[];
    womenSafeOnly?: boolean;
    maxCost?: number;
  };
}

export interface JourneyStatus {
  id: string;
  status: "planned" | "in_progress" | "completed" | "cancelled";
  currentSegmentIndex: number;
  currentLocation?: Coordinates;
  currentSegment?: RouteSegment;
  eta?: Date;
  delayMinutes: number;
  progress: number; // 0-100
}

// ============================================================================
// Safety
// ============================================================================

export interface SafetyMetrics {
  score: number; // 0-5
  womenSafeScore: number; // 0-5
  timeOfDay: "morning" | "afternoon" | "evening" | "night";
  area: string;
  transportMode: TransportMode;
  incidentCount: number;
  alerts?: SafetyAlert[];
}

export interface SafetyAlert {
  id: string;
  type: "crowding" | "delay" | "safety_concern" | "service_disruption";
  severity: "low" | "medium" | "high";
  message: string;
  location: Location;
  timestamp: Date;
}

export interface SafetyIncidentReport {
  type: string;
  severity: "low" | "medium" | "high";
  description: string;
  location: Location;
  transportMode?: TransportMode;
  timeOfDay?: string;
}

// ============================================================================
// Sustainability & Rewards
// ============================================================================

export interface SustainabilityMetrics {
  co2SavedGrams: number;
  greenScore: number; // 0-100
  greenCoins: number;
  streakDays: number;
  totalJourneysCompleted: number;
  totalCo2Saved: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon?: string;
  unlockedAt?: Date;
}

export interface UserRewardsData {
  totalGreenPoints: number;
  totalGreenCoins: number;
  currentStreak: number;
  longestStreak: number;
  badges: Achievement[];
  leaderboardRank?: number;
  totalJourneysCompleted: number;
  totalCo2Saved: number;
}

// ============================================================================
// Transit Status & Real-time Data
// ============================================================================

export interface TransitService {
  id: string;
  name: string;
  type: TransportMode;
  status: "operational" | "delayed" | "cancelled" | "disrupted";
  delayMinutes: number;
  crowdLevel: "low" | "moderate" | "high" | "very_high";
  alert?: string;
  lastUpdated: Date;
}

export interface TransitStatusFeed {
  services: TransitService[];
  lastUpdated: Date;
  alerts: SafetyAlert[];
}

// ============================================================================
// Chat & AI Assistant
// ============================================================================

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  context?: {
    journeyId?: string;
    location?: Location;
    preferences?: Record<string, unknown>;
  };
}

export interface ChatConversation {
  id: string;
  userId: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// User & Preferences
// ============================================================================

export interface UserPreferences {
  language: "en" | "hi" | "ta" | "bn" | "te";
  theme: "light" | "dark";
  notifications?: {
    delays?: boolean;
    safetyAlerts?: boolean;
    rewards?: boolean;
  };
  accessibility?: {
    highContrast?: boolean;
    screenReader?: boolean;
  };
}

export interface SavedPlace {
  id: string;
  userId: string;
  label: string;
  location: Location;
  createdAt: Date;
}

export interface FrequentJourney {
  id: string;
  userId: string;
  origin: Location;
  destination: Location;
  tripCount: number;
  lastUsed: Date;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ============================================================================
// Leaderboard
// ============================================================================

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  totalGreenPoints: number;
  totalCo2Saved: number;
  streakDays: number;
}

export interface Leaderboard {
  entries: LeaderboardEntry[];
  userRank?: LeaderboardEntry;
  period: "weekly" | "monthly" | "all_time";
  lastUpdated: Date;
}
