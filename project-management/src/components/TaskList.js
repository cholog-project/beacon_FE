// src/components/TaskList.js
import React from 'react';

const TaskList = ({ tasks }) => {
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
                    <th>내용</th>
                </tr>
                </thead>
                <tbody>
                {tasks.map((task) => (
                    <tr key={task.id}>
                        <td>{task.id}</td>
                        <td>{task.title}</td>
                        <td>{task.assignee}</td>
                        <td>
                            {task.taskStartDate} - {task.taskEndDate}
                        </td>
                        <td>{task.taskDescription}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default TaskList;
