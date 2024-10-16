// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import NewTask from './pages/NewTask.tsx';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/newTask" element={<NewTask />} />
            </Routes>
        </Router>
    );
};

export default App;
