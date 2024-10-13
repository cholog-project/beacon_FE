// src/components/TaskList.js
import React, { useState } from 'react';

const TaskList = ({ tasks }) => {
    const [expandedTaskId, setExpandedTaskId] = useState(null); // 드롭다운 상태 관리

    const toggleDropdown = (taskId) => {
        // 현재 선택된 Task를 다시 클릭하면 닫히고, 다른 Task를 클릭하면 그 Task가 열림
        setExpandedTaskId((prevId) => (prevId === taskId ? null : taskId));
    };

    return (
        <div>
            <h3>작업 목록</h3>
            <table>
                <thead>
                <tr>
                    <th>#</th>
                    <th>제목</th>
                    <th>담당자</th>
                    <th>시작-종료</th>
                    <th></th> {/* 드롭다운 아이콘을 위한 빈 칸 */}
                </tr>
                </thead>
                <tbody>
                {tasks.map((task) => (
                    <React.Fragment key={task.id}>
                        <tr>
                            <td>{task.id}</td>
                            <td>{task.title}</td>
                            <td>{task.assignee}</td>
                            <td>{task.taskStartDate} - {task.taskEndDate}</td>
                            <td>
                                <button onClick={() => toggleDropdown(task.id)}>
                                    {expandedTaskId === task.id ? '▲' : '▼'} {/* 드롭다운 아이콘 */}
                                </button>
                            </td>
                        </tr>

                        {/* 드롭다운이 열려 있을 경우, PLAN과 DO 리스트를 표시 */}
                        {expandedTaskId === task.id && (
                            <tr>
                                <td colSpan="5">
                                    <div>
                                        <h4>Plan</h4>
                                        <p>
                                            {task.planStartDate} - {task.planEndDate}
                                        </p>
                                        <h4>Do Records</h4>
                                        <table>
                                            <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Status</th>
                                                <th>Description</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {task.doRecords.map((doRecord, index) => (
                                                <tr key={index}>
                                                    <td>{doRecord.date}</td>
                                                    <td>{doRecord.status}</td>
                                                    <td>{doRecord.description}</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default TaskList;
