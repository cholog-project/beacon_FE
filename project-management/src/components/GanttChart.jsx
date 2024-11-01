import React, { useRef, useEffect, useState } from "react";
import "./GanttChart.css";

// 날짜 차이를 계산하는 함수 (일수 차이)
const getDaysBetweenDates = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // 마지막 날 포함하기 위해 +1
    return diffDays;
};

const GanttChart = ({ tasks }) => {
    // 초기 날짜를 2024년 10월로 설정
    const currentDate = new Date();
    const initialStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); // 현재 달의 첫 날
    const initialEndDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0); // 현재 달의 마지막 날

    const [startDate, setStartDate] = useState(initialStartDate);
    const [endDate, setEndDate] = useState(initialEndDate);
    const totalDays = getDaysBetweenDates(startDate, endDate);
    const chartRef = useRef(null);
    const [dayPositions, setDayPositions] = useState(new Map());

    // 날짜 범위 이동 함수
    const shiftDateRange = (months) => {
        const newStartDate = new Date(
            startDate.getFullYear(),
            startDate.getMonth() + months,
            1
        );
        const newEndDate = new Date(
            newStartDate.getFullYear(),
            newStartDate.getMonth() + 1,
            0
        );
        setStartDate(newStartDate);
        setEndDate(newEndDate);
    };

    // Gantt 차트 각 날짜 위치 계산
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
    }, [chartRef, totalDays]);

    return (
        <div className="gantt-container">
            <div className="gantt-header">
                <div className="gantt-controls">
                    <button onClick={() => shiftDateRange(-1)}>◀ 이전 달</button>
                    <button onClick={() => shiftDateRange(1)}>다음 달 ▶</button>
                </div>
                <div className="gantt-header-month">
                    {startDate.getFullYear()}년 {startDate.toLocaleString("default", {month: "long"})}
                </div>
                <div className="gantt-header-days" ref={chartRef}>
                    {Array.from({length: totalDays}, (_, i) => (
                        <div key={i} className="gantt-day">
                            {new Date(startDate.getTime() + i * 1000 * 60 * 60 * 24).getDate()}
                        </div>
                    ))}
                </div>
            </div>

            {/* 각 Task의 간트 차트 */}
            {tasks
                // 현재 월에 속하는 태스크만 필터링
                .filter((task) => {
                    const taskStartDate = new Date(task.planStartDate);
                    const taskEndDate = new Date(task.planEndDate);

                    // 현재 표시 중인 월과 비교하여 태스크의 시작/끝 날짜가 해당 월에 포함되는지 확인
                    return (
                        (taskStartDate >= startDate && taskStartDate <= endDate) ||
                        (taskEndDate >= startDate && taskEndDate <= endDate) ||
                        (taskStartDate <= startDate && taskEndDate >= endDate)
                    );
                })
                .map((task) => {
                    const taskStartDate = new Date(task.planStartDate);
                    const taskEndDate = new Date(task.planEndDate);

                    // 시작 위치를 월의 첫 날로부터 일 수 차이로 계산
                    const startDay = Math.max(
                        Math.round((taskStartDate - startDate) / (1000 * 60 * 60 * 24)),
                        0
                    );
                    const taskDuration = getDaysBetweenDates(
                        task.planStartDate,
                        task.planEndDate
                    );

                    return (
                        <div key={task.id} className="gantt-task-row">
                            {/* Task 막대 */}
                            <div
                                className="gantt-task"
                                style={{
                                    marginLeft: `${dayPositions.get(startDay) || 0}px`,
                                    width: `${taskDuration * (dayPositions.get(1) - dayPositions.get(0))}px`,
                                }}
                            >
                                <span className="gantt-task-title">{task.title}</span>

                                {/* 각 Do 레코드를 해당 날짜에 표시 */}
                                {task.doRecords.map((doRecord) => {
                                    const doDate = new Date(doRecord.date);
                                    const doDayIndex = Math.round(
                                        (doDate - startDate) / (1000 * 60 * 60 * 24)
                                    );

                                    const doPositionRelativeToTask =
                                        (doDayIndex - startDay) * (dayPositions.get(1) - dayPositions.get(0));

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
