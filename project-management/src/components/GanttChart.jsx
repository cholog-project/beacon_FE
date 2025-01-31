import React, { useRef, useLayoutEffect, useState } from "react";
import "./GanttChart.css";

const getDaysBetweenDates = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
};

const GanttChart = ({ plans = [] }) => {
    const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
    const chartRef = useRef(null);
    const [dayPositions, setDayPositions] = useState(new Map());

    // 달 이동 함수
    const shiftDateRange = (months) => {
        const newStartDate = new Date(startDate.getFullYear(), startDate.getMonth() + months, 1);
        setStartDate(newStartDate);
    };

    // 현재 월의 날짜 배열 생성
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

    // 위치 계산을 위한 useLayoutEffect
    useLayoutEffect(() => {
        if (chartRef.current) {
            const newPositions = new Map();
            const chartLeft = chartRef.current.getBoundingClientRect().left;

            Array.from(chartRef.current.querySelectorAll(".gantt-day")).forEach((day, index) => {
                const positionLeft = day.getBoundingClientRect().left - chartLeft;
                newPositions.set(index, positionLeft);
            });

            setDayPositions(newPositions);
        }
    }, [dateArray.length, plans]);

    if (!plans || plans.length === 0) {
        return <div className="gantt-loading">Loading Gantt Chart...</div>;
    }

    return (
        <div className="gantt-container">
            {/* 날짜 이동 및 월 표시 */}
            <div className="gantt-header">
                <div className="gantt-controls">
                    <button onClick={() => shiftDateRange(-1)}>◀ 이전 달</button>
                    <div className="gantt-header-month">
                        {startDate.getFullYear()}년 {startDate.toLocaleString("default", { month: "long" })}
                    </div>
                    <button onClick={() => shiftDateRange(1)}>다음 달 ▶</button>
                </div>
                <div className="gantt-header-days" ref={chartRef}>
                    {dateArray.map((date, i) => (
                        <div key={i} className="gantt-day">
                            {date.getDate()}
                        </div>
                    ))}
                </div>
            </div>

            {/* 각 Plan의 간트 차트 */}
            {plans.map((plan) => {
                const planStartDate = new Date(plan.startDate);
                const planEndDate = new Date(plan.endDate);
                const monthStart = dateArray[0];
                const monthEnd = dateArray[dateArray.length - 1];

                // Plan이 현재 월에 보이는지 확인
                const isPlanVisible = !(planEndDate < monthStart || planStartDate > monthEnd);

                const visibleStartDate = planStartDate < monthStart ? monthStart : planStartDate;
                const visibleEndDate = planEndDate > monthEnd ? monthEnd : planEndDate;

                const startDayIndex = Math.round((visibleStartDate - dateArray[0]) / (1000 * 60 * 60 * 24));
                const endDayIndex = Math.round((visibleEndDate - dateArray[0]) / (1000 * 60 * 60 * 24));
                const planDuration = endDayIndex - startDayIndex + 1;

                return (
                    <div key={plan.id} className="gantt-task-row">
                        {isPlanVisible ? (
                            <div
                                className="gantt-task"
                                style={{
                                    marginLeft: `${dayPositions.get(startDayIndex) || 0}px`,
                                    width: `${planDuration * (dayPositions.get(1) - dayPositions.get(0))}px`,
                                }}
                            >
                                <span className="gantt-task-title">{plan.title}</span>

                                {/* 각 Do 기록 표시 */}
                                {plan.doRecords.map((doRecord) => {
                                    const doDate = new Date(doRecord.date);
                                    const doDayIndex = Math.round((doDate - dateArray[0]) / (1000 * 60 * 60 * 24));
                                    const doPositionRelativeToPlan =
                                        (doDayIndex - startDayIndex) * (dayPositions.get(1) - dayPositions.get(0));
                                    return (
                                        <div
                                            key={doRecord.id}
                                            className="gantt-do"
                                            style={{
                                                left: `${doPositionRelativeToPlan}px`,
                                                width: `${dayPositions.get(1) - dayPositions.get(0)}px`,
                                            }}
                                        >
                                            do
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="gantt-task-placeholder" style={{ height: "40px" }}></div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default GanttChart;
