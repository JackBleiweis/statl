import React, { useState } from "react";
import "./modal.scss";

const GauntletModeModal = ({ isOpen, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${isClosing ? "closing" : ""}`}>
      <div
        className={`modal-content gauntlet-mode ${isClosing ? "closing" : ""}`}
      >
        <div className="instructions-container">
          <h3>Welcome to Gauntlet Mode! </h3>
          <span>Guess as many players correctly in a row.</span>
          <span>All stats will be shown from the beginning.</span>
          <span>You have 3 strikes.</span>
          <span style={{ marginTop: "40px" }}>
            How many in a row can you guess correctly?
          </span>
        </div>
        <div className="button-container">
          <button onClick={handleClose}>Got it, let's play!</button>
        </div>
      </div>
    </div>
  );
};

export default GauntletModeModal;
