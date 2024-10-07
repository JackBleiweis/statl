import React, { useEffect, useState, useRef } from "react";
import Profiles from './Profiles'
import ScoreSubmissionForm from "./ScoreSubmissionForm";

const Leaderboard = (props) => {
  const { setShowLeaderboard, gauntletScore, submitted, setSubmitted } = props
  const [timeFilter, setTimeFilter] = useState('all')
  const [profiles, setProfiles] = useState([])

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetch("/.netlify/functions/getProfiles"); // Call to your serverless function to fetch profiles
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProfiles(data); // Set the fetched profiles
        console.log(data)
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };

    fetchProfiles(); // Fetch profiles on component mount
  }, []);

  const handleDurationClick = (time) => {
    setTimeFilter(time)
  };

  const handleSubmit = async (scoreData) => {
    setSubmitted(true)
    try {
      const response = await fetch("/.netlify/functions/submitScore", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(scoreData),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok", response);
      }

      const data = await response.json();
      console.log("Success:", data);
    } catch (error) {
      console.error("Error submitting score:", error);
    }
  };

  return (
    <>
      <div className="leaderboard-overlay" onClick={() => setShowLeaderboard(false)} >
        <div className='leaderboard-content' onClick={e => e.stopPropagation()}>
          <h1>Leaderboard</h1>
          <div className="duration-filter">
            <button data-id="all" onClick={() => handleDurationClick('all')}>
              All Time
            </button>
            <button data-id="30" onClick={() => handleDurationClick('month')}>
              Last 30 Days
            </button>
            <button data-id="7" onClick={() => handleDurationClick('week')}>
              Last 7 Days
            </button>
          </div>
          <div className="all-scores">
            <Profiles timeFilter={timeFilter} profiles={profiles} setProfiles={setProfiles} />
          </div>
          {!submitted ? <ScoreSubmissionForm onSubmit={handleSubmit} gauntletScore={gauntletScore} /> :
            <div>Thanks for playing! Refresh and play again!</div>}
        </div>
      </div>
    </>
  );
};

export default Leaderboard;
