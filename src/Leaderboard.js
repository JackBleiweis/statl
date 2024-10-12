import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import styled from "styled-components";
import BeatLoader from "react-spinners/BeatLoader";

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContainer = styled.div`
  position: relative;
  background-color: #282c34;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  max-height: 80vh;
  width: 90%;
  max-width: 350px;
  min-height: 80vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  @media screen and (max-width: 768px) {
    padding: 1rem 2rem;
    min-height: 60vh;
    max-height: 85vh;
    max-width: 60vw;
    width: 60%;
  }
`;

const Title = styled.p`
  margin: 5px 0px 10px;
  font-weight: bold;
  font-size: 28px;

  @media screen and (max-width: 768px) {
    margin: 5px 0px 5px;
  }
`;

const Tabs = styled.div`
  position: relative; // Add position relative to the Tabs container
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-bottom: 20px;
`;

const Tab = styled.div`
  font-size: 16px;
  font-weight: bold;
  padding: 10px;
  cursor: pointer;
  position: relative; // Add position relative to the Tab
  color: white;

  // Pseudo-element for the sliding border
  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: #4a90e2;
    transform: scaleX(0); // Start with scaleX(0)
    transition: transform 0.3s ease; // Transition for the sliding effect
  }

  // When the tab is active, scale the border to full width
  ${(props) =>
    props.active &&
    `
    &::after {
      transform: scaleX(1); // Scale to full width when active
    }
  `}

  @media screen and (max-width: 768px) {
    font-size: 12px;
  }
`;

const LeaderboardList = styled.div`
  width: 100%;
`;

const LoadingContainer = styled.div`
  margin-top: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ListItemContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px 0;
`;

const Rank = styled.div`
  font-weight: bold;
  color: white;
  font-size: 18px;
  margin-right: 10px;
  min-width: 15px;

  @media screen and (max-width: 768px) {
    font-size: 14px;
  }
`;

const ListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => {
    if (props.rank === 1) return "#C59E01"; // Gold
    if (props.rank === 2) return "#C0C0C0"; // Silver
    if (props.rank === 3) return "#B87333"; // Darker shade of Bronze
    return "#4a90e2"; // Default blue for other ranks
  }};
  color: "black";
  padding: 8px;
  border-radius: 5px;
  min-width: 80%;

  @media screen and (max-width: 768px) {
    padding: 6px 8px;
  }
`;

const Name = styled.div`
  font-weight: bold;
  flex-grow: 1;
  margin-left: 10px;
  text-align: left;

  @media screen and (max-width: 768px) {
    font-size: 14px;
  }
`;

const Score = styled.div`
  font-weight: bold;
  margin-right: 8px;
  text-align: center;
  min-width: 15px;

  @media screen and (max-width: 768px) {
    font-size: 14px;
  }
`;

// Mock Data
const mockData = [
  { name: "Mike", score: 20 },
  { name: "Jack", score: 18 },
  { name: "Cole", score: 15 },
  { name: "Jake", score: 14 },
  { name: "Ben", score: 11 },
];

const Leaderboard = ({ setShowLeaderboard }) => {
  const [activeTab, setActiveTab] = React.useState("All Time");
  const [profiles, setProfiles] = useState([]);
  const [showProfiles, setShowProfiles] = useState(profiles);
  const [loading, setLoading] = useState(false); // State to track loading
  const modalRef = useRef(null);

  const filterByLast7Days = (profiles) => {
    const today = moment();
    const startOfPeriod = today.subtract(7, "days"); // Start 7 days ago

    return profiles.filter((profile) => {
      const profileDate = moment(profile.date);
      return profileDate.isAfter(startOfPeriod); // Include profiles from the last 7 days
    });
  };

  const filterByLast30Days = (profiles) => {
    const today = moment();
    const startOfPeriod = today.subtract(30, "days"); // Start 30 days ago

    return profiles.filter((profile) => {
      const profileDate = moment(profile.date);
      return profileDate.isAfter(startOfPeriod); // Include profiles from the last 30 days
    });
  };

  const handleTabSwitch = (tabSelection) => {
    switch (tabSelection) {
      case "Last 30":
        setShowProfiles(filterByLast30Days(profiles));
        setActiveTab("Last 30");
        break;
      case "Last 7":
        setShowProfiles(filterByLast7Days(profiles));
        setActiveTab("Last 7");
        break;
      default:
        setShowProfiles(profiles);
        setActiveTab("All Time");
        break;
    }
  };

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true); // Set loading to true
      try {
        const response = await fetch("/.netlify/functions/getProfiles");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProfiles(data);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    fetchProfiles();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowLeaderboard(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowLeaderboard]);

  useEffect(() => {
    setShowProfiles(profiles);
  }, [profiles]);

  return (
    <ModalOverlay>
      <ModalContainer ref={modalRef}>
        <Title>Leaderboard</Title>
        <Tabs>
          <Tab
            active={activeTab === "All Time"}
            onClick={() => handleTabSwitch("All Time")}
          >
            All Time
          </Tab>
          <Tab
            active={activeTab === "Last 30"}
            onClick={() => handleTabSwitch("Last 30")}
          >
            Last 30
          </Tab>
          <Tab
            active={activeTab === "Last 7"}
            onClick={() => handleTabSwitch("Last 7")}
          >
            Last 7
          </Tab>
        </Tabs>

        <LeaderboardList>
          {loading ? (
            <LoadingContainer>
              <BeatLoader color="#fff" />
            </LoadingContainer>
          ) : (
            showProfiles
              .sort((a, b) => b.score - a.score)
              .slice(0, 10)
              .map((item, index) => (
                <ListItemContainer key={index}>
                  <Rank>{index + 1}.</Rank>
                  <ListItem rank={index + 1}>
                    <Name>{item.name}</Name>
                    <Score>{item.score}</Score>
                  </ListItem>
                </ListItemContainer>
              ))
          )}
        </LeaderboardList>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default Leaderboard;
