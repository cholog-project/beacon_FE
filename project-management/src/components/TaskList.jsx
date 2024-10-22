import React, { useState, memo } from 'react';
import './TaskList.css';

const TaskList = memo(({ tasks, onFetchDoRecords, onAddTaskClick, onDeleteTask, onAddDoClick }) => {
    const [expandedTaskId, setExpandedTaskId] = useState(null);

    const toggleDropdown = async (taskId) => {
        if (expandedTaskId === taskId) {
            setExpandedTaskId(null); // 이미 열려있으면 닫기
        } else {
            setExpandedTaskId(taskId);
            const task = tasks.find(task => task.id === taskId);
            if (task && task.doRecords.length === 0) {
                // Do Records가 없는 경우 API 호출
                await onFetchDoRecords(taskId);
            }
        }
    };

    return (
        <div className="task-container">
            <div className="task-header">
                <div className="task-id">#</div>
                <div className="task-title">Title</div>
                <div className="task-assignee">Assignee</div>
                <div className="task-dates">Start - End</div>
                <div className="task-description">Description</div>
                <div className="task-created">Created</div>
                <div className="task-updated">Updated</div>
                <button className="add-button" onClick={onAddTaskClick}>+ Task 추가</button>
            </div>

            {tasks.map((task) => (
                <React.Fragment key={task.id}>
                    <div className="task-row">
                        <button className="delete-button" onClick={() => onDeleteTask(task.id)}>x</button>
                        <div className="task-id">{task.id}</div>
                        <div className="task-title">{task.title}</div>
                        <div className="task-assignee">{task.assignee}</div>
                        <div className="task-dates">{task.taskStartDate} - {task.taskEndDate}</div>
                        <div className="task-description">{task.description}</div>
                        <div className="task-created">{task.createdAt}</div>
                        <div className="task-updated">{task.updatedAt}</div>
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
                                {/* Do Records가 있는 경우 헤더 추가 */}
                                {task.doRecords.length > 0 && (
                                    <div className="do-records-header">
                                        <span className="do-header-item">Date</span>
                                        <span className="do-header-item">Status</span>
                                        <span className="do-header-item">Description</span>
                                    </div>
                                )}
                                {/* Do Records 출력 */}
                                {task.doRecords.length > 0 ? (
                                    task.doRecords.map((doRecord) => (
                                        <div key={doRecord.id} className="do-row">
                                            <button className="delete-button" onClick={() => onDeleteTask(task.id, doRecord.id)}>x</button>
                                            <div>{doRecord.date}</div>
                                            <div>{doRecord.status}</div>
                                            <div>{doRecord.description}</div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No Do Records</p>
                                )}
                                <button className="add-button" onClick={() => onAddDoClick(task.id)}>+ Do 추가</button>
                            </div>
                        </div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
});

export default TaskList;