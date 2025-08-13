import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Registration.module.css';
import illustration from '../../assets/bg-01.png';
import logo from '../../assets/logo.svg';
// Corrected import: Use registerUserAdmin from your userAdmin service
import { registerUserAdmin } from "../../services/userAdmin";

const Registration: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState(''); // New state for name
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState(''); // New state for mobile number
  const [message, setMessage] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const navigate = useNavigate();

  const handleShowMessage = (msg: string) => {
    setMessage(msg);
    setShowMessageModal(true);
  };

  const handleCloseMessage = () => {
    setShowMessageModal(false);
    setMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      handleShowMessage('Passwords do not match. Please try again.');
      return;
    }

    if (!name || !username || !password || !mobileNumber) {
      handleShowMessage('Please fill in all required fields.');
      return;
    }

    try {
      // Call the backend API for registration using the correctly named function
      const response = await registerUserAdmin({
        name,
        username,
        password,
        role: 'admin', // Defaulting role to 'admin' as per login context
        mobile_number: mobileNumber,
      });

      if (response.success) {
        handleShowMessage('Registration successful! You can now log in.');
        setTimeout(() => {
          handleCloseMessage();
          navigate('/'); // Navigate to login page after successful registration
        }, 2000);
      } else {
        handleShowMessage(response.message || 'Registration failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      handleShowMessage(error.message || 'An error occurred during registration. Please try again later.');
    }
  };

  return (
    <div className={styles.registrationContainer}>
      {/* Left illustration */}
      <div className={styles.registrationLeft}>
        <img src={illustration} alt="Illustration" />
      </div>

      {/* Right registration form */}
      <div className={styles.registrationRight}>
        <img src={logo} alt="Logo" className={styles.logo} />
        <h2>Register</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Name Input */}
          <div className={styles.inputGroup}>
            <input
              type="text"
              placeholder="Name*"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <span className={styles.inputIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#555" viewBox="0 0 24 24">
                <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.2c-2.9 0-8.7 1.4-8.7 4.3V22h17.4v-3.5c0-2.9-5.8-4.3-8.7-4.3z"/>
              </svg>
            </span>
          </div>

          {/* Username Input */}
          <div className={styles.inputGroup}>
            <input
              type="text"
              placeholder="Username*"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <span className={styles.inputIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#555" viewBox="0 0 24 24">
                <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.2c-2.9 0-8.7 1.4-8.7 4.3V22h17.4v-3.5c0-2.9-5.8-4.3-8.7-4.3z"/>
              </svg>
            </span>
          </div>

          {/* Password Input */}
          <div className={styles.inputGroup}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password*"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className={styles.inputIcon}
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: 'pointer' }}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#555" viewBox="0 0 24 24">
                  <path d="M12 5c-7.633 0-12 7-12 7s4.367 7 12 7 12-7 12-7-4.367-7-12-7zm0 12c-2.761 0-5-2.238-5-5s2.239-5 5-5 5 2.238 5 5-2.239 5-5 5zm0-8.5c-1.933 0-3.5 1.567-3.5 3.5s1.567 3.5 3.5 3.5 3.5-1.567 3.5-3.5-1.567-3.5-3.5-3.5z"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#555" viewBox="0 0 24 24">
                  <path d="M12 5c7.633 0 12 7 12 7s-4.367 7-12 7-12-7-12-7 4.367-7 12-7zm0 2c-4.418 0-8 3.582-8 3.582s3.582 3.583 8 3.583 8-3.583 8-3.583-3.582-3.582-8-3.582zm0 6c-.828 0-1.5-.672-1.5-1.5S11.172 10 12 10s1.5.672 1.5 1.5S12.828 13 12 13z"/>
                </svg>
              )}
            </span>
          </div>

          {/* Confirm Password Input */}
          <div className={styles.inputGroup}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm Password*"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span
              className={styles.inputIcon}
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: 'pointer' }}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#555" viewBox="0 0 24 24">
                  <path d="M12 5c-7.633 0-12 7-12 7s4.367 7 12 7 12-7 12-7-4.367-7-12-7zm0 12c-2.761 0-5-2.238-5-5s2.239-5 5-5 5 2.238 5 5-2.239 5-5 5zm0-8.5c-1.933 0-3.5 1.567-3.5 3.5s1.567 3.5 3.5 3.5 3.5-1.567 3.5-3.5-1.567-3.5-3.5-3.5z"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#555" viewBox="0 0 24 24">
                  <path d="M12 5c7.633 0-12 7-12 7s-4.367 7-12 7-12-7-12-7 4.367-7 12-7zm0 2c-4.418 0-8 3.582-8 3.582s3.582 3.583 8 3.583 8-3.583 8-3.583-3.582-3.582-8-3.582zm0 6c-.828 0-1.5-.672-1.5-1.5S11.172 10 12 10s1.5.672 1.5 1.5S12.828 13 12 13z"/>
                </svg>
              )}
            </span>
          </div>

          {/* Mobile Number Input */}
          <div className={styles.inputGroup}>
            <input
              type="tel" // Use type="tel" for phone numbers
              placeholder="Mobile Number*"
              required
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
            />
            <span className={styles.inputIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#555" viewBox="0 0 24 24">
                    <path d="M20 22h-16c-1.104 0-2-.896-2-2v-16c0-1.104.896-2 2-2h16c1.104 0 2 .896 2 2v16c0 1.104-.896 2-2 2zm-12.5-10c0 .828-.672 1.5-1.5 1.5s-1.5-.672-1.5-1.5c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5zm-2.5-2.5c0-.552-.448-1-1-1s-1 .448-1 1 .448 1 1 1 1-.448 1-1zm10.5 4.5h-8v-2h8v2zm0-4h-8v-2h8v2zm0-4h-8v-2h8v2z"/>
                </svg>
            </span>
          </div>

          <button type="submit" className={styles.registerBtn}>
            Register
          </button>
        </form>

        <p className={styles.loginLink}>
          Already have an account? <a href="/">Login</a>
        </p>
        <a href="/terms" className={styles.terms}>
          Terms & Conditions
        </a>

        <p className={styles.version}>Version 2.12.2</p>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <p>{message}</p>
            <button onClick={handleCloseMessage} className={styles.modalCloseBtn}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Registration;