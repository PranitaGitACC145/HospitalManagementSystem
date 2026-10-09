import { useState } from "react";



function Login({ onLogin }) {

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (userId === "admin01" && password === "admin123") {
      onLogin("admin");
    }

    else if (userId === "nurse01" && password === "nurse123") {
      onLogin("nurse");
    }

    else if (userId === "doctor01" && password === "doctor123") {
      onLogin("doctor");
    }

    else {
      setError("Invalid User ID or Password");
    }
  };

return (
  <div className="login-page">

    <div className="login-container">

      <div className="login-left">

        <div className="login-logo">
          🏥
        </div>

        <h1>Virus Care Facility</h1>

        <p>
          Quarantine & Treatment Management System
        </p>

        <div className="login-info">

          <div>✓ Patient monitoring</div>
          <div>✓ Daily temperature tracking</div>
          <div>✓ Doctor & nurse coordination</div>
          <div>✓ Timely discharge management</div>

        </div>

      </div>


      <div className="login-right">

        <h2>Welcome back</h2>

        <p className="login-subtitle">
          Sign in to access your workspace
        </p>


        <form
          className="login-form"
          onSubmit={handleLogin}
        >

          <label>User ID</label>

          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter your User ID"
          />


          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />


          {error && (
            <div className="login-error">
              {error}
            </div>
          )}


          <button type="submit">
            Sign In
          </button>

        </form>


        <div className="login-security">
          🔒 Authorized staff access only
        </div>

      </div>

    </div>

  </div>
);
}

export default Login;