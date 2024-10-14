import React, { useState } from 'react';
import { userData } from '../../data/UserData'; 
import '../../css/Admin.css';

const SubmittedForms = () => {
    const [sortKey, setSortKey] = useState(''); // Key used to sort the forms
    const [sortOrder, setSortOrder] = useState('asc'); // Sort order (ascending/descending)
    const [searchQuery, setSearchQuery] = useState(''); // Search query for filtering

// Month names for converting month abbreviations to numeric format
    const monthNames = {
        january: '01',
        february: '02',
        march: '03',
        april: '04',
        may: '05',
        june: '06',
        july: '07',
        august: '08',
        september: '09',
        october: '10',
        november: '11',
        december: '12',
    };

    // Extract submitted forms data from userData
    const submittedFormsData = userData
        .filter(user => user.message)  // Only include users who submitted a form
        .map(user => ({
            id: user.studentId || user.username, 
            studentName: `${user.firstname} ${user.lastname}`,
            dateSubmitted: new Date().toISOString().split('T')[0], 
            message: user.message,
        }));

    // Handle sorting based on the selected key
    const handleSort = (key) => {
        const order = sortKey === key && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortKey(key);
        setSortOrder(order);
    };

    // Check if the search query matches the form's submission date
    const matchesDate = (dateSubmitted, searchQuery) => {
        const searchLower = searchQuery.toLowerCase();
        const date = new Date(dateSubmitted);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        // Check if searchQuery matches full date (e.g., 10-02-2024)
        const isFullDateMatch = searchQuery === `${month}-${day}-${year}`;

        // Check if searchQuery matches numeric month or month name (e.g., "10" or "October")
        const isMonthMatch =
            searchLower === month || searchLower === monthNames[searchLower];

        // Check if searchQuery matches the year
        const isYearMatch = searchLower === String(year);

        // Check if searchQuery matches the month name like "October" or abbreviation "Oct"
        const isMonthNameMatch = monthNames[searchLower] === month;

        return isFullDateMatch || isMonthMatch || isMonthNameMatch || isYearMatch;
    };

    // Filter and sort the submitted forms based on the search query and sort key
    const filteredAndSortedForms = submittedFormsData
        .filter((form) => {
            const searchLower = searchQuery.toLowerCase();
            return (
                form.studentName.toLowerCase().includes(searchLower) ||
                form.message.toLowerCase().includes(searchLower) ||
                matchesDate(form.dateSubmitted, searchQuery)
            );
        })
        .sort((a, b) => {
            if (!sortKey) return 0;
            const aValue = sortKey === 'name' ? a.studentName.toLowerCase() : new Date(a.dateSubmitted);
            const bValue = sortKey === 'name' ? b.studentName.toLowerCase() : new Date(b.dateSubmitted);
            return sortOrder === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
        });

    return (
        <div className="submitted-forms-container">
            <h2>Submitted Forms</h2>

            <div className="form-controls">
                <div className="sort-container">
                    <label>Sort By:</label>
                    <select onChange={(e) => handleSort(e.target.value)} value={sortKey}>
                        <option value="">-- Select --</option>
                        <option value="name">Student Name</option>
                        <option value="date">Date Submitted</option>
                    </select>
                </div>

                <div className="search-container">
                    <label>Search:</label>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by Student Name, or Date: Month (e.g., October) or Year (YYYY)"
                    />
                </div>
            </div>

            {filteredAndSortedForms.length > 0 ? (
                <table className="submitted-forms-table">
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Date Submitted</th>
                            <th>Message</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAndSortedForms.map((form) => (
                            <tr key={form.id}>
                                <td>{form.studentName}</td>
                                <td>{form.dateSubmitted}</td>
                                <td>{form.message}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="no-forms-message">No forms found matching your criteria.</p>
            )}
        </div>
    );
};

export default SubmittedForms;
