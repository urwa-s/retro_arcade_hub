import { createContext, useContext, useState, useEffect } from "react";
import defaultBgVideo from "../assets/background.mp4";

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [backgroundVideo, setBackgroundVideo] = useState(() => {
    return localStorage.getItem("dashboardBg") || defaultBgVideo;
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("dashboardBg", backgroundVideo);
  }, [backgroundVideo]);

  return (
    <DashboardContext.Provider value={{ backgroundVideo, setBackgroundVideo }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => useContext(DashboardContext);
