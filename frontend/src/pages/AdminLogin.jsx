import React, { useState } from "react";
import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { MdLock, MdLogin } from "react-icons/md";
import { useParams } from "react-router-dom";
import { adminLogin } from "../api/portfolio";

export default function AdminLogin() {
  const { username: urlUser } = useParams();

  React.useEffect(() => {
    document.title = "Admin Login";
  }, []);

  // ✅ if already logged in, go straight to dashboard
  React.useEffect(() => {
    const authUser = (localStorage.getItem("auth_user") || "").trim().toLowerCase();
    if (localStorage.getItem("token") && authUser) {
      window.location.replace(`/${authUser}/adminpanel`);
    }
  }, []);

  const [username, setUsername] = useState((urlUser || "").trim());
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const typed = username.trim();              // keep as typed
      const uLower = typed.toLowerCase();         // only for URL + lookup
      const expected = (urlUser || "").trim().toLowerCase();

      if (expected && uLower !== expected) {
        setErr(`Please login using your own URL username: ${expected}`);
        setLoading(false);
        return;
      }

      const res = await adminLogin(uLower, password);

      const token =
        res &&
        res.data &&
        typeof res.data.token === "string" &&
        res.data.token.trim().length > 0
          ? res.data.token
          : null;

      if (!token) {
        setErr("Invalid username or password");
        setLoading(false);
        return;
      }

      // ✅ backend returns original stored username
      const serverDisplay =
        res?.data?.username && typeof res.data.username === "string"
          ? res.data.username
          : typed;

      localStorage.removeItem("token");
      sessionStorage.clear();
      localStorage.setItem("token", token);
      localStorage.setItem("auth_user", uLower);          // always lowercase for URL
      localStorage.setItem("display_name", serverDisplay); // always original from DB

      window.location.replace(`/${uLower}/adminpanel`);
    } catch (error) {
      setErr("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg,#0f0c29,#302b63,#24243e)",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 420, px: 2 }}>
        <Paper
          elevation={10}
          sx={{
            width: "100%",
            p: { xs: 3, sm: 5 },
            borderRadius: 5,
            backdropFilter: "blur(20px)",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.15)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
          }}
        >
          <Stack spacing={3}>
            <Stack alignItems="center" spacing={1}>
              <Box
                sx={{
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#8b5cf6,#22d3ee)",
                  display: "grid",
                  placeItems: "center",
                  color: "#fff",
                  fontSize: 32,
                }}
              >
                <MdLock />
              </Box>

              <Typography
                sx={{
                  fontWeight: 900,
                  fontSize: 28,
                  textAlign: "center",
                  background: "linear-gradient(90deg,#a78bfa,#22d3ee)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Admin Portal
              </Typography>

              <Typography sx={{ opacity: 0.7, color: "#ddd", textAlign: "center" }}>
                Login to manage: <b>{(urlUser || "").trim()}</b>
              </Typography>
            </Stack>

            {err && (
              <Alert severity="error" sx={{ borderRadius: 3 }}>
                {err}
              </Alert>
            )}

            <Box component="form" onSubmit={onSubmit}>
              <Stack spacing={2}>
                <TextField
                  label="Username"
                  fullWidth
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  sx={inputStyle}
                />

                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={inputStyle}
                />

                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<MdLogin />}
                  disabled={loading}
                  sx={{
                    mt: 1,
                    py: 1.4,
                    fontWeight: 900,
                    borderRadius: 3,
                    fontSize: 16,
                    background: "linear-gradient(135deg,#8b5cf6,#22d3ee)",
                    boxShadow: "0 10px 30px rgba(99,102,241,0.5)",
                  }}
                >
                  {loading ? "Signing in..." : "Login"}
                </Button>

                <Button
                  variant="text"
                  onClick={() => (window.location.href = "/register")}
                  sx={{ color: "#cbd5e1", fontWeight: 700 }}
                >
                  Create new account
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Paper>

        <Typography sx={{ textAlign: "center", mt: 2, fontSize: 13, color: "#aaa" }}>
          Portfolio Admin Panel • Secure Access
        </Typography>
      </Box>
    </Box>
  );
}

const inputStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 3,
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
  },
  "& .MuiInputLabel-root": {
    color: "#aaa",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255,255,255,0.25)",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#8b5cf6",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#22d3ee",
  },
};
