import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  background-color: #4a90e2;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  width: 100px; // Set a fixed width
  height: 40px; // Set a fixed height

  // Media query for mobile devices
  @media (max-width: 768px) {
    font-size: 14px; // Slightly smaller font size on mobile
    padding: 8px 16px; // Slightly smaller padding on mobile
    bottom: 10px; // Adjust bottom position
    right: 10px; // Adjust right position
  }

  &:hover {
    background-color: #357abd;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const SkipButton = ({
  strikes,
  generateNewGauntletPlayer,
  usedSkip,
  setUsedSkip,
}) => {
  const handleSkip = () => {
    if (
      window.confirm(
        "Are you sure you want to skip this player? You can only do this once per game."
      )
    ) {
      generateNewGauntletPlayer();
      setUsedSkip(true);
    }
  };

  return (
    <StyledButton onClick={handleSkip} disabled={usedSkip || strikes === 0}>
      Skip
    </StyledButton>
  );
};

export default SkipButton;
