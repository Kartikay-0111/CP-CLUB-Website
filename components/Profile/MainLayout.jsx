import Image from "next/image";
import React from "react";
import DoughnutChart from "./DoughnutChart";

function MainLayout() {

  const topData = [
    {
      image: "/svgs/puzzle.svg",
      title: "Total Questions",
      count: 390,
    },
    {
      image: "/svgs/trophy.svg",
      title: "Total Contests",
      count: 22,
    },
    {
      image: "/svgs/active-days.svg",
      title: "Total Active Days",
      count: 368,
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
        <div className="w-full">
          <div className=" w-full py-5 px-7 rounded-xl shadow-custom flex flex-col gap-5 bg-white">
            <p>Problems Solved</p>
            <p className="text-sm text-slate-500">
              Problems solved from leetcode
            </p>
            <div className="flex gap-3">
              <DoughnutChart />
              <div className="w-full flex flex-col justify-center gap-1">
                {["Easy", "Medium", "Hard"].map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between w-full bg-[#F5F6FE] px-3 py-1 rounded-md"
                  >
                    <p>{item}</p>
                    <p>100</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* right part */}
        <div className="w-full">
          <div className=" w-full py-5 px-7 rounded-xl shadow-custom flex items-center gap-5 bg-white">
            670 submissions in last year
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
