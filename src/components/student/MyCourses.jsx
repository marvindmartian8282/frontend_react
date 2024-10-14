import React, { useState, useEffect } from 'react';
import CoursesData from '../../data/CoursesData';
import '../../css/Student.css';

const MyCourses = () => {
    // State for registered courses from localStorage
    const [registeredCourses, setRegisteredCourses] = useState(JSON.parse(localStorage.getItem('registeredCourses')) || {});
    const [allCourses, setAllCourses] = useState([]); // State to hold all available courses
    const [selectedCourse, setSelectedCourse] = useState(null); // State for selected course in modal
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
    const [isMerged, setIsMerged] = useState(false); // State to control one-time merging of courses

    // Load courses from CoursesData and localStorage, then merge them
    useEffect(() => {
        if (!isMerged) {
            const savedCourses = JSON.parse(localStorage.getItem('courses')) || [];
            const mergedCourses = mergeCourses(CoursesData, savedCourses);
            setAllCourses(mergedCourses);
            setIsMerged(true); // Ensure merge only happens once
        }
    }, [isMerged]);

    // Merge CoursesData with saved courses, avoiding duplicates
    const mergeCourses = (defaultCourses, savedCourses) => {
        const uniqueCourses = new Map();

        // Add default courses to the map
        defaultCourses.forEach((program) => {
            program.courses.forEach((course) => {
                uniqueCourses.set(course.id, course);
            });
        });

        // Add saved courses, overwriting any duplicates
        savedCourses.forEach((course) => {
            uniqueCourses.set(course.id, course);
        });

        return Array.from(uniqueCourses.values()); // Return merged courses
    };

    // Retrieve registered courses categorized by term
    const getRegisteredCoursesDetailsByTerm = () => {
        const coursesByTerm = {};
        Object.keys(registeredCourses).forEach((term) => {
            const courseIds = registeredCourses[term];
            const termCourses = allCourses.filter((course) => courseIds.includes(course.id));
            if (termCourses.length > 0) {
                coursesByTerm[term] = termCourses;
            }
        });
        return coursesByTerm;
    };

    const registeredCoursesByTerm = getRegisteredCoursesDetailsByTerm(); // Get registered courses

    // Function to remove a registered course
    const removeCourse = (courseId, term) => {
        const updatedTermCourses = registeredCourses[term].filter((id) => id !== courseId);

        const updatedCourses = {
            ...registeredCourses,
            [term]: updatedTermCourses.length ? updatedTermCourses : undefined, // Remove empty terms
        };

        // Filter out terms with no courses left
        const cleanedCourses = Object.fromEntries(Object.entries(updatedCourses).filter(([_, value]) => value));

        setRegisteredCourses(cleanedCourses);
        localStorage.setItem('registeredCourses', JSON.stringify(cleanedCourses)); // Update localStorage
    };

    // Open modal to show course details
    const openModal = (course) => {
        setSelectedCourse(course);
        setIsModalOpen(true);
    };

    // Close modal
    const closeModal = () => {
        setSelectedCourse(null);
        setIsModalOpen(false);
    };

    return (
        <div className="my-courses">
            <h1>My Registered Courses</h1>
            {Object.keys(registeredCoursesByTerm).length > 0 ? (
                Object.keys(registeredCoursesByTerm).map((term) => (
                    <div key={term} className="term-section">
                        <h2>{term} Term</h2>
                        <ul className="course-list">
                            {registeredCoursesByTerm[term].map((course) => (
                                <li key={course.id} className="course-list-item">
                                    <span>
                                        <div style={{ marginBottom: '10px' }}><b>{course.program}</b></div>
                                        <div style={{ marginBottom: '10px' }}><b>{course.name}</b> ({course.code}) - {course.credits} Credits</div>
                                        <div><b>Term:</b> {course.term}</div>
                                    </span>
                                    <div>
                                        <button onClick={() => openModal(course)}>View Details</button>
                                        <button onClick={() => removeCourse(course.id, term)}>Remove</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            ) : (
                <p>No courses registered yet.</p>
            )}

            {isModalOpen && selectedCourse && (
                <div className="mycourses-modal-overlay">
                    <div className="mycourses-modal-content">
                        <h2>{selectedCourse.name}</h2>
                        <p><strong>Code:</strong> {selectedCourse.code}</p>
                        <p><strong>Description:</strong> {selectedCourse.description}</p>
                        <p><strong>Credits:</strong> {selectedCourse.credits}</p>
                        <p><strong>Start Date:</strong> {selectedCourse.startDate}</p>
                        <p><strong>End Date:</strong> {selectedCourse.endDate}</p>
                        <p><strong>Term:</strong> {selectedCourse.term}</p>
                        <div className="mycourses-modal-buttons">
                            <button onClick={closeModal}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyCourses;
