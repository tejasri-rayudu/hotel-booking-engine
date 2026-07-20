import { useState } from "react";

function Branches() {
    const [branches, setBranches] = useState([
        { id: 1, name: "Main Branch", location: "Mumbai", rooms: 6, active: true },
    ]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: "", location: "" });

    const handleAdd = (e) => {
        e.preventDefault();
        setBranches([...branches, { id: Date.now(), name: formData.name, location: formData.location, rooms: 0, active: true }]);
        setFormData({ name: "", location: "" });
        setShowForm(false);
    };

    return (
        <div className="page">
            <div className="page-header">
                <h2>Resort Branches</h2>
                <button onClick={() => setShowForm(!showForm)} className="btn">{showForm ? "Cancel" : "+ Add Branch"}</button>
            </div>

            {showForm && (
                <form onSubmit={handleAdd} className="card" style={{ marginBottom: "20px" }}>
                    <div className="field">
                        <label>Branch Name</label>
                        <input className="input" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div className="field">
                        <label>Location</label>
                        <input className="input" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} required />
                    </div>
                    <button type="submit" className="btn">Add Branch</button>
                </form>
            )}

            <div className="card-grid">
                {branches.map((b) => (
                    <div key={b.id} className="card">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                            <h3 style={{ fontSize: "17px" }}>{b.name}</h3>
                            <span className="badge badge-confirmed">{b.active ? "Active" : "Inactive"}</span>
                        </div>
                        <p style={{ color: "var(--color-text-muted)", fontSize: "14px" }}>📍 {b.location}</p>
                        <p style={{ fontSize: "14px", marginTop: "6px" }}>{b.rooms} rooms</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Branches;