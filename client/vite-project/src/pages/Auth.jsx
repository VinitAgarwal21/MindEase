import axios from "axios";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    role: "user", // default role
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRoleChange = (e) => {
    setFormData({ ...formData, role: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "/login" : "/register";

    try {
      const { data } = await axios.post(
        `http://localhost:5000/api/auth${endpoint}`,
        formData
      );
      alert(data.message);
      const isTherapist = data?.user?.role === "therapist" || (!isLogin && formData.role === "therapist");
      login({ ...data.user, token: data.token });
      navigate(isTherapist ? "/therapist/onboarding" : "/");
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">MindEase</h1>

        {/* Toggle */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-6 py-2 rounded-lg font-medium ${
              isLogin ? "bg-mindease-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`px-6 py-2 rounded-lg font-medium ${
              !isLogin ? "bg-mindease-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            Signup
          </button>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              {/* Full Name */}
              <div className="flex flex-col gap-1">
                <label htmlFor="name" className="text-gray-700 font-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="outline-none py-2.5 px-3 rounded border border-gray-400 focus:ring-2 focus:ring-mindease-400"
                  required
                />
              </div>
            </>
          )}

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-gray-700 font-medium">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="outline-none py-2.5 px-3 rounded border border-gray-400 focus:ring-2 focus:ring-mindease-400"
              required
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-gray-700 font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="outline-none py-2.5 px-3 rounded border border-gray-400 focus:ring-2 focus:ring-mindease-400"
              required
            />
          </div>

          {/* Gender field only in Signup */}
          {!isLogin && (
            <>
              <div className="flex flex-col gap-1">
                <label htmlFor="gender" className="text-gray-700 font-medium">
                  Gender
                </label>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="outline-none py-2.5 px-3 rounded border border-gray-400 focus:ring-2 focus:ring-mindease-400"
                  required
                >
                  <option value="">Select your gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-say">Prefer not to say</option>
                </select>
              </div>

              {/* Role Selection 👇 (after gender) */}
              <div className="flex flex-col gap-2 mt-2">
                <label className="text-gray-700 font-medium">Signup as</label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="role"
                      value="user"
                      checked={formData.role === "user"}
                      onChange={handleRoleChange}
                    />
                    <span>User</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="role"
                      value="therapist"
                      checked={formData.role === "therapist"}
                      onChange={handleRoleChange}
                    />
                    <span>Therapist</span>
                  </label>
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-mindease-500 text-white font-medium rounded-lg hover:bg-mindease-600 transition"
          >
            {isLogin ? "Login" : "Signup"}
          </button>
        </form>

        {/* Footer Toggle */}
        <p className="text-center text-gray-500 mt-4 text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            onClick={() => setIsLogin(!isLogin)}
            className="text-mindease-500 font-medium cursor-pointer hover:underline"
          >
            {isLogin ? "Signup" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Auth;
