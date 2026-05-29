import { COUNTRIES } from './countries';

// Derive counts from the actual data so badge thresholds can never drift out
// of sync (previously Asia needed 48 and "all countries" needed 195, but the
// data only has 45 and 192 — making those badges impossible to earn).
const COUNT = {
  total: COUNTRIES.length,
  europe: COUNTRIES.filter(c => c.continent === 'Europe').length,
  asia: COUNTRIES.filter(c => c.continent === 'Asia').length,
  north_america: COUNTRIES.filter(c => c.continent === 'North America').length,
  south_america: COUNTRIES.filter(c => c.continent === 'South America').length,
  africa: COUNTRIES.filter(c => c.continent === 'Africa').length,
  oceania: COUNTRIES.filter(c => c.continent === 'Oceania').length,
};

export const BADGES = {
  globe_trotter: {
    name: "Globe Trotter",
    icon: "🌍",
    description: "Complete your first quiz",
    check: (stats) => stats.quizzes_completed >= 1
  },
  euro_expert: {
    name: "Euro Expert",
    icon: "🇪🇺",
    description: "Master all European countries",
    check: (stats) => stats.europe_mastered >= COUNT.europe
  },
  asia_ace: {
    name: "Asia Ace",
    icon: "🌏",
    description: "Master all Asian countries",
    check: (stats) => stats.asia_mastered >= COUNT.asia
  },
  north_america_hero: {
    name: "North America Hero",
    icon: "🌎",
    description: "Master all North American countries",
    check: (stats) => stats.north_america_mastered >= COUNT.north_america
  },
  south_america_hero: {
    name: "South America Hero",
    icon: "🗺️",
    description: "Master all South American countries",
    check: (stats) => stats.south_america_mastered >= COUNT.south_america
  },
  africa_adventurer: {
    name: "Africa Adventurer",
    icon: "🦁",
    description: "Master all African countries",
    check: (stats) => stats.africa_mastered >= COUNT.africa
  },
  oceania_explorer: {
    name: "Oceania Explorer",
    icon: "🏝️",
    description: "Master all Oceania countries",
    check: (stats) => stats.oceania_mastered >= COUNT.oceania
  },
  capital_king: {
    name: "Capital King",
    icon: "🏛️",
    description: "Get 20 capitals correct in a row",
    check: (stats) => stats.capital_streak >= 20
  },
  flag_finder: {
    name: "Flag Finder",
    icon: "🚩",
    description: "Get 20 flags correct in a row",
    check: (stats) => stats.flag_streak >= 20
  },
  speed_demon: {
    name: "Speed Demon",
    icon: "⚡",
    description: "Score 15+ in Speed Round",
    check: (stats) => stats.speed_best >= 15
  },
  dedicated: {
    name: "Dedicated",
    icon: "📅",
    description: "7-day streak",
    check: (stats) => stats.streak_days >= 7
  },
  sharp_shooter: {
    name: "Sharp Shooter",
    icon: "🎯",
    description: "100% on a Challenge Mode",
    check: (stats) => stats.perfect_challenges >= 1
  },
  geography_genius: {
    name: "Geography Genius",
    icon: "🌟",
    description: "Master all countries",
    check: (stats) => stats.total_mastered >= COUNT.total
  },
  first_steps: {
    name: "First Steps",
    icon: "👣",
    description: "Learn your first country",
    check: (stats) => stats.countries_seen >= 1
  },
  quick_learner: {
    name: "Quick Learner",
    icon: "📚",
    description: "Complete 5 quizzes",
    check: (stats) => stats.quizzes_completed >= 5
  },
  persistent: {
    name: "Persistent",
    icon: "💪",
    description: "Play on 3 different days",
    check: (stats) => stats.days_played >= 3
  },
  century: {
    name: "Century",
    icon: "💯",
    description: "Answer 100 questions correctly",
    check: (stats) => stats.total_correct >= 100
  },
  half_way: {
    name: "Half Way There",
    icon: "🌗",
    description: "Master 100 countries",
    check: (stats) => stats.total_mastered >= 100
  },
  streak_starter: {
    name: "Streak Starter",
    icon: "🔥",
    description: "3-day streak",
    check: (stats) => stats.streak_days >= 3
  },
  level_up: {
    name: "Level Up",
    icon: "⬆️",
    description: "Reach Level 3",
    check: (stats) => stats.level >= 3
  },
  xp_hunter: {
    name: "XP Hunter",
    icon: "✨",
    description: "Earn 1000 XP",
    check: (stats) => stats.xp >= 1000
  }
};

export const LEVELS = [
  { level: 1, name: "Explorer", min_xp: 0 },
  { level: 2, name: "Traveller", min_xp: 100 },
  { level: 3, name: "Navigator", min_xp: 300 },
  { level: 4, name: "Cartographer", min_xp: 600 },
  { level: 5, name: "Geographer", min_xp: 1000 },
  { level: 6, name: "World Expert", min_xp: 1500 },
  { level: 7, name: "Geography Master", min_xp: 2500 }
];

export const XP_REWARDS = {
  correct_answer: 10,
  streak_bonus_3: 5,
  streak_bonus_5: 10,
  streak_bonus_10: 25,
  quiz_complete: 20,
  perfect_quiz: 50,
  badge_earned: 30,
  country_mastered: 25
};

export const MASTERY_LEVELS = {
  0: { name: "Not Started", color: "#999" },
  1: { name: "Learning", color: "#f39c12" },
  2: { name: "Practicing", color: "#3498db" },
  3: { name: "Confident", color: "#2ecc71" },
  4: { name: "Mastered", color: "#9b59b6" }
};
