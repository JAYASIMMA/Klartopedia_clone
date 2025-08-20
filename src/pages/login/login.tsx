import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import styles from "./Login.module.css";
import illustration from "../../assets/bg-01.png";
import logo from "../../assets/logo.svg";
import { loginUser } from "../../services/loginservices"; // 🔹 API service

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await loginUser(username, password);

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/home");
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: "Invalid Username or Password",
        });
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Something went wrong!",
      });
    }
  };

  return (
    <div className={styles.loginContainer}>
      {/* Left illustration */}
      <div className={styles.loginLeft}>
        <img src={illustration} alt="Illustration" />
      </div>

      {/* Right login */}
      <div className={styles.loginRight}>
        <img src={logo} alt="Logo" className={styles.logo} />
        <h2>Klartopedia</h2>

        {/* Role Selection */}
        <div className={styles.roleTabs}>
          <button className={`${styles.roleButton} ${styles.active}`}>
            <span className={styles.adminIcon}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                fill="#fff"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.2c-2.9 0-8.7 1.4-8.7 4.3V22h17.4v-3.5c0-2.9-5.8-4.3-8.7-4.3z" />
              </svg>
            </span>
            <span>Admin</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Username */}
          <div className={styles.inputGroup}>
            <input
              type="text"
              placeholder="Username*"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <span className={styles.inputIcon}>
              {/* User Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="#555"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.2c-2.9 0-8.7 1.4-8.7 4.3V22h17.4v-3.5c0-2.9-5.8-4.3-8.7-4.3z" />
              </svg>
            </span>
          </div>

          {/* Password */}
          <div className={styles.inputGroup}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password*"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.passwordInput}
            />
            <span
              className={styles.inputIcon}
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: "pointer" }}
            >
              {showPassword ? (
                // Eye Open
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="#555"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 5c-7.633 0-12 7-12 7s4.367 7 12 7 12-7 12-7-4.367-7-12-7zm0 12c-2.761 0-5-2.238-5-5s2.239-5 5-5 5 2.238 5 5-2.239 5-5 5z" />
                  <circle cx="12" cy="12" r="2.5" />
                </svg>
              ) : (
                // Eye Closed
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="#555"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 5c7.633 0 12 7 12 7s-4.367 7-12 7-12-7-12-7 4.367-7 12-7zm0 2c-4.418 0-8 3.582-8 3.582s3.582 3.583 8 3.583 8-3.583 8-3.583-3.582-3.582-8-3.582zm0 6c-.828 0-1.5-.672-1.5-1.5S11.172 10 12 10s1.5.672 1.5 1.5S12.828 13 12 13z" />
                </svg>
              )}
            </span>
          </div>

          {/* Options */}
          <div className={styles.options}>
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="/forgot">Forgot Password?</a>
          </div>

          {/* Login button */}
          <button type="submit" className={styles.loginBtn}>
            Login
          </button>
        </form>

        <p className={styles.signup}>
          Need an account? <a href="/register">Sign Up</a>
        </p>
        <a href="/terms" className={styles.terms}>
          Terms & Conditions
        </a>

        <p className={styles.version}>Version 2.12.2</p>
      </div>
    </div>
  );
};

export default Login;
