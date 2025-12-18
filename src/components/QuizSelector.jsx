import { useState } from 'react';
import './QuizSelector.css';

const QuizSelector = ({ onStart, onCancel, title, questionCount }) => {
  const [selectedTypes, setSelectedTypes] = useState({
    capital: true,
    flag: true,
    shape: true,
    passport: true,
    reverse_capital: true,
    continent: true
  });

  const questionTypes = [
    { id: 'capital', label: 'Capitals', icon: '🏛️', description: 'Match capitals to countries' },
    { id: 'flag', label: 'Flags', icon: '🚩', description: 'Identify country flags' },
    { id: 'shape', label: 'Country Shapes', icon: '🗺️', description: 'Guess from shape descriptions' },
    { id: 'passport', label: 'Passport Colors', icon: '📕', description: 'Identify by passport color' },
    { id: 'reverse_capital', label: 'Reverse Capitals', icon: '🔄', description: 'Find country from capital' },
    { id: 'continent', label: 'Continents', icon: '🌍', description: 'Match countries to continents' }
  ];

  const handleToggle = (typeId) => {
    setSelectedTypes(prev => ({
      ...prev,
      [typeId]: !prev[typeId]
    }));
  };

  const handleSelectAll = () => {
    const allSelected = Object.values(selectedTypes).every(v => v);
    const newState = {};
    Object.keys(selectedTypes).forEach(key => {
      newState[key] = !allSelected;
    });
    setSelectedTypes(newState);
  };

  const selectedCount = Object.values(selectedTypes).filter(v => v).length;
  const canStart = selectedCount > 0;

  const getSelectedTypeNames = () => {
    return questionTypes
      .filter(type => selectedTypes[type.id])
      .map(type => type.label)
      .join(', ');
  };

  return (
    <div className="quiz-selector">
      <div className="selector-header">
        <h2>{title}</h2>
        <p className="selector-subtitle">Choose which question types to include</p>
      </div>

      <div className="question-types-grid">
        {questionTypes.map(type => (
          <div
            key={type.id}
            className={`type-card ${selectedTypes[type.id] ? 'selected' : ''}`}
            onClick={() => handleToggle(type.id)}
          >
            <div className="type-icon">{type.icon}</div>
            <div className="type-content">
              <h3>{type.label}</h3>
              <p>{type.description}</p>
            </div>
            <div className="type-checkbox">
              {selectedTypes[type.id] ? '✓' : ''}
            </div>
          </div>
        ))}
      </div>

      <div className="selector-actions">
        <button onClick={handleSelectAll} className="btn-secondary">
          {Object.values(selectedTypes).every(v => v) ? 'Deselect All' : 'Select All'}
        </button>

        <div className="selected-info">
          {canStart ? (
            <p>
              {questionCount} questions from: <strong>{getSelectedTypeNames()}</strong>
            </p>
          ) : (
            <p className="error">Please select at least one question type</p>
          )}
        </div>

        <div className="action-buttons">
          <button onClick={onCancel} className="btn-cancel">
            Cancel
          </button>
          <button
            onClick={() => onStart(selectedTypes)}
            className="btn-start"
            disabled={!canStart}
          >
            Start Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizSelector;
