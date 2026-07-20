import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";

function BookRoom() {
    const location = useLocation();
    const navigate = useNavigate();
    const preselectedRoomId = location.state?.roomId || "";

    const [rooms, setRooms] = useState([]);
    const [roomId, setRoomId] = useState(preselectedRoomId);
    const [checkInDate, setCheckInDate] = useState("");
    const [checkOutDate, setCheckOutDate] = useState("");
    const [numberOfGuests, setNumberOfGuests] = useState(1);
    const [promoCode, setPromoCode] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        api.get("/rooms").then((res) => setRooms(res.data)).catch(() => setError("Failed to load rooms"));
    }, []);

    const selectedRoom = rooms.find((r) => r._id === roomId);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);
        try {
            const response = await api.post("/bookings", {
                room: roomId,
                checkInDate,
                checkOutDate,
                numberOfGuests: Number(numberOfGuests),
                promoCode: promoCode || undefined,
            });
            setSuccess(`Booking confirmed! Total: ₹${response.data.totalAmount}`);
            setTimeout(() => navigate("/guest/my-bookings"), 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Booking failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page" style={{ maxWidth: "700px" }}>
            <h2 style={{ marginBottom: "20px", textAlign: "center" }}>Book a Room</h2>

            {selectedRoom && (
                <div className="card" style={{ marginBottom: "20px", display: "flex", gap: "14px", alignItems: "center" }}>
                    {selectedRoom.images?.[0] ? (
                        <img src={`${import.meta.env.VITE_API_URL.replace("/api", "")}${selectedRoom.images[0]}`} alt="" style={{ width: "90px", height: "70px", objectFit: "cover", borderRadius: "8px" }} />
                    ) : (
                        <div style={{ width: "90px", height: "70px", background: "var(--color-border)", borderRadius: "8px" }} />
                    )}
                    <div>
                        <p style={{ fontWeight: 700 }}>Room {selectedRoom.roomNumber} — <span style={{ textTransform: "capitalize", color: "var(--color-accent)" }}>{selectedRoom.category}</span></p>
                        <p style={{ fontSize: "13px", color: "var(--color-text-muted)" }}>₹{selectedRoom.pricePerNight} / night &middot; up to {selectedRoom.capacity} guests</p>
                    </div>
                </div>
            )}

            <div className="card" style={{ padding: "28px" }}>
                {error && <p className="msg-error">{error}</p>}
                {success && <p className="msg-success">{success}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="field">
                        <label>Room</label>
                        <select className="input" value={roomId} onChange={(e) => setRoomId(e.target.value)} required>
                            <option value="">Select a room</option>
                            {rooms.map((room) => (
                                <option key={room._id} value={room._id}>
                                    Room {room.roomNumber} - {room.category} (₹{room.pricePerNight}/night, max {room.capacity} guests)
                                </option>
                            ))}
                        </select>
                    </div>
                    <div style={{ display: "flex", gap: "14px" }}>
                        <div className="field" style={{ flex: 1 }}>
                            <label>Check-In Date</label>
                            <input className="input" type="date" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} required />
                        </div>
                        <div className="field" style={{ flex: 1 }}>
                            <label>Check-Out Date</label>
                            <input className="input" type="date" value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} required />
                        </div>
                    </div>
                    <div className="field">
                        <label>Number of Guests</label>
                        <input className="input" type="number" min="1" value={numberOfGuests} onChange={(e) => setNumberOfGuests(e.target.value)} required />
                    </div>
                    <div className="field">
                        <label>Promo Code (optional)</label>
                        <input className="input" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} placeholder="e.g. WELCOME10" />
                    </div>
                    <button type="submit" disabled={loading} className="btn btn-block">
                        {loading ? "Booking..." : "Confirm Booking"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default BookRoom;