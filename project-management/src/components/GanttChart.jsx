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
    const totalDays = 31; // 예시로 31일 (1달) 기준으로 설정
    const startMonth = new Date("2024-10-01"); // 간트 차트 기준 날짜 설정
    const chartRef = useRef(null); // GanttChart 컨테이너 참조
    const [dayPositions, setDayPositions] = useState(new Map());

    // Gantt 차트 각 날짜 위치 계산
    useEffect(() => {
        if (chartRef.current) {
            const newPositions = new Map();
            const chartLeft = chartRef.current.getBoundingClientRect().left;

            // 각 날짜 요소의 실제 위치를 가져와 `dayPositions`에 저장
            Array.from(chartRef.current.querySelectorAll(".gantt-day")).forEach(
                (day, index) => {
                    const positionLeft = day.getBoundingClientRect().left - chartLeft;
                    newPositions.set(index, positionLeft); // 인덱스를 0부터 시작하도록 수정
                }
            );

            setDayPositions(newPositions);
        }
    }, [chartRef, totalDays]);

    return (
        <div className="gantt-container" ref={chartRef}>
            {/* 날짜 헤더 */}
            <div className="gantt-header">
                {Array.from({ length: totalDays }, (_, i) => (
                    <div key={i} className="gantt-day">
                        {i + 1}
                    </div>
                ))}
            </div>

            {/* 각 Task의 간트 차트 */}
            {tasks.map((task) => {
                const startDate = new Date(task.planStartDate);
                const endDate = new Date(task.planEndDate);

                // 시작 위치를 월의 첫 날로부터 일 수 차이로 계산
                const startDay = Math.max(
                    Math.round((startDate - startMonth) / (1000 * 60 * 60 * 24)),
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
                                    (doDate - startMonth) / (1000 * 60 * 60 * 24)
                                ); // 인덱스를 0부터 시작하도록 수정

                                // Task의 시작 위치를 기준으로 `do` 위치 계산
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
