import React, { useState, useEffect } from "react";
import playersData from "./players.json";
import { NHL, NBA, MLB, NFLQB, NFLRB, NFLWR, NFLD } from "./leagueEnum";
import Modal from "./modal";
import "./styles.scss";
import GuessInput from "./GuessInput";
import logo from "./statl-logo.png"; // Import the logo
import SkipButton from "./skipButton";

import { FaInfoCircle } from "react-icons/fa";
import { FaMedal } from "react-icons/fa";

import styled from "styled-components";
import RulesModal from "./RulesModal";
import GauntletModeModal from "./gauntletModeModal";
import ToggleButton from "./ToggleButton";

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
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

const GauntletModeText = styled.div`
  color: #4a90e2;
  font-size: 1.2rem;
  font-weight: bold;
`;

const ButtonContainer = styled.div`
  position: fixed;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 10px;
  z-index: 1000;
  background: transparent;

  @media (max-width: 700px) {
    top: 10px;
    right: 10px;
    gap: 5px;
  }
`;

const StyledButton = styled.button`
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  background: transparent;

  svg {
    width: 30px;
    height: 30px;
    fill: white;
  }
  &:hover {
    background-color: #4a90e2;
  }

  @media (max-width: 700px) {
    padding: 4px 6px;

    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const LogoButton = styled(StyledButton)`
  height: 100%;
  width: 100%;

  img {
    height: 30px;
    width: 30px;
  }
  &:hover {
    background-color: #4a90e2;
  }

  @media (max-width: 700px) {
    img {
      height: 20px;
      width: 20px;
    }
  }
