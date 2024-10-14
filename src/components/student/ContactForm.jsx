import React, { useState, useEffect } from 'react';
import { userData } from '../../data/UserData';
import '../../css/Student.css';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    // Fetch the logged-in student details from localStorage and set them in the form
    useEffect(() => {
        const storedUsername = localStorage.getItem('currentUsername');
        const foundUser = userData.find(user => user.username === storedUsername);

        if (foundUser) {
            setFormData({
                name: `${foundUser.firstname} ${foundUser.lastname}`,
                email: foundUser.email,
                message: '',
            });
        }
    }, []); 

    // Handle input changes for the message field
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        const { name, email, message } = formData;

        const newForm = {
            id: Date.now(),
            studentName: name,
            dateSubmitted: new Date().toISOString().split('T')[0],
            message,
        };

        // Save submitted form to localStorage
        const storedForms = JSON.parse(localStorage.getItem('submittedForms')) || [];
        const updatedForms = [...storedForms, newForm];
        localStorage.setItem('submittedForms', JSON.stringify(updatedForms));

        alert(`Message sent to admin:\nName: ${name}\nEmail: ${email}\nMessage: ${message}`);
        setFormData({ ...formData, message: '' });
    };

    return (
        <div className="contact-form">
            <h2>Connect with Admin</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        readOnly 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        readOnly 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="message">Message:</label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>
                <button type="submit">Send Message</button>
            </form>
            <p>Your feedback is important to us!</p>
        </div>
    );
};

export default ContactForm;
