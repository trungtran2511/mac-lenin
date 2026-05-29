import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getLivePlayers,
  getLiveRoom,
  subscribeLiveRoom,
  updateLiveRoom,
} from "../../services/liveQuizService";
import {
  LIVE_QUIZ_HOST_KEY,
  LIVE_QUIZ_MAX_PLAYERS,
  calculateLeaderboard,
  getStoredToken,
} from "../../utils/liveQuiz";
import "../../styles/liveQuiz.css";

function HostRoomPage() {
  const { roomCode } = useParams();
  const normalizedRoomCode = roomCode?.toUpperCase();
  const [room, setRoom] = useState(null);
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState("");
  const [isBusy, setIsBusy] = useState(false);

  const hostToken = getStoredToken(LIVE_QUIZ_HOST_KEY, normalizedRoomCode);
  const isHost = room?.host_token === hostToken;
  const leaderboard = useMemo(() => calculateLeaderboard(players), [players]);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const [roomData, playerData] = await Promise.all([
          getLiveRoom(normalizedRoomCode),
          getLivePlayers(normalizedRoomCode),
        ]);
        if (!isMounted) return;
        setRoom(roomData);
        setPlayers(playerData);
      } catch (err) {
        setError(err.message || "Không tải được phòng.");
      }
    }

    load();
    const unsubscribe = subscribeLiveRoom(normalizedRoomCode, {
      onRoomChange: (payload) => setRoom(payload.new),
      onPlayersChange: () => {
        getLivePlayers(normalizedRoomCode).then(setPlayers).catch(console.warn);
      },
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [normalizedRoomCode]);

  const handleStart = async () => {
    if (!isHost) return;
    setIsBusy(true);
    try {
      await updateLiveRoom(normalizedRoomCode, {
        status: "playing",
        started_at: new Date().toISOString(),
        ended_at: null,
      });
    } finally {
      setIsBusy(false);
    }
  };

  const handleEnd = async () => {
    if (!isHost) return;
    setIsBusy(true);
    try {
      await updateLiveRoom(normalizedRoomCode, {
        status: "ended",
        ended_at: new Date().toISOString(),
      });
    } finally {
      setIsBusy(false);
    }
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

  return (
    <main className="live-quiz-page">
      <div className="live-quiz-shell">
        <Link to="/live-quiz" className="live-home-link">
          <i className="bi bi-arrow-left-circle-fill"></i>
          Live Quiz
        </Link>

        <section className="live-host-header">
          <div>
            <p className="live-eyebrow">Host Dashboard</p>
            <h1>{room.room_name}</h1>
            <p>
              Mã phòng: <strong>{normalizedRoomCode}</strong>
            </p>
          </div>
          <div className="live-room-code">
            <span>
              {players.length}/{LIVE_QUIZ_MAX_PLAYERS}
            </span>
            <small>người chơi</small>
          </div>
        </section>

        {!isHost && (
          <div className="live-warning">
            Trình duyệt này không có host token. Bạn vẫn xem được dashboard,
            nhưng không thể start/end phòng.
          </div>
        )}

        <div className="live-host-actions">
          <button
            type="button"
            className="live-primary-btn"
            disabled={!isHost || room.status !== "lobby" || isBusy}
            onClick={handleStart}
          >
            <i className="bi bi-play-fill"></i>
            Bắt đầu
          </button>
          <button
            type="button"
            className="live-danger-btn"
            disabled={!isHost || room.status === "ended" || isBusy}
            onClick={handleEnd}
          >
            <i className="bi bi-stop-circle-fill"></i>
            Kết thúc
          </button>
          <span className={`live-status ${room.status}`}>{room.status}</span>
        </div>

        <section className="live-grid">
          <div className="live-panel">
            <h2>Tiến độ người chơi</h2>
            <div className="live-player-list">
              {players.length === 0 && <p className="live-muted">Chưa có ai vào phòng.</p>}
              {players.map((player) => (
                <article key={player.id} className="live-player-row">
                  <div>
                    <strong>{player.name}</strong>
                    <span>{player.status}</span>
                  </div>
                  <div className="live-progress-mini">
                    <span
                      style={{
                        width: `${Math.round(
                          ((player.answered_count || 0) /
                            Math.max(player.total_questions || 1, 1)) *
                            100,
                        )}%`,
                      }}
                    />
                  </div>
                  <small>
                    {player.answered_count || 0}/{player.total_questions || 0} câu
                  </small>
                </article>
              ))}
            </div>
          </div>

          <div className="live-panel">
            <h2>Bảng xếp hạng</h2>
            <div className="live-leaderboard">
              {leaderboard.map((player, index) => (
                <article key={player.id} className="live-rank-row">
                  <span>#{index + 1}</span>
                  <strong>{player.name}</strong>
                  <small>
                    {player.score || 0}đ · {player.correct_count || 0} đúng
                  </small>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default HostRoomPage;
