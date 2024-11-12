import Image from "next/image";
import React, { useState, useEffect } from "react";
import DoughnutChart from "./DoughnutChart";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";
import RatingChart from "./RatingChart";
import ProfileContestTable from "./ProfileContestTable";
import TopicAnalysis from "./TopicAnalysis";
import Link from "next/link";

function mergeTopicData(leetCodeData, codeForcesData) {
  const combinedAnalysis = { advanced: [], intermediate: [], fundamental: [] };

  ["advanced", "intermediate", "fundamental"].forEach((level) => {
    const leetTopics = leetCodeData[level] || [];
    const cfTopics = codeForcesData[level] || [];

    const topicMap = new Map();

    // Add LeetCode topics
    leetTopics.forEach((topic) => {
      topicMap.set(topic.tagSlug, { ...topic });
    });

    cfTopics.forEach((topic) => {
      if (topicMap.has(topic.tagSlug)) {
        topicMap.get(topic.tagSlug).problemsSolved += topic.problemsSolved;
      } else {
        topicMap.set(topic.tagSlug, { ...topic });
      }
    });

    combinedAnalysis[level] = Array.from(topicMap.values());
  });

  return combinedAnalysis;
}

async function getDailySolvedProblemsCount(userHandle) {
  const response = await fetch(
    `https://codeforces.com/api/user.status?handle=${userHandle}`
  );
  const data = await response.json();

  if (data.status !== "OK") {
    throw new Error("Failed to fetch user data");
  }

  const solvedProblems = data.result
    .filter((submission) => submission.verdict === "OK")
    .map((submission) => ({
      date: new Date(submission.creationTimeSeconds * 1000)
        .toISOString()
        .split("T")[0],
      problemId: `${submission.contestId}-${submission.problem.index}`,
    }));

  const dailyCounts = new Map();

  solvedProblems.forEach(({ date, problemId }) => {
    if (!dailyCounts.has(date)) {
      dailyCounts.set(date, new Set());
    }
    dailyCounts.get(date).add(problemId);
  });

  const dailySolvedProblems = Array.from(dailyCounts, ([date, problems]) => ({
    date,
    count: problems.size,
  }));

  return dailySolvedProblems;
}

function getAverageContestRating(ratingData) {
  if (!ratingData || ratingData.length === 0) return 0;

  const totalRating = ratingData.reduce(
    (sum, rating) => sum + rating.rating,
    0
  );
  return totalRating / ratingData.length;
}

