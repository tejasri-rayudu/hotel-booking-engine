import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import StarRating from "../../components/StarRating";
import useReveal from "../../hooks/useReveal";

const heroImages = [
    "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1600",
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1600",
    "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1600",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1600",
];

const galleryImages = [
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=500",
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=500",
    "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=500",
    "https://images.unsplash.com/photo-1544124499-58912cbddaad?w=500",
];

function Home() {
    const [rooms, setRooms] = useState([]);
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [guests, setGuests] = useState(2);
    const [slide, setSlide] = useState(0);
    const navigate = useNavigate();

    const amenitiesRef = useReveal();
    const galleryRef = useReveal();
    const featuredRef = useReveal();
    const testimonialRef = useReveal();

    useEffect(() => {
        api.get("/rooms").then((res) => setRooms(res.data.slice(0, 3))).catch(() => {});
    }, []);

    useEffect(() => {
        const timer = setInterval(() => setSlide((s) => (s + 1) % heroImages.length), 3000);
        return () => clearInterval(timer);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        navigate("/rooms", { state: { checkIn, checkOut, guests } });
    };

    const prevSlide = () => setSlide((s) => (s - 1 + heroImages.length) % heroImages.length);
    const nextSlide = () => setSlide((s) => (s + 1) % heroImages.length);

    return (
        <div>
            {/* Hero carousel */}
            <div style={{ position: "relative", overflow: "hidden", height: "500px" }}>
                {heroImages.map((img, i) => (
                    <div
                        key={img}
                        className={i === slide ? "hero-slide" : ""}
                        style={{
                            position: "absolute", inset: 0,
                            background: `linear-gradient(rgba(15,51,44,0.35), rgba(15,51,44,0.48)), url('${img}') center/cover`,
                            opacity: i === slide ? 1 : 0,
                            transition: "opacity 1.2s ease",
                        }}
                    />
                ))}

                <div className="fade-up" style={{ position: "relative", zIndex: 2, height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "white", textAlign: "center", padding: "0 24px" }}>
                    <p style={{ letterSpacing: "0.15em", textTransform: "uppercase", fontSize: "13px", color: "var(--color-accent)", fontWeight: 600, marginBottom: "14px" }}>
                        Est. 2026 &middot; Mumbai
                    </p>
                    <h1 style={{ color: "white", fontSize: "50px", marginBottom: "14px", textShadow: "0 2px 14px rgba(0,0,0,0.4)" }}>Rest, Refined.</h1>
                    <p style={{ fontSize: "18px", maxWidth: "560px", margin: "0 auto 30px", color: "rgba(255,255,255,0.95)", textShadow: "0 1px 6px rgba(0,0,0,0.35)" }}>
                        Discover handpicked suites, curated dining, and a stay designed around you.
                    </p>
                    <Link to="/rooms" className="btn" style={{ background: "var(--color-accent)", borderColor: "var(--color-accent)", padding: "13px 30px", fontSize: "15px" }}>
                        Browse Rooms & Suites
                    </Link>
                </div>

                <button onClick={prevSlide} aria-label="Previous slide" style={carouselArrowStyle("left")}>‹</button>
                <button onClick={nextSlide} aria-label="Next slide" style={carouselArrowStyle("right")}>›</button>

                <div style={{ position: "absolute", bottom: "18px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "8px", zIndex: 2 }}>
                    {heroImages.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setSlide(i)}
                            aria-label={`Go to slide ${i + 1}`}
                            style={{
                                width: "9px", height: "9px", borderRadius: "50%", border: "none", cursor: "pointer",
                                background: i === slide ? "var(--color-accent)" : "rgba(255,255,255,0.5)",
                                padding: 0, transition: "background 0.2s",
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Glass search bar */}
            <div style={{ padding: "0 24px", position: "relative" }}>
                <form onSubmit={handleSearch} className="search-glass fade-up fade-up-2" style={{ maxWidth: "900px", margin: "-40px auto 0", display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "flex-end", position: "relative", zIndex: 5 }}>
                    <div className="field" style={{ margin: 0, flex: 1, minWidth: "140px" }}>
                        <label>Check-In</label>
                        <input className="input" type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
                    </div>
                    <div className="field" style={{ margin: 0, flex: 1, minWidth: "140px" }}>
                        <label>Check-Out</label>
                        <input className="input" type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
                    </div>
                    <div className="field" style={{ margin: 0, flex: "0 0 100px" }}>
                        <label>Guests</label>
                        <input className="input" type="number" min="1" value={guests} onChange={(e) => setGuests(e.target.value)} />
                    </div>
                    <button type="submit" className="btn" style={{ padding: "10px 26px" }}>Check Availability</button>
                </form>
            </div>

            {/* Stats strip */}
            <div style={{ background: "var(--color-primary-dark)", padding: "30px 24px", marginTop: "50px" }}>
                <div style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "20px", color: "white", textAlign: "center" }}>
                    <StatItem value="4.8★" label="Guest Rating" />
                    <StatItem value="24/7" label="Front Desk" />
                    <StatItem value="30+" label="Suites & Rooms" />
                    <StatItem value="100%" label="Digital Receipts" />
                </div>
            </div>

            {/* Amenities */}
            <div ref={amenitiesRef} className="page reveal">
                <h2 style={{ textAlign: "center", marginBottom: "8px" }}>Everything You Need</h2>
                <p style={{ textAlign: "center", color: "var(--color-text-muted)", marginBottom: "30px" }}>Designed for comfort, booked in minutes.</p>
                <div className="card-grid">
                    <Feature icon="🛏️" title="Curated Suites" text="From standard rooms to presidential suites, each space is chosen for comfort and character." />
                    <Feature icon="🍽️" title="On-Site Dining" text="Continental breakfasts, spa treatments, and more — booked alongside your stay." />
                    <Feature icon="⚡" title="Effortless Booking" text="Real-time availability, instant confirmation, and digital receipts for every stay." />
                    <Feature icon="🌊" title="Ocean & City Views" text="Rooms with sea-view balconies, private pools, and skyline outlooks." />
                    <Feature icon="🧳" title="Flexible Stays" text="Cancel or modify with ease — your plans, your terms." />
                    <Feature icon="⭐" title="5-Star Service" text="Attentive staff and a dedicated reception team, around the clock." />
                </div>
            </div>

            {/* Photo gallery — always shows, fills the space regardless of API data */}
            <div ref={galleryRef} className="reveal" style={{ background: "var(--color-primary-dark)", padding: "50px 24px" }}>
                <div className="page" style={{ padding: 0 }}>
                    <h2 style={{ textAlign: "center", color: "white", marginBottom: "8px" }}>Life at the Resort</h2>
                    <p style={{ textAlign: "center", color: "rgba(255,255,255,0.75)", marginBottom: "28px" }}>A look inside our spaces.</p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
                        {galleryImages.map((img, i) => (
                            <img
                                key={i}
                                src={img}
                                alt={`Resort view ${i + 1}`}
                                style={{ width: "100%", height: "220px", objectFit: "cover", borderRadius: "10px", boxShadow: "0 8px 20px rgba(0,0,0,0.25)" }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Featured rooms — with fallback if none load */}
            <div ref={featuredRef} className="reveal" style={{ background: "var(--color-surface)", borderTop: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)", padding: "50px 24px" }}>
                <div className="page" style={{ padding: 0 }}>
                    <h2 style={{ textAlign: "center", marginBottom: "8px" }}>Featured Rooms</h2>
                    <p style={{ textAlign: "center", color: "var(--color-text-muted)", marginBottom: "30px" }}>A glimpse of what's available right now.</p>
                    {rooms.length > 0 ? (
                        <>
                            <div className="card-grid">
                                {rooms.map((room) => (
                                    <div key={room._id} className="card">
                                        {room.images?.[0] ? (
                                            <img className="room-image" src={`${import.meta.env.VITE_API_URL.replace("/api", "")}${room.images[0]}`} alt={room.roomNumber} />
                                        ) : (
                                            <div className="room-image" style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-muted)", fontSize: "13px" }}>No image</div>
                                        )}
                                        <h3 style={{ fontSize: "18px" }}>Room {room.roomNumber}</h3>
                                        <p style={{ color: "var(--color-accent)", fontWeight: 600, textTransform: "capitalize", fontSize: "13px" }}>{room.category}</p>
                                        <StarRating rating={room.rating} size={13} />
                                        <p style={{ fontWeight: 700, margin: "8px 0" }}>₹{room.pricePerNight} <span style={{ fontWeight: 400, fontSize: "13px", color: "var(--color-text-muted)" }}>/ night</span></p>
                                        <Link to="/rooms"><button className="btn btn-outline btn-block btn-sm">View Details</button></Link>
                                    </div>
                                ))}
                            </div>
                            <div style={{ textAlign: "center", marginTop: "24px" }}>
                                <Link to="/rooms" className="btn">See All Rooms</Link>
                            </div>
                        </>
                    ) : (
                        <div style={{ textAlign: "center" }}>
                            <p style={{ color: "var(--color-text-muted)", marginBottom: "16px" }}>Explore our full range of rooms and suites.</p>
                            <Link to="/rooms" className="btn">Browse All Rooms</Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Testimonial */}
            <div ref={testimonialRef} className="page reveal" style={{ textAlign: "center", maxWidth: "700px" }}>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontStyle: "italic", color: "var(--color-primary-dark)", lineHeight: 1.5 }}>
                    "The easiest booking experience we've had — from check-in to checkout, everything felt effortless."
                </p>
                <p style={{ marginTop: "14px", color: "var(--color-text-muted)", fontSize: "14px" }}>— A recent guest</p>
            </div>

            {/* Footer CTA */}
            <div style={{ background: "var(--color-primary)", color: "white", textAlign: "center", padding: "50px 24px" }}>
                <h2 style={{ color: "white", marginBottom: "10px" }}>Ready for your next stay?</h2>
                <p style={{ color: "rgba(255,255,255,0.85)", marginBottom: "24px" }}>Book in minutes. Cancel anytime.</p>
                <Link to="/rooms" className="btn" style={{ background: "var(--color-accent)", borderColor: "var(--color-accent)", padding: "12px 30px", fontSize: "15px" }}>
                    Browse Rooms & Suites
                </Link>
            </div>
        </div>
    );
}

function carouselArrowStyle(side) {
    return {
        position: "absolute", top: "50%", [side]: "18px", transform: "translateY(-50%)",
        background: "rgba(255,255,255,0.85)", border: "none", borderRadius: "50%",
        width: "42px", height: "42px", fontSize: "24px", cursor: "pointer",
        color: "var(--color-primary-dark)", zIndex: 2, lineHeight: 1,
    };
}

function StatItem({ value, label }) {
    return (
        <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "26px", fontWeight: 700, color: "var(--color-accent)" }}>{value}</div>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</div>
        </div>
    );
}

function Feature({ icon, title, text }) {
    return (
        <div className="card">
            <div style={{ fontSize: "26px", marginBottom: "8px" }}>{icon}</div>
            <h3 style={{ fontSize: "18px", marginBottom: "8px" }}>{title}</h3>
            <p style={{ color: "var(--color-text-muted)", fontSize: "14px" }}>{text}</p>
        </div>
    );
}

export default Home;