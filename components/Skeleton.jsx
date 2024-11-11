import React from "react";

export function LeaderboardSkeleton() {
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
            {Array.from({ length: 10 }).map((_, index) => (
              <tr key={index} className="border-b text-center animate-pulse">
                <td className="p-2 sm:p-4">
                  <div className="h-4 bg-gray-300 rounded w-6 mx-auto"></div>
                </td>
                <td className="p-2 sm:p-4">
                  <div className="flex ml-10 items-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-300 rounded-full mr-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                  </div>
                </td>
                <td className="p-2 sm:p-4">
                  <div className="h-4 bg-gray-300 rounded w-10 mx-auto"></div>
                </td>
                <td className="p-2 sm:p-4">
                  <div className="h-4 bg-gray-300 rounded w-16 mx-auto"></div>
                </td>
                <td className="p-2 sm:p-4">
                  <div className="h-4 bg-gray-300 rounded w-16 mx-auto"></div>
                </td>
                <td className="p-2 sm:p-4">
                  <div className="h-4 bg-gray-300 rounded w-10 mx-auto"></div>
                </td>
                <td className="p-2 sm:p-4 flex space-x-2 items-center justify-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-5 h-5 bg-gray-300 rounded-full"
                    ></div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ContestTableSkeleton() {
  return (
    <div className="rounded-lg border bg-white shadow-lg overflow-hidden">
      {/* Table Header Skeleton */}
      <div className="w-full bg-gray-200 h-12"></div>{" "}
      {/* Placeholder for table header */}
      <div className="p-2 space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-2 ${
              index % 2 === 0 ? "bg-white" : "bg-gray-50"
            } animate-pulse`}
          >
            {/* Rank Placeholder */}
            <div className="w-14 h-8 bg-gray-300 rounded"></div>

            {/* Name Placeholder */}
            <div className="w-32 h-6 bg-gray-300 rounded"></div>

            {/* Handle Placeholder */}
            <div className="w-24 h-4 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
