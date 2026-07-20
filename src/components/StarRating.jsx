function StarRating({ rating = 0, size = 16 }) {
    const stars = [1, 2, 3, 4, 5];
    return (
        <span style={{ display: "inline-flex", gap: "2px" }}>
            {stars.map((s) => (
                <span key={s} style={{ fontSize: size, color: s <= Math.round(rating) ? "#FFA500" : "var(--color-border)" }}>
                    ★
                </span>
            ))}
        </span>
    );
}

export default StarRating;