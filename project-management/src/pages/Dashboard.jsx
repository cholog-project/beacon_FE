import React, { useState, useEffect } from 'react';
import TaskList from '../components/TaskList';
import GanttChart from '../components/GanttChart';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from "../constant/index.tsx";

const Dashboard = () => {
    const navigate = useNavigate();
    const [plans, setPlans] = useState([]); // Plan 목록
    const [teamMembers, setTeamMembers] = useState([]);

    // 팀 멤버를 가져오는 useEffect
    useEffect(() => {
        const fetchTeamMembers = async () => {
            try {
                const response = await fetch(`${BASE_URL}/projects/1/members`);
                if (!response.ok) {
                    throw new Error('Failed to fetch team members');
                }
                const data = await response.json();
                setTeamMembers(data.projectMembers);
            } catch (error) {
                console.error('Failed to fetch team members:', error);
            }
        };
        fetchTeamMembers();
    }, []);

    // Plan 목록을 API에서 가져오는 함수
    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await fetch(`${BASE_URL}/plan/project/1?page=0&pageSize=10`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();

                const formattedPlans = data.content.map((plan) => ({
                    id: plan.id,
                    title: plan.title,
                    description: plan.description,
                    startDate: plan.startDate,
                    endDate: plan.endDate,
                    status: plan.status,
                    assignee: teamMembers.find(member => member.memberId === plan.teamMemberId)?.name || 'Unknown',
                    doRecords: [],
                }));

                setPlans(formattedPlans);

                // 각 Plan에 대한 Do 데이터 가져오기
                data.content.forEach((plan) => fetchDoRecords(plan.id));
            } catch (error) {
                console.error('Plan 데이터를 가져오는 중 오류 발생:', error);
            }
        };
        if (teamMembers.length > 0) fetchPlans();
    }, [teamMembers]);

    // Do 기록을 API에서 가져오는 함수
    const fetchDoRecords = async (planId) => {
        try {
            const response = await fetch(`${BASE_URL}/dos/plan/${planId}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch Do records for Plan ID: ${planId}`);
            }
            const doRecordsData = await response.json();
            setPlans((prevPlans) =>
                prevPlans.map((plan) =>
                    plan.id === planId
                        ? { ...plan, doRecords: doRecordsData.dos }
                        : plan
                )
            );
        } catch (error) {
            console.error(`Do 기록을 가져오는 중 오류 발생 (Plan ID: ${planId}):`, error);
        }
    };

    // Plan 추가 페이지로 이동
    const handleAddPlanClick = () => {
        navigate('/newPlan');
    };

    // Do 추가 페이지로 이동
    const handleAddDoClick = (planId) => {
        navigate(`/newDo/${planId}`);
    };

    // Plan 삭제
    const handleDeletePlan = async (planId) => {
        try {
            const response = await fetch(`${BASE_URL}/plan/${planId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setPlans(plans.filter(plan => plan.id !== planId));
        } catch (error) {
            console.error('Plan 삭제 중 오류 발생:', error);
        }
    };

    // Do 삭제
    const handleDeleteDo = async (doId) => {
        try {
            const response = await fetch(`${BASE_URL}/dos/${doId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setPlans((prevPlans) =>
                prevPlans.map(plan => ({
                    ...plan,
                    doRecords: plan.doRecords.filter(doRecord => doRecord.id !== doId),
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
                    tasks={plans} // Plan 데이터를 TaskList로 전달
                    onFetchDoRecords={fetchDoRecords}
                    onAddPlanClick={handleAddPlanClick}
                    onAddDoClick={handleAddDoClick}
                    onDeletePlan={handleDeletePlan}
                    onDeleteDo={handleDeleteDo}
                />
            </div>
            <div style={{ width: '60%' }}>
                <GanttChart tasks={plans} /> {/* GanttChart도 Plan 데이터 사용 */}
            </div>
        </div>
    );
};

export default Dashboard;
