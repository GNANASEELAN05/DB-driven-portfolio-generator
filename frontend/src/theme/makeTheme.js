import { createTheme } from "@mui/material/styles";

export const makeTheme = (mode) =>
  createTheme({
    palette: { mode },
    shape: { borderRadius: 14 },
    typography: {
      fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial",
    },
  });
