import { GameProvider, useGame } from './context/GameContext'
import MainMenu from './components/MainMenu'
import LearnMode from './components/LearnMode'
import QuickQuiz from './components/QuickQuiz'
import ChallengeMode from './components/ChallengeMode'
import ContinentExplorer from './components/ContinentExplorer'
import SpeedRound from './components/SpeedRound'
import LearnStates from './components/LearnStates'
import StatesQuiz from './components/StatesQuiz'
import Stats from './components/Stats'
import MapExplorer from './components/MapExplorer'
import MapCalibrator from './components/MapCalibrator'
import './App.css'

function AppContent() {
  const { currentView } = useGame()

  return (
    <div className="app">
      {currentView === 'menu' && <MainMenu />}
      {currentView === 'learn' && <LearnMode />}
      {currentView === 'map-explorer' && <MapExplorer />}
      {currentView === 'calibrator' && <MapCalibrator />}
      {currentView === 'quick-quiz' && <QuickQuiz />}
      {currentView === 'challenge' && <ChallengeMode />}
      {currentView === 'continent' && <ContinentExplorer />}
      {currentView === 'speed' && <SpeedRound />}
      {currentView === 'learn-states' && <LearnStates />}
      {currentView === 'states-quiz' && <StatesQuiz />}
      {currentView === 'stats' && <Stats />}
    </div>
  )
}

function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  )
}

export default App
