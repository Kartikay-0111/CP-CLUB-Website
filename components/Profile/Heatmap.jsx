import React, { useState } from 'react';
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { Tooltip } from "react-tooltip";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ActivityHeatmap = ({ heatMapData }) => {
    const [timeOffset, setTimeOffset] = useState(0);

    // Calculate date ranges (9 months)
    const calculateDateRange = () => {
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() - (9 * timeOffset));
        const startDate = new Date(endDate);
        startDate.setMonth(startDate.getMonth() - 9);
        return { startDate, endDate };
    };

    const { startDate, endDate } = calculateDateRange();

    // Transform data to match calendar heatmap format
    const transformedData = heatMapData.map((item) => ({
        date: item.date,
        count: item.count,
    }));

    // Calculate total submissions
    const totalSubmissions = heatMapData.reduce((sum, item) => sum + item.count, 0);

    const monthLabels = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    // Dynamic color strength based on dataset
    const maxCount = Math.max(...heatMapData.map((d) => d.count), 1);

    const getIntensityLevel = (count) => {
        if (!count || count === 0) return 0;
        // ratio from 0..1
        const ratio = count / maxCount;
        const level = Math.ceil(ratio * 40);
        return Math.min(Math.max(level, 1), 4);
    };

    const getClassForValue = (value) => {
        if (!value || value.count === 0) return "color-empty";
        const level = getIntensityLevel(value.count);
        return `color-scale-${level}`;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const handlePrevious = () => {
        setTimeOffset(prev => prev + 1);
    };

    const handleNext = () => {
        setTimeOffset(prev => Math.max(0, prev - 1));
    };

    return (
        <div className="w-full py-5 px-7 rounded-xl shadow-lg bg-white">
            <style>{`
        .react-calendar-heatmap text {
          font-size: 12px;
          fill: #6B7280;
        }

        .react-calendar-heatmap .color-empty {
          fill: #F3F4F6;
        }

        .react-calendar-heatmap .color-scale-1 {
          fill: #A7F3D0;
        }

        .react-calendar-heatmap .color-scale-2 {
          fill: #6EE7B7;
        }

        .react-calendar-heatmap .color-scale-3 {
          fill: #34D399;
        }

        .react-calendar-heatmap .color-scale-4 {
          fill: #10B981;
        }

        .react-calendar-heatmap rect {
          rx: 2;
          stroke: #E5E7EB;
          stroke-width: 1;
          transition: all 0.2s ease;
        }

        .react-calendar-heatmap rect:hover {
          stroke: #10B981;
          stroke-width: 2;
          opacity: 0.8;
        }
      `}</style>

            <div className="flex flex-col gap-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-800">Activity Heatmap</h3>
                        <span className="text-sm text-slate-500">{totalSubmissions} submissions</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-700">
                            {startDate.getFullYear() === endDate.getFullYear()
                                ? endDate.getFullYear()
                                : `${startDate.getFullYear()} - ${endDate.getFullYear()}`}
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handlePrevious}
                                className="p-1.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                                title="Previous period"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={handleNext}
                                className="p-1.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                                disabled={timeOffset === 0}
                                title="Next period"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Heatmap */}
                <div className="w-full overflow-x-auto">
                    <CalendarHeatmap
                        startDate={startDate}
                        endDate={endDate}
                        values={transformedData}
                        classForValue={getClassForValue}
                        tooltipDataAttrs={(value) => ({
                            "data-tooltip-id": "heatmap-tooltip",
                            "data-tooltip-content": value && value.date
                                ? `${formatDate(value.date)}: ${value.count} submission${value.count !== 1 ? 's' : ''}`
                                : 'No submissions',
                        })}
                        showWeekdayLabels={true}
                        weekdayLabels={['S', 'M', 'T', 'W', 'T', 'F', 'S']}
                        monthLabels={monthLabels}
                        gutterSize={3}
                    />
                </div>

                {/* Legend */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Less</span>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-sm bg-gray-100 border border-gray-200"></div>
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#A7F3D0' }}></div>
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#6EE7B7' }}></div>
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#34D399' }}></div>
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#10B981' }}></div>
                    </div>
                    <span>More</span>
                </div>

                <Tooltip
                    id="heatmap-tooltip"
                    style={{
                        backgroundColor: 'rgba(17, 24, 39, 0.95)',
                        color: '#fff',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        fontSize: '13px',
                        fontWeight: '500',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    }}
                />
            </div>
        </div>
    );
};
export default ActivityHeatmap;