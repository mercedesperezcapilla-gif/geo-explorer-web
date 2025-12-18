// ISO 3166-1 alpha-2 country codes for flagcdn.com API
export const COUNTRY_CODES = {
  // Europe
  "United Kingdom": "gb",
  "France": "fr",
  "Germany": "de",
  "Spain": "es",
  "Italy": "it",
  "Russia": "ru",
  "Turkey": "tr",
  "Portugal": "pt",
  "Netherlands": "nl",
  "Belgium": "be",
  "Poland": "pl",
  "Greece": "gr",
  "Czech Republic": "cz",
  "Romania": "ro",
  "Hungary": "hu",
  "Denmark": "dk",
  "Finland": "fi",
  "Bulgaria": "bg",
  "Serbia": "rs",
  "Austria": "at",
  "Sweden": "se",
  "Norway": "no",
  "Switzerland": "ch",
  "Ireland": "ie",
  "Croatia": "hr",
  "Slovakia": "sk",
  "Ukraine": "ua",
  "Lithuania": "lt",
  "Latvia": "lv",
  "Estonia": "ee",
  "Slovenia": "si",
  "Bosnia and Herzegovina": "ba",
  "Albania": "al",
  "North Macedonia": "mk",
  "Montenegro": "me",
  "Iceland": "is",
  "Luxembourg": "lu",
  "Malta": "mt",
  "Cyprus": "cy",
  "Belarus": "by",
  "Moldova": "md",
  "Kosovo": "xk",
  "Andorra": "ad",
  "Monaco": "mc",

  // Asia
  "China": "cn",
  "Japan": "jp",
  "India": "in",
  "Saudi Arabia": "sa",
  "Iran": "ir",
  "Israel": "il",
  "South Korea": "kr",
  "Thailand": "th",
  "Vietnam": "vn",
  "Singapore": "sg",
  "United Arab Emirates": "ae",
  "Pakistan": "pk",
  "Bangladesh": "bd",
  "Iraq": "iq",
  "Afghanistan": "af",
  "Myanmar": "mm",
  "Nepal": "np",
  "Sri Lanka": "lk",
  "Indonesia": "id",
  "Philippines": "ph",
  "Malaysia": "my",
  "Kazakhstan": "kz",
  "Uzbekistan": "uz",
  "Mongolia": "mn",
  "North Korea": "kp",
  "Jordan": "jo",
  "Lebanon": "lb",
  "Syria": "sy",
  "Yemen": "ye",
  "Oman": "om",
  "Kuwait": "kw",
  "Qatar": "qa",
  "Bahrain": "bh",
  "Cambodia": "kh",
  "Laos": "la",
  "Brunei": "bn",
  "Maldives": "mv",
  "Bhutan": "bt",
  "Timor-Leste": "tl",
  "Armenia": "am",
  "Georgia": "ge",
  "Azerbaijan": "az",
  "Kyrgyzstan": "kg",
  "Tajikistan": "tj",
  "Turkmenistan": "tm",

  // Africa
  "Egypt": "eg",
  "South Africa": "za",
  "Nigeria": "ng",
  "Ethiopia": "et",
  "Libya": "ly",
  "Kenya": "ke",
  "Morocco": "ma",
  "Ghana": "gh",
  "Tanzania": "tz",
  "Algeria": "dz",
  "Uganda": "ug",
  "Sudan": "sd",
  "Angola": "ao",
  "Mozambique": "mz",
  "Madagascar": "mg",
  "Cameroon": "cm",
  "Ivory Coast": "ci",
  "Niger": "ne",
  "Burkina Faso": "bf",
  "Mali": "ml",
  "Senegal": "sn",
  "Zimbabwe": "zw",
  "Zambia": "zm",
  "Malawi": "mw",
  "Botswana": "bw",
  "Namibia": "na",
  "Mauritius": "mu",
  "Somalia": "so",
  "Rwanda": "rw",
  "Tunisia": "tn",
  "Guinea": "gn",
  "Benin": "bj",
  "Burundi": "bi",
  "South Sudan": "ss",
  "Togo": "tg",
  "Sierra Leone": "sl",
  "Liberia": "lr",
  "Mauritania": "mr",
  "Eritrea": "er",
  "Gambia": "gm",
  "Gabon": "ga",
  "Lesotho": "ls",
  "Guinea-Bissau": "gw",
  "Equatorial Guinea": "gq",
  "Djibouti": "dj",
  "Eswatini": "sz",
  "Comoros": "km",
  "Cape Verde": "cv",
  "Seychelles": "sc",
  "São Tomé and Príncipe": "st",
  "Chad": "td",
  "Central African Republic": "cf",
  "Democratic Republic of the Congo": "cd",
  "Republic of the Congo": "cg",

  // North America
  "United States": "us",
  "Canada": "ca",
  "Mexico": "mx",
  "Cuba": "cu",
  "Jamaica": "jm",
  "Haiti": "ht",
  "Dominican Republic": "do",
  "Guatemala": "gt",
  "Honduras": "hn",
  "Nicaragua": "ni",
  "Costa Rica": "cr",
  "Panama": "pa",
  "El Salvador": "sv",
  "Belize": "bz",
  "Trinidad and Tobago": "tt",
  "Bahamas": "bs",
  "Barbados": "bb",
  "Saint Lucia": "lc",
  "Grenada": "gd",
  "Saint Vincent and the Grenadines": "vc",
  "Antigua and Barbuda": "ag",
  "Dominica": "dm",
  "Saint Kitts and Nevis": "kn",

  // South America
  "Brazil": "br",
  "Argentina": "ar",
  "Chile": "cl",
  "Peru": "pe",
  "Colombia": "co",
  "Venezuela": "ve",
  "Ecuador": "ec",
  "Bolivia": "bo",
  "Paraguay": "py",
  "Uruguay": "uy",
  "Guyana": "gy",
  "Suriname": "sr",

  // Oceania
  "Australia": "au",
  "New Zealand": "nz",
  "Fiji": "fj",
  "Papua New Guinea": "pg",
  "Solomon Islands": "sb",
  "Samoa": "ws",
  "Vanuatu": "vu",
  "Tonga": "to",
  "Kiribati": "ki",
  "Micronesia": "fm",
  "Marshall Islands": "mh",
  "Palau": "pw",
  "Nauru": "nr",
  "Tuvalu": "tv"
};

