import React from "react";
import { Box, Container, Paper, Typography } from "@mui/material";
import { motion } from "framer-motion";

const MotionPaper = motion(Paper);

export default function Blog() {
  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container>
        <Typography variant="h3" sx={{ fontWeight: 1000 }}>
          Blog
        </Typography>
        <Typography sx={{ opacity: 0.85, mt: 1, maxWidth: 760 }}>
          Blog is optional but it makes your portfolio look more professional. If you don’t have posts now,
          we’ll keep it “Coming soon” and later connect DB.
        </Typography>

        <MotionPaper
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          variant="outlined"
          sx={{
            mt: 3,
            p: 3,
            borderRadius: 4,
            backdropFilter: "blur(16px)",
            background: (t) =>
              t.palette.mode === "dark"
                ? "rgba(255,255,255,0.03)"
                : "rgba(0,0,0,0.02)",
          }}
        >
          <Typography sx={{ fontWeight: 1000 }}>Coming soon</Typography>
          <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.7 }}>
            Next we will add: categories, post cards, and a clean reader page with smooth transitions.
          </Typography>
        </MotionPaper>
      </Container>
      <Box sx={{ height: 60 }} />
    </Box>
  );
}