function MainLayout({ data }) {
  const [dailySolvedProblem, setdailySolvedProblems] = useState([]);

  useEffect(() => {
    const fetchDailySolvedProblems = async () => {
      try {
        const dailySolvedProblems = await getDailySolvedProblemsCount(
          data?.codeForcesData?.handle
        );
        setdailySolvedProblems(dailySolvedProblems);
      } catch (error) {
        console.error("Error fetching daily solved problems:", error);
      }
    };

    if (data?.codeForcesData?.handle) {
      fetchDailySolvedProblems();
    }
  }, [data?.codeForcesData?.handle]);

  let totalContests =
    data.leetCodeData?.userContestDetails?.contestParticipation.length +
    data.codeForcesData?.ratingData?.length;
  let totalQuestion = data.leetCodeData?.acSubmissionNum[0]?.count;
  let calenderSubmission = data.leetCodeData?.submissionCalendar;
  const topicWiseAnalysis = mergeTopicData(
    data.leetCodeData?.topicWiseAnalysis,
    data.codeForcesData?.topicAnalysis
  );

  const averageContestRating = getAverageContestRating(
    data.codeForcesData?.ratingData
  );

  const heatmapData = Object.keys(calenderSubmission || {}).map((timestamp) => {
    const date = new Date(parseInt(timestamp) * 1000)
      .toISOString()
      .split("T")[0];
    return { date, count: calenderSubmission[timestamp] };
  });

  function mergeHeatmapAndDailySolvedProblems(
    heatmapData,
    dailySolvedProblems
  ) {
    const dailySolvedMap = new Map(
      dailySolvedProblems.map(({ date, count }) => [date, count])
    );

    const mergedData = heatmapData.map(({ date, count }) => {
      const dailySolvedCount = dailySolvedMap.get(date) || 0;
      return {
        date,
        count: count + dailySolvedCount,
      };
    });

    dailySolvedProblems.forEach(({ date, count }) => {
      if (!mergedData.some((item) => item.date === date)) {
        mergedData.push({
          date,
          count,
        });
      }
    });

    return mergedData.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  const mergedData = mergeHeatmapAndDailySolvedProblems(
    heatmapData,
    dailySolvedProblem
  );

  const topData = [
    {
      image: "/svgs/puzzle.svg",
      title: "Contest Questions",
      count: data.codeForcesData?.problemsSolvedCount ?? 0,
    },
    {
      image: "/svgs/trophy.svg",
      title: "Total Contests",
      count: totalContests ?? 0,
    },
    {
      image: "/svgs/active-days.svg",
      title: "Total Active Days",
      count: Object.keys(calenderSubmission).length,
    },
  ];

  // console.log(data.codeForcesData);
  const totalSubmissions =
    (data.leetCodeData?.acSubmissionNum[0]?.count ?? 0) +
    (data.codeForcesData?.problemsSolvedCount ?? 0);

  return (
    <div className="flex flex-col gap-7">
      {/* upper part */}
      <div className="flex gap-7 justify-between">
        {topData.map((data, index) => (
          <div
            key={index}
            className="w-full py-5 px-7 rounded-xl shadow-custom flex items-center gap-5 bg-white"
          >
            <div className="bg-[#F5F6FE] rounded-full w-14 h-14 flex justify-center items-center">
              <Image
                src={data.image}
                alt={data.title}
                width={0}
                height={0}
                className="w-6 h-6"
              />
            </div>
            <div>
              <p>{data.title}</p>
              <p className="text-3xl">{data.count}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-7">
        <div className="w-full flex-1 flex flex-col gap-7">
          <div className="w-full py-5 px-7 rounded-xl shadow-custom flex flex-col gap-5 bg-white">
            <p>Problems solved from leetcode</p>

            <div className="flex gap-3">
              <DoughnutChart data={data.leetCodeData?.acSubmissionNum} />
            </div>
          </div>

          <div className="w-full py-5 px-7 rounded-xl shadow-custom flex flex-col gap-5 bg-white">
            <div className="flex justify-between">
              <p>Contests</p>
              <Link href="/contest" className="text-sm cursor-pointer">
                See All
              </Link>
            </div>
            <ProfileContestTable data={data} />
          </div>
        </div>

        {/* right part */}
        <div className="w-full flex flex-col gap-7 flex-1">
          {/* Heat map section */}
          <div className="w-full py-5 px-7 rounded-xl shadow-custom flex flex-col gap-5 bg-white">
            <div className="flex justify-between text-sm text-slate-500">
              {/* <p>{data?.leetCodeData?.acSubmissionNum[0].count} submissions</p> */}
              <p>{totalSubmissions} submissions</p>
            </div>
            <CalendarHeatmap
              startDate={new Date("2024-04-01")}
              endDate={new Date("2024-12-31")}
              values={mergedData}
              classForValue={(value) => {
                if (!value) {
                  return "color-empty";
                }
                return `color-github-${Math.min(value.count, 4)}`;
              }}
              tooltipDataAttrs={(value) => ({
                "data-tooltip-id": "heatmap-tooltip",
                "data-tooltip-content": value.date
                  ? `${value.date}: ${value.count} submissions`
                  : "No submissions",
              })}
            />
            <Tooltip
              id="heatmap-tooltip"
              place="top"
              type="dark"
              effect="float"
            />
          </div>

          {/* Rating chart section */}
          <div className="w-full py-5 px-7 rounded-xl shadow-custom flex flex-col gap-5 bg-white">
            <RatingChart data={data} />
          </div>

          {/* Topic Analysis section */}

          <div className="w-full py-5 px-7 rounded-xl shadow-custom flex flex-col gap-5 bg-white">
            <p>Topic Wise Analysis</p>
            <TopicAnalysis data={topicWiseAnalysis} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
