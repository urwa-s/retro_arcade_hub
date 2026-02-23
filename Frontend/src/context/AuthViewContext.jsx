import { createContext, useContext, useState } from "react";

const AuthViewContext = createContext();

export const AuthViewProvider = ({ children }) => {
  const [view, setView] = useState("signup"); // "signup" | "login"

  return (
    <AuthViewContext.Provider value={{ view, setView }}>
      {children}
    </AuthViewContext.Provider>
  );
};

export const useAuthView = () => useContext(AuthViewContext);
