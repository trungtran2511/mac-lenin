const answerLetters = ["A", "B", "C", "D"];

function ProfileQuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedOption,
  onSelect,
}) {
  return (
    <article className="profile-question-card">
      <div className="profile-question-kicker">
        <span>Câu {questionNumber}</span>
        <span>{totalQuestions} tình huống</span>
      </div>

      <h2>{question.question}</h2>

      <div className="profile-answer-grid">
        {question.options.map((option, index) => {
          const isSelected = selectedOption === index;

          return (
            <button
              key={option.text}
              type="button"
              className={`profile-answer ${isSelected ? "selected" : ""}`}
              onClick={() => onSelect(index)}
            >
              <span className="profile-answer-letter">
                {answerLetters[index]}
              </span>
              <span>{option.text}</span>
              {isSelected && <i className="bi bi-check-lg"></i>}
            </button>
          );
        })}
      </div>
    </article>
  );
}

export default ProfileQuestionCard;
