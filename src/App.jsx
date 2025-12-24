import React from 'react';
import {Route, Routes} from "react-router-dom";
import './App.css'


import Home from './main-pages/Home';
import TutorPage from './main-pages/TutorPage';
import JoinUsPage from "./main-pages/JoinUsPage";

import TutorDashboard from "./secret-pages/TutorDashboard";
import CoursesPage from "./secret-pages/CoursesPage";
import AdminHome from "./admin-pages/AdminHome";
import StudentsPage from "./admin-pages/StudentsPage";
import AdminCoursePage from "./admin-pages/AdminCoursePage";
import AdminTutorPage from "./admin-pages/TutorPage";


import ProtectedRoute from "./components/ProtectedRoute";
import {AppUserProvider} from "./provider/AppDataContext";
import {AppTutorProvider, AppLessonsProvider, AppCourseLessonsProvider} from "./provider/AppTutorContext";
import {AppAdminProfileProvider, AppAdminProvider, AppAdminStudentsProvider} from "./provider/AppAdminContext";




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
                            <AppCourseLessonsProvider>
                                <AppLessonsProvider>
                                    <AppTutorProvider>
                                        <AppUserProvider>
                                            <TutorDashboard />
                                        </AppUserProvider>
                                    </AppTutorProvider>
                                </AppLessonsProvider>
                            </AppCourseLessonsProvider>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/courses_page"
                    element={
                        <ProtectedRoute>
                            <AppCourseLessonsProvider>
                                <AppLessonsProvider>
                                    <AppTutorProvider>
                                        <AppUserProvider>
                                            <CoursesPage />
                                        </AppUserProvider>
                                    </AppTutorProvider>
                                </AppLessonsProvider>
                            </AppCourseLessonsProvider>
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/admin_home"
                    element={
                        <ProtectedRoute>
                            <AppAdminStudentsProvider>
                                <AppAdminProvider>
                                    <AppAdminProfileProvider>
                                        <AdminHome />
                                    </AppAdminProfileProvider>
                                </AppAdminProvider>
                            </AppAdminStudentsProvider>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/students_page"
                    element={
                        <ProtectedRoute>
                            <AppAdminStudentsProvider>
                                <AppAdminProvider>
                                    <AppAdminProfileProvider>
                                        <StudentsPage />
                                    </AppAdminProfileProvider>
                                </AppAdminProvider>
                            </AppAdminStudentsProvider>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin_course_page"
                    element={
                        <ProtectedRoute>
                            <AppAdminStudentsProvider>
                                <AppAdminProvider>
                                    <AppAdminProfileProvider>
                                        <AdminCoursePage />
                                    </AppAdminProfileProvider>
                                </AppAdminProvider>
                            </AppAdminStudentsProvider>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin_tutor_page"
                    element={
                        <ProtectedRoute>
                            <AppAdminStudentsProvider>
                                <AppAdminProvider>
                                    <AppAdminProfileProvider>
                                        <AdminTutorPage />
                                    </AppAdminProfileProvider>
                                </AppAdminProvider>
                            </AppAdminStudentsProvider>
                        </ProtectedRoute>
                    }
                />


            </Routes>
        </div>
    );
}

export default App;