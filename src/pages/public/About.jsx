function About() {
    return (
        <div>
            <div style={{
                background: "linear-gradient(rgba(15,51,44,0.35), rgba(15,51,44,0.48)), url('https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1600') center/cover",
                color: "white", padding: "70px 24px", textAlign: "center",
            }}>
                <p style={{ letterSpacing: "0.15em", textTransform: "uppercase", fontSize: "13px", color: "var(--color-accent)", fontWeight: 600, marginBottom: "10px" }}>Our Story</p>
                <h1 style={{ color: "white", fontSize: "36px" }}>About Us</h1>
            </div>

            <div className="page" style={{ maxWidth: "780px" }}>
                <div className="card" style={{ marginBottom: "24px" }}>
                    <p style={{ color: "var(--color-text-muted)", lineHeight: 1.8 }}>
                        Hotel & Resort Booking Engine brings together curated rooms, on-site dining,
                        and a seamless reservation experience — all in one place. From standard rooms
                        to presidential suites, every stay is designed around comfort and ease.
                    </p>
                </div>

                <div className="card-grid" style={{ marginBottom: "24px" }}>
                    <div className="card">
                        <div style={{ fontSize: "24px", marginBottom: "8px" }}>🏨</div>
                        <h3 style={{ fontSize: "17px", marginBottom: "6px" }}>Our Mission</h3>
                        <p style={{ color: "var(--color-text-muted)", fontSize: "14px" }}>To make every stay feel effortless, from booking to checkout.</p>
                    </div>
                    <div className="card">
                        <div style={{ fontSize: "24px", marginBottom: "8px" }}>🤝</div>
                        <h3 style={{ fontSize: "17px", marginBottom: "6px" }}>Our Promise</h3>
                        <p style={{ color: "var(--color-text-muted)", fontSize: "14px" }}>Transparent pricing, real-time availability, no surprises.</p>
                    </div>
                </div>

                <h3 style={{ marginBottom: "12px" }}>Our Location</h3>
                <div className="card">
                    <p style={{ color: "var(--color-text-muted)" }}>
                        Main Branch — Mumbai, India<br />
                        Open for reservations year-round.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default About;