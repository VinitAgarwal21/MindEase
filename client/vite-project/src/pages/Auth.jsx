import { useState } from "react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

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
        <form className="space-y-4">
          {!isLogin && (
            <div className="flex flex-col gap-1">
              <label htmlFor="name" className="text-gray-700 font-medium">Full Name</label>
              <input
                type="text"
                id="name"
                placeholder="Enter your full name"
                className="outline-none py-2.5 px-3 rounded border border-gray-400 focus:ring-2 focus:ring-mindease-400"
                required
              />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-gray-700 font-medium">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="outline-none py-2.5 px-3 rounded border border-gray-400 focus:ring-2 focus:ring-mindease-400"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-gray-700 font-medium">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="outline-none py-2.5 px-3 rounded border border-gray-400 focus:ring-2 focus:ring-mindease-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-mindease-500 text-white font-medium rounded-lg hover:bg-mindease-600 transition"
          >
            {isLogin ? "Login" : "Signup"}
          </button>
        </form>

        {/* Optional Footer */}
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
