import { useEffect, useState, useRef } from 'react';
import { COUNTRY_CODES } from '../data/countryCodes';
import { COUNTRIES } from '../data/countries';

const InteractiveWorldMap = ({ selectedCountry, selectedContinent, onCountryClick }) => {
  const [svgContent, setSvgContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const hasDraggedRef = useRef(false);

  const countryCode = selectedCountry ? COUNTRY_CODES[selectedCountry]?.toLowerCase() : null;
  const dragStartPosRef = useRef({ x: 0, y: 0 });

  // Handle mouse wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.min(Math.max(prev * delta, 0.5), 5));
  };

  // Handle pan with mouse drag
  const handleMouseDown = (e) => {
    // Store the initial mouse position
    dragStartPosRef.current = { x: e.clientX, y: e.clientY };
    setIsDragging(true);
    hasDraggedRef.current = false;
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      // Only mark as dragged if moved more than 5 pixels
      const deltaX = Math.abs(e.clientX - dragStartPosRef.current.x);
      const deltaY = Math.abs(e.clientY - dragStartPosRef.current.y);
      if (deltaX > 5 || deltaY > 5) {
        hasDraggedRef.current = true;
      }
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    // Reset hasDragged immediately (clicks will check it before this runs)
    setTimeout(() => {
      hasDraggedRef.current = false;
    }, 100);
  };

  // Reset zoom and pan
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/flekschas/simple-world-map/master/world-map.min.svg')
      .then(response => response.text())
      .then(svg => {
        setSvgContent(svg);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading map:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (svgContent && containerRef.current) {
      setTimeout(() => {
        const container = containerRef.current;
        const allPaths = container.querySelectorAll('path');

        // Get countries from selected continent or all
        const continentCountries = selectedContinent === 'All'
          ? COUNTRIES
          : COUNTRIES.filter(c => c.continent === selectedContinent);

        const continentCodes = new Set(
          continentCountries.map(c => COUNTRY_CODES[c.name]?.toLowerCase()).filter(Boolean)
        );

        // Style all countries
        allPaths.forEach(path => {
          const pathId = path.id;
          const countryData = COUNTRIES.find(c => COUNTRY_CODES[c.name]?.toLowerCase() === pathId);

          // Check if country is in selected continent
          const isInContinent = continentCodes.has(pathId);

          // Default styling - dim countries not in selected continent
          if (isInContinent) {
            path.style.fill = '#e0e0e0';
            path.style.opacity = '1';
          } else {
            path.style.fill = '#f5f5f5';
            path.style.opacity = '0.3';
          }

          path.style.stroke = '#fff';
          path.style.strokeWidth = '0.5';
          path.style.cursor = isInContinent ? 'pointer' : 'default';
          path.style.transition = 'all 0.2s ease';

          // Remove old event listeners by cloning
          const newPath = path.cloneNode(true);
          path.parentNode.replaceChild(newPath, path);

          // Add click handler only for continent countries
          if (countryData && isInContinent) {
            newPath.addEventListener('click', (e) => {
              // Don't trigger country click if user was dragging
              if (hasDraggedRef.current) {
                e.preventDefault();
                e.stopPropagation();
                return;
              }
              if (onCountryClick) {
                onCountryClick(countryData.name);
              }
            });

            // Hover effect
            newPath.addEventListener('mouseenter', () => {
              if (pathId !== countryCode) {
                newPath.style.fill = '#c0c0c0';
              }
              setHoveredCountry(countryData.name);
            });

            newPath.addEventListener('mouseleave', () => {
              if (pathId !== countryCode) {
                newPath.style.fill = '#e0e0e0';
              }
              setHoveredCountry(null);
            });
          }
        });

        // Highlight selected country
        if (countryCode) {
          const selectedPath = container.querySelector(`path#${countryCode}`);
          if (selectedPath) {
            selectedPath.style.fill = '#667eea';
            selectedPath.style.stroke = '#764ba2';
            selectedPath.style.strokeWidth = '2';
            selectedPath.style.opacity = '1';
          }
        }

        // Add country name labels
        const svg = container.querySelector('svg');
        if (svg) {
          // Remove old labels
          const oldLabels = svg.querySelectorAll('.country-label');
          oldLabels.forEach(label => label.remove());

          // Add labels for countries in selected continent
          continentCountries.forEach(country => {
            const code = COUNTRY_CODES[country.name]?.toLowerCase();
            const path = container.querySelector(`path#${code}`);

            if (path) {
              try {
                // Get bounding box to find center
                const bbox = path.getBBox();
                const centerX = bbox.x + bbox.width / 2;
                const centerY = bbox.y + bbox.height / 2;

                // Create text element
                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('x', centerX);
                text.setAttribute('y', centerY);
                text.setAttribute('class', 'country-label');
                text.setAttribute('text-anchor', 'middle');
                text.setAttribute('dominant-baseline', 'middle');
                text.setAttribute('pointer-events', 'none');
                text.style.fill = '#333';
                text.style.fontSize = '3px';
                text.style.fontWeight = '600';
                text.style.fontFamily = 'Arial, sans-serif';
                text.style.textShadow = '0 0 2px white';
                text.textContent = country.name;

                svg.appendChild(text);
              } catch (e) {
                // Skip if bbox fails
              }
            }
          });
        }
      }, 100);
    }
  }, [svgContent, countryCode, selectedContinent, onCountryClick]);

  if (loading) {
    return (
      <div style={{
        width: '100%',
        height: '500px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f0f4f8',
        borderRadius: '15px'
      }}>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>Loading world map...</p>
      </div>
    );
  }

  if (!svgContent) {
    return (
      <div style={{
        width: '100%',
        height: '500px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f0f4f8',
        borderRadius: '15px'
      }}>
        <p style={{ color: '#666' }}>Map unavailable</p>
      </div>
    );
  }

  return (
    <div style={{
      width: '100%',
      height: '500px',
      background: '#f0f4f8',
      borderRadius: '15px',
      overflow: 'hidden',
      position: 'relative',
      border: '2px solid #e0e0e0'
    }}>
      <style>
        {`
          .interactive-map-container svg {
            width: 100%;
            height: 100%;
          }
          .interactive-map-container path:hover title {
            display: block;
          }
          .zoom-controls {
            position: absolute;
            top: 1rem;
            right: 1rem;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            z-index: 10;
          }
          .zoom-btn {
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 0.95);
            border: 2px solid #667eea;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1.2rem;
            font-weight: bold;
            color: #667eea;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          .zoom-btn:hover {
            background: #667eea;
            color: white;
            transform: scale(1.05);
          }
          .zoom-btn:active {
            transform: scale(0.95);
          }
          .map-viewport {
            width: 100%;
            height: 100%;
            overflow: hidden;
            cursor: grab;
          }
          .map-viewport.dragging {
            cursor: grabbing;
          }
        `}
      </style>

      <div className="zoom-controls">
        <button
          className="zoom-btn"
          onClick={(e) => {
            e.stopPropagation();
            setZoom(prev => Math.min(prev * 1.2, 5));
          }}
          title="Zoom in"
        >
          +
        </button>
        <button
          className="zoom-btn"
          onClick={(e) => {
            e.stopPropagation();
            setZoom(prev => Math.max(prev * 0.8, 0.5));
          }}
          title="Zoom out"
        >
          −
        </button>
        <button
          className="zoom-btn"
          onClick={(e) => {
            e.stopPropagation();
            handleReset();
          }}
          title="Reset view"
        >
          ⟲
        </button>
      </div>

      <div
        className={`map-viewport ${isDragging ? 'dragging' : ''}`}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          ref={containerRef}
          className="interactive-map-container"
          dangerouslySetInnerHTML={{ __html: svgContent }}
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
            width: '100%',
            height: '100%',
            willChange: 'transform'
          }}
        />
      </div>
      {hoveredCountry && !selectedCountry && (
        <div style={{
          position: 'absolute',
          top: '1rem',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: '500',
          pointerEvents: 'none'
        }}>
          {hoveredCountry}
        </div>
      )}
      {selectedCountry && (
        <div style={{
          position: 'absolute',
          bottom: '1rem',
          left: '1rem',
          background: 'rgba(102, 126, 234, 0.95)',
          color: 'white',
          padding: '0.75rem 1.5rem',
          borderRadius: '10px',
          fontSize: '1.1rem',
          fontWeight: '600',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
        }}>
          📍 {selectedCountry}
        </div>
      )}
    </div>
  );
};

export default InteractiveWorldMap;
