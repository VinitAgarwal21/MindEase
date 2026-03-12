import { SignedIn, SignedOut, SignIn, SignUp } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [rolePreference, setRolePreference] = useState(
    localStorage.getItem("mindease_role_preference") || "user"
  );
  const navigate = useNavigate();
  const { user, isAuthReady } = useAuth();

  useEffect(() => {
    if (!isAuthReady) return;

    if (user?.role === "therapist") {
      navigate("/therapist/onboarding", { replace: true });
      return;
    }

    if (user) {
      navigate(`/user/${user.id}`, { replace: true });
    }
  }, [user, isAuthReady, navigate]);

  const handleRoleChange = (event) => {
    const selectedRole = event.target.value;
    setRolePreference(selectedRole);
    localStorage.setItem("mindease_role_preference", selectedRole);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <SignedIn>
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
          <h1 className="text-2xl font-semibold text-gray-800">Authentication complete</h1>
          <p className="text-gray-600 mt-2">Redirecting to your dashboard...</p>
        </div>
      </SignedIn>

      <SignedOut>
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">MindEase</h1>

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

          {!isLogin && (
            <div className="flex flex-col gap-2 mt-2 mb-4">
              <label className="text-gray-700 font-medium">Signup as</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={rolePreference === "user"}
                    onChange={handleRoleChange}
                  />
                  <span>User</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="role"
                    value="therapist"
                    checked={rolePreference === "therapist"}
                    onChange={handleRoleChange}
                  />
                  <span>Therapist</span>
                </label>
              </div>
            </div>
          )}

          <div className="flex justify-center">
            {isLogin ? (
              <SignIn routing="virtual" />
            ) : (
              <SignUp routing="virtual" />
            )}
          </div>
        </div>
      </SignedOut>
    </div>
  );
};

export default Auth;
