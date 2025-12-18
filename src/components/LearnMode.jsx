import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { COUNTRIES, CONTINENTS } from '../data/countries';
import { MASTERY_LEVELS } from '../data/gameData';
import { getFlagUrl, getCountryShapeUrl } from '../data/countryCodes';
import InteractiveContinentMap from './InteractiveContinentMap';
import './LearnMode.css';

const LearnMode = () => {
  const { gameState, setCurrentView, updateCountryProgress } = useGame();
  const [selectedContinent, setSelectedContinent] = useState('All');
  const [selectedCountry, setSelectedCountry] = useState(null);

  const countriesByContinent = selectedContinent === 'All'
    ? COUNTRIES
    : COUNTRIES.filter(c => c.continent === selectedContinent);

  const getCountryCount = (continent) => {
    return COUNTRIES.filter(c => c.continent === continent).length;
  };

  const getPassportColorHex = (color) => {
    const colors = {
      red: '#8B0000',
      blue: '#003F87',
      green: '#228B22',
      black: '#2C2C2C',
      orange: '#FF8C00'
    };
    return colors[color.toLowerCase()] || '#666';
  };

  const getMasteryColor = (countryName) => {
    const level = gameState.country_progress[countryName] || 0;
    return MASTERY_LEVELS[level].color;
  };

  const getMasteryName = (countryName) => {
    const level = gameState.country_progress[countryName] || 0;
    return MASTERY_LEVELS[level].name;
  };

  const handleCountryClick = (country) => {
    setSelectedCountry(country);
    if (!gameState.country_progress[country.name]) {
      updateCountryProgress(country.name, true);
    }
  };

  return (
    <div className="learn-mode">
      <div className="header-bar">
        <button onClick={() => setCurrentView('menu')} className="back-btn">
          ← Back to Menu
        </button>
        <h2>🗺️ Interactive Geography Explorer</h2>
      </div>

      <div className="continent-tabs">
        <button
          className={`continent-tab ${selectedContinent === 'All' ? 'active' : ''}`}
          onClick={() => {
            setSelectedContinent('All');
            setSelectedCountry(null);
          }}
        >
          🌍 World View
        </button>
        {CONTINENTS.map(continent => (
          <button
            key={continent}
            className={`continent-tab ${selectedContinent === continent ? 'active' : ''}`}
            onClick={() => {
              setSelectedContinent(continent);
              setSelectedCountry(null);
            }}
          >
            {continent} ({getCountryCount(continent)})
          </button>
        ))}
      </div>

      {selectedContinent !== 'All' && (
        <div style={{ padding: '0 2rem', marginBottom: '2rem' }}>
          <InteractiveContinentMap
            continent={selectedContinent}
            onCountrySelect={(country) => {
              if (country) {
                handleCountryClick(country);
              } else {
                setSelectedCountry(null);
              }
            }}
            selectedCountry={selectedCountry}
          />
        </div>
      )}

      <div className="learn-content">
        <div className="countries-list">
          <h3>{selectedContinent} ({countriesByContinent.length} countries)</h3>
          {countriesByContinent.map(country => (
            <div
              key={country.name}
              className={`country-item ${selectedCountry?.name === country.name ? 'selected' : ''}`}
              onClick={() => handleCountryClick(country)}
            >
              <span className="country-flag">
                {getFlagUrl(country.name) ? (
                  <img
                    src={getFlagUrl(country.name, 'w40')}
                    alt={`${country.name} flag`}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'inline';
                    }}
                  />
                ) : null}
                <span style={{ display: getFlagUrl(country.name) ? 'none' : 'inline' }}>
                  {country.flag}
                </span>
              </span>
              <span className="country-name">{country.name}</span>
              <span
                className="mastery-badge"
                style={{ backgroundColor: getMasteryColor(country.name) }}
              >
                {getMasteryName(country.name)}
              </span>
            </div>
          ))}
        </div>

        {selectedCountry && (
          <div className="country-details">
            <div className="country-header">
              <div className="country-title">
                {getFlagUrl(selectedCountry.name) ? (
                  <img
                    src={getFlagUrl(selectedCountry.name, 'w80')}
                    alt={`${selectedCountry.name} flag`}
                    className="country-header-flag"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'inline';
                    }}
                  />
                ) : null}
                <span
                  className="flag-emoji-fallback"
                  style={{ display: getFlagUrl(selectedCountry.name) ? 'none' : 'inline' }}
                >
                  {selectedCountry.flag}
                </span>
                <h2>{selectedCountry.name}</h2>
              </div>
              <div
                className="mastery-indicator"
                style={{ color: getMasteryColor(selectedCountry.name) }}
              >
                {getMasteryName(selectedCountry.name)}
              </div>
            </div>

            <div className="detail-grid">
              <div className="detail-card">
                <h4>🏛️ Capital</h4>
                <p>{selectedCountry.capital}</p>
              </div>

              <div className="detail-card">
                <h4>🗺️ Continent</h4>
                <p>{selectedCountry.continent}</p>
              </div>

              <div className="detail-card">
                <h4>📕 Passport Color</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div
                    style={{
                      width: '60px',
                      height: '40px',
                      backgroundColor: getPassportColorHex(selectedCountry.passport),
                      border: '2px solid #ddd',
                      borderRadius: '5px'
                    }}
                  ></div>
                  <p style={{ textTransform: 'capitalize', margin: 0 }}>{selectedCountry.passport}</p>
                </div>
              </div>

              <div className="detail-card">
                <h4>📊 Difficulty</h4>
                <p>
                  {selectedCountry.level === 1 && '⭐ Beginner'}
                  {selectedCountry.level === 2 && '⭐⭐ Intermediate'}
                  {selectedCountry.level === 3 && '⭐⭐⭐ Advanced'}
                </p>
              </div>
            </div>

            <div className="detail-section">
              <h4>📐 Country Shape</h4>
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                {getCountryShapeUrl(selectedCountry.name) && (
                  <div style={{ flex: '0 0 auto' }}>
                    <img
                      src={getCountryShapeUrl(selectedCountry.name, '256')}
                      alt={`${selectedCountry.name} shape`}
                      style={{
                        width: '200px',
                        height: 'auto',
                        filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))',
                        borderRadius: '8px'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div style={{ flex: '1' }}>
                  <p style={{ fontSize: '1.05rem', lineHeight: '1.6' }}>{selectedCountry.shape}</p>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h4>💡 Fun Fact</h4>
              <p>{selectedCountry.fact}</p>
            </div>
          </div>
        )}

        {!selectedCountry && (
          <div className="no-selection">
            <p>👈 Select a country to learn about it</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearnMode;
