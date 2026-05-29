import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ProfileQuestionCard from "../components/philosophyProfile/ProfileQuestionCard";
import ProfileResultCard from "../components/philosophyProfile/ProfileResultCard";
import {
  PHILOSOPHY_PROFILE_STORAGE_KEY,
  philosophyProfileGroups,
  philosophyProfileQuestions,
  philosophyProfiles,
} from "../data/philosophyProfileQuestions";
import "../styles/philosophyProfile.css";

const groupKeys = Object.keys(philosophyProfileGroups);

const createEmptyScores = () =>
  groupKeys.reduce((scores, key) => ({ ...scores, [key]: 0 }), {});

const calculateResult = (answers) => {
  const scores = createEmptyScores();

  philosophyProfileQuestions.forEach((question, index) => {
    const answerIndex = answers[index];
    if (answerIndex === undefined) return;

    const optionScores = question.options[answerIndex]?.scores || {};
    Object.entries(optionScores).forEach(([key, value]) => {
      scores[key] += value;
    });
  });

  const totalScore = Object.values(scores).reduce((sum, value) => sum + value, 0);
  const percentages = groupKeys.reduce((result, key) => {
    result[key] = totalScore ? (scores[key] / totalScore) * 100 : 0;
    return result;
  }, {});

  const winnerKey = groupKeys.reduce((winner, key) => {
    if (scores[key] > scores[winner]) return key;
    return winner;
  }, groupKeys[0]);

  return {
    answers,
    completedAt: new Date().toISOString(),
    percentages,
    profile: philosophyProfiles[winnerKey],
    scores,
    winnerKey,
  };
};

const formatShareText = (result) => {
  const lines = [
    `Triết Profile của tôi: ${result.profile.name}`,
    result.profile.description,
    "",
    "Tỷ lệ nhóm tư tưởng:",
    ...groupKeys.map((key) => {
      const group = philosophyProfileGroups[key];
      return `- ${group.label}: ${Math.round(result.percentages[key])}%`;
    }),
    "",
    `Gợi ý học: ${result.profile.studyTips}`,
  ];

  return lines.join("\n");
};

function PhilosophyProfilePage() {
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [result, setResult] = useState(() => {
    try {
      const savedResult = localStorage.getItem(PHILOSOPHY_PROFILE_STORAGE_KEY);
      return savedResult ? JSON.parse(savedResult) : null;
    } catch (error) {
      console.warn("Cannot load saved philosophy profile:", error);
      return null;
    }
  });
  const [copyStatus, setCopyStatus] = useState("");

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = philosophyProfileQuestions.length;
  const progress = result
    ? 100
    : Math.round((answeredCount / totalQuestions) * 100);
  const currentQuestion = philosophyProfileQuestions[currentQuestionIndex];
  const canGoNext = answers[currentQuestionIndex] !== undefined;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  const activeScores = useMemo(() => {
    const draftResult = calculateResult(answers);
    return draftResult.percentages;
  }, [answers]);

  const handleSelectAnswer = (answerIndex) => {
    setAnswers((current) => ({
      ...current,
      [currentQuestionIndex]: answerIndex,
    }));
  };

  const handleNext = () => {
    if (!canGoNext) return;

    if (isLastQuestion) {
      const finalResult = calculateResult(answers);
      setResult(finalResult);
      localStorage.setItem(
        PHILOSOPHY_PROFILE_STORAGE_KEY,
        JSON.stringify(finalResult),
      );
      return;
    }

    setCurrentQuestionIndex((index) => index + 1);
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex((index) => Math.max(0, index - 1));
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setResult(null);
    setCopyStatus("");
    localStorage.removeItem(PHILOSOPHY_PROFILE_STORAGE_KEY);
  };

  const handleCopyResult = async () => {
    if (!result) return;

    const shareText = formatShareText(result);

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareText);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = shareText;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      setCopyStatus("Đã copy");
      window.setTimeout(() => setCopyStatus(""), 1800);
    } catch (error) {
      console.warn("Cannot copy philosophy profile:", error);
      setCopyStatus("Copy lỗi");
      window.setTimeout(() => setCopyStatus(""), 1800);
    }
  };

  return (
    <main className="philosophy-profile-page">
      <div className="profile-shell">
        <header className="profile-hero">
          <Link className="profile-home-link" to="/">
            <i className="bi bi-house-door-fill"></i>
            Trang chủ
          </Link>
          <div className="profile-hero-copy">
            <p className="profile-eyebrow">Triết Profile</p>
            <h1>Bạn là hệ tư tưởng nào?</h1>
            <p>
              Trả lời 12 tình huống vui để khám phá kiểu tư duy triết học nổi
              bật của bạn và cách học hợp vibe nhất.
            </p>
          </div>
          <div className="profile-live-meter">
            {groupKeys.map((key) => (
              <div key={key}>
                <span>{philosophyProfileGroups[key].shortLabel}</span>
                <strong>{Math.round(activeScores[key])}%</strong>
              </div>
            ))}
          </div>
        </header>

        <section className="profile-panel">
          <div className="profile-progress-head">
            <span>
              {result ? "Hoàn thành" : `Đã trả lời ${answeredCount}/${totalQuestions}`}
            </span>
            <strong>{progress}%</strong>
          </div>
          <div className="profile-progress-track" aria-hidden="true">
            <span style={{ width: `${progress}%` }} />
          </div>

          {result ? (
            <ProfileResultCard
              result={result}
              onRestart={handleRestart}
              onCopy={handleCopyResult}
              copyStatus={copyStatus}
            />
          ) : (
            <>
              <ProfileQuestionCard
                question={currentQuestion}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={totalQuestions}
                selectedOption={answers[currentQuestionIndex]}
                onSelect={handleSelectAnswer}
              />

              <div className="profile-nav-actions">
                <button
                  type="button"
                  className="profile-btn secondary"
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                >
                  <i className="bi bi-arrow-left-circle-fill"></i>
                  Quay lại
                </button>
                <button
                  type="button"
                  className="profile-btn primary"
                  onClick={handleNext}
                  disabled={!canGoNext}
                >
                  {isLastQuestion ? "Xem kết quả" : "Câu tiếp"}
                  <i className="bi bi-arrow-right-circle-fill"></i>
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

export default PhilosophyProfilePage;
