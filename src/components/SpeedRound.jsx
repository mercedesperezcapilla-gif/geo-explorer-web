import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { COUNTRIES } from '../data/countries';
import { XP_REWARDS } from '../data/gameData';
import './SpeedRound.css';

const SpeedRound = () => {
  const { gameState, addXP, updateStats, setCurrentView } = useGame();
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [gameActive, setGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameActive) {
      endGame();
    }
  }, [timeLeft, gameActive]);

  useEffect(() => {
    if (gameActive && !gameOver) {
      generateQuestion();
    }
  }, [gameActive]);

  function startGame() {
    setGameActive(true);
    setTimeLeft(60);
    setScore(0);
    setGameOver(false);
    generateQuestion();
  }

  function generateQuestion() {
    const country = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
    const wrongCountries = COUNTRIES.filter(c => c.name !== country.name)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const allOptions = [
      { text: country.capital, correct: true },
      { text: wrongCountries[0].capital, correct: false },
      { text: wrongCountries[1].capital, correct: false },
      { text: wrongCountries[2].capital, correct: false }
    ].sort(() => Math.random() - 0.5);

    setCurrentQuestion(country);
    setOptions(allOptions);
  }

  function handleAnswer(option) {
    if (option.correct) {
      setScore(score + 1);
      addXP(XP_REWARDS.correct_answer);
    }
    generateQuestion();
  }

  function endGame() {
    setGameActive(false);
    setGameOver(true);

    if (score > gameState.speed_best) {
      updateStats({ speed_best: score });
    }

    updateStats({
      total_correct: gameState.total_correct + score,
      quizzes_completed: gameState.quizzes_completed + 1
    });

    addXP(XP_REWARDS.quiz_complete);
  }

  if (!gameActive && !gameOver) {
    return (
      <div className="speed-round-start">
        <div className="speed-header">
          <button onClick={() => setCurrentView('menu')} className="back-btn">
            ← Back
          </button>
        </div>
        <div className="speed-start-content">
          <h1>⚡ Speed Round</h1>
          <div className="speed-description">
            <p>Answer as many capital city questions as you can in 60 seconds!</p>
            <p className="speed-best">Your Best: {gameState.speed_best} points</p>
          </div>
          <button onClick={startGame} className="start-btn">
            Start Speed Round
          </button>
        </div>
      </div>
    );
  }

  if (gameOver) {
    const isNewBest = score > gameState.speed_best - 1;
    return (
      <div className="speed-round-end">
        <h1>⚡ Speed Round Complete!</h1>
        <div className="final-score">
          <div className="score-display">
            <div className="score-number">{score}</div>
            <div className="score-label">Points</div>
          </div>
          {isNewBest && score > 0 && (
            <div className="new-best">🎉 New Personal Best!</div>
          )}
        </div>
        <div className="speed-stats">
          <p>Previous Best: {gameState.speed_best - score > 0 ? gameState.speed_best - score : gameState.speed_best}</p>
          <p>Answers Per Second: {(score / 60).toFixed(2)}</p>
        </div>
        <div className="speed-actions">
          <button onClick={startGame} className="retry-btn">
            Try Again
          </button>
          <button onClick={() => setCurrentView('menu')} className="menu-btn">
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="speed-round-active">
      <div className="speed-game-header">
        <div className="timer-display" style={{
          color: timeLeft <= 10 ? '#e74c3c' : timeLeft <= 20 ? '#f39c12' : '#2ecc71'
        }}>
          ⏱️ {timeLeft}s
        </div>
        <div className="score-display-small">
          Score: {score}
        </div>
      </div>

      <div className="speed-question-card">
        {currentQuestion && (
          <>
            <h2 className="speed-question">
              What is the capital of {currentQuestion.flag} {currentQuestion.name}?
            </h2>
            <div className="speed-options">
              {options.map((option, index) => (
                <button
                  key={index}
                  className="speed-option"
                  onClick={() => handleAnswer(option)}
                >
                  {option.text}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SpeedRound;
