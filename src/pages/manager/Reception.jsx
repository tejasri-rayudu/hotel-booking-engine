import { useEffect, useState } from "react";
import api from "../../services/api";

function Reception() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const fetchBookings = async () => {
        try {
            const response = await api.get("/bookings");
            setBookings(response.data);
        } catch (err) {
            setError("Failed to load bookings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBookings(); }, []);

    const handleStatusUpdate = async (bookingId, newStatus) => {
        try {
            await api.put(`/bookings/${bookingId}/status`, { status: newStatus });
            setMessage(`Booking updated to ${newStatus}`);
            fetchBookings();
        } catch (err) {
            setMessage(err.response?.data?.message || "Failed to update status");
        }
    };

    const relevantBookings = bookings.filter((b) => !["cancelled", "checked-out"].includes(b.status));

    return (
        <div className="page">
            <h2 style={{ marginBottom: "20px" }}>Reception — Check-in / Check-out</h2>
            {message && <p className="msg-info">{message}</p>}
            {loading && <p>Loading...</p>}
            {error && <p className="msg-error">{error}</p>}
            {!loading && relevantBookings.length === 0 && <p style={{ color: "var(--color-text-muted)" }}>No active bookings to manage.</p>}

            <div className="card-grid">
                {!loading && relevantBookings.map((b) => (
                    <div key={b._id} className="card">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                            <h3 style={{ fontSize: "16px" }}>{b.guest?.name}</h3>
                            <span className={`badge badge-${b.status}`}>{b.status}</span>
                        </div>
                        <p style={{ fontSize: "13px", color: "var(--color-text-muted)" }}>{b.guest?.email}</p>
                        <p style={{ fontSize: "14px", margin: "8px 0" }}>Room {b.room?.roomNumber} ({b.room?.category})</p>
                        <p style={{ fontSize: "13px", color: "var(--color-text-muted)" }}>
                            {new Date(b.checkInDate).toDateString()} → {new Date(b.checkOutDate).toDateString()}
                        </p>
                        <div style={{ marginTop: "12px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                            {(b.status === "pending" || b.status === "confirmed") && (
                                <button onClick={() => handleStatusUpdate(b._id, "checked-in")} className="btn btn-sm">Check In</button>
                            )}
                            {b.status === "checked-in" && (
                                <button onClick={() => handleStatusUpdate(b._id, "checked-out")} className="btn btn-sm">Check Out</button>
                            )}
                            {b.status === "pending" && (
                                <button onClick={() => handleStatusUpdate(b._id, "confirmed")} className="btn btn-outline btn-sm">Confirm</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Reception;