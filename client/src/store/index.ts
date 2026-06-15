/**
 * NamasteRoute Zustand Stores
 * Centralized state management for the application
 */

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {
  RouteOption,
  JourneyStatus,
  UserPreferences,
  SavedPlace,
  UserRewardsData,
  ChatMessage,
} from "@shared/types";
import { DEFAULT_PREFERENCES } from "@shared/constants";

// ============================================================================
// User Store
// ============================================================================

interface UserState {
  preferences: UserPreferences;
  setLanguage: (language: UserPreferences["language"]) => void;
  setTheme: (theme: UserPreferences["theme"]) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        preferences: DEFAULT_PREFERENCES,
        setLanguage: (language) =>
          set((state) => ({
            preferences: { ...state.preferences, language },
          })),
        setTheme: (theme) =>
          set((state) => ({
            preferences: { ...state.preferences, theme },
          })),
        updatePreferences: (prefs) =>
          set((state) => ({
            preferences: { ...state.preferences, ...prefs },
          })),
      }),
      {
        name: "user-preferences",
      }
    )
  )
);

// ============================================================================
// Route Store
// ============================================================================

interface RouteState {
  routes: RouteOption[];
  selectedRoute: RouteOption | null;
  compareRoutes: RouteOption[];
  isLoading: boolean;
  error: string | null;

  setRoutes: (routes: RouteOption[]) => void;
  selectRoute: (route: RouteOption) => void;
  addToCompare: (route: RouteOption) => void;
  removeFromCompare: (routeId: string) => void;
  clearCompare: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearRoutes: () => void;
}

