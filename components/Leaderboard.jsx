"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import members from "../json/members.json";
import Link from "next/link";

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

  const fetchLeetCodeRating = async (lc_username) => {
    const cachedData = localStorage.getItem(`lc_${lc_username}`);
    if (cachedData) {
      return JSON.parse(cachedData).leetcodeRating;
    }

    try {
      const response = await axios.get(
        `https://leetcodeapi-v1.vercel.app/contest/${lc_username}`
      );
      const data = response.data.userContestDetails;

      const leetcodeRating = data?.rating ? Math.floor(data.rating) : 0;
      localStorage.setItem(
        `lc_${lc_username}`,
        JSON.stringify({ leetcodeRating })
      );
      return leetcodeRating;
    } catch (error) {
      console.error(
        `Error fetching LeetCode rating for ${lc_username}:`,
        error
      );
      return 0;
    }
  };

  const fetchLastFiveContests = async () => {
    try {
      const response = await axios.get(
        "https://codeforces.com/api/contest.list"
      );
      const contests = response.data.result;
      const lastFiveContests = contests
        .filter((contest) => contest.phase === "FINISHED")
        .slice(0, 5);

      return lastFiveContests;
    } catch (error) {
      console.error("Error fetching contests:", error);
      return [];
    }
  };

  const fetchUserAttendance = async (cf_username, lastFiveContests) => {
    try {
      const response = await axios.get(
        `https://codeforces.com/api/user.rating?handle=${cf_username}`
      );
      const attendedContestIds = response.data.result.map(
        (contest) => contest.contestId
      );

      const attendance = lastFiveContests.map((contest) =>
        attendedContestIds.includes(contest.id)
      );
      return attendance;
    } catch (error) {
      console.error(
        `Error fetching contest history for ${cf_username}:`,
        error
      );
      return [false, false, false, false, false];
    }
  };

  const getRankColor = (rating) => {
    if (rating >= 2000) return "bg-orange-500 text-white";
    if (rating >= 1800) return "bg-purple-500 text-white";
    if (rating >= 1600) return "bg-blue-500 text-white";
    if (rating >= 1400) return "bg-cyan-500 text-white";
    if (rating >= 1200) return "bg-green-500 text-white";
    return "bg-gray-500 text-white";
  };

  useEffect(() => {
    const fetchRatings = async () => {
      setLoading(true);
      const lastFiveContests = await fetchLastFiveContests();

      try {
        const updatedMembers = await Promise.all(
          Object.entries(members).map(async ([username, data]) => {
            const cfData = await fetchUserRating(data.cf_username);
            const leetCodeRating = await fetchLeetCodeRating(data.lc_username);
            const attendance = await fetchUserAttendance(
              data.cf_username,
              lastFiveContests
            );

            return {
              ...data,
              username: username,
              rating: cfData.rating || 0,
              maxRating: cfData.maxRating || 0,
              rank: cfData.rank || "N/A",
              maxRank: cfData.maxRank || "N/A",
              titlePhoto:
                cfData?.titlePhoto ||
                "https://userpic.codeforces.org/no-title.jpg",
              rankColor:
                cfData?.rank === "N/A"
                  ? "bg-red-500 text-white"
                  : getRankColor(cfData.rating || 0),
              leetCodeRating,
              attendance,
            };
          })
        );

        updatedMembers.sort((a, b) => b.rating - a.rating);
        setLeaderboardData(updatedMembers);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, []);

  if (loading) {
    return <div className="text-center text-xl">Loading Stats...</div>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4 sm:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
        Leaderboard
      </h1>
      <div className="w-full overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-teal-500 text-white text-left">
              <th className="p-2 sm:p-4">Name</th>
              <th className="p-2 sm:p-4">Year</th>
              <th className="p-2 sm:p-4">Leetcode</th>
              <th className="p-2 sm:p-4">CodeChef</th>
              <th className="p-2 sm:p-4">Codeforces</th>
              <th className="p-2 sm:p-4">LeetCode Rating</th>
              <th className="p-2 sm:p-4">Codeforces Rating</th>
              <th className="p-2 sm:p-4">Rank</th>
              <th className="p-2 sm:p-4">Last 5 Contests Attendance</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((member, index) => (
              <tr key={index} className="border-b hover:bg-gray-100">
                <td className="p-2 sm:p-4 text-gray-800">
                  <div className="flex items-center">
                    <img
                      src={member.titlePhoto}
                      alt={member.name}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-2 sm:mr-4"
                    />
                    <Link
                      className="text-sm sm:text-base"
                      href={`profile/${member.username}`}
                    >
                      {member.name}
                    </Link>
                  </div>
                </td>
                <td className="p-2 sm:p-4 text-gray-600">{member.year}</td>
                <td className="p-2 sm:p-4 text-blue-600">
                  <a
                    href={`https://leetcode.com/${member.lc_username}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-sm sm:text-base"
                  >
                    {member.lc_username}
                  </a>
                </td>
                <td className="p-2 sm:p-4 text-blue-600">
                  <a
                    href={`https://www.codechef.com/users/${member.cc_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-sm sm:text-base"
                  >
                    {member.cc_username}
                  </a>
                </td>
                <td className="p-2 sm:p-4 text-blue-600">
                  <a
                    href={`https://codeforces.com/profile/${member.cf_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-sm sm:text-base"
                  >
                    {member.cf_username}
                  </a>
                </td>
                <td className="p-2 sm:p-4 text-gray-800">
                  {member.leetCodeRating}
                </td>
                <td className="p-2 sm:p-4 text-gray-800">{member.rating}</td>
                <td className={`p-2 sm:p-4 capitalize ${member.rankColor}`}>
                  {member.rank}
                </td>
                <td className="p-2 sm:p-4 flex space-x-2">
                  {member.attendance.map((attended, i) => (
                    <span key={i} className="text-lg">
                      {attended ? "✅" : "❌"}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Leaderboard;
