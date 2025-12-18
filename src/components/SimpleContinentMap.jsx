import { getFlagUrl } from '../data/countryCodes';
import { COUNTRIES } from '../data/countries';

const SimpleContinentMap = ({ countryName, continent }) => {
  // Get country details
  const selectedCountryData = COUNTRIES.find(c => c.name === countryName);

  // Map continent names to image files
  const continentMaps = {
    'Europe': '/maps/europe.png',
    'Asia': '/maps/asia.png',
    'Africa': '/maps/africa.png',
    'North America': '/maps/north-america.png',
    'South America': '/maps/south-america.png',
    'Oceania': '/maps/oceania.png'
  };

  const mapImage = continentMaps[continent];

  if (!mapImage) {
    return (
      <div style={{
        width: '100%',
        height: '400px',
        background: '#f0f4f8',
        borderRadius: '15px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid #e0e0e0'
      }}>
        <p style={{ color: '#666' }}>Map not available for {continent}</p>
      </div>
    );
  }

  return (
    <div style={{
      width: '100%',
      background: '#f0f4f8',
      borderRadius: '15px',
      overflow: 'hidden',
      position: 'relative',
      border: '2px solid #e0e0e0',
      padding: '1rem'
    }}>
      {/* Static continent map image */}
      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px'
      }}>
        <img
          src={mapImage}
          alt={`${continent} map`}
          style={{
            maxWidth: '100%',
            height: 'auto',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
          onError={(e) => {
            e.target.parentElement.innerHTML = `
              <div style="padding: 2rem; text-align: center; color: #666;">
                <p style="margin: 0 0 1rem 0; font-size: 1.1rem;">📍 ${continent} Map</p>
                <p style="margin: 0; font-size: 0.95rem;">Please add ${continent.toLowerCase()}.png to the /public/maps/ folder</p>
              </div>
            `;
          }}
        />
      </div>

      {/* Country info overlay */}
      {selectedCountryData && (
        <div style={{
          marginTop: '1rem',
          background: 'rgba(255, 255, 255, 0.98)',
          borderRadius: '12px',
          padding: '1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          border: '2px solid #667eea'
        }}>
          {/* Flag */}
          <div style={{ flex: '0 0 auto' }}>
            {getFlagUrl(countryName) ? (
              <img
                src={getFlagUrl(countryName, 'w80')}
                alt={`${countryName} flag`}
                style={{
                  width: '60px',
                  height: 'auto',
                  borderRadius: '4px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <span style={{ fontSize: '3rem' }}>{selectedCountryData.flag}</span>
            )}
          </div>

          {/* Country info */}
          <div style={{ flex: '1' }}>
            <h3 style={{
              margin: '0 0 0.5rem 0',
              color: '#667eea',
              fontSize: '1.3rem',
              fontWeight: '700'
            }}>
              {countryName}
            </h3>
            <p style={{
              margin: 0,
              color: '#666',
              fontSize: '1rem'
            }}>
              <strong>Capital:</strong> {selectedCountryData.capital}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleContinentMap;
