# 🌍 GeoExplorer - Geography Learning App

A fun, interactive geography learning application built with React for UK Year 7 students (ages 11-12). Learn about countries, capitals, flags, and more through engaging game modes with **real interactive maps**!

## ✨ Features

### 🗺️ **NEW! Interactive Maps** ⭐
**The star feature of GeoExplorer!**
- **Real continent maps** from OnTheWorldMap.com showing all countries with capitals marked
- **Search any country** - Type a name and watch the map highlight it!
- **Pulsing location markers** - Animated pins show exactly where each country is
- **Interactive exploration** - Click countries to learn about them
- **All 6 continents**: Europe, Asia, Africa, North America, South America, Oceania
- **Popup cards** with flag, capital, and fun facts
- **Visual animations**: Bouncing pins, pulsing circles, smooth transitions

### 📚 Learn Mode (Enhanced with Maps!)
- Browse countries by continent with **interactive map display**
- **Search and highlight** - Type a country name to see it on the map
- View detailed information: capital cities, flags, passport colors, shape descriptions with picture, and fun facts
- **Real-time map markers** show country locations as you select them
- Track your mastery level for each country

### 🌍 Continent Explorer (Now Customizable!)
- Master one continent at a time
- **Choose your question types**: Capitals, Flags, Passports, or any combination!
- Beautiful checkbox selection interface
- 8 questions per session
- Defaults to Capitals (perfect for beginners)

### 🎯 Quick Quiz
- Answer 5 random geography questions
- Mix of 6 different question types

### 🏆 Challenge Mode
- 10 questions focused on your weak areas
- Perfect quiz bonus rewards

### ⚡ Speed Round
- 60-second timed challenge
- Track your personal best

### 📊 Stats & Progress
- XP and leveling system (7 levels from Explorer to Geography Master)
- 19 achievement badges to unlock
- Daily streak tracking
- Detailed statistics and mastery progress

## 🌎 Database

**All 195 countries in the world** across 6 continents:
- 🇪🇺 Europe: 44 countries
- 🌏 Asia: 48 countries
- 🌎 North America: 23 countries
- 🗺️ South America: 12 countries
- 🦁 Africa: 54 countries
- 🏝️ Oceania: 14 countries

## 🎮 Question Types

1. Capital Quiz - Match capitals to countries
2. Flag Match - Identify flags by shape
3. Shape Guess - Guess countries from shape figure and description together
4. Passport Color - Identify countries by passport color
5. Reverse Capital - Find the country from its capital
6. Continent Classification - Categorize countries by continent

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open http://localhost:5173 in your browser

### Build for Production

```bash
npm run build
```

## 🎯 Game Mechanics

### XP Rewards
- Correct answer: 10 XP
- Quiz complete: 20 XP
- Perfect quiz: 50 XP
- Badge earned: 30 XP
- Country mastered: 25 XP
- Streak bonuses: 5/10/25 XP

### Mastery Levels
1. Not Started → 2. Learning → 3. Practicing → 4. Confident → 5. Mastered

### Player Levels
1. Explorer (0 XP)
2. Traveller (100 XP)
3. Navigator (300 XP)
4. Cartographer (600 XP)
5. Geographer (1000 XP)
6. World Expert (1500 XP)
7. Geography Master (2500 XP)

## 🏆 Achievements

Unlock 19 badges including:
- 🌍 Globe Trotter - Complete your first quiz
- 🇪🇺 Euro Expert - Master all European countries
- 🏛️ Capital King - 20 capitals in a row
- 🚩 Flag Finder - 20 flags in a row
- ⚡ Speed Demon - Score 15+ in Speed Round
- 🌟 Geography Genius - Master all 195 countries
- 🌗 Half Way There - Master 100 countries

## 🛠️ Technology Stack

- React 19.2.0
- Vite 7.2.4
- Context API for state management
- LocalStorage for progress persistence
- Modern CSS3 with gradients and animations
- **Real map images** from OnTheWorldMap.com
- **CSS Keyframe animations** (pulse, bounce, slide-up)
- **Coordinate-based positioning** system for map markers

## 📁 Project Structure

```
src/
├── components/
│   ├── InteractiveContinentMap.jsx  # 🗺️ NEW! Interactive map with markers
│   ├── MapExplorer.jsx              # 🗺️ NEW! Map explorer page
│   ├── LearnMode.jsx                # 📚 Enhanced with interactive maps
│   ├── ContinentExplorer.jsx        # 🌍 Enhanced with question type selection
│   ├── QuizEngine.jsx               # Quiz logic and rendering
│   ├── MainMenu.jsx                 # Main menu
│   ├── Stats.jsx                    # Statistics display
│   └── *.css                        # Component styles
├── context/
│   └── GameContext.jsx              # Game state management
├── data/
│   ├── countries.js                 # 195 country database
│   ├── gameData.js                  # XP, badges, levels
│   └── countryCodes.js              # Flag and shape URLs
├── public/
│   └── images/
│       └── continents/              # 🗺️ NEW! Real continent map images
│           ├── europe.jpg
│           ├── asia.jpg
│           ├── africa.jpg
│           ├── north-america.jpg
│           ├── south-america.jpg
│           └── oceania.jpg
├── App.jsx                          # Main app routing
└── main.jsx                         # Entry point
```

## 🎨 Interactive Maps Feature Details

### How It Works:
1. **Map Display**: High-quality continent maps showing country boundaries and capitals
2. **Search Functionality**: Real-time filtering as you type country names
3. **Visual Markers**: When you select a country:
   - 🔴 Pulsing red circle appears at country location
   - 📍 Bouncing pin emoji animates above the country
   - 🏷️ Country name label displays below
4. **Popup Cards**: Slide up from bottom-right with:
   - Country flag
   - Capital city
   - Fun fact
   - Close button (X)

### Technical Implementation:
- **Coordinate System**: Each country has `{x, y}` coordinates as percentages (e.g., `{x: 30, y: 42}` = 30% from left, 42% from top)
- **CSS Animations**:
  - `@keyframes pulse`: Expanding red circle (2s loop)
  - `@keyframes bounce`: Pin bouncing motion (1s loop)
  - `@keyframes slideUp`: Popup card entrance (0.5s)
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Attribution**: Proper credit to OnTheWorldMap.com for educational use

### Supported Continents:
All 44 European countries have coordinate mappings. Other continents can be added with similar coordinate data.

## 📝 License

Educational purposes
