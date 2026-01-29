import { headers } from "next/headers";

async function getPaste(id) {
  const headersList = headers();
  const host = headersList.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  const res = await fetch(
    `${protocol}://${host}/api/pastes/${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return null;
  }

  return res.json();
}

  
  export default async function PastePage({ params }) {
    const paste = await getPaste(params.id);
  
    if (!paste) {
      return (
        <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
          <h2>❌ Paste not found or expired</h2>
        </div>
      );
    }
  
    return (
      <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
        <h2>📋 Your Paste</h2>
  
        <pre
          style={{
            background: "#f4f4f4",
            padding: "1rem",
            borderRadius: "6px",
            whiteSpace: "pre-wrap",
          }}
        >
          {paste.content}
        </pre>
  
        <p>
          <b>Remaining views:</b> {paste.remaining_views}
        </p>
  
        <p>
          <b>Expires at:</b>{" "}
          {paste.expires_at
            ? new Date(paste.expires_at).toLocaleString()
            : "Never"}
        </p>
      </div>
    );
  }
  
