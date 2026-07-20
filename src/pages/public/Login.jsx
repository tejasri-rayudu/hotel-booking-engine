import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function Login() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const response = await api.post("/auth/login", formData);
            login(response.data);
            const role = response.data.role;
            if (role === "admin") navigate("/admin/dashboard");
            else if (role === "manager") navigate("/manager/dashboard");
            else navigate("/guest/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-narrow">
            <div className="card" style={{ padding: "36px" }}>
                <h2 style={{ marginBottom: "20px" }}>Welcome Back</h2>
                {error && <p className="msg-error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="field">
                        <label>Email</label>
                        <input className="input" type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="field">
                        <label>Password</label>
                        <input className="input" type="password" name="password" value={formData.password} onChange={handleChange} required />
                    </div>
                    <button type="submit" disabled={loading} className="btn btn-block">
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
                <p style={{ marginTop: "18px", fontSize: "14px" }}>
                    Don't have an account? <Link to="/register">Register here</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;