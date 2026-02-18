// src/pages/Home.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";

import {
  MdArrowDownward,
  MdAdminPanelSettings,
  MdRefresh,
  MdEmail,
  MdLightMode,
  MdDarkMode,
  MdDownload,
  MdLink,
  MdWork,
  MdSchool,
  MdTimeline,
  MdEmojiEvents,
  MdCode,
  MdVisibility,
  MdPhone,
  MdClose,
} from "react-icons/md";
import { FaGithub, FaLinkedin } from "react-icons/fa";

import {
  getProfile,
  getSkills,
  getFeaturedProjects,
  getExperience,
  getEducation,
  getSocials,
  getAchievements,
  getLanguageExperience,
  downloadResumeUrl,
  viewResumeUrl,
} from "../api/portfolio";

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

const reveal = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

// ✅ scroll reveal for sections (no layout change, just animation)
const sectionReveal = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

const BRAND_PRIMARY = "#c680f2";
const BRAND_DARK = "#7A3F91";
const ACCENT_A = "#22C55E"; // emerald
const ACCENT_B = "#60A5FA"; // sky
const ACCENT_C = "#F59E0B"; // amber

function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function clampArray(x) {
  if (!x) return [];
  if (Array.isArray(x)) return x;
  return [];
}

function safeString(v) {
  return typeof v === "string" ? v : v == null ? "" : String(v);
}

function splitCSV(s) {
  if (!s) return [];
  if (Array.isArray(s)) return s.filter(Boolean).map((x) => String(x).trim()).filter(Boolean);
  return String(s)
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

function SectionTitle({ title, icon }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
      <Box
        sx={{
          width: 38,
          height: 38,
          borderRadius: 2.4,
          display: "grid",
          placeItems: "center",
          background: `linear-gradient(135deg, ${BRAND_PRIMARY}, ${BRAND_DARK})`,
          color: "#0b0b0e",
          boxShadow: "0 10px 30px rgba(122,63,145,0.25)",
          // ✅ subtle hover polish (no layout change)
          transition: "transform 180ms ease, box-shadow 180ms ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 16px 45px rgba(122,63,145,0.28)",
          },
        }}
      >
        {icon}
      </Box>
      <Typography sx={{ fontWeight: 950, fontSize: { xs: 18, md: 22 } }}>{title}</Typography>
    </Stack>
  );
}

function GlassCard({ sx, children }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 4,
        overflow: "hidden",
        // ✅ FIX: prevent horizontal scrollbar on hover transforms inside tables
        overflowX: "hidden",
        borderColor: (t) => (t.palette.mode === "dark" ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)"),
        background: (t) =>
          t.palette.mode === "dark"
            ? "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.03))"
            : "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.78))",
        backdropFilter: "blur(10px)",
        // ✅ hover polish (no layout change)
        transition: "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 18px 55px rgba(0,0,0,0.14)",
          borderColor: (t) => (t.palette.mode === "dark" ? "rgba(198,128,242,0.22)" : "rgba(122,63,145,0.22)"),
        },
        ...sx,
      }}
    >
      {children}
    </Paper>
  );
}

function ProjectCardOneByOne({ index, p }) {
  const title = safeString(p?.title) || "Untitled Project";
  const description = safeString(p?.description) || "";
  const techList = splitCSV(p?.tech);
  const repoUrl = safeString(p?.repoUrl || "");
  const liveUrl = safeString(p?.liveUrl || "");

  return (
    <MotionPaper
      variant="outlined"
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 380, damping: 26 }}
      sx={{
        p: { xs: 2, md: 2.3 },
        borderRadius: 3,
        borderColor: (t) => (t.palette.mode === "dark" ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)"),
        background: (t) => (t.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.85)"),
        // ✅ glow on hover (no layout change)
        transition: "box-shadow 180ms ease, border-color 180ms ease",
        "&:hover": {
          boxShadow: "0 18px 55px rgba(122,63,145,0.18)",
          borderColor: "rgba(198,128,242,0.25)",
        },
      }}
    >
      <Stack spacing={1}>
        <Stack direction="row" spacing={1} alignItems="baseline">
          <Typography
            sx={{
              fontWeight: 950,
              minWidth: 10,
              textAlign: "right",
              fontSize: { xs: 16, md: 18 },
              color: "text.primary",
            }}
          >
            {index}.
          </Typography>
          <Typography sx={{ fontWeight: 950, fontSize: { xs: 16, md: 18 } }}>{title}</Typography>
        </Stack>

        {description ? (
  <Typography
    variant="body2"
    sx={{
      opacity: 0.9,
      lineHeight: 1.6,
      textAlign: "justify",  // ✅ makes paragraph justified
    }}
  >
    {description}
  </Typography>
) : null}

        {techList.length ? (
          <Box sx={{ pt: 0.2 }}>
            <Typography variant="caption" sx={{ fontWeight: 800 }}>
              Tech Stack
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.4 }}>
              {techList.join(" • ")}
            </Typography>
          </Box>
        ) : null}

        {(repoUrl || liveUrl) && (
          <Stack direction="row" spacing={1} sx={{ pt: 0.5 }}>
            {repoUrl && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<MdLink />}
                onClick={() => window.open(repoUrl, "_blank")}
                sx={{
                borderRadius: 2,
                fontWeight: 800,
                fontSize: 12,
                px: 1.8,
                py: 0.6,
                minWidth: "110px",
                background: `linear-gradient(135deg, ${ACCENT_A}, ${ACCENT_B})`,
                color: "#07121a",
                transition: "transform 160ms ease, box-shadow 160ms ease, filter 160ms ease",
                "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 14px 34px rgba(34,197,94,0.18)",
                filter: "brightness(1.03)",
                },
                }}
              >
                Repo
              </Button>
            )}

            {liveUrl && (
              <Button
                variant="contained"
                size="small"
                startIcon={<MdLink />}
                onClick={() => window.open(liveUrl, "_blank")}
                sx={{
                  borderRadius: 2,
                  fontWeight: 800,
                  fontSize: 12,
                  px: 1.8,
                  py: 0.6,
                  minWidth: "110px",
                  background: `linear-gradient(135deg, ${ACCENT_A}, ${ACCENT_B})`,
                  color: "#07121a",
                  // ✅ hover polish
                  transition: "transform 160ms ease, box-shadow 160ms ease, filter 160ms ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 14px 34px rgba(34,197,94,0.18)",
                    filter: "brightness(1.03)",
                  },
                }}
              >
                Live
              </Button>
            )}
          </Stack>
        )}
      </Stack>
    </MotionPaper>
  );
}

