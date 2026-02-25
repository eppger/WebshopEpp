import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#1a1d2e",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      <div style={{
        display: "flex",
        width: "100%",
        maxWidth: "850px",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 25px 60px rgba(0,0,0,0.5)"
      }}>

        {/* Vasak pool — vorm */}
        <div style={{
          flex: 1,
          backgroundColor: "#252840",
          padding: "50px 40px",
        }}>
          {/* Tabid */}
          <div style={{ display: "flex", gap: "24px", marginBottom: "40px" }}>
            <span style={{
              color: "#fff",
              fontWeight: "600",
              fontSize: "1rem",
              borderBottom: "2px solid #f5a623",
              paddingBottom: "4px",
              cursor: "pointer"
            }}>Login</span>
            <Link to="/signup" style={{
              color: "#888",
              fontSize: "1rem",
              textDecoration: "none",
              paddingBottom: "4px"
            }}>Register</Link>
          </div>

          <h2 style={{ color: "#fff", fontWeight: "700", marginBottom: "6px" }}>
            Welcome back!
          </h2>
          <p style={{ color: "#888", marginBottom: "32px", fontSize: "0.9rem" }}>
            Sign in to continue
          </p>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ color: "#aaa", fontSize: "0.75rem", marginBottom: "6px", display: "block" }}>
                Email
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                required
                style={{
                  width: "100%",
                  backgroundColor: "#1e2035",
                  border: "1px solid #3a3d55",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  color: "#fff",
                  fontSize: "0.95rem",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>

            {/* Parool */}
            <div style={{ marginBottom: "16px", position: "relative" }}>
              <label style={{ color: "#aaa", fontSize: "0.75rem", marginBottom: "6px", display: "block" }}>
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••"
                required
                style={{
                  width: "100%",
                  backgroundColor: "#1e2035",
                  border: "1px solid #3a3d55",
                  borderRadius: "8px",
                  padding: "12px 40px 12px 16px",
                  color: "#fff",
                  fontSize: "0.95rem",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute", right: "14px", bottom: "13px",
                  cursor: "pointer", color: "#888", fontSize: "1rem"
                }}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>

            {/* Remember me + Forgot */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
              <label style={{ color: "#f5a623", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  style={{ accentColor: "#f5a623" }}
                />
                Remember me
              </label>
              <a href="#" style={{ color: "#888", fontSize: "0.85rem", textDecoration: "none" }}>
                Forgot password?
              </a>
            </div>

            {/* Nupp */}
            <button
              type="submit"
              style={{
                width: "100%",
                backgroundColor: "#f5a623",
                border: "none",
                borderRadius: "8px",
                padding: "13px",
                color: "#fff",
                fontWeight: "700",
                fontSize: "1rem",
                cursor: "pointer",
                marginBottom: "24px",
                transition: "background 0.2s"
              }}
              onMouseOver={e => e.target.style.backgroundColor = "#e09510"}
              onMouseOut={e => e.target.style.backgroundColor = "#f5a623"}
            >
              Sign In
            </button>

          </form>
        </div>

        {/* Parem pool — pilt */}
        <div style={{
          flex: 1,
          backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "500px"
        }} />
      </div>
    </div>
  );
}

export default Login;