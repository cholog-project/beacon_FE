import React, { useState, useEffect } from 'react';
import TaskList from '../components/TaskList';
import GanttChart from '../components/GanttChart';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from "../constant/index.tsx";

const Dashboard = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]); // Task 목록
    const [teamMembers, setTeamMembers] = useState([]);

    // 팀 멤버를 가져오는 useEffect 추가
    useEffect(() => {
        const fetchTeamMembers = async () => {
            try {
                const response = await fetch(`${BASE_URL}/projects/1/members`); // 프로젝트 ID에 맞게 수정
                if (!response.ok) {
                    throw new Error('Failed to fetch team members');
                }
                const data = await response.json();
                setTeamMembers(data.projectMembers); // 팀 멤버 상태 설정
            } catch (error) {
                console.error('Failed to fetch team members:', error);
            }
        };

        fetchTeamMembers(); // 팀 멤버 가져오기 호출
    }, []);

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
                    assignee: teamMembers.find(member => member.memberId === task.teamMemberId)?.name || 'Unknown',
                    taskStartDate: task.startDate,
                    taskEndDate: task.endDate,
                    description: task.description,
                    planStartDate: task.planStartDate || task.startDate,
                    planEndDate: task.planEndDate || task.endDate,
                    doRecords: [],
                }));
                setTasks(formattedTasks);
                data.tasks.map((task) => (
                    fetchDoRecords(task.id)
                ))
            } catch (error) {
                console.error('작업 데이터를 가져오는 중 오류 발생:', error);
            }
        };

        fetchTasks();
    }, [teamMembers]);

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

    const handleDeleteTask = async (taskId) => {
        try {
            const response = await fetch(`${BASE_URL}/project/tasks/${taskId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setTasks(tasks.filter(task => task.id !== taskId));
        } catch (error) {
            console.error('작업 삭제 중 오류 발생:', error);
        }
    };

    // Do 삭제
    const handleDeleteDo = async (doId) => {
        try {
            console.log(`Attempting to delete Do with ID: ${doId}`);
            const response = await fetch(`${BASE_URL}/project/tasks/dos/${doId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            console.log(`Do with ID ${doId} successfully deleted`);

            // 상태 업데이트: 삭제한 Do를 제외한 나머지 Do를 반영
            setTasks((prevTasks) =>
                prevTasks.map(task => ({
                    ...task,
                    doRecords: task.doRecords.filter(doRecord => doRecord.id !== doId)
                }))
            );
        } catch (error) {
            console.error('Do 기록 삭제 중 오류 발생:', error);
        }
    };
    return (
        <div style={{ display: 'flex' }}>
            <div style={{ width: '40%' }}>
                <TaskList
                    tasks={tasks}
                    onFetchDoRecords={fetchDoRecords} // Do 기록을 가져오는 함수 전달
                    onAddTaskClick={handleAddTaskClick} // Task 추가 버튼 핸들러
                    onAddDoClick={handleAddDoClick}    // Do 추가 버튼 핸들러
                    onDeleteTask={handleDeleteTask}   // Task 삭제 핸들러
                    onDeleteDo={handleDeleteDo}
                />
            </div>
            <div style={{ width: '60%' }}>
                <GanttChart tasks={tasks} />
            </div>
        </div>
    );
};

export default Dashboard;