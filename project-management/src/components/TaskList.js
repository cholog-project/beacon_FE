// src/components/TaskList.js
import React, { useState } from 'react';
import './TaskList.css';

const TaskList = ({ tasks }) => {
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
            </div>

            {tasks.map((task) => (
                <React.Fragment key={task.id}>
                    {/* Main task row */}
                    <div className="task-row">
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
                                {task.doRecords.map((doRecord, index) => (
                                    <div key={index} className="do-row">
                                        <div>{doRecord.date}</div>
                                        <div>{doRecord.status}</div>
                                        <div>{doRecord.description}</div>
                                        <div>{doRecord.createdAt}</div>
                                        <div>{doRecord.updatedAt}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

export default TaskList;
