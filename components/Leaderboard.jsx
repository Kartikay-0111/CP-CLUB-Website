"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import members from "../json/members.json";
import Link from "next/link";
import { CircleCheck, CircleX } from "lucide-react";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserRating = async (cf_username, retries = 3) => {
    try {
      const response = await axios.get(
        `https://codeforces.com/api/user.info?handles=${cf_username}`
      );
      return response.data.result[0];
    } catch (error) {
      if (retries > 0 && error.response?.status === 503) {
        console.warn(
          `Retrying request for ${cf_username}. Retries left: ${retries}`
        );
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return fetchUserRating(cf_username, retries - 1);
      } else {
        return null;
      }
    }
  };

  const fetchLeetCodeRating = async (lc_username) => {
    try {
      const response = await axios.get(
        `https://leetcodeapi-v1.vercel.app/contest/${lc_username}`
      );
      const data = response.data.userContestDetails;
      return data?.rating ? Math.floor(data.rating) : 0;
    } catch (error) {
      return 0;
    }
  };

  const fetchLastFiveContests = async () => {
    try {
      const response = await axios.get(
        "https://codeforces.com/api/contest.list"
      );
      const contests = response.data.result;
      return contests
        .filter((contest) => contest.phase === "FINISHED")
        .slice(0, 5);
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
      const attendedContestIds = response.data.result
        .map((contest) => contest.contestId)
        .slice(-5);

      const attendance = lastFiveContests.map((contest) =>
        attendedContestIds.includes(contest.id)
      );
      return attendance;
    } catch (error) {
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
        const updatedMembers = [];

        for (const [username, data] of Object.entries(members)) {
          const cfData = await fetchUserRating(data.cf_username);
          const leetCodeRating = await fetchLeetCodeRating(data.lc_username);
          const attendance = await fetchUserAttendance(
            data.cf_username,
            lastFiveContests
          );

          const memberData = {
            ...data,
            username: username,
            rating: cfData?.rating || 0,
            maxRating: cfData?.maxRating || 0,
            rank: cfData?.rank || "N/A",
            maxRank: cfData?.maxRank || "N/A",
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

          updatedMembers.push(memberData);
        }

        updatedMembers.sort((a, b) => b.rating - a.rating);
        setLeaderboardData(updatedMembers);

        // Store leaderboard data in localStorage without timestamp
        localStorage.setItem("leaderboardData", JSON.stringify(updatedMembers));
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    // Check if leaderboard data is already in localStorage
    const storedData = localStorage.getItem("leaderboardData");
    if (storedData) {
      setLeaderboardData(JSON.parse(storedData));
      setLoading(false);
    } else {
      fetchRatings();
    }
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
            <tr className="bg-teal-500 text-white text-center">
              <th className="p-2 sm:p-4">Sr No</th>
              <th className="p-2 sm:p-4">Name</th>
              <th className="p-2 sm:p-4">Year</th>
              <th className="p-2 sm:p-4">Leetcode Rating</th>
              <th className="p-2 sm:p-4">Codeforces Rating</th>
              <th className="p-2 sm:p-4">Rank</th>
              <th className="p-2 sm:p-4">Last 5 Contests Attendance</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((member, index) => (
              <tr
                key={index}
                className="border-b hover:bg-gray-100 text-center"
              >
                <td className="p-2 sm:p-4 text-gray-800">{index + 1}</td>
                <td className="p-2 sm:p-4 text-gray-800">
                  <div className="flex ml-10">
                    <img
                      src={member.titlePhoto}
                      alt={member.name}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-2 sm:mr-4"
                    />
                    <Link
                      className="text-sm sm:text-base text-orange-800 hover:underline"
                      href={`profile/${member.username}`}
                      target="_blank"
                    >
                      {member.name}
                    </Link>
                  </div>
                </td>
                <td className="p-2 sm:p-4 text-gray-600">{member.year}</td>
                <td className="p-2 sm:p-4 text-blue-600">
                  <a
                    href={`https://leetcode.com/${member.lc_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-sm sm:text-base"
                  >
                    {member.leetCodeRating}
                  </a>
                </td>
                <td className="p-2 sm:p-4 text-blue-600">
                  <a
                    href={`https://codeforces.com/profile/${member.cf_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-sm sm:text-base"
                  >
                    {member.rating}
                  </a>
                </td>
                <td className={`p-2 sm:p-4 capitalize ${member.rankColor}`}>
                  {member.rank}
                </td>
                <td className="p-2 sm:p-4 flex space-x-2 items-center justify-center">
                  {member.attendance.map((attended, i) => (
                    <span key={i} className="text-lg">
                      {attended ? (
                        <CircleCheck
                          color="green"
                          size="25"
                          className="font-bold"
                        />
                      ) : (
                        <CircleX color="red" size="25" className="font-bold" />
                      )}
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
