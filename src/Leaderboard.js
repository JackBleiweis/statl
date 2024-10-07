import React, { useEffect, useState } from "react";
import Profiles from "./Profiles";
import ScoreSubmissionForm from "./ScoreSubmissionForm";

const Leaderboard = (props) => {
  const { setShowLeaderboard, gauntletScore, submitted, setSubmitted } = props;
  const [timeFilter, setTimeFilter] = useState("all");
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/.netlify/functions/getProfiles");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProfiles(data);
        console.log("Fetched profiles:", data);
      } catch (error) {
        console.error("Error fetching profiles:", error);
        setError("Failed to load leaderboard. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const handleDurationClick = (time) => {
    setTimeFilter(time);
  };

  const handleSubmit = async (scoreData) => {
    try {
      setSubmitted(true);
      const response = await fetch("/.netlify/functions/submitScore", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(scoreData),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Score submitted successfully:", data);
      // Optionally, you can update the profiles state here to include the new score
      setProfiles((prevProfiles) => [...prevProfiles, data]);
    } catch (error) {
      console.error("Error submitting score:", error);
      setError("Failed to submit score. Please try again.");
      setSubmitted(false);
    }
  };

  return (
    <>
      <div
        className="leaderboard-overlay"
        onClick={() => setShowLeaderboard(false)}
      >
        <div
          className="leaderboard-content"
          onClick={(e) => e.stopPropagation()}
        >
          <h1>Leaderboard</h1>
          <div className="duration-filter">
            <button data-id="all" onClick={() => handleDurationClick("all")}>
              All Time
            </button>
            <button data-id="30" onClick={() => handleDurationClick("month")}>
              Last 30 Days
            </button>
            <button data-id="7" onClick={() => handleDurationClick("week")}>
              Last 7 Days
            </button>
          </div>
          {loading ? (
            <p>Loading leaderboard...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <div className="all-scores">
              <Profiles
                timeFilter={timeFilter}
                profiles={profiles}
                setProfiles={setProfiles}
              />
            </div>
          )}
          {!submitted ? (
            <ScoreSubmissionForm
              onSubmit={handleSubmit}
              gauntletScore={gauntletScore}
            />
          ) : (
            <div>Thanks for playing! Refresh and play again!</div>
          )}
        </div>
      </div>
    </>
  );
};

export default Leaderboard;
