import { useEffect, useState } from "react";
import api from "../../services/api";

const typeIcons = { dining: "🍽️", spa: "💆", transport: "🚗", laundry: "🧺", other: "✨" };

function Dining() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filterType, setFilterType] = useState("");

    const fetchServices = async () => {
        setLoading(true);
        try {
            const params = filterType ? { type: filterType } : {};
            const response = await api.get("/services", { params });
            setServices(response.data);
        } catch (err) {
            setError("Failed to load services");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchServices(); }, [filterType]);

    return (
        <div>
            <div style={{
                background: "linear-gradient(rgba(15,51,44,0.35), rgba(15,51,44,0.48)), url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600') center/cover",
                color: "white", padding: "70px 24px", textAlign: "center",
            }}>
                <p style={{ letterSpacing: "0.15em", textTransform: "uppercase", fontSize: "13px", color: "var(--color-accent)", fontWeight: 600, marginBottom: "10px" }}>Indulge</p>
                <h1 style={{ color: "white", fontSize: "36px" }}>Dining & Extras</h1>
            </div>

            <div className="page">
                <select className="input" value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{ marginBottom: "24px", maxWidth: "220px" }}>
                    <option value="">All Types</option>
                    <option value="dining">Dining</option>
                    <option value="spa">Spa</option>
                    <option value="transport">Transport</option>
                    <option value="laundry">Laundry</option>
                    <option value="other">Other</option>
                </select>

                {loading && <p>Loading...</p>}
                {error && <p className="msg-error">{error}</p>}
                {!loading && services.length === 0 && <p style={{ color: "var(--color-text-muted)" }}>No services available.</p>}

                <div className="card-grid">
                    {services.map((s) => (
                        <div key={s._id} className="card">
                            <div style={{ fontSize: "26px", marginBottom: "8px" }}>{typeIcons[s.type] || "✨"}</div>
                            <h3 style={{ fontSize: "17px", marginBottom: "4px" }}>{s.name}</h3>
                            <p style={{ color: "var(--color-accent)", textTransform: "capitalize", fontSize: "12px", fontWeight: 700, letterSpacing: "0.03em" }}>{s.type}</p>
                            <p style={{ fontSize: "14px", color: "var(--color-text-muted)", margin: "10px 0" }}>{s.description}</p>
                            <p style={{ fontWeight: 700, fontSize: "16px" }}>₹{s.price}</p>
                        </div>
                    ))}
                </div>
                <p style={{ marginTop: "24px", color: "var(--color-text-muted)", fontSize: "14px", textAlign: "center" }}>
                    To add these to a booking, mention them during your reservation, or contact reception.
                </p>
            </div>
        </div>
    );
}

export default Dining;