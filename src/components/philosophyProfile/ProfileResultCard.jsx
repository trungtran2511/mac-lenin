import { philosophyProfileGroups } from "../../data/philosophyProfileQuestions";

function ProfileResultCard({ result, onRestart, onCopy, copyStatus }) {
  if (!result) return null;

  const sortedPercentages = Object.entries(result.percentages).sort(
    (a, b) => b[1] - a[1],
  );

  return (
    <section className="profile-result-wrap">
      <div className="profile-result-card" id="philosophy-profile-result">
        <div className="profile-result-header">
          <div>
            <p className="profile-result-kicker">Triết Profile</p>
            <h2>{result.profile.name}</h2>
            <span className="profile-result-badge">
              {result.profile.badge}
            </span>
          </div>
          <div className="profile-result-score">
            <strong>{Math.round(result.percentages[result.winnerKey])}%</strong>
            <span>{philosophyProfileGroups[result.winnerKey].shortLabel}</span>
          </div>
        </div>

        <p className="profile-result-description">
          {result.profile.description}
        </p>

        <div className="profile-result-columns">
          <div>
            <h3>
              <i className="bi bi-lightning-charge-fill"></i>
              Điểm mạnh
            </h3>
            <ul>
              {result.profile.strengths.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3>
              <i className="bi bi-arrow-repeat"></i>
              Cần cải thiện
            </h3>
            <ul>
              {result.profile.improvements.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="profile-study-tip">
          <i className="bi bi-journal-bookmark-fill"></i>
          <div>
            <strong>Gợi ý học Triết phù hợp</strong>
            <p>{result.profile.studyTips}</p>
          </div>
        </div>

        <div className="profile-percentages">
          <h3>Tỷ lệ nhóm tư tưởng</h3>
          {sortedPercentages.map(([key, value]) => {
            const group = philosophyProfileGroups[key];

            return (
              <div className="profile-percent-row" key={key}>
                <div className="profile-percent-label">
                  <span>{group.label}</span>
                  <strong>{Math.round(value)}%</strong>
                </div>
                <div className="profile-percent-track">
                  <span
                    style={{
                      width: `${value}%`,
                      backgroundColor: group.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="profile-result-actions">
        <button type="button" className="profile-btn primary" onClick={onCopy}>
          <i className="bi bi-share-fill"></i>
          {copyStatus || "Copy kết quả"}
        </button>
        <button type="button" className="profile-btn secondary" onClick={onRestart}>
          <i className="bi bi-arrow-clockwise"></i>
          Làm lại
        </button>
      </div>
    </section>
  );
}

export default ProfileResultCard;
