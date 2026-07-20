import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

// Public pages
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Rooms from "./pages/public/Rooms";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";

// Guest pages
import GuestDashboard from "./pages/guest/Dashboard";
import BookRoom from "./pages/guest/BookRoom";
import Dining from "./pages/guest/Dining";
import MyBookings from "./pages/guest/MyBookings";
import Profile from "./pages/guest/Profile";

// Manager pages
import ManagerDashboard from "./pages/manager/Dashboard";
import Inventory from "./pages/manager/Inventory";
import Reception from "./pages/manager/Reception";
import Reports from "./pages/manager/Reports";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import Branches from "./pages/admin/Branches";
import Logs from "./pages/admin/Logs";
import Settings from "./pages/admin/Settings";

import "./App.css";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/rooms" element={<Rooms />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Guest routes (protected) */}
                    <Route
                        path="/guest/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={["guest"]}>
                                <GuestDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/guest/book-room"
                        element={
                            <ProtectedRoute allowedRoles={["guest"]}>
                                <BookRoom />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/guest/dining"
                        element={
                            <ProtectedRoute allowedRoles={["guest"]}>
                                <Dining />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/guest/my-bookings"
                        element={
                            <ProtectedRoute allowedRoles={["guest"]}>
                                <MyBookings />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/guest/profile"
                        element={
                            <ProtectedRoute allowedRoles={["guest"]}>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />

                    {/* Manager routes (protected) */}
                    <Route
                        path="/manager/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={["manager", "admin"]}>
                                <ManagerDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/manager/inventory"
                        element={
                            <ProtectedRoute allowedRoles={["manager", "admin"]}>
                                <Inventory />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/manager/reception"
                        element={
                            <ProtectedRoute allowedRoles={["manager", "admin"]}>
                                <Reception />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/manager/reports"
                        element={
                            <ProtectedRoute allowedRoles={["manager", "admin"]}>
                                <Reports />
                            </ProtectedRoute>
                        }
                    />

                    {/* Admin routes (protected) */}
                    <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={["admin"]}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/branches"
                        element={
                            <ProtectedRoute allowedRoles={["admin"]}>
                                <Branches />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/logs"
                        element={
                            <ProtectedRoute allowedRoles={["admin"]}>
                                <Logs />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/settings"
                        element={
                            <ProtectedRoute allowedRoles={["admin"]}>
                                <Settings />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;