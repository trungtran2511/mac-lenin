import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getLivePlayer,
  getLivePlayers,
  getLiveRoom,
  joinLiveRoom,
  subscribeLiveRoom,
  updateLivePlayer,
} from "../../services/liveQuizService";
import {
  LIVE_QUIZ_PLAYER_KEY,
  LIVE_QUIZ_MAX_PLAYERS,
  calculateLeaderboard,
  createQuestionOrder,
  generateToken,
  getStoredToken,
  maybeCreateBuff,
  storeToken,
} from "../../utils/liveQuiz";
import "../../styles/liveQuiz.css";

function PlayerQuizPage() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const normalizedRoomCode = roomCode?.toUpperCase();
  const [room, setRoom] = useState(null);
  const [player, setPlayer] = useState(null);
  const [players, setPlayers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questionStartedAt, setQuestionStartedAt] = useState(Date.now());
  const [nowTick, setNowTick] = useState(Date.now());
  const [joinName, setJoinName] = useState("");
  const [error, setError] = useState("");
  const [extraSeconds, setExtraSeconds] = useState(0);
  const [hiddenOptions, setHiddenOptions] = useState([]);

  const playerToken = getStoredToken(LIVE_QUIZ_PLAYER_KEY, normalizedRoomCode);
  const leaderboard = useMemo(() => calculateLeaderboard(players), [players]);
  const orderedQuestions = useMemo(() => {
    if (!room || !player?.question_order?.length) return [];
    return player.question_order.map((index) => room.question_set[index]).filter(Boolean);
  }, [player, room]);
  const currentQuestion = orderedQuestions[currentIndex];
  const answers = player?.answers || {};
  const selectedAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;
  const hasAnsweredCurrent = selectedAnswer !== undefined;
  const isCurrentCorrect =
    hasAnsweredCurrent && selectedAnswer === currentQuestion?.correctAnswer;

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const roomData = await getLiveRoom(normalizedRoomCode);
        const playerData = playerToken
          ? await getLivePlayer(normalizedRoomCode, playerToken).catch(() => null)
          : null;
        const playerList = await getLivePlayers(normalizedRoomCode);

        if (!isMounted) return;
        setRoom(roomData);
        setPlayer(playerData);
        setPlayers(playerList);
      } catch (err) {
        setError(err.message || "Không tải được phòng.");
      }
    }

    load();
    const unsubscribe = subscribeLiveRoom(normalizedRoomCode, {
      onRoomChange: (payload) => setRoom(payload.new),
      onPlayersChange: () => {
        getLivePlayers(normalizedRoomCode)
          .then((playerList) => {
            setPlayers(playerList);
            const self = playerList.find((item) => item.player_token === playerToken);
            if (self) setPlayer(self);
          })
          .catch(console.warn);
      },
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [normalizedRoomCode, playerToken]);

  useEffect(() => {
    if (room?.status !== "playing") return;
    setExtraSeconds(0);
    setQuestionStartedAt(Date.now());
    setNowTick(Date.now());
  }, [room?.status]);

  const perQuestionSeconds = room?.config?.perQuestionSeconds || 30;
  const remainingSeconds = useMemo(() => {
    if (room?.status !== "playing") return perQuestionSeconds;
    const elapsed = Math.floor((nowTick - questionStartedAt) / 1000);
    return Math.max(perQuestionSeconds + extraSeconds - elapsed, 0);
  }, [extraSeconds, nowTick, perQuestionSeconds, questionStartedAt, room?.status]);

  const handleSubmit = useCallback(async () => {
    if (!player || player.status === "submitted") return;
    const updatedPlayer = await updateLivePlayer(player.id, {
      status: "submitted",
      submitted_at: new Date().toISOString(),
    });
    setPlayer(updatedPlayer);
  }, [player]);

  useEffect(() => {
    if (room?.status !== "playing" || !player || player.status === "submitted") return;

    const timer = window.setInterval(() => {
      setNowTick(Date.now());
    }, 1000);

    return () => window.clearInterval(timer);
  });

  useEffect(() => {
    if (room?.status !== "playing" || player?.status === "submitted") return;
    if (remainingSeconds > 0) return;

    if (currentIndex >= orderedQuestions.length - 1) {
      handleSubmit();
      return;
    }

    setHiddenOptions([]);
    setExtraSeconds(0);
    setQuestionStartedAt(Date.now());
    setNowTick(Date.now());
    setCurrentIndex((index) => Math.min(orderedQuestions.length - 1, index + 1));
  }, [
    currentIndex,
    handleSubmit,
    orderedQuestions.length,
    player?.status,
    remainingSeconds,
    room?.status,
  ]);

  const handleJoinInline = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const roomData = room || (await getLiveRoom(normalizedRoomCode));
      if (roomData.status === "ended") {
        throw new Error("Phòng này đã kết thúc.");
      }

      const playerList = await getLivePlayers(normalizedRoomCode);
      if (playerList.length >= LIVE_QUIZ_MAX_PLAYERS) {
        throw new Error(`Phòng đã đủ ${LIVE_QUIZ_MAX_PLAYERS} người.`);
      }

      const newToken = generateToken("player");
      const newPlayer = await joinLiveRoom({
        room_code: normalizedRoomCode,
        player_token: newToken,
        name: joinName.trim() || `Người chơi ${playerList.length + 1}`,
        status: roomData.status === "playing" ? "playing" : "lobby",
        question_order: createQuestionOrder(roomData.question_set.length, newToken),
        answers: {},
        score: 0,
        correct_count: 0,
        answered_count: 0,
        total_questions: roomData.question_set.length,
        buffs: [],
      });

      storeToken(LIVE_QUIZ_PLAYER_KEY, normalizedRoomCode, newToken);
      setPlayer(newPlayer);
      navigate(`/live-quiz/play/${normalizedRoomCode}`, { replace: true });
    } catch (err) {
      setError(err.message || "Không vào được phòng.");
    }
  };

  const handleAnswer = async (answerIndex) => {
    if (!player || !currentQuestion || player.status === "submitted") return;

    const updatedAnswers = {
      ...answers,
      [currentQuestion.id]: answerIndex,
    };

    let score = 0;
    let correctCount = 0;
    orderedQuestions.forEach((question) => {
      const selected = updatedAnswers[question.id];
      if (selected === undefined) return;
      if (selected === question.correctAnswer) {
        const doubleActive =
          player.active_buff?.id === "double_score" &&
          !player.active_buff?.used &&
          question.id === currentQuestion.id;
        score += doubleActive ? 2 : 1;
        correctCount += 1;
      }
    });

    const nextBuff = maybeCreateBuff(room.buffs_enabled, player.active_buff);
    const usedBuff =
      player.active_buff?.id === "double_score"
        ? { ...player.active_buff, used: true }
        : player.active_buff;

    const updatedPlayer = await updateLivePlayer(player.id, {
      answers: updatedAnswers,
      score,
      correct_count: correctCount,
      answered_count: Object.keys(updatedAnswers).length,
      active_buff: nextBuff || usedBuff,
      buffs: nextBuff ? [...(player.buffs || []), nextBuff] : player.buffs || [],
      status: "playing",
    });

    setPlayer(updatedPlayer);
  };

  const useBuff = async () => {
    if (!player?.active_buff || !currentQuestion) return;
    const buff = player.active_buff;

    if (buff.id === "time_plus") {
      setExtraSeconds((seconds) => seconds + 10);
    }

    if (buff.id === "fifty_fifty") {
      const wrongIndexes = currentQuestion.options
        .map((_, index) => index)
        .filter((index) => index !== currentQuestion.correctAnswer)
        .slice(0, 2);
      setHiddenOptions(wrongIndexes);
    }

    if (buff.id === "focus_jump") {
      const unanswered = orderedQuestions
        .map((question, index) => ({ question, index }))
        .filter((item) => answers[item.question.id] === undefined);
      if (unanswered.length) {
        const jump = unanswered[Math.floor(Math.random() * unanswered.length)];
        setExtraSeconds(0);
        setQuestionStartedAt(Date.now());
        setNowTick(Date.now());
        setCurrentIndex(jump.index);
      }
    }

    const updatedPlayer = await updateLivePlayer(player.id, {
      active_buff: { ...buff, used: true },
    });
    setPlayer(updatedPlayer);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  if (error) {
    return (
      <main className="live-quiz-page">
        <div className="live-quiz-shell">
          <div className="live-error">{error}</div>
          <Link className="live-primary-btn" to="/live-quiz">
            Quay lại
          </Link>
        </div>
      </main>
    );
  }

  if (!room) {
    return <main className="live-quiz-page live-loading">Đang tải phòng...</main>;
  }

  if (!player) {
    return (
      <main className="live-quiz-page">
        <div className="live-quiz-shell live-join-inline">
          <Link to="/live-quiz" className="live-home-link">
            <i className="bi bi-arrow-left-circle-fill"></i>
            Live Quiz
          </Link>
          <section className="live-panel">
            <h1>Vào phòng {normalizedRoomCode}</h1>
            <form className="live-form" onSubmit={handleJoinInline}>
              <label>
                Tên của bạn
                <input
                  value={joinName}
                  onChange={(event) => setJoinName(event.target.value)}
                  placeholder="Nhập tên để vào phòng"
                />
              </label>
              <button className="live-primary-btn" type="submit">
                Vào phòng
              </button>
            </form>
          </section>
        </div>
      </main>
    );
  }

  if (room.status === "lobby") {
    return (
      <main className="live-quiz-page">
        <div className="live-quiz-shell">
          <Link to="/live-quiz" className="live-home-link">
            <i className="bi bi-arrow-left-circle-fill"></i>
            Live Quiz
          </Link>
          <section className="live-panel live-waiting">
            <p className="live-eyebrow">Lobby</p>
            <h1>Đang chờ host bắt đầu</h1>
            <p>
              Phòng <strong>{normalizedRoomCode}</strong> hiện có{" "}
              <strong>
                {players.length}/{LIVE_QUIZ_MAX_PLAYERS}
              </strong>{" "}
              người chơi.
            </p>
          </section>
        </div>
      </main>
    );
  }

  if (room.status === "ended" || player.status === "submitted") {
    const myRank = leaderboard.findIndex((item) => item.id === player.id) + 1;

    return (
      <main className="live-quiz-page">
        <div className="live-quiz-shell">
          <section className="live-panel live-result">
            <p className="live-eyebrow">Kết quả</p>
            <h1>Hạng #{myRank || "-"}</h1>
            <p>
            {player.name}: <strong>{player.score || 0} điểm</strong> ·{" "}
              {player.correct_count || 0}/{player.total_questions || 0} câu đúng
            </p>
            <div className="live-leaderboard">
              {leaderboard.map((item, index) => (
                <article key={item.id} className="live-rank-row">
                  <span>#{index + 1}</span>
                  <strong>{item.name}</strong>
                  <small>
                    {item.score || 0}đ · {item.correct_count || 0} đúng
                  </small>
                </article>
              ))}
            </div>
            <Link className="live-primary-btn" to="/live-quiz">
              Về Live Quiz
            </Link>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="live-quiz-page">
      <div className="live-quiz-shell">
        <section className="live-player-topbar">
          <div>
            <p className="live-eyebrow">{room.room_name}</p>
            <h1>{player.name}</h1>
          </div>
          <div className="live-timer">{formatTime(remainingSeconds)}</div>
        </section>

        {player.active_buff && !player.active_buff.used && (
          <button type="button" className="live-buff-toast" onClick={useBuff}>
            <i className={`bi ${player.active_buff.icon}`}></i>
            <span>
              <strong>{player.active_buff.name}</strong>
              {player.active_buff.description}
            </span>
          </button>
        )}

        <section className="live-panel live-question-panel">
          <div className="live-question-head">
            <span>
              Câu {currentIndex + 1}/{orderedQuestions.length}
            </span>
            <strong>{player.score || 0} điểm</strong>
          </div>
          <h2>{currentQuestion?.question}</h2>
          {hasAnsweredCurrent && (
            <div
              className={`live-answer-feedback ${
                isCurrentCorrect ? "correct" : "wrong"
              }`}
            >
              <i
                className={`bi ${
                  isCurrentCorrect ? "bi-check-circle-fill" : "bi-x-circle-fill"
                }`}
              ></i>
              <span>
                {isCurrentCorrect ? "Chính xác!" : "Chưa đúng."} Đáp án đúng là{" "}
                <strong>
                  {String.fromCharCode(65 + currentQuestion.correctAnswer)}.{" "}
                  {currentQuestion.options[currentQuestion.correctAnswer]}
                </strong>
              </span>
            </div>
          )}
          <div className="live-answer-grid">
            {currentQuestion?.options.map((option, index) => (
              <button
                key={option}
                type="button"
                className={`live-answer-btn ${
                  selectedAnswer === index ? "selected" : ""
                } ${
                  hasAnsweredCurrent && index === currentQuestion.correctAnswer
                    ? "correct"
                    : ""
                } ${
                  hasAnsweredCurrent &&
                  selectedAnswer === index &&
                  index !== currentQuestion.correctAnswer
                    ? "wrong"
                    : ""
                }`}
                disabled={hiddenOptions.includes(index)}
                onClick={() => handleAnswer(index)}
              >
                <span>{String.fromCharCode(65 + index)}</span>
                {hiddenOptions.includes(index) ? "Đã bị ẩn bởi 50/50" : option}
              </button>
            ))}
          </div>
          <div className="live-player-actions">
            <button
              type="button"
              className="live-secondary-btn"
              disabled={currentIndex === 0}
              onClick={() => {
                setHiddenOptions([]);
                setExtraSeconds(0);
                setQuestionStartedAt(Date.now());
                setNowTick(Date.now());
                setCurrentIndex((index) => Math.max(0, index - 1));
              }}
            >
              Câu trước
            </button>
            <button
              type="button"
              className="live-primary-btn"
              onClick={() => {
                setHiddenOptions([]);
                setExtraSeconds(0);
                setQuestionStartedAt(Date.now());
                setNowTick(Date.now());
                setCurrentIndex((index) =>
                  Math.min(orderedQuestions.length - 1, index + 1),
                );
              }}
            >
              Câu tiếp
            </button>
            <button type="button" className="live-danger-btn" onClick={handleSubmit}>
              Nộp bài
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

export default PlayerQuizPage;
