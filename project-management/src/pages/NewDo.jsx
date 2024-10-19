import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    OutlinedInput,
    TextField,
} from "@mui/material";

import { useState } from "react";
import { BASE_URL } from "../constant/index.tsx";
import React from "react";

const statusOptions = [
    {
        value: "Not Started",
        label: "Not Started",
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

function NewDo() {
    // 상태 관리
    const [selectedStatus, setSelectedStatus] = useState("Start");
    const [description, setDescription] = useState("");
    const [taskId, setTaskId] = useState("1"); // taskId는 일단 1로 설정 // 수정 필요할 듯

    // API 요청 함수
    const handleSubmit = async () => {
        const doData = {
            status: selectedStatus,
            description: description,
            taskId: taskId,
        };

        try {
            const response = await fetch(`${BASE_URL}/project/tasks/${taskId}/dos`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(doData),
            });

            if (response.ok) {
                // 요청 성공 시 처리
                console.log("Do created successfully");
                alert("Do created successfully!");
            } else {
                // 요청 실패 시 처리
                console.error("Failed to create do");
                alert("Failed to create do");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error creating do");
        }
    };

    return (
        <div
            className="NewDo"
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
                    "& .MuiTextField-root": { m: 1, width: "100%"},
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
                    <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>New Do</h1>
                </div>

                    <TextField
                        id="select-status"
                        select
                        label="Status"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        fullWidth
                        sx={{ marginBottom: "16px" }}
                    >
                        {statusOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>

                <Box sx={{ width: "100%", marginBottom: "16px" }}>
                    <FormControl fullWidth>
                        <InputLabel htmlFor="component-outlined">Description</InputLabel>
                        <OutlinedInput
                            id="component-outlined"
                            multiline
                            rows={6}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            label="Description"
                            fullWidth
                        />
                    </FormControl>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
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
                        onClick={() => console.log("Close clicked")}
                    >
                        Close
                    </Button>
                </Box>
            </Box>
        </div>
    );
}

export default NewDo;
