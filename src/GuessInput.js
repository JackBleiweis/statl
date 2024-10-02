import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes, css } from "styled-components";
import players from "./constants";
const InputContainer = styled.div`
  position: relative;
  width: 300px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  height: 100%; // Add this to make the container take full height
`;

const Input = styled.input`
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #6e6e6e;
  border-radius: 4px;
  background-color: #1a1a1b;
  color: #d7dadc;
  box-sizing: border-box;
  font-weight: bold;
  margin: 0 0; // Add this to center vertically

  ${(props) =>
    props.animate &&
    css`
      animation: ${props.isCorrect
          ? pulseAnimation("rgba(76, 175, 80, 0.7)")
          : pulseAnimation("rgba(244, 67, 54, 0.7)")}
        1s;
      border-color: ${props.isCorrect ? "#4CAF50" : "#F44336"};
    `}

  transition: border-color 0.3s ease;
`;

const GuessCounter = styled.div`
  margin-left: 10px;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #4a90e2;
  color: #ffffff;
  border-radius: 4px;
  font-weight: bold;
  min-width: 30px;
`;

const strikeChangeAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.5); }
  100% { transform: scale(1); }
`;

const AnimatedGuessCounter = styled(GuessCounter)`
  &.animate {
    animation: ${strikeChangeAnimation} 0.5s ease-in-out;
  }
`;

const ActionButton = styled.button`
  margin-left: 10px;
  min-width: ${(props) => (props.isGiveUp ? "80px" : "30px")};
  max-width: ${(props) => (props.isGiveUp ? "80px" : "30px")};
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f44336;
  color: #ffffff;
  border-radius: 4px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  padding: 0 10px;
  transition: min-width 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: calc(100% - 90px);
  border: 1px solid #6e6e6e;
  background-color: #1a1a1b;
  z-index: 1000;
  max-height: 150px;
  overflow-y: auto;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
