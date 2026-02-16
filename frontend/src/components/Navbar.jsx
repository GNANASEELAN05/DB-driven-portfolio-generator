import React from "react";
import { Box, Button, Container, Grid, Paper, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const MotionBox = motion(Box);

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

export default function Home() {
  const navigate = useNavigate();

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container>
        {/* HERO */}
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={7}>
            <MotionBox
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.7 }}
            >
              <Typography variant="h2" sx={{ lineHeight: 1.05 }}>
                Build. Scale.{" "}
                <Box
                  component="span"
                  sx={{
                    background:
                      "linear-gradient(135deg, rgba(124,58,237,1), rgba(6,182,212,1))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Impress.
                </Box>
              </Typography>

              <Typography sx={{ mt: 2, opacity: 0.9, maxWidth: 560 }}>
                I build full-stack web apps with React + Spring Boot + PostgreSQL.
                This portfolio is fully dynamic — content is managed via Admin and stored in DB.
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  onClick={() => navigate("/projects")}
                  sx={{
                    fontWeight: 900,
                    borderRadius: 3,
                    py: 1.2,
                    background:
                      "linear-gradient(135deg, rgba(124,58,237,0.95), rgba(6,182,212,0.95))",
                  }}
                >
                  View Projects
                </Button>

                <Button variant="outlined" onClick={() => navigate("/contact")} sx={{ fontWeight: 900, borderRadius: 3, py: 1.2 }}>
                  Contact Me
                </Button>
              </Stack>
            </MotionBox>
          </Grid>

          <Grid item xs={12} md={5}>
            <MotionBox
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              <Paper
                variant="outlined"
                sx={{
                  p: 2.5,
                  borderRadius: 4,
                  overflow: "hidden",
                  position: "relative",
                  background: (t) =>
                    t.palette.mode === "dark"
                      ? "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))"
                      : "linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.01))",
                  backdropFilter: "blur(16px)",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    inset: -40,
                    opacity: 0.6,
                    background:
                      "radial-gradient(300px 220px at 30% 20%, rgba(124,58,237,0.5), transparent 60%), radial-gradient(300px 220px at 70% 80%, rgba(6,182,212,0.45), transparent 60%)",
                    pointerEvents: "none",
                  }}
                />

                <Typography sx={{ fontWeight: 1000, position: "relative" }}>
                  Tech Stack Snapshot
                </Typography>

                <Stack spacing={1} sx={{ mt: 2, position: "relative" }}>
                  {[
                    "Frontend: React (Vite) + MUI + Framer Motion",
                    "Backend: Spring Boot (REST)",
                    "Database: PostgreSQL",
                    "Admin → Viewer sync: DB driven",
                  ].map((t, i) => (
                    <Box
                      key={i}
                      sx={{
                        p: 1.2,
                        borderRadius: 3,
                        border: (x) => `1px solid ${x.palette.divider}`,
                        background: (x) =>
                          x.palette.mode === "dark"
                            ? "rgba(255,255,255,0.03)"
                            : "rgba(0,0,0,0.02)",
                      }}
                    >
                      <Typography variant="body2" sx={{ opacity: 0.92 }}>
                        {t}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </MotionBox>
          </Grid>
        </Grid>

        {/* SECTION PREVIEW */}
        <MotionBox
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7 }}
          sx={{ mt: { xs: 5, md: 7 } }}
        >
          <Typography variant="h5" sx={{ fontWeight: 1000 }}>
            What you’ll see here
          </Typography>
          <Typography sx={{ opacity: 0.85, mt: 0.8, maxWidth: 720 }}>
            Smooth scrolling animations, glass UI, responsive layout, and all data loaded from your database.
          </Typography>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            {[
              { title: "Projects", desc: "Cards, filters, beautiful animations", to: "/projects" },
              { title: "Blog", desc: "Optional, but looks very professional", to: "/blog" },
              { title: "Contact", desc: "Form + socials, mobile-friendly", to: "/contact" },
            ].map((c) => (
              <Grid key={c.title} item xs={12} md={4}>
                <Paper
                  variant="outlined"
                  onClick={() => navigate(c.to)}
                  sx={{
                    p: 2,
                    borderRadius: 4,
                    cursor: "pointer",
                    transition: "transform 200ms ease, box-shadow 200ms ease",
                    background: (t) =>
                      t.palette.mode === "dark"
                        ? "rgba(255,255,255,0.03)"
                        : "rgba(0,0,0,0.02)",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
                    },
                  }}
                >
                  <Typography sx={{ fontWeight: 1000 }}>{c.title}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.6 }}>
                    {c.desc}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </MotionBox>
      </Container>

      <Box sx={{ height: 60 }} />
    </Box>
  );
}
