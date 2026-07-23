// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useRef } from "react";
import { auth } from "../utils/auth";

const ACTIVITY_EVENTS = [
  "mousemove",
  "keydown",
  "mousedown",
  "touchstart",
  "scroll",
  "click",
];

const ProtectedRoute = () => {
  const timerRef = useRef(null);

  useEffect(() => {
    if (!auth.isLoggedIn()) return;

    const handleActivity = () => {
      auth.updateActivity();

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(
        () => {
          auth.logout();
          window.location.href = "/admin/login";
        },
        60 * 60 * 1000,
      ); // 1 jam
    };

    // Set timer awal
    handleActivity();

    ACTIVITY_EVENTS.forEach((event) =>
      window.addEventListener(event, handleActivity, { passive: true }),
    );

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      ACTIVITY_EVENTS.forEach((event) =>
        window.removeEventListener(event, handleActivity),
      );
    };
  }, []);

  if (!auth.isLoggedIn()) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
