import { useState } from 'react';
import { useGame } from '../context/GameContext';
import QuizEngine from './QuizEngine';
import QuizSelector from './QuizSelector';

const QuickQuiz = () => {
  const { setCurrentView } = useGame();
  const [selectedTypes, setSelectedTypes] = useState(null);

  const handleStart = (types) => {
    setSelectedTypes(types);
  };

  const handleCancel = () => {
    setCurrentView('menu');
  };

  if (!selectedTypes) {
    return (
      <QuizSelector
        title="🎯 Quick Quiz"
        questionCount={5}
        onStart={handleStart}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <QuizEngine
      mode="quick"
      questionCount={5}
      title="🎯 Quick Quiz"
      selectedTypes={selectedTypes}
    />
  );
};

export default QuickQuiz;
