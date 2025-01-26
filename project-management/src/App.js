// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import NewTask from './pages/NewTask.tsx';
import NewDo from "./pages/NewDo";
import NewPlan from './pages/NewPlan.tsx';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/newTask" element={<NewTask />} />
                <Route path="/newPlan" element={<NewPlan />} />
                <Route path="/newDo/:planId" element={<NewDo />} />
            </Routes>
        </Router>
    );
};

export default App;
