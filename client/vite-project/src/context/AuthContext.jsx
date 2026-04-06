import { createContext, useContext, useEffect, useState } from "react";
import { useAuth as useClerkAuth, useUser } from "@clerk/clerk-react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { isLoaded, isSignedIn, getToken, signOut } = useClerkAuth();
  const { user: clerkUser } = useUser();
  const [user, setUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded) return;

      if (!isSignedIn) {
        setUser(null);
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

        const response = await fetch("http://localhost:5000/api/auth/clerk-sync", {
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
          throw new Error("Failed to sync user");
        }

        const data = await response.json();
        setUser(data.user || null);
      } catch (error) {
        console.error("Auth sync failed:", error);
        setUser(null);
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

      const response = await fetch("http://localhost:5000/api/auth/clerk-sync", {
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
        throw new Error("Failed to sync user");
      }

      const data = await response.json();
      setUser(data.user || null);
    } catch (error) {
      console.error("Login sync failed:", error);
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
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, getAuthToken, isAuthReady }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
