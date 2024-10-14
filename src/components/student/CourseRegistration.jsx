import React, { useState, useEffect, useRef } from 'react';
import CoursesData from '../../data/CoursesData';

const CourseRegistration = ({ onRegisterCourse }) => {
    const [selectedTerm, setSelectedTerm] = useState(''); // State for selected term
    const [searchQuery, setSearchQuery] = useState(''); // State for search input
    const [message, setMessage] = useState(''); // State for success/error messages
    const [registeredCourses, setRegisteredCourses] = useState(
        JSON.parse(localStorage.getItem('registeredCourses')) || {
            Fall: [],
            Winter: [],
            Spring: [],
            Summer: [],
        }
    ); // State for registered courses from localStorage
    const [allCourses, setAllCourses] = useState([]); // State to hold all available courses
    const [selectedCourse, setSelectedCourse] = useState(null); // State for selected course in modal
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
    const messageTimeoutRef = useRef(null); // Ref to handle message timeout

    // Load and merge courses from CoursesData and localStorage
    useEffect(() => {
        const savedCourses = JSON.parse(localStorage.getItem('courses')) || [];
        const mergedCourses = mergeCourses(CoursesData, savedCourses);
        setAllCourses(mergedCourses);
    }, []);

    // Merge default courses with saved courses
    const mergeCourses = (defaultCourses, savedCourses) => {
        const uniqueCourses = new Map();

        defaultCourses.forEach((program) => {
            program.courses.forEach((course) => {
                uniqueCourses.set(course.id, course);
            });
        });

        savedCourses.forEach((course) => {
            uniqueCourses.set(course.id, course); // Overwrite duplicates
        });

        return Array.from(uniqueCourses.values()); // Return merged courses
    };

    // Update localStorage when registeredCourses state changes
    useEffect(() => {
        localStorage.setItem('registeredCourses', JSON.stringify(registeredCourses));
    }, [registeredCourses]);

    // Handle term selection
    const handleTermChange = (e) => {
        setSelectedTerm(e.target.value);
        setMessage(''); // Clear any previous messages
    };

    // Handle search input
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    // Register course for the selected term
    const registerCourse = (course) => {
        if (!selectedTerm) {
            displayMessage('Please select a term first.');
            return;
        }

        const coursesForTerm = registeredCourses[selectedTerm] || [];

        if (coursesForTerm.includes(course.id)) {
            displayMessage('You have already registered for this course.');
            return;
        }

        if (coursesForTerm.length >= 5) {
            displayMessage('You cannot register for more than 5 courses in the same term.');
            return;
        }

        const updatedCoursesForTerm = [...coursesForTerm, course.id];
        setRegisteredCourses((prev) => ({
            ...prev,
            [selectedTerm]: updatedCoursesForTerm,
        }));

        displayMessage('Course registered successfully!');
    };

    // Display message with timeout
    const displayMessage = (msg) => {
        setMessage(msg);

        if (messageTimeoutRef.current) {
            clearTimeout(messageTimeoutRef.current);
        }

        messageTimeoutRef.current = setTimeout(() => {
            setMessage('');
        }, 3000);
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

    // Filter courses based on selected term and search query
    const filteredCourses = allCourses.filter(
        (course) =>
            course.term === selectedTerm &&
            (course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.code.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="course-registration">
            <h1>Course Registration</h1>

            <div className="form-group-container">
                <div className="form-group">
                    <label htmlFor="term-select">Select Term:</label>
                    <select id="term-select" value={selectedTerm} onChange={handleTermChange}>
                        <option value="">--Select Term--</option>
                        <option value="Fall">Fall</option>
                        <option value="Winter">Winter</option>
                        <option value="Spring">Spring</option>
                        <option value="Summer">Summer</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="course-search">Search Courses:</label>
                    <input
                        id="course-search"
                        type="text"
                        placeholder="Search Courses"
                        value={searchQuery}
                        onChange={handleSearch}
                        aria-label="Search courses"
                    />
                </div>
            </div>

            {message && <div className="message-box-courseregistration">{message}</div>}

            <h2>Available Courses for {selectedTerm || 'Selected Term'}</h2>
            {filteredCourses.length > 0 ? (
                <ul className="course-list available-courses">
                    {filteredCourses.map((course) => (
                        <li key={course.id} className="course-list-item">
                            <span>
                                <div><b>{course.program}</b></div>
                                <div style={{ marginTop: '10px' }}>
                                    <b>{course.name}</b> ({course.code}) - {course.credits} Credits
                                </div>  
                                <div style={{ marginTop: '10px' }}>
                                    <b>Term:</b> {course.term}
                                </div>
                            </span>
                            <div>
                                <button onClick={() => openModal(course)}>Details</button>
                                <button onClick={() => registerCourse(course)}>Add</button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="no-courses">No courses available for the selected term or search query.</p>
            )}

            {isModalOpen && selectedCourse && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{selectedCourse.name}</h2>
                        <p><strong>Code:</strong> {selectedCourse.code}</p>
                        <p><strong>Description:</strong> {selectedCourse.description}</p>
                        <p><strong>Credits:</strong> {selectedCourse.credits}</p>
                        <p><strong>Start Date:</strong> {selectedCourse.startDate}</p>
                        <p><strong>End Date:</strong> {selectedCourse.endDate}</p>
                        <p><strong>Term:</strong> {selectedCourse.term}</p>
                        <div className="modal-buttons">
                            <button onClick={closeModal}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseRegistration;
