import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function Dashboard() {
    const { user, logout } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [bookingsRes, roomsRes] = await Promise.all([api.get("/bookings"), api.get("/rooms")]);
                setBookings(bookingsRes.data);
                setRooms(roomsRes.data);
            } catch (err) {
                setError("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading...</p>;
    if (error) return <p className="msg-error" style={{ maxWidth: "900px", margin: "40px auto" }}>{error}</p>;

    const pendingCheckIns = bookings.filter((b) => b.status === "confirmed" || b.status === "pending");
    const activeStays = bookings.filter((b) => b.status === "checked-in");
    const occupiedRoomIds = new Set(activeStays.map((b) => b.room?._id));
    const occupancyRate = rooms.length > 0 ? ((occupiedRoomIds.size / rooms.length) * 100).toFixed(1) : 0;

    return (
        <div>
            <div style={{ background: "var(--color-primary)", color: "white", padding: "40px 24px" }}>
                <div className="page" style={{ padding: 0, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
                    <div>
                        <h2 style={{ color: "white" }}>Welcome, {user?.name}</h2>
                        <p style={{ color: "rgba(255,255,255,0.8)", marginTop: "4px" }}>Here's today's front-desk overview.</p>
                    </div>
                    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                        <Link to="/manager/inventory" style={{ color: "white" }}>Inventory</Link>
                        <Link to="/manager/reception" style={{ color: "white" }}>Reception</Link>
                        <Link to="/manager/reports" style={{ color: "white" }}>Reports</Link>
                        <button onClick={logout} className="btn btn-outline btn-sm" style={{ borderColor: "white", color: "white" }}>Logout</button>
                    </div>
                </div>
            </div>

            <div className="page">
                <div className="stat-row">
                    <div className="stat-card"><div className="value">{occupancyRate}%</div><div className="label">Occupancy Rate</div></div>
                    <div className="stat-card"><div className="value">{rooms.length}</div><div className="label">Total Rooms</div></div>
                    <div className="stat-card"><div className="value">{pendingCheckIns.length}</div><div className="label">Pending Check-ins</div></div>
                    <div className="stat-card"><div className="value">{activeStays.length}</div><div className="label">Active Stays</div></div>
                </div>

                <h3 style={{ marginBottom: "14px" }}>Pending Check-ins</h3>
                {pendingCheckIns.length === 0 ? (
                    <p style={{ color: "var(--color-text-muted)" }}>No pending check-ins.</p>
                ) : (
                    <div className="card-grid">
                        {pendingCheckIns.map((b) => (
                            <div key={b._id} className="card">
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                                    <h3 style={{ fontSize: "16px" }}>{b.guest?.name}</h3>
                                    <span className={`badge badge-${b.status}`}>{b.status}</span>
                                </div>
                                <p style={{ fontSize: "13px", color: "var(--color-text-muted)" }}>{b.guest?.email}</p>
                                <p style={{ fontSize: "14px", marginTop: "8px" }}>Room {b.room?.roomNumber} &middot; {new Date(b.checkInDate).toDateString()}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;