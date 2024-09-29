import React, { useState, useCallback } from "react";
import NFLLogo from "./NFL-logo.png";
import NBALogo from "./NBA-logo.png";
import MLBLogo from "./MLB-logo.png";
import NHLLogo from "./NHL-logo.png";
import "./modal.scss";

const GauntletModeModal = ({
  isOpen,
  onClose,
  onExit,
  strikes,
  gauntletScore,
  gauntletHighScore,
  gauntletPlayer,
  selectedLeagues,
  setSelectedLeagues,
}) => {
  const [isClosing, setIsClosing] = useState(false);

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
    setSelectedLeagues((prev) => ({
      ...prev,
      [league]: !prev[league],
    }));
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
        {strikes === 3 ? (
          <div className="instructions-container">
            <h3>Welcome to Gauntlet Mode!</h3>
            <span>Guess as many players correctly in a row.</span>
            <span>You have 3 strikes.</span>
            <span>Leaving in the middle will not save your score.</span>
            <span>Select your leagues:</span>
            <div className="league-images">
              <div className="league-icon-container">
                <img
                  src={NFLLogo}
                  alt="NFL"
                  className={`league-icon ${
                    selectedLeagues.NFL ? "selected" : ""
                  }`}
                  onClick={() => toggleLeague("NFL")}
                />
                {selectedLeagues.NFL && <span className="checkmark">✓</span>}
              </div>
              <div className="league-icon-container">
                <img
                  src={NBALogo}
                  alt="NBA"
                  className={`league-icon ${
                    selectedLeagues.NBA ? "selected" : ""
                  }`}
                  onClick={() => toggleLeague("NBA")}
                />
                {selectedLeagues.NBA && <span className="checkmark">✓</span>}
              </div>
              <div className="league-icon-container">
                <img
                  src={MLBLogo}
                  alt="MLB"
                  className={`league-icon ${
                    selectedLeagues.MLB ? "selected" : ""
                  }`}
                  onClick={() => toggleLeague("MLB")}
                />
                {selectedLeagues.MLB && <span className="checkmark">✓</span>}
              </div>
              <div className="league-icon-container">
                <img
                  src={NHLLogo}
                  alt="NHL"
                  className={`league-icon ${
                    selectedLeagues.NHL ? "selected" : ""
                  }`}
                  onClick={() => toggleLeague("NHL")}
                />
                {selectedLeagues.NHL && <span className="checkmark">✓</span>}
              </div>
            </div>
            <span style={{ marginTop: "20px" }}>
              How many in a row can you guess correctly?
            </span>
          </div>
        ) : (
          <div className="instructions-container">
            <h3>Game Over!</h3>
            <span>The correct player was {gauntletPlayer}.</span>
            <span>Your stats: </span>
            <span>Score: {gauntletScore}</span>
            <span>High Score: {gauntletHighScore}</span>
            <span>Better luck next time!</span>
          </div>
        )}
        <div className="button-container">
          <button onClick={strikes === 3 ? handleClose : handleExit}>
            {strikes === 3 ? "Got it, let's play!" : "Exit Gauntlet Mode"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GauntletModeModal;
