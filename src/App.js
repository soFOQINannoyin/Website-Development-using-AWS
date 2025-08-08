import React, { useEffect, useState } from "react";

const API_BASE = process.env.REACT_APP_API_BASE || "https://YOUR_API_BASE";

function App() {
  const [items, setItems] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/items`);
      const data = await res.json();
      setItems(data.items || []);
    } catch (err) {
      console.error("Fetch items error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const addItem = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (res.ok) {
        setText("");
        fetchItems();
      } else {
        console.error("Failed to add item", await res.text());
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: 640, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Serverless Items</h1>

      <form onSubmit={addItem} style={{ marginBottom: 20 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type new item"
          style={{ padding: 8, width: "70%", marginRight: 8 }}
        />
        <button type="submit" style={{ padding: "8px 12px" }}>Add</button>
      </form>

      <button onClick={fetchItems} disabled={loading} style={{ marginBottom: 16 }}>
        {loading ? "Loading..." : "Refresh"}
      </button>

      <ul>
        {items.length === 0 && <li>No items yet</li>}
        {items.map((it) => (
          <li key={it.id}>
            <strong>{it.text}</strong> <small>({new Date(it.createdAt).toLocaleString()})</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
