import React, { useState } from "react";

/**
 * EmotionPredictor (with local frontend-only history)
 * - expects your /predict endpoint to return { emotions: ["happy","sad", ...] }
 */
export default function EmotionPredictor() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [emotions, setEmotions] = useState(null);
  const [error, setError] = useState(null);

  // history: array of { text, emotions, time (ISO string) }
  const [history, setHistory] = useState([]);

  const colorMap = {
    angry: "bg-red-100 text-red-800",
    anxious: "bg-amber-100 text-amber-800",
    ashamed: "bg-stone-200 text-stone-800",
    awkward: "bg-gray-100 text-gray-700",
    bored: "bg-slate-100 text-slate-700",
    calm: "bg-mindease-100 text-mindease-700",
    confused: "bg-indigo-100 text-indigo-700",
    disgusted: "bg-lime-100 text-lime-700",
    excited: "bg-orange-100 text-orange-700",
    frustrated: "bg-rose-100 text-rose-700",
    happy: "bg-yellow-100 text-yellow-800",
    jealous: "bg-green-100 text-green-800",
    nostalgic: "bg-pink-100 text-pink-800",
    proud: "bg-purple-100 text-purple-800",
    sad: "bg-blue-100 text-blue-800",
    satisfied: "bg-emerald-100 text-emerald-800",
    surprised: "bg-cyan-100 text-cyan-800",
    default: "bg-gray-100 text-gray-800",
  };

  function formatDate(iso) {
    try {
      const d = new Date(iso);
      return d.toLocaleString();
    } catch {
      return iso;
    }
  }

  async function handlePredict() {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setEmotions(null);

    try {
      const resp = await fetch("http://localhost:8000/predict", {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }), // use textarea value
      });

      if (!resp.ok) {
        throw new Error("Prediction API error: " + resp.status);
      }

      const data = await resp.json();
      const detected = Array.isArray(data.emotions) ? data.emotions : [];
      setEmotions(detected);

      // add to frontend-only history (most recent first)
      const entry = {
        text,
        emotions: detected,
        time: new Date().toISOString(),
      };
      setHistory((prev) => [entry, ...prev]);

      // optionally: keep the input (or clear it). Current choice: keep it.
    } catch (err) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  // optional: clear history button
  const clearHistory = () => {
    setHistory([]);
  };

  // load a history item's text back into the textarea
  const loadHistoryItem = (item) => {
    setText(item.text);
    setEmotions(item.emotions);
    setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6 sm:p-10 transition-all">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-3 text-gray-900">
          Write down your thoughts...
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Type anything — we’ll gently read the emotion and show results below.
        </p>

        {/* text area with focus-within ring (mindease-400) */}
        <div className="focus-within:ring-mindease-400 transition-all rounded-xl ring-offset-2 ring-offset-white">
          <textarea
            rows={8}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste or type text here..."
            className="w-full resize-none p-4 text-gray-800 text-base rounded-xl border border-gray-200 focus:outline-none focus:shadow-none focus:ring-4 focus:ring-opacity-60 transition-all"
            style={{ minHeight: 160 }}
          />
        </div>

        <div className="flex items-center justify-between gap-4 mt-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePredict}
              disabled={loading || !text.trim()}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium text-white shadow-sm transition-all
                ${loading || !text.trim() ? "bg-gray-300 cursor-not-allowed" : "bg-mindease-500 hover:scale-[1.02]"}`}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>

            <button
              onClick={() => { setText(""); setEmotions(null); setError(null); }}
              className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-sm hover:bg-gray-200 transition"
            >
              Clear
            </button>

            <button
              onClick={clearHistory}
              className="px-3 py-1.5 rounded-full bg-red-50 text-mindease-700 text-sm hover:bg-mindease-100 transition"
            >
              Clear history
            </button>
          </div>

          <div className="text-sm text-gray-500">
            Tip: Press Submit after you finish typing.
          </div>
        </div>

        {error && <p className="mt-4 text-red-600 font-medium">{error}</p>}

        {emotions && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Detected emotions</h3>

            <div className="flex flex-wrap gap-3">
              {emotions.map((e) => {
                const key = e.toLowerCase();
                const classes = colorMap[key] || colorMap["default"];
                return (
                  <div
                    key={e}
                    className={`${classes} px-4 py-2 rounded-full shadow-sm text-sm font-medium inline-flex items-center gap-2`}
                    style={{ boxShadow: "0 6px 18px rgba(15, 23, 42, 0.06)" }}
                  >
                    <span className="inline-block w-2 h-2 rounded-full" style={{
                      background: "rgba(0,0,0,0.06)"
                    }} />
                    <span className="capitalize">{e}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ---------- History section (frontend only) ---------- */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-800">History</h3>
            <div className="text-sm text-gray-500">{history.length} entries</div>
          </div>

          {history.length === 0 ? (
            <p className="text-sm text-gray-500">No submissions yet — your recent inputs will appear here.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {history.map((item, idx) => (
                <div key={idx} className="border border-gray-100 rounded-2xl p-4 bg-white shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="text-xs text-gray-400 mb-1">{formatDate(item.time)}</div>

                      {/* snippet */}
                      <div className="text-sm text-gray-800 mb-3 line-clamp-3">
                        {item.text.length > 300 ? item.text.slice(0, 300) + "…" : item.text}
                      </div>

                      {/* full expanded textarea for reading (read-only) */}
                      <details className="mb-3">
                        <summary className="text-sm text-mindease-600 cursor-pointer">Show full text</summary>
                        <pre className="whitespace-pre-wrap text-sm text-gray-700 mt-2 p-3 rounded-lg border border-gray-100 bg-gray-50" style={{ maxHeight: 220, overflow: "auto" }}>
                          {item.text}
                        </pre>
                      </details>

                      {/* emotions chips */}
                      <div className="flex flex-wrap gap-2">
                        {(item.emotions && item.emotions.length > 0) ? item.emotions.map((e) => {
                          const key = e.toLowerCase();
                          const classes = colorMap[key] || colorMap["default"];
                          return (
                            <div
                              key={e}
                              className={`${classes} px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-2`}
                              style={{ boxShadow: "0 6px 18px rgba(15, 23, 42, 0.04)" }}
                            >
                              <span className="capitalize">{e}</span>
                            </div>
                          );
                        }) : (
                          <div className="text-sm text-gray-400">No emotions detected</div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => loadHistoryItem(item)}
                        className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-sm hover:bg-gray-200 transition"
                      >
                        Load
                      </button>
                      <div className="text-xs text-gray-400">{/* reserved for other actions */}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
