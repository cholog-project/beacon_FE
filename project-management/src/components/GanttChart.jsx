// src/components/GanttChart.js

import React from 'react';
import './GanttChart.css';

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
    const startMonth = new Date('2024-10-01'); // 간트 차트 기준 날짜 설정

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
                const startDate = new Date(task.planStartDate);
                const endDate = new Date(task.planEndDate);

                // 시작 위치를 월의 첫 날로부터 일 수 차이로 계산 (0부터 시작)
                const startDay = Math.ceil((startDate - startMonth) / (1000 * 60 * 60 * 24));
                const taskDuration = getDaysBetweenDates(task.planStartDate, task.planEndDate);

                return (
                    <div key={task.id} className="gantt-task-row">
                        <div
                            className={`gantt-task ${task.assignee === '김도연' ? 'first' : task.assignee === '김성재' ? 'second' :
                                                    task.assignee === '김수현' ? 'third' : task.assignee === '허준기' ? 'fourth' : ''}`}
                            style={{
                                marginLeft: `${startDay * 30}px`,  // 시작 날짜에 맞게 위치 조정
                                width: `${taskDuration * 30}px`,   // 작업 기간에 맞게 길이 조정
                            }}
                        >
                            {/*{task.title}*/}
                        </div>

                        {/* Do 기록 표시 */}
                        {task.doRecords.map((doRecord, index) => {
                            const doDate = new Date(doRecord.date);
                            const doDay = Math.ceil((doDate - startMonth) / (1000 * 60 * 60 * 24));

                            return (
                                <div
                                    key={index}
                                    className={`gantt-do ${task.assignee === '김도연' ? 'first-do' : task.assignee === '김성재' ? 'second-do' :
                                                        task.assignee === '김수현' ? 'third-do' : task.assignee === '허준기' ? 'fourth-do' : ''}`}
                                    style={{
                                        marginLeft: `${doDay * 30}px`,
                                    }}
                                    title={`${doRecord.status} on ${doRecord.date}`}
                                >
                                    {/* Do 내용 */}
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
};

export default GanttChart;