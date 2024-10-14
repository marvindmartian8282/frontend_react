import React, { useState, useEffect } from 'react';
import '../css/Profile.css'; 
import { userData } from '../data/UserData';

const Profile = () => {
  const [currentUser, setCurrentUser] = useState(null); // Store the current user's profile
  const [loading, setLoading] = useState(true); // Manage loading state
  const [error, setError] = useState(null); // Handle errors

  // Load user data from localStorage
  useEffect(() => {
    const username = localStorage.getItem('currentUsername');
    const role = localStorage.getItem('userRole');

    if (username && role) {
      const foundUser = userData.find(user => user.username === username && user.role === role);

      if (foundUser) {
        setCurrentUser(foundUser); // Set the current user
      } else {
        setError(`No ${role} data available.`); // Handle missing user data
      }
    } else {
      setError("No user data available."); // Handle missing localStorage data
    }

    setLoading(false); // Stop loading once data is processed
  }, []);

  if (loading) {
    return <div className="loading-message">Loading profile data...</div>; // Show loading message
  }

  if (error) {
    return <div className="error-message">{error}</div>; // Show error message
  }

  if (!currentUser) {
    return <div>No profile data available.</div>; // Handle case where no user data is found
  }

  return (
    <div className="profile">
      <h1 className="profile-title">Profile Information</h1>
      <div className="profile-info">
        <div className="info-item">
          <label>Full Name:</label> {currentUser.firstname} {currentUser.lastname}
        </div>
        <div className="info-item">
          <label>Email:</label> {currentUser.email}
        </div>
        <div className="info-item">
          <label>Phone:</label> {currentUser.phone}
        </div>
        <div className="info-item">
          <label>Date of Birth:</label> {currentUser.dob}
        </div>
        <div className="info-item">
          <label>Status:</label> {currentUser.status}
        </div>
        {currentUser.studentId && (
          <div className="info-item">
            <label>Student ID:</label> {currentUser.studentId}
          </div>
        )}
        {currentUser.employeeId && (
          <div className="info-item">
            <label>Employee ID:</label> {currentUser.employeeId}
          </div>
        )}
        <div className="info-item">
          <label>Department:</label> {currentUser.department}
        </div>
        {currentUser.programName && (
          <div className="info-item">
            <label>Program:</label> {currentUser.programName}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
