/**
 * NamasteRoute Utility Functions
 * Shared across frontend and backend
 */

import { Coordinates, Location } from "./types";
import {
  CO2_EMISSIONS_FACTORS,
  COST_FACTORS,
  TIME_OF_DAY,
} from "./constants";

// ============================================================================
// Distance & Coordinates
// ============================================================================

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(
  from: Coordinates,
  to: Coordinates
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(to.latitude - from.latitude);
  const dLon = toRad(to.longitude - from.longitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(from.latitude)) *
      Math.cos(toRad(to.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Check if two coordinates are approximately the same (within tolerance)
 */
export function areCoordinatesClose(
  coord1: Coordinates,
  coord2: Coordinates,
  toleranceKm: number = 0.1
): boolean {
  return calculateDistance(coord1, coord2) <= toleranceKm;
}

// ============================================================================
// CO2 & Environmental
// ============================================================================

/**
 * Calculate CO2 emissions for a journey segment
 */
export function calculateCO2Emissions(
  transportMode: string,
  distanceKm: number
): number {
  const factor = CO2_EMISSIONS_FACTORS[transportMode] || 0;
  return factor * distanceKm;
}

/**
 * Calculate total CO2 for a route with multiple segments
 */
export function calculateRouteCO2(
  segments: Array<{ mode: string; distanceKm: number }>
): number {
  return segments.reduce(
    (total, segment) =>
      total + calculateCO2Emissions(segment.mode, segment.distanceKm),
    0
  );
}

/**
 * Convert CO2 grams to equivalent trees needed to offset
 */
export function co2ToTrees(co2Grams: number): number {
  // Average tree absorbs ~20kg CO2 per year
  const co2Kg = co2Grams / 1000;
  return Math.round((co2Kg / 20) * 100) / 100;
}

// ============================================================================
// Cost Calculations
// ============================================================================

/**
 * Calculate cost for a journey segment
 */
export function calculateSegmentCost(
  transportMode: string,
  distanceKm: number
): number {
  const factor = COST_FACTORS[transportMode] || 0;
  return Math.round(factor * distanceKm * 100) / 100;
}

/**
 * Calculate total cost for a route
 */
export function calculateRouteCost(
  segments: Array<{ mode: string; distanceKm: number }>
): number {
  return segments.reduce(
    (total, segment) =>
      total + calculateSegmentCost(segment.mode, segment.distanceKm),
    0
  );
}

// ============================================================================
// Time of Day
// ============================================================================

/**
 * Get time of day category based on hour
 */
export function getTimeOfDay(date: Date): string {
  const hour = date.getHours();

  if (hour >= 6 && hour < 12) return TIME_OF_DAY.MORNING;
  if (hour >= 12 && hour < 17) return TIME_OF_DAY.AFTERNOON;
  if (hour >= 17 && hour < 21) return TIME_OF_DAY.EVENING;
  return TIME_OF_DAY.NIGHT;
}

/**
 * Check if time is during peak hours
 */
export function isPeakHours(date: Date): boolean {
  const hour = date.getHours();
  const dayOfWeek = date.getDay();

  // Peak hours: 7-10 AM and 5-8 PM on weekdays
  const isPeakMorning = hour >= 7 && hour < 10;
  const isPeakEvening = hour >= 17 && hour < 20;
  const isWeekday = dayOfWeek !== 0 && dayOfWeek !== 6;

  return isWeekday && (isPeakMorning || isPeakEvening);
}

/**
 * Check if time is late night (safety concern)
 */
export function isLateNight(date: Date): boolean {
  const hour = date.getHours();
  return hour >= 22 || hour < 5;
}

// ============================================================================
// Safety Scoring
// ============================================================================

/**
 * Calculate safety score based on multiple factors
 * Returns score between 0-5
 */
export function calculateSafetyScore(factors: {
  timeOfDay: string;
  transportMode: string;
  area: string;
  incidentCount: number;
  womenSafe?: boolean;
}): number {
  let score = 3; // Base score

  // Time of day factor
  if (factors.timeOfDay === TIME_OF_DAY.NIGHT) score -= 1;
  if (factors.timeOfDay === TIME_OF_DAY.MORNING) score += 0.5;

  // Transport mode factor
  const safeTransportModes = ["metro", "train"];
  if (safeTransportModes.includes(factors.transportMode)) score += 0.5;
  if (factors.transportMode === "walk") score -= 0.5;

  // Incident factor
  if (factors.incidentCount > 5) score -= 1;
  if (factors.incidentCount > 10) score -= 1;

  // Women safe indicator
  if (factors.womenSafe) score += 0.5;

  // Clamp between 0 and 5
  return Math.max(0, Math.min(5, score));
}

// ============================================================================
// Green Points & Rewards
// ============================================================================

/**
 * Calculate green points earned for a journey
 */
export function calculateGreenPoints(factors: {
  co2Saved: number;
  transportMode: string;
  distance: number;
  safetyReported?: boolean;
}): number {
  let points = 10; // Base points

  // CO2 savings bonus
  points += Math.floor(factors.co2Saved / 100);

  // Transport mode bonus
  const bonusTransportModes: Record<string, number> = {
    metro: 5,
    bus: 2,
    train: 5,
    walk: 10,
  };
  points += bonusTransportModes[factors.transportMode] || 0;

  // Distance bonus
  if (factors.distance > 10) points += 5;
  if (factors.distance > 20) points += 5;

  // Safety report bonus
  if (factors.safetyReported) points += 25;

  return points;
}

/**
 * Calculate streak multiplier based on current streak
 */
export function getStreakMultiplier(streakDays: number): number {
  if (streakDays < 7) return 1;
  if (streakDays < 30) return 1.5;
  if (streakDays < 100) return 2;
  return 2.5;
}

// ============================================================================
// Formatting & Display
// ============================================================================

/**
 * Format duration in minutes to readable string
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

/**
 * Format cost in Rupees
 */
export function formatCost(rupees: number): string {
  return `₹${Math.round(rupees)}`;
}

/**
 * Format CO2 emissions
 */
export function formatCO2(grams: number): string {
  if (grams < 1000) return `${Math.round(grams)}g`;
  return `${(grams / 1000).toFixed(2)}kg`;
}

/**
 * Format distance in km
 */
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)}m`;
  return `${km.toFixed(1)}km`;
}

/**
 * Format percentage
 */
export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

// ============================================================================
// Array & Object Utilities
// ============================================================================

/**
 * Group array items by a key function
 */
export function groupBy<T>(
  items: T[],
  keyFn: (item: T) => string
): Record<string, T[]> {
  return items.reduce(
    (acc, item) => {
      const key = keyFn(item);
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    },
    {} as Record<string, T[]>
  );
}

/**
 * Sort array by multiple criteria
 */
export function sortBy<T>(
  items: T[],
  ...criteria: Array<{
    key: keyof T;
    order?: "asc" | "desc";
  }>
): T[] {
  return [...items].sort((a, b) => {
    for (const criterion of criteria) {
      const aVal = a[criterion.key];
      const bVal = b[criterion.key];
      const order = criterion.order === "desc" ? -1 : 1;

      if (aVal < bVal) return -1 * order;
      if (aVal > bVal) return 1 * order;
    }
    return 0;
  });
}

/**
 * Unique array items by a key function
 */
export function uniqueBy<T>(
  items: T[],
  keyFn: (item: T) => string | number
): T[] {
  const seen = new Set<string | number>();
  return items.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ============================================================================
// Validation
// ============================================================================

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (Indian format)
 */
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\D/g, ""));
}

/**
 * Validate coordinates
 */
export function isValidCoordinates(coords: Coordinates): boolean {
  return (
    coords.latitude >= -90 &&
    coords.latitude <= 90 &&
    coords.longitude >= -180 &&
    coords.longitude <= 180
  );
}

// ============================================================================
// Async Utilities
// ============================================================================

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  initialDelayMs: number = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxAttempts - 1) {
        const delayMs = initialDelayMs * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  throw lastError;
}

/**
 * Debounce a function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delayMs: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delayMs);
  };
}

/**
 * Throttle a function
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delayMs: number
): (...args: Parameters<T>) => void {
  let lastCallTime = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCallTime >= delayMs) {
      lastCallTime = now;
      fn(...args);
    }
  };
}
