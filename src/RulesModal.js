import React from "react";
import styled from "styled-components";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  position: relative;
  background-color: #282c34;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  max-height: 90vh;
  width: 90%;
  max-width: 500px;
  min-height: 60vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  @media (min-width: 768px) {
    padding: 1rem 2rem;
    min-height: 80vh;
    max-height: 85vh;
    width: 60%;
  }

  h2 {
    text-align: left;
    font-size: 1.2rem;
    margin: 1rem 0 0rem;

    @media (min-width: 768px) {
      font-size: 1.5rem;
      margin: 1rem 0 0rem;
    }
  }

  p {
    text-align: left;
    font-size: 1rem;
    margin: 5px 0px 5px;

    @media (min-width: 768px) {
      font-size: 1.1rem;
      margin: 5px 0px 0px;
    }
  }

  ol {
    font-size: 14px;
    margin-bottom: 1rem;
    padding-left: 1.2rem;
    text-align: left;

    @media (min-width: 768px) {
      font-size: 16px;
      padding-left: 1.5rem;
    }

    li {
      margin-bottom: 0.5rem;
    }
  }
`;

const RulesModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      onClose();
    }
  };

  return (
    <ModalOverlay className="modal-overlay" onClick={handleOverlayClick}>
      <ModalContent style={{ maxWidth: "250px" }}>
        <h2>Game Rules</h2>
        <p>
          Reveal statistics to identify the mystery{" "}
          <span style={{ color: "#4a90e2" }}>big-four</span> player.
        </p>
        <p>Guess at any point in time.</p>
        <p>
          You have <span style={{ color: "#4a90e2" }}>SIX GUESSES</span>.
        </p>

        <div>
          <p>HINT ORDER:</p>
          <ol>
            <li>
              Select a <span style={{ color: "#4a90e2" }}>ROW</span>
            </li>
            <li>
              Select a non-team <span style={{ color: "#4a90e2" }}>COLUMN</span>
            </li>
            <li>
              Select two
              <span style={{ color: "#4a90e2" }}> TEAM CELLS</span>
            </li>
            <li>
              Reveal <span style={{ color: "#4a90e2" }}> ALL STATISTICS</span>
            </li>
            <li>
              Reveal{" "}
              <span style={{ color: "#4a90e2" }}> ALL REMAINING CELLS</span>
            </li>
          </ol>
        </div>
      </ModalContent>
    </ModalOverlay>
  );
};

export default RulesModal;
