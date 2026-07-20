import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function Register() {
    const [formData, setFormData] = useState({ name: "", email: "", password: "", phone: "" });
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
            const response = await api.post("/auth/register", formData);
            login(response.data);
            navigate("/guest/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-narrow">
            <div className="card" style={{ padding: "36px" }}>
                <h2 style={{ marginBottom: "20px" }}>Create Your Account</h2>
                {error && <p className="msg-error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="field">
                        <label>Full Name</label>
                        <input className="input" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="field">
                        <label>Email</label>
                        <input className="input" type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="field">
                        <label>Phone</label>
                        <input className="input" type="tel" name="phone" value={formData.phone} onChange={handleChange} />
                    </div>
                    <div className="field">
                        <label>Password</label>
                        <input className="input" type="password" name="password" value={formData.password} onChange={handleChange} required minLength={6} />
                    </div>
                    <button type="submit" disabled={loading} className="btn btn-block">
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>
                <p style={{ marginTop: "18px", fontSize: "14px" }}>
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;