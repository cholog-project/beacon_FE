// src/components/TaskList.js
import React, { useState } from 'react';
import './TaskList.css';

const TaskList = ({ tasks, onAddTask, onDeleteTask, onAddDoRecord, onDeleteDoRecord }) => {
    const [expandedTaskId, setExpandedTaskId] = useState(null);

    const toggleDropdown = (taskId) => {
        setExpandedTaskId((prevId) => (prevId === taskId ? null : taskId));
    };

    return (
        <div className="task-container">
            <div className="task-header">
                <div>#</div>
                <div>Title</div>
                <div>Assignee</div>
                <div>Start - End</div>
                <div>Description</div>
                <div>Created</div>
                <div>Updated</div>
                <button className="add-button" onClick={onAddTask}>+ Task 추가</button> {/* Task 추가 버튼 */}
            </div>

            {tasks.map((task) => (
                <React.Fragment key={task.id}>
                    {/* Main task row */}
                    <div className="task-row">
                        <button className="delete-button" onClick={() => onDeleteTask(task.id)}>x</button> {/* Task 삭제 버튼 */}
                        <div>{task.id}</div>
                        <div>{task.title}</div>
                        <div>{task.assignee}</div>
                        <div>{task.taskStartDate} - {task.taskEndDate}</div>
                        <div>{task.description}</div>
                        <div>{task.createdAt}</div>
                        <div>{task.updatedAt}</div>
                        <button className="dropdown-button" onClick={() => toggleDropdown(task.id)}>
                            {expandedTaskId === task.id ? '▲' : '▼'}
                        </button>
                    </div>

                    {/* Dropdown content */}
                    {expandedTaskId === task.id && (
                        <div className="dropdown-content">
                            <div className="plan-section">
                                <h4>PLAN</h4>
                                <p>{task.planStartDate} - {task.planEndDate}</p>
                            </div>
                            <div className="do-section">
                                <h4>DO Records</h4>
                                {task.doRecords.map((doRecord) => (
                                    <div key={doRecord.id} className="do-row">
                                        <button className="delete-button" onClick={() => onDeleteDoRecord(task.id, doRecord.id)}>x</button> {/* Do 삭제 버튼 */}
                                        <div>{doRecord.date}</div>
                                        <div>{doRecord.status}</div>
                                        <div>{doRecord.description}</div>
                                    </div>
                                ))}
                                <button className="add-button" onClick={() => onAddDoRecord(task.id)}>+ Do 추가</button> {/* Do 추가 버튼 */}
                            </div>
                        </div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

export default TaskList;
