import React, { useState, useCallback } from "react";
import "./modal.scss";

const GauntletModeModal = ({
  isOpen,
  onClose,
  onExit,
  strikes,
  gauntletScore,
  gauntletHighScore,
  gauntletPlayer,
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
            <span>All stats will be shown from the beginning.</span>
            <span>You have 3 strikes.</span>
            <span>Leaving in the middle will not save your score.</span>
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
