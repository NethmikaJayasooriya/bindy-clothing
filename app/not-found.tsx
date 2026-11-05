import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ maxWidth: 680, margin: "auto", padding: "15vh 24px", fontFamily: "Georgia, serif", color: "#27241f" }}>
      <Link href="/" style={{ color: "inherit", font: "700 32px Arial, sans-serif", textDecoration: "none" }}>
        bindy.
      </Link>
      <p style={{ marginTop: 64, font: "11px Arial, sans-serif", letterSpacing: 2, color: "#8e6e34" }}>
        A DIFFERENT DIRECTION
      </p>
      <h1 style={{ fontSize: "clamp(36px, 7vw, 60px)", fontWeight: 400, lineHeight: 1.1 }}>
        This piece isn't here.
      </h1>
      <p style={{ font: "15px/1.9 Arial, sans-serif", maxWidth: 440 }}>
        The page may have moved, or the garment may no longer be available. Explore the current collection to find your next favourite.
      </p>
      <Link
        href="/collection"
        style={{
          display: "inline-block",
          marginTop: 24,
          padding: "16px 24px",
          background: "#292720",
          color: "#fff",
          borderRadius: 30,
          font: "12px Arial, sans-serif",
          textDecoration: "none"
        }}
      >
        Explore the collection ↗
      </Link>
    </main>
  );
}

