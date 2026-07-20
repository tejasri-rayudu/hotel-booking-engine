import { useState } from "react";

function Settings() {
    const [taxRate, setTaxRate] = useState(12);
    const [hotelName, setHotelName] = useState("Hotel & Resort Booking Engine");
    const [message, setMessage] = useState("");

    const handleSave = (e) => {
        e.preventDefault();
        setMessage("Settings saved locally (not yet persisted to backend).");
    };

    return (
        <div className="page-narrow">
            <div className="card" style={{ padding: "32px" }}>
                <h2 style={{ marginBottom: "20px" }}>Global Settings</h2>
                {message && <p className="msg-info">{message}</p>}
                <form onSubmit={handleSave}>
                    <div className="field">
                        <label>Hotel Name</label>
                        <input className="input" value={hotelName} onChange={(e) => setHotelName(e.target.value)} />
                    </div>
                    <div className="field">
                        <label>Tax Rate (%)</label>
                        <input className="input" type="number" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-block">Save Settings</button>
                </form>
            </div>
        </div>
    );
}

export default Settings;