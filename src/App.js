import React, { useState, useEffect } from "react";
import playersData from "./players.json";
import { NHL } from "./leagueEnum";
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

  useEffect(() => {
    const playerNames = Object.keys(playersData);
    const randomName =
      playerNames[Math.floor(Math.random() * playerNames.length)];
    setRandomPlayer(randomName);
    console.log(randomName);
  }, []);

  const handleGuessChange = (event) => {
    setGuess(event.target.value);
  };

  const handleGuessSubmit = () => {
    if (guess.toLowerCase() === randomPlayer.toLowerCase()) {
      setMessage("Correct! You guessed the player.");
      setRevealedRow(null);
      setRevealedColumn(null);
      setCanRevealRow(false);
      setCanRevealColumn(false);
      setPrompt("");
    } else {
      setMessage("Incorrect. Try again.");
      setGuessCount((prevCount) => prevCount + 1);
      updatePrompt();
    }
  };

  const handleRowClick = (index) => {
    if (canRevealRow && revealedRow === null) {
      setRevealedRow(index);
      setCanRevealRow(false);
      setCanRevealColumn(true);
      setSelectionCount((prevCount) => prevCount + 1);
      updatePrompt();
    }
  };

  const handleColumnClick = (key) => {
    if (canRevealColumn && revealedColumn === null && key !== "Tm") {
      setRevealedColumn(key);
      setCanRevealColumn(false);
      setSelectionCount((prevCount) => prevCount + 1);
      updatePrompt();
    }
  };

  const handleTeamCellClick = (index) => {
    if (
      selectionCount >= 2 &&
      revealedTeamCells.length < 2 &&
      !revealedTeamCells.includes(index)
    ) {
      setRevealedTeamCells((prev) => {
        const newRevealedTeamCells = [...prev, index];
        return newRevealedTeamCells;
      });
      setSelectionCount((prevCount) => prevCount + 1);
      updatePrompt();
    }
  };

  const handleFifthSelection = (key) => {
    console.log("in here");
    if (selectionCount === 4 && key !== "Season" && key !== "Tm") {
      setRevealAllNonSeasonTeam(true);
      setSelectionCount((prevCount) => prevCount + 1);
      updatePrompt();
    }
  };

  const handleSixthSelection = () => {
    if (selectionCount === 5) {
      setRevealAll(true);
      setSelectionCount((prevCount) => prevCount + 1);
      updatePrompt();
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
    if (canRevealRow) return "can-hover-row";
    if (canRevealColumn) return "can-hover-column";
    if (selectionCount >= 2 && revealedTeamCells.length < 2)
      return "can-hover-team";
    if (selectionCount === 4) return "can-hover-cell";
    if (selectionCount === 5) return "can-hover-all";
    return "";
  };

  const filteredStats = Object.values(NHL).filter((stat) => stat !== "Lg");

  console.log(selectionCount);
  return (
    <div className="container">
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
      {randomPlayer && (
        <table className={getTableClassName()}>
          <thead>
            <tr>
              {filteredStats.map((key) => (
                <th
                  key={key}
                  onClick={() => canRevealColumn && handleColumnClick(key)}
                  style={{
                    cursor:
                      canRevealColumn && key !== "Tm" ? "pointer" : "default",
                  }}
                >
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {playersData[randomPlayer].Season.map((_, index) => (
              <tr
                key={index}
                onClick={() => canRevealRow && handleRowClick(index)}
              >
                {filteredStats.map((key) => (
                  <td
                    key={key}
                    data-team={key === "Tm" ? "true" : "false"}
                    onClick={() => {
                      if (
                        key === "Tm" &&
                        selectionCount >= 2 &&
                        revealedTeamCells.length < 2 &&
                        !revealedTeamCells.includes(index)
                      ) {
                        handleTeamCellClick(index);
                      }
                      if (selectionCount === 4) {
                        handleFifthSelection(key);
                      }
                      if (selectionCount === 5) {
                        handleSixthSelection();
                      }
                    }}
                    style={{
                      cursor:
                        (key === "Tm" &&
                          selectionCount >= 2 &&
                          revealedTeamCells.length < 2 &&
                          !revealedTeamCells.includes(index)) ||
                        (selectionCount === 4 &&
                          key !== "Season" &&
                          key !== "Tm") ||
                        selectionCount === 5
                          ? "pointer"
                          : "default",
                    }}
                  >
                    {revealedRow === index ||
                    revealedColumn === key ||
                    (key === "Tm" && revealedTeamCells.includes(index)) ||
                    (revealAllNonSeasonTeam &&
                      key !== "Season" &&
                      key !== "Tm") ||
                    revealAll
                      ? key === "Season"
                        ? playersData[randomPlayer][key][index].slice(2)
                        : playersData[randomPlayer][key][index]
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
