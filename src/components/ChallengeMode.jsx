import QuizEngine from './QuizEngine';

const ChallengeMode = () => {
  return (
    <QuizEngine
      mode="challenge"
      questionCount={10}
      title="🏆 Challenge Mode"
    />
  );
};

export default ChallengeMode;
