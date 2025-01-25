import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    OutlinedInput,
    TextField,
} from "@mui/material";

import { useState, useEffect } from "react";
import { BASE_URL } from "../constant/index.tsx";
import { TeamMember } from "../types/team";
import React from "react";
import { useNavigate } from "react-router-dom";

const statusOptions = [
    {
        value: "not started",
        label: "Not Started",
    },
    {
        value: "in progress",
        label: "In Progress",
    },
    {
        value: "completed",
        label: "Completed",
    },
];

function NewPlan() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedMember, setSelectedMember] = useState("");
    const [selectedStatus, setSelectedStatus] = useState(statusOptions[0].value); // 상태 기본값 설정
    const [projectId, setProjectId] = useState("1"); // 프로젝트 ID를 기본값 1로 설정
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const navigate = useNavigate();

    // 팀 멤버 가져오기
    useEffect(() => {
        async function fetchTeamMembers() {
            try {
                const response = await fetch(`${BASE_URL}/projects/${projectId}/members`);
                if (!response.ok) throw new Error("Failed to fetch team members");
                const data = await response.json();
                setTeamMembers(data.projectMembers); // 팀 멤버 상태 업데이트
            } catch (error) {
                console.error("Failed to fetch team members:", error);
            }
        }
        fetchTeamMembers();
    }, [projectId]);

    // Plan 생성 요청
    const handleSubmit = async () => {
        const planData = {
            title,
            description,
            startDate,
            endDate,
            status: selectedStatus, // 선택된 상태를 API 요청에 포함
            projectId,
            teamMemberId: selectedMember,
        };

        try {
            const response = await fetch(`${BASE_URL}/plan/${projectId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(planData),
            });

            if (response.ok) {
                alert("Plan created successfully!");
                navigate("/"); // 메인 페이지로 이동
            } else {
                alert("Failed to create plan");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error creating plan");
        }
    };

    return (
        <div
            className="NewPlan"
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                backgroundColor: "#f8f9fa",
                padding: "20px",
            }}
        >
            <Box
                component="form"
                sx={{
                    "& .MuiTextField-root": { m: 1, width: "100%", textAlign: "left" },
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                    maxWidth: "600px",
                    padding: "20px",
                    boxShadow: 3,
                    borderRadius: 2,
                    backgroundColor: "#fff",
                }}
                noValidate
                autoComplete="off"
            >
                <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>New Plan</h1>

                <FormControl fullWidth>
                    <InputLabel htmlFor="component-outlined">Plan Title</InputLabel>
                    <OutlinedInput
                        id="component-outlined"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        label="Plan Title"
                        fullWidth
                    />
                </FormControl>

                <TextField
                    id="select-member"
                    select
                    label="Assignee"
                    value={selectedMember}
                    onChange={(e) => setSelectedMember(e.target.value)}
                    fullWidth
                >
                    <MenuItem value="">
                        <em>Select a team member</em>
                    </MenuItem>
                    {teamMembers.map((member) => (
                        <MenuItem key={member.memberId} value={member.memberId}>
                            {member.name}
                        </MenuItem>
                    ))}
                </TextField>

                <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                    <TextField
                        id="plan-start-date"
                        label="PLAN Start Date"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        sx={{ width: "48%" }}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        id="plan-end-date"
                        label="PLAN End Date"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        sx={{ width: "48%" }}
                        InputLabelProps={{ shrink: true }}
                    />
                </div>

                <TextField
                    id="select-status"
                    select
                    label="Status"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)} // 상태 선택 처리
                    fullWidth
                >
                    {statusOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    id="outlined-multiline-description"
                    label="Description"
                    multiline
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    variant="outlined"
                    fullWidth
                />

                <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                    <Button variant="contained" sx={{ width: "48%" }} onClick={handleSubmit}>
                        Create
                    </Button>
                    <Button variant="outlined" sx={{ width: "48%" }} onClick={() => navigate("/")}>
                        Close
                    </Button>
                </div>
            </Box>
        </div>
    );
}

export default NewPlan;
