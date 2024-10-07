import React, { useState, useCallback } from "react";
import NFLLogo from "./NFL-logo.png";
import NBALogo from "./NBA-logo.png";
import MLBLogo from "./MLB-logo.png";
import NHLLogo from "./NHL-logo.png";
import "./modal.scss";
import { FaCheckCircle } from "react-icons/fa";
import { FaShare } from "react-icons/fa";
import { FaClipboardCheck } from "react-icons/fa";

const GauntletModeModal = ({
  isOpen,
  onClose,
  onExit,
  strikes,
  gauntletScore,
  gauntletHighScore,
  gauntletPlayer,
  selectedLeagues,
  gauntletModeGuesses,
  setSelectedLeagues,
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const [noSelectedLeaguesFlag, setNoSelectedLeaguesFlag] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  }, [onClose]);

  const handleExit = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onExit();
    }, 300);
  }, [onExit]);

  const handleOverlayClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) {
        handleClose();
      }
    },
    [handleClose]
  );

  const toggleLeague = (league) => {
    if (strikes !== 3 || gauntletScore) {
      return;
    }
    setSelectedLeagues((prev) => {
      const newState = { ...prev, [league]: !prev[league] };
      const anyLeagueSelected = Object.values(newState).some((value) => value);
      if (!anyLeagueSelected) {
        setNoSelectedLeaguesFlag(true);
        return prev; // If toggling would result in no leagues selected, return the previous state
      } else if (Object.values(newState).length > 1) {
        setNoSelectedLeaguesFlag(false);
      }
      return newState;
    });
  };

  const handleShare = () => {
    const guessHistory = gauntletModeGuesses
      .map((guess) => (guess.isCorrect ? "🔵" : "🔴"))
      .join("");

    const text = `I scored ${gauntletScore} on todays statl. Visit ${window.location.href} to join the fun. `;

    const fullText = [guessHistory, text].join("\n\n");

    if (navigator.share) {
      // Use Web Share API if available (works on mobile)
      navigator
        .share({
          title: "statl",
          text: fullText,
        })
        .catch((err) => console.error("Error sharing:", err));
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      // Fallback to Clipboard API
      navigator.clipboard
        .writeText(fullText)
        .then(() => {
          console.log("in here");
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        })
        .catch((err) => {
          console.error("Failed to copy:", err);
          fallbackCopyTextToClipboard(shareText);
        });
    } else {
      // Fallback for older browsers
      fallbackCopyTextToClipboard(fullText);
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
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Fallback: Oops, unable to copy", err);
    }
    document.body.removeChild(textArea);
  };

  if (!isOpen) return null;
  return (
    <div
      className={`modal-overlay ${isClosing ? "closing" : ""}`}
      onClick={handleOverlayClick}
    >
      <div
        className={`modal-content gauntlet-mode ${isClosing ? "closing" : ""}`}
      >
        {strikes !== 0 ? (
          <div>
            <h3 className="title">How To Play</h3>
            <div className="instructions-container">
              <span>• Guess players based on their stats.</span>
              <span>• You have 3 strikes.</span>
              <hr style={{ borderTop: "1px solid white", width: "100%" }} />
              <span>Select your leagues:</span>
              <div className="league-images">
                <div
                  className="league-icon-container"
                  onClick={() => toggleLeague("NFL")}
                >
                  <img
                    src={NFLLogo}
                    alt="NFL"
                    className={`league-icon ${
                      selectedLeagues.NFL ? "selected" : ""
                    }`}
                  />
                  {selectedLeagues.NFL && <FaCheckCircle color="#4a90e2" />}
                </div>
                <div
                  className="league-icon-container"
                  onClick={() => toggleLeague("NBA")}
                >
                  <img
                    src={NBALogo}
                    alt="NBA"
                    className={`league-icon ${
                      selectedLeagues.NBA ? "selected" : ""
                    }`}
                  />
                  {selectedLeagues.NBA && <FaCheckCircle color="#4a90e2" />}
                </div>
                <div
                  className="league-icon-container"
                  onClick={() => toggleLeague("MLB")}
                >
                  <img
                    src={MLBLogo}
                    alt="MLB"
                    className={`league-icon ${
                      selectedLeagues.MLB ? "selected" : ""
                    }`}
                  />
                  {selectedLeagues.MLB && <FaCheckCircle color="#4a90e2" />}
                </div>
                <div
                  className="league-icon-container"
                  onClick={() => toggleLeague("NHL")}
                >
                  <img
                    src={NHLLogo}
                    alt="NHL"
                    className={`league-icon ${
                      selectedLeagues.NHL ? "selected" : ""
                    }`}
                  />
                  {selectedLeagues.NHL && <FaCheckCircle color="#4a90e2" />}
                </div>
              </div>
              {noSelectedLeaguesFlag && (
                <span
                  style={{
                    fontSize: "10px",
                    textAlign: "center",
                    color: "#f44336",
                    gap: "0px",
                  }}
                >
                  You must have at least one league selected
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="instructions-container">
            <h3 style={{ marginBottom: "0px", textAlign: "center" }}>
              Game Over
            </h3>
            <div className="gauntlet-score-container">
              <div style={{ textAlign: "center" }}>
                <h1 style={{ margin: "0px" }}> {gauntletScore}</h1>
                <p style={{ fontSize: "smaller", margin: "0px" }}>Score</p>
              </div>
            </div>
            <div>
              <button
                style={{
                  textAlign: "center",
                  fontFamily: "Poppins",
                  fontSize: "12px",
                  display: "flex",
                  justifyContent: "center",
                }}
                onClick={() => handleShare()}
              >
                <div style={{ marginRight: "8px", marginTop: "1px" }}>
                  {isCopied ? <FaClipboardCheck /> : <FaShare />}
                </div>
                {isCopied ? "Copied" : "Share"}
              </button>
            </div>
            <h3 style={{ marginBottom: "0px", textAlign: "center" }}>
              Guess Details
            </h3>
            <div className="guess-list">
              {gauntletModeGuesses.map((guess, index) => (
                <div
                  key={index}
                  className={`guess-item ${
                    guess.isCorrect ? "correct" : "incorrect"
                  }`}
                >
                  <span>{guess.player}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="button-container">
          {strikes !== 0 && (
            <button onClick={strikes === 3 ? handleClose : handleExit}>
              Got it, let's play!
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GauntletModeModal;
