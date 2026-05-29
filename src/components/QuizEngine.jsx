import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { COUNTRIES, CONTINENTS } from '../data/countries';
import { XP_REWARDS } from '../data/gameData';
import { getFlagUrl, getCountryShapeUrl } from '../data/countryCodes';
import './QuizEngine.css';

const QuizEngine = ({ mode, questionCount, title, onComplete, selectedTypes, selectedContinent }) => {
  const { gameState, addXP, updateCountryProgress, updateStats, checkAndAwardBadges, setCurrentView } = useGame();

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  // Filter countries by continent if specified
  const availableCountries = selectedContinent
    ? COUNTRIES.filter(c => c.continent === selectedContinent)
    : COUNTRIES;

  const allQuestionTypes = [
    { type: 'capital', generate: generateCapitalQuestion },
    { type: 'flag', generate: generateFlagQuestion },
    { type: 'shape', generate: generateShapeQuestion },
    { type: 'passport', generate: generatePassportQuestion },
    { type: 'reverse_capital', generate: generateReverseCapitalQuestion },
    { type: 'continent', generate: generateContinentQuestion }
  ];

  // Filter question types based on selection
  const questionTypes = selectedTypes
    ? allQuestionTypes.filter(qt => selectedTypes[qt.type])
    : allQuestionTypes;

  useEffect(() => {
    generateQuestions();
  }, []);

  function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  function getRandomCountries(count, exclude = null) {
    const available = exclude
      ? availableCountries.filter(c => c.name !== exclude.name)
      : availableCountries;
    return shuffleArray(available).slice(0, count);
  }

  function generateCapitalQuestion(country) {
    const wrongCountries = getRandomCountries(3, country);
    const options = shuffleArray([
      { text: country.capital, correct: true },
      { text: wrongCountries[0].capital, correct: false },
      { text: wrongCountries[1].capital, correct: false },
      { text: wrongCountries[2].capital, correct: false }
    ]);

    return {
      type: 'capital',
      question: `What is the capital of ${country.name}?`,
      questionCountry: country,
      options,
      country: country.name
    };
  }

  function generateFlagQuestion(country) {
    const wrongCountries = getRandomCountries(3, country);
    const options = shuffleArray([
      { text: country.name, country: country, correct: true },
      { text: wrongCountries[0].name, country: wrongCountries[0], correct: false },
      { text: wrongCountries[1].name, country: wrongCountries[1], correct: false },
      { text: wrongCountries[2].name, country: wrongCountries[2], correct: false }
    ]);

    return {
      type: 'flag',
      question: `Which flag belongs to ${country.name}?`,
      options,
      country: country.name
    };
  }

  function generateShapeQuestion(country) {
    const wrongCountries = getRandomCountries(3, country);
    const options = shuffleArray([
      { text: country.name, correct: true },
      { text: wrongCountries[0].name, correct: false },
      { text: wrongCountries[1].name, correct: false },
      { text: wrongCountries[2].name, correct: false }
    ]);

    return {
      type: 'shape',
      question: `Which country has this shape?`,
      shapeDescription: country.shape,
      questionCountry: country,
      options,
      country: country.name
    };
  }

  function generatePassportQuestion(country) {
    const wrongCountries = getRandomCountries(3, country);
    const options = shuffleArray([
      { text: country.name, correct: true },
      { text: wrongCountries[0].name, correct: false },
      { text: wrongCountries[1].name, correct: false },
      { text: wrongCountries[2].name, correct: false }
    ]);

    const getPassportColorHex = (color) => {
      const colors = {
        red: '#8B0000',
        blue: '#003F87',
        green: '#228B22',
        black: '#2C2C2C',
        orange: '#FF8C00'
      };
      return colors[color.toLowerCase()] || '#666';
    };

    return {
      type: 'passport',
      question: 'Which country has this passport color?',
      passportColor: country.passport,
      passportColorHex: getPassportColorHex(country.passport),
      options,
      country: country.name
    };
  }

  function generateReverseCapitalQuestion(country) {
    const wrongCountries = getRandomCountries(3, country);
    const options = shuffleArray([
      { text: country.name, correct: true },
      { text: wrongCountries[0].name, correct: false },
      { text: wrongCountries[1].name, correct: false },
      { text: wrongCountries[2].name, correct: false }
    ]);

    return {
      type: 'reverse_capital',
      question: `${country.capital} is the capital of which country?`,
      options,
      country: country.name
    };
  }

  function generateContinentQuestion(country) {
    // Use the real continent labels from the data ("North America" /
    // "South America"), not a made-up "Americas" that never matches.
    const wrongContinents = shuffleArray(
      CONTINENTS.filter(c => c !== country.continent)
    ).slice(0, 3);
    const options = shuffleArray([
      { text: country.continent, correct: true },
      { text: wrongContinents[0], correct: false },
      { text: wrongContinents[1], correct: false },
      { text: wrongContinents[2], correct: false }
    ]);

    return {
      type: 'continent',
      question: `Which continent is ${country.flag} ${country.name} in?`,
      options,
      country: country.name
    };
  }

  function generateQuestions() {
    // Challenge mode focuses on the player's weak areas: countries with the
    // lowest mastery (least practised / unseen first).
    let pool;
    if (mode === 'challenge') {
      pool = [...availableCountries].sort((a, b) =>
        (gameState.country_progress[a.name] || 0) - (gameState.country_progress[b.name] || 0)
      );
    } else {
      pool = shuffleArray(availableCountries);
    }

    // Never ask for more questions than there are countries available.
    const count = Math.min(questionCount, pool.length);
    const selectedCountries = pool.slice(0, count);

    const newQuestions = [];
    for (let i = 0; i < selectedCountries.length; i++) {
      const country = selectedCountries[i];
      const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
      newQuestions.push(questionType.generate(country));
    }

    setQuestions(newQuestions);
  }

  function handleAnswer(option) {
    if (isAnswered) return;

    setSelectedAnswer(option);
    setIsAnswered(true);

    const correct = option.correct;
    const currentQuestion = questions[currentQuestionIndex];

    if (correct) {
      const newStreak = streak + 1;
      setScore(score + 1);
      setStreak(newStreak);
      setBestStreak(prev => Math.max(prev, newStreak));
      addXP(XP_REWARDS.correct_answer);
      updateCountryProgress(currentQuestion.country, true);

      updateStats({
        total_correct: gameState.total_correct + 1,
        [`current_${currentQuestion.type}_streak`]: (gameState[`current_${currentQuestion.type}_streak`] || 0) + 1,
        [`${currentQuestion.type}_streak`]: Math.max(
          gameState[`${currentQuestion.type}_streak`] || 0,
          (gameState[`current_${currentQuestion.type}_streak`] || 0) + 1
        )
      });

      if (streak + 1 === 3) addXP(XP_REWARDS.streak_bonus_3);
      if (streak + 1 === 5) addXP(XP_REWARDS.streak_bonus_5);
      if (streak + 1 === 10) addXP(XP_REWARDS.streak_bonus_10);
    } else {
      setStreak(0);
      updateCountryProgress(currentQuestion.country, false);
      updateStats({
        total_incorrect: gameState.total_incorrect + 1,
        [`current_${currentQuestion.type}_streak`]: 0
      });
    }
  }

  function handleNext() {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      completeQuiz();
    }
  }

  function completeQuiz() {
    addXP(XP_REWARDS.quiz_complete);
    if (score === questionCount) {
      addXP(XP_REWARDS.perfect_quiz);
      if (mode === 'challenge') {
        updateStats({ perfect_challenges: gameState.perfect_challenges + 1 });
      }
    }
    updateStats({ quizzes_completed: gameState.quizzes_completed + 1 });

    setQuizComplete(true);
    setTimeout(() => {
      checkAndAwardBadges();
    }, 500);
  }

  if (questions.length === 0) {
    return <div className="quiz-loading">Loading quiz...</div>;
  }

  if (quizComplete) {
    const percentage = Math.round((score / questionCount) * 100);
    // Badges are awarded once in completeQuiz(); read the result for display
    // instead of calling checkAndAwardBadges() during render (which triggers
    // a setState-in-render cascade).
    const newBadges = gameState.achievements_new || [];

    return (
      <div className="quiz-complete">
        <h2>🎉 Quiz Complete!</h2>
        <div className="quiz-score">
          <div className="score-circle" style={{
            background: percentage >= 80 ? '#2ecc71' : percentage >= 60 ? '#f39c12' : '#e74c3c'
          }}>
            <span className="score-percentage">{percentage}%</span>
            <span className="score-fraction">{score}/{questionCount}</span>
          </div>
        </div>

        <div className="quiz-stats">
          <p>Questions Correct: {score}</p>
          <p>Best Streak: {bestStreak}</p>
        </div>

        {newBadges.length > 0 && (
          <div className="badges-earned">
            <h3>🏆 New Badges Earned!</h3>
            {/* Badge display would go here */}
          </div>
        )}

        <button onClick={() => setCurrentView('menu')} className="quiz-btn primary">
          Back to Menu
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questionCount) * 100;

  return (
    <div className="quiz-engine">
      <div className="quiz-header">
        <button onClick={() => setCurrentView('menu')} className="back-btn">
          ← Back
        </button>
        <h2>{title}</h2>
        <div className="quiz-info">
          Question {currentQuestionIndex + 1}/{questionCount}
        </div>
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="quiz-status">
        <div className="stat">Score: {score}/{questionCount}</div>
        <div className="stat">Streak: {streak > 0 && '🔥'} {streak}</div>
      </div>

      <div className="question-card">
        <div className="question-text-container">
          {/* Capital Question - Show flag */}
          {currentQuestion.type === 'capital' && currentQuestion.questionCountry && (
            <div className="question-flag-display">
              {getFlagUrl(currentQuestion.questionCountry.name) ? (
                <img
                  src={getFlagUrl(currentQuestion.questionCountry.name, 'w160')}
                  alt={`${currentQuestion.questionCountry.name} flag`}
                  className="question-flag-image"
                />
              ) : (
                <span className="question-flag-emoji">{currentQuestion.questionCountry.flag}</span>
              )}
            </div>
          )}

          {/* Passport Question - Show passport color box */}
          {currentQuestion.type === 'passport' && currentQuestion.passportColorHex && (
            <div className="passport-display">
              <div
                className="passport-box-large"
                style={{ backgroundColor: currentQuestion.passportColorHex }}
              ></div>
            </div>
          )}

          {/* Shape Question - Show country silhouette */}
          {currentQuestion.type === 'shape' && currentQuestion.questionCountry && (
            <div className="shape-display">
              {getCountryShapeUrl(currentQuestion.questionCountry.name) ? (
                <img
                  src={getCountryShapeUrl(currentQuestion.questionCountry.name, '256')}
                  alt={`${currentQuestion.questionCountry.name} shape`}
                  className="country-shape-image"
                />
              ) : null}
              <p className="shape-description">"{currentQuestion.shapeDescription}"</p>
            </div>
          )}

          <h3 className="question-text">{currentQuestion.question}</h3>
        </div>

        <div className="options-grid">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className={`option-btn ${
                isAnswered
                  ? option.correct
                    ? 'correct'
                    : selectedAnswer === option
                      ? 'incorrect'
                      : ''
                  : selectedAnswer === option
                    ? 'selected'
                    : ''
              }`}
              onClick={() => handleAnswer(option)}
              disabled={isAnswered}
            >
              {/* Flag Question - Show only flags in options */}
              {currentQuestion.type === 'flag' && option.country && (
                <div className="flag-option">
                  {getFlagUrl(option.country.name) ? (
                    <img
                      src={getFlagUrl(option.country.name, 'w80')}
                      alt="flag"
                      className="option-flag-image"
                    />
                  ) : (
                    <span className="option-flag-emoji">{option.country.flag}</span>
                  )}
                </div>
              )}
              {currentQuestion.type !== 'flag' && option.text}
            </button>
          ))}
        </div>

        {isAnswered && (
          <div className="answer-feedback">
            {selectedAnswer.correct ? (
              <div className="feedback correct-feedback">
                <span className="feedback-icon">✅</span>
                <span>Correct! Great job!</span>
              </div>
            ) : (
              <div className="feedback incorrect-feedback">
                <span className="feedback-icon">❌</span>
                <span>Incorrect. The answer was {currentQuestion.options.find(o => o.correct).text}</span>
              </div>
            )}
            <button onClick={handleNext} className="quiz-btn primary">
              {currentQuestionIndex + 1 < questionCount ? 'Next Question →' : 'Finish Quiz'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizEngine;
