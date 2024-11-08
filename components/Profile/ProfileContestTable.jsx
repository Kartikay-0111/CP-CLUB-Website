import React from "react";

const ProfileContestTable = () => {
  const contests = [
    {
      id: 12,
      contest: "Codeforces Round #496 (Div.2)",
      startTime: "Dec/20/2019 22:35 UTC+6",
      rank: 2096,
      solved: 2,
    },
    {
      id: 13,
      contest: "Codeforces Round #496 (Div.2)",
      startTime: "Dec/20/2019 22:35 UTC+6",
      rank: 2096,
      solved: 2,
    },
    {
      id: 14,
      contest: "Codeforces Round #496 (Div.2)",
      startTime: "Dec/20/2019 22:35 UTC+6",
      rank: 2096,
      solved: 2,
    },
  ];

  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="text-slate-500">
          <th className="p-2 text-sm font-medium">No.</th>
          <th className="p-2 text-sm font-medium">Contest</th>
          <th className="p-2 text-sm font-medium">Start Time</th>
          <th className="p-2 text-sm font-medium">Rank</th>
          <th className="p-2 text-sm font-medium">Solved</th>
        </tr>
      </thead>
      <tbody>
        {contests.map((contest) => (
          <tr key={contest.id} className="border-t">
            <td className="py-4 text-sm text-gray-700">{contest.id}</td>
            <td className="py-4 text-sm text-gray-700 underline">
              {contest.contest}
            </td>
            <td className="py-4 text-sm text-gray-700">{contest.startTime}</td>
            <td className="py-4 text-sm text-gray-700">{contest.rank}</td>
            <td className="py-4 text-sm text-gray-700">{contest.solved}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProfileContestTable;
