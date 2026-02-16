import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
  Skeleton,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import { getProjects } from "../api/projects";
import { MdOpenInNew } from "react-icons/md";

const MotionPaper = motion(Paper);

const reveal = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

function GlassProjectCard({ project }) {
  // expected fields from backend (you can adjust later):
  // id, title, description, tech, status, liveUrl, repoUrl, updatedAt
  const techList = (project.tech || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

  return (
    <MotionPaper
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55 }}
      variant="outlined"
      sx={{
        height: "100%",
        p: 2.2,
        borderRadius: 4,
        position: "relative",
        overflow: "hidden",
        backdropFilter: "blur(16px)",
        background: (t) =>
          t.palette.mode === "dark"
            ? "linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.018))"
            : "linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.01))",
        transition: "transform 180ms ease, box-shadow 180ms ease",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 22px 70px rgba(0,0,0,0.20)",
        },
      }}
    >
      {/* glow blob */}
      <Box
        sx={{
          position: "absolute",
          inset: -60,
          opacity: 0.6,
          background:
            "radial-gradient(320px 220px at 20% 20%, rgba(124,58,237,0.55), transparent 60%), radial-gradient(320px 220px at 80% 80%, rgba(6,182,212,0.55), transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <Stack spacing={1.2} sx={{ position: "relative" }}>
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
          <Typography sx={{ fontWeight: 1000, letterSpacing: -0.3 }}>
            {project.title || "Untitled Project"}
          </Typography>

          {project.status ? (
            <Chip size="small" label={project.status} sx={{ borderRadius: 2, fontWeight: 900 }} />
          ) : null}
        </Stack>

        {project.description ? (
          <Typography variant="body2" sx={{ opacity: 0.88 }}>
            {project.description}
          </Typography>
        ) : (
          <Typography variant="body2" sx={{ opacity: 0.75 }}>
            (Add a description from Admin to make this look even more premium.)
          </Typography>
        )}

        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ pt: 0.5 }}>
          {techList.slice(0, 6).map((t) => (
            <Chip
              key={t}
              size="small"
              label={t}
              sx={{
                borderRadius: 2,
                fontWeight: 800,
                mb: 0.6,
              }}
            />
          ))}
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
          {project.liveUrl ? (
            <Button
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              variant="contained"
              startIcon={<MdOpenInNew />}
              sx={{
                fontWeight: 900,
                borderRadius: 3,
                background:
                  "linear-gradient(135deg, rgba(124,58,237,0.95), rgba(6,182,212,0.95))",
              }}
              fullWidth
            >
              Live
            </Button>
          ) : null}

          {project.repoUrl ? (
            <Button
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              variant="outlined"
              sx={{ fontWeight: 900, borderRadius: 3 }}
              fullWidth
            >
              Repo
            </Button>
          ) : null}
        </Stack>
      </Stack>
    </MotionPaper>
  );
}

export default function Projects() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [q, setQ] = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getProjects(); // DB -> backend -> here
        if (!alive) return;

        const data = Array.isArray(res.data) ? res.data : (res.data?.content ?? []);
        setProjects(data);
      } catch (e) {
        if (!alive) return;
        setError("Failed to load projects from backend. Check API path and CORS.");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const allTags = useMemo(() => {
    const set = new Set();
    projects.forEach((p) => {
      (p.tech || "")
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean)
        .forEach((x) => set.add(x));
    });
    return ["All", ...Array.from(set).slice(0, 12)];
  }, [projects]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return projects.filter((p) => {
      const text = `${p.title || ""} ${p.description || ""} ${p.tech || ""}`.toLowerCase();
      const matchesQuery = query ? text.includes(query) : true;
      const matchesTag =
        activeTag === "All"
          ? true
          : (p.tech || "").toLowerCase().includes(activeTag.toLowerCase());
      return matchesQuery && matchesTag;
    });
  }, [projects, q, activeTag]);

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container>
        <Typography variant="h3" sx={{ fontWeight: 1000 }}>
          Projects
        </Typography>
        <Typography sx={{ opacity: 0.85, mt: 1, maxWidth: 760 }}>
          Everything here is loaded from your database. Admin CRUD will update this page automatically.
        </Typography>

        <Paper
          variant="outlined"
          sx={{
            mt: 3,
            p: 2,
            borderRadius: 4,
            backdropFilter: "blur(16px)",
            background: (t) =>
              t.palette.mode === "dark"
                ? "rgba(255,255,255,0.03)"
                : "rgba(0,0,0,0.02)",
          }}
        >
          <Stack spacing={2}>
            <TextField
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search projects (title / tech / description)..."
              fullWidth
            />

            <Stack direction="row" spacing={1} flexWrap="wrap">
              {allTags.map((t) => (
                <Chip
                  key={t}
                  label={t}
                  onClick={() => setActiveTag(t)}
                  sx={{
                    borderRadius: 2,
                    fontWeight: 900,
                    mb: 1,
                    ...(activeTag === t
                      ? {
                          background:
                            "linear-gradient(135deg, rgba(124,58,237,0.95), rgba(6,182,212,0.95))",
                          color: "white",
                        }
                      : {}),
                  }}
                />
              ))}
            </Stack>
          </Stack>
        </Paper>

        {error ? (
          <Paper variant="outlined" sx={{ mt: 2, p: 2, borderRadius: 4 }}>
            <Typography sx={{ fontWeight: 900, color: "error.main" }}>{error}</Typography>
            <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
              Current frontend expects: GET <b>http://localhost:8080/api/projects</b>
            </Typography>
          </Paper>
        ) : null}

        <Grid container spacing={2.2} sx={{ mt: 1 }}>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Grid key={i} item xs={12} sm={6} md={4}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 4 }}>
                    <Skeleton variant="text" height={34} />
                    <Skeleton variant="text" height={20} />
                    <Skeleton variant="text" height={20} />
                    <Skeleton variant="rounded" height={36} sx={{ mt: 2 }} />
                  </Paper>
                </Grid>
              ))
            : filtered.map((p) => (
                <Grid key={p.id || p.title} item xs={12} sm={6} md={4}>
                  <GlassProjectCard project={p} />
                </Grid>
              ))}
        </Grid>

        {!loading && filtered.length === 0 ? (
          <Paper variant="outlined" sx={{ mt: 3, p: 3, borderRadius: 4 }}>
            <Typography sx={{ fontWeight: 1000 }}>No projects found</Typography>
            <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.7 }}>
              Add projects from Admin (stored in DB) and they will appear here.
            </Typography>
          </Paper>
        ) : null}
      </Container>

      <Box sx={{ height: 60 }} />
    </Box>
  );
}
