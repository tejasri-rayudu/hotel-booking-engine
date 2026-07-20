import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import StarRating from "../../components/StarRating";

function Inventory() {
    const { logout } = useAuth();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [uploadingId, setUploadingId] = useState(null);

    const [formData, setFormData] = useState({
        roomNumber: "", category: "standard", pricePerNight: "", capacity: "", features: "", rating: "5",
    });

    const fetchRooms = async () => {
        setLoading(true);
        try {
            const response = await api.get("/rooms");
            setRooms(response.data);
        } catch (err) {
            setError("Failed to load rooms");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchRooms(); }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleCreateRoom = async (e) => {
        e.preventDefault();
        setMessage("");
        try {
            await api.post("/rooms", {
                ...formData,
                pricePerNight: Number(formData.pricePerNight),
                capacity: Number(formData.capacity),
                rating: Number(formData.rating),
                features: formData.features.split(",").map((f) => f.trim()).filter(Boolean),
            });
            setMessage("Room created successfully!");
            setFormData({ roomNumber: "", category: "standard", pricePerNight: "", capacity: "", features: "", rating: "5" });
            setShowForm(false);
            fetchRooms();
        } catch (err) {
            setMessage(err.response?.data?.message || "Failed to create room");
        }
    };

    const handleDelete = async (roomId) => {
        if (!window.confirm("Delete this room?")) return;
        try {
            await api.delete(`/rooms/${roomId}`);
            setMessage("Room deleted");
            fetchRooms();
        } catch (err) {
            setMessage("Failed to delete room");
        }
    };

    const handleImageUpload = async (roomId, files) => {
        if (!files || files.length === 0) return;
        setUploadingId(roomId);
        setMessage("");
        const form = new FormData();
        Array.from(files).forEach((file) => form.append("images", file));
        try {
            await api.post(`/rooms/${roomId}/images`, form, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setMessage("Image uploaded successfully!");
            fetchRooms();
        } catch (err) {
            setMessage(err.response?.data?.message || "Upload failed");
        } finally {
            setUploadingId(null);
        }
    };

    return (
        <div className="page">
            <div className="page-header">
                <h2>Room Inventory</h2>
                <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={() => setShowForm(!showForm)} className="btn">
                        {showForm ? "Cancel" : "+ Add Room"}
                    </button>
                    <button onClick={logout} className="btn btn-outline">Logout</button>
                </div>
            </div>

            {message && <p className="msg-info">{message}</p>}

            {showForm && (
                <form onSubmit={handleCreateRoom} className="card" style={{ marginBottom: "24px" }}>
                    <h3 style={{ marginBottom: "14px" }}>New Room</h3>
                    <div className="field">
                        <label>Room Number</label>
                        <input className="input" name="roomNumber" value={formData.roomNumber} onChange={handleChange} required />
                    </div>
                    <div className="field">
                        <label>Category</label>
                        <select className="input" name="category" value={formData.category} onChange={handleChange}>
                            <option value="standard">Standard</option>
                            <option value="deluxe">Deluxe</option>
                            <option value="suite">Suite</option>
                            <option value="presidential">Presidential</option>
                        </select>
                    </div>
                    <div className="field">
                        <label>Price Per Night</label>
                        <input className="input" type="number" name="pricePerNight" value={formData.pricePerNight} onChange={handleChange} required />
                    </div>
                    <div className="field">
                        <label>Capacity</label>
                        <input className="input" type="number" name="capacity" value={formData.capacity} onChange={handleChange} required />
                    </div>
                    <div className="field">
                        <label>Features (comma-separated)</label>
                        <input className="input" name="features" value={formData.features} onChange={handleChange} placeholder="wifi, sea-view, balcony" />
                    </div>
                    <div className="field">
                        <label>Rating (0-5)</label>
                        <input className="input" type="number" name="rating" min="0" max="5" step="0.5" value={formData.rating} onChange={handleChange} />
                    </div>
                    <button type="submit" className="btn">Create Room</button>
                </form>
            )}

            {loading && <p>Loading rooms...</p>}
            {error && <p className="msg-error">{error}</p>}

            {!loading && (
                <div className="card-grid">
                    {rooms.map((room) => (
                        <div key={room._id} className="card">
                            {room.images?.[0] ? (
                                <img
                                    className="room-image"
                                    src={`${import.meta.env.VITE_API_URL.replace("/api", "")}${room.images[0]}`}
                                    alt={room.roomNumber}
                                />
                            ) : (
                                <div className="room-image" style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-muted)", fontSize: "13px" }}>
                                    No image
                                </div>
                            )}
                            <h3 style={{ fontSize: "18px" }}>Room {room.roomNumber}</h3>
                            <p style={{ color: "var(--color-accent)", fontWeight: 600, textTransform: "capitalize", fontSize: "14px" }}>{room.category}</p>
                            <StarRating rating={room.rating} />
                            <p style={{ fontSize: "14px", margin: "6px 0" }}>₹{room.pricePerNight} / night &middot; {room.capacity} guests</p>

                            <label className="btn btn-outline btn-sm" style={{ display: "inline-block", cursor: "pointer", marginTop: "8px" }}>
                                {uploadingId === room._id ? "Uploading..." : "Upload Photo"}
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    style={{ display: "none" }}
                                    onChange={(e) => handleImageUpload(room._id, e.target.files)}
                                />
                            </label>
                            <button onClick={() => handleDelete(room._id)} className="btn btn-danger btn-sm" style={{ marginTop: "8px", marginLeft: "8px" }}>
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Inventory;