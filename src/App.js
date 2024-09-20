import React, { useState, useEffect } from "react";
import playersData from "./players.json";
import { NHL, NBA, MLB, NFLQB, NFLRB, NFLWR } from "./leagueEnum";
import Modal from "./modal";
import "./styles.scss";
import GuessInput from "./GuessInput";
import logo from "./statl-logo.png"; // Import the logo

import styled from "styled-components";

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
  margin-top: 20px;
`;

const ResponsiveLogo = styled.img`
  width: 50%;
  max-width: 300px;
  height: auto;
`;

const App = () => {
  const [randomPlayer, setRandomPlayer] = useState(null);
  const [guess, setGuess] = useState("");
  const [revealedRow, setRevealedRow] = useState(null);
  const [revealedColumn, setRevealedColumn] = useState(null);
  const [canRevealRow, setCanRevealRow] = useState(true);
  const [canRevealColumn, setCanRevealColumn] = useState(false);
  const [guessCount, setGuessCount] = useState(0);
  const [revealedTeamCells, setRevealedTeamCells] = useState([]);
  const [selectionCount, setSelectionCount] = useState(0);
  const [revealAllNonSeasonTeam, setRevealAllNonSeasonTeam] = useState(false);
  const [revealAll, setRevealAll] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [hoveredColumn, setHoveredColumn] = useState(null);
  const [hintsUsed, setHintsUsed] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const [leagueEnum, setLeagueEnum] = useState(null);
  const [careerLength, setCareerLength] = useState(0);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [hoveredAllCells, setHoveredAllCells] = useState(false);
  const [hoveredSeasonTeamColumn, setHoveredSeasonTeamColumn] = useState(null);

  useEffect(() => {
    const playerNames = Object.keys(playersData);
    const randomName =
      playerNames[Math.floor(Math.random() * playerNames.length)];
    setRandomPlayer(randomName);
    setCareerLength(playersData[randomName].Lg.length);
    const playerLeague = playersData[randomName].Lg[0];
    switch (playerLeague) {
      case "NHL":
        setLeagueEnum(NHL);
        break;
      case "NBA":
        setLeagueEnum(NBA);
        break;
      case "NFL":
        if (playersData[randomName].Pos[0] === "QB") {
          setLeagueEnum(NFLQB);
        } else if (playersData[randomName].Pos[0] === "RB") {
          setLeagueEnum(NFLRB);
        } else if (playersData[randomName].Pos[0] === "WR") {
          setLeagueEnum(NFLWR);
        }
        break;
      case "MLB":
      case "NL":
      case "AL":
        setLeagueEnum(MLB);
        break;
      default:
        console.error("Unknown league:", playerLeague);
    }
  }, []);

  useEffect(() => {
    console.log(gameOver);
    if (gameOver) {
      setIsModalOpen(true);
      // If the game is over, reveal all data cells
      if (gameOver) {
        setRevealedRow(null);
        setRevealedColumn(null);
        setCanRevealRow(false);
        setCanRevealColumn(false);
        setRevealAllNonSeasonTeam(true);
        setRevealAll(true);
      }
    }
    console.log("in here");
  }, [gameOver]);

  const handleGuessSubmit = (option) => {
    const newGuessCount = guessCount + 1;
    setGuessCount(newGuessCount);
    console.log(option);
    if (option.toLowerCase() === randomPlayer.toLowerCase()) {
      setRevealedRow(null);
      setRevealedColumn(null);
      setCanRevealRow(false);
      setCanRevealColumn(false);

      setIsModalOpen(true);
      setGameOver(true);
      setGameResult("win");

      return true;
    } else {
      if (newGuessCount >= 6) {
        setIsModalOpen(true);
        setGameOver(true);
        setGameResult("lose");
      }
    }
    setShowDropdown(false);
  };
  const handleRowClick = (index) => {
    if (canRevealRow && revealedRow === null) {
      setRevealedRow(index);
      setCanRevealRow(false);
      setCanRevealColumn(true);
      setSelectionCount((prevCount) => prevCount + 1);

      setHoveredRow(null);
      setHintsUsed((prevHints) => [...prevHints, index]);
      setRevealedTeamCells([index]);
    }
  };

  const handleColumnClick = (key, index) => {
    if (canRevealColumn && revealedColumn === null && key !== "Tm") {
      setRevealedColumn(key);
      setCanRevealColumn(false);
      setSelectionCount((prevCount) => prevCount + 1);

      setHintsUsed((prevHints) => [...prevHints, index]);
    }
  };

  const handleTeamCellClick = (index) => {
    if (
      selectionCount >= 2 &&
      revealedTeamCells.length < 3 &&
      !revealedTeamCells.includes(index)
    ) {
      setRevealedTeamCells((prev) => [...prev, index]);
      setSelectionCount((prevCount) => prevCount + 1);

      setHintsUsed((prevHints) => [...prevHints, index]);
    }
  };

  const handleFifthSelection = (key) => {
    if (selectionCount === 4 && key !== "Season" && key !== "Tm") {
      setRevealAllNonSeasonTeam(true);
      setSelectionCount((prevCount) => prevCount + 1);

      setHintsUsed((prevHints) => [...prevHints, 1]);
    }
  };

  const handleSixthSelection = () => {
    if (selectionCount === 5) {
      setRevealAll(true);
      setSelectionCount((prevCount) => prevCount + 1);

      setHintsUsed((prevHints) => [...prevHints, 1]);
    }
  };

  const getTableClassName = () => {
    if (gameOver) return "";
    if (selectionCount === 0) return "can-hover-row";
    if (selectionCount === 1) return "can-hover-column";
    if (selectionCount >= 2 && revealedTeamCells.length < 3)
      return "can-hover-team";
    if (selectionCount === 4) return "can-hover-cell";
    if (selectionCount === 5) return "can-hover-all";
    return "";
  };

  const filteredStats = leagueEnum
    ? Object.values(leagueEnum).filter((stat) => stat !== "Lg")
    : [];

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  }

  return (
    <div className="container">
      {gameOver && (
        <button
          className="modal-toggle-button"
          onClick={isModalOpen ? handleCloseModal : handleOpenModal}
        >
          {isModalOpen ? "Close Results" : "Show Results"}
        </button>
      )}
      {isModalOpen && (
        <Modal
          player={randomPlayer}
          isOpen={true}
          onClose={handleCloseModal}
          stats={{
            gamesPlayed: 0,
            winPercentage: 0,
            currentStreak: 0,
            maxStreak: 0,
          }}
          hints={hintsUsed}
          gameResult={gameResult}
          guessCount={guessCount}
          leagueLength={Object.keys(leagueEnum).length}
          careerLength={careerLength}
        />
      )}
      <LogoContainer>
        <ResponsiveLogo src={logo} alt="Statl Logo" />
      </LogoContainer>
      <div className="sticky-header">
        <GuessInput
          guess={guess}
          setGuess={setGuess}
          handleGuessSubmit={handleGuessSubmit}
          disabled={gameOver}
          guessCount={guessCount}
          setGiveUp={setGameOver}
        />
      </div>
      {randomPlayer && leagueEnum && (
        <table className={getTableClassName()}>
          <thead>
            <tr>
              {filteredStats.map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {playersData[randomPlayer].Season.map((_, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={() =>
                  !gameOver && canRevealRow && handleRowClick(rowIndex)
                }
                onMouseEnter={() =>
                  !gameOver && canRevealRow && setHoveredRow(rowIndex)
                }
                onMouseLeave={() =>
                  !gameOver && canRevealRow && setHoveredRow(null)
                }
              >
                {filteredStats.map((key, colIndex) => (
                  <td
                    key={key}
                    data-team={key === "Tm" ? "true" : "false"}
                    onClick={() => {
                      if (gameOver) return;
                      if (canRevealColumn && key !== "Tm") {
                        handleColumnClick(key, colIndex);
                      } else if (
                        key === "Tm" &&
                        selectionCount >= 2 &&
                        revealedTeamCells.length < 3 &&
                        !revealedTeamCells.includes(rowIndex)
                      ) {
                        handleTeamCellClick(rowIndex);
                      } else if (selectionCount === 4) {
                        handleFifthSelection(key);
                      } else if (selectionCount === 5) {
                        handleSixthSelection();
                      }
                    }}
                    onMouseEnter={() => {
                      if (gameOver) return;
                      if (canRevealColumn && key !== "Tm") {
                        setHoveredColumn(colIndex);
                      }
                      if (selectionCount === 4) {
                        setHoveredCell({ row: rowIndex, col: key });
                      }
                      if (
                        selectionCount === 5 &&
                        (key === "Season" || key === "Tm")
                      ) {
                        setHoveredSeasonTeamColumn(true);
                      }
                    }}
                    onMouseLeave={() => {
                      if (gameOver) return;
                      if (canRevealColumn) {
                        setHoveredColumn(null);
                      }
                      if (selectionCount === 4) {
                        setHoveredCell(null);
                      }
                      if (selectionCount === 5) {
                        setHoveredSeasonTeamColumn(false);
                      }
                    }}
                    style={{
                      cursor: gameOver
                        ? "default"
                        : canRevealRow ||
                          (canRevealColumn && key !== "Tm") ||
                          (key === "Tm" &&
                            selectionCount >= 2 &&
                            revealedTeamCells.length < 3 &&
                            !revealedTeamCells.includes(rowIndex)) ||
                          (selectionCount === 4 &&
                            key !== "Season" &&
                            key !== "Tm") ||
                          selectionCount === 5
                        ? "pointer"
                        : "default",
                      backgroundColor: gameOver
                        ? "#4a4a4c"
                        : (canRevealRow && rowIndex === hoveredRow) ||
                          (canRevealColumn &&
                            colIndex === hoveredColumn &&
                            key !== "Tm") ||
                          (selectionCount === 4 &&
                            hoveredCell &&
                            key !== "Season" &&
                            key !== "Tm") ||
                          (selectionCount === 5 &&
                            (key === "Season" || key === "Tm") &&
                            hoveredSeasonTeamColumn)
                        ? "#4a90e2"
                        : revealedRow === rowIndex ||
                          revealedColumn === key ||
                          (key === "Tm" &&
                            revealedTeamCells.includes(rowIndex)) ||
                          (revealAllNonSeasonTeam &&
                            key !== "Season" &&
                            key !== "Tm") ||
                          revealAll
                        ? "#4a4a4c"
                        : selectionCount === 4 &&
                          (key === "Season" || key === "Tm")
                        ? "#1a1a1b"
                        : "",
                      color:
                        gameOver ||
                        (canRevealRow && rowIndex === hoveredRow) ||
                        (canRevealColumn &&
                          colIndex === hoveredColumn &&
                          key !== "Tm") ||
                        (selectionCount === 4 &&
                          hoveredCell &&
                          key !== "Season" &&
                          key !== "Tm") ||
                        (selectionCount === 5 && hoveredAllCells) ||
                        (selectionCount === 5 &&
                          (key === "Season" || key === "Tm") &&
                          hoveredSeasonTeamColumn) ||
                        revealedRow === rowIndex ||
                        revealedColumn === key ||
                        (key === "Tm" &&
                          revealedTeamCells.includes(rowIndex)) ||
                        (revealAllNonSeasonTeam &&
                          key !== "Season" &&
                          key !== "Tm") ||
                        revealAll
                          ? "#ffffff"
                          : "",
                      borderColor:
                        (selectionCount === 4 &&
                          key !== "Season" &&
                          key !== "Tm") ||
                        (selectionCount === 5 &&
                          (key === "Season" || key === "Tm"))
                          ? "#6e6e6e"
                          : "",
                    }}
                  >
                    {revealedRow === rowIndex ||
                    revealedColumn === key ||
                    (key === "Tm" && revealedTeamCells.includes(rowIndex)) ||
                    (revealAllNonSeasonTeam &&
                      key !== "Season" &&
                      key !== "Tm") ||
                    revealAll
                      ? key === "Season"
                        ? playersData[randomPlayer][key]
                          ? playersData[randomPlayer][key][rowIndex]
                          : "N/A"
                        : playersData[randomPlayer][key][rowIndex]
                      : ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default App;
