import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import playersData from "./players.json";

const InputContainer = styled.div`
  position: relative;
  width: 300px;
  margin: 0 auto;
  display: flex;
  align-items: center;
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

  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
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

const ActionButton = styled.button`
  margin-left: 10px;
  min-width: ${(props) => (props.isGiveUp ? "80px" : "30px")};
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

const GuessInput = ({
  guess,
  setGuess,
  handleGuessSubmit,
  disabled,
  guessCount,
  setGiveUp,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isGiveUp, setIsGiveUp] = useState(false);
  const options = Object.keys(playersData);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const actionButtonRef = useRef(null);

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

  const handleGuessChange = (e) => {
    setGuess(e.target.value);
    setShowDropdown(e.target.value.length > 0);
  };

  const handleOptionClick = (e) => {
    console.log("this", e.target);
    const isCorrect = handleGuessSubmit(e.target.textContent);
    if (isCorrect) {
      e.target.style.backgroundColor = "#4CAF50";
      e.target.style.color = "#ffffff";
    } else {
      e.target.style.backgroundColor = "#F44336";
      e.target.style.color = "#ffffff";
    }
    setTimeout(() => setShowDropdown(false), 500);
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
        value={guess}
        onChange={handleGuessChange}
        onFocus={() => setShowDropdown(true)}
        placeholder="Enter player name"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleGuessSubmit(guess);
          }
        }}
      />
      <GuessCounter>{6 - guessCount}</GuessCounter>
      <ActionButton
        ref={actionButtonRef}
        isGiveUp={isGiveUp}
        onClick={handleActionClick}
        disabled={disabled}
      >
        {isGiveUp ? "Give Up" : "X"}
      </ActionButton>
      {showDropdown && (
        <Dropdown ref={dropdownRef}>
          {options
            .filter((option) =>
              option.toLowerCase().includes(guess.toLowerCase())
            )
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
