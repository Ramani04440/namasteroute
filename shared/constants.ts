/**
 * NamasteRoute Constants
 * Shared across frontend and backend
 */

// ============================================================================
// Transport Modes
// ============================================================================

export const TRANSPORT_MODES = {
  METRO: "metro",
  BUS: "bus",
  AUTO: "auto",
  CAB: "cab",
  TRAIN: "train",
  WALK: "walk",
} as const;

export const TRANSPORT_MODE_LABELS: Record<string, string> = {
  metro: "Metro",
  bus: "Bus",
  auto: "Auto Rickshaw",
  cab: "Cab",
  train: "Train",
  walk: "Walk",
};

export const TRANSPORT_MODE_COLORS: Record<string, string> = {
  metro: "#0066cc",
  bus: "#ff6b35",
  auto: "#f7b801",
  cab: "#00b4d8",
  train: "#8338ec",
  walk: "#3a86ff",
};

// ============================================================================
// Safety Levels
// ============================================================================

export const SAFETY_LEVELS = {
  VERY_LOW: 0,
  LOW: 1,
  MODERATE: 2.5,
  HIGH: 4,
  VERY_HIGH: 5,
} as const;

export const SAFETY_LEVEL_LABELS: Record<number, string> = {
  0: "Very Low",
  1: "Low",
  2.5: "Moderate",
  4: "High",
  5: "Very High",
};

// ============================================================================
// Time of Day
// ============================================================================

export const TIME_OF_DAY = {
  MORNING: "morning", // 6 AM - 12 PM
  AFTERNOON: "afternoon", // 12 PM - 5 PM
  EVENING: "evening", // 5 PM - 9 PM
  NIGHT: "night", // 9 PM - 6 AM
} as const;

export const TIME_OF_DAY_LABELS: Record<string, string> = {
  morning: "Morning (6 AM - 12 PM)",
  afternoon: "Afternoon (12 PM - 5 PM)",
  evening: "Evening (5 PM - 9 PM)",
  night: "Night (9 PM - 6 AM)",
};

// ============================================================================
// Crowd Levels
// ============================================================================

export const CROWD_LEVELS = {
  LOW: "low",
  MODERATE: "moderate",
  HIGH: "high",
  VERY_HIGH: "very_high",
} as const;

export const CROWD_LEVEL_LABELS: Record<string, string> = {
  low: "Low",
  moderate: "Moderate",
  high: "High",
  very_high: "Very High",
};

// ============================================================================
// Journey Status
// ============================================================================

export const JOURNEY_STATUS = {
  PLANNED: "planned",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export const JOURNEY_STATUS_LABELS: Record<string, string> = {
  planned: "Planned",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

// ============================================================================
// Incident Types
// ============================================================================

export const INCIDENT_TYPES = {
  CROWDING: "crowding",
  DELAY: "delay",
  SAFETY_CONCERN: "safety_concern",
  SERVICE_DISRUPTION: "service_disruption",
} as const;

export const INCIDENT_TYPE_LABELS: Record<string, string> = {
  crowding: "Crowding",
  delay: "Delay",
  safety_concern: "Safety Concern",
  service_disruption: "Service Disruption",
};

// ============================================================================
// Severity Levels
// ============================================================================

export const SEVERITY_LEVELS = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
} as const;

export const SEVERITY_LEVEL_LABELS: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

// ============================================================================
// Languages
// ============================================================================

export const SUPPORTED_LANGUAGES = {
  ENGLISH: "en",
  HINDI: "hi",
  TAMIL: "ta",
  BENGALI: "bn",
  TELUGU: "te",
} as const;

export const LANGUAGE_LABELS: Record<string, string> = {
  en: "English",
  hi: "हिन्दी (Hindi)",
  ta: "தமிழ் (Tamil)",
  bn: "বাংলা (Bengali)",
  te: "తెలుగు (Telugu)",
};

// ============================================================================
// Themes
// ============================================================================

export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
} as const;

// ============================================================================
// CO2 Emissions Factors
// ============================================================================

export const CO2_EMISSIONS_FACTORS: Record<string, number> = {
  metro: 0.041, // grams per km
  bus: 0.089,
  auto: 0.255,
  cab: 0.192,
  train: 0.014,
  walk: 0,
};

// ============================================================================
// Cost Factors (in Rupees per km)
// ============================================================================

