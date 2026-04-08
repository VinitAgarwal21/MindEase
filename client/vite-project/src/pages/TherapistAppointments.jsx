import { useState, useEffect } from "react";
import { Calendar, Mail, User, Clock, FileText, CheckCircle, AlertCircle, CircleCheck, CircleX, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/env";

const TherapistAppointments = () => {
  const { user, getAuthToken } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, [filter]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const query = filter !== "all" ? `?status=${filter}` : "";
      const token = await getAuthToken();

      const response = await fetch(
        `${API_BASE_URL}/api/appointments/my-appointments${query}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch appointments");
      }
      const data = await response.json();
      setAppointments(data.appointments || []);
    } catch (err) {
      toast.error(err.message || "Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    setUpdating(appointmentId);
    try {
      const token = await getAuthToken();

      const response = await fetch(
        `${API_BASE_URL}/api/appointments/${appointmentId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) throw new Error("Failed to update appointment");
      const data = await response.json();
      if (newStatus === "confirmed") {
        if (data?.emailNotification?.sent) {
          toast.success("Appointment confirmed and email sent to user", {
            icon: <CircleCheck size={16} />,
          });
        } else {
          toast.warning("Appointment confirmed. Email could not be sent.", {
            icon: <AlertCircle size={16} />,
          });
        }
      } else {
        toast.success(`Appointment ${newStatus}`, {
          icon: <CircleCheck size={16} />,
        });
      }
      fetchAppointments();
    } catch (err) {
      toast.error(err.message || "Failed to update appointment", {
        icon: <CircleX size={16} />,
      });
    } finally {
      setUpdating(null);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-green-100 text-green-800",
      completed: "bg-blue-100 text-blue-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return styles[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border rounded-2xl shadow-sm p-5 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-mindease-900 mb-2">Client Appointments</h1>
        <p className="text-mindease-600">
          Manage appointments with your clients and track their booking status.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {["all", "pending", "confirmed", "completed", "cancelled"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition capitalize ${
              filter === status
                ? "bg-mindease-600 text-white"
                : "bg-white border text-mindease-700 hover:bg-mindease-50"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-mindease-300 border-t-mindease-600"></div>
            <p className="text-mindease-600 mt-2">Loading appointments...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="bg-white border rounded-2xl p-6 sm:p-12 text-center">
            <Calendar className="h-12 w-12 text-mindease-300 mx-auto mb-3" />
            <p className="text-mindease-600">No appointments found.</p>
          </div>
        ) : (
          appointments.map((appt) => (
            <div key={appt._id} className="bg-white border rounded-2xl shadow-sm p-4 sm:p-6 hover:shadow-md transition">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                {/* Client Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-mindease-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-mindease-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-mindease-900">{appt.userName}</h3>
                      <p className="text-sm text-mindease-600">{appt.userEmail}</p>
                    </div>
                  </div>

                  <div className="space-y-2 ml-13 text-sm">
                    <div className="flex items-center gap-2 text-mindease-700">
                      <Calendar className="h-4 w-4 text-mindease-500" />
                      <span>{new Date(appt.preferredDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-mindease-700">
                      <Clock className="h-4 w-4 text-mindease-500" />
                      <span>{appt.preferredTime}</span>
                    </div>
                    {appt.sessionFee && (
                      <div className="flex items-center gap-2 text-mindease-700">
                        <span className="text-mindease-500">₹</span>
                        <span>₹{appt.sessionFee}</span>
                      </div>
                    )}
                    {appt.paymentStatus && (
                      <div className="flex items-center gap-2 text-mindease-700">
                        <span className="text-mindease-500">Payment:</span>
                        <span className="capitalize">{appt.paymentStatus}</span>
                      </div>
                    )}
                  </div>

                  {appt.note && (
                    <div className="mt-3 p-3 bg-mindease-50 rounded-lg border border-mindease-200">
                      <div className="flex gap-2">
                        <FileText className="h-4 w-4 text-mindease-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-mindease-700">{appt.note}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Status and Actions */}
                <div className="flex flex-col gap-3 md:items-end">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusBadge(appt.status)}`}>
                    {getStatusIcon(appt.status)}
                    {appt.status}
                  </div>

                  {appt.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusChange(appt._id, "confirmed")}
                        disabled={updating === appt._id}
                        className="px-3 py-1 bg-mindease-600 text-white rounded-lg text-sm hover:bg-mindease-700 disabled:opacity-50"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => handleStatusChange(appt._id, "cancelled")}
                        disabled={updating === appt._id}
                        className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:opacity-50"
                      >
                        Decline
                      </button>
                    </div>
                  )}

                  {appt.status === "confirmed" && (
                    <button
                      onClick={() => handleStatusChange(appt._id, "completed")}
                      disabled={updating === appt._id}
                      className="px-3 py-1 bg-mindease-500 text-white rounded-lg text-sm hover:bg-mindease-600 disabled:opacity-50"
                    >
                      Mark Complete
                    </button>
                  )}

                  {/* Chat Button */}
                  <button
                    onClick={() => navigate(`/chat/${appt.userId?._id || appt.userId}`)}
                    className="flex items-center gap-2 px-3 py-1 bg-white border border-mindease-200 text-mindease-700 rounded-lg text-sm hover:bg-mindease-50 transition"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Chat with Client
                  </button>

                  <p className="text-xs text-mindease-500 mt-2">
                    {new Date(appt.createdAt).toLocaleDateString()} at{" "}
                    {new Date(appt.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TherapistAppointments;
