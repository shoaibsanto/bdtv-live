import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container" style={{ textAlign: "center", padding: "80px 16px" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: 8 }}>404</h1>
      <p style={{ color: "var(--muted)", marginBottom: 24 }}>
        চ্যানেলটি খুঁজে পাওয়া যায়নি। (This channel could not be found.)
      </p>
      <Link href="/" className="btn" style={{ display: "inline-block" }}>
        হোমে ফিরে যান / Back to Home
      </Link>
    </div>
  );
}
