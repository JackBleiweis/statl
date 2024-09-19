import React, { useState, useEffect } from "react";
import playersData from "./players.json";
import { NHL, NBA, NFL, MLB } from "./leagueEnum";
import Modal from "./modal";
import "./styles.scss";

const App = () => {
  const [randomPlayer, setRandomPlayer] = useState(null);
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("");
  const [revealedRow, setRevealedRow] = useState(null);
  const [revealedColumn, setRevealedColumn] = useState(null);
  const [canRevealRow, setCanRevealRow] = useState(true);
  const [canRevealColumn, setCanRevealColumn] = useState(false);
  const [guessCount, setGuessCount] = useState(0);
  const [revealedTeamCells, setRevealedTeamCells] = useState([]);
  const [selectionCount, setSelectionCount] = useState(0);
  const [prompt, setPrompt] = useState(
    "Make a guess or reveal a row about the mystery player."
  );
  const [revealAllNonSeasonTeam, setRevealAllNonSeasonTeam] = useState(false);
  const [revealAll, setRevealAll] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [hoveredColumn, setHoveredColumn] = useState(null);
  const [hintsUsed, setHintsUsed] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    console.log(randomName);
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
        setLeagueEnum(NFL);
        break;
      case "MLB":
        setLeagueEnum(MLB);
        break;
      default:
        console.error("Unknown league:", playerLeague);
    }
  }, []);

  const handleGuessChange = (event) => {
    setGuess(event.target.value);
  };

  const handleGuessSubmit = () => {
    const newGuessCount = guessCount + 1;
    setGuessCount(newGuessCount);

    if (guess.toLowerCase() === randomPlayer.toLowerCase()) {
      setMessage("Correct! You guessed the player.");
      setRevealedRow(null);
      setRevealedColumn(null);
      setCanRevealRow(false);
      setCanRevealColumn(false);
      setPrompt("");
      setIsModalOpen(true);
      setGameOver(true);
      setGameResult("win");
    } else {
      setMessage("Incorrect. Try again.");
      updatePrompt();

      if (newGuessCount >= 6) {
        setIsModalOpen(true);
        setGameOver(true);
        setGameResult("lose");
      }
    }
  };

  const handleRowClick = (index) => {
    if (canRevealRow && revealedRow === null) {
      setRevealedRow(index);
      setCanRevealRow(false);
      setCanRevealColumn(true);
      setSelectionCount((prevCount) => prevCount + 1);
      updatePrompt();
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
      updatePrompt();
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
      updatePrompt();
      setHintsUsed((prevHints) => [...prevHints, index]);
    }
  };

  const handleFifthSelection = (key) => {
    if (selectionCount === 4 && key !== "Season" && key !== "Tm") {
      setRevealAllNonSeasonTeam(true);
      setSelectionCount((prevCount) => prevCount + 1);
      updatePrompt();
      setHintsUsed((prevHints) => [...prevHints, 1]);
    }
  };

  const handleSixthSelection = () => {
    if (selectionCount === 5) {
      setRevealAll(true);
      setSelectionCount((prevCount) => prevCount + 1);
      updatePrompt();
      setHintsUsed((prevHints) => [...prevHints, 1]);
    }
  };

  const updatePrompt = () => {
    const availableActions = [];
    if (selectionCount === 0) {
      availableActions.push("reveal a row");
    } else if (selectionCount === 1) {
      availableActions.push("reveal a column (except team)");
    } else if (selectionCount === 2 || selectionCount === 3) {
      availableActions.push("reveal a team cell");
    } else if (selectionCount === 4) {
      availableActions.push("reveal any cell (except season and team)");
    } else if (selectionCount === 5) {
      availableActions.push("reveal any remaining cell");
    }
    availableActions.push("make a guess");

    if (availableActions.length > 1) {
      const lastAction = availableActions.pop();
      setPrompt(`You can ${availableActions.join(", ")} or ${lastAction}.`);
    } else {
      setPrompt(`You can ${availableActions[0]}.`);
    }
  };

  const getTableClassName = () => {
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
      <h1>Guess the Player</h1>
      <div className="sticky-header">
        <h3>Guesses: {guessCount}</h3>
        <div className="input-container">
          <input
            type="text"
            value={guess}
            onChange={handleGuessChange}
            placeholder="Enter player name"
            list="players"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleGuessSubmit();
              }
            }}
          />
          <datalist id="players">
            {Object.keys(playersData)
              .filter((player) =>
                player.toLowerCase().includes(guess.toLowerCase())
              )
              .map((player) => (
                <option key={player} value={player} />
              ))}
          </datalist>
          <button onClick={handleGuessSubmit}>Submit Guess</button>
        </div>
        {message && <p>{message}</p>}
        {prompt && <h2>{prompt}</h2>}
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
                onClick={() => canRevealRow && handleRowClick(rowIndex)}
                onMouseEnter={() => canRevealRow && setHoveredRow(rowIndex)}
                onMouseLeave={() => canRevealRow && setHoveredRow(null)}
              >
                {filteredStats.map((key, colIndex) => (
                  <td
                    key={key}
                    data-team={key === "Tm" ? "true" : "false"}
                    onClick={() => {
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
                      cursor:
                        canRevealRow ||
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
                      backgroundColor:
                        (canRevealRow && rowIndex === hoveredRow) ||
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
                        ? playersData[randomPlayer][key][rowIndex].slice(2)
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
