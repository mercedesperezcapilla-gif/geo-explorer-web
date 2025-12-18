import { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

// World countries TopoJSON
const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

// Continent bounding boxes for projection
const continentConfig = {
  "Europe": {
    center: [15, 54],
    scale: 400
  },
  "Asia": {
    center: [100, 40],
    scale: 250
  },
  "Africa": {
    center: [20, 0],
    scale: 250
  },
  "North America": {
    center: [-100, 50],
    scale: 250
  },
  "South America": {
    center: [-60, -15],
    scale: 300
  },
  "Oceania": {
    center: [135, -25],
    scale: 350
  }
};

const ContinentMap = ({ countryName, continent }) => {
  const [error, setError] = useState(null);

  const config = continentConfig[continent === "Americas" ? "North America" : continent] || continentConfig["Europe"];

  try {
    return (
      <div style={{ width: "100%", height: "400px", background: "#f0f4f8", borderRadius: "15px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {error ? (
          <p style={{ color: "#666", padding: "2rem" }}>Map temporarily unavailable</p>
        ) : (
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              center: config.center,
              scale: config.scale
            }}
            width={800}
            height={400}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const isSelectedCountry = geo.properties.name === countryName;

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={isSelectedCountry ? "#667eea" : "#e0e0e0"}
                      stroke={isSelectedCountry ? "#764ba2" : "#fff"}
                      strokeWidth={isSelectedCountry ? 2 : 0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { outline: "none" },
                        pressed: { outline: "none" }
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
        )}
      </div>
    );
  } catch (err) {
    console.error("Map error:", err);
    return (
      <div style={{ width: "100%", height: "400px", background: "#f0f4f8", borderRadius: "15px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#666", padding: "2rem" }}>Map temporarily unavailable</p>
      </div>
    );
  }
};

export default ContinentMap;
