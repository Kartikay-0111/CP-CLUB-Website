"use client";
import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const DoughnutChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const isLeetCode = Array.isArray(data);
  let easy = 0,
    medium = 0,
    hard = 0,
    total = 0;

  if (isLeetCode && data?.length >= 4) {
    // LeetCode structure
    total = data[0]?.count || 0;
    easy = data[1]?.count || 0;
    medium = data[2]?.count || 0;
    hard = data[3]?.count || 0;
  } else if (data && typeof data === "object") {
    // Codeforces structure
    easy = data.fundamental?.reduce(
      (sum, topic) => sum + (topic.problemsSolved || 0),
      0
    );
    medium = data.intermediate?.reduce(
      (sum, topic) => sum + (topic.problemsSolved || 0),
      0
    );
    hard = data.advanced?.reduce(
      (sum, topic) => sum + (topic.problemsSolved || 0),
      0
    );
    total = easy + medium + hard;
  }

  useEffect(() => {
    if (!chartRef.current) return;
    const ctx = chartRef.current.getContext("2d");

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Easy", "Medium", "Hard"],
        datasets: [
          {
            label: "DSA Progress",
            data: [easy, medium, hard],
            backgroundColor: ["#4CAF50", "#FFEB3B", "#FF5722"],
            borderColor: "#fff",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        elements: { arc: { borderWidth: 1 } },
        cutout: "70%",
      },
    });

    return () => chartInstanceRef.current?.destroy();
  }, [easy, medium, hard]);

  return (
    <>
      <div className="relative w-fit h-fit">
        <canvas ref={chartRef} width="30" height="30" className="doughnutPie" />
        <p className="absolute inset-0 flex justify-center items-center text-3xl">
          {total}
        </p>
      </div>
      <div className="w-full flex flex-col justify-center gap-1">
        {[
          { label: "Easy", value: easy, color: "#4CAF50" },
          { label: "Medium", value: medium, color: "#bfb029" },
          { label: "Hard", value: hard, color: "#FF5722" },
        ].map((item, index) => (
          <div
            key={index}
            className="flex justify-between w-full bg-[#F5F6FE] px-3 py-1 rounded-md"
            style={{ color: item.color }}
          >
            <p>{item.label}</p>
            <p className="text-black">{item.value}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default DoughnutChart;
