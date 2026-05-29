import { createContext, useContext, useState, useEffect } from 'react';
import { COUNTRIES } from '../data/countries';
import { BADGES, LEVELS, XP_REWARDS } from '../data/gameData';

const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

const getDefaultState = () => ({
  player_name: "Explorer",
  xp: 0,
  level: 1,
  streak_days: 0,
  last_played: new Date().toISOString().split('T')[0],
  days_played: 1,
  quizzes_completed: 0,
  total_correct: 0,
  total_incorrect: 0,
  speed_best: 0,
  perfect_challenges: 0,
  capital_streak: 0,
  current_capital_streak: 0,
  flag_streak: 0,
  current_flag_streak: 0,
  countries_seen: 0,
  europe_mastered: 0,
  asia_mastered: 0,
  north_america_mastered: 0,
  south_america_mastered: 0,
  africa_mastered: 0,
  oceania_mastered: 0,
  total_mastered: 0,
  country_progress: {},
  states_progress: {},
  badges_earned: [],
  achievements_new: []
});

  const loadInitialState = () => {
    const saved = localStorage.getItem('geo_explorer_save');
    // Merge over defaults so saves from older versions don't arrive with
    // missing fields (which previously caused undefined crashes on load).
    let state = saved
      ? { ...getDefaultState(), ...JSON.parse(saved) }
      : getDefaultState();

    // Apply daily streak / days-played once, at load time.
    const today = new Date().toISOString().split('T')[0];
    if (state.last_played !== today) {
      const lastDate = new Date(state.last_played);
      const todayDate = new Date(today);
      const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));
      state = {
        ...state,
        last_played: today,
        streak_days: diffDays === 1 ? state.streak_days + 1 : 1,
        days_played: state.days_played + 1
      };
    }
    return state;
  };

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState(loadInitialState);

  const [currentView, setCurrentView] = useState('menu');
  const [currentQuiz, setCurrentQuiz] = useState(null);

  useEffect(() => {
    localStorage.setItem('geo_explorer_save', JSON.stringify(gameState));
  }, [gameState]);

  const addXP = (amount) => {
    setGameState(prev => {
      const newXP = prev.xp + amount;
      const newLevel = LEVELS.filter(l => newXP >= l.min_xp).pop().level;
      return { ...prev, xp: newXP, level: newLevel };
    });
  };

  const updateCountryProgress = (countryName, correct) => {
    setGameState(prev => {
      const currentLevel = prev.country_progress[countryName] || 0;
      const newLevel = correct
        ? Math.min(4, currentLevel + 1)
        : Math.max(0, currentLevel - 1);

      const country = COUNTRIES.find(c => c.name === countryName);
      const wasMastered = currentLevel === 4;
      const nowMastered = newLevel === 4;
      const justMastered = nowMastered && !wasMastered;
      const justUnmastered = wasMastered && !nowMastered;
      const masteryDelta = justMastered ? 1 : (justUnmastered ? -1 : 0);

      const continentKey = country
        ? `${country.continent.toLowerCase().replace(/ /g, '_')}_mastered`
        : null;

      const updatedProgress = { ...prev.country_progress, [countryName]: newLevel };

      // Award mastery XP inside the same update so it can't read stale state
      // or be awarded on the wrong tick.
      const masteryXP = justMastered ? XP_REWARDS.country_mastered : 0;
      const newXP = prev.xp + masteryXP;
      const newPlayerLevel = LEVELS.filter(l => newXP >= l.min_xp).pop().level;

      return {
        ...prev,
        xp: newXP,
        level: newPlayerLevel,
        country_progress: updatedProgress,
        total_mastered: Math.max(0, prev.total_mastered + masteryDelta),
        ...(continentKey ? { [continentKey]: Math.max(0, (prev[continentKey] || 0) + masteryDelta) } : {}),
        countries_seen: Math.max(prev.countries_seen, Object.keys(updatedProgress).length)
      };
    });
  };

  const checkAndAwardBadges = () => {
    const newBadges = [];
    Object.entries(BADGES).forEach(([key, badge]) => {
      if (!gameState.badges_earned.includes(key) && badge.check(gameState)) {
        newBadges.push(key);
      }
    });

    if (newBadges.length > 0) {
      setGameState(prev => ({
        ...prev,
        badges_earned: [...prev.badges_earned, ...newBadges],
        achievements_new: newBadges
      }));
      addXP(XP_REWARDS.badge_earned * newBadges.length);
    }

    return newBadges;
  };

  const clearNewAchievements = () => {
    setGameState(prev => ({ ...prev, achievements_new: [] }));
  };

  const updateStats = (updates) => {
    setGameState(prev => ({ ...prev, ...updates }));
  };

  const resetProgress = () => {
    setGameState(getDefaultState());
  };

  const value = {
    gameState,
    currentView,
    setCurrentView,
    currentQuiz,
    setCurrentQuiz,
    addXP,
    updateCountryProgress,
    updateStats,
    checkAndAwardBadges,
    clearNewAchievements,
    resetProgress
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
