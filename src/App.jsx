import React from 'react';
import {Route, Routes} from "react-router-dom";
import './App.css'


import Home from './main-pages/Home';
import TutorPage from './main-pages/TutorPage';
import JoinUsPage from "./main-pages/JoinUsPage";

import TutorDashboard from "./secret-pages/TutorDashboard";
import AdminTutorPage from "./admin-pages/AdminTutorPage";
import StudentsPage from "./admin-pages/StudentsPage";


import ProtectedRoute from "./components/ProtectedRoute";




function App() {

    return (
        <div>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/tutor_page" element={<TutorPage />} />
                <Route path="/join_us_page" element={<JoinUsPage />} />
                <Route
                    path="/tutor_dashboard"
                    element={
                        <ProtectedRoute>
                            <TutorDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin_tutor_page"
                    element={
                        <ProtectedRoute>
                            <AdminTutorPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/students_page"
                    element={
                        <ProtectedRoute>
                            <StudentsPage />
                        </ProtectedRoute>
                    }
                />


            </Routes>
        </div>
    );
}

export default App;