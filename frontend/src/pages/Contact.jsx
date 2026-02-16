import React from "react";
import { Box, Button, Container, Grid, Paper, Stack, TextField, Typography } from "@mui/material";
import { motion } from "framer-motion";

const MotionPaper = motion(Paper);

export default function Contact() {
  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container>
        <Typography variant="h3" sx={{ fontWeight: 1000 }}>
          Contact
        </Typography>
        <Typography sx={{ opacity: 0.85, mt: 1, maxWidth: 760 }}>
          A clean contact form looks very professional. Later we will connect it to DB and Admin messages.
        </Typography>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} md={7}>
            <MotionPaper
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6 }}
              variant="outlined"
              sx={{
                p: 2.5,
                borderRadius: 4,
                backdropFilter: "blur(16px)",
                background: (t) =>
                  t.palette.mode === "dark"
                    ? "rgba(255,255,255,0.03)"
                    : "rgba(0,0,0,0.02)",
              }}
            >
              <Stack spacing={2}>
                <TextField label="Your Name" fullWidth />
                <TextField label="Email" fullWidth />
                <TextField label="Message" multiline rows={4} fullWidth />
                <Button
                  variant="contained"
                  sx={{
                    fontWeight: 900,
                    borderRadius: 3,
                    py: 1.2,
                    background:
                      "linear-gradient(135deg, rgba(124,58,237,0.95), rgba(6,182,212,0.95))",
                  }}
                >
                  Send
                </Button>
              </Stack>
            </MotionPaper>
          </Grid>

          <Grid item xs={12} md={5}>
            <MotionPaper
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              variant="outlined"
              sx={{
                p: 2.5,
                borderRadius: 4,
                height: "100%",
                backdropFilter: "blur(16px)",
                background: (t) =>
                  t.palette.mode === "dark"
                    ? "rgba(255,255,255,0.03)"
                    : "rgba(0,0,0,0.02)",
              }}
            >
              <Typography sx={{ fontWeight: 1000 }}>Connect</Typography>
              <Typography variant="body2" sx={{ opacity: 0.85, mt: 1 }}>
                Add your LinkedIn / GitHub / email here with icons. Looks premium on mobile too.
              </Typography>

              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  borderRadius: 4,
                  border: (t) => `1px solid ${t.palette.divider}`,
                }}
              >
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Email: yourmail@example.com
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.7 }}>
                  GitHub: github.com/yourname
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.7 }}>
                  LinkedIn: linkedin.com/in/yourname
                </Typography>
              </Box>
            </MotionPaper>
          </Grid>
        </Grid>
      </Container>
      <Box sx={{ height: 60 }} />
    </Box>
  );
}
