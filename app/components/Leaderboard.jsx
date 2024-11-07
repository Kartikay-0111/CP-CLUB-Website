"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import members from "../../json/members.json";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserRating = async (cf_username, retries = 3) => {
    const cachedData = localStorage.getItem(cf_username);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    try {
      const response = await axios.get(
        `https://codeforces.com/api/user.info?handles=${cf_username}`
      );
      const data = response.data.result[0];

      localStorage.setItem(cf_username, JSON.stringify(data));
      return data;
    } catch (error) {
      if (retries > 0 && error.response?.status === 503) {
        console.warn(
          `Retrying request for ${cf_username}. Retries left: ${retries}`
        );
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return fetchUserRating(cf_username, retries - 1);
      } else {
        console.error(`Error fetching rating for ${cf_username}:`, error);
        return null;
      }
    }
  };

  useEffect(() => {
    const fetchRatings = async () => {
      setLoading(true);

      const updatedMembers = await Promise.all(
        Object.entries(members).map(async ([username, data]) => {
          const cfData = await fetchUserRating(data.cf_username);

          if (cfData) {
            return {
              ...data,
              rating: cfData.rating || 0,
              maxRating: cfData.maxRating || 0,
              rank: cfData.rank || "N/A",
              maxRank: cfData.maxRank || "N/A",
            };
          } else {
            return {
              ...data,
              rating: 0,
              maxRating: 0,
              rank: "N/A",
              maxRank: "N/A",
            };
          }
        })
      );

      updatedMembers.sort((a, b) => b.rating - a.rating);

      setLeaderboardData(updatedMembers);
      setLoading(false);
    };

    fetchRatings();
  }, []);

  if (loading) {
    return <div className="text-center text-xl">Loading leaderboard...</div>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Leaderboard</h1>
      <table className="w-full max-w-4xl bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-blue-500 text-white text-left">
            <th className="p-4">Name</th>
            <th className="p-4">Year</th>
            <th className="p-4">LeetCode</th>
            <th className="p-4">CodeChef</th>
            <th className="p-4">Codeforces</th>
            <th className="p-4">Rating</th>
            <th className="p-4">Rank</th>
            <th className="p-4">Max Rank</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((member, index) => (
            <tr key={index} className="border-b hover:bg-gray-100">
              <td className="p-4 text-gray-800">{member.name}</td>
              <td className="p-4 text-gray-600">{member.year}</td>
              <td className="p-4 text-blue-600">
                <a
                  href={`https://leetcode.com/${member.lc_username}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {member.lc_username}
                </a>
              </td>
              <td className="p-4 text-blue-600">
                <a
                  href={`https://www.codechef.com/users/${member.cc_username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {member.cc_username}
                </a>
              </td>
              <td className="p-4 text-blue-600">
                <a
                  href={`https://codeforces.com/profile/${member.cf_username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {member.cf_username}
                </a>
              </td>
              <td className="p-4 text-gray-800">{member.rating}</td>
              <td className="p-4 text-gray-800 capitalize">{member.rank}</td>
              <td className="p-4 text-gray-800 capitalize">{member.maxRank}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
