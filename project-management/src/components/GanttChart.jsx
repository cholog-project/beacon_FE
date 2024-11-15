import React, { useRef, useEffect, useState } from "react";
import "./GanttChart.css";

const getDaysBetweenDates = (startDate, endDate, includeEndDate = true) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return includeEndDate ? diffDays + 1 : diffDays;
};

const GanttChart = ({ tasks }) => {
    const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
    const chartRef = useRef(null);
    const [dayPositions, setDayPositions] = useState(new Map());

    const shiftDateRange = (months) => {
        const newStartDate = new Date(
            startDate.getFullYear(),
            startDate.getMonth() + months,
            1
        );
        setStartDate(newStartDate);
    };

    const generateCurrentMonthDateArray = (startDate) => {
        const dates = [];
        const month = startDate.getMonth();
        let currentDate = new Date(startDate);
        while (currentDate.getMonth() === month) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
    };

    const dateArray = generateCurrentMonthDateArray(startDate);

    useEffect(() => {
        if (chartRef.current) {
            const newPositions = new Map();
            const chartLeft = chartRef.current.getBoundingClientRect().left;

            Array.from(chartRef.current.querySelectorAll(".gantt-day")).forEach(
                (day, index) => {
                    const positionLeft = day.getBoundingClientRect().left - chartLeft;
                    newPositions.set(index, positionLeft);
                }
            );

            setDayPositions(newPositions);
        }
    }, [chartRef, dateArray.length]);

    return (
        <div className="gantt-container">
            <div className="gantt-header">
                <div className="gantt-controls">
                    <button onClick={() => shiftDateRange(-1)}>◀ 이전 달</button>
                    <button onClick={() => shiftDateRange(1)}>다음 달 ▶</button>
                </div>
                <div className="gantt-header-month">
                    {startDate.getFullYear()}년 {startDate.toLocaleString("default", { month: "long" })}
                </div>
                <div className="gantt-header-days" ref={chartRef}>
                    {dateArray.map((date, i) => (
                        <div key={i} className="gantt-day">
                            {date.getDate()}
                        </div>
                    ))}
                </div>
            </div>

            {tasks.map((task) => {
                const taskStartDate = new Date(task.planStartDate);
                const taskEndDate = new Date(task.planEndDate);
                const monthStart = dateArray[0];
                const monthEnd = dateArray[dateArray.length - 1];

                if (taskEndDate < monthStart || taskStartDate > monthEnd) {
                    return null;
                }

                // 중간 달 날짜 포함 계산
                const visibleStartDate = taskStartDate < monthStart ? monthStart : taskStartDate;
                const visibleEndDate = taskEndDate > monthEnd ? monthEnd : taskEndDate;

                const startDayIndex = Math.round((visibleStartDate - dateArray[0]) / (1000 * 60 * 60 * 24));
                const endDayIndex = Math.round((visibleEndDate - dateArray[0]) / (1000 * 60 * 60 * 24));

                // `endDayIndex`를 포함하도록 수정
                const taskDuration = endDayIndex - startDayIndex + 1;

                return (
                    <div key={task.id} className="gantt-task-row">
                        <div
                            className="gantt-task"
                            style={{
                                marginLeft: `${dayPositions.get(startDayIndex) || 0}px`,
                                width: `${taskDuration * (dayPositions.get(1) - dayPositions.get(0))}px`,
                            }}
                        >
                            <span className="gantt-task-title">{task.title}</span>
                            {task.doRecords.map((doRecord) => {
                                const doDate = new Date(doRecord.date);
                                const doDayIndex = Math.round((doDate - dateArray[0]) / (1000 * 60 * 60 * 24));
                                const doPositionRelativeToTask =
                                    (doDayIndex - startDayIndex) * (dayPositions.get(1) - dayPositions.get(0));
                                return (
                                    <div
                                        key={doRecord.id}
                                        className="gantt-do"
                                        style={{
                                            left: `${doPositionRelativeToTask}px`,
                                            width: `${dayPositions.get(1) - dayPositions.get(0)}px`,
                                        }}
                                    >
                                        do
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default GanttChart;
