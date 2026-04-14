import type { Components, Theme } from "@mui/material/styles";

export const components: Components<Theme> = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        scrollBehavior: "smooth",
      },
    },
  },
  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
    styleOverrides: {
      root: {
        borderRadius: 8,
        padding: "8px 20px",
        fontWeight: 600,
      },
      sizeSmall: {
        padding: "6px 14px",
        fontSize: "0.8125rem",
      },
      sizeLarge: {
        padding: "12px 28px",
        fontSize: "1rem",
      },
      outlined: {
        borderWidth: 1.5,
        "&:hover": {
          borderWidth: 1.5,
        },
      },
    },
  },
  MuiCard: {
    defaultProps: {
      variant: "outlined",
    },
    styleOverrides: {
      root: {
        borderRadius: 12,
        borderColor: "#E2E8F0",
        boxShadow: "none",
        "&:hover": {
          borderColor: "#CBD5E1",
        },
      },
    },
  },
  MuiCardContent: {
    styleOverrides: {
      root: {
        padding: "16px 24px",
        "&:last-child": {
          paddingBottom: 20,
        },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 6,
        fontWeight: 600,
        fontSize: "0.75rem",
      },
      sizeSmall: {
        height: 24,
      },
    },
  },
  MuiTextField: {
    defaultProps: {
      variant: "outlined",
      size: "small",
      fullWidth: true,
    },
    styleOverrides: {
      root: {
        "& .MuiOutlinedInput-root": {
          borderRadius: 8,
        },
      },
    },
  },
  MuiAppBar: {
    defaultProps: {
      elevation: 0,
      color: "inherit",
    },
    styleOverrides: {
      root: {
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #E2E8F0",
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        padding: "12px 16px",
        borderColor: "#F1F5F9",
      },
      head: {
        fontWeight: 600,
        fontSize: "0.8125rem",
        color: "#64748B",
        backgroundColor: "#F8FAFC",
      },
    },
  },
  MuiAvatar: {
    styleOverrides: {
      root: {
        fontSize: "0.875rem",
        fontWeight: 600,
      },
    },
  },
};
