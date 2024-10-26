// app/authContext.js
"use client";
import { createContext, useContext, useState, useEffect } from "react";
import jwt from "jsonwebtoken";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwt.decode(token);
        setUser({
          name: decoded.name,
          phoneNumber: decoded.phoneNumber,
          ...decoded,
        });
      } catch (error) {
        console.error("Failed to decode token:", error);
        setUser(null);
      }
    }

    const handleStorageChange = () => {
      const newToken = localStorage.getItem("token");
      if (newToken) {
        const decoded = jwt.decode(newToken);
        setUser({
          name: decoded.name,
          phoneNumber: decoded.phoneNumber,
          ...decoded,
        });
      } else {
        setUser(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
