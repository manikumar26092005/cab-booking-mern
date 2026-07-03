import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ token: null, user: null, role: null });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const userStr = localStorage.getItem("authUser");
    if (token && role) {
      setAuth({ token, role, user: userStr ? JSON.parse(userStr) : null });
    }
  }, []);

  const login = (token, role, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("authUser", JSON.stringify(user));
    setAuth({ token, role, user });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("authUser");
    setAuth({ token: null, user: null, role: null });
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
