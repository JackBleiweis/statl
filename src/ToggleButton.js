import React from "react";
import styled from "styled-components";

const ToggleWrapper = styled.label`
  position: relative;
  display: inline-block;
  width: 40px; // Changed from 60px to 40px
  height: 20px; // Changed from 34px to 20px
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: #4a90e2;
  }

  &:checked + span:before {
    transform: translateX(20px); // Changed from 26px to 20px
  }
`;

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 20px; // Changed from 34px to 20px

  &:before {
    position: absolute;
    content: "";
    height: 16px; // Changed from 26px to 16px
    width: 16px; // Changed from 26px to 16px
    left: 2px; // Changed from 4px to 2px
    bottom: 2px; // Changed from 4px to 2px
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }
`;

const ToggleButton = ({ onClick, active }) => {
  return (
    <ToggleWrapper>
      <ToggleInput type="checkbox" checked={active} onClick={onClick} />
      <Slider />
    </ToggleWrapper>
  );
};

export default ToggleButton;
