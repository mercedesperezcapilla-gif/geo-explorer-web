import { useGame } from '../context/GameContext';
import { LEVELS } from '../data/gameData';
import './MainMenu.css';

const MainMenu = () => {
  const { gameState, setCurrentView } = useGame();

  const currentLevel = LEVELS.filter(l => gameState.xp >= l.min_xp).pop();
  const nextLevel = LEVELS.find(l => l.min_xp > gameState.xp);
  const xpProgress = nextLevel
    ? ((gameState.xp - currentLevel.min_xp) / (nextLevel.min_xp - currentLevel.min_xp) * 100)
    : 100;

  const getStreakEmoji = () => {
    if (gameState.streak_days >= 10) return '🔥🔥🔥';
    if (gameState.streak_days >= 5) return '🔥🔥';
    if (gameState.streak_days >= 1) return '🔥';
    return '';
  };

  const menuItems = [
    { id: 'map-explorer', icon: '🗺️', title: 'Interactive Maps', desc: 'Explore continents with maps!' },
    { id: 'learn', icon: '📚', title: 'Learn Mode', desc: 'Browse countries and facts' },
    { id: 'quick-quiz', icon: '🎯', title: 'Quick Quiz', desc: '5 random questions' },
    { id: 'challenge', icon: '🏆', title: 'Challenge Mode', desc: 'Test weak areas' },
    { id: 'continent', icon: '🌍', title: 'Continent Explorer', desc: 'Master one continent' },
    { id: 'speed', icon: '⚡', title: 'Speed Round', desc: '60 seconds!' },
    { id: 'learn-states', icon: '🗽', title: 'Learn US States', desc: 'Explore all 50 states' },
    { id: 'states-quiz', icon: '🇺🇸', title: 'States Quiz', desc: '10 US states questions' },
    { id: 'stats', icon: '📊', title: 'View Stats', desc: 'See your progress' },
  ];

  return (
    <div className="main-menu">
      <div className="header">
        <h1>🌍 GeoExplorer</h1>
        <p className="subtitle">Geography Learning for Year 7</p>
      </div>

      <div className="player-card">
        <div className="player-info">
          <h2>👤 {gameState.player_name}</h2>
          <div className="level-badge">
            Level {currentLevel.level}: {currentLevel.name}
          </div>
        </div>

        <div className="xp-section">
          <div className="xp-bar-container">
            <div className="xp-bar" style={{ width: `${xpProgress}%` }}></div>
          </div>
          <div className="xp-text">
            {gameState.xp} XP {nextLevel && `/ ${nextLevel.min_xp}`}
          </div>
        </div>

        <div className="quick-stats">
          <div className="stat-item">
            <span className="stat-icon">{getStreakEmoji()}</span>
            <span className="stat-value">{gameState.streak_days} day streak</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🏅</span>
            <span className="stat-value">{gameState.badges_earned.length} badges</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">⭐</span>
            <span className="stat-value">{gameState.total_mastered}/195 mastered</span>
          </div>
        </div>
      </div>

      <div className="menu-grid">
        {menuItems.map(item => (
          <button
            key={item.id}
            className="menu-item"
            onClick={() => setCurrentView(item.id)}
          >
            <div className="menu-icon">{item.icon}</div>
            <div className="menu-content">
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MainMenu;
