import { useEffect, useState } from "react";
import api from "../../services/api";

function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionMsg, setActionMsg] = useState("");

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

    useEffect(() => { fetchBookings(); }, []);

    const handleCancel = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;
        try {
            await api.put(`/bookings/${bookingId}/cancel`);
            setActionMsg("Booking cancelled successfully");
            fetchBookings();
        } catch (err) {
            setActionMsg(err.response?.data?.message || "Failed to cancel booking");
        }
    };

    const handleGetInvoice = async (bookingId) => {
        try {
            const response = await api.post(`/invoices/${bookingId}`);
            const invoiceId = response.data._id;
            const downloadUrl = `${import.meta.env.VITE_API_URL}/invoices/${invoiceId}/download`;
            const token = localStorage.getItem("token");
            const pdfResponse = await fetch(downloadUrl, { headers: { Authorization: `Bearer ${token}` } });
            const blob = await pdfResponse.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `invoice-${bookingId}.pdf`;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            setActionMsg("Failed to generate invoice");
        }
    };

    return (
        <div className="page">
            <h2 style={{ marginBottom: "20px" }}>My Bookings</h2>
            {actionMsg && <p className="msg-info">{actionMsg}</p>}
            {loading && <p>Loading...</p>}
            {error && <p className="msg-error">{error}</p>}
            {!loading && !error && bookings.length === 0 && <p style={{ color: "var(--color-text-muted)" }}>You have no bookings yet.</p>}

            <div className="card-grid">
                {!loading && bookings.map((booking) => (
                    <div key={booking._id} className="card">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                            <h3 style={{ fontSize: "16px" }}>Room {booking.room?.roomNumber}</h3>
                            <span className={`badge badge-${booking.status}`}>{booking.status}</span>
                        </div>
                        <p style={{ fontSize: "13px", color: "var(--color-text-muted)", textTransform: "capitalize" }}>{booking.room?.category}</p>
                        <p style={{ fontSize: "14px", margin: "8px 0" }}>
                            {new Date(booking.checkInDate).toDateString()} → {new Date(booking.checkOutDate).toDateString()}
                        </p>
                        <p style={{ fontSize: "13px", color: "var(--color-text-muted)" }}>{booking.numberOfGuests} guest(s)</p>
                        <p style={{ fontWeight: 700, margin: "8px 0" }}>₹{booking.totalAmount}</p>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                            {["pending", "confirmed"].includes(booking.status) && (
                                <button onClick={() => handleCancel(booking._id)} className="btn btn-danger btn-sm">Cancel</button>
                            )}
                            <button onClick={() => handleGetInvoice(booking._id)} className="btn btn-outline btn-sm">Invoice (PDF)</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MyBookings;