import React, { useRef, useEffect, useState } from "react";
import "./GanttChart.css";

// 날짜 차이를 계산하는 함수 (일수 차이)
const getDaysBetweenDates = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // 마지막 날 포함
    return diffDays;
};

const GanttChart = ({ tasks }) => {
    const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1)); // 현재 달의 첫 날
    const chartRef = useRef(null);
    const [dayPositions, setDayPositions] = useState(new Map());

    // 날짜 범위 이동 함수 (버튼으로 한 달씩 이동)
    const shiftDateRange = (months) => {
        const newStartDate = new Date(
            startDate.getFullYear(),
            startDate.getMonth() + months,
            1
        );
        setStartDate(newStartDate);
    };

    // 현재 월 날짜 배열 생성
    const generateCurrentMonthDateArray = (startDate) => {
        const dates = [];
        const month = startDate.getMonth();
        let currentDate = new Date(startDate);

        while (currentDate.getMonth() === month) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1); // 하루씩 증가
        }

        return dates;
    };

    const dateArray = generateCurrentMonthDateArray(startDate); // 현재 월만 표시

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

            {/* 각 Task의 간트 차트 */}
            {tasks.map((task) => {
                const taskStartDate = new Date(task.planStartDate);
                const taskEndDate = new Date(task.planEndDate);

                // 각 달에 대해 마지막 날과 첫 날을 개별적으로 처리
                let visibleStartDate, visibleEndDate;

                if (taskStartDate.getMonth() === startDate.getMonth()) {
                    visibleStartDate = taskStartDate;
                    visibleEndDate = taskEndDate > dateArray[dateArray.length - 1] ? dateArray[dateArray.length - 1] : taskEndDate;
                } else if (taskEndDate.getMonth() === startDate.getMonth()) {
                    visibleStartDate = dateArray[0];
                    visibleEndDate = taskEndDate.getDate() <= 3 ? taskEndDate : new Date(taskEndDate.setDate(3)); // 3일까지 표시
                } else {
                    visibleStartDate = taskStartDate;
                    visibleEndDate = taskEndDate;
                }

                const startDayIndex = Math.round((visibleStartDate - startDate) / (1000 * 60 * 60 * 24));
                const taskDuration = getDaysBetweenDates(visibleStartDate, visibleEndDate);

                // 디버깅 로그 추가
                console.log(`Task: ${task.title}`);
                console.log(`Original Start Date: ${taskStartDate.toDateString()}, Original End Date: ${taskEndDate.toDateString()}`);
                console.log(`Visible Start Date: ${visibleStartDate.toDateString()}, Visible End Date: ${visibleEndDate.toDateString()}`);
                console.log(`Calculated Start Day Index: ${startDayIndex}`);
                console.log(`Calculated Task Duration in Days: ${taskDuration}`);
                console.log(`---`);

                return (
                    <div key={task.id} className="gantt-task-row">
                        {/* Task 막대 */}
                        <div
                            className="gantt-task"
                            style={{
                                marginLeft: `${dayPositions.get(startDayIndex) || 0}px`,
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
