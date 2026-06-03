import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { getErrorMessage } from "../utils/errorMessage";

const AuthContext = createContext();

const normalizeUser = (userData) => {
  if (!userData) return null;

  const resumeUrl = userData?.currentResume?.resumeUrl || userData?.resume || "";

  return {
    ...userData,
    resume: resumeUrl,
    resumeHistory: Array.isArray(userData?.resumeHistory) ? userData.resumeHistory : [],
    currentResume: userData?.currentResume
      ? {
          ...userData.currentResume,
          resumeUrl,
          active: userData.currentResume.active ?? true,
        }
      : userData?.resume
        ? {
            version: userData?.currentResume?.version ?? 1,
            fileName: userData?.currentResume?.fileName || "Resume.pdf",
            resumeUrl,
            publicId: userData?.currentResume?.publicId || "",
            uploadedAt: userData?.currentResume?.uploadedAt || new Date().toISOString(),
            active: true,
          }
        : null,
  };
};

function AuthProvider({ children }) {

  const [user, setUser] = useState(null);

  const [token, setToken] = useState(
    localStorage.getItem("token") || null
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreUser = async () => {
      if (token) {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(normalizeUser(JSON.parse(storedUser)));
        }

        try {
          const response = await api.get("/auth/me");
          if (response?.data?.user) {
            const normalizedUser = normalizeUser(response.data.user);
            setUser(normalizedUser);
            localStorage.setItem("user", JSON.stringify(normalizedUser));
          }
        } catch (error) {
          toast.error(getErrorMessage(error, "Session expired. Please log in again."));
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
          setToken(null);
        }
      }

      setLoading(false);
    };

    restoreUser();
  }, [token]);

  const login = (userData, jwtToken) => {
    const normalizedUser = normalizeUser(userData);

    localStorage.setItem("token", jwtToken);
    localStorage.setItem("user", JSON.stringify(normalizedUser));

    setUser(normalizedUser);
    setToken(jwtToken);
  };

  const logout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    setUser(null);

    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;

export const useAuth = () => useContext(AuthContext);