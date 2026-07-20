import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar-sticky" style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "16px 30px", background: "var(--color-primary)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)", flexWrap: "wrap", gap: "10px",
        }}>
            <Link to="/" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "20px", color: "white", textDecoration: "none" }}>
                Hotel & Resort
            </Link>

            <div style={{ display: "flex", alignItems: "center", gap: "18px", flexWrap: "wrap" }}>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/rooms">Rooms</NavLink>
                <NavLink to="/about">About</NavLink>

                {!user && (
                    <>
                        <NavLink to="/login">Login</NavLink>
                        <Link to="/register" className="btn btn-sm" style={{ background: "var(--color-accent)", borderColor: "var(--color-accent)" }}>
                            Register
                        </Link>
                    </>
                )}

                {user?.role === "guest" && (
                    <>
                        <NavLink to="/guest/dashboard">Dashboard</NavLink>
                        <NavLink to="/guest/book-room">Book Room</NavLink>
                        <NavLink to="/guest/dining">Dining</NavLink>
                        <NavLink to="/guest/my-bookings">My Bookings</NavLink>
                        <NavLink to="/guest/profile">Profile</NavLink>
                    </>
                )}

                {user?.role === "manager" && (
                    <>
                        <NavLink to="/manager/dashboard">Dashboard</NavLink>
                        <NavLink to="/manager/inventory">Inventory</NavLink>
                        <NavLink to="/manager/reception">Reception</NavLink>
                        <NavLink to="/manager/reports">Reports</NavLink>
                    </>
                )}

                {user?.role === "admin" && (
                    <>
                        <NavLink to="/admin/dashboard">Dashboard</NavLink>
                        <NavLink to="/admin/branches">Branches</NavLink>
                        <NavLink to="/admin/logs">Logs</NavLink>
                        <NavLink to="/admin/settings">Settings</NavLink>
                    </>
                )}

                {user && (
                    <button onClick={handleLogout} className="btn btn-outline btn-sm" style={{ borderColor: "white", color: "white" }}>
                        Logout
                    </button>
                )}
            </div>
        </nav>
    );
}

function NavLink({ to, children }) {
    return (
        <Link to={to} style={{ color: "rgba(255,255,255,0.9)", textDecoration: "none", fontSize: "14px", fontWeight: 500 }}>
            {children}
        </Link>
    );
}

export default Navbar;