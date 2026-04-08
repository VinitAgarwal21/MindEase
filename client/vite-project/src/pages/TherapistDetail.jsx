import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext.jsx";
import { CircleCheck, CircleX, AlertCircle } from "lucide-react";
import { API_BASE_URL } from "../config/env";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const parseApiResponse = async (res) => {
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json();
  }
  const text = await res.text();
  return { error: text || "Unexpected server response" };
};

const TherapistDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, getAuthToken } = useAuth();
  const [therapist, setTherapist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingPayload, setPendingPayload] = useState(null);
  const [bookingFormRef, setBookingFormRef] = useState(null);

  useEffect(() => {
    fetchTherapist();
  }, [id]);

  const fetchTherapist = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/therapists/${id}`);
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

  const handleBooking = (e) => {
    e.preventDefault();

    const form = e.target;
    const payload = {
      therapistId: therapist._id,
      therapistName: therapist.name,
      userName: form.name.value,
      userEmail: form.email.value,
      preferredDate: form.date.value,
      preferredTime: form.time.value,
      note: form.note?.value || "",
    };

    if (!therapist.hourlyRate || therapist.hourlyRate <= 0) {
      toast.error("Therapist has not configured a valid session fee yet");
      return;
    }

    setPendingPayload(payload);
    setBookingFormRef(form);
    setShowPaymentModal(true);
  };

  const handlePayAndBook = async () => {
    if (!pendingPayload) return;
    setBookingLoading(true);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Failed to load Razorpay. Please check your internet connection.");
      }

      const token = await getAuthToken();
      const orderRes = await fetch(`${API_BASE_URL}/api/appointments/create-payment-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ therapistId: therapist._id }),
      });

      const orderData = await parseApiResponse(orderRes);
      if (!orderRes.ok) throw new Error(orderData.error || "Failed to initiate payment");

      const options = {
        key: orderData.razorpayKey,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "MindEase",
        description: `Appointment with ${therapist.name}`,
        order_id: orderData.order.id,
        prefill: {
          name: pendingPayload.userName,
          email: pendingPayload.userEmail,
        },
        theme: { color: "#4f46e5" },
        handler: async function (response) {
          try {
            const verifyRes = await fetch(`${API_BASE_URL}/api/appointments/verify-payment-and-book`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                ...pendingPayload,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await parseApiResponse(verifyRes);
            if (!verifyRes.ok) {
              throw new Error(verifyData.error || "Payment verification failed");
            }

            toast.success("Payment successful and appointment booked.", {
              icon: <CircleCheck size={16} />,
            });
            bookingFormRef?.reset();
            setPendingPayload(null);
            navigate("/therapist");
          } catch (verifyError) {
            toast.error(verifyError.message || "Payment done but booking failed. Contact support.", {
              icon: <CircleX size={16} />,
            });
          } finally {
            setBookingLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setBookingLoading(false);
            toast.warning("Payment cancelled.", {
              icon: <AlertCircle size={16} />,
            });
          },
        },
      };

      setShowPaymentModal(false);
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error(err);
      toast.error("Failed to book: " + err.message, {
        icon: <CircleX size={16} />,
      });
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start py-6 sm:py-10 px-3 sm:px-0">
      <div className="bg-white shadow-xl rounded-2xl p-4 sm:p-8 w-full max-w-3xl">
        {/* Back Button */}
        <Link
          to="/therapist"
          className="inline-block mb-6 text-mindease-500 hover:text-mindease-700 font-medium"
        >
          ← Back to Therapists
        </Link>

        {/* Therapist Header */}
        <div className="flex flex-col md:flex-row gap-5 sm:gap-8 mb-8 items-center md:items-start">
          <img
            src={therapist.profilePicture || "https://randomuser.me/api/portraits/lego/1.jpg"}
            alt={therapist.name}
            className="w-40 h-40 rounded-2xl object-cover shadow-md"
          />
          <div className="flex flex-col justify-center space-y-1 text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">{therapist.name}</h1>
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
                ₹{therapist.hourlyRate}/session
              </p>
            )}
          </div>
        </div>
        <button 
          onClick={() => navigate(`/chat/${therapist._id}`)}
          className="px-8 py-2.5 bg-mindease-500 text-white font-medium rounded-lg hover:bg-mindease-600 transition disabled:opacity-50"
        >
          Chat
        </button>

        {/* About Section */}
        {therapist.bio && (
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">About</h2>
            <p className="text-gray-700 leading-relaxed">{therapist.bio}</p>
          </div>
        )}



        {/* Booking Form */}
        <div className="bg-gray-100 rounded-2xl p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
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
                defaultValue={user?.name || ""}
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
                defaultValue={user?.email || ""}
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

            <div className="flex flex-col gap-1">
              <label htmlFor="note" className="text-base font-medium text-gray-700">
                Note (optional)
              </label>
              <textarea
                id="note"
                placeholder="Any preference or additional details"
                className="outline-none py-2.5 px-3 rounded border border-gray-400 focus:ring-2 focus:ring-mindease-400"
                rows={3}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
              <p className="text-lg font-semibold text-gray-700">
                Session Fee: ₹{therapist.hourlyRate || 0}
              </p>
              <button
                disabled={bookingLoading || !therapist.hourlyRate || therapist.hourlyRate <= 0}
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

      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-4 sm:p-6 shadow-2xl">
            <h3 className="text-xl font-semibold text-gray-900">Confirm Payment</h3>
            <p className="mt-2 text-gray-600">Pay the amount below to book your appointment.</p>

            <div className="mt-5 rounded-xl border border-mindease-200 bg-mindease-50 p-4">
              <p className="text-sm text-mindease-700">Amount to pay</p>
              <p className="text-2xl font-bold text-mindease-900">₹{therapist.hourlyRate || 0}</p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                disabled={bookingLoading}
                className="px-4 py-2 border rounded-lg text-mindease-700 hover:bg-mindease-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePayAndBook}
                disabled={bookingLoading}
                className="px-5 py-2 bg-mindease-600 text-white rounded-lg hover:bg-mindease-700 disabled:opacity-50"
              >
                {bookingLoading ? "Processing..." : `Pay ₹${therapist.hourlyRate || 0}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TherapistDetail;
