"use client";
import { useState, useEffect } from "react";
import axios from "axios";

const LeaderboardV2 = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the leaderboard data when the component mounts
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const response = await axios.get("/api/lcrating");
        // Sort the users by rating in descending order
        const sortedData = response.data.sort((a, b) => b.rating - a.rating);
        setLeaderboardData(sortedData);
      } catch (error) {
        console.log("Error fetching leaderboard data:", error);
        setError("Failed to load leaderboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  console.log(leaderboardData);
  

  // Render the leaderboard
  return (
    <div className="leaderboard">
      <h1>LeetCode Leaderboard</h1>

      {loading && <p>Loading leaderboard...</p>}
      {error && <p>{error}</p>}

      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.length > 0 ? (
            leaderboardData.map((user, index) => (
              <tr key={user.username}>
                <td>{index + 1}</td>
                <td>{user.username}</td>
                <td>{user.rating}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No leaderboard data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardV2;
