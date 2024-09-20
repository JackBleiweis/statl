import React, { useState, useEffect, useRef } from "react";
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
  leagueLength,
  careerLength,
  onShare,
}) => {
  const COLUMN = leagueLength;
  const ROW = careerLength;

  const [timeUntilMidnight, setTimeUntilMidnight] = useState("");
  const modalRef = useRef(null);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight - now;
      const hours = Math.floor(diff / 3600000)
        .toString()
        .padStart(2, "0");
      const minutes = Math.floor((diff % 3600000) / 60000)
        .toString()
        .padStart(2, "0");
      const seconds = Math.floor((diff % 60000) / 1000)
        .toString()
        .padStart(2, "0");
      setTimeUntilMidnight(`${hours}:${minutes}:${seconds}`);
    };

    updateTimer();
    const timerId = setInterval(updateTimer, 1000);

    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleShare = () => {
    const shareText = `I guessed the statl in ${guessCount} tries with ${
      hints.filter((hint) => hint !== undefined).length
    }/6 hints used! Play STATL at ${window.location.href}`;

    if (navigator.share) {
      // Use Web Share API if available (works on mobile)
      navigator
        .share({
          title: "STATL Results",
          text: shareText,
        })
        .catch((err) => console.error("Error sharing:", err));
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      // Fallback to Clipboard API
      navigator.clipboard
        .writeText(shareText)
        .then(() => alert("Results copied to clipboard!"))
        .catch((err) => {
          console.error("Failed to copy:", err);
          fallbackCopyTextToClipboard(shareText);
        });
    } else {
      // Fallback for older browsers
      fallbackCopyTextToClipboard(shareText);
    }
  };

  // Fallback function for copying text
  const fallbackCopyTextToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      alert("Results copied to clipboard!");
    } catch (err) {
      console.error("Fallback: Oops, unable to copy", err);
    }
    document.body.removeChild(textArea);
  };

  if (!isOpen) return null;
  const renderGrid = () => {
    const grid = Array(ROW)
      .fill()
      .map(() => Array(COLUMN).fill(false));

    if (hints.length !== 0) {
      const [row, col, team1, team2, rightSide, leftSide] = hints;
      if (row !== undefined) {
        for (let i = 0; i < COLUMN; i++) grid[row][i] = "revealed";
      }
      if (col !== undefined) {
        for (let i = 0; i < ROW; i++) grid[i][col] = "revealed";
      }
      if (team1 !== undefined) {
        grid[team1][1] = "revealed";
      }
      if (team2 !== undefined) {
        grid[team2][1] = "revealed";
      }
      if (rightSide !== undefined) {
        for (let i = 0; i < ROW; i++) {
          for (let j = 2; j < COLUMN; j++) {
            grid[i][j] = "revealed";
          }
        }
      }
      if (leftSide !== undefined) {
        for (let i = 0; i < ROW; i++) {
          for (let j = 0; j < 2; j++) {
            grid[i][j] = "revealed";
          }
        }
      }
    }

    return (
      <div
        className="hint-grid"
        style={{
          "--columns": COLUMN,
          "--rows": ROW,
        }}
      >
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
      <div className="modal-content" ref={modalRef}>
        <div className="countdown-timer">
          Next STATL in: {timeUntilMidnight}
        </div>
        <div className="modal-header"></div>
        {renderGrid()}
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
          <span className="guess-count">Guesses taken: {guessCount}</span>
        </div>
        <div className="stats">
          <span className="stats-title">Your Stats</span>
          <p className="games-played">
            Games Played: {localStorage?.statl_gamesPlayed || 1}
          </p>
          <div className="streak-container">
            <p>Current Streak: {localStorage?.currentStreak || 1}</p>
            <p>Max Streak: {localStorage?.maxStreak || 1}</p>
          </div>
        </div>
        <div className="share-section">
          <button onClick={handleShare}>Share Results</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
