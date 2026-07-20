import { useEffect, useState } from "react";
import api from "../../services/api";

function Logs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await api.get("/logs");
                setLogs(response.data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load logs");
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    return (
        <div className="page">
            <h2 style={{ marginBottom: "20px" }}>Activity Logs</h2>
            {loading && <p>Loading...</p>}
            {error && <p className="msg-error">{error}</p>}

            {!loading && !error && (
                <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                    <table className="table">
                        <thead>
                            <tr><th>User</th><th>Action</th><th>Details</th><th>IP</th><th>Time</th></tr>
                        </thead>
                        <tbody>
                            {logs.length === 0 && (
                                <tr><td colSpan="5" style={{ textAlign: "center", color: "var(--color-text-muted)" }}>No activity yet.</td></tr>
                            )}
                            {logs.map((log) => (
                                <tr key={log._id}>
                                    <td>{log.user?.name || "Unknown"}</td>
                                    <td><span className="badge badge-confirmed">{log.action}</span></td>
                                    <td>{log.details}</td>
                                    <td>{log.ipAddress}</td>
                                    <td>{new Date(log.createdAt).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default Logs;