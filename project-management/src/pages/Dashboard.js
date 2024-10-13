// src/pages/Dashboard.js
import React, { useState } from 'react';
import TaskList from '../components/TaskList';
import GanttChart from '../components/GanttChart';

const Dashboard = () => {
    const [tasks] = useState([
        {
            id: 1,
            title: 'Task 1',
            assignee: '김수현',
            taskStartDate: '2024-10-01',
            taskEndDate: '2024-10-15',
            planStartDate: '2024-10-02',
            planEndDate: '2024-10-12',
            doRecords: [
                { date: '2024-10-02', status: 'start' ,description:'시작이다'},
                { date: '2024-10-05', status: 'in-progress' ,description:'진행이다'},
                { date: '2024-10-08', status: 'complete' ,description:'종료다'},
            ],
        },
        {
            id: 2,
            title: 'Task 2',
            assignee: '이준호',
            taskStartDate: '2024-10-05',
            taskEndDate: '2024-10-20',
            planStartDate: '2024-10-06',
            planEndDate: '2024-10-15',
            doRecords: [
                { date: '2024-10-06', status: 'start' },
                { date: '2024-10-09', status: 'in-progress' },
            ],
        },
    ]);

    return (
        <div style={{ display: 'flex' }}>
            <div style={{ width: '40%' }}>
                <TaskList tasks={tasks} />
            </div>
            <div style={{ width: '60%' }}>
                <GanttChart tasks={tasks} />
            </div>
        </div>
    );
};

export default Dashboard;
