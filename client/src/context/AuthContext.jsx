import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

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
          setUser(JSON.parse(storedUser));
        }

        try {
          const response = await api.get("/auth/me");
          if (response?.data?.user) {
            setUser(response.data.user);
            localStorage.setItem("user", JSON.stringify(response.data.user));
          }
        } catch (error) {
          console.error("Failed to refresh authenticated user", error);
        }
      }

      setLoading(false);
    };

    restoreUser();
  }, [token]);

  const login = (userData, jwtToken) => {

    localStorage.setItem("token", jwtToken);

    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);

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