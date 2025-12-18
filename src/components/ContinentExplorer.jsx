import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { CONTINENTS } from '../data/countries';
import QuizEngine from './QuizEngine';
import './ContinentExplorer.css';

const ContinentExplorer = () => {
  const { setCurrentView } = useGame();
  const [selectedContinent, setSelectedContinent] = useState(null);
  const [selectedTypes, setSelectedTypes] = useState({
    capital: true,
    flag: false,
    passport: false
  });
  const [showQuiz, setShowQuiz] = useState(false);

  const handleTypeToggle = (type) => {
    setSelectedTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const hasSelectedType = Object.values(selectedTypes).some(v => v);

  const startQuiz = () => {
    if (hasSelectedType && selectedContinent) {
      setShowQuiz(true);
    }
  };

  if (!selectedContinent) {
    return (
      <div className="continent-selector">
        <div className="header-bar">
          <button onClick={() => setCurrentView('menu')} className="back-btn">
            ← Back to Menu
          </button>
          <h2>🌍 Continent Explorer</h2>
        </div>

        <div className="continent-selection-content">
          <p className="selection-instruction">Choose a continent to master:</p>
          <div className="continent-grid">
            {CONTINENTS.map(continent => (
              <button
                key={continent}
                className="continent-card"
                onClick={() => setSelectedContinent(continent)}
              >
                <span className="continent-icon">
                  {continent === 'Europe' && '🇪🇺'}
                  {continent === 'Asia' && '🌏'}
                  {continent === 'Africa' && '🌍'}
                  {continent === 'North America' && '🌎'}
                  {continent === 'South America' && '🗺️'}
                  {continent === 'Oceania' && '🌊'}
                </span>
                <span className="continent-name">{continent}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!showQuiz) {
    return (
      <div className="continent-selector">
        <div className="header-bar">
          <button onClick={() => setSelectedContinent(null)} className="back-btn">
            ← Back to Continents
          </button>
          <h2>🌍 {selectedContinent} Explorer</h2>
        </div>

        <div className="continent-selection-content">
          <p className="selection-instruction">Select question types for your quiz:</p>

          <div className="question-types-selector">
            <label className={`type-checkbox ${selectedTypes.capital ? 'checked' : ''}`}>
              <input
                type="checkbox"
                checked={selectedTypes.capital}
                onChange={() => handleTypeToggle('capital')}
              />
              <span className="checkbox-icon">🏛️</span>
              <span className="checkbox-label">
                <strong>Capitals</strong>
                <small>Match capitals to countries</small>
              </span>
            </label>

            <label className={`type-checkbox ${selectedTypes.flag ? 'checked' : ''}`}>
              <input
                type="checkbox"
                checked={selectedTypes.flag}
                onChange={() => handleTypeToggle('flag')}
              />
              <span className="checkbox-icon">🚩</span>
              <span className="checkbox-label">
                <strong>Flags</strong>
                <small>Identify country flags</small>
              </span>
            </label>

            <label className={`type-checkbox ${selectedTypes.passport ? 'checked' : ''}`}>
              <input
                type="checkbox"
                checked={selectedTypes.passport}
                onChange={() => handleTypeToggle('passport')}
              />
              <span className="checkbox-icon">📕</span>
              <span className="checkbox-label">
                <strong>Passports</strong>
                <small>Identify passport colors</small>
              </span>
            </label>
          </div>

          <button
            className="start-quiz-btn"
            onClick={startQuiz}
            disabled={!hasSelectedType}
          >
            {hasSelectedType ? '🚀 Start Quiz' : '⚠️ Select at least one question type'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <QuizEngine
      mode="continent"
      questionCount={8}
      title={`🌍 ${selectedContinent} Explorer`}
      selectedContinent={selectedContinent}
      selectedTypes={selectedTypes}
    />
  );
};

export default ContinentExplorer;
