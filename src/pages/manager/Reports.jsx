import { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend,
} from "chart.js";
import api from "../../services/api";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

function Reports() {
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
                setError("Failed to load report data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading reports...</p>;
    if (error) return <p className="msg-error" style={{ maxWidth: "900px", margin: "40px auto" }}>{error}</p>;

    const revenueByMonth = {};
    bookings.forEach((b) => {
        if (b.status === "cancelled") return;
        const month = new Date(b.checkInDate).toLocaleString("default", { month: "short", year: "numeric" });
        revenueByMonth[month] = (revenueByMonth[month] || 0) + b.totalAmount;
    });

    const revenueData = {
        labels: Object.keys(revenueByMonth),
        datasets: [{ label: "Revenue (₹)", data: Object.values(revenueByMonth), backgroundColor: "#1B4B43", borderRadius: 6 }],
    };

    const statusCounts = {};
    bookings.forEach((b) => { statusCounts[b.status] = (statusCounts[b.status] || 0) + 1; });

    const statusData = {
        labels: Object.keys(statusCounts),
        datasets: [{ data: Object.values(statusCounts), backgroundColor: ["#C9A44C", "#1B4B43", "#3F7D58", "#8B6F47", "#B3432B"] }],
    };

    const totalRevenue = bookings.reduce((sum, b) => (b.status !== "cancelled" ? sum + b.totalAmount : sum), 0);

    return (
        <div className="page">
            <h2 style={{ marginBottom: "20px" }}>Revenue & Occupancy Reports</h2>

            <div className="stat-row">
                <div className="stat-card"><div className="value">₹{totalRevenue.toLocaleString()}</div><div className="label">Total Revenue</div></div>
                <div className="stat-card"><div className="value">{bookings.length}</div><div className="label">Total Bookings</div></div>
                <div className="stat-card"><div className="value">{rooms.length}</div><div className="label">Total Rooms</div></div>
            </div>

            <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                <div className="card" style={{ flex: "1 1 400px" }}>
                    <h3 style={{ marginBottom: "14px" }}>Revenue by Month</h3>
                    <Bar data={revenueData} />
                </div>
                <div className="card" style={{ flex: "1 1 300px", maxWidth: "380px" }}>
                    <h3 style={{ marginBottom: "14px" }}>Bookings by Status</h3>
                    <Doughnut data={statusData} />
                </div>
            </div>
        </div>
    );
}

export default Reports;