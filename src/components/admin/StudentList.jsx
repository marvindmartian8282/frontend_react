import React, { useState } from 'react';
import { userData } from '../../data/UserData';
import '../../css/Admin.css'; 

const StudentList = () => {
  const [selectedProgram, setSelectedProgram] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [alertMessage, setAlertMessage] = useState('');

  // Handle program selection
  const handleProgramChange = (e) => {
    const program = e.target.value;
    setSelectedProgram(program);
    setAlertMessage(''); // Clear any previous alert
    filterAndSortStudents(program, searchQuery, sortKey); // Filter and sort students
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    if (!selectedProgram) {
      setAlertMessage('Please select a program before searching by name.');
      return;
    }
    const query = e.target.value;
    setSearchQuery(query);
    filterAndSortStudents(selectedProgram, query, sortKey); // Filter and sort students
  };

  // Handle column sorting
  const handleSort = (key) => {
    const order = sortKey === key && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortOrder(order);
    filterAndSortStudents(selectedProgram, searchQuery, key, order); // Sort students
  };

  // Filter and sort students based on program, search query, and sort key
  const filterAndSortStudents = (program, query, sort, order = sortOrder) => {
    let filtered = userData.filter((student) => student.role === 'student');

    if (program) {
      filtered = filtered.filter((student) => student.programName === program); // Filter by program
    }

    if (query) {
      filtered = filtered.filter((student) =>
        student.firstname.toLowerCase().includes(query.toLowerCase()) ||
        student.lastname.toLowerCase().includes(query.toLowerCase()) // Filter by name
      );
    }

    if (sort) {
      filtered.sort((a, b) => (order === 'asc' ? (a[sort] > b[sort] ? 1 : -1) : a[sort] < b[sort] ? 1 : -1)); // Sort by key
    }

    setFilteredStudents(filtered); // Update filtered students list
  };

  // List of programs
  const programs = ['Diploma (2 years)', 'Post-Diploma (1 year)', 'Certificate (6 months)'];

  return (
    <div className="student-list-container">
      <h2>Registered Students</h2>

      {/* Program selection and search input */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="programSelect">Select Program:</label>
          <select id="programSelect" value={selectedProgram} onChange={handleProgramChange}>
            <option value="">-- Select a Program --</option>
            {programs.map((program) => (
              <option key={program} value={program}>
                {program}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="search">Search:</label>
          <input
            type="text"
            id="search"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by First/Last Name"
            disabled={!selectedProgram} // Disable search if no program is selected
          />
        </div>
      </div>

      {/* Display alert message */}
      {alertMessage && <div className="alert-message">{alertMessage}</div>}

      {/* Display filtered student list */}
      {filteredStudents.length > 0 ? (
        <table className="student-list-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('firstname')}>
                First Name {sortKey === 'firstname' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('lastname')}>
                Last Name {sortKey === 'lastname' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('email')}>
                Email {sortKey === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('phone')}>
                Phone {sortKey === 'phone' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('dob')}>
                Birthday {sortKey === 'dob' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('department')}>
                Department {sortKey === 'department' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('programName')}>
                Program {sortKey === 'programName' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.studentId}>
                <td>{student.firstname}</td>
                <td>{student.lastname}</td>
                <td>{student.email}</td>
                <td>{student.phone}</td>
                <td>{student.dob}</td>
                <td>{student.department}</td>
                <td>{student.programName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        selectedProgram && <p>No students registered for this program.</p> // Display if no students are found
      )}
    </div>
  );
};

export default StudentList;
