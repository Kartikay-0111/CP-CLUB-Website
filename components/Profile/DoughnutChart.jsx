"use client";
import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const DoughnutChart = ({data}) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
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
            data: [data[1].count, data[2].count, data[3].count],
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

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, []);

  return (
    <>
      <div className="relative w-fit h-fit">
        <canvas ref={chartRef} width="30" height="30" className="doughnutPie" />
        <p className="absolute inset-0 flex justify-center items-center text-3xl">
          {data[0].count}
        </p>
      </div>
      <div className="w-full flex flex-col justify-center gap-1">
        {["Easy", "Medium", "Hard"].map((item, index) => (
          <div
            key={index}
            className={`flex justify-between w-full bg-[#F5F6FE] px-3 py-1 rounded-md ${
              item === "Easy"
                ? "text-[#4CAF50]"
                : item === "Medium"
                ? "text-[#bfb029]"
                : "text-[#FF5722]"
            }`}
          >
            <p>{item}</p>
            <p className="text-black">{data[index+1].count}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default DoughnutChart;
