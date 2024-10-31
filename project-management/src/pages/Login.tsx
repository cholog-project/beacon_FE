import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Stack,
  TextField,
} from "@mui/material";

import { BASE_URL } from "../constant/index.tsx";
import React, { useState } from "react";

function Login() {
  const [email, sendEmail] = useState("");
  const [password, sendPassword] = useState("");

  const handleSubmit = async () => {
    const login = {
      email: email,
      password: password,
    };
  };

  return (
    <div
      className="Login"
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
          width: "50%", // 폼의 전체 너비
          maxWidth: "300px", // 폼의 최대 너비 설정
          padding: "20px",
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: "#fff", // 폼 배경색
          justifyContent: "center",
        }}
        noValidate
        autoComplete="off"
      >
        <div
          style={{ width: "100%", textAlign: "center", marginBottom: "16px" }}
        >
          <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>로그인</h1>
        </div>

        <Box
          sx={{
            width: "75%",
            textAlign: "center",
            marginBottom: "16px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FormControl fullWidth>
            <InputLabel htmlFor="component-outlined">이메일</InputLabel>
            <OutlinedInput
              id="component-outlined"
              multiline
              rows={1}
              value={email}
              onChange={(e) => sendEmail(e.target.value)}
              label="Description"
              fullWidth
            />
          </FormControl>
        </Box>

        <Box sx={{ width: "75%", textAlign: "center", marginBottom: "30px" }}>
          <FormControl fullWidth>
            <InputLabel htmlFor="component-outlined">비밀 번호</InputLabel>
            <OutlinedInput
              id="component-outlined"
              multiline
              rows={1}
              value={password}
              onChange={(e) => sendPassword(e.target.value)}
              label="Description"
              fullWidth
            />
          </FormControl>
        </Box>

        <Button
          variant="contained"
          sx={{
            width: "48%",
            backgroundColor: "#007bff",
            color: "#fff",
            marginBottom: "10px",
          }}
          onClick={handleSubmit}
        >
          로그인
        </Button>
        <Stack direction="row" spacing={2}>
          <Button>회원가입</Button>
        </Stack>
      </Box>
    </div>
  );
}

export default Login;
