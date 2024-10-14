import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/SignUp.css'; 

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthday: '',
    department: 'SD',
    program: '',
    username: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false); // Manage modal visibility
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  // Validate form input
  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    // Check if all fields are filled
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        formErrors[key] = `${key.replace(/([A-Z])/g, ' $1')} is required`;
        isValid = false;
      }
    });

    setErrors(formErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const studentId = `SD${Math.floor(Math.random() * 10000)}`; // Generate student ID
      console.log("User Registered: ", { ...formData, studentId });
      setShowModal(true); // Show success modal
    }
  };

  // Handle modal close and redirect to login
  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/login'); 
  };

  return (
    <div className="signup-container">
      <h2>Student Registration Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>First Name</label>
          <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} />
          {errors.firstName && <p className="error-message">{errors.firstName}</p>}
        </div>

        <div className="input-group">
          <label>Last Name</label>
          <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} />
          {errors.lastName && <p className="error-message">{errors.lastName}</p>}
        </div>

        <div className="input-group">
          <label>Email</label>
          <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>

        <div className="input-group">
          <label>Phone</label>
          <input name="phone" type="tel" placeholder="Phone" value={formData.phone} onChange={handleChange} />
          {errors.phone && <p className="error-message">{errors.phone}</p>}
        </div>

        <div className="input-group">
          <label>Birthday</label>
          <input name="birthday" type="date" placeholder="Birthday" value={formData.birthday} onChange={handleChange} />
          {errors.birthday && <p className="error-message">{errors.birthday}</p>}
        </div>

        <div className="input-group">
          <label>Program</label>
          <select name="program" value={formData.program} onChange={handleChange}>
            <option value="">-- Select Program --</option>
            <option value="Diploma (2 years)">Diploma (2 years)</option>
            <option value="Post-Diploma (1 year)">Post-Diploma (1 year)</option>
            <option value="Certificate (6 months)">Certificate (6 months)</option>
          </select>
          {errors.program && <p className="error-message">{errors.program}</p>}
        </div>

        <div className="input-group">
          <label>Username</label>
          <input name="username" placeholder="Username" value={formData.username} onChange={handleChange} />
          {errors.username && <p className="error-message">{errors.username}</p>}
        </div>

        <div className="input-group">
          <label>Password</label>
          <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} />
          {errors.password && <p className="error-message">{errors.password}</p>}
        </div>

        <button type="submit" className="signup-button">Sign Up</button>
      </form>

      {showModal && ( // Display modal after successful registration
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Welcome to Bow Course System!</h2>
            <p>Your registration was successful. You can now log in to access your dashboard.</p>
            <button className="modal-close-button" onClick={handleCloseModal}>Proceed to Login</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;