export const COST_FACTORS: Record<string, number> = {
  metro: 0.5,
  bus: 0.75,
  auto: 8.0,
  cab: 15.0,
  train: 0.5,
  walk: 0,
};

// ============================================================================
// Achievements & Badges
// ============================================================================

export const ACHIEVEMENTS = {
  FIRST_JOURNEY: "first_journey",
  WEEK_WARRIOR: "week_warrior",
  CARBON_NEUTRAL: "carbon_neutral",
  SAFETY_FIRST: "safety_first",
  GREEN_CHAMPION: "green_champion",
  COMMUTE_MASTER: "commute_master",
  EARLY_BIRD: "early_bird",
  NIGHT_OWL: "night_owl",
  WOMEN_SAFE_ADVOCATE: "women_safe_advocate",
  STREAK_7: "streak_7",
  STREAK_30: "streak_30",
  STREAK_100: "streak_100",
} as const;

export const ACHIEVEMENT_DETAILS: Record<
  string,
  { name: string; description: string; icon: string }
> = {
  first_journey: {
    name: "First Journey",
    description: "Complete your first journey on NamasteRoute",
    icon: "🚀",
  },
  week_warrior: {
    name: "Week Warrior",
    description: "Complete 7 journeys in a week",
    icon: "⚔️",
  },
  carbon_neutral: {
    name: "Carbon Neutral",
    description: "Save 100kg of CO₂ emissions",
    icon: "🌱",
  },
  safety_first: {
    name: "Safety First",
    description: "Use 10 women-safe routes",
    icon: "🛡️",
  },
  green_champion: {
    name: "Green Champion",
    description: "Earn 1000 green points",
    icon: "♻️",
  },
  commute_master: {
    name: "Commute Master",
    description: "Complete 100 journeys",
    icon: "🏆",
  },
  early_bird: {
    name: "Early Bird",
    description: "Complete 10 morning journeys",
    icon: "🌅",
  },
  night_owl: {
    name: "Night Owl",
    description: "Complete 10 night journeys",
    icon: "🌙",
  },
  women_safe_advocate: {
    name: "Women Safe Advocate",
    description: "Report 5 safety incidents",
    icon: "👩",
  },
  streak_7: {
    name: "7-Day Streak",
    description: "Maintain a 7-day journey streak",
    icon: "🔥",
  },
  streak_30: {
    name: "30-Day Streak",
    description: "Maintain a 30-day journey streak",
    icon: "🔥🔥",
  },
  streak_100: {
    name: "100-Day Streak",
    description: "Maintain a 100-day journey streak",
    icon: "🔥🔥🔥",
  },
};

// ============================================================================
// Green Points Rewards
// ============================================================================

export const GREEN_POINTS_REWARDS = {
  JOURNEY_COMPLETED: 10,
  METRO_BONUS: 15,
  BUS_BONUS: 12,
  WALK_BONUS: 20,
  SAFETY_REPORT: 25,
  FEEDBACK_PROVIDED: 5,
  STREAK_BONUS_MULTIPLIER: 1.5,
} as const;

// ============================================================================
// Default Preferences
// ============================================================================

export const DEFAULT_PREFERENCES = {
  language: SUPPORTED_LANGUAGES.ENGLISH,
  theme: THEMES.LIGHT,
  notifications: {
    delays: true,
    safetyAlerts: true,
    rewards: true,
  },
  accessibility: {
    highContrast: false,
    screenReader: false,
  },
} as const;

// ============================================================================
// API Configuration
// ============================================================================

export const API_CONFIG = {
  TIMEOUT_MS: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY_MS: 1000,
} as const;

// ============================================================================
// Map Configuration
// ============================================================================

export const MAP_CONFIG = {
  DEFAULT_ZOOM: 13,
  DEFAULT_CENTER: {
    latitude: 19.0760, // Mumbai
    longitude: 72.8777,
  },
  ZOOM_LEVELS: {
    COUNTRY: 4,
    CITY: 11,
    DISTRICT: 13,
    STREET: 16,
    BUILDING: 19,
  },
} as const;

// ============================================================================
// Pagination
// ============================================================================

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

// ============================================================================
// Cache Duration (in seconds)
// ============================================================================

export const CACHE_DURATION = {
  ROUTES: 300, // 5 minutes
  SAFETY_SCORES: 600, // 10 minutes
  TRANSIT_STATUS: 60, // 1 minute
  USER_DATA: 1800, // 30 minutes
  LEADERBOARD: 3600, // 1 hour
} as const;
