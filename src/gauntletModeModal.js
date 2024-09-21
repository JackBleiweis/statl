import React, { useState } from "react";
import "./modal.scss";

const GauntletModeModal = ({
  isOpen,
  onClose,
  onExit,
  strikes,
  gauntletScore,
  gauntletHighScore,
}) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      if (strikes === 3) {
        onClose();
      } else {
        onExit();
      }
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${isClosing ? "closing" : ""}`}>
      <div
        className={`modal-content gauntlet-mode ${isClosing ? "closing" : ""}`}
      >
        {strikes === 3 ? (
          <div className="instructions-container">
            <h3>Welcome to Gauntlet Mode!</h3>
            <span>Guess as many players correctly in a row.</span>
            <span>All stats will be shown from the beginning.</span>
            <span>You have 3 strikes.</span>
            <span style={{ marginTop: "40px" }}>
              How many in a row can you guess correctly?
            </span>
          </div>
        ) : (
          <div className="instructions-container">
            <h3>Game Over!</h3>
            <span>You used all {3 - strikes} strikes.</span>
            <span>Your stats: </span>
            <span>Score: {gauntletScore}</span>
            <span>High Score: {gauntletHighScore}</span>
            <span>Better luck next time!</span>
          </div>
        )}
        <div className="button-container">
          <button onClick={handleClose}>
            {strikes === 3 ? "Got it, let's play!" : "Exit Gauntlet Mode"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GauntletModeModal;
