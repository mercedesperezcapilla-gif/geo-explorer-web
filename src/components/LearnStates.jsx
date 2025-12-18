import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { US_STATES, US_REGIONS } from '../data/usStates';
import { getStateShapeUrl } from '../data/countryCodes';
import './LearnStates.css';

const LearnStates = () => {
  const { setCurrentView } = useGame();
  const [selectedRegion, setSelectedRegion] = useState('Northeast');
  const [selectedState, setSelectedState] = useState(null);

  const statesByRegion = US_STATES.filter(
    s => s.region === selectedRegion
  );

  const getStateCount = (region) => {
    return US_STATES.filter(s => s.region === region).length;
  };

  return (
    <div className="learn-states">
      <div className="header-bar">
        <button onClick={() => setCurrentView('menu')} className="back-btn">
          ← Back to Menu
        </button>
        <h2>🗽 Learn US States</h2>
      </div>

      <div className="region-tabs">
        {US_REGIONS.map(region => (
          <button
            key={region}
            className={`region-tab ${selectedRegion === region ? 'active' : ''}`}
            onClick={() => {
              setSelectedRegion(region);
              setSelectedState(null);
            }}
          >
            {region} ({getStateCount(region)})
          </button>
        ))}
      </div>

      <div className="learn-content">
        <div className="states-list">
          <h3>{selectedRegion} ({statesByRegion.length} states)</h3>
          {statesByRegion.map(state => (
            <div
              key={state.name}
              className={`state-item ${selectedState?.name === state.name ? 'selected' : ''}`}
              onClick={() => setSelectedState(state)}
            >
              <span className="state-name">{state.name}</span>
              <span className="state-abbr">{state.abbreviation}</span>
            </div>
          ))}
        </div>

        {selectedState && (
          <div className="state-details">
            <div className="state-header">
              <div className="state-title">
                <h2>{selectedState.name}</h2>
                <span className="state-nickname">"{selectedState.nickname}"</span>
              </div>
            </div>

            <div className="state-shape-display">
              {getStateShapeUrl(selectedState.abbreviation) && (
                <img
                  src={getStateShapeUrl(selectedState.abbreviation, '256')}
                  alt={`${selectedState.name} shape`}
                  className="state-shape-large"
                />
              )}
            </div>

            <div className="detail-grid">
              <div className="detail-card">
                <h4>🏛️ Capital</h4>
                <p>{selectedState.capital}</p>
              </div>

              <div className="detail-card">
                <h4>🗺️ Region</h4>
                <p>{selectedState.region}</p>
              </div>

              <div className="detail-card">
                <h4>🏷️ Abbreviation</h4>
                <p>{selectedState.abbreviation}</p>
              </div>

              <div className="detail-card">
                <h4>⭐ Nickname</h4>
                <p>{selectedState.nickname}</p>
              </div>
            </div>

            <div className="detail-section">
              <h4>💡 Fun Fact</h4>
              <p>{selectedState.fact}</p>
            </div>
          </div>
        )}

        {!selectedState && (
          <div className="no-selection">
            <p>👈 Select a state to learn about it</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearnStates;