export const useRouteStore = create<RouteState>()(
  devtools((set) => ({
    routes: [],
    selectedRoute: null,
    compareRoutes: [],
    isLoading: false,
    error: null,

    setRoutes: (routes) => set({ routes }),
    selectRoute: (route) => set({ selectedRoute: route }),
    addToCompare: (route) =>
      set((state) => {
        if (state.compareRoutes.length >= 3) {
          return state;
        }
        if (state.compareRoutes.some((r) => r.id === route.id)) {
          return state;
        }
        return { compareRoutes: [...state.compareRoutes, route] };
      }),
    removeFromCompare: (routeId) =>
      set((state) => ({
        compareRoutes: state.compareRoutes.filter((r) => r.id !== routeId),
      })),
    clearCompare: () => set({ compareRoutes: [] }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    clearRoutes: () =>
      set({ routes: [], selectedRoute: null, compareRoutes: [], error: null }),
  }))
);

// ============================================================================
// Journey Store
// ============================================================================

interface JourneyState {
  currentJourney: JourneyStatus | null;
  journeyHistory: JourneyStatus[];
  isTracking: boolean;

  setCurrentJourney: (journey: JourneyStatus) => void;
  updateJourneyProgress: (progress: number) => void;
  completeJourney: () => void;
  addToHistory: (journey: JourneyStatus) => void;
  setTracking: (tracking: boolean) => void;
  clearHistory: () => void;
}

export const useJourneyStore = create<JourneyState>()(
  devtools(
    persist(
      (set) => ({
        currentJourney: null,
        journeyHistory: [],
        isTracking: false,

        setCurrentJourney: (journey) => set({ currentJourney: journey }),
        updateJourneyProgress: (progress) =>
          set((state) => {
            if (!state.currentJourney) return state;
            return {
              currentJourney: { ...state.currentJourney, progress },
            };
          }),
        completeJourney: () =>
          set((state) => {
            if (!state.currentJourney) return state;
            return {
              journeyHistory: [...state.journeyHistory, state.currentJourney],
              currentJourney: null,
              isTracking: false,
            };
          }),
        addToHistory: (journey) =>
          set((state) => ({
            journeyHistory: [...state.journeyHistory, journey],
          })),
        setTracking: (tracking) => set({ isTracking: tracking }),
        clearHistory: () => set({ journeyHistory: [] }),
      }),
      {
        name: "journey-state",
      }
    )
  )
);

// ============================================================================
// Safety Store
// ============================================================================

interface SafetyState {
  safetyScore: number | null;
  womenSafeIndicator: boolean;
  alerts: Array<{
    id: string;
    type: string;
    severity: string;
    message: string;
  }>;

  setSafetyScore: (score: number) => void;
  setWomenSafeIndicator: (safe: boolean) => void;
  addAlert: (alert: {
    id: string;
    type: string;
    severity: string;
    message: string;
  }) => void;
  removeAlert: (id: string) => void;
  clearAlerts: () => void;
}

export const useSafetyStore = create<SafetyState>()(
  devtools((set) => ({
    safetyScore: null,
    womenSafeIndicator: false,
    alerts: [],

    setSafetyScore: (score) => set({ safetyScore: score }),
    setWomenSafeIndicator: (safe) => set({ womenSafeIndicator: safe }),
    addAlert: (alert) =>
      set((state) => ({
        alerts: [alert, ...state.alerts].slice(0, 10),
      })),
    removeAlert: (id) =>
      set((state) => ({
        alerts: state.alerts.filter((a) => a.id !== id),
      })),
    clearAlerts: () => set({ alerts: [] }),
  }))
);

// ============================================================================
// Rewards Store
// ============================================================================

interface RewardsState {
  rewards: UserRewardsData | null;
  isLoading: boolean;

  setRewards: (rewards: UserRewardsData) => void;
  addGreenPoints: (points: number) => void;
  addBadge: (badgeId: string) => void;
  updateStreak: (days: number) => void;
  setLoading: (loading: boolean) => void;
}

export const useRewardsStore = create<RewardsState>()(
  devtools(
    persist(
      (set) => ({
        rewards: null,
        isLoading: false,

        setRewards: (rewards) => set({ rewards }),
        addGreenPoints: (points) =>
          set((state) => {
            if (!state.rewards) return state;
            return {
              rewards: {
                ...state.rewards,
                totalGreenPoints: state.rewards.totalGreenPoints + points,
              },
            };
          }),
        addBadge: (badgeId) =>
          set((state) => {
            if (!state.rewards) return state;
            return {
              rewards: {
                ...state.rewards,
                badges: [
                  ...state.rewards.badges,
                  {
                    id: badgeId,
                    name: badgeId,
                    description: "",
                    unlockedAt: new Date(),
                  },
                ],
              },
            };
          }),
        updateStreak: (days) =>
          set((state) => {
            if (!state.rewards) return state;
            return {
              rewards: {
                ...state.rewards,
                currentStreak: days,
                longestStreak: Math.max(state.rewards.longestStreak, days),
              },
            };
          }),
        setLoading: (loading) => set({ isLoading: loading }),
      }),
      {
        name: "rewards-state",
      }
    )
  )
);

// ============================================================================
// Saved Places Store
// ============================================================================

interface PlacesState {
  savedPlaces: SavedPlace[];
  frequentPlaces: SavedPlace[];

  addPlace: (place: SavedPlace) => void;
  removePlace: (placeId: string) => void;
  setSavedPlaces: (places: SavedPlace[]) => void;
  setFrequentPlaces: (places: SavedPlace[]) => void;
}

export const usePlacesStore = create<PlacesState>()(
  devtools(
    persist(
      (set) => ({
        savedPlaces: [],
        frequentPlaces: [],

        addPlace: (place) =>
          set((state) => ({
            savedPlaces: [place, ...state.savedPlaces],
          })),
        removePlace: (placeId) =>
          set((state) => ({
            savedPlaces: state.savedPlaces.filter((p) => p.id !== placeId),
          })),
        setSavedPlaces: (places) => set({ savedPlaces: places }),
        setFrequentPlaces: (places) => set({ frequentPlaces: places }),
      }),
      {
        name: "places-state",
      }
    )
  )
);

// ============================================================================
// Chat Store
// ============================================================================

interface ChatState {
  conversations: Record<string, ChatMessage[]>;
  currentConversationId: string | null;
  isLoading: boolean;

  setCurrentConversation: (id: string) => void;
  addMessage: (conversationId: string, message: ChatMessage) => void;
  setConversation: (id: string, messages: ChatMessage[]) => void;
  setLoading: (loading: boolean) => void;
  clearConversation: (id: string) => void;
}

export const useChatStore = create<ChatState>()(
  devtools(
    persist(
      (set) => ({
        conversations: {},
        currentConversationId: null,
        isLoading: false,

        setCurrentConversation: (id) => set({ currentConversationId: id }),
        addMessage: (conversationId, message) =>
          set((state) => ({
            conversations: {
              ...state.conversations,
              [conversationId]: [
                ...(state.conversations[conversationId] || []),
                message,
              ],
            },
          })),
        setConversation: (id, messages) =>
          set((state) => ({
            conversations: {
              ...state.conversations,
              [id]: messages,
            },
          })),
        setLoading: (loading) => set({ isLoading: loading }),
        clearConversation: (id) =>
          set((state) => {
            const newConversations = { ...state.conversations };
            delete newConversations[id];
            return { conversations: newConversations };
          }),
      }),
      {
        name: "chat-state",
      }
    )
  )
);

// ============================================================================
// UI Store
// ============================================================================

interface UIState {
  sidebarOpen: boolean;
  mapOpen: boolean;
  compareOpen: boolean;
  chatOpen: boolean;
  mobileMenuOpen: boolean;

  toggleSidebar: () => void;
  toggleMap: () => void;
  toggleCompare: () => void;
  toggleChat: () => void;
  toggleMobileMenu: () => void;
  closeAllModals: () => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        sidebarOpen: true,
        mapOpen: true,
        compareOpen: false,
        chatOpen: false,
        mobileMenuOpen: false,

        toggleSidebar: () =>
          set((state) => ({ sidebarOpen: !state.sidebarOpen })),
        toggleMap: () => set((state) => ({ mapOpen: !state.mapOpen })),
        toggleCompare: () =>
          set((state) => ({ compareOpen: !state.compareOpen })),
        toggleChat: () => set((state) => ({ chatOpen: !state.chatOpen })),
        toggleMobileMenu: () =>
          set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
        closeAllModals: () =>
          set({
            compareOpen: false,
            chatOpen: false,
            mobileMenuOpen: false,
          }),
      }),
      {
        name: "ui-state",
      }
    )
  )
);
