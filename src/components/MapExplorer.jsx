import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { CONTINENTS } from '../data/countries';
import InteractiveContinentMap from './InteractiveContinentMap';
import './MapExplorer.css';

const MapExplorer = () => {
  const { setCurrentView } = useGame();
  const [selectedContinent, setSelectedContinent] = useState('Europe');
  const [selectedCountry, setSelectedCountry] = useState(null);

  const handleCountrySelect = (country) => {
    // Exploring the map is for learning only — it must not count as a
    // correct answer or award mastery/XP. Just show the selected country.
    setSelectedCountry(country);
  };

  return (
    <div className="map-explorer">
      <div className="header-bar">
        <button onClick={() => setCurrentView('menu')} className="back-btn">
          ← Back to Menu
        </button>
        <h2>🗺️ Interactive Map Explorer</h2>
      </div>

      <div className="continent-selector">
        <h3>Select a Continent to Explore:</h3>
        <div className="continent-buttons">
          {CONTINENTS.map((continent) => (
            <button
              key={continent}
              className={`continent-btn ${selectedContinent === continent ? 'active' : ''}`}
              onClick={() => {
                setSelectedContinent(continent);
                setSelectedCountry(null);
              }}
            >
              {continent === 'Europe' && '🇪🇺'}
              {continent === 'Asia' && '🌏'}
              {continent === 'Africa' && '🦁'}
              {continent === 'North America' && '🌎'}
              {continent === 'South America' && '🗺️'}
              {continent === 'Oceania' && '🏝️'}
              {' '}
              {continent}
            </button>
          ))}
        </div>
      </div>

      <div className="map-content">
        <InteractiveContinentMap
          continent={selectedContinent}
          onCountrySelect={handleCountrySelect}
          selectedCountry={selectedCountry}
        />
      </div>
    </div>
  );
};

export default MapExplorer;
