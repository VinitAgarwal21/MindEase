import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext.jsx";

const TherapistDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, getAuthToken } = useAuth();
  const [therapist, setTherapist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchTherapist();
  }, [id]);

  const fetchTherapist = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/therapists/${id}`);
      if (!response.ok) throw new Error("Therapist not found");
      const data = await response.json();
      setTherapist(data);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load therapist details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-mindease-300 border-t-mindease-600"></div>
          <p className="text-mindease-600 mt-2">Loading therapist details...</p>
        </div>
      </div>
    );
  }

  if (!therapist) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        <p>Therapist not found.</p>
      </div>
    );
  }

  const handleBooking = async (e) => {
    e.preventDefault();
    setBookingLoading(true);

    const form = e.target;
    const payload = {
      therapistId: therapist._id,
      therapistName: therapist.name,
      userName: form.name.value,
      userEmail: form.email.value,
      preferredDate: form.date.value,
      preferredTime: form.time.value,
      note: form.note?.value || "",
      sessionFee: therapist.hourlyRate || 0,
    };

    try {
      const token = await getAuthToken();
      const res = await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");
      toast.success("Booking submitted — you'll receive a confirmation soon.");
      form.reset();
      navigate("/therapist");
    } catch (err) {
      console.error(err);
      toast.error("Failed to book: " + err.message);
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start py-10">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-3xl">
        {/* Back Button */}
        <Link
          to="/therapist"
          className="inline-block mb-6 text-mindease-500 hover:text-mindease-700 font-medium"
        >
          ← Back to Therapists
        </Link>

        {/* Therapist Header */}
        <div className="flex flex-col md:flex-row gap-8 mb-8 items-center md:items-start">
          <img
            src={therapist.profilePicture || "https://randomuser.me/api/portraits/lego/1.jpg"}
            alt={therapist.name}
            className="w-40 h-40 rounded-2xl object-cover shadow-md"
          />
          <div className="flex flex-col justify-center space-y-1 text-center md:text-left">
            <h1 className="text-3xl font-semibold text-gray-800">{therapist.name}</h1>
            {therapist.headline && (
              <p className="text-mindease-600 text-lg font-medium">
                {therapist.headline}
              </p>
            )}
            {therapist.specialization?.length > 0 && (
              <p className="text-gray-600">
                Specialties: {therapist.specialization.join(", ")}
              </p>
            )}
            {therapist.experience && (
              <p className="text-gray-600">Experience: {therapist.experience} years</p>
            )}
            {therapist.hourlyRate && (
              <p className="text-gray-700 text-lg font-semibold mt-1">
                ${therapist.hourlyRate}/hour
              </p>
            )}
          </div>
        </div>

        {/* About Section */}
        {therapist.bio && (
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">About</h2>
            <p className="text-gray-700 leading-relaxed">{therapist.bio}</p>
          </div>
        )}

        {/* Booking Form */}
        <div className="bg-gray-100 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Book an Appointment
          </h2>
          <form className="space-y-5" onSubmit={handleBooking}>
            <div className="flex flex-col gap-1">
              <label htmlFor="name" className="text-base font-medium text-gray-700">
                Your Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                className="outline-none py-2.5 px-3 rounded border border-gray-400 focus:ring-2 focus:ring-mindease-400"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-base font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="outline-none py-2.5 px-3 rounded border border-gray-400 focus:ring-2 focus:ring-mindease-400"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="date" className="text-base font-medium text-gray-700">
                Preferred Date
              </label>
              <input
                id="date"
                type="date"
                className="outline-none py-2.5 px-3 rounded border border-gray-400 focus:ring-2 focus:ring-mindease-400"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="time" className="text-base font-medium text-gray-700">
                Select Time
              </label>
              <select
                id="time"
                className="outline-none py-2.5 px-3 rounded border border-gray-400 focus:ring-2 focus:ring-mindease-400"
                required
              >
                <option value="">Select time slot</option>
                <option value="10am">10:00 AM</option>
                <option value="12pm">12:00 PM</option>
                <option value="3pm">3:00 PM</option>
                <option value="5pm">5:00 PM</option>
              </select>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold text-gray-700">
                Session Fee: ${therapist.hourlyRate || 0}
              </p>
              <button
                disabled={bookingLoading}
                type="submit"
                className="px-8 py-2.5 bg-mindease-500 text-white font-medium rounded-lg hover:bg-mindease-600 transition disabled:opacity-50"
              >
                {bookingLoading ? "Booking..." : "Book Appointment"}
              </button>
            </div>
          </form>
        </div>

        {/* Footer Note */}
        <div className="text-center text-gray-500 text-sm mt-6">
          {/* <p>
            You’ll receive a confirmation email with your session details after booking.
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default TherapistDetail;
