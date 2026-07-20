import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend,
} from "chart.js";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Dashboard() {
    const { user, logout } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [bookingsRes, invoicesRes] = await Promise.all([api.get("/bookings"), api.get("/invoices")]);
                setBookings(bookingsRes.data);
                setInvoices(invoicesRes.data);
            } catch (err) {
                setError("Failed to load dashboard data: " + (err.response?.data?.message || err.message));
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading...</p>;
    if (error) return <p className="msg-error" style={{ maxWidth: "900px", margin: "40px auto" }}>{error}</p>;

    const totalEarnings = invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
    const paidEarnings = invoices.filter((i) => i.paymentStatus === "paid").reduce((sum, i) => sum + (i.totalAmount || 0), 0);
    const pendingEarnings = invoices.filter((i) => i.paymentStatus === "pending").reduce((sum, i) => sum + (i.totalAmount || 0), 0);

    const earningsByMonth = {};
    invoices.forEach((inv) => {
        if (!inv.createdAt) return;
        const month = new Date(inv.createdAt).toLocaleString("default", { month: "short", year: "numeric" });
        earningsByMonth[month] = (earningsByMonth[month] || 0) + (inv.totalAmount || 0);
    });

    const lineData = {
        labels: Object.keys(earningsByMonth),
        datasets: [{ label: "Earnings (₹)", data: Object.values(earningsByMonth), borderColor: "#C9A44C", backgroundColor: "rgba(201,164,76,0.18)", tension: 0.3, fill: true }],
    };

    return (
        <div>
            <div style={{ background: "var(--color-primary)", color: "white", padding: "40px 24px" }}>
                <div className="page" style={{ padding: 0, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
                    <div>
                        <h2 style={{ color: "white" }}>Admin Dashboard</h2>
                        <p style={{ color: "rgba(255,255,255,0.8)", marginTop: "4px" }}>Welcome, {user?.name}</p>
                    </div>
                    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                        <Link to="/admin/branches" style={{ color: "white" }}>Branches</Link>
                        <Link to="/admin/logs" style={{ color: "white" }}>Logs</Link>
                        <Link to="/admin/settings" style={{ color: "white" }}>Settings</Link>
                        <button onClick={logout} className="btn btn-outline btn-sm" style={{ borderColor: "white", color: "white" }}>Logout</button>
                    </div>
                </div>
            </div>

            <div className="page">
                <div className="stat-row">
                    <div className="stat-card"><div className="value">₹{totalEarnings.toLocaleString()}</div><div className="label">Total Earnings</div></div>
                    <div className="stat-card"><div className="value">₹{paidEarnings.toLocaleString()}</div><div className="label">Paid</div></div>
                    <div className="stat-card"><div className="value">₹{pendingEarnings.toLocaleString()}</div><div className="label">Pending</div></div>
                    <div className="stat-card"><div className="value">{bookings.length}</div><div className="label">Total Bookings</div></div>
                </div>

                <div className="card">
                    <h3 style={{ marginBottom: "14px" }}>Earnings Over Time</h3>
                    {Object.keys(earningsByMonth).length > 0 ? <Line data={lineData} /> : <p style={{ color: "var(--color-text-muted)" }}>No earnings data yet.</p>}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;