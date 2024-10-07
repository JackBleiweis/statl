import React, { useState, useEffect } from "react";
import moment from "moment";

export function filterByLast7Days(profiles) {
  const today = moment();
  const startOfPeriod = today.subtract(7, "days"); // Start 7 days ago

  return profiles.filter((profile) => {
    const profileDate = moment(profile.date);
    return profileDate.isAfter(startOfPeriod); // Include profiles from the last 7 days
  });
}

export function filterByLast30Days(profiles) {
  const today = moment();
  const startOfPeriod = today.subtract(30, "days"); // Start 30 days ago

  return profiles.filter((profile) => {
    const profileDate = moment(profile.date);
    return profileDate.isAfter(startOfPeriod); // Include profiles from the last 30 days
  });
}

const PlayerEntry = ({ name, score, index }) => {
  return (
    <div className="player-entry">
      <div className="rank">{index + 1}</div>
      <div className="name">{name}</div>
      <div className="score">{score}</div>
    </div>
  );
};

const Profiles = (props) => {
  const { timeFilter, profiles } = props;
  const [showProfiles, setShowProfiles] = useState(profiles);

  useEffect(() => {
    switch (timeFilter) {
      case "month":
        setShowProfiles(filterByLast30Days(profiles));
        break;
      case "week":
        setShowProfiles(filterByLast7Days(profiles));
        break;
      default:
        setShowProfiles(profiles);
        break;
    }
  }, [timeFilter]);

  showProfiles?.sort((a, b) => b.score - a.score);
  console.log(showProfiles);
  return showProfiles ? (
    <div className="all-profiles">
      {showProfiles.slice(0, 10).map((profile, index) => (
        <PlayerEntry
          key={index}
          name={profile.name}
          score={profile.score}
          index={index}
        />
      ))}{" "}
    </div>
  ) : (
    <div>No scores yet! Get your name up here!</div>
  );
};

export default Profiles;
