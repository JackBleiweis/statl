import React, { useState } from "react";
import { FaArrowCircleRight } from "react-icons/fa";

const ScoreSubmissionForm = (props) => {
  const { onSubmit, gauntletScore } = props;
  const [name, setName] = useState("");

  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      name,
      score: gauntletScore,
      formattedDate,
    };
    if (typeof onSubmit === "function") {
      onSubmit(data);
    } else {
      console.error("onSubmit is not a function");
    }
    setName("");
  };

  return (
    <div className="score-submission-container">
      <form className="score-submission-form" onSubmit={handleSubmit}>
        <label className="score-submission-label">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="score-submission-input"
            placeholder="Save name to leaderboard..."
          />
        </label>
        <button type="submit" className="score-submission-button">
          <FaArrowCircleRight style={{ bottom: "-1px" }} />
        </button>
      </form>
    </div>
  );
};

export default ScoreSubmissionForm;
