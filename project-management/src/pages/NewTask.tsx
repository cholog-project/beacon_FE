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
import { TeamMember } from '../types/team';
import React from "react";
import { useNavigate } from 'react-router-dom';

const type = [
  {
    value: "Plan",
    label: "Plan",
  },
  {
    value: "Do",
    label: "Do",
  },
];

const statusOptions = [
  {
    value: "Start",
    label: "Start",
  },
  {
    value: "In Progress",
    label: "In Progress",
  },
  {
    value: "Completed",
    label: "Completed",
  },
];

function NewTask() {
  // 상태 관리
  const [selectedType, setSelectedType] = useState("Plan");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedMember, setSelectedMember] = useState("");
  const [projectId, setProjectId] = useState("1"); // projectId는 일단 1로 설정
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]); // 타입 적용 및 함수 내부로 이동
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTeamMembers() {
      try {
        const response = await fetch(`${BASE_URL}/projects/${projectId}/members`);
        if (!response.ok) throw new Error('Failed to fetch team members');
        const data = await response.json();
        setTeamMembers(data.projectMembers); // 팀 멤버 정보를 상태로 저장
      } catch (error) {
        console.error('Failed to fetch team members:', error);
      }
    }
  
    fetchTeamMembers();
  }, [projectId]);
  
  // API 요청 함수
  const handleSubmit = async () => {
    const taskData = {
      type: selectedType,
      title: title,
      description: description,
      startDate: startDate,
      endDate: endDate,
      projectId: projectId,
      teamMemberId: selectedMember,
    };

    try {
      const response = await fetch(`${BASE_URL}/project/tasks/${projectId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        // 요청 성공 시 처리
        console.log("Task created successfully");
        alert("Task created successfully!");
      } else {
        // 요청 실패 시 처리
        console.error("Failed to create task");
        alert("Failed to create task");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error creating task");
    }
  };

  return (
    <div
      className="NewTask"
      style={{
        display: "flex",
        justifyContent: "center", // 수평 중앙 정렬
        alignItems: "center", // 수직 중앙 정렬
        minHeight: "100vh", // 화면 전체 높이
        backgroundColor: "#f8f9fa", // 배경색 추가
        padding: "20px",
      }}
    >
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "100%", textAlign: "left" },
          display: "flex",
          flexDirection: "column",
          alignItems: "center", // 폼 내부 항목 중앙 정렬
          width: "100%", // 폼의 전체 너비
          maxWidth: "600px", // 폼의 최대 너비 설정
          padding: "20px",
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: "#fff", // 폼 배경색
        }}
        noValidate
        autoComplete="off"
      >
        <div
          style={{ width: "100%", textAlign: "center", marginBottom: "16px" }}
        >
          <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>New Task</h1>
        </div>

        <div style={{ width: "100%" }}>
          <TextField
            id="outlined-select-type"
            select
            label="Task type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            fullWidth
            sx={{ marginBottom: "16px" }}
          >
            {type.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </div>

        <div
          style={{
            width: "100%",
            marginBottom: "16px",
            position: "relative",
            left: "8px",
          }}
        >
          <FormControl fullWidth>
            <InputLabel htmlFor="component-outlined">Task title</InputLabel>
            <OutlinedInput
              id="component-outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              label="Task title"
              fullWidth
            />
          </FormControl>
        </div>

        <div style={{ width: "100%", marginBottom: "16px" }}>
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
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            marginBottom: "16px",
          }}
        >
          <TextField
            id="plan-start-date"
            label="PLAN Start date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            sx={{ width: "48%" }}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            id="plan-end-date"
            label="PLAN End date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            sx={{ width: "48%" }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>

        <div style={{ width: "100%", marginBottom: "16px" }}>
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
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Button
            variant="contained"
            sx={{ width: "48%", backgroundColor: "#007bff", color: "#fff" }}
            onClick={handleSubmit}
          >
            Create
          </Button>
          <Button
            variant="outlined"
            sx={{ width: "48%" }}
            onClick={() => navigate('/')}
          >
            Close
          </Button>
        </div>
      </Box>
    </div>
  );
}

export default NewTask;
