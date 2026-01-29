import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiUser,
  FiMail,
  FiLock,
  FiUserPlus,
  FiBriefcase,
} from "react-icons/fi";
import "../styles/Auth.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    jobTitle: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (formData.username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }

    // Check company email domain
    const emailDomain = formData.email.split("@")[1]?.toLowerCase();
    if (emailDomain !== "techcorp.com") {
      setError("Please use your company email (techcorp.com)");
      return;
    }

    setLoading(true);

    const result = await register({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      department: formData.department,
      jobTitle: formData.jobTitle,
    });

    setLoading(false);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-card">
        <div className="auth-header">
          <h1>Employee Registration</h1>
          <p className="text-muted">Create your TechCorp account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="alert alert-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="username" className="form-label">
              <FiUser /> Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="input"
              placeholder="johndoe"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              <FiMail /> Company Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="input"
              placeholder="john.doe@techcorp.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              pattern=".*@techcorp\.com$"
              title="Please use your company email (techcorp.com)"
            />
            <small className="form-hint">
              Required: Your TechCorp email address
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="department" className="form-label">
              <FiBriefcase /> Department
            </label>
            <input
              type="text"
              id="department"
              name="department"
              className="input"
              placeholder="Engineering"
              value={formData.department}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="jobTitle" className="form-label">
              <FiBriefcase /> Job Title
            </label>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              className="input"
              placeholder="Senior Developer"
              value={formData.jobTitle}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              <FiLock /> Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="input"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              <FiLock /> Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="input"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Creating account...
              </>
            ) : (
              <>
                <FiUserPlus /> Create Account
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p className="text-muted text-sm">
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
