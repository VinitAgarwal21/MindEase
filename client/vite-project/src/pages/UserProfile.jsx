import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";
import { API_BASE_URL } from "../config/env";

function UserProfile() {
  const { id } = useParams();
  const { getAuthToken } = useAuth();
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [journals, setJournals] = useState([]);
  const [journalsLoading, setJournalsLoading] = useState(true);
  const [journalError, setJournalError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains("dark"));

  const API_BASE = API_BASE_URL;

  // ---------------- New helper: convert numeric avg to label + color + emoji ---------------
function moodLabel(score) {
  // score expected ~0..10 (null handled)
  if (score === null || score === undefined) {
    return { label: "No data", emoji: "—", color: "text-gray-500", bg: "bg-gray-100" };
  }
  const s = Number(score);
  if (s >= 8.5) return { label: "Very Positive", emoji: "😁", color: "text-green-800", bg: "bg-green-50" };
  if (s >= 7) return { label: "Positive", emoji: "🙂", color: "text-emerald-800", bg: "bg-emerald-50" };
  if (s >= 5) return { label: "Neutral", emoji: "😐", color: "text-mindease-700", bg: "bg-mindease-100" };
  if (s >= 3) return { label: "Negative", emoji: "😕", color: "text-yellow-800", bg: "bg-yellow-50" };
  return { label: "Very Negative", emoji: "😞", color: "text-red-700", bg: "bg-red-50" };
}


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await getAuthToken();
        const res = await fetch(`${API_BASE_URL}/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
          setAppointments(data.appointments);
          // Journals are now returned by the server, scoped to this user
          setJournals(data.journals || []);
          setJournalsLoading(false);
        }
      } catch (err) {
        console.error(err);
        setJournalError("Failed to load profile data");
        setJournalsLoading(false);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id, getAuthToken]);

  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      setIsDarkMode(root.classList.contains("dark"));
    });

    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // Journals are now fetched along with the profile above — no separate fetch needed
  // (server returns only this user's journals)

  // ---------------- Mood scoring + aggregation helpers ----------------
  // map common emotions to a numeric mood score scale 0 (very negative) -> 10 (very positive)
  const emotionScoreMap = {
    angry: 1,
    anxious: 2,
    ashamed: 1.5,
    awkward: 3,
    bored: 3,
    calm: 8,
    confused: 4,
    disgusted: 1,
    excited: 9,
    frustrated: 2,
    happy: 9.5,
    jealous: 2,
    nostalgic: 7,
    proud: 8.5,
    sad: 2,
    satisfied: 8,
    surprised: 7,
    default: 5,
  };

  // compute score for a single journal entry (average of emotion scores)
  function scoreForEntry(entry) {
    const emotions = Array.isArray(entry.emotions) ? entry.emotions : [];
    if (emotions.length === 0) return emotionScoreMap.default || 5;
    const values = emotions.map((e) => {
      const k = String(e).toLowerCase();
      return emotionScoreMap[k] ?? emotionScoreMap.default ?? 5;
    });
    const sum = values.reduce((s, v) => s + v, 0);
    return sum / values.length;
  }

  // aggregate average score by date (YYYY-MM-DD) for last N days
  function aggregateByDay(entries, days = 30) {
    const msPerDay = 24 * 60 * 60 * 1000;
    const end = new Date();
    const start = new Date(end.getTime() - (days - 1) * msPerDay);

    // map dateStr -> { sum, count }
    const map = new Map();

    // initialize every day with empty bucket so chart shows continuous axis
    for (let d = 0; d < days; d++) {
      const cur = new Date(start.getTime() + d * msPerDay);
      const key = cur.toISOString().slice(0, 10); // YYYY-MM-DD
      map.set(key, { sum: 0, count: 0 });
    }

    for (const e of entries) {
      const created = e.createdAt || e.time || e.date || e._createdAt;
      let dateObj = null;
      if (created) dateObj = new Date(created);
      if (!created || isNaN(dateObj?.getTime())) {
        // try numeric shapes
        if (e.createdAt && e.createdAt.$date) {
          const inner = e.createdAt.$date;
          dateObj = new Date(typeof inner === "string" ? inner : (inner?.$numberLong ? Number(inner.$numberLong) : null));
        }
      }
      if (!dateObj || isNaN(dateObj.getTime())) continue;
      // ignore entries outside the range
      if (dateObj < start || dateObj > end) continue;

      const key = dateObj.toISOString().slice(0, 10);
      const score = scoreForEntry(e);
      const bucket = map.get(key) || { sum: 0, count: 0 };
      bucket.sum += score;
      bucket.count += 1;
      map.set(key, bucket);
    }

    // convert to array for charting: [{ date: "2025-12-01", avg: 6.2, count: 3}, ...]
    const arr = [];
    for (const [date, { sum, count }] of map.entries()) {
      const avg = count > 0 ? +(sum / count).toFixed(2) : null;

arr.push({
  date,
  avg,
  count,
  isPositive: avg !== null ? avg >= 5 : null,  // NEW: positivity flag
});

    }
    // sort by date ascending (map insertion order already ascending)
    return arr;
  }

  // derived metrics
  const dailyAggregates = aggregateByDay(journals, 7);
  const entriesCount = journals.length;
  const overallAvg =
    entriesCount > 0
      ? +(journals.reduce((s, j) => s + scoreForEntry(j), 0) / entriesCount).toFixed(2)
      : null;

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-mindease-50 to-accent-100/60">
        <div className="text-lg text-mindease-700 animate-pulse">Loading profile...</div>
      </div>
    );

  if (!user)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-mindease-50 to-accent-100/60">
        <div className="text-lg text-gray-500">User not found</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-mindease-50 via-mindease-100/50 to-accent-100/55 p-4 sm:p-6 md:p-10 transition-all">
      {/* User Info */}
      <div className="bg-white/75 backdrop-blur-md rounded-3xl shadow-xl p-5 sm:p-8 mb-6 border border-mindease-100">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-mindease-400 to-mindease-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-semibold text-mindease-800 mb-1">{user?.name || "Unknown"}</h1>
            <p className="text-gray-700">{user?.email || "—"}</p>
            <p className="text-gray-600 mt-1 capitalize">Gender: {user?.gender || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Journal Dashboard */}
      <div className="bg-white/75 backdrop-blur-md rounded-3xl shadow-xl p-5 sm:p-6 mb-8 border border-mindease-100">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-mindease-800">Journal Mood Dashboard</h2>
            <p className="text-sm text-gray-500">Average mood over the last 7 days (higher is more positive)</p>
          </div>
                    {/* --------- Stats panel (REPLACE THIS BLOCK) --------- */}
          <div className="text-right flex flex-col items-end gap-2">
            <div className="text-sm text-gray-500">Entries</div>
            <div className="text-2xl font-bold text-mindease-700">{entriesCount}</div>

            {/* overall average number */}
            <div className="mt-1 text-sm text-gray-500">Overall average</div>
            <div className="flex items-center gap-3">
              {/* big numeric pill */}
              <div className="px-3 py-1 rounded-xl bg-white shadow-sm border border-mindease-100 text-mindease-800 font-semibold text-lg">
                {overallAvg !== null ? overallAvg : "—"}
              </div>

              {/* label badge with emoji and color from moodLabel */}
              {(() => {
                const meta = moodLabel(overallAvg);
                return (
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-2xl ${meta.bg} ${meta.color} font-medium shadow-sm`}>
                    {/* <div className="text-lg">{meta.emoji}</div> */}
                    <div className="text-sm">{meta.label}</div>
                  </div>
                );
              })()}
            </div>
          </div>
          {/* --------- end replace --------- */}

        </div>

        <div style={{ width: "100%", height: 280 }}>
          {journalsLoading ? (
            <div className="flex items-center justify-center h-full">Loading journals...</div>
          ) : journalError ? (
            <div className="text-red-600">Error: {journalError}</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyAggregates}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <ReferenceLine y={5} stroke="#6c909b" strokeDasharray="3 3" label={{ value: "Neutral", position: "right" }} />
                {/* NEW: show a visible dot at every data point and highlight on hover */}
                {/* Vertical axis-to-point lines */}
{dailyAggregates.map((d, idx) => (
  d.avg !== null && (
    <ReferenceLine
      key={idx}
      x={d.date}
      stroke={d.isPositive ? "green" : "red"}
      strokeWidth={2}
      segment={[
        { x: d.date, y: 0 },       // start at x-axis
        { x: d.date, y: d.avg }    // end at point
      ]}
    />
  )
))}

<Line
  type="monotone"
  dataKey="avg"
  stroke="#4d8a98"
  strokeWidth={2}
  dot={(props) => {
    const { cx, cy, payload } = props;
    const color = payload.isPositive ? (isDarkMode ? "#8fe0b6" : "green") : (isDarkMode ? "#f4b3bf" : "red");
    return (
      <circle
        cx={cx}
        cy={cy}
        r={5}
        stroke={isDarkMode ? "#0f1d25" : "white"}
        strokeWidth={2}
        fill={color}
      />
    );
  }}
  activeDot={{ r: 7 }}
/>


              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Tip: scores are computed by mapping each detected emotion to a numeric score (0–10) and averaging per journal entry.
        </div>
      </div>

      {/* Appointments */}
      <div className="bg-white/75 backdrop-blur-md rounded-3xl shadow-xl p-5 sm:p-8 border border-mindease-100">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-mindease-800 flex items-center gap-2">🌿 My Appointments</h2>

        {appointments.length === 0 ? (
          <p className="text-gray-500 italic text-center py-6">No appointments yet. Take a deep breath and schedule one soon 🌸</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-mindease-100 rounded-lg overflow-hidden shadow-sm">
              <thead className="bg-mindease-100/70 text-mindease-800">
                <tr>
                  <th className="py-3 px-4 text-left font-medium">Therapist</th>
                  <th className="py-3 px-4 text-left font-medium">For</th>
                  <th className="py-3 px-4 text-left font-medium">Date</th>
                  <th className="py-3 px-4 text-left font-medium">Time</th>
                  <th className="py-3 px-4 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mindease-50">
                {appointments.map((a) => (
                  <tr key={a._id} className="hover:bg-mindease-50 transition-colors duration-200">
                    <td className="py-3 px-4 text-gray-700">{a.therapistName}</td>
                    <td className="py-3 px-4 text-gray-700">{a.userName}</td>
                    <td className="py-3 px-4 text-gray-700">{a.preferredDate}</td>
                    <td className="py-3 px-4 text-gray-700">{a.preferredTime}</td>
                    <td className={`py-3 px-4 font-medium capitalize ${
                        a.status === "pending" ? "text-yellow-600" :
                        a.status === "completed" ? "text-green-600" :
                        a.status === "cancelled" ? "text-red-600" : "text-gray-700"
                      }`}>
                      {a.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
