import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function UserProfile() {
  const { id } = useParams(); // assuming route /user/:id
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/users/${id}`);
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
          setAppointments(data.appointments);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="text-lg text-indigo-700 animate-pulse">Loading profile...</div>
      </div>
    );

  if (!user)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="text-lg text-gray-500">User not found</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-emerald-50 p-8 md:p-16 transition-all">
      {/* User Info */}
      <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl p-8 mb-10 border border-indigo-100">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-300 to-sky-300 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-4xl font-semibold text-indigo-800 mb-1">
              {user.name}
            </h1>
            <p className="text-gray-700">{user.email}</p>
            <p className="text-gray-600 mt-1 capitalize">
              Gender: {user.gender || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Appointments */}
      <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-indigo-100">
        <h2 className="text-3xl font-semibold mb-6 text-indigo-800 flex items-center gap-2">
          🌿 My Appointments
        </h2>

        {appointments.length === 0 ? (
          <p className="text-gray-500 italic text-center py-6">
            No appointments yet. Take a deep breath and schedule one soon 🌸
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-indigo-100 rounded-lg overflow-hidden shadow-sm">
              <thead className="bg-indigo-200/40 text-indigo-800">
                <tr>
                  <th className="py-3 px-4 text-left font-medium">Therapist</th>
                  <th className="py-3 px-4 text-left font-medium">For</th>
                  <th className="py-3 px-4 text-left font-medium">Date</th>
                  <th className="py-3 px-4 text-left font-medium">Time</th>
                  <th className="py-3 px-4 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-50">
                {appointments.map((a) => (
                  <tr
                    key={a._id}
                    className="hover:bg-indigo-50 transition-colors duration-200"
                  >
                    <td className="py-3 px-4 text-gray-700">{a.therapistName}</td>
                    <td className="py-3 px-4 text-gray-700">{a.userName}</td>
                    <td className="py-3 px-4 text-gray-700">{a.preferredDate}</td>
                    <td className="py-3 px-4 text-gray-700">{a.preferredTime}</td>
                    <td
                      className={`py-3 px-4 font-medium capitalize ${
                        a.status === "pending"
                          ? "text-yellow-600"
                          : a.status === "confirmed"
                          ? "text-green-600"
                          : a.status === "cancelled"
                          ? "text-red-600"
                          : "text-gray-700"
                      }`}
                    >
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
