// App.jsx
// ─────────────────────────────────────────────────────────────────────────────
// ROUTING MAP:
//
//   FREE VIEWER      /:username              → Home.jsx
//   PREMIUM1 VIEWER  /:username/premium1     → HomePremium1.jsx
//   PREMIUM2 VIEWER  /:username/premium2     → HomePremium2.jsx
//
//   FREE ADMIN       /:username/adminpanel         → AdminDashboard.jsx
//   PREMIUM1 ADMIN   /:username/adminpanel/premium1 → AdminDashboardPremium1.jsx
//   PREMIUM2 ADMIN   /:username/adminpanel/premium2 → AdminDashboardPremium2.jsx
//
//   Admin icon in Home.jsx       → /:username/adminpanel
//   Admin icon in HomePremium1   → /:username/adminpanel/premium1
//   Admin icon in HomePremium2   → /:username/adminpanel/premium2
//
//   RequireAuth on free admin    → redirects owner to /:username/adminpanel
//   RequireAuth on premium1 admin→ redirects owner to /:username/adminpanel/premium1
//   RequireAuth on premium2 admin→ redirects owner to /:username/adminpanel/premium2
// ─────────────────────────────────────────────────────────────────────────────

import React, { useMemo, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Register from "./pages/Register";
import AdminDashboardPremium1 from "./pages/AdminDashboardPremium1";
import AdminDashboardPremium2 from "./pages/AdminDashboardPremium2";
import HomePremium1 from "./pages/HomePremium1";
import HomePremium2 from "./pages/HomePremium2";

const makeTheme = (mode, flavor = "viewer") => {
  const viewerPrimary   = "#7C3AED";
  const viewerSecondary = "#06B6D4";
  const adminPrimary    = "#F59E0B";
  const adminSecondary  = "#3B82F6";
  const primary   = flavor === "admin" ? adminPrimary   : viewerPrimary;
  const secondary = flavor === "admin" ? adminSecondary : viewerSecondary;
  return createTheme({
    palette: {
      mode,
      primary:   { main: primary },
      secondary: { main: secondary },
      background: {
        default: mode === "dark" ? "#0B1220" : "#F6F7FB",
        paper:   mode === "dark" ? "#0F1A2B" : "#FFFFFF",
      },
    },
    shape:      { borderRadius: 14 },
    typography: {
      fontFamily: `"Inter", system-ui, -apple-system, Segoe UI, Roboto, Arial`,
    },
  });
};

export default function App() {
  const [viewerDark, setViewerDark] = useState(
    localStorage.getItem("viewer_theme")
      ? localStorage.getItem("viewer_theme") === "dark"
      : true
  );
  const [adminDark, setAdminDark] = useState(
    localStorage.getItem("admin_theme")
      ? localStorage.getItem("admin_theme") === "dark"
      : true
  );
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const checkToken = () => setLoggedIn(!!localStorage.getItem("token"));
    window.addEventListener("storage", checkToken);
    window.addEventListener("focus",   checkToken);
    return () => {
      window.removeEventListener("storage", checkToken);
      window.removeEventListener("focus",   checkToken);
    };
  }, []);

  const viewerTheme = useMemo(() => makeTheme(viewerDark ? "dark" : "light", "viewer"), [viewerDark]);
  const adminTheme  = useMemo(() => makeTheme(adminDark  ? "dark" : "light", "admin"),  [adminDark]);

  const toggleViewerTheme = () => {
    setViewerDark((prev) => {
      const next = !prev;
      localStorage.setItem("viewer_theme", next ? "dark" : "light");
      return next;
    });
  };
  const toggleAdminTheme = () => {
    setAdminDark((prev) => {
      const next = !prev;
      localStorage.setItem("admin_theme", next ? "dark" : "light");
      return next;
    });
  };

  const getAuthUser = () => (localStorage.getItem("auth_user") || "").trim().toLowerCase();
  const hasToken    = () => !!localStorage.getItem("token");

  // ── Redirect "/" to best available page ──────────────────────────────────
  // FREE:     → /:authUser/adminpanel
  // PREMIUM1: → /:authUser/premium1
  // PREMIUM2: → /:authUser/premium2
  const RedirectToBest = () => {
    const authUser = getAuthUser();
    if (!hasToken() || !authUser) return <Navigate to="/register" replace />;
    const hasPremium2 = localStorage.getItem(`premium2_${authUser}`) === "true";
    const hasPremium1 = localStorage.getItem(`premium1_${authUser}`) === "true";
    if (hasPremium2) return <Navigate to={`/${authUser}/premium2`} replace />;
    if (hasPremium1) return <Navigate to={`/${authUser}/premium1`} replace />;
    return <Navigate to={`/${authUser}/adminpanel`} replace />;
  };

  // ── Skip login/register if already authed ─────────────────────────────────
  const IfAuthedGoDashboard = ({ children }) => {
    const authUser = getAuthUser();
    if (hasToken() && authUser) {
      // Send to their correct admin dashboard
      const hasPremium2 = localStorage.getItem(`premium2_${authUser}`) === "true";
      const hasPremium1 = localStorage.getItem(`premium1_${authUser}`) === "true";
      if (hasPremium2) return <Navigate to={`/${authUser}/adminpanel/premium2`} replace />;
      if (hasPremium1) return <Navigate to={`/${authUser}/adminpanel/premium1`} replace />;
      return <Navigate to={`/${authUser}/adminpanel`} replace />;
    }
    return children;
  };

  // ── Protect admin routes ──────────────────────────────────────────────────
  // dashboardType: "free" | "premium1" | "premium2"
  // If wrong user tries to access, redirect to their own correct admin panel
  const RequireAuth = ({ children, dashboardType = "free" }) => {
    const { username } = useParams();
    const authUser = getAuthUser();

    // Not logged in at all
    if (!hasToken() || !authUser) return <Navigate to="/admin-login" replace />;

    const urlUser = (username || "").trim().toLowerCase();

    // Logged-in user trying to access another user's panel
    if (urlUser && authUser !== urlUser) {
      const hasPremium2 = localStorage.getItem(`premium2_${authUser}`) === "true";
      const hasPremium1 = localStorage.getItem(`premium1_${authUser}`) === "true";
      if (hasPremium2) return <Navigate to={`/${authUser}/adminpanel/premium2`} replace />;
      if (hasPremium1) return <Navigate to={`/${authUser}/adminpanel/premium1`} replace />;
      return <Navigate to={`/${authUser}/adminpanel`} replace />;
    }

    // Allow owner to visit ANY tier's admin panel freely.
    // Only block access to premium tiers the user hasn't purchased.
    const hasPremium2 = localStorage.getItem(`premium2_${authUser}`) === "true";
    const hasPremium1 = localStorage.getItem(`premium1_${authUser}`) === "true";

    if (dashboardType === "premium1" && !hasPremium1 && !hasPremium2)
      return <Navigate to={`/${authUser}/adminpanel`} replace />;

    if (dashboardType === "premium2" && !hasPremium2) {
      if (hasPremium1) return <Navigate to={`/${authUser}/adminpanel/premium1`} replace />;
      return <Navigate to={`/${authUser}/adminpanel`} replace />;
    }

    return children;
  };

  // ── /:username viewer — redirect owner to their best premium ──────────────
  // Visitors see the free Home; owner gets redirected to their premium page
  const PremiumRedirectWrapper = () => {
    const { username } = useParams();
    const authUser = getAuthUser();
    if (authUser && authUser === (username || "").toLowerCase()) {
      const hasPremium2 = localStorage.getItem(`premium2_${authUser}`) === "true";
      const hasPremium1 = localStorage.getItem(`premium1_${authUser}`) === "true";
      if (hasPremium2) return <Navigate to={`/${username}/premium2`} replace />;
      if (hasPremium1) return <Navigate to={`/${username}/premium1`} replace />;
    }
    return <Home toggleTheme={toggleViewerTheme} />;
  };

  return (
    <BrowserRouter>
      <Routes>

        {/* ── Root ── */}
        <Route path="/" element={<RedirectToBest />} />

        {/* ── Auth ── */}
        <Route path="/register" element={
          <IfAuthedGoDashboard>
            <ThemeProvider theme={viewerTheme}><CssBaseline /><Register /></ThemeProvider>
          </IfAuthedGoDashboard>
        } />
        <Route path="/admin-login" element={
          <IfAuthedGoDashboard>
            <ThemeProvider theme={adminTheme}><CssBaseline /><AdminLogin /></ThemeProvider>
          </IfAuthedGoDashboard>
        } />

        {/* ── Public viewers ── */}
        {/* FREE:     /:username              → Home.jsx        */}
        {/* PREMIUM1: /:username/premium1     → HomePremium1    */}
        {/* PREMIUM2: /:username/premium2     → HomePremium2    */}
        <Route path="/:username" element={
          <ThemeProvider theme={viewerTheme}><CssBaseline /><PremiumRedirectWrapper /></ThemeProvider>
        } />
        <Route path="/:username/premium1" element={
          <ThemeProvider theme={viewerTheme}><CssBaseline />
            <HomePremium1 toggleTheme={toggleViewerTheme} />
          </ThemeProvider>
        } />
        <Route path="/:username/premium2" element={
          <ThemeProvider theme={viewerTheme}><CssBaseline />
            <HomePremium2 toggleTheme={toggleViewerTheme} />
          </ThemeProvider>
        } />

        {/* ── Admin panel login (per-user alias) ── */}
        <Route path="/:username/adminpanel/login" element={
          <IfAuthedGoDashboard>
            <ThemeProvider theme={adminTheme}><CssBaseline /><AdminLogin /></ThemeProvider>
          </IfAuthedGoDashboard>
        } />

        {/* ── Admin dashboards ── */}
        {/* FREE ADMIN:     /:username/adminpanel          → AdminDashboard         */}
        {/* PREMIUM1 ADMIN: /:username/adminpanel/premium1 → AdminDashboardPremium1 */}
        {/* PREMIUM2 ADMIN: /:username/adminpanel/premium2 → AdminDashboardPremium2 */}
        <Route path="/:username/adminpanel" element={
          <RequireAuth dashboardType="free">
            <ThemeProvider theme={adminTheme}><CssBaseline />
              <AdminDashboard setDarkMode={toggleAdminTheme} />
            </ThemeProvider>
          </RequireAuth>
        } />
        <Route path="/:username/adminpanel/premium1" element={
          <RequireAuth dashboardType="premium1">
            <ThemeProvider theme={adminTheme}><CssBaseline />
              <AdminDashboardPremium1 setDarkMode={toggleAdminTheme} />
            </ThemeProvider>
          </RequireAuth>
        } />
        <Route path="/:username/adminpanel/premium2" element={
          <RequireAuth dashboardType="premium2">
            <ThemeProvider theme={adminTheme}><CssBaseline />
              <AdminDashboardPremium2 setDarkMode={toggleAdminTheme} />
            </ThemeProvider>
          </RequireAuth>
        } />

        {/* ── Fallback ── */}
        <Route path="*" element={<RedirectToBest />} />

      </Routes>
    </BrowserRouter>
  );
}