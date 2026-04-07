import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth as useClerkAuth, useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import { LogIn, UserPlus, TriangleAlert, LogOut } from "lucide-react";
import { API_BASE_URL } from "../config/env";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { isLoaded, isSignedIn, getToken, signOut } = useClerkAuth();
  const { user: clerkUser } = useUser();
  const [user, setUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [authError, setAuthError] = useState(null);
  const lastToastUserIdRef = useRef(null);
  const lastErrorToastRef = useRef("");

  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded) return;

      if (!isSignedIn) {
        setUser(null);
        setAuthError(null);
        setIsAuthReady(true);
        return;
      }

      try {
        const token = await getToken();
        if (!token) {
          setUser(null);
          setIsAuthReady(true);
          return;
        }

        const rolePreference = localStorage.getItem("mindease_role_preference") || "user";

        const response = await fetch(`${API_BASE_URL}/api/auth/clerk-sync`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            role: clerkUser?.publicMetadata?.role || rolePreference,
            name: clerkUser?.fullName || clerkUser?.firstName || "User",
            email: clerkUser?.primaryEmailAddress?.emailAddress || "",
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to sync user");
        }

        const data = await response.json();
        setUser(data.user || null);
        if (data.user?.id && lastToastUserIdRef.current !== data.user.id) {
          const authIntent = localStorage.getItem("mindease_auth_intent");
          if (authIntent === "signup") {
            toast.success("Registration successful", {
              description: "Your account is ready.",
              icon: <UserPlus size={16} />,
            });
          } else {
            toast.success("Login successful", {
              description: "Welcome back to MindEase.",
              icon: <LogIn size={16} />,
            });
          }
          localStorage.removeItem("mindease_auth_intent");
          lastToastUserIdRef.current = data.user.id;
        }
        if (data.user?.role) {
          localStorage.setItem("mindease_role_preference", data.user.role);
        }
        setAuthError(null);
      } catch (error) {
        console.error("Auth sync failed:", error);
        setUser(null);
        const message = error.message || "Authentication failed";
        setAuthError(message);
        if (lastErrorToastRef.current !== message) {
          toast.error(message, { icon: <TriangleAlert size={16} /> });
          lastErrorToastRef.current = message;
        }
      } finally {
        setIsAuthReady(true);
      }
    };

    syncUser();
  }, [isLoaded, isSignedIn, getToken, clerkUser]);

  const login = async () => {
    if (!isSignedIn) return;

    try {
      const token = await getToken();
      if (!token) return;

      const rolePreference = localStorage.getItem("mindease_role_preference") || "user";

      const response = await fetch(`${API_BASE_URL}/api/auth/clerk-sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          role: clerkUser?.publicMetadata?.role || rolePreference,
          name: clerkUser?.fullName || clerkUser?.firstName || "User",
          email: clerkUser?.primaryEmailAddress?.emailAddress || "",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to sync user");
      }

      const data = await response.json();
      setUser(data.user || null);
      if (data.user?.role) {
        localStorage.setItem("mindease_role_preference", data.user.role);
      }
      setAuthError(null);
    } catch (error) {
      console.error("Login sync failed:", error);
      setAuthError(error.message || "Login failed");
    }
  };

  const getAuthToken = async () => {
    if (!isSignedIn) return null;
    return getToken();
  };

  const logout = async () => {
    localStorage.removeItem("mindease_role_preference");
    await signOut();
    setUser(null);
    setAuthError(null);
    toast.info("Logged out", { icon: <LogOut size={16} /> });
    lastToastUserIdRef.current = null;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, getAuthToken, isAuthReady, authError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
