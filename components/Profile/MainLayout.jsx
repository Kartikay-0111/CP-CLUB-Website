import Image from "next/image";
import React from "react";
import DoughnutChart from "./DoughnutChart";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";
import RatingChart from "./RatingChart";
import ProfileContestTable from "./ProfileContestTable";
import TopicAnalysis from "./TopicAnalysis";
import Link from "next/link";

function MainLayout({ data }) {
  let totalContests =
    data.leetCodeData?.userContestDetails?.contestParticipation.length +
    data.codeForcesData?.ratingData?.length;
  let totalQuestion = data.leetCodeData?.acSubmissionNum[0]?.count;
  let calenderSubmission = data.leetCodeData?.submissionCalendar;
  let topicWiseAnalysis = data.leetCodeData?.topicWiseAnalysis;

  // Transforming submissionCalendar data into heatmap format
  const heatmapData = Object.keys(calenderSubmission || {}).map((timestamp) => {
    const date = new Date(parseInt(timestamp) * 1000)
      .toISOString()
      .split("T")[0];
    return { date, count: calenderSubmission[timestamp] };
  });

  const topData = [
    {
      image: "/svgs/puzzle.svg",
      title: "Total Questions",
      count: totalQuestion ?? 0,
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

  return (
    <div className="flex flex-col gap-7">
      {/* upper part */}
      <div className="flex gap-7 justify-between">
        {topData.map((data, index) => (
          <div
            key={index}
            className=" w-full py-5 px-7 rounded-xl shadow-custom flex items-center gap-5 bg-white"
          >
            <div className="bg-[#F5F6FE] rounded-full w-14 h-14 flex justify-center items-center">
              <Image
                src={data.image}
                alt="questions"
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

      {/* middle part */}
      <div className="flex gap-7">
        {/* left part */}
        <div className="w-full flex-1 flex flex-col gap-7">
          {/* Problem solved section */}
          <div className=" w-full py-5 px-7 rounded-xl shadow-custom flex flex-col gap-5 bg-white">
            <p>Problems Solved</p>
            <p className="text-sm text-slate-500">
              Problems solved from leetcode
            </p>
            <div className="flex gap-3">
              <DoughnutChart data={data.leetCodeData?.acSubmissionNum} />
            </div>

            {/* <hr />

            <p className="text-sm text-slate-500">
              Problems solved from Codechef
            </p>
            <div
              className={`flex justify-between w-full bg-[#F5F6FE] px-3 py-1 rounded-md text-[#782d16]`}
            >
              <p>Competitive Programming</p>
              <p className="text-black">100</p>
            </div> */}

            <hr />

            <p className="text-sm text-slate-500">
              Problems solved in contests from Codeforces
            </p>
            <div
              className={`flex justify-between w-full bg-[#F5F6FE] px-3 py-1 rounded-md text-[#4483f2]`}
            >
              <p>Competitive Programming</p>
              <p className="text-black">
                {data.codeForcesData?.problemsSolvedCount ?? 0}
              </p>
            </div>
          </div>

          <div className=" w-full py-5 px-7 rounded-xl shadow-custom flex flex-col gap-5 bg-white">
            <div className="flex justify-between">
              <p>Contests</p>
              <Link href="/contests" className="text-sm cursor-pointer">
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
              <p>
                {data?.leetCodeData?.acSubmissionNum[0].submissions} submissions
                in last year
              </p>
              {/* <p>Max Streak : 44</p> */}
            </div>
            <CalendarHeatmap
              startDate={new Date("2024-04-01")}
              endDate={new Date("2024-12-31")}
              values={heatmapData}
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

          {/* rating graph section */}
          <div className="w-full py-5 px-7 rounded-xl shadow-custom flex flex-col gap-5 bg-white">
            <RatingChart data={data} />
          </div>

          {/* topic analysis */}
          <div className=" w-full py-5 px-7 rounded-xl shadow-custom flex flex-col gap-5 bg-white">
            <div className="flex justify-between">
              <p>DSA Topic Analysis</p>
            </div>
            <TopicAnalysis data={topicWiseAnalysis} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
