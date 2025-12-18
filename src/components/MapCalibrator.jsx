import { useState } from 'react';

const MapCalibrator = () => {
  const [coordinates, setCoordinates] = useState({});
  const [currentCountry, setCurrentCountry] = useState('');
  const [showOutput, setShowOutput] = useState(false);

  const countries = [
    'United Kingdom', 'France', 'Germany', 'Spain', 'Italy', 'Poland',
    'Netherlands', 'Belgium', 'Portugal', 'Greece', 'Sweden', 'Norway',
    'Denmark', 'Finland', 'Switzerland', 'Austria', 'Czech Republic',
    'Hungary', 'Ireland', 'Romania', 'Ukraine'
  ];

  const handleMapClick = (e) => {
    if (!currentCountry) {
      alert('Please select a country first!');
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setCoordinates(prev => ({
      ...prev,
      [currentCountry]: { x: Math.round(x), y: Math.round(y) }
    }));

    // Move to next country
    const currentIndex = countries.indexOf(currentCountry);
    if (currentIndex < countries.length - 1) {
      setCurrentCountry(countries[currentIndex + 1]);
    } else {
      setCurrentCountry('');
      setShowOutput(true);
    }
  };

  const generateCode = () => {
    let code = 'const countryCoordinates = {\n';
    Object.entries(coordinates).forEach(([country, coords]) => {
      code += `  '${country}': { x: ${coords.x}, y: ${coords.y} },\n`;
    });
    code += '};';
    return code;
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🗺️ Map Coordinate Calibrator</h1>

      <div style={{ marginBottom: '2rem' }}>
        <h3>Instructions:</h3>
        <ol>
          <li>Select a country from the dropdown</li>
          <li>Click on that country's location on the map</li>
          <li>Repeat for all countries</li>
          <li>Copy the generated coordinates</li>
        </ol>
      </div>

      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <label>
          <strong>Current Country:</strong>
          <select
            value={currentCountry}
            onChange={(e) => setCurrentCountry(e.target.value)}
            style={{ marginLeft: '1rem', padding: '0.5rem', fontSize: '1rem' }}
          >
            <option value="">-- Select Country --</option>
            {countries.map(c => (
              <option key={c} value={c}>
                {c} {coordinates[c] ? '✅' : ''}
              </option>
            ))}
          </select>
        </label>

        <button
          onClick={() => setShowOutput(true)}
          style={{
            padding: '0.5rem 1rem',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Show Code
        </button>
      </div>

      <div style={{ marginBottom: '1rem', color: '#666' }}>
        <strong>Progress:</strong> {Object.keys(coordinates).length} / {countries.length} countries calibrated
      </div>

      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '1200px',
          cursor: currentCountry ? 'crosshair' : 'not-allowed',
          border: '3px solid #667eea',
          borderRadius: '10px',
          overflow: 'hidden'
        }}
        onClick={handleMapClick}
      >
        <img
          src="/images/continents/europe.jpg"
          alt="Europe map"
          style={{ width: '100%', display: 'block' }}
        />

        {/* Show existing markers */}
        {Object.entries(coordinates).map(([country, coords]) => (
          <div
            key={country}
            style={{
              position: 'absolute',
              left: `${coords.x}%`,
              top: `${coords.y}%`,
              transform: 'translate(-50%, -50%)',
              background: 'red',
              color: 'white',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '10px',
              pointerEvents: 'none',
              zIndex: 10
            }}
          >
            {country}
          </div>
        ))}
      </div>

      {showOutput && (
        <div style={{ marginTop: '2rem' }}>
          <h3>✅ Generated Coordinates:</h3>
          <pre style={{
            background: '#f5f5f5',
            padding: '1rem',
            borderRadius: '8px',
            overflow: 'auto',
            maxHeight: '400px'
          }}>
            {generateCode()}
          </pre>
          <button
            onClick={() => {
              navigator.clipboard.writeText(generateCode());
              alert('Coordinates copied to clipboard!');
            }}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              marginTop: '1rem'
            }}
          >
            📋 Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
};

export default MapCalibrator;
