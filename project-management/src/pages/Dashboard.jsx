import React, { useState, useEffect } from 'react';
import TaskList from '../components/TaskList';
import GanttChart from '../components/GanttChart';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from "../constant/index.tsx";

const Dashboard = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]); // Task 목록

    // Task 목록을 API에서 가져오는 함수
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch(`${BASE_URL}/project/tasks`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log(data); // 데이터 확인용

                // Task 데이터를 변환하여 상태에 저장
                const formattedTasks = data.tasks.map((task) => ({
                    id: task.id,
                    title: task.title,
                    assignee: '팀원 ' + task.teamMemberId,
                    taskStartDate: task.startDate,
                    taskEndDate: task.endDate,
                    planStartDate: task.planStartDate || task.startDate,
                    planEndDate: task.planEndDate || task.endDate,
                    doRecords: [] // Do 기록은 처음에는 비워둠, 클릭할 때 API로 가져옴
                }));
                setTasks(formattedTasks);
            } catch (error) {
                console.error('작업 데이터를 가져오는 중 오류 발생:', error);
            }
        };

        fetchTasks();
    }, []);

    // 특정 Task의 Do 기록을 API에서 가져오는 함수
    const fetchDoRecords = async (taskId) => {
        try {
            console.log(`Fetching Do records for Task ID: ${taskId}`);
            const response = await fetch(`${BASE_URL}/project/tasks/${taskId}/dos`);
            if (!response.ok) {
                throw new Error(`Failed to fetch Do records for task ${taskId}`);
            }
            const doRecordsData = await response.json();
            console.log(`Do records fetched for Task ID: ${taskId}`, doRecordsData);

            // 상태 업데이트: 특정 task의 doRecords만 업데이트
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task.id === taskId ? { ...task, doRecords: doRecordsData.dos } : task
                )
            );
        } catch (error) {
            console.error(`Do 기록을 가져오는 중 오류 발생 (Task ID: ${taskId}):`, error);
        }
    };

    // Task 추가 페이지로 이동하는 함수
    const handleAddTaskClick = () => {
        navigate('/newTask');
    };

    // Do 추가 페이지로 이동하는 함수
    const handleAddDoClick = (taskId) => {
        navigate(`/newDo/${taskId}`);
    };

    return (
        <div style={{ display: 'flex' }}>
            <div style={{ width: '40%' }}>
                <TaskList
                    tasks={tasks}
                    onFetchDoRecords={fetchDoRecords} // Do 기록을 가져오는 함수 전달
                    onAddTaskClick={handleAddTaskClick} // Task 추가 버튼 핸들러
                    onAddDoClick={handleAddDoClick}    // Do 추가 버튼 핸들러
                />
            </div>
            <div style={{ width: '60%' }}>
                <GanttChart tasks={tasks} />
            </div>
        </div>
    );
};

export default Dashboard;