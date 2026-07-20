import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function Dashboard() {
    const { user, logout } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await api.get("/bookings/my");
                setBookings(response.data);
            } catch (err) {
                setError("Failed to load bookings");
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const upcoming = bookings.filter((b) => new Date(b.checkInDate) > new Date() && b.status !== "cancelled");
    const past = bookings.filter((b) => new Date(b.checkOutDate) < new Date());
    const current = bookings.filter(
        (b) => new Date(b.checkInDate) <= new Date() && new Date(b.checkOutDate) >= new Date() && b.status !== "cancelled"
    );

    return (
        <div>
            <div style={{ background: "var(--color-primary)", color: "white", padding: "40px 24px" }}>
                <div className="page" style={{ padding: 0 }}>
                    <h2 style={{ color: "white" }}>Welcome back, {user?.name}</h2>
                    <p style={{ color: "rgba(255,255,255,0.8)", marginTop: "4px" }}>Here's what's coming up for your stay.</p>
                </div>
            </div>

            <div className="page">
                <div className="page-header" style={{ justifyContent: "flex-end" }}>
                    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                        <Link to="/guest/book-room">Book a Room</Link>
                        <Link to="/guest/profile">Profile</Link>
                        <button onClick={logout} className="btn btn-outline btn-sm">Logout</button>
                    </div>
                </div>

                {loading && <p>Loading your bookings...</p>}
                {error && <p className="msg-error">{error}</p>}

                {!loading && !error && (
                    <>
                        <BookingSection title="Current Stay" bookings={current} empty="No current stay." />
                        <BookingSection title="Upcoming Reservations" bookings={upcoming} empty="No upcoming reservations." />
                        <BookingSection title="Past Stays" bookings={past} empty="No past stays." />
                    </>
                )}
            </div>
        </div>
    );
}

function BookingSection({ title, bookings, empty }) {
    return (
        <section style={{ marginBottom: "30px" }}>
            <h3 style={{ marginBottom: "12px" }}>{title}</h3>
            {bookings.length === 0 ? (
                <p style={{ color: "var(--color-text-muted)" }}>{empty}</p>
            ) : (
                <div className="card-grid">
                    {bookings.map((b) => <BookingCard key={b._id} booking={b} />)}
                </div>
            )}
        </section>
    );
}

function BookingCard({ booking }) {
    return (
        <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                <h3 style={{ fontSize: "16px" }}>Room {booking.room?.roomNumber}</h3>
                <span className={`badge badge-${booking.status}`}>{booking.status}</span>
            </div>
            <p style={{ fontSize: "13px", color: "var(--color-text-muted)", textTransform: "capitalize" }}>{booking.room?.category}</p>
            <p style={{ fontSize: "14px", marginTop: "8px" }}>{new Date(booking.checkInDate).toDateString()} → {new Date(booking.checkOutDate).toDateString()}</p>
            <p style={{ fontWeight: 700, marginTop: "6px" }}>₹{booking.totalAmount}</p>
        </div>
    );
}

export default Dashboard;