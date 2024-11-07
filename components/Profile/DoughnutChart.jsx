"use client"
import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const DoughnutChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Easy", "Medium", "Hard"],
        datasets: [
          {
            label: "DSA Progress",
            data: [202, 219, 29],
            backgroundColor: ["#4CAF50", "#FFEB3B", "#FF5722"],
            borderColor: "#fff",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
        },
        elements: {
          arc: {
            borderWidth: 1,
          },
        },
        cutout: "70%",
      },
    });
  }, []);

  return (
    <div className="relative w-fit h-fit">
      <canvas ref={chartRef} width="30" height="30" className="doughnutPie" />
      <p className="absolute inset-0 flex justify-center items-center text-3xl">350</p>
    </div>
  );
};

export default DoughnutChart;
