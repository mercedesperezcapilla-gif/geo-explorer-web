import { useGame } from '../context/GameContext';
import { COUNTRIES, CONTINENTS } from '../data/countries';
import { BADGES, LEVELS } from '../data/gameData';
import { MASTERY_LEVELS } from '../data/gameData';
import './Stats.css';

const Stats = () => {
  const { gameState, setCurrentView } = useGame();

  const currentLevel = LEVELS.filter(l => gameState.xp >= l.min_xp).pop();
  const nextLevel = LEVELS.find(l => l.min_xp > gameState.xp);

  const getContinentProgress = (continent) => {
    const continentCountries = COUNTRIES.filter(c => c.continent === continent);
    const masteredCount = continentCountries.filter(
      c => (gameState.country_progress[c.name] || 0) === 4
    ).length;
    return {
      total: continentCountries.length,
      mastered: masteredCount,
      percentage: Math.round((masteredCount / continentCountries.length) * 100)
    };
  };

  const earnedBadges = Object.entries(BADGES).filter(([key]) =>
    gameState.badges_earned.includes(key)
  );

  const lockedBadges = Object.entries(BADGES).filter(([key]) =>
    !gameState.badges_earned.includes(key)
  );

  return (
    <div className="stats-page">
      <div className="stats-header">
        <button onClick={() => setCurrentView('menu')} className="back-btn">
          ← Back to Menu
        </button>
        <h2>📊 Your Stats</h2>
      </div>

      <div className="stats-grid">
        <div className="stats-card player-overview">
          <h3>👤 Player Profile</h3>
          <div className="profile-content">
            <div className="profile-item">
              <span className="profile-label">Name:</span>
              <span className="profile-value">{gameState.player_name}</span>
            </div>
            <div className="profile-item">
              <span className="profile-label">Level:</span>
              <span className="profile-value">{currentLevel.level} - {currentLevel.name}</span>
            </div>
            <div className="profile-item">
              <span className="profile-label">Total XP:</span>
              <span className="profile-value">{gameState.xp} XP</span>
            </div>
            {nextLevel && (
              <div className="profile-item">
                <span className="profile-label">Next Level:</span>
                <span className="profile-value">{nextLevel.min_xp - gameState.xp} XP away</span>
              </div>
            )}
            <div className="profile-item">
              <span className="profile-label">Streak:</span>
              <span className="profile-value">🔥 {gameState.streak_days} days</span>
            </div>
            <div className="profile-item">
              <span className="profile-label">Days Played:</span>
              <span className="profile-value">{gameState.days_played}</span>
            </div>
          </div>
        </div>

        <div className="stats-card quiz-stats">
          <h3>🎯 Quiz Statistics</h3>
          <div className="stat-row">
            <span>Quizzes Completed:</span>
            <span className="stat-value">{gameState.quizzes_completed}</span>
          </div>
          <div className="stat-row">
            <span>Total Correct:</span>
            <span className="stat-value correct">{gameState.total_correct}</span>
          </div>
          <div className="stat-row">
            <span>Total Incorrect:</span>
            <span className="stat-value incorrect">{gameState.total_incorrect}</span>
          </div>
          <div className="stat-row">
            <span>Accuracy:</span>
            <span className="stat-value">
              {gameState.total_correct + gameState.total_incorrect > 0
                ? Math.round((gameState.total_correct / (gameState.total_correct + gameState.total_incorrect)) * 100)
                : 0}%
            </span>
          </div>
          <div className="stat-row">
            <span>Capital Streak:</span>
            <span className="stat-value">{gameState.capital_streak}</span>
          </div>
          <div className="stat-row">
            <span>Flag Streak:</span>
            <span className="stat-value">{gameState.flag_streak}</span>
          </div>
          <div className="stat-row">
            <span>Speed Round Best:</span>
            <span className="stat-value">{gameState.speed_best}</span>
          </div>
          <div className="stat-row">
            <span>Perfect Challenges:</span>
            <span className="stat-value">{gameState.perfect_challenges}</span>
          </div>
        </div>

        <div className="stats-card mastery-overview">
          <h3>⭐ Mastery Progress</h3>
          <div className="mastery-summary">
            <div className="mastery-circle">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#e0e0e0" strokeWidth="10" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#667eea"
                  strokeWidth="10"
                  strokeDasharray={`${(gameState.total_mastered / 195) * 283} 283`}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="mastery-text">
                <div className="mastery-number">{gameState.total_mastered}</div>
                <div className="mastery-label">/ 195</div>
              </div>
            </div>
            <p className="mastery-description">Countries Mastered</p>
          </div>

          <div className="continent-breakdown">
            <h4>By Continent:</h4>
            {CONTINENTS.map(continent => {
              const progress = getContinentProgress(continent);
              return (
                <div key={continent} className="continent-stat">
                  <div className="continent-header">
                    <span>{continent}</span>
                    <span>{progress.mastered}/{progress.total}</span>
                  </div>
                  <div className="progress-bar-small">
                    <div
                      className="progress-fill"
                      style={{ width: `${progress.percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="stats-card badges-display">
          <h3>🏆 Badges ({earnedBadges.length}/{Object.keys(BADGES).length})</h3>

          {earnedBadges.length > 0 && (
            <div className="badges-section">
              <h4>Earned</h4>
              <div className="badges-grid">
                {earnedBadges.map(([key, badge]) => (
                  <div key={key} className="badge-item earned">
                    <span className="badge-icon">{badge.icon}</span>
                    <span className="badge-name">{badge.name}</span>
                    <span className="badge-desc">{badge.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {lockedBadges.length > 0 && (
            <div className="badges-section">
              <h4>Locked</h4>
              <div className="badges-grid">
                {lockedBadges.slice(0, 6).map(([key, badge]) => (
                  <div key={key} className="badge-item locked">
                    <span className="badge-icon">🔒</span>
                    <span className="badge-name">{badge.name}</span>
                    <span className="badge-desc">{badge.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stats;
