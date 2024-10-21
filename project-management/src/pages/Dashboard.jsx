import React, { useState, useEffect } from 'react';
import TaskList from '../components/TaskList';
import GanttChart from '../components/GanttChart';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from "../constant/index.tsx";

const Dashboard = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);

    // API에서 데이터를 가져오는 함수
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch(`${BASE_URL}/project/tasks`); // 백틱 사용
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json(); // JSON 파싱
                console.log(data); // 데이터 확인용

                // API 데이터 형식을 현재 구조에 맞게 변환
                const formattedTasks = data.tasks.map((task) => ({
                    id: task.id,
                    title: task.title,
                    assignee: '팀원 ' + task.teamMemberId, // 팀원의 실제 이름이 필요한 경우, 추가 로직 작성 필요
                    taskStartDate: task.startDate,
                    taskEndDate: task.endDate,
                    planStartDate: task.planStartDate || task.startDate, // 계획 시작일이 실제 시작일과 다를 경우, API 데이터에서 받아오기
                    planEndDate: task.planEndDate || task.endDate,       // 계획 종료일이 실제 종료일과 다를 경우, API 데이터에서 받아오기
                    doRecords: task.doRecords || [], // Do 기록 로직을 추가할 수 있음
                }));
                setTasks(formattedTasks);
            } catch (error) {
                console.error('작업 데이터를 가져오는 중 오류 발생:', error);
            }
        };

        fetchTasks();
    }, []); // 컴포넌트가 처음 렌더링될 때만 API 호출

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

    const handleAddTaskClick = () => {
        navigate('/newTask'); // 'newTask' 페이지로 이동
    };

    const handleAddDoClick = (taskId) => {
        navigate(`/newDo/${taskId}`); // 'newDo' 페이지로 이동
    };

    return (
        <div style={{ display: 'flex' }}>
            <div style={{ width: '40%' }}>
                <TaskList
                    tasks={tasks}
                    onAddTaskClick={handleAddTaskClick} // Task 추가 버튼 클릭 이벤트 핸들러
                    onAddDoClick={(taskId) => handleAddDoClick(taskId)}    // Do 기록 추가 버튼 클릭 이벤트 핸들러
                />
            </div>
            <div style={{ width: '60%' }}>
                <GanttChart tasks={tasks} />
            </div>
        </div>
    );
};

export default Dashboard;