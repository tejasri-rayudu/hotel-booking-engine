import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

function Profile() {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || "",
        phone: user?.phone || "",
        diningPreferences: user?.diningPreferences?.join(", ") || "",
    });
    const [message, setMessage] = useState("");

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage("Profile updated locally. Backend persistence coming soon.");
    };

    const initials = (user?.name || "?").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

    return (
        <div className="page-narrow">
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <div style={{
                    width: "72px", height: "72px", borderRadius: "50%", background: "var(--color-primary)",
                    color: "white", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "24px", fontWeight: 700, margin: "0 auto 12px", fontFamily: "'Playfair Display', serif",
                }}>
                    {initials}
                </div>
                <h2>{user?.name}</h2>
                <p style={{ color: "var(--color-text-muted)", fontSize: "14px" }}>{user?.email}</p>
            </div>

            <div className="card" style={{ padding: "32px" }}>
                {message && <p className="msg-info">{message}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="field">
                        <label>Name</label>
                        <input className="input" name="name" value={formData.name} onChange={handleChange} />
                    </div>
                    <div className="field">
                        <label>Email</label>
                        <input className="input" value={user?.email || ""} disabled style={{ backgroundColor: "#f5f5f5" }} />
                    </div>
                    <div className="field">
                        <label>Phone</label>
                        <input className="input" name="phone" value={formData.phone} onChange={handleChange} />
                    </div>
                    <div className="field">
                        <label>Dining Preferences</label>
                        <input className="input" name="diningPreferences" value={formData.diningPreferences} onChange={handleChange} placeholder="vegetarian, no-seafood" />
                    </div>
                    <button type="submit" className="btn btn-block">Save Profile</button>
                </form>
            </div>
        </div>
    );
}

export default Profile;