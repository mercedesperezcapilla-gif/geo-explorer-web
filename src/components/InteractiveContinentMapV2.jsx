import { useState } from 'react';
import PropTypes from 'prop-types';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { COUNTRIES } from '../data/countries';
import { getFlagUrl } from '../data/countryCodes';
import './InteractiveContinentMap.css';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const InteractiveContinentMapV2 = ({ continent, onCountrySelect, selectedCountry }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Get countries for this continent
  const continentCountries = COUNTRIES.filter(c => c.continent === continent);

  // Filter countries based on search query
  const filteredCountries = continentCountries.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.capital.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Auto-select first country if searching and found exact match
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length > 2) {
      const exactMatch = continentCountries.find(c =>
        c.name.toLowerCase() === query.toLowerCase()
      );
      if (exactMatch) {
        onCountrySelect(exactMatch);
      }
    }
  };

  // Define map projection centers for each continent
  const projectionConfig = {
    'Europe': { center: [15, 54], scale: 600 },
    'Asia': { center: [100, 35], scale: 300 },
    'Africa': { center: [20, 0], scale: 350 },
    'North America': { center: [-100, 50], scale: 350 },
    'South America': { center: [-60, -15], scale: 400 },
    'Oceania': { center: [135, -25], scale: 500 }
  };

  const config = projectionConfig[continent] || { center: [0, 0], scale: 150 };

  return (
    <div className="interactive-continent-map">
      <div className="map-header">
        <h3>🗺️ {continent} - {continentCountries.length} Countries</h3>
        <p className="map-instruction">Search for a country or click on the map!</p>

        {/* Search box */}
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Type a country name..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="country-search-input"
          />
          {searchQuery && (
            <button
              className="clear-search-btn"
              onClick={() => {
                setSearchQuery('');
                onCountrySelect(null);
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="map-display">
        {/* SVG Map */}
        <div className="map-svg-container">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              center: config.center,
              scale: config.scale
            }}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const countryName = geo.properties.name;
                  const isSelected = selectedCountry?.name === countryName;
                  const isInContinent = continentCountries.some(c =>
                    c.name.toLowerCase().includes(countryName.toLowerCase()) ||
                    countryName.toLowerCase().includes(c.name.toLowerCase())
                  );

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={isSelected ? "#F53" : isInContinent ? "#DDD" : "#EEE"}
                      stroke="#FFF"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { fill: "#667eea", outline: "none", cursor: "pointer" },
                        pressed: { fill: "#764ba2", outline: "none" }
                      }}
                      onClick={() => {
                        const matchingCountry = continentCountries.find(c =>
                          c.name.toLowerCase() === countryName.toLowerCase() ||
                          countryName.toLowerCase().includes(c.name.toLowerCase())
                        );
                        if (matchingCountry) {
                          onCountrySelect(matchingCountry);
                        }
                      }}
                    />
                  );
                })
              }
            </Geographies>

            {/* Marker for selected country */}
            {selectedCountry && (
              <Marker coordinates={config.center}>
                <circle r={10} fill="#F53" />
                <text
                  textAnchor="middle"
                  y={-15}
                  style={{ fill: "#F53", fontSize: "14px", fontWeight: "bold" }}
                >
                  {selectedCountry.name}
                </text>
              </Marker>
            )}
          </ComposableMap>

          <div className="map-attribution">
            Interactive SVG map with accurate coordinates
          </div>
        </div>

        {/* Interactive country list */}
        <div className="country-cards-grid">
          {filteredCountries.length === 0 && searchQuery && (
            <div className="no-results">
              <p>No countries found matching "{searchQuery}"</p>
            </div>
          )}
          {filteredCountries.map((country) => (
            <div
              key={country.name}
              className={`country-card ${selectedCountry?.name === country.name ? 'selected' : ''}`}
              onClick={() => onCountrySelect(country)}
            >
              <div className="country-card-flag">
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
                <span style={{ display: getFlagUrl(country.name) ? 'none' : 'inline', fontSize: '1.5rem' }}>
                  {country.flag}
                </span>
              </div>
              <div className="country-card-name">{country.name}</div>
              <div className="country-card-capital">{country.capital}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected country popup */}
      {selectedCountry && (
        <div className="country-popup">
          <div className="popup-header">
            <div className="popup-flag">
              {getFlagUrl(selectedCountry.name) ? (
                <img
                  src={getFlagUrl(selectedCountry.name, 'w80')}
                  alt={`${selectedCountry.name} flag`}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'inline';
                  }}
                />
              ) : null}
              <span style={{ display: getFlagUrl(selectedCountry.name) ? 'none' : 'inline', fontSize: '3rem' }}>
                {selectedCountry.flag}
              </span>
            </div>
            <div className="popup-title">
              <h3>{selectedCountry.name}</h3>
              <p>Capital: {selectedCountry.capital}</p>
            </div>
            <button
              className="popup-close-btn"
              onClick={() => onCountrySelect(null)}
              title="Close"
            >
              ✕
            </button>
          </div>

          <div className="popup-content">
            <div className="popup-fact">
              <strong>💡 Fun Fact:</strong>
              <p>{selectedCountry.fact}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

InteractiveContinentMapV2.propTypes = {
  continent: PropTypes.string.isRequired,
  onCountrySelect: PropTypes.func.isRequired,
  selectedCountry: PropTypes.object
};

export default InteractiveContinentMapV2;
