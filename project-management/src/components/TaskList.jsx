import React, { useState, memo } from 'react';
import './TaskList.css';

const TaskList = memo(({ tasks, onFetchDoRecords, onAddPlanClick, onDeletePlan, onAddDoClick, onDeleteDo }) => {
    const [expandedPlanId, setExpandedPlanId] = useState(null);

    const toggleDropdown = async (planId) => {
        if (expandedPlanId === planId) {
            setExpandedPlanId(null); // 닫기
        } else {
            setExpandedPlanId(planId);
            const plan = tasks.find(plan => plan.id === planId);
            if (plan && plan.doRecords.length === 0) {
                await onFetchDoRecords(planId);
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
                <div className="task-status">Status</div>
                <div className="task-description">Description</div>
                <button className="add-button" onClick={onAddPlanClick}>+ Plan 추가</button>
            </div>

            {tasks.map((plan) => (
                <React.Fragment key={plan.id}>
                    <div className="task-row">
                        <button className="delete-button" onClick={() => onDeletePlan(plan.id)}>x</button>
                        <div className="task-id">{plan.id}</div>
                        <div className="task-title">{plan.title}</div>
                        <div className="task-assignee">{plan.assignee}</div>
                        <div className="task-dates">{plan.startDate} - {plan.endDate}</div>
                        <div className="task-status">{plan.status}</div>
                        <div className="task-description">{plan.description}</div>
                        <button className="dropdown-button" onClick={() => toggleDropdown(plan.id)}>
                            {expandedPlanId === plan.id ? '▲' : '▼'}
                        </button>
                    </div>

                    {/* Dropdown content */}
                    {expandedPlanId === plan.id && (
                        <div className="dropdown-content">
                            <div className="do-section">
                                <h4>DO Records</h4>
                                {plan.doRecords.length > 0 ? (
                                    plan.doRecords.map((doRecord) => (
                                        <div className="do-row" key={doRecord.id}>
                                            <button className="delete-button" onClick={() => onDeleteDo(doRecord.id)}>x</button>
                                            <div>{doRecord.date}</div>
                                            <div>{doRecord.description}</div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No Do Records</p>
                                )}
                                <button className="add-button" onClick={() => onAddDoClick(plan.id)}>+ Do 추가</button>
                            </div>
                        </div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
});

export default TaskList;
