"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const ProfileContestTable = ({data}) => {
  const [contests, setContests] = useState([]);
  useEffect(()=>{
    setContests(data.mergedContests);
  },[data])

  const sortedContests = contests.sort((a, b) => b.startTime - a.startTime);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString(); 
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(contests.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const currentContests = sortedContests.slice(
    indexOfFirstItem,
    indexOfFirstItem + itemsPerPage
  );

  const formatContestName = (name) => {
    return name.toLowerCase().replace(/\s+/g, '-').concat('/');
  };

  console.log(currentContests);

  return (
    <div>
      {!contests || contests.length !== 0 ? (
        <>
          <table className="w-full text-left border-separate border-spacing-2">
            <thead>
              <tr className="text-slate-500">
                <th className="p-2 text-sm font-medium">Contest</th>
                <th className="p-2 text-sm font-medium">Start Time</th>
                <th className="p-2 text-sm font-medium">Rank</th>
                <th className="p-2 text-sm font-medium">Solved</th>
              </tr>
            </thead>
            <tbody>
              {currentContests.map((contest, index) => (
                <tr key={index}>
                  <td className="py-4 text-sm text-gray-700 underline">
                    <div className="flex gap-2">
                      {contest.platform === "LeetCode" ? (
                        <Image
                          src="/svgs/lc.svg"
                          width={0}
                          height={0}
                          className="w-5 h-5"
                          alt="abcd"
                        />
                      ) : (
                        <Image
                          src="/svgs/cf.svg"
                          width={0}
                          height={0}
                          className="w-5 h-5"
                          alt="abcd"
                        />
                      )}
                      {contest.platform === "LeetCode" ? (
                        <Link
                          href={`https://leetcode.com/contest/${formatContestName(contest.contestName)}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <p>{contest.contestName} </p>
                        </Link>
                      ) : (
                        <Link
                          href={`https://codeforces.com/contest/${contest.contestId}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <p>{contest.contestName} </p>
                        </Link>
                      )}
                    </div>
                  </td>
                  <td className="py-4 text-sm text-gray-700">
                    {formatDate(contest.startTime)}
                  </td>
                  <td className="py-4 text-sm text-gray-700">{contest.rank}</td>
                  <td className="py-4 text-sm text-gray-700">
                    {contest.problemsSolved ?? "No Data"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <div>
          <p>No Records Found</p>
        </div>
      )}
    </div>
  );
};

export default ProfileContestTable;
