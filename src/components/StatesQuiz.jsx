import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { US_STATES } from '../data/usStates';
import { getStateShapeUrl } from '../data/countryCodes';
import './StatesQuiz.css';

const StatesQuiz = () => {
  const { setCurrentView } = useGame();

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  const questionCount = 10;

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

  function getRandomStates(count, exclude = null) {
    const available = exclude
      ? US_STATES.filter(s => s.name !== exclude.name)
      : US_STATES;
    return shuffleArray(available).slice(0, count);
  }

  function generateCapitalQuestion(state) {
    const wrongStates = getRandomStates(3, state);
    const options = shuffleArray([
      { text: state.capital, correct: true },
      { text: wrongStates[0].capital, correct: false },
      { text: wrongStates[1].capital, correct: false },
      { text: wrongStates[2].capital, correct: false }
    ]);

    return {
      type: 'capital',
      question: `What is the capital of ${state.name}?`,
      questionState: state,
      options,
      state: state.name
    };
  }

  function generateShapeQuestion(state) {
    const wrongStates = getRandomStates(3, state);
    const options = shuffleArray([
      { text: state.name, correct: true },
      { text: wrongStates[0].name, correct: false },
      { text: wrongStates[1].name, correct: false },
      { text: wrongStates[2].name, correct: false }
    ]);

    return {
      type: 'shape',
      question: `Which state has this shape?`,
      questionState: state,
      options,
      state: state.name
    };
  }

  function generateNicknameQuestion(state) {
    const wrongStates = getRandomStates(3, state);
    const options = shuffleArray([
      { text: state.name, correct: true },
      { text: wrongStates[0].name, correct: false },
      { text: wrongStates[1].name, correct: false },
      { text: wrongStates[2].name, correct: false }
    ]);

    return {
      type: 'nickname',
      question: `Which state is known as the "${state.nickname}"?`,
      options,
      state: state.name
    };
  }

  function generateRegionQuestion(state) {
    const allRegions = ['Northeast', 'Southeast', 'Midwest', 'Southwest', 'West'];
    const wrongRegions = allRegions.filter(r => r !== state.region).slice(0, 3);
    const options = shuffleArray([
      { text: state.region, correct: true },
      { text: wrongRegions[0], correct: false },
      { text: wrongRegions[1], correct: false },
      { text: wrongRegions[2], correct: false }
    ]);

    return {
      type: 'region',
      question: `Which region is ${state.name} in?`,
      options,
      state: state.name
    };
  }

  function generateQuestions() {
    const questionTypes = [
      generateCapitalQuestion,
      generateShapeQuestion,
      generateNicknameQuestion,
      generateRegionQuestion
    ];

    const newQuestions = [];
    const selectedStates = shuffleArray(US_STATES).slice(0, questionCount);

    for (let i = 0; i < questionCount; i++) {
      const state = selectedStates[i];
      const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
      newQuestions.push(questionType(state));
    }

    setQuestions(newQuestions);
  }

  function handleAnswer(option) {
    if (isAnswered) return;

    setSelectedAnswer(option);
    setIsAnswered(true);

    if (option.correct) {
      setScore(score + 1);
    }
  }

  function handleNext() {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setQuizComplete(true);
    }
  }

  if (questions.length === 0) {
    return <div className="quiz-loading">Loading quiz...</div>;
  }

  if (quizComplete) {
    const percentage = Math.round((score / questionCount) * 100);

    return (
      <div className="states-quiz-complete">
        <h2>🎉 States Quiz Complete!</h2>
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
          <p>Questions Wrong: {questionCount - score}</p>
        </div>

        <button onClick={() => setCurrentView('menu')} className="quiz-btn primary">
          Back to Menu
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questionCount) * 100;

  return (
    <div className="states-quiz">
      <div className="quiz-header">
        <button onClick={() => setCurrentView('menu')} className="back-btn">
          ← Back
        </button>
        <h2>🗽 US States Quiz</h2>
        <div className="quiz-info">
          Question {currentQuestionIndex + 1}/{questionCount}
        </div>
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="quiz-status">
        <div className="stat">Score: {score}/{questionCount}</div>
      </div>

      <div className="question-card">
        <div className="question-text-container">
          {/* Shape Question - Show state silhouette */}
          {currentQuestion.type === 'shape' && currentQuestion.questionState && (
            <div className="shape-display">
              {getStateShapeUrl(currentQuestion.questionState.abbreviation) && (
                <img
                  src={getStateShapeUrl(currentQuestion.questionState.abbreviation, '256')}
                  alt={`${currentQuestion.questionState.name} shape`}
                  className="state-shape-image"
                />
              )}
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
              {option.text}
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

export default StatesQuiz;
