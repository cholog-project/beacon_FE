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
import { useParams, useNavigate } from "react-router-dom";
const statusOptions = [
    {
        value: "Not_Started",
        label: "Not_Started",
    },
    {
        value: "In_Progress",
        label: "In_Progress",
    },
    {
        value: "Completed",
        label: "Completed",
    },
];

function NewDo() {
    const [startDate, setStartDate] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("Not Started");
    const [description, setDescription] = useState("");
    const { planId } = useParams(); // 컴포넌트 레벨에서 호출
    const navigate = useNavigate();

    // API 요청 함수
    const handleSubmit = async () => {
        const doData = {
            startDate: startDate,
            status: selectedStatus,
            description: description,
        };

        try {
            const response = await fetch(`${BASE_URL}/dos/new/${planId}`, {
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

                setTimeout(() => {
                    navigate('/'); // 메인 페이지로 이동
                }, 500);
            } else {
                // 요청 실패 시 처리
                throw new Error(`Failed to create Do: ${response.status}`);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error creating Do");
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
                    "& .MuiTextField-root": { m: 1, width: "100%" },
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
                    id="do-start-date"
                    label="DO Start date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    sx={{ width: "48%" }}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />

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

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                    }}
                >
                    <Button
                        variant="contained"
                        sx={{
                            width: "48%",
                            backgroundColor: "#007bff",
                            color: "#fff",
                        }}
                        onClick={handleSubmit}
                    >
                        Create
                    </Button>
                    <Button
                        variant="outlined"
                        sx={{ width: "48%" }}
                        onClick={() => navigate("/")}
                    >
                        Close
                    </Button>
                </Box>
            </Box>
        </div>
    );
}

export default NewDo;
