import React from "react";
import "./modal.scss";
import silhouette from "./silhouette.png";

const Modal = ({
  player,
  isOpen,
  onClose,
  stats,
  gameResult,
  hints,
  guessCount,
}) => {
  const COLUMN = 6;
  const ROW = 7;
  if (!isOpen) return null;

  const renderGrid = () => {
    const grid = Array(COLUMN)
      .fill()
      .map(() => Array(ROW).fill(false));

    const [row, col, team1, team2, rightSide, leftSide] = hints;
    for (let i = 0; i < ROW; i++) grid[row][i] = "revealed";
    for (let i = 0; i < COLUMN; i++) grid[i][col] = "revealed";
    grid[team1][1] = "revealed";
    grid[team2][1] = "revealed";

    if (rightSide !== undefined) {
      for (let i = 0; i < COLUMN; i++) {
        for (let j = 2; j < ROW; j++) {
          grid[i][j] = "revealed";
        }
      }
    }
    if (leftSide !== undefined) {
      for (let i = 0; i < COLUMN; i++) {
        for (let j = 0; j < ROW; j++) {
          grid[i][j] = "revealed";
        }
      }
    }

    return (
      <div className="hint-grid">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="hint-row">
            {row.map((cell, cellIndex) => (
              <div
                key={cellIndex}
                className={`hint-cell ${cell ? "revealed" : ""}`}
              />
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {renderGrid()}
        <div className="result-container"></div>
        <div className="silhouettes">
          <div>
            {[...Array(6)].map((_, index) => (
              <img
                key={index}
                src={silhouette}
                alt="Silhouette"
                className={`silhouette-icon ${
                  index < hints.filter((hint) => hint !== undefined).length
                    ? "used"
                    : ""
                }`}
              />
            ))}
          </div>
          <span className="silhouette-count">
            {hints.filter((hint) => hint !== undefined).length} / 6 hints used
          </span>
        </div>
        <div className="info-container">
          <span className="player-name">{player}</span>
          <span className="guess-count">You got it on guess {guessCount}</span>
        </div>
        <div className="stats">
          <span className="stats-title">Your Stats</span>
          <p>Games Played: {localStorage?.statl_gamesPlayed || 1}</p>
          <p>Win Percentage: {localStorage?.statl_winPercentage || 100}%</p>
          <p>Current Streak: {localStorage?.statl_currentStreak || 1}</p>
          <p>Max Streak: {localStorage?.statl_maxStreak || 1}</p>
        </div>
        <div className="button-container">
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
