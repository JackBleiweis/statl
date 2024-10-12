import React, { useState } from "react";

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
    onSubmit(data);
    setName("");
  };

  return (
    <div className="score-submission-container">
      <form className="score-submission-form" onSubmit={handleSubmit}>
        <label className="score-submission-label">
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="score-submission-input"
          />
        </label>
        <button type="submit" className="score-submission-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ScoreSubmissionForm;
