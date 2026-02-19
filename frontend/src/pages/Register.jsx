import React, { useState } from "react";
import { Box, Button, Paper, Stack, TextField, Typography, Alert } from "@mui/material";
import { MdPersonAdd } from "react-icons/md";
import { registerUser } from "../api/portfolio";

export default function Register() {
  React.useEffect(() => {
    document.title = "Create Portfolio Account";
  }, []);

  React.useEffect(() => {
    const authUser = (localStorage.getItem("auth_user") || "").trim().toLowerCase();
    if (localStorage.getItem("token") && authUser) {
      window.location.replace(`/${authUser}/adminpanel`);
    }
  }, []);

  const [username, setUsername] = useState(""); // keep original case
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const typed = username.trim();
      const uLower = typed.toLowerCase(); // only for URL routing

      // ✅ IMPORTANT: send ORIGINAL to backend so it stores correct case
      const res = await registerUser(typed, password);

      const token =
        res &&
        res.data &&
        typeof res.data.token === "string" &&
        res.data.token.trim().length > 0
          ? res.data.token
          : null;

      if (!token) {
        setErr("Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      // ✅ backend returns original stored username (same as typed)
      const serverDisplay =
        res?.data?.username && typeof res.data.username === "string"
          ? res.data.username
          : typed;

      localStorage.removeItem("token");
      sessionStorage.clear();
      localStorage.setItem("token", token);
      localStorage.setItem("auth_user", uLower);           // lowercase for URL
      localStorage.setItem("display_name", serverDisplay); // original for top UI

      window.location.replace(`/${uLower}/adminpanel`);
    } catch (error) {
      const msg =
        error?.response?.data && typeof error.response.data === "string"
          ? error.response.data
          : "Registration failed. Try a different username.";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg,#0B1220,#121A2B,#0B1220)",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 520, px: 2 }}>
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
                <MdPersonAdd />
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
                Portfolio Generator
              </Typography>

              <Typography sx={{ opacity: 0.7, color: "#ddd", textAlign: "center" }}>
                Create your own username. Your portfolio URL becomes:
                <br />
                <b style={{ color: "#fff" }}>/{username || "{username}"}</b>
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
                  label="Username (for URL)"
                  fullWidth
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  helperText="Spaces allowed. URL auto converts to lowercase"
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
                  startIcon={<MdPersonAdd />}
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
                  {loading ? "Creating..." : "Create Account"}
                </Button>

                <Button
                  variant="text"
                  onClick={() => {
                    const u = username.trim().toLowerCase();
                    window.location.href = u ? `/${u}/adminpanel/login` : "/admin-login";
                  }}
                  sx={{ color: "#cbd5e1", fontWeight: 700 }}
                >
                  Already have an account? Go to Login
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Paper>
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
  "& .MuiFormHelperText-root": {
    color: "rgba(255,255,255,0.55)",
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
