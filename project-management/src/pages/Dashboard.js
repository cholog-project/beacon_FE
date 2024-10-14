// src/pages/Dashboard.js
import React, { useState } from 'react';
import TaskList from '../components/TaskList';
import GanttChart from '../components/GanttChart';

const Dashboard = () => {
    const [tasks, setTasks] = useState([
        {
            id: 1,
            title: 'Task 1',
            assignee: '김수현',
            taskStartDate: '2024-10-01',
            taskEndDate: '2024-10-15',
            planStartDate: '2024-10-02',
            planEndDate: '2024-10-12',
            doRecords: [
                { id: 1, date: '2024-10-02', status: 'start', description: '시작이다' },
                { id: 2, date: '2024-10-05', status: 'in-progress', description: '진행이다' },
                { id: 3, date: '2024-10-08', status: 'complete', description: '종료다' },
            ],
            color: 'blue'
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
                { id: 1, date: '2024-10-06', status: 'start' },
                { id: 2, date: '2024-10-09', status: 'in-progress' },
            ],
            color: 'green'
        },
    ]);

    // Task 추가
    const addTask = () => {
        const newTask = {
            id: tasks.length + 1,
            title: `Task ${tasks.length + 1}`,
            assignee: '새로운 사람',
            taskStartDate: '2024-10-10',
            taskEndDate: '2024-10-20',
            planStartDate: '2024-10-11',
            planEndDate: '2024-10-19',
            doRecords: [],
        };
        setTasks([...tasks, newTask]);
    };

    // Task 삭제
    const deleteTask = (taskId) => {
        setTasks(tasks.filter((task) => task.id !== taskId));
    };

    // Do 기록 추가
    const addDoRecord = (taskId) => {
        setTasks(tasks.map((task) => {
            if (task.id === taskId) {
                const newDoRecord = {
                    id: task.doRecords.length + 1,
                    date: '2024-10-10',
                    status: 'new',
                    description: '새로운 Do 기록'
                };
                return { ...task, doRecords: [...task.doRecords, newDoRecord] };
            }
            return task;
        }));
    };

    // Do 기록 삭제
    const deleteDoRecord = (taskId, doId) => {
        setTasks(tasks.map((task) => {
            if (task.id === taskId) {
                return { ...task, doRecords: task.doRecords.filter((doRecord) => doRecord.id !== doId) };
            }
            return task;
        }));
    };

    return (
        <div style={{ display: 'flex' }}>
            <div style={{ width: '40%' }}>
                <TaskList
                    tasks={tasks}
                    onAddTask={addTask}
                    onDeleteTask={deleteTask}
                    onAddDoRecord={addDoRecord}
                    onDeleteDoRecord={deleteDoRecord}
                />
            </div>
            <div style={{ width: '60%' }}>
                <GanttChart tasks={tasks} />
            </div>
        </div>
    );
};

export default Dashboard;
