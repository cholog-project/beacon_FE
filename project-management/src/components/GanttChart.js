// src/components/GanttChart.js
import React from 'react';
import './GanttChart.css';

// 날짜 차이를 계산하는 함수 (일수 차이)
const getDaysBetweenDates = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

const GanttChart = ({ tasks }) => {
    const totalDays = 31; // 예시로 31일 (1달) 기준으로 설정

    return (
        <div className="gantt-container">
            <div className="gantt-header">
                {Array.from({ length: totalDays }, (_, i) => (
                    <div key={i} className="gantt-day">
                        {i + 1}
                    </div>
                ))}
            </div>
            {tasks.map((task) => {
                const startDay = new Date(task.planStartDate).getDate(); // 계획 시작일의 일수
                const taskDuration = getDaysBetweenDates(task.planStartDate, task.planEndDate); // 계획 기간

                return (
                    <div key={task.id} className="gantt-task-row">
                        {/* 파란색 막대: 계획된 기간 */}
                        <div
                            className="gantt-task"
                            style={{
                                marginLeft: `${startDay * 30}px`,
                                width: `${taskDuration * 30}px`,
                            }}
                        >
                            {task.title}
                        </div>

                        {/* 분홍색 막대: Do 날짜들 */}
                        {task.doRecords.map((doRecord, index) => {
                            const doDay = new Date(doRecord.date).getDate(); // Do 날짜의 일수
                            return (
                                <div
                                    key={index}
                                    className="gantt-do"
                                    style={{
                                        marginLeft: `${doDay * 30}px`,
                                    }}
                                    title={`${doRecord.status} on ${doRecord.date}`} // 상태와 날짜를 툴팁으로 표시
                                ></div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
};

export default GanttChart;