`;

const ToggleContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const App = () => {
  //Player and game states
  const [randomPlayer, setRandomPlayer] = useState(null);
  const [leagueEnum, setLeagueEnum] = useState(null);
  const [careerLength, setCareerLength] = useState(0);
  const [guess, setGuess] = useState("");
  const [guessCount, setGuessCount] = useState(0);
  const [selectionCount, setSelectionCount] = useState(0);
  const [hintsUsed, setHintsUsed] = useState([]);

  //Reveal states
  const [revealedRow, setRevealedRow] = useState(null);
  const [revealedColumn, setRevealedColumn] = useState(null);
  const [canRevealRow, setCanRevealRow] = useState(true);
  const [canRevealColumn, setCanRevealColumn] = useState(false);
  const [revealedTeamCells, setRevealedTeamCells] = useState([]);
  const [revealAllNonSeasonTeam, setRevealAllNonSeasonTeam] = useState(false);
  const [revealAll, setRevealAll] = useState(false);

  //Hover states
  const [hoveredRow, setHoveredRow] = useState(null);
  const [hoveredColumn, setHoveredColumn] = useState(null);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [hoveredSeasonTeamColumn, setHoveredSeasonTeamColumn] = useState(null);

  //Game states and modal states
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);

  //Gauntlet Mode states
  const [gauntletMode, setGauntletMode] = useState(false);
  const [strikes, setStrikes] = useState(3);
  const [gauntletScore, setGauntletScore] = useState(0);
  const [isGauntletModalOpen, setIsGauntletModalOpen] = useState(false);
  const [gauntletPlayer, setGauntletPlayer] = useState(null);
  const [gauntletLeagueEnum, setGauntletLeagueEnum] = useState(null);
  const [gauntletHighScore, setGauntletHighScore] = useState(0);
  const [usedGauntletPlayers, setUsedGauntletPlayers] = useState([]);
  const [selectedLeagues, setSelectedLeagues] = useState({
    NFL: true,
    NBA: true,
    MLB: true,
    NHL: true,
  });
  const [usedSkip, setUsedSkip] = useState(false);

  // Add new state variables for daily mode
  const [dailyModeState, setDailyModeState] = useState({
    gameOver: false,
    gameResult: "",
    guessCount: 0,
    revealedRow: null,
    revealedColumn: null,
    canRevealRow: true,
    canRevealColumn: false,
    revealedTeamCells: [],
    selectionCount: 0,
    revealAllNonSeasonTeam: false,
    revealAll: false,
    hintsUsed: [],
  });

  // Sets all the information for the daily game
  useEffect(() => {
    const playerNames = Object.keys(playersData);
    const torontoTime = new Date().toLocaleString("en-US", {
      timeZone: "America/Toronto",
    });
    const today = new Date(torontoTime);

    const utcDate = Date.UTC(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const dateIndex =
      Math.floor(utcDate / (24 * 60 * 60 * 1000)) % playerNames.length;
    const randomName = playerNames[dateIndex];

    setRandomPlayer(randomName);
    setCareerLength(playersData[randomName].Tm.length);
    const playerLeague = playersData[randomName].Lg
      ? playersData[randomName].Lg[0]
      : "NFL";

    switch (playerLeague) {
      case "NHL":
        setLeagueEnum(NHL);
        break;
      case "NBA":
        setLeagueEnum(NBA);
        break;
      case "MLB":
      case "NL":
      case "AL":
        setLeagueEnum(MLB);
        break;
      default:
        if (playersData[randomName].Pos[0] === "QB") {
          setLeagueEnum(NFLQB);
        } else if (playersData[randomName].Pos[0] === "RB") {
          setLeagueEnum(NFLRB);
        } else if (playersData[randomName].Pos[0] === "WR") {
          setLeagueEnum(NFLWR);
        } else {
          setLeagueEnum(NFLD);
        }
        break;
    }

    // Check if the game was already played today
    const lastPlayedOn = localStorage.getItem("lastPlayedDate");
    const todaysDate = today.toISOString().split("T")[0];

    if (lastPlayedOn === todaysDate) {
      setGameOver(true);
      // Read hints from localStorage
      const storedHints = localStorage.getItem("hintsUsed");
      if (storedHints) {
        setHintsUsed(JSON.parse(storedHints));
      }
    }
  }, []);

  // Opens the modal when the game is over
  useEffect(() => {
    if (gameOver) {
      setIsModalOpen(true);
      // If the game is over, reveal all data cells
      setRevealedRow(null);
      setRevealedColumn(null);
      setCanRevealRow(false);
      setCanRevealColumn(false);
      setRevealAllNonSeasonTeam(true);
      setRevealAll(true);

      // Update localStorage
      const currentStreak = localStorage.getItem("currentStreak")
        ? parseInt(localStorage.getItem("currentStreak"))
        : 0;
      const maxStreak = localStorage.getItem("maxStreak")
        ? parseInt(localStorage.getItem("maxStreak"))
        : 0;
      const gamesPlayed = localStorage.getItem("statl_gamesPlayed")
        ? parseInt(localStorage.getItem("statl_gamesPlayed"))
        : 0;
      const lastPlayedDate = localStorage.getItem("lastPlayedDate");
      const today = new Date().toISOString().split("T")[0];

      // Only increment games played if it's a new day
      if (lastPlayedDate !== today) {
        localStorage.setItem("statl_gamesPlayed", (gamesPlayed + 1).toString());
        localStorage.setItem("lastPlayedDate", today);
      }

      //Add to streak or reset it if the game is lost
      if (gameResult === "win") {
        const newCurrentStreak = currentStreak + 1;
        localStorage.setItem("currentStreak", newCurrentStreak.toString());
        if (newCurrentStreak > maxStreak) {
          localStorage.setItem("maxStreak", newCurrentStreak.toString());
        }
      } else {
        localStorage.setItem("currentStreak", "0");
      }

      // Update localStorage with hints
      localStorage.setItem("hintsUsed", JSON.stringify(hintsUsed));
    }
  }, [gameOver, gameResult, hintsUsed]);

  // Add a new useEffect hook to load the high score from localStorage
  useEffect(() => {
    const storedHighScore = localStorage.getItem("gauntletHighScore");
    if (storedHighScore) {
      setGauntletHighScore(parseInt(storedHighScore, 10));
    }
  }, []);

  useEffect(() => {
    if (gameOver) {
      setIsRulesModalOpen(false);
    } else {
      setIsRulesModalOpen(true);
    }
  }, [gameOver]);

  // Modify toggleGauntletMode function
  const toggleGauntletMode = () => {
    if (!gauntletMode) {
      // Entering Gauntlet Mode
      setIsGauntletModalOpen(true);
      setGauntletMode(true);
      setStrikes(3);
      setGauntletScore(0);
      setUsedSkip(false);

      // Save current daily mode state
      setDailyModeState({
        gameOver,
        gameResult,
        guessCount,
        revealedRow,
        revealedColumn,
        canRevealRow,
        canRevealColumn,
        revealedTeamCells,
        selectionCount,
        revealAllNonSeasonTeam,
        revealAll,
        hintsUsed,
      });

      resetGauntletState();
      generateNewGauntletPlayer();
    } else {
      // Exiting Gauntlet Mode
      setGauntletMode(false);
      // Reset Gauntlet-specific states
      setGauntletPlayer(null);
      setGauntletLeagueEnum(null);

      setStrikes(3);
      setGauntletScore(0);

      // Restore daily mode state
      // setGameOver(dailyModeState.gameOver);
      setGameResult(dailyModeState.gameResult);
      setGuessCount(dailyModeState.guessCount);
      setRevealedRow(dailyModeState.revealedRow);
      setRevealedColumn(dailyModeState.revealedColumn);
      setCanRevealRow(dailyModeState.canRevealRow);
      setCanRevealColumn(dailyModeState.canRevealColumn);
      setRevealedTeamCells(dailyModeState.revealedTeamCells);
      setSelectionCount(dailyModeState.selectionCount);
      setRevealAllNonSeasonTeam(dailyModeState.revealAllNonSeasonTeam);
      setRevealAll(dailyModeState.revealAll);
      setHintsUsed(dailyModeState.hintsUsed);
    }
    setIsModalOpen(false);
  };

  // New function to reset Gauntlet-specific state
  const resetGauntletState = () => {
    setGuessCount(0);
    setGameResult("");
    setRevealedRow(null);
    setRevealedColumn(null);
    setCanRevealRow(true);
    setCanRevealColumn(false);
    setRevealedTeamCells([]);
    setSelectionCount(0);
    setRevealAllNonSeasonTeam(false);
    setRevealAll(false);
    setIsModalOpen(false);
  };

  // Modify generateNewPlayer to be Gauntlet-specific
  const generateNewGauntletPlayer = () => {
    const playerNames = Object.keys(playersData);
    let availablePlayers = [];

    // Filter available players based on selected leagues
    availablePlayers = playerNames.filter((name) => {
      const playerLeague = playersData[name].Lg
        ? playersData[name].Lg[0]
        : "NFL";
      const isLeagueSelected =
        (playerLeague === "NHL" && selectedLeagues.NHL) ||
        (playerLeague === "NBA" && selectedLeagues.NBA) ||
        ((playerLeague === "MLB" ||
          playerLeague === "NL" ||
          playerLeague === "AL") &&
          selectedLeagues.MLB) ||
        (playerLeague === "NFL" && selectedLeagues.NFL);
      return isLeagueSelected && !usedGauntletPlayers.includes(name);
    });

    //If no more elligble players for the gauntlet
    if (availablePlayers.length === 0) {
      setUsedGauntletPlayers([]);
      alert("No more players available from the selected leagues.");
      // end the gauntlet game
      setIsGauntletModalOpen(true);
    }

    //Select a random player from the available players
    const randomName =
      availablePlayers[Math.floor(Math.random() * availablePlayers.length)];

    setGauntletPlayer(randomName);

    const newLeagueEnum = determineLeagueEnum(playersData[randomName]);
    setGauntletLeagueEnum(newLeagueEnum);
    resetGauntletState();

    // Add the new player to the list of used players
    setUsedGauntletPlayers((prevUsedPlayers) => [
      ...prevUsedPlayers,
      randomName,
    ]);
  };

  //Ensures the gauntlet player is in a selected league
  useEffect(() => {
    generateNewGauntletPlayer();
  }, [selectedLeagues]);

  //Determines the league of the player
  const determineLeagueEnum = (player) => {
    const playerLeague = player.Lg ? player.Lg[0] : "NFL";
    switch (playerLeague) {
      case "NHL":
        return NHL;
      case "NBA":
        return NBA;

      case "MLB":
      case "NL":
      case "AL":
        return MLB;
      default:
        if (player.Pos[0] === "QB") return NFLQB;
        if (player.Pos[0] === "RB") return NFLRB;
        if (player.Pos[0] === "WR") return NFLWR;
        return NFLD;
    }
  };

  // Modify handleGuessSubmit to use the correct player based on mode
  const handleGuessSubmit = (option) => {
    const currentPlayer = gauntletMode ? gauntletPlayer : randomPlayer;
    if (gauntletMode) {
      if (option.toLowerCase() === currentPlayer.toLowerCase()) {
        setGauntletScore((prevScore) => prevScore + 1);
        generateNewGauntletPlayer();
        return true;
      } else {
        setStrikes((prevStrikes) => {
          const newStrikes = prevStrikes - 1;
          if (newStrikes === 0) {
            setGameResult("lose");
            setIsGauntletModalOpen(true);
            // Check if the current score is higher than the high score
            if (gauntletScore > gauntletHighScore) {
              setGauntletHighScore(gauntletScore);
              localStorage.setItem(
                "gauntletHighScore",
                gauntletScore.toString()
              );
            }
          } else {
            generateNewGauntletPlayer();
          }
          return newStrikes;
        });
      }
    } else {
      const newGuessCount = guessCount + 1;
      setGuessCount(newGuessCount);
      if (option.toLowerCase() === randomPlayer.toLowerCase()) {
        setRevealedRow(null);
        setRevealedColumn(null);
        setCanRevealRow(false);
        setCanRevealColumn(false);

        setIsModalOpen(true);
        setGameOver(true);
        setGameResult("win");

        // Update localStorage for successful completion
        const currentStreak = localStorage.getItem("currentStreak")
          ? parseInt(localStorage.getItem("currentStreak"))
          : 0;
        const maxStreak = localStorage.getItem("maxStreak")
          ? parseInt(localStorage.getItem("maxStreak"))
          : 0;

        const newCurrentStreak = currentStreak + 1;
        localStorage.setItem("currentStreak", newCurrentStreak.toString());
        if (newCurrentStreak > maxStreak) {
          localStorage.setItem("maxStreak", newCurrentStreak.toString());
        }

        // Update dailyModeState
        setDailyModeState((prevState) => ({
          ...prevState,
          gameOver: true,
          gameResult: "win",
          guessCount: newGuessCount,
          revealedRow: null,
          revealedColumn: null,
          canRevealRow: false,
          canRevealColumn: false,
          revealedTeamCells: [],
          selectionCount: 0,
          revealAllNonSeasonTeam: true,
          revealAll: true,
          hintsUsed: hintsUsed,
        }));

        return true;
      } else {
        if (newGuessCount >= 6) {
          setIsModalOpen(true);
          setGameOver(true);
          setGameResult("lose");

          // Update localStorage for unsuccessful completion
          localStorage.setItem("currentStreak", "0");

          // Update dailyModeState
          setDailyModeState((prevState) => ({
            ...prevState,
            gameOver: true,
            gameResult: "lose",
            guessCount: newGuessCount,
            revealedRow: null,
            revealedColumn: null,
            canRevealRow: false,
            canRevealColumn: false,
            revealedTeamCells: [],
            selectionCount: 0,
            revealAllNonSeasonTeam: true,
            revealAll: true,
            hintsUsed: hintsUsed,
          }));
        }
      }
    }
  };

  // TODO: Clean up for clarity, can use HINT ORDER
  const handleRowClick = (index) => {
    if (canRevealRow && revealedRow === null) {
      setRevealedRow(index);
      setCanRevealRow(false);
      setCanRevealColumn(true);
      setSelectionCount((prevCount) => prevCount + 1);

      setHoveredRow(null);
      setHintsUsed((prevHints) => [...prevHints, index]);
      setRevealedTeamCells([index]);

      // Update dailyModeState
      setDailyModeState((prevState) => ({
        ...prevState,
        revealedRow: index,
        canRevealRow: false,
        canRevealColumn: true,
        selectionCount: prevState.selectionCount + 1,
        hintsUsed: [...prevState.hintsUsed, index],
        revealedTeamCells: [index],
      }));
    }
  };

  const handleColumnClick = (key, index) => {
    if (canRevealColumn && revealedColumn === null && key !== "Tm") {
      setRevealedColumn(key);
      setCanRevealColumn(false);
      setSelectionCount((prevCount) => prevCount + 1);

      setHintsUsed((prevHints) => [...prevHints, index]);

      // Update dailyModeState
      setDailyModeState((prevState) => ({
        ...prevState,
        revealedColumn: key,
        canRevealColumn: false,
        selectionCount: prevState.selectionCount + 1,
        hintsUsed: [...prevState.hintsUsed, index],
      }));
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

      // Update dailyModeState
      setDailyModeState((prevState) => ({
        ...prevState,
        revealedTeamCells: [...prevState.revealedTeamCells, index],
        selectionCount: prevState.selectionCount + 1,
        hintsUsed: [...prevState.hintsUsed, index],
      }));
    }
  };

  const handleFifthSelection = (key) => {
    if (selectionCount === 4 && key !== "Season" && key !== "Tm") {
      setRevealAllNonSeasonTeam(true);
      setSelectionCount((prevCount) => prevCount + 1);

      setHintsUsed((prevHints) => [...prevHints, 1]);

      // Update dailyModeState
      setDailyModeState((prevState) => ({
        ...prevState,
        revealAllNonSeasonTeam: true,
        selectionCount: prevState.selectionCount + 1,
        hintsUsed: [...prevState.hintsUsed, 1],
      }));
    }
  };

  const handleSixthSelection = () => {
    if (selectionCount === 5) {
      setRevealAll(true);
      setSelectionCount((prevCount) => prevCount + 1);

      setHintsUsed((prevHints) => [...prevHints, 1]);

      // Update dailyModeState
      setDailyModeState((prevState) => ({
        ...prevState,
        revealAll: true,
        selectionCount: prevState.selectionCount + 1,
        hintsUsed: [...prevState.hintsUsed, 1],
      }));
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

  // TODO: Replace
  const filteredStats = (gauntletMode ? gauntletLeagueEnum : leagueEnum)
    ? Object.values(gauntletMode ? gauntletLeagueEnum : leagueEnum).filter(
        (stat) => stat !== "Lg"
      )
    : [];

  // TODO: Fix YDS issue w/ NFL (AI issue, switch to script)
  // Add this function to replace 'TRB' with 'REB' and handle 'Yds' correctly
  const getDisplayHeader = (key) => {
    if (key === "TRB") return "REB";
    return key;
  };

  // TODO: Consolodate?
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleOpenRulesModal = () => {
    setIsRulesModalOpen(true);
  };

  // Add this function to close the Gauntlet Mode modal
  const closeGauntletModal = () => {
    setIsGauntletModalOpen(false);
  };

  return (
    <div className="container" style={{ marginBottom: "100px" }}>
      <ButtonContainer>
        {!gauntletMode && (
          <LogoButton
            onClick={
              gameOver
                ? handleOpenModal
                : () => alert("Stats can be viewed once the game is over")
            }
          >
            <FaMedal />
          </LogoButton>
        )}
        <StyledButton
          onClick={
            !gauntletMode
              ? handleOpenRulesModal
              : () => setIsGauntletModalOpen(true)
          }
        >
          <FaInfoCircle />
        </StyledButton>
      </ButtonContainer>

      {isRulesModalOpen && !gauntletMode && (
        <RulesModal
          isOpen={isRulesModalOpen}
          onClose={() => setIsRulesModalOpen(false)}
        />
      )}
      {isModalOpen && !gauntletMode && (
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
        <ToggleContainer>
          <GauntletModeText>Gauntlet Mode</GauntletModeText>
          <ToggleButton onClick={toggleGauntletMode} active={gauntletMode}>
            {gauntletMode ? "Exit" : "Enter"} Gauntlet
          </ToggleButton>
        </ToggleContainer>
      </LogoContainer>

      <div className="sticky-header">
        <GuessInput
          guess={guess}
          setGuess={setGuess}
          handleGuessSubmit={handleGuessSubmit}
          disabled={gameOver && !gauntletMode}
          guessCount={guessCount}
          setGiveUp={setGameOver}
          gauntletMode={gauntletMode}
          strikesLeft={strikes}
          gauntletScore={gauntletScore}
        />
      </div>
      {(gauntletMode ? gauntletPlayer : randomPlayer) &&
        (gauntletMode ? gauntletLeagueEnum : leagueEnum) &&
        playersData[gauntletMode ? gauntletPlayer : randomPlayer] &&
        playersData[gauntletMode ? gauntletPlayer : randomPlayer].Season && (
          <table className={getTableClassName()}>
            <thead>
              <tr>
                {filteredStats.map((key) => (
                  <th key={key}>{getDisplayHeader(key)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {playersData[
                gauntletMode ? gauntletPlayer : randomPlayer
              ].Season.map((_, rowIndex) => (
                <tr
                  key={rowIndex}
                  onClick={() =>
                    !gameOver &&
                    canRevealRow &&
                    !gauntletMode &&
                    handleRowClick(rowIndex)
                  }
                  onMouseEnter={() =>
                    !gameOver &&
                    canRevealRow &&
                    !gauntletMode &&
                    setHoveredRow(rowIndex)
                  }
                  onMouseLeave={() =>
                    !gameOver &&
                    canRevealRow &&
                    !gauntletMode &&
                    setHoveredRow(null)
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
                        backgroundColor: gauntletMode
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
                          gauntletMode ||
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
                      data-tooltip={
                        key === "Tm" &&
                        playersData[
                          gauntletMode ? gauntletPlayer : randomPlayer
                        ][key][rowIndex] === "TOT"
                          ? "Played on multiple teams in a season"
                          : undefined
                      }
                    >
                      {gauntletMode ||
                      revealedRow === rowIndex ||
                      revealedColumn === key ||
                      (key === "Tm" && revealedTeamCells.includes(rowIndex)) ||
                      (revealAllNonSeasonTeam &&
                        key !== "Season" &&
                        key !== "Tm") ||
                      revealAll
                        ? key === "Season"
                          ? playersData[
                              gauntletMode ? gauntletPlayer : randomPlayer
                            ][key]
                            ? playersData[
                                gauntletMode ? gauntletPlayer : randomPlayer
                              ][key][rowIndex]
                            : "N/A"
                          : playersData[
                              gauntletMode ? gauntletPlayer : randomPlayer
                            ][key][rowIndex] || (key === "Tm" ? "DNP" : "0")
                        : ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      {isGauntletModalOpen && (
        <GauntletModeModal
          isOpen={isGauntletModalOpen}
          onClose={closeGauntletModal}
          onExit={() => {
            closeGauntletModal();
            toggleGauntletMode();
          }}
          strikes={strikes}
          gauntletScore={gauntletScore}
          gauntletHighScore={gauntletHighScore}
          gauntletPlayer={gauntletPlayer}
          selectedLeagues={selectedLeagues}
          setSelectedLeagues={setSelectedLeagues}
        />
      )}
    </div>
  );
};

export default App;