async function blobDownload(url) {
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) throw new Error("Download failed");

  const blob = await res.blob();

  // Try filename from Content-Disposition
  let filename = "Resume.pdf";
  const cd = res.headers.get("content-disposition") || "";
  const match =
    cd.match(/filename\*=UTF-8''([^;]+)/i) || cd.match(/filename="([^"]+)"/i) || cd.match(/filename=([^;]+)/i);
  if (match?.[1]) {
    try {
      filename = decodeURIComponent(match[1]).replace(/["']/g, "").trim();
    } catch {
      filename = String(match[1]).replace(/["']/g, "").trim();
    }
    if (!filename.toLowerCase().endsWith(".pdf")) filename += ".pdf";
  }

  const objUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(objUrl);

  return filename;
}

function ResumePreviewDialog({ open, title, onClose, url, blobUrl, loading }) {
  const src = blobUrl || url;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: 950 }}>{title}</DialogTitle>

      {/* OUTER — REMOVE ALL SCROLLBARS */}
      <DialogContent
        sx={{
          height: 650,
          p: 0,
          overflow: "hidden",
          background: "black", // hides pdf viewer scrollbar flash
        }}
      >
        {loading ? (
          <Box sx={{ p: 2 }}>
            <Typography sx={{ opacity: 0.7 }}>Loading preview…</Typography>
          </Box>
        ) : src ? (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              overflowY: "scroll",
              overflowX: "hidden",
              position: "relative",

              /* HIDE ALL SCROLLBARS BUT KEEP SCROLL */
              scrollbarWidth: "none", // Firefox
              msOverflowStyle: "none", // Edge/IE
              "&::-webkit-scrollbar": {
                width: "0px",
                background: "transparent",
              },
            }}
          >
            {/* MASK RIGHT EDGE → hides chrome pdf scrollbar */}
            <Box
              sx={{
                position: "absolute",
                right: 0,
                top: 0,
                width: "14px",
                height: "100%",
                background: (theme) => (theme.palette.mode === "dark" ? "#000" : "#fff"),
                zIndex: 10,
                pointerEvents: "none",
              }}
            />

            <iframe
              title="Resume Preview"
              src={src}
              style={{
                width: "100%",
                height: "200%", // important: prevents iframe scrollbar
                border: "none",
                display: "block",
                overflow: "hidden",
              }}
            />
          </Box>
        ) : (
          <Box sx={{ p: 2 }}>
            <Typography sx={{ opacity: 0.7 }}>Preview not available.</Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          size="small"
          sx={{
            borderRadius: 999,
            fontWeight: 950,
            borderColor: "rgba(122,63,145,0.55)",
            color: "#c680f2",
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function Home({ toggleTheme }) {
  // ⭐ change browser tab name for viewer

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

    const { username } = useParams();
    // ⭐ Dynamic browser tab title based on URL user
useEffect(() => {
  const user = (username || "").trim();
  if (user) {
    document.title = `${user} Portfolio`;
  } else {
    document.title = "Portfolio";
  }
}, [username]);

const [loading, setLoading] = useState(true);
  const [reloadTick, setReloadTick] = useState(0);

  

  // DB data
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState(null);
  const [projects, setProjects] = useState([]);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [socials, setSocials] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [languages, setLanguages] = useState([]);

  // resume display
  const [resumeName, setResumeName] = useState("Resume.pdf");
  const [downloading, setDownloading] = useState(false);
  const [resumePreviewOpen, setResumePreviewOpen] = useState(false);
  const [resumePreviewTitle, setResumePreviewTitle] = useState("Resume Preview");
  const [resumePreviewBlobUrl, setResumePreviewBlobUrl] = useState("");
  const [resumePreviewLoading, setResumePreviewLoading] = useState(false);

  const mode = theme.palette.mode;

  const name = safeString(profile?.name) || "Your Name";
  const title = safeString(profile?.title) || "Full Stack Developer";
  const tagline = safeString(profile?.tagline) || "DB-driven portfolio with a modern viewer + admin studio.";
  const about = safeString(profile?.about) || "";
  const location = safeString(profile?.location) || "";
  const emailPublic = safeString(profile?.emailPublic) || "";

  // ✅ FIX: single source of truth for contact email
  const contactEmail = useMemo(() => {
    const ep = safeString(emailPublic).trim();
    if (ep) return ep;
    const se = safeString(socials?.email).trim();
    if (se) return se;
    return "";
  }, [emailPublic, socials?.email]);

  const reload = () => setReloadTick((x) => x + 1);

  // ✅ cache-busting for resume (updates after admin delete/primary)
  const contentVersion = useMemo(() => localStorage.getItem("content_version") || "0", [reloadTick]);
  const resumeDownloadBase = useMemo(() => downloadResumeUrl(username), [username]);
  const resumeDownloadUrlBusted = useMemo(() => {
    const joiner = resumeDownloadBase.includes("?") ? "&" : "?";
    return `${resumeDownloadBase}${joiner}v=${encodeURIComponent(contentVersion)}&t=${Date.now()}`;
  }, [resumeDownloadBase, contentVersion]);

  // ✅ FIX: use the real /view endpoint + cache bust
  const resumeViewBase = useMemo(() => viewResumeUrl(username), []);
  const resumeViewUrlBusted = useMemo(() => {
    const joiner = resumeViewBase.includes("?") ? "&" : "?";
    return `${resumeViewBase}${joiner}v=${encodeURIComponent(contentVersion)}&t=${Date.now()}`;
  }, [resumeViewBase, contentVersion]);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        setLoading(true);

        const [profRes, skillsRes, projRes, expRes, eduRes, socRes, achRes, langRes] = await Promise.all([
          getProfile(username),
          getSkills(username),
          getFeaturedProjects(username),
          getExperience(username),
          getEducation(username),
          getSocials(username),
          getAchievements(username),
          getLanguageExperience(username),
        ]);

        if (!alive) return;

        setProfile(profRes?.data || {});
        setSkills(skillsRes?.data || {});
        setProjects(Array.isArray(projRes?.data) ? projRes.data : []);
        setExperience(Array.isArray(expRes?.data) ? expRes.data : []);
        setEducation(Array.isArray(eduRes?.data) ? eduRes.data : []);
        setSocials(socRes?.data || {});
        setAchievements(Array.isArray(achRes?.data) ? achRes.data : []);
        setLanguages(Array.isArray(langRes?.data) ? langRes.data : []);

        const localName =
          localStorage.getItem("active_resume_file_name") || localStorage.getItem("resume_file_name") || "";
        if (localName) setResumeName(localName);
        else setResumeName(`${name.replace(/\s+/g, "_")}_Resume.pdf`);
      } catch {
        // keep UI clean
      } finally {
        if (alive) setLoading(false);
      }
    };

    load();
    return () => {
      alive = false;
    };
  }, [reloadTick, name]);

  // ✅ keep viewer resume in sync with Admin “push to viewer”
  useEffect(() => {
    const sync = () => {
      reload();
    };

    const onStorage = (e) => {
      if (!e) return;
      if (e.key === "content_version" || e.key === "active_resume_file_name" || e.key === "resume_file_name") {
        sync();
      }
    };

    const onVis = () => {
      if (document.visibilityState === "visible") sync();
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", sync);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", sync);
      document.removeEventListener("visibilitychange", onVis);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ SKILLS TABLE: ONLY skills categories
  const skillCategoryRows = useMemo(() => {
    const s = skills || {};
    const frontend = splitCSV(s.frontend).join(", ");
    const backend = splitCSV(s.backend).join(", ");
    const database = splitCSV(s.database).join(", ");
    const tools = splitCSV(s.tools).join(", ");

    return [
      { category: "Frontend", value: frontend || "—" },
      { category: "Backend", value: backend || "—" },
      { category: "Database", value: database || "—" },
      { category: "Tools", value: tools || "—" },
    ];
  }, [skills]);

  const onDownloadResume = async () => {
    try {
      setDownloading(true);
      const fname = await blobDownload(resumeDownloadUrlBusted);
      localStorage.setItem("active_resume_file_name", fname);
      setResumeName(fname);
    } catch {
      try {
        window.open(resumeDownloadUrlBusted, "_blank");
      } catch {}
    } finally {
      setDownloading(false);
    }
  };

  const closeResumePreview = () => {
    setResumePreviewOpen(false);
    if (resumePreviewBlobUrl) {
      try {
        URL.revokeObjectURL(resumePreviewBlobUrl);
      } catch {}
    }
    setResumePreviewBlobUrl("");
  };

  const onPreviewResume = async () => {
    try {
      setResumePreviewTitle(resumeName || "Resume Preview");
      setResumePreviewLoading(true);
      setResumePreviewOpen(true);

      const res = await fetch(resumeViewUrlBusted, { method: "GET" });
      if (!res.ok) throw new Error("Preview failed");
      const blob = await res.blob();
      const pdfBlob = new Blob([blob], { type: "application/pdf" });
      const objUrl = URL.createObjectURL(pdfBlob);
      setResumePreviewBlobUrl(objUrl);
    } catch {
      setResumePreviewBlobUrl("");
    } finally {
      setResumePreviewLoading(false);
    }
  };

  // ✅ UPDATED: make hero overlay glow look premium in BOTH modes
  const heroBg = useMemo(() => {
    return mode === "dark"
      ? "radial-gradient(1000px 600px at 10% 10%, rgba(139,92,246,0.20), transparent 55%), radial-gradient(900px 520px at 90% 20%, rgba(34,211,238,0.16), transparent 55%), radial-gradient(1000px 520px at 40% 110%, rgba(139,92,246,0.12), transparent 50%)"
      : "radial-gradient(1000px 620px at 12% 10%, rgba(122,63,145,0.16), transparent 60%), radial-gradient(980px 560px at 92% 20%, rgba(96,165,250,0.18), transparent 60%), radial-gradient(980px 520px at 45% 115%, rgba(198,128,242,0.14), transparent 58%)";
  }, [mode]);

  // ✅ FIXED: page background now switches properly for LIGHT mode
  const pageBg = useMemo(() => {
    return mode === "dark"
      ? "linear-gradient(135deg,#0f0c29,#302b63,#24243e)" // ✅ keep AdminLogin (perfect)
      : "linear-gradient(135deg,#f6f3ff,#eef5ff,#ffffff)"; // ✅ clean premium light
  }, [mode]);

  // ✅ mouse “cool” effect on hero card
  const heroRef = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const mxSpring = useSpring(mx, { stiffness: 180, damping: 20, mass: 0.4 });
  const mySpring = useSpring(my, { stiffness: 180, damping: 20, mass: 0.4 });
  const rotateY = useTransform(mxSpring, [-0.5, 0.5], [-4, 4]);
  const rotateX = useTransform(mySpring, [-0.5, 0.5], [4, -4]);

  const onHeroMove = (e) => {
    const el = heroRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / rect.width;
    const dy = (e.clientY - cy) / rect.height;
    mx.set(Math.max(-0.5, Math.min(0.5, dx)));
    my.set(Math.max(-0.5, Math.min(0.5, dy)));
  };

  const onHeroLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const iconBtnSx = {
    borderRadius: 2,
    border: "1px solid",
    transition: "transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 14px 40px rgba(0,0,0,0.14)",
      borderColor: "rgba(198,128,242,0.22)",
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        overflowX: "hidden",
        background: pageBg, // ✅ now adapts for light + dark
      }}
    >
      <Box sx={{ position: "relative", overflow: "hidden", width: "100%" }}>
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: heroBg, // ✅ now adapts for light + dark
            filter: "blur(0px)",
          }}
        />
        <Container maxWidth="lg" sx={{ py: { xs: 3.2, md: 5.2 }, position: "relative" }}>
          {/* Top Bar */}
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} sx={{ mb: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar
                sx={{
                  width: 44,
                  height: 44,
                  fontWeight: 950,
                  background: `linear-gradient(135deg, ${BRAND_PRIMARY}, ${BRAND_DARK})`,
                  color: "#0b0b0e",
                  boxShadow: "0 12px 30px rgba(122,63,145,0.25)",
                  transition: "transform 160ms ease, box-shadow 160ms ease",
                  "&:hover": { transform: "translateY(-2px)", boxShadow: "0 16px 45px rgba(122,63,145,0.28)" },
                }}
              >
                {(safeString(profile?.initials) || name || "Y").slice(0, 2).toUpperCase()}
              </Avatar>

              <Box>
                <Typography sx={{ fontWeight: 950, fontSize: 16 }}>{name}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  {title}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <Tooltip title="Reload Data">
                <IconButton
                  onClick={reload}
                  size="small"
                  sx={{
                    ...iconBtnSx,
                    borderColor: mode === "dark" ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)",
                    background: mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.75)",
                  }}
                >
                  <MdRefresh />
                </IconButton>
              </Tooltip>

              <Tooltip title={mode === "dark" ? "Light Theme" : "Dark Theme"}>
                <IconButton
                  onClick={toggleTheme}
                  size="small"
                  sx={{
                    ...iconBtnSx,
                    borderColor: mode === "dark" ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)",
                    background: mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.75)",
                  }}
                >
                  {mode === "dark" ? <MdLightMode /> : <MdDarkMode />}
                </IconButton>
              </Tooltip>

              <Tooltip title="Go to Admin">
                <IconButton
                  onClick={() => navigate(`/${username}/adminpanel`)}
                  size="small"
                  sx={{
                    ...iconBtnSx,
                    borderColor: "rgba(198,128,242,0.28)",
                    background: "rgba(198,128,242,0.10)",
                    color: BRAND_PRIMARY,
                  }}
                >
                  <MdAdminPanelSettings />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>

          {/* Hero */}
          <MotionPaper
            ref={heroRef}
            onMouseMove={onHeroMove}
            onMouseLeave={onHeroLeave}
            initial="hidden"
            animate="visible"
            variants={reveal}
            transition={{ duration: 0.45 }}
            style={{
              transformStyle: "preserve-3d",
              rotateX,
              rotateY,
            }}
            sx={{
              p: { xs: 2.2, md: 3 },
              borderRadius: 4,
              border: "1px solid",
              borderColor: mode === "dark" ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)",
              background:
                mode === "dark"
                  ? "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.03))"
                  : "linear-gradient(180deg, rgba(255,255,255,0.90), rgba(255,255,255,0.78))",
              backdropFilter: "blur(10px)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
              transition: "box-shadow 180ms ease",
              "&:hover": { boxShadow: "0 26px 70px rgba(0,0,0,0.20)" },
            }}
          >
            <Grid container spacing={2.2} alignItems="center">
              <Grid item xs={12} md={7}>
                <Typography sx={{ fontWeight: 950, fontSize: { xs: 26, md: 34 }, lineHeight: 1.15 }}>
                  {tagline}
                </Typography>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mt: 1.2, opacity: 0.9 }}>
                  {location ? (
                    <Typography variant="body2" sx={{ opacity: 0.85 }}>
                      📍 {location}
                    </Typography>
                  ) : null}
                  {emailPublic ? (
                    <Typography variant="body2" sx={{ opacity: 0.85 }}>
                      ✉️ {emailPublic}
                    </Typography>
                  ) : null}
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mt: 2 }}>
                  <Button
                    onClick={() => scrollToId("about")}
                    variant="contained"
                    size="small"
                    startIcon={<MdArrowDownward />}
                    sx={{
                      borderRadius: 999,
                      fontWeight: 950,
                      px: 2.2,
                      background: `linear-gradient(135deg, ${BRAND_PRIMARY}, ${BRAND_DARK})`,
                      color: "#0b0b0e",
                      transition: "transform 160ms ease, box-shadow 160ms ease, filter 160ms ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 14px 36px rgba(122,63,145,0.22)",
                        filter: "brightness(1.02)",
                      },
                    }}
                    fullWidth={isMobile}
                  >
                    Explore
                  </Button>

                  <Button
                    onClick={onDownloadResume}
                    variant="outlined"
                    size="small"
                    startIcon={<MdDownload />}
                    disabled={downloading}
                    sx={{
  borderRadius: 999,
  fontWeight: 950,
  px: 2.2,
  background: `linear-gradient(135deg, ${BRAND_PRIMARY}, ${BRAND_DARK})`,
  color: "#0b0b0e",
  transition: "transform 160ms ease, box-shadow 160ms ease, filter 160ms ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 14px 36px rgba(122,63,145,0.22)",
    filter: "brightness(1.02)",
  },
}}
                    fullWidth={isMobile}
                  >
                    {downloading ? "Downloading…" : `Download (${resumeName})`}
                  </Button>

                  <Button
                    onClick={onPreviewResume}
                    variant="outlined"
                    size="small"
                    startIcon={<MdVisibility />}
                    sx={{
  borderRadius: 999,
  fontWeight: 950,
  px: 2.2,
  background: `linear-gradient(135deg, ${BRAND_PRIMARY}, ${BRAND_DARK})`,
  color: "#0b0b0e",
  transition: "transform 160ms ease, box-shadow 160ms ease, filter 160ms ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 14px 36px rgba(122,63,145,0.22)",
    filter: "brightness(1.02)",
  },
}}
                    fullWidth={isMobile}
                  >
                    Preview
                  </Button>
                </Stack>
              </Grid>

              <Grid item xs={12} md={5}>
                <Stack direction="row" spacing={1} justifyContent={{ xs: "flex-start", md: "flex-end" }}>
                  <Tooltip title="GitHub">
                    <IconButton
                      onClick={() => socials?.github && window.open(socials.github, "_blank")}
                      sx={{
  borderRadius: 3,
  background: `linear-gradient(135deg, ${BRAND_PRIMARY}, ${BRAND_DARK})`,
  color: "#0b0b0e",
  boxShadow: "0 10px 30px rgba(122,63,145,0.25)",
  transition: "transform 160ms ease, box-shadow 160ms ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 16px 45px rgba(122,63,145,0.35)",
  },
}}
                    >
                      <FaGithub />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="LinkedIn">
                    <IconButton
                      onClick={() => socials?.linkedin && window.open(socials.linkedin, "_blank")}
                      sx={{
  borderRadius: 3,
  background: `linear-gradient(135deg, ${BRAND_PRIMARY}, ${BRAND_DARK})`,
  color: "#0b0b0e",
  boxShadow: "0 10px 30px rgba(122,63,145,0.25)",
  transition: "transform 160ms ease, box-shadow 160ms ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 16px 45px rgba(122,63,145,0.35)",
  },
}}
                    >
                      <FaLinkedin />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Email">
                    <IconButton
                      onClick={() => contactEmail && window.open(`mailto:${contactEmail}`, "_blank")}
                      sx={{
  borderRadius: 3,
  background: `linear-gradient(135deg, ${BRAND_PRIMARY}, ${BRAND_DARK})`,
  color: "#0b0b0e",
  boxShadow: "0 10px 30px rgba(122,63,145,0.25)",
  transition: "transform 160ms ease, box-shadow 160ms ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 16px 45px rgba(122,63,145,0.35)",
  },
}}
                    >
                      <MdEmail />
                    </IconButton>
                  </Tooltip>
                  {/* ✅ ADDED: Website icon (same style as others) */}
                      <Tooltip title="Website">
                        <IconButton
                          onClick={() => socials?.website && window.open(socials.website, "_blank")}
                          sx={{
                            borderRadius: 3,
                            background: `linear-gradient(135deg, ${BRAND_PRIMARY}, ${BRAND_DARK})`,
                            color: "#0b0b0e",
                            boxShadow: "0 10px 30px rgba(122,63,145,0.25)",
                            transition: "transform 160ms ease, box-shadow 160ms ease",
                            "&:hover": {
                              transform: "translateY(-2px)",
                              boxShadow: "0 16px 45px rgba(122,63,145,0.35)",
                            },
                          }}
                        >
                          <MdLink />
                        </IconButton>
                      </Tooltip>

                  <Tooltip title="Phone">
                    <IconButton
                      onClick={() => socials?.phone && window.open(`tel:${socials.phone}`, "_blank")}
                      sx={{
  borderRadius: 3,
  background: `linear-gradient(135deg, ${BRAND_PRIMARY}, ${BRAND_DARK})`,
  color: "#0b0b0e",
  boxShadow: "0 10px 30px rgba(122,63,145,0.25)",
  transition: "transform 160ms ease, box-shadow 160ms ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 16px 45px rgba(122,63,145,0.35)",
  },
}}
                    >
                      <MdPhone />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Grid>
            </Grid>
          </MotionPaper>

          {/* Content */}
          <Box sx={{ mt: { xs: 3.2, md: 4.2 } }}>
            {/* ABOUT */}
            <MotionBox
              id="about"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.18 }}
              variants={sectionReveal}
              transition={{ duration: 0.45 }}
              sx={{ mt: { xs: 2, md: 3 } }}
            >
              <SectionTitle title="About Me" icon={<MdSchool />} />
              <GlassCard sx={{ p: { xs: 2, md: 3 } }}>
                {loading ? (
                  <Skeleton height={120} />
                ) : (
                  <Typography sx={{ lineHeight: 1.8,textAlign: "justify", opacity: 0.9, whiteSpace: "pre-wrap" }}>{about || "—"}</Typography>
                )}
              </GlassCard>
            </MotionBox>

            {/* SKILLS TABLE */}
            <MotionBox
              id="skills"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.18 }}
              variants={sectionReveal}
              transition={{ duration: 0.45 }}
              sx={{ mt: { xs: 4, md: 6 } }}
            >
              <SectionTitle title="Skills" icon={<MdCode />} />
              <GlassCard sx={{ p: { xs: 2, md: 3 } }}>
                {loading ? (
                  <Skeleton height={160} />
                ) : (
                  <TableContainer sx={{ overflowX: "hidden" }}>
                    <Table size="small" sx={{ tableLayout: "fixed", width: "100%" }}>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 950, width: "28%" }}>Category</TableCell>
                          <TableCell sx={{ fontWeight: 950, width: "72%" }}>Skills</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {skillCategoryRows.map((r, idx) => (
                          <TableRow
                            key={idx}
                            hover
                            sx={{
                              transition: "transform 140ms ease, background-color 140ms ease",
                              "&:hover": { transform: "translateX(2px)" },
                              "& > *": { overflow: "hidden" },
                            }}
                          >
                            <TableCell
                              sx={{
                                fontWeight: 900,
                                opacity: 0.85,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {r.category}
                            </TableCell>
                            <TableCell sx={{ opacity: 0.9, overflow: "hidden" }}>{r.value}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </GlassCard>
            </MotionBox>

            {/* PROJECTS */}
            <MotionBox
              id="projects"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.12 }}
              variants={sectionReveal}
              transition={{ duration: 0.45 }}
              sx={{ mt: { xs: 4, md: 6 } }}
            >
              <SectionTitle title="Projects" icon={<MdWork />} />
              <GlassCard sx={{ p: { xs: 2, md: 3 } }}>
                {loading ? (
                  <Stack spacing={2}>
                    <Skeleton height={120} />
                    <Skeleton height={120} />
                  </Stack>
                ) : projects.length ? (
                  <Stack spacing={2}>
                    {projects.map((p, idx) => (
                      <ProjectCardOneByOne key={p?.id ?? idx} index={idx + 1} p={p} />
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" sx={{ opacity: 0.85 }}>
                    No projects yet. Add them in Admin → Projects.
                  </Typography>
                )}
              </GlassCard>
            </MotionBox>

            {/* ACHIEVEMENTS */}
            <MotionBox
              id="achievements"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.12 }}
              variants={sectionReveal}
              transition={{ duration: 0.45 }}
              sx={{ mt: { xs: 4, md: 6 } }}
            >
              <SectionTitle title="Achievements" icon={<MdEmojiEvents />} />
              <GlassCard sx={{ p: { xs: 2, md: 3 } }}>
                {loading ? (
                  <Skeleton height={140} />
                ) : achievements.length ? (
                  <Stack spacing={1.2}>
                    {achievements.map((a, idx) => (
                      <MotionPaper
                        key={a?.id ?? idx}
                        variant="outlined"
                        whileHover={{ y: -3 }}
                        transition={{ type: "spring", stiffness: 380, damping: 26 }}
                        sx={{
                          p: 2,
                          borderRadius: 3,
                          borderColor: (t) =>
                            t.palette.mode === "dark" ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)",
                          background: (t) =>
                            t.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.85)",
                          transition: "box-shadow 180ms ease, border-color 180ms ease",
                          "&:hover": {
                            boxShadow: "0 18px 55px rgba(122,63,145,0.16)",
                            borderColor: "rgba(198,128,242,0.22)",
                          },
                        }}
                      >
                        <Typography sx={{ fontWeight: 950 }}>{safeString(a?.title) || "Achievement"}</Typography>
                        <Typography variant="body2" sx={{ opacity: 0.85 }}>
                          {safeString(a?.issuer) ? `${safeString(a?.issuer)} • ` : ""}
                          {safeString(a?.year) || ""}
                        </Typography>
                        {safeString(a?.link) ? (
                          <Button
                            onClick={() => window.open(safeString(a?.link), "_blank")}
                            size="small"
                            variant="outlined"
                            startIcon={<MdLink />}
                            sx={{
                              mt: 1,
                              borderRadius: 999,
                              fontWeight: 900,
                              borderColor: "rgba(198,128,242,0.55)",
                              color: BRAND_PRIMARY,
                              transition: "transform 160ms ease, box-shadow 160ms ease",
                              "&:hover": {
                                transform: "translateY(-2px)",
                                boxShadow: "0 14px 34px rgba(198,128,242,0.16)",
                              },
                            }}
                          >
                            View
                          </Button>
                        ) : null}
                      </MotionPaper>
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" sx={{ opacity: 0.85 }}>
                    No achievements yet.
                  </Typography>
                )}
              </GlassCard>
            </MotionBox>

            {/* EXPERIENCE */}
            <MotionBox
              id="experience"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.12 }}
              variants={sectionReveal}
              transition={{ duration: 0.45 }}
              sx={{ mt: { xs: 4, md: 6 } }}
            >
              <SectionTitle title="Experience" icon={<MdTimeline />} />
              <GlassCard sx={{ p: { xs: 2, md: 3 } }}>
                {loading ? (
                  <Skeleton height={160} />
                ) : experience.length ? (
                  <Stack spacing={1.2}>
                    {experience.map((e, idx) => (
                      <MotionPaper
                        key={e?.id ?? idx}
                        variant="outlined"
                        whileHover={{ y: -3 }}
                        transition={{ type: "spring", stiffness: 380, damping: 26 }}
                        sx={{
                          p: 2,
                          borderRadius: 3,
                          borderColor: (t) =>
                            t.palette.mode === "dark" ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)",
                          background: (t) =>
                            t.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.85)",
                          transition: "box-shadow 180ms ease, border-color 180ms ease",
                          "&:hover": {
                            boxShadow: "0 18px 55px rgba(122,63,145,0.14)",
                            borderColor: "rgba(198,128,242,0.20)",
                          },
                        }}
                      >
                        <Typography sx={{ fontWeight: 950 }}>
                          {safeString(e?.role) || "Role"}{" "}
                          {safeString(e?.company) ? (
                            <Typography component="span" sx={{ opacity: 0.8, fontWeight: 900 }}>
                              • {safeString(e?.company)}
                            </Typography>
                          ) : null}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.75 }}>
                          {safeString(e?.start)} {safeString(e?.end) ? `– ${safeString(e?.end)}` : ""}
                        </Typography>
                        {safeString(e?.description) ? (
                          <Typography variant="body2" sx={{ mt: 1, opacity: 0.9, whiteSpace: "pre-wrap" }}>
                            {safeString(e?.description)}
                          </Typography>
                        ) : null}
                      </MotionPaper>
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" sx={{ opacity: 0.85 }}>
                    No experience added yet.
                  </Typography>
                )}
              </GlassCard>
            </MotionBox>

            {/* EDUCATION */}
            <MotionBox
              id="education"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.12 }}
              variants={sectionReveal}
              transition={{ duration: 0.45 }}
              sx={{ mt: { xs: 4, md: 6 } }}
            >
              <SectionTitle title="Education" icon={<MdSchool />} />
              <GlassCard sx={{ p: { xs: 2, md: 3 } }}>
                {loading ? (
                  <Skeleton height={140} />
                ) : education.length ? (
                  <Stack spacing={1.2}>
                    {education.map((e, idx) => (
                      <MotionPaper
                        key={e?.id ?? idx}
                        variant="outlined"
                        whileHover={{ y: -3 }}
                        transition={{ type: "spring", stiffness: 380, damping: 26 }}
                        sx={{
                          p: 2,
                          borderRadius: 3,
                          borderColor: (t) =>
                            t.palette.mode === "dark" ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)",
                          background: (t) =>
                            t.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.85)",
                          transition: "box-shadow 180ms ease, border-color 180ms ease",
                          "&:hover": {
                            boxShadow: "0 18px 55px rgba(122,63,145,0.14)",
                            borderColor: "rgba(198,128,242,0.20)",
                          },
                        }}
                      >
                        <Typography sx={{ fontWeight: 950 }}>{safeString(e?.degree) || "Degree"}</Typography>
                        <Typography variant="body2" sx={{ opacity: 0.85 }}>
                          {safeString(e?.institution) ? `${safeString(e?.institution)} • ` : ""}
                          {safeString(e?.year) || ""}
                        </Typography>
                        {safeString(e?.details) ? (
                          <Typography variant="body2" sx={{ mt: 1, opacity: 0.9, whiteSpace: "pre-wrap" }}>
                            {safeString(e?.details)}
                          </Typography>
                        ) : null}
                      </MotionPaper>
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" sx={{ opacity: 0.85 }}>
                    No education added yet.
                  </Typography>
                )}
              </GlassCard>
            </MotionBox>

            {/* PROGRAMMING LANGUAGES EXPERIENCE */}
            <MotionBox
              id="languages"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.12 }}
              variants={sectionReveal}
              transition={{ duration: 0.45 }}
              sx={{ mt: { xs: 4, md: 6 } }}
            >
              <SectionTitle title="Programming Languages Experience" icon={<MdCode />} />
              <GlassCard sx={{ p: { xs: 2, md: 3 } }}>
                {loading ? (
                  <Skeleton height={140} />
                ) : languages.length ? (
                  <TableContainer sx={{ overflowX: "hidden" }}>
                    <Table size="small" sx={{ tableLayout: "fixed", width: "100%" }}>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 950, width: "34%" }}>Language</TableCell>
                          <TableCell sx={{ fontWeight: 950, width: "33%" }}>Level</TableCell>
                          <TableCell sx={{ fontWeight: 950, width: "33%" }}>Experience</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {languages.map((l, idx) => (
                          <TableRow
                            key={l?.id ?? idx}
                            hover
                            sx={{
                              transition: "transform 140ms ease",
                              "&:hover": { transform: "translateX(2px)" },
                              "& > *": { overflow: "hidden" },
                            }}
                          >
                            <TableCell
                              sx={{
                                fontWeight: 900,
                                opacity: 0.85,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {safeString(l?.language) || "—"}
                            </TableCell>
                            <TableCell
                              sx={{
                                opacity: 0.85,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {safeString(l?.level) || "—"}
                            </TableCell>
                            <TableCell
                              sx={{
                                opacity: 0.85,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {typeof l?.years === "number" ? `${l.years} yr` : safeString(l?.years) || "—"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography variant="body2" sx={{ opacity: 0.85 }}>
                    No language experience added yet.
                  </Typography>
                )}
              </GlassCard>
            </MotionBox>

            {/* CONTACT */}
            <MotionBox
              id="contact"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.12 }}
              variants={sectionReveal}
              transition={{ duration: 0.45 }}
              sx={{ mt: { xs: 4, md: 6 }, pb: 6 }}
            >
              <SectionTitle title="Contact" icon={<MdEmail />} />
              <GlassCard sx={{ p: { xs: 2, md: 3 } }}>
                {loading ? (
                  <Skeleton height={120} />
                ) : (
                  <Stack spacing={1.2}>
                    {contactEmail ? (
                      <Typography
                        sx={{
                          opacity: 0.9,
                          transition: "transform 140ms ease",
                          "&:hover": { transform: "translateX(2px)" },
                          cursor: "pointer",
                        }}
                        onClick={() => window.open(`mailto:${contactEmail}`, "_blank")}
                      >
                        <MdEmail style={{ marginRight: 8, verticalAlign: "middle" }} />
                        {contactEmail}
                      </Typography>
                    ) : null}

                    {socials?.phone ? (
                      <Typography
                        sx={{
                          opacity: 0.9,
                          transition: "transform 140ms ease",
                          "&:hover": { transform: "translateX(2px)" },
                          cursor: "pointer",
                        }}
                        onClick={() => window.open(`tel:${safeString(socials.phone)}`, "_blank")}
                      >
                        <MdPhone style={{ marginRight: 8, verticalAlign: "middle" }} />
                        {safeString(socials.phone)}
                      </Typography>
                    ) : null}

                    <Stack direction="row" spacing={1}>
                      {socials?.github ? (
                        <Button
                          onClick={() => window.open(socials.github, "_blank")}
                          variant="outlined"
                          size="small"
                          startIcon={<FaGithub />}
                          sx={{
                            borderRadius: 999,
                            fontWeight: 950,
                            borderColor: "rgba(198,128,242,0.55)",
                            color: BRAND_PRIMARY,
                            transition: "transform 160ms ease, box-shadow 160ms ease",
                            "&:hover": {
                              transform: "translateY(-2px)",
                              boxShadow: "0 14px 34px rgba(198,128,242,0.16)",
                            },
                          }}
                        >
                          GitHub
                        </Button>
                      ) : null}

                      {socials?.linkedin ? (
                        <Button
                          onClick={() => window.open(socials.linkedin, "_blank")}
                          variant="outlined"
                          size="small"
                          startIcon={<FaLinkedin />}
                          sx={{
                            borderRadius: 999,
                            fontWeight: 950,
                            borderColor: "rgba(198,128,242,0.55)",
                            color: BRAND_PRIMARY,
                            transition: "transform 160ms ease, box-shadow 160ms ease",
                            "&:hover": {
                              transform: "translateY(-2px)",
                              boxShadow: "0 14px 34px rgba(198,128,242,0.16)",
                            },
                          }}
                        >
                          LinkedIn
                        </Button>
                      ) : null}
                    </Stack>
                  </Stack>
                )}
              </GlassCard>
            </MotionBox>
          </Box>

          <ResumePreviewDialog
            open={resumePreviewOpen}
            title={resumePreviewTitle}
            onClose={closeResumePreview}
            url={resumeViewUrlBusted}
            blobUrl={resumePreviewBlobUrl}
            loading={resumePreviewLoading}
          />
        </Container>
      </Box>
    </Box>
  );
}
