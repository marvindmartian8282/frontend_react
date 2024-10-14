import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header'; 
import Home from './components/Homepage';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ContactForm from './components/student/ContactForm';
import CourseRegistration from './components/student/CourseRegistration'; 
import MyCourses from './components/student/MyCourses'; 
import SignUp from './components/SignUp'; 
import Profile from './components/Profile'; 
import coursesData from './data/CoursesData'; 
import { userData } from './data/UserData'; 
import SubmittedForms from './components/admin/SubmittedForms'; 
import StudentList from './components/admin/StudentList';
import AdminCourses from './components/admin/AdminCourses'; 
import Footer from './components/Footer';

function App() {
    const [userName, setUserName] = useState(null); // State for current user name
    const [role, setRole] = useState(null); // State for current user role (student/admin)
    const [registeredCourses, setRegisteredCourses] = useState([]); // State for registered courses

    // Load user info from localStorage on initial load
    useEffect(() => {
        const storedUserName = localStorage.getItem('currentUsername');
        const storedUserRole = localStorage.getItem('userRole');
        if (storedUserName && storedUserRole) {
            setUserName(storedUserName);
            setRole(storedUserRole);
        }
    }, []);

    const loggedInUser = userData.find(user => user.username === userName && user.role === role);

    // Handle user login and store info in localStorage
    const handleLogin = (name, userRole) => {
        setUserName(name);
        setRole(userRole);
        localStorage.setItem('currentUsername', name);
        localStorage.setItem('userRole', userRole);
    };

    // Handle user logout and clear localStorage
    const handleLogout = () => {
        setUserName(null);
        setRole(null);
        localStorage.removeItem('currentUsername');
        localStorage.removeItem('userRole');
    };

    // Add a course to registered courses
    const handleRegisterCourse = (courseId) => {
        setRegisteredCourses(prev => [...prev, courseId]);
        return { success: true, message: 'Course registered successfully!' };
    };

    // Remove a course from registered courses
    const handleRemoveCourse = (courseId) => {
        setRegisteredCourses(prev => prev.filter(course => course !== courseId)); 
    };

    // Filter courses based on user's program
    const filteredCourses = loggedInUser && loggedInUser.programName
        ? coursesData.filter(course => course.program === loggedInUser.programName)
        : []; 

    // Private route for logged-in users
    const PrivateRoute = ({ children }) => {
        return userName ? children : <Navigate to="/login" replace />;
    };

    // Admin-only route
    const AdminRoute = ({ children }) => {
        return role === 'admin' ? children : <Navigate to="/login" replace />;
    };

    return (
        <Router>
            {/* Main header with user and role info */}
            <Header userName={userName} role={role} onLogout={handleLogout} />
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route 
                    path="/login" 
                    element={userName ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />} 
                />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/welcome" element={<h1>Welcome! Registration Successful.</h1>} />
                <Route path="/redirect" element={<Navigate to={userName ? "/dashboard" : "/login"} replace />} />

                {/* Private routes for logged-in users */}
                <Route 
                    path="/dashboard" 
                    element={<PrivateRoute><Dashboard userName={userName} role={role} /></PrivateRoute>} 
                />
                <Route path="/my-profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                <Route path="/contact-form" element={<PrivateRoute><ContactForm /></PrivateRoute>} />
                <Route 
                    path="/register-course" 
                    element={
                        <PrivateRoute>
                            <CourseRegistration 
                                availableCourses={filteredCourses} 
                                onRegisterCourse={handleRegisterCourse} 
                            />
                        </PrivateRoute>
                    } 
                />
                <Route 
                    path="/my-courses" 
                    element={
                        <PrivateRoute>
                            <MyCourses 
                                registeredCourses={registeredCourses} 
                                availableCourses={filteredCourses} 
                                onRemoveCourse={handleRemoveCourse} 
                            />
                        </PrivateRoute>
                    } 
                />

                {/* Admin-only routes */}
                <Route path="/submitted-forms" element={<AdminRoute><SubmittedForms /></AdminRoute>} />
                <Route path="/student-list" element={<AdminRoute><StudentList /></AdminRoute>} />
                <Route path="/admin-courses" element={<AdminRoute><AdminCourses /></AdminRoute>} />
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;
