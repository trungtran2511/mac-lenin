import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { formatTextbookSource } from "../utils/quizText";

const styles = `
  .results-wrapper {
    min-height: 100vh;
    display: block;
    padding: 2rem;
    background:
      radial-gradient(circle at 12% 10%, rgba(242, 180, 65, 0.22), transparent 28%),
      linear-gradient(135deg, #f7f8f3 0%, #e9f3ef 100%);
  }

  .result-card {
    max-width: 920px;
    margin: 0 auto;
    padding: 3rem 5rem;
    border: 1px solid rgba(23, 32, 38, 0.12);
    border-radius: 24px;
    background: white;
    box-shadow: 0 20px 60px rgba(23, 32, 38, 0.16);
    text-align: center;
    animation: slideUp 0.5s ease-out;
  }

  @keyframes slideUp {
    from { transform: translateY(30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  .result-title {
    color: #172026;
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 2rem;
  }

  .score-display {
    color: #007d84;
    font-size: 5rem;
    font-weight: 800;
    margin: 1rem 0;
  }

  .percentage-badge {
    display: inline-block;
    margin: 1rem 0;
    padding: 0.5rem 2rem;
    border-radius: 14px;
    background: #007d84;
    color: white;
    font-size: 2rem;
    font-weight: 700;
  }

  .result-message {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 2rem 0;
  }

  .result-message.pass { color: #007d84; }
  .result-message.fail { color: #d85c4a; }

  .action-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 2rem;
    flex-wrap: wrap;
  }

  .result-btn {
    padding: 1rem 2.5rem;
    border: none;
    border-radius: 14px;
    cursor: pointer;
    font-size: 1.1rem;
    font-weight: 700;
    text-transform: uppercase;
    transition: all 0.3s ease;
  }

  .result-btn.primary {
    background: #007d84;
    color: white;
  }

  .result-btn.secondary {
    background: #172026;
    color: white;
  }

  .result-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(23, 32, 38, 0.18);
  }

  .review-section {
    max-width: 1100px;
    margin: 2rem auto 0;
  }

  .review-heading {
    color: #172026;
    font-weight: 800;
    margin-bottom: 1rem;
  }

  .review-list {
    display: grid;
    gap: 1rem;
  }

  .review-item {
    border: 1px solid rgba(23, 32, 38, 0.12);
    border-left: 8px solid #d85c4a;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.9);
    padding: 1.25rem;
    box-shadow: 0 12px 28px rgba(23, 32, 38, 0.08);
  }

  .review-item.correct {
    border-left-color: #007d84;
  }

  .review-question {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    color: #172026;
    font-weight: 800;
    margin-bottom: 1rem;
  }

  .review-badge {
    flex: 0 0 auto;
    border-radius: 999px;
    padding: 0.35rem 0.75rem;
    background: rgba(216, 92, 74, 0.12);
    color: #b44737;
    font-size: 0.85rem;
  }

  .review-item.correct .review-badge {
    background: rgba(0, 125, 132, 0.12);
    color: #007d84;
  }

  .review-options {
    display: grid;
    gap: 0.55rem;
    margin-bottom: 1rem;
  }

  .review-option {
    display: flex;
    align-items: flex-start;
    gap: 0.65rem;
    border: 1px solid rgba(23, 32, 38, 0.1);
    border-radius: 12px;
    padding: 0.75rem;
    color: rgba(23, 32, 38, 0.78);
  }

  .review-option.correct-answer {
    border-color: rgba(0, 125, 132, 0.42);
    background: rgba(0, 125, 132, 0.1);
    color: #172026;
    font-weight: 700;
  }

  .review-option.wrong-answer {
    border-color: rgba(216, 92, 74, 0.42);
    background: rgba(216, 92, 74, 0.1);
    color: #172026;
    font-weight: 700;
  }

  .option-key {
    display: inline-flex;
    width: 28px;
    height: 28px;
    align-items: center;
    justify-content: center;
    flex: 0 0 28px;
    border-radius: 9px;
    background: rgba(23, 32, 38, 0.08);
    font-weight: 800;
  }

  .review-explanation {
    margin: 0 0 0.65rem;
    border-radius: 12px;
    background: #f7f8f3;
    padding: 0.85rem 1rem;
    color: rgba(23, 32, 38, 0.76);
    line-height: 1.6;
  }

  .review-source {
    display: flex;
    gap: 0.55rem;
    align-items: flex-start;
    margin: 0;
    border: 1px dashed rgba(0, 125, 132, 0.35);
    border-radius: 12px;
    background: rgba(0, 125, 132, 0.07);
    padding: 0.75rem 0.9rem;
    color: #17545a;
    font-size: 0.95rem;
    line-height: 1.5;
  }

  .review-source i {
    margin-top: 0.15rem;
    color: #007d84;
  }

  .review-pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.65rem;
    margin-top: 1.4rem;
    flex-wrap: wrap;
  }

  .page-btn {
    min-width: 42px;
    height: 42px;
    border: 1px solid rgba(23, 32, 38, 0.14);
    border-radius: 12px;
    background: white;
    color: #172026;
    font-weight: 800;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .page-btn:hover:not(:disabled),
  .page-btn.active {
    border-color: #007d84;
    background: #007d84;
    color: white;
    transform: translateY(-2px);
  }

  .page-btn:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }

  .page-summary {
    width: 100%;
    color: rgba(23, 32, 38, 0.62);
    font-size: 0.95rem;
    text-align: center;
  }

  @media (max-width: 768px) {
    .results-wrapper { padding: 1rem; }
    .result-card { padding: 2rem 1.25rem; }
    .result-title { font-size: 2rem; }
    .score-display { font-size: 3.5rem; }
    .percentage-badge { font-size: 1.5rem; }
    .action-buttons { flex-direction: column; }
    .result-btn { width: 100%; }
    .review-question { flex-direction: column; }
  }
`;

const QuizResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [reviewPage, setReviewPage] = useState(1);
  const { score, total, percentage } = location.state || {
    score: 0,
    total: 0,
    percentage: 0,
  };
  const review = location.state?.review || [];
  const reviewPageSize = 5;
  const totalReviewPages = Math.max(1, Math.ceil(review.length / reviewPageSize));
  const reviewStartIndex = (reviewPage - 1) * reviewPageSize;
  const paginatedReview = review.slice(
    reviewStartIndex,
    reviewStartIndex + reviewPageSize,
  );

  const normalizedPercentage = Number.isFinite(percentage) ? percentage : 0;
  const scoreOnTen = total ? ((score / total) * 10).toFixed(1) : "0.0";
  const isPassed = normalizedPercentage >= 70;

  return (
    <>
      <style>{styles}</style>
      <div className="results-wrapper">
        <div className="result-card">
          <h1 className="result-title">
            <i className="bi bi-trophy-fill me-2"></i>
            Quiz Hoàn Thành!
          </h1>

          <div className="score-display">{scoreOnTen} điểm</div>
          <div className="percentage-badge">
            {normalizedPercentage.toFixed(1)}%
          </div>

          <p className={`result-message ${isPassed ? "pass" : "fail"}`}>
            {isPassed
              ? "Xuất sắc! Bạn đã vượt qua."
              : "Cố gắng lên! Xem lại các câu sai bên dưới nhé."}
          </p>

          <div className="action-buttons">
            <button
              className="result-btn primary"
              onClick={() => navigate("/quiz")}
            >
              <i className="bi bi-arrow-clockwise me-2"></i>
              Làm lại
            </button>
            <button
              className="result-btn secondary"
              onClick={() => navigate("/")}
            >
              <i className="bi bi-house-door me-2"></i>
              Trang chủ
            </button>
          </div>
        </div>

        {review.length > 0 && (
          <section className="review-section">
            <h2 className="review-heading">Chi tiết từng câu</h2>
            <div className="review-list">
              {paginatedReview.map((item, index) => {
                const questionNumber = reviewStartIndex + index + 1;

                return (
                <article
                  key={`${item.id}-${questionNumber}`}
                  className={`review-item ${item.isCorrect ? "correct" : "wrong"}`}
                >
                  <div className="review-question">
                    <span>
                      Câu {questionNumber}: {item.question}
                    </span>
                    <span className="review-badge">
                      {item.isCorrect ? "Đúng" : "Sai"}
                    </span>
                  </div>

                  <div className="review-options">
                    {item.options.map((option, optionIndex) => {
                      const isCorrectAnswer = optionIndex === item.correctAnswer;
                      const isSelectedAnswer =
                        optionIndex === item.selectedAnswer;
                      const optionClass = [
                        "review-option",
                        isCorrectAnswer ? "correct-answer" : "",
                        isSelectedAnswer && !isCorrectAnswer
                          ? "wrong-answer"
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" ");

                      return (
                        <div key={optionIndex} className={optionClass}>
                          <span className="option-key">
                            {String.fromCharCode(65 + optionIndex)}
                          </span>
                          <span>
                            {option}
                            {isSelectedAnswer && " - bạn chọn"}
                            {isCorrectAnswer && " - đáp án đúng"}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <p className="review-explanation">
                    <strong>Giải thích: </strong>
                    {item.explanation}
                  </p>
                  {item.source && (
                    <p className="review-source">
                      <i className="bi bi-bookmark-check-fill"></i>
                      <span>
                        <strong>Vị trí trong giáo trình: </strong>
                        {formatTextbookSource(item.source)}
                      </span>
                    </p>
                  )}
                </article>
                );
              })}
            </div>
            {totalReviewPages > 1 && (
              <div className="review-pagination" aria-label="Phân trang đáp án">
                <button
                  className="page-btn"
                  type="button"
                  disabled={reviewPage === 1}
                  onClick={() => setReviewPage((page) => Math.max(1, page - 1))}
                >
                  <i className="bi bi-chevron-left"></i>
                </button>
                {Array.from({ length: totalReviewPages }, (_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <button
                      key={pageNumber}
                      className={`page-btn ${reviewPage === pageNumber ? "active" : ""}`}
                      type="button"
                      onClick={() => setReviewPage(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                <button
                  className="page-btn"
                  type="button"
                  disabled={reviewPage === totalReviewPages}
                  onClick={() =>
                    setReviewPage((page) => Math.min(totalReviewPages, page + 1))
                  }
                >
                  <i className="bi bi-chevron-right"></i>
                </button>
                <div className="page-summary">
                  Hiển thị câu {reviewStartIndex + 1}-
                  {Math.min(reviewStartIndex + reviewPageSize, review.length)} /
                  {review.length}
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </>
  );
};

export default QuizResultsPage;