`;

const DropdownItem = styled.div`
  padding: 12px 10px;
  cursor: pointer;
  color: #d7dadc;
  font-weight: bold;

  &:hover {
    background-color: #4a90e2;
    color: #ffffff;
  }

  &:last-child {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
`;

const scoreChangeAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.5); }
  100% { transform: scale(1); }
`;

const AnimatedScoreCounter = styled(GuessCounter)`
  &.animate {
    animation: ${scoreChangeAnimation} 0.5s ease-in-out;
  }
`;

const TooltipContainer = styled.div`
  position: absolute;
  color: #fff;
  padding: 5px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 1000;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  max-height: 135px;
  overflow-y: auto;
  scrollbar-width: none;
`;

const pulseAnimation = (color) => keyframes`
  0% { box-shadow: 0 0 0 0 ${color}; }
  70% { box-shadow: 0 0 0 10px rgba(255, 255, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
`;

const GuessInput = ({
  guess,
  setGuess,
  handleGuessSubmit,
  disabled,
  guessCount,
  setGiveUp,
  gauntletMode,
  strikesLeft,
  gauntletScore,
  setGauntletScore, // Add this prop
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isGiveUp, setIsGiveUp] = useState(false);
  const options = players;
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const actionButtonRef = useRef(null);
  const [animateStrike, setAnimateStrike] = useState(false);
  const [animateScore, setAnimateScore] = useState(false);
  const [correctGuesses, setCorrectGuesses] = useState([]);
  const [showTooltip, setShowTooltip] = useState(false);
  const [animateGuessCount, setAnimateGuessCount] = useState(false);
  const [inputAnimation, setInputAnimation] = useState({
    animate: false,
    isCorrect: false,
  });

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleGuessSubmit(guess);
    } else if (e.key === "Escape" && showDropdown) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }

      if (
        isGiveUp &&
        actionButtonRef.current &&
        !actionButtonRef.current.contains(event.target)
      ) {
        setIsGiveUp(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isGiveUp]);

  useEffect(() => {
    setGuess("");
    setShowDropdown(false);
    setCorrectGuesses([]); // Reset correctGuesses when gauntletMode changes
  }, [gauntletMode, setGuess]);

  useEffect(() => {
    if (strikesLeft !== undefined) {
      setAnimateStrike(true);
      const timer = setTimeout(() => setAnimateStrike(false), 500);
      return () => clearTimeout(timer);
    }
  }, [strikesLeft]);

  useEffect(() => {
    if (gauntletScore > 0) {
      setAnimateScore(true);
      const timer = setTimeout(() => setAnimateScore(false), 500);
      return () => clearTimeout(timer);
    }
  }, [gauntletScore]);

  useEffect(() => {
    if (guessCount > 0) {
      setAnimateGuessCount(true);
      const timer = setTimeout(() => setAnimateGuessCount(false), 500);
      return () => clearTimeout(timer);
    }
  }, [guessCount]);

  const handleGuessChange = (e) => {
    const newGuess = e.target.value;
    setGuess(newGuess);
    setShowDropdown(newGuess.length > 0);
  };

  const handleOptionClick = (e) => {
    const selectedPlayer = e.target.textContent;
    const isCorrect = handleGuessSubmit(selectedPlayer);

    setInputAnimation({ animate: true, isCorrect });
    setTimeout(
      () => setInputAnimation({ animate: false, isCorrect: false }),
      1000
    );

    if (isCorrect) {
      setCorrectGuesses((prevGuesses) => [selectedPlayer, ...prevGuesses]);
      setGuess("");
    } else {
      setGuess(""); // Reset the guess when the guess is incorrect
    }

    setShowDropdown(false);
  };

  const handleActionClick = () => {
    if (isGiveUp) {
      // Handle give up action
      setGiveUp(true);
    } else {
      setGuess("");
      setShowDropdown(false);
    }
    setIsGiveUp(!isGiveUp);
  };

  return (
    <InputContainer>
      <Input
        ref={inputRef}
        disabled={disabled}
        type="text"
        value={guess || ""}
        onChange={handleGuessChange}
        onFocus={() => setShowDropdown(true)}
        placeholder="Enter player name"
        onKeyDown={handleKeyDown}
        animate={inputAnimation.animate}
        isCorrect={inputAnimation.isCorrect}
      />

      {!gauntletMode ? (
        <>
          <AnimatedGuessCounter className={animateGuessCount ? "animate" : ""}>
            {6 - guessCount}
          </AnimatedGuessCounter>
          <ActionButton
            ref={actionButtonRef}
            isGiveUp={isGiveUp}
            onClick={handleActionClick}
            disabled={disabled}
          >
            {isGiveUp ? "Give Up" : "X"}
          </ActionButton>
        </>
      ) : (
        <>
          <AnimatedScoreCounter
            className={animateScore ? "animate" : ""}
            style={{
              color: "#ffffff",
              width: "30px",
              height: "30px",
              backgroundColor: "#4CAF50",
              position: "relative",
            }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            {gauntletScore}
            {showTooltip && correctGuesses.length > 50 && (
              <TooltipContainer
                style={{
                  maxHeight: "100px",
                  backgroundColor: "black",
                  border: "5px solid #6e6e6e",
                  borderRadius: "8px",
                  padding: "10px",
                  overflow: "auto",
                }}
              >
                <ul
                  style={{
                    padding: 0,
                    margin: 0,
                    listStyleType: "none",
                  }}
                >
                  {correctGuesses.map((guess, index) => (
                    <li key={index}>{guess}</li>
                  ))}
                </ul>
              </TooltipContainer>
            )}
          </AnimatedScoreCounter>
          <AnimatedGuessCounter
            className={animateStrike ? "animate" : ""}
            style={{ backgroundColor: "#F44336" }}
          >
            {strikesLeft}
          </AnimatedGuessCounter>
        </>
      )}

      {showDropdown && (
        <Dropdown ref={dropdownRef}>
          {options
            .filter((option) =>
              option.toLowerCase().includes(guess.toLowerCase())
            )
            .sort((a, b) => a.localeCompare(b))
            .map((option, index) => (
              <DropdownItem key={index} onClick={handleOptionClick}>
                {option}
              </DropdownItem>
            ))}
        </Dropdown>
      )}
    </InputContainer>
  );
};

export default GuessInput;
