import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import StarRating from "../../components/StarRating";

function Rooms() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [category, setCategory] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [capacity, setCapacity] = useState("");

    const fetchRooms = async () => {
        setLoading(true);
        setError("");
        try {
            const params = {};
            if (category) params.category = category;
            if (minPrice) params.minPrice = minPrice;
            if (maxPrice) params.maxPrice = maxPrice;
            if (capacity) params.capacity = capacity;
            const response = await api.get("/rooms", { params });
            setRooms(response.data);
        } catch (err) {
            setError("Failed to load rooms");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchRooms(); }, []);

    const categoryColors = {
        standard: "#6B7280",
        deluxe: "#C9A44C",
        suite: "#8B6F47",
        presidential: "#B3432B",
    };

    return (
        <div>
            <div style={{
                background: "linear-gradient(rgba(15,51,44,0.35), rgba(15,51,44,0.48)), url('https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1600') center/cover",
                color: "white", padding: "70px 24px", textAlign: "center",
            }}>
                <p style={{ letterSpacing: "0.15em", textTransform: "uppercase", fontSize: "13px", color: "var(--color-accent)", fontWeight: 600, marginBottom: "10px" }}>
                    Explore
                </p>
                <h1 style={{ color: "white", fontSize: "36px" }}>Rooms & Suites</h1>
                <p style={{ color: "rgba(255,255,255,0.9)", marginTop: "8px" }}>Find the space that fits your stay.</p>
            </div>

            <div className="page">
                <form
                    onSubmit={(e) => { e.preventDefault(); fetchRooms(); }}
                    className="search-glass"
                    style={{ display: "flex", gap: "14px", marginBottom: "34px", flexWrap: "wrap", alignItems: "flex-end", margin: "-46px auto 34px", position: "relative", zIndex: 5, maxWidth: "900px", boxShadow: "0 12px 28px rgba(15,51,44,0.15)" }}
                >
                    <div className="field" style={{ margin: 0 }}>
                        <label>Category</label>
                        <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option value="">All</option>
                            <option value="standard">Standard</option>
                            <option value="deluxe">Deluxe</option>
                            <option value="suite">Suite</option>
                            <option value="presidential">Presidential</option>
                        </select>
                    </div>
                    <div className="field" style={{ margin: 0 }}>
                        <label>Min Price</label>
                        <input className="input" type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} style={{ width: "100px" }} />
                    </div>
                    <div className="field" style={{ margin: 0 }}>
                        <label>Max Price</label>
                        <input className="input" type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} style={{ width: "100px" }} />
                    </div>
                    <div className="field" style={{ margin: 0 }}>
                        <label>Guests</label>
                        <input className="input" type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} style={{ width: "80px" }} />
                    </div>
                    <button type="submit" className="btn">Search</button>
                </form>

                {loading && <p style={{ textAlign: "center" }}>Loading rooms...</p>}
                {error && <p className="msg-error">{error}</p>}

                {!loading && !error && (
                    <div className="card-grid">
                        {rooms.length === 0 && <p style={{ textAlign: "center", gridColumn: "1/-1" }}>No rooms match your search.</p>}
                        {rooms.map((room) => (
                            <div key={room._id} className="card" style={{ padding: 0, overflow: "hidden" }}>
                                <div style={{ position: "relative" }}>
                                    {room.images?.[0] ? (
                                        <img
                                            src={`${import.meta.env.VITE_API_URL.replace("/api", "")}${room.images[0]}`}
                                            alt={room.roomNumber}
                                            style={{ width: "100%", height: "190px", objectFit: "cover" }}
                                        />
                                    ) : (
                                        <div style={{ width: "100%", height: "190px", background: "var(--color-border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-muted)", fontSize: "13px" }}>
                                            No image
                                        </div>
                                    )}
                                    <span style={{
                                        position: "absolute", top: "12px", left: "12px",
                                        background: categoryColors[room.category] || "var(--color-accent)",
                                        color: "white", fontSize: "11px", fontWeight: 700, textTransform: "uppercase",
                                        letterSpacing: "0.04em", padding: "4px 10px", borderRadius: "999px",
                                    }}>
                                        {room.category}
                                    </span>
                                    <span style={{
                                        position: "absolute", top: "12px", right: "12px",
                                        background: "rgba(255,255,255,0.95)", color: "var(--color-primary-dark)",
                                        fontSize: "13px", fontWeight: 700, padding: "5px 10px", borderRadius: "999px",
                                    }}>
                                        ₹{room.pricePerNight}/night
                                    </span>
                                </div>

                                <div style={{ padding: "16px" }}>
                                    <h3 style={{ fontSize: "19px", marginBottom: "4px" }}>Room {room.roomNumber}</h3>
                                    <StarRating rating={room.rating} size={14} />
                                    <p style={{ fontSize: "13px", color: "var(--color-text-muted)", margin: "10px 0" }}>
                                        👥 Up to {room.capacity} guests
                                    </p>
                                    {room.features?.length > 0 && (
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "14px" }}>
                                            {room.features.map((f, i) => (
                                                <span key={i} style={{ fontSize: "11px", background: "var(--color-bg)", border: "1px solid var(--color-border)", padding: "3px 9px", borderRadius: "999px", color: "var(--color-text-muted)", textTransform: "capitalize" }}>
                                                    {f}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <Link to="/guest/book-room" state={{ roomId: room._id }}>
                                        <button className="btn btn-block">Book This Room</button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Rooms;