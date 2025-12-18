import { useState } from 'react';
import PropTypes from 'prop-types';
import { COUNTRIES } from '../data/countries';
import { getFlagUrl } from '../data/countryCodes';
import './InteractiveContinentMap.css';

const InteractiveContinentMap = ({ continent, onCountrySelect, selectedCountry }) => {
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Map continent names to image files
  const continentMaps = {
    'Europe': '/images/continents/europe.jpg',
    'Asia': '/images/continents/asia.jpg',
    'Africa': '/images/continents/africa.jpg',
    'North America': '/images/continents/north-america.jpg',
    'South America': '/images/continents/south-america.jpg',
    'Oceania': '/images/continents/oceania.jpg'
  };

  const mapImage = continentMaps[continent];

  // Country sizes for proportional glow zones (1=small, 2=medium, 3=large)
  const countrySizes = {
    // EUROPE - Large
    'France': 3, 'Spain': 3, 'Sweden': 3, 'Germany': 3, 'Finland': 3,
    'Norway': 3, 'Poland': 3, 'Italy': 3, 'United Kingdom': 3, 'Romania': 3,
    'Ukraine': 3, 'Greece': 3, 'Russia': 3,
    // EUROPE - Medium
    'Portugal': 2, 'Bulgaria': 2, 'Hungary': 2, 'Serbia': 2, 'Austria': 2,
    'Czech Republic': 2, 'Ireland': 2, 'Croatia': 2, 'Bosnia and Herzegovina': 2,
    'Slovakia': 2, 'Denmark': 2, 'Switzerland': 2, 'Netherlands': 2, 'Belgium': 2,
    'Albania': 2, 'North Macedonia': 2, 'Belarus': 2, 'Latvia': 2, 'Lithuania': 2,
    'Estonia': 2, 'Moldova': 2, 'Iceland': 2,
    // EUROPE - Small
    'Slovenia': 1, 'Montenegro': 1, 'Kosovo': 1, 'Luxembourg': 1, 'Andorra': 1,
    'Malta': 1, 'Liechtenstein': 1, 'San Marino': 1, 'Monaco': 1, 'Vatican City': 1,

    // ASIA - Large
    'China': 3, 'India': 3, 'Kazakhstan': 3, 'Saudi Arabia': 3, 'Indonesia': 3,
    'Iran': 3, 'Mongolia': 3, 'Pakistan': 3, 'Turkey': 3, 'Myanmar': 3,
    'Afghanistan': 3, 'Yemen': 3, 'Thailand': 3, 'Uzbekistan': 3,
    // ASIA - Medium
    'Japan': 2, 'Vietnam': 2, 'Malaysia': 2, 'Iraq': 2, 'Philippines': 2,
    'Oman': 2, 'Laos': 2, 'Syria': 2, 'Cambodia': 2, 'Bangladesh': 2,
    'Nepal': 2, 'Tajikistan': 2, 'South Korea': 2, 'North Korea': 2,
    'Azerbaijan': 2, 'United Arab Emirates': 2, 'Jordan': 2, 'Georgia': 2,
    'Sri Lanka': 2, 'Armenia': 2, 'East Timor': 2, 'Cyprus': 2,
    // ASIA - Small
    'Israel': 1, 'Kuwait': 1, 'Lebanon': 1, 'Bhutan': 1, 'Qatar': 1,
    'Bahrain': 1, 'Brunei': 1, 'Maldives': 1, 'Singapore': 1,

    // AFRICA - Large
    'Algeria': 3, 'Democratic Republic of the Congo': 3, 'Sudan': 3, 'Libya': 3,
    'Chad': 3, 'Niger': 3, 'Angola': 3, 'Mali': 3, 'South Africa': 3,
    'Ethiopia': 3, 'Mauritania': 3, 'Egypt': 3, 'Tanzania': 3, 'Nigeria': 3,
    'Namibia': 3, 'Mozambique': 3, 'Zambia': 3, 'Somalia': 3, 'Central African Republic': 3,
    'Madagascar': 3, 'Botswana': 3, 'Kenya': 3, 'Cameroon': 3,
    // AFRICA - Medium
    'Morocco': 2, 'Zimbabwe': 2, 'Gabon': 2, 'Guinea': 2, 'Uganda': 2,
    'Ghana': 2, 'Senegal': 2, 'Tunisia': 2, 'Malawi': 2, 'Eritrea': 2,
    'Benin': 2, 'Liberia': 2, 'Burkina Faso': 2, 'Ivory Coast': 2,
    'Togo': 2, 'Sierra Leone': 2, 'South Sudan': 2, 'Burundi': 2,
    'Rwanda': 2, 'Lesotho': 2, 'Equatorial Guinea': 2, 'Djibouti': 2,
    'Eswatini': 2, 'Guinea-Bissau': 2, 'Gambia': 2,
    // AFRICA - Small
    'Mauritius': 1, 'Comoros': 1, 'Cape Verde': 1, 'Sao Tome and Principe': 1, 'Seychelles': 1,

    // NORTH AMERICA - Large
    'Canada': 3, 'United States': 3, 'Mexico': 3,
    // NORTH AMERICA - Medium
    'Nicaragua': 2, 'Honduras': 2, 'Cuba': 2, 'Guatemala': 2, 'Panama': 2,
    'Costa Rica': 2, 'Dominican Republic': 2, 'Haiti': 2, 'Belize': 2,
    'El Salvador': 2, 'Bahamas': 2, 'Jamaica': 2, 'Trinidad and Tobago': 2,
    // NORTH AMERICA - Small
    'Dominica': 1, 'Saint Lucia': 1, 'Antigua and Barbuda': 1, 'Barbados': 1,
    'Saint Vincent and the Grenadines': 1, 'Grenada': 1, 'Saint Kitts and Nevis': 1,

    // SOUTH AMERICA - Large
    'Brazil': 3, 'Argentina': 3, 'Peru': 3, 'Colombia': 3, 'Bolivia': 3,
    'Venezuela': 3, 'Chile': 3,
    // SOUTH AMERICA - Medium
    'Paraguay': 2, 'Ecuador': 2, 'Guyana': 2, 'Uruguay': 2, 'Suriname': 2,

    // OCEANIA - Large
    'Australia': 3, 'Papua New Guinea': 3, 'New Zealand': 3,
    // OCEANIA - Medium
    'Solomon Islands': 2, 'Fiji': 2, 'Vanuatu': 2, 'Samoa': 2,
    // OCEANIA - Small
    'Kiribati': 1, 'Micronesia': 1, 'Tonga': 1, 'Palau': 1, 'Marshall Islands': 1,
    'Nauru': 1, 'Tuvalu': 1
  };

  // Get countries for this continent
  const continentCountries = COUNTRIES.filter(c => c.continent === continent);

  // Map bounds for each continent (adjusted to match JPG map projections)
  const continentBounds = {
    'Europe': { minLon: -15, maxLon: 45, minLat: 35, maxLat: 72 },
    'Asia': { minLon: 55, maxLon: 155, minLat: 8, maxLat: 58 },
    'Africa': { minLon: -22, maxLon: 54, minLat: -36, maxLat: 38 },
    'North America': { minLon: -175, maxLon: -45, minLat: 12, maxLat: 78 },
    'South America': { minLon: -85, maxLon: -32, minLat: -58, maxLat: 15 },
    'Oceania': { minLon: 108, maxLon: 185, minLat: -50, maxLat: -8 }
  };

  // Convert geographic coordinates (lat, lon) to map percentages based on continent
  const convertGeoToMapCoords = (lat, lon) => {
    const mapBounds = continentBounds[continent] || continentBounds['Europe'];
    const x = ((lon - mapBounds.minLon) / (mapBounds.maxLon - mapBounds.minLon)) * 100;
    const y = 100 - ((lat - mapBounds.minLat) / (mapBounds.maxLat - mapBounds.minLat)) * 100;
    return { x: Math.round(x), y: Math.round(y) };
  };

  // Country centroids (latitude, longitude) - REAL GEOGRAPHIC DATA
  const countryCentroids = {
    'United Kingdom': [53.5, -1.5],  // Adjusted: centered over England
    'France': [46.6, 2.3],
    'Germany': [51.0, 10.0],
    'Spain': [40.0, -4.0],
    'Italy': [43.0, 12.5],  // Adjusted: centered over mainland Italy
    'Poland': [52.0, 19.5],
    'Ukraine': [48.5, 31.0],
    'Romania': [45.8, 24.5],
    'Netherlands': [52.3, 5.5],
    'Belgium': [50.6, 4.6],
    'Greece': [39.0, 22.0],
    'Portugal': [41.5, -8.5],
    'Sweden': [62.0, 15.0],
    'Norway': [60.5, 8.5],
    'Denmark': [56.0, 10.0],
    'Finland': [64.0, 26.0],
    'Switzerland': [46.8, 8.2],
    'Austria': [47.5, 14.0],
    'Czech Republic': [49.8, 15.5],
    'Hungary': [47.2, 19.5],
    'Ireland': [54.8, -7.7],
    'Croatia': [45.2, 15.5],
    'Serbia': [44.0, 21.0],
    'Bulgaria': [42.7, 25.5],
    'Slovakia': [48.7, 19.5],
    'Bosnia and Herzegovina': [44.0, 18.0],
    'Albania': [41.2, 20.0],
    'North Macedonia': [41.6, 21.7],
    'Slovenia': [46.1, 14.8],
    'Lithuania': [55.2, 23.9],
    'Latvia': [56.3, 23.5],
    'Estonia': [58.6, 25.3],
    'Belarus': [53.7, 27.5],
    'Moldova': [47.2, 28.5],
    'Russia': [55.7, 35.0],
    'Iceland': [65.0, -18.0],
    'Luxembourg': [49.8, 6.1],
    'Montenegro': [42.7, 19.4],
    'Kosovo': [42.6, 20.9],
    'Andorra': [42.5, 1.5],
    'Malta': [35.9, 14.4],
    'Liechtenstein': [47.1, 9.5],
    'San Marino': [43.9, 12.5],
    'Monaco': [43.7, 7.4],
    'Vatican City': [41.9, 12.5],

    // ASIA
    'China': [35.0, 105.0],
    'India': [20.0, 77.0],
    'Indonesia': [-2.0, 120.0],
    'Pakistan': [30.0, 70.0],
    'Bangladesh': [24.0, 90.0],
    'Japan': [36.0, 138.0],
    'Philippines': [13.0, 122.0],
    'Vietnam': [16.0, 106.0],
    'Turkey': [39.0, 35.0],
    'Iran': [32.0, 53.0],
    'Thailand': [15.0, 100.0],
    'Myanmar': [22.0, 98.0],
    'South Korea': [37.0, 127.5],
    'Afghanistan': [33.0, 65.0],
    'Iraq': [33.0, 44.0],
    'Saudi Arabia': [24.0, 45.0],
    'Uzbekistan': [41.0, 64.0],
    'Malaysia': [2.5, 112.5],
    'Nepal': [28.0, 84.0],
    'Yemen': [15.5, 48.0],
    'North Korea': [40.0, 127.0],
    'Sri Lanka': [7.0, 81.0],
    'Kazakhstan': [48.0, 68.0],
    'Syria': [35.0, 38.0],
    'Cambodia': [13.0, 105.0],
    'Jordan': [31.0, 36.0],
    'Azerbaijan': [40.5, 47.5],
    'United Arab Emirates': [24.0, 54.0],
    'Tajikistan': [39.0, 71.0],
    'Israel': [31.5, 34.8],
    'Laos': [18.0, 105.0],
    'Lebanon': [33.8, 35.8],
    'Singapore': [1.3, 103.8],
    'Oman': [21.0, 57.0],
    'Kuwait': [29.5, 47.5],
    'Georgia': [42.0, 43.5],
    'Mongolia': [46.0, 105.0],
    'Armenia': [40.0, 45.0],
    'Qatar': [25.5, 51.2],
    'Bahrain': [26.0, 50.5],
    'East Timor': [-8.8, 125.9],
    'Cyprus': [35.0, 33.0],
    'Bhutan': [27.5, 90.5],
    'Maldives': [3.2, 73.0],
    'Brunei': [4.5, 114.7],

    // AFRICA
    'Nigeria': [9.0, 8.0],
    'Ethiopia': [9.0, 40.0],
    'Egypt': [26.0, 30.0],
    'Democratic Republic of the Congo': [-4.0, 22.0],
    'Tanzania': [-6.0, 35.0],
    'South Africa': [-29.0, 24.0],
    'Kenya': [1.0, 38.0],
    'Sudan': [15.0, 30.0],
    'Algeria': [28.0, 3.0],
    'Uganda': [1.0, 32.0],
    'Morocco': [32.0, -5.0],
    'Angola': [-12.0, 18.0],
    'Ghana': [8.0, -2.0],
    'Mozambique': [-18.0, 35.0],
    'Madagascar': [-19.0, 46.0],
    'Cameroon': [6.0, 12.0],
    'Ivory Coast': [8.0, -5.0],
    'Niger': [16.0, 8.0],
    'Burkina Faso': [13.0, -2.0],
    'Mali': [17.0, -4.0],
    'Malawi': [-13.5, 34.0],
    'Zambia': [-15.0, 30.0],
    'Somalia': [10.0, 49.0],
    'Senegal': [14.0, -14.0],
    'Chad': [15.0, 19.0],
    'Zimbabwe': [-19.0, 29.5],
    'Guinea': [11.0, -10.0],
    'Rwanda': [-2.0, 30.0],
    'Benin': [9.5, 2.2],
    'Burundi': [-3.5, 30.0],
    'Tunisia': [34.0, 9.0],
    'South Sudan': [7.0, 30.0],
    'Togo': [8.0, 1.2],
    'Sierra Leone': [8.5, -11.5],
    'Libya': [27.0, 17.0],
    'Liberia': [6.5, -9.5],
    'Mauritania': [20.0, -10.0],
    'Central African Republic': [7.0, 21.0],
    'Eritrea': [15.0, 39.0],
    'Gambia': [13.5, -15.5],
    'Botswana': [-22.0, 24.0],
    'Namibia': [-22.0, 17.0],
    'Gabon': [-1.0, 11.7],
    'Lesotho': [-29.5, 28.5],
    'Guinea-Bissau': [12.0, -15.0],
    'Equatorial Guinea': [2.0, 10.0],
    'Mauritius': [-20.2, 57.5],
    'Eswatini': [-26.5, 31.5],
    'Djibouti': [11.5, 43.0],
    'Comoros': [-12.2, 44.4],
    'Cape Verde': [16.0, -24.0],
    'Sao Tome and Principe': [0.3, 6.7],
    'Seychelles': [-4.6, 55.5],

    // NORTH AMERICA
    'United States': [38.0, -97.0],
    'Mexico': [23.0, -102.0],
    'Canada': [60.0, -95.0],
    'Guatemala': [15.5, -90.2],
    'Cuba': [21.5, -80.0],
    'Haiti': [19.0, -72.4],
    'Dominican Republic': [19.0, -70.7],
    'Honduras': [15.0, -86.5],
    'Nicaragua': [13.0, -85.0],
    'El Salvador': [13.8, -88.9],
    'Costa Rica': [10.0, -84.0],
    'Panama': [9.0, -80.0],
    'Jamaica': [18.1, -77.3],
    'Trinidad and Tobago': [11.0, -61.0],
    'Belize': [17.2, -88.7],
    'Bahamas': [24.2, -76.0],
    'Barbados': [13.2, -59.5],
    'Saint Lucia': [14.0, -61.0],
    'Grenada': [12.1, -61.7],
    'Saint Vincent and the Grenadines': [13.2, -61.2],
    'Antigua and Barbuda': [17.0, -61.8],
    'Dominica': [15.4, -61.3],
    'Saint Kitts and Nevis': [17.3, -62.7],

    // SOUTH AMERICA
    'Brazil': [-10.0, -55.0],
    'Colombia': [4.0, -72.0],
    'Argentina': [-34.0, -64.0],
    'Peru': [-10.0, -76.0],
    'Venezuela': [8.0, -66.0],
    'Chile': [-30.0, -71.0],
    'Ecuador': [-2.0, -77.5],
    'Bolivia': [-17.0, -65.0],
    'Paraguay': [-23.0, -58.0],
    'Uruguay': [-33.0, -56.0],
    'Guyana': [5.0, -59.0],
    'Suriname': [4.0, -56.0],

    // OCEANIA
    'Australia': [-25.0, 133.0],
    'Papua New Guinea': [-6.0, 147.0],
    'New Zealand': [-41.0, 174.0],
    'Fiji': [-18.0, 178.0],
    'Solomon Islands': [-8.0, 159.0],
    'Micronesia': [6.9, 158.2],
    'Vanuatu': [-16.0, 167.0],
    'Samoa': [-13.6, -172.3],
    'Kiribati': [1.4, 173.0],
    'Tonga': [-21.2, -175.2],
    'Palau': [7.5, 134.5],
    'Marshall Islands': [7.1, 171.2],
    'Nauru': [-0.5, 166.9],
    'Tuvalu': [-8.5, 179.2],
  };

  // Convert all centroids to map coordinates
  const countryCoordinates = {};
  Object.keys(countryCentroids).forEach(country => {
    const [lat, lon] = countryCentroids[country];
    countryCoordinates[country] = convertGeoToMapCoords(lat, lon);
  });

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

  if (!mapImage) {
    return (
      <div className="map-container">
        <div className="map-error">
          <p>Map not available for {continent}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="interactive-continent-map">
      <div className="map-header">
        <h3>🗺️ {continent} - {continentCountries.length} Countries</h3>
        <p className="map-instruction">Search for a country or click on one below!</p>

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
        {/* Continent map image */}
        <div className="map-image-container">
          <img
            src={mapImage}
            alt={`${continent} map with capitals`}
            className="continent-map-image"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = `
                <div class="map-error">
                  <p>📍 ${continent} Map</p>
                  <p>Image not loaded</p>
                </div>
              `;
            }}
          />

          {/* Enhanced glow zones for selected country */}
          {selectedCountry && countryCoordinates[selectedCountry.name] ? (
            <div
              className="country-glow-zone"
              style={{
                left: `${countryCoordinates[selectedCountry.name].x}%`,
                top: `${countryCoordinates[selectedCountry.name].y}%`,
              }}
            >
              {/* Multiple glow layers for depth */}
              <div
                className="glow-layer glow-outer"
                style={{
                  width: `${(countrySizes[selectedCountry.name] || 2) * 80}px`,
                  height: `${(countrySizes[selectedCountry.name] || 2) * 60}px`,
                }}
              ></div>
              <div
                className="glow-layer glow-middle"
                style={{
                  width: `${(countrySizes[selectedCountry.name] || 2) * 60}px`,
                  height: `${(countrySizes[selectedCountry.name] || 2) * 45}px`,
                }}
              ></div>
              <div
                className="glow-layer glow-inner"
                style={{
                  width: `${(countrySizes[selectedCountry.name] || 2) * 40}px`,
                  height: `${(countrySizes[selectedCountry.name] || 2) * 30}px`,
                }}
              ></div>
              <div className="glow-center"></div>

              {/* Country label */}
              <div className="highlight-label">{selectedCountry.name}</div>
            </div>
          ) : null}

          {/* Attribution overlay */}
          <div className="map-attribution">
            Maps © OnTheWorldMap.com - Educational use
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
              className={`country-card ${selectedCountry?.name === country.name ? 'selected' : ''} ${hoveredCountry === country.name ? 'hovered' : ''}`}
              onClick={() => onCountrySelect(country)}
              onMouseEnter={() => setHoveredCountry(country.name)}
              onMouseLeave={() => setHoveredCountry(null)}
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

InteractiveContinentMap.propTypes = {
  continent: PropTypes.string.isRequired,
  onCountrySelect: PropTypes.func.isRequired,
  selectedCountry: PropTypes.object
};

export default InteractiveContinentMap;
