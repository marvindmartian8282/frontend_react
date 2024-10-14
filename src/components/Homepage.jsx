import React, { useState } from 'react';
import CoursesData from '../data/CoursesData'; 
import '../css/Homepage.css'; 

const Homepage = () => {
  const [showAllCourses, setShowAllCourses] = useState(false); // Toggle state to show all courses

  const handleExploreCourses = () => {
    setShowAllCourses(true); // Set to true to show all courses
  };

  return (
    <div className="homepage">
      <div className="content">
        {!showAllCourses ? (
          <div className="courses-programs">
            <h3>Welcome to Bow Course Registration</h3>
            <p>
              At Bow College, we offer a range of software development programs designed to
              help you achieve your academic and career goals.
            </p>
            <h4>Featured Courses and Programs</h4>
            <ul>
              {/* Display featured programs */}
              <li>
                <h5>Diploma (2 years)</h5>
                <p><strong>Term:</strong> Winter</p>
                <p><strong>Description:</strong> A comprehensive two-year software development diploma program designed to equip students with the necessary skills and knowledge to excel in the field of software development.</p>
                <p><strong>Start Date:</strong> September 5, 2024</p>
                <p><strong>End Date:</strong> June 15, 2026</p>
                <p><strong>Fees:</strong> $9,254 domestic / $27,735 international</p>
              </li>
              <li>
                <h5>Post-Diploma (1 year)</h5>
                <p><strong>Term:</strong> Winter</p>
                <p><strong>Description:</strong> A one-year post-diploma program to enhance technical expertise in software development.</p>
                <p><strong>Start Date:</strong> September 5, 2024</p>
                <p><strong>End Date:</strong> June 15, 2025</p>
                <p><strong>Fees:</strong> $7,895 domestic / $23,675 international</p>
              </li>
              <li>
                <h5>Certificate (6 months)</h5>
                <p><strong>Term:</strong> Winter</p>
                <p><strong>Description:</strong> A fast-paced six-month program designed to provide foundational skills in software development.</p>
                <p><strong>Start Date:</strong> September 5, 2024</p>
                <p><strong>End Date:</strong> February 28, 2025</p>
                <p><strong>Fees:</strong> $4,500 domestic / $12,500 international</p>
              </li>
            </ul>
            <button onClick={handleExploreCourses} className="cta-button">Explore All Courses</button> {/* Button to show all courses */}
          </div>
        ) : (
          <div className="all-courses">
            <h4>All Courses and Programs</h4>
            {CoursesData.map((program, index) => (
              <div key={index} className="program-section">
                <h5>{program.programName}</h5>
                <ul>
                  {program.courses.map((course) => (
                    <li key={course.id} className="course-list-item">
                      <h6>{course.name} ({course.code})</h6>
                      <p><strong>Credits:</strong> {course.credits}</p>
                      <p><strong>Description:</strong> {course.description || 'No description available.'}</p>
                      <p><strong>Start Date:</strong> {course.startDate}</p>
                      <p><strong>End Date:</strong> {course.endDate}</p>
                      <p><strong>Term:</strong> {course.term}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <button onClick={() => setShowAllCourses(false)} className="cta-button">Go Back</button> {/* Button to go back to featured view */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Homepage;
