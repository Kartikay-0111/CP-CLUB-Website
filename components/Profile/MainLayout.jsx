import Image from "next/image";
import React from "react";
import DoughnutChart from "./DoughnutChart";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";
import RatingChart from "./RatingChart";
import ProfileContestTable from "./ProfileContestTable";

function MainLayout({ data }) {
  let totalContests =
    data.leetCodeData?.userContestDetails?.contestParticipation.length +
    data.codeForcesData?.ratingData?.length;
  let totalQuestion = data.leetCodeData?.acSubmissionNum[0]?.count;
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
      count: 368,
    },
  ];

  const heatmapData = [
    { date: "2024-01-01", count: 2 },
    { date: "2024-01-05", count: 1 },
    { date: "2024-01-10", count: 3 },
    { date: "2024-01-15", count: 4 },
    { date: "2024-01-20", count: 5 },
    { date: "2024-01-25", count: 2 },
    { date: "2024-02-01", count: 3 },
    { date: "2024-02-10", count: 5 },
    { date: "2024-02-15", count: 1 },
    { date: "2024-02-20", count: 2 },
    { date: "2024-03-01", count: 4 },
    { date: "2024-03-05", count: 3 },
    { date: "2024-03-10", count: 1 },
    { date: "2024-03-20", count: 5 },
    { date: "2024-04-01", count: 2 },
    { date: "2024-04-05", count: 4 },
    { date: "2024-04-10", count: 3 },
    { date: "2024-04-15", count: 1 },
    { date: "2024-05-01", count: 5 },
    { date: "2024-05-10", count: 2 },
    { date: "2024-05-15", count: 3 },
    { date: "2024-05-20", count: 4 },
    { date: "2024-06-01", count: 1 },
    { date: "2024-06-05", count: 3 },
    { date: "2024-06-10", count: 2 },
    { date: "2024-06-15", count: 5 },
    { date: "2024-07-01", count: 4 },
    { date: "2024-07-05", count: 3 },
    { date: "2024-07-10", count: 2 },
    { date: "2024-07-15", count: 1 },
    { date: "2024-08-01", count: 5 },
    { date: "2024-08-10", count: 4 },
    { date: "2024-08-15", count: 3 },
    { date: "2024-08-20", count: 2 },
    { date: "2024-09-01", count: 1 },
    { date: "2024-09-05", count: 5 },
    { date: "2024-09-10", count: 4 },
    { date: "2024-09-15", count: 3 },
    { date: "2024-10-01", count: 2 },
    { date: "2024-10-05", count: 1 },
    { date: "2024-10-10", count: 4 },
    { date: "2024-10-15", count: 5 },
    { date: "2024-11-01", count: 3 },
    { date: "2024-11-05", count: 2 },
    { date: "2024-11-10", count: 1 },
    { date: "2024-12-01", count: 5 },
    { date: "2024-12-05", count: 4 },
    { date: "2024-12-10", count: 3 },
    { date: "2024-12-15", count: 2 },
    { date: "2024-12-20", count: 1 },
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

            <hr />

            <p className="text-sm text-slate-500">
              Problems solved from Codechef
            </p>
            <div
              className={`flex justify-between w-full bg-[#F5F6FE] px-3 py-1 rounded-md text-[#782d16]`}
            >
              <p>Competitive Programming</p>
              <p className="text-black">100</p>
            </div>

            <hr />

            <p className="text-sm text-slate-500">
              Problems solved from Codeforces
            </p>
            <div
              className={`flex justify-between w-full bg-[#F5F6FE] px-3 py-1 rounded-md text-[#4483f2]`}
            >
              <p>Competitive Programming</p>
              <p className="text-black">100</p>
            </div>
          </div>

          <div className=" w-full py-5 px-7 rounded-xl shadow-custom flex flex-col gap-5 bg-white">
            <div className="flex justify-between">
              <p>Contests</p>
              <p className="text-sm cursor-pointer">See All</p>
            </div>
            <ProfileContestTable />
          </div>
        </div>

        {/* right part */}
        <div className="w-full flex flex-col gap-7 flex-1">
          {/* Heat map section */}
          <div className="w-full py-5 px-7 rounded-xl shadow-custom flex flex-col gap-5 bg-white">
            <div className="flex justify-between text-sm text-slate-500">
              <p>670 submissions in last year</p>
              <p>Max Streak : 44</p>
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
            <div>
              <p className="text-sm">Contest Average Rating</p>
              <p className="text-lg">1504</p>
            </div>
            <RatingChart />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