// Helper function to get flag URL from flagcdn.com
export const getFlagUrl = (countryName, size = 'w320') => {
  const code = COUNTRY_CODES[countryName];
  if (!code) return null;

  // Available sizes: w20, w40, w80, w160, w320, w640, w1280
  return `https://flagcdn.com/${size}/${code}.png`;
};

// Get SVG flag (higher quality, scalable)
export const getFlagSvg = (countryName) => {
  const code = COUNTRY_CODES[countryName];
  if (!code) return null;
  return `https://flagcdn.com/${code}.svg`;
};

// Get country shape/silhouette from mapsicon (via raw GitHub)
export const getCountryShapeUrl = (countryName, size = '256') => {
  const code = COUNTRY_CODES[countryName];
  if (!code) return null;

  // Available sizes: 16, 24, 32, 48, 64, 80, 96, 128, 256, 512, 1024
  return `https://raw.githubusercontent.com/djaiss/mapsicon/master/all/${code}/${size}.png`;
};

// Get US state shape/silhouette from mapsicon (via raw GitHub)
export const getStateShapeUrl = (stateAbbreviation, size = '256') => {
  if (!stateAbbreviation) return null;

  const code = stateAbbreviation.toLowerCase();
  // Available sizes: 16, 24, 32, 48, 64, 80, 96, 128, 256, 512, 1024
  return `https://raw.githubusercontent.com/djaiss/mapsicon/master/us/${code}/${size}.png`;
};
