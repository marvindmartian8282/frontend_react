import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { userData } from '../data/UserData'; 
import CoursesData from '../data/CoursesData'; 
import '../css/Dashboard.css';

const Dashboard = () => {
  const [currentUser, setCurrentUser] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [totalStudents, setTotalStudents] = useState(0); 
  const [totalCourses, setTotalCourses] = useState(0); 
  const [registeredCoursesCount, setRegisteredCoursesCount] = useState(0); 

  // Fetch user data and setup dashboard based on role (admin or student)
  useEffect(() => {
    const fetchData = () => {
      const username = localStorage.getItem('currentUsername'); 
      const role = localStorage.getItem('userRole'); 

      if (username && role) {
        const foundUser = userData.find(user => user.username === username && user.role === role);

        if (foundUser) {
          setCurrentUser(foundUser);

          // Admin-specific data
          if (role === 'admin') {
            const studentsCount = userData.filter(user => user.role === 'student').length;
            setTotalStudents(studentsCount);

            const coursesCount = CoursesData.flatMap(program => program.courses).length;
            setTotalCourses(coursesCount);
          }

          // Student-specific data
          if (role === 'student') {
            const registeredCourses = JSON.parse(localStorage.getItem('registeredCourses')) || {};
            const totalRegisteredCourses = Object.values(registeredCourses).flat().length;
            setRegisteredCoursesCount(totalRegisteredCourses);
          }
        } else {
          setError(`No ${role} data available.`);
        }
      } else {
        setError("No user data available.");
      }
      setLoading(false); 
    };

    fetchData(); 
  }, []);

  if (loading) {
    return <div className="loading-message">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!currentUser) {
    return <div>No dashboard data available.</div>;
  }

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Welcome, {currentUser.firstname}!</h1>
      <div className="dashboard-info">
        <p><strong>Role:</strong> {currentUser.role === 'admin' ? 'Admin' : 'Student'}</p>
        {currentUser.role === 'student' && (
          <>
            <p><strong>Student ID:</strong> {currentUser.studentId}</p>
            <p><strong>Department:</strong> {currentUser.department}</p>
            <p><strong>Program:</strong> {currentUser.programName}</p>
          </>
        )}
      </div>

      {currentUser.role === 'admin' && (
        <div className="admin-dashboard">
          <h2>Admin Dashboard</h2>
          <div className="admin-overview">
            <div className="overview-box">
              <p>Total Students: {totalStudents}</p>
            </div>
            <div className="overview-box">
              <p>Total Available Courses: {totalCourses}</p>
            </div>
          </div>
          <h3>Admin Options</h3>
          <ul>
            <li><Link to="/admin-courses">📚 Add Courses</Link></li>
            <li><Link to="/student-list">👥 View Students Lists</Link></li>
            <li><Link to="/submitted-forms">📝 View Submitted Messages</Link></li>
          </ul>
        </div>
      )}

      {currentUser.role === 'student' && (
        <div className="student-dashboard">
          <h2>Student Dashboard</h2>
          <div className="student-overview">
            <div className="overview-box">
              <p>Registered Courses: {registeredCoursesCount}</p>
            </div>
          </div>
          <h3>Student Options</h3>
          <ul>
            <li><Link to="/register-course">📘 Register for Courses</Link></li>
            <li><Link to="/my-courses">📑 View My Courses</Link></li>
            <li><Link to="/contact-form">📞 Contact Support</Link></li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
