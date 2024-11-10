"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import members from "../json/members.json";
import Link from "next/link";
import { CircleCheck, CircleX } from "lucide-react";

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 1 day in milliseconds

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attendanceMap, setAttendanceMap] = useState({});

  const fetchUserRatings = async (handles) => {
    try {
      const response = await axios.get(
        `https://codeforces.com/api/user.info?handles=${handles.join(";")}`
      );
      return response.data.result;
    } catch (error) {
      console.error("Error fetching ratings:", error);
      return [];
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
        .slice(0, 5)
        .map((contest) => contest.id);
    } catch (error) {
      console.error("Error fetching contests:", error);
      return [];
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

  const fetchRatingsAndAttendance = async () => {
    const handles = Object.keys(members).map(
      (member) => members[member].cf_username
    );
    setLoading(true);
    const lastFiveContests = await fetchLastFiveContests();

    try {
      const attendanceMap = handles.reduce((acc, handle) => {
        acc[handle] = [false, false, false, false, false];
        return acc;
      }, {});

      for (const contestId of lastFiveContests) {
        const response = await axios.get(
          `https://codeforces.com/api/contest.standings?contestId=${contestId}&handles=${handles.join(
            ";"
          )}&showUnofficial=false`
        );

        response.data.result.rows.forEach((row) => {
          const handle = row.party.members[0].handle;
          const contestIndex = lastFiveContests.indexOf(contestId);
          if (attendanceMap[handle]) {
            attendanceMap[handle][contestIndex] = true;
          }
        });
      }

      setAttendanceMap(attendanceMap);

      const cfRatings = await fetchUserRatings(handles);
      const updatedMembers = [];

      for (const [username, data] of Object.entries(members)) {
        const cfData = cfRatings.find(
          (user) => user.handle === data.cf_username
        );
        const leetCodeRating = await fetchLeetCodeRating(data.lc_username);

        const memberData = {
          ...data,
          username: username,
          rating: cfData?.rating || 0,
          maxRating: cfData?.maxRating || 0,
          rank: cfData?.rank || "N/A",
          maxRank: cfData?.maxRank || "N/A",
          titlePhoto:
            cfData?.titlePhoto || "https://userpic.codeforces.org/no-title.jpg",
          rankColor:
            cfData?.rank === "N/A"
              ? "bg-red-500 text-white"
              : getRankColor(cfData.rating || 0),
          leetCodeRating,
          attendance: attendanceMap[data.cf_username] || [
            false,
            false,
            false,
            false,
            false,
          ],
        };

        updatedMembers.push(memberData);
      }

      updatedMembers.sort((a, b) => b.rating - a.rating);
      setLeaderboardData(updatedMembers);

      const cachedData = {
        data: updatedMembers,
        attendanceMap,
        timestamp: Date.now(),
      };
      localStorage.setItem("leaderboardData", JSON.stringify(cachedData));
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cachedData = JSON.parse(localStorage.getItem("leaderboardData"));
    const isCacheValid =
      cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION;

    if (isCacheValid) {
      setLeaderboardData(cachedData.data);
      setAttendanceMap(cachedData.attendanceMap);
      setLoading(false);
    } else {
      fetchRatingsAndAttendance();
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
                  {attendanceMap[member.cf_username]?.map((attended, i) => (
                    <span key={i} className="p-1">
                      {attended ? (
                        <CircleCheck size={20} className="text-green-500" />
                      ) : (
                        <CircleX size={20} className="text-red-500" />
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
