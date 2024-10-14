import React, { useState, useEffect } from 'react';
import CoursesData from '../../data/CoursesData'; 
import '../../css/Admin.css';

const AdminCourses = () => {
    const [courses, setCourses] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProgram, setSelectedProgram] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState(''); // Modal type: create or edit
    const [editingCourse, setEditingCourse] = useState(null);
    const [courseName, setCourseName] = useState('');
    const [courseCode, setCourseCode] = useState('');
    const [courseDescription, setCourseDescription] = useState(''); 
    const [credits, setCredits] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [program, setProgram] = useState('');
    const [term, setTerm] = useState('');

    // Load courses from localStorage and merge with default data
    useEffect(() => {
        const storedCourses = JSON.parse(localStorage.getItem('courses')) || [];
        const mergedCourses = mergeCourses(CoursesData, storedCourses);
        setCourses(mergedCourses);
    }, []);

    // Merge default and saved courses without duplicates
    const mergeCourses = (defaultCourses, savedCourses) => {
        const programMap = {};

        defaultCourses.forEach((program) => {
            programMap[program.programName] = program.courses;
        });

        savedCourses.forEach((savedCourse) => {
            const existingCourses = programMap[savedCourse.program] || [];
            if (!existingCourses.some(course => course.id === savedCourse.id)) {
                programMap[savedCourse.program] = [...existingCourses, savedCourse];
            }
        });

        return Object.keys(programMap).map((programName) => ({
            programName,
            courses: programMap[programName],
        }));
    };

    // Open modal for creating/editing a course
    const openModal = (type, course = null) => {
        setModalType(type);
        setEditingCourse(course);
        if (course) {
            setCourseName(course.name);
            setCourseCode(course.code);
            setCourseDescription(course.description || ''); 
            setCredits(course.credits);
            setStartDate(course.startDate);
            setEndDate(course.endDate);
            setProgram(course.program);
            setTerm(course.term);
        } else {
            resetFields();
        }
        setIsModalOpen(true);
    };

    // Close modal and reset form fields
    const closeModal = () => {
        setIsModalOpen(false);
        resetFields();
    };

    // Reset form fields
    const resetFields = () => {
        setCourseName('');
        setCourseCode('');
        setCourseDescription(''); 
        setCredits('');
        setStartDate('');
        setEndDate('');
        setProgram('');
        setTerm('');
    };

    // Handle form submission for creating or editing a course
    const handleSubmit = (e) => {
        e.preventDefault();

        const newCourse = {
            id: editingCourse ? editingCourse.id : Math.random().toString(36).substr(2, 9),
            name: courseName,
            code: courseCode,
            description: courseDescription, 
            credits: parseInt(credits, 10),
            startDate,
            endDate,
            program,
            term
        };

        if (modalType === 'create') {
            const updatedCourses = courses.map(programData => {
                if (programData.programName === newCourse.program) {
                    return {
                        ...programData,
                        courses: [...programData.courses, newCourse]
                    };
                }
                return programData;
            });

            const savedCourses = JSON.parse(localStorage.getItem('courses')) || [];
            localStorage.setItem('courses', JSON.stringify([...savedCourses, newCourse]));

            setCourses(updatedCourses);
        } else if (modalType === 'edit') {
            const updatedCourses = courses.map(programData => {
                if (programData.programName === newCourse.program) {
                    return {
                        ...programData,
                        courses: programData.courses.map(course =>
                            course.id === newCourse.id ? newCourse : course
                        ),
                    };
                }
                return programData;
            });

            const savedCourses = JSON.parse(localStorage.getItem('courses')) || [];
            const updatedSavedCourses = savedCourses.map(course => course.id === newCourse.id ? newCourse : course);
            localStorage.setItem('courses', JSON.stringify(updatedSavedCourses));

            setCourses(updatedCourses);
        }

        closeModal();
    };

    // Delete a course
    const deleteCourse = (courseId, programName) => {
        const updatedCourses = courses.map(programData => {
            if (programData.programName === programName) {
                return {
                    ...programData,
                    courses: programData.courses.filter(course => course.id !== courseId),
                };
            }
            return programData;
        });

        const savedCourses = JSON.parse(localStorage.getItem('courses')) || [];
        const updatedSavedCourses = savedCourses.filter(course => course.id !== courseId);
        localStorage.setItem('courses', JSON.stringify(updatedSavedCourses));

        setCourses(updatedCourses);
    };

    // Filter courses by search and program
    const filteredCourses = courses.flatMap(program =>
        program.courses.filter(course =>
            (course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.code.toLowerCase().includes(searchQuery.toLowerCase())) &&
            (selectedProgram ? program.programName === selectedProgram : true)
        )
    );

    return (
        <div className="admin-courses">
            <h1>Manage Courses</h1>
            <div className="admin-courses-controls">
                <input
                    type="text"
                    placeholder="Search courses by name or code"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select
                    value={selectedProgram}
                    onChange={(e) => setSelectedProgram(e.target.value)}
                >
                    <option value="">All Programs</option>
                    {courses.map(program => (
                        <option key={program.programName} value={program.programName}>
                            {program.programName}
                        </option>
                    ))}
                </select>
                <button onClick={() => openModal('create')}>Create New Course</button>
            </div>

            <ul className="course-list">
                {filteredCourses.length > 0 ? (
                    filteredCourses.map((course) => (
                        <li key={course.id} className="course-list-item">
                            <div className="course-details">
                                <h3>{course.name} ({course.code})</h3>
                                <p><strong>Credits:</strong> {course.credits}</p>
                                <p><strong>Description:</strong> {course.description || 'No description available'}</p>
                                <p><strong>Start Date:</strong> {course.startDate}</p>
                                <p><strong>End Date:</strong> {course.endDate}</p>
                                <p><strong>Term:</strong> {course.term}</p>
                                <p><strong>Program:</strong> {course.program}</p>
                            </div>
                            <div className="course-actions">
                                <button onClick={() => openModal('edit', course)}>Edit</button>
                                <button onClick={() => deleteCourse(course.id, course.program)}>Delete</button>
                            </div>
                        </li>
                    ))
                ) : (
                    <p>No courses found.</p>
                )}
            </ul>

            {/* Modal for Creating/Editing Courses */}
            {isModalOpen && (
                <div className="admin-courses-modal-overlay">
                    <div className="admin-courses-modal-wrapper">
                        <div className="admin-courses-modal-content">
                            <h2>{modalType === 'edit' ? 'Edit Course' : 'Create Course'}</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Course Name:</label>
                                    <input type="text" value={courseName} onChange={(e) => setCourseName(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label>Course Code:</label>
                                    <input type="text" value={courseCode} onChange={(e) => setCourseCode(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label>Description:</label>
                                    <input type="text" value={courseDescription} onChange={(e) => setCourseDescription(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label>Credits:</label>
                                    <input type="number" value={credits} onChange={(e) => setCredits(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label>Start Date:</label>
                                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label>End Date:</label>
                                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label>Program:</label>
                                    <select value={program} onChange={(e) => setProgram(e.target.value)} required>
                                        <option value="">Select Program</option>
                                        {courses.map((programData, index) => (
                                            <option key={index} value={programData.programName}>
                                                {programData.programName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Term:</label>
                                    <select value={term} onChange={(e) => setTerm(e.target.value)} required>
                                        <option value="">Select Term</option>
                                        <option value="Fall">Fall</option>
                                        <option value="Winter">Winter</option>
                                        <option value="Spring">Spring</option>
                                        <option value="Summer">Summer</option>
                                    </select>
                                </div>
                                <div className="admin-courses-modal-buttons">
                                    <button type="submit">{modalType === 'edit' ? 'Update' : 'Create'}</button>
                                    <button type="button" onClick={closeModal}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCourses;
