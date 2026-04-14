import type { MDXComponents } from "mdx/types";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import { BlogCTA } from "@/components/blog/blog-cta";

const TEAL = "#0D9488";
const CODE_BG = "#0F172A";

export const mdxComponents: MDXComponents = {
  BlogCTA,

  h1: (props) => (
    <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, mt: 4 }} {...props} />
  ),
  h2: (props) => (
    <Typography
      variant="h4"
      component="h2"
      gutterBottom
      sx={{ fontWeight: 700, mt: 4, mb: 1.5 }}
      {...props}
    />
  ),
  h3: (props) => (
    <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600, mt: 3, mb: 1 }} {...props} />
  ),
  h4: (props) => (
    <Typography variant="h6" component="h4" gutterBottom sx={{ fontWeight: 600, mt: 2 }} {...props} />
  ),

  p: (props) => <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }} {...props} />,

  ul: (props) => <Box component="ul" sx={{ pl: 3, mb: 2, "& li": { mb: 0.5 } }} {...props} />,
  ol: (props) => <Box component="ol" sx={{ pl: 3, mb: 2, "& li": { mb: 0.5 } }} {...props} />,
  li: (props) => <Typography component="li" variant="body1" sx={{ lineHeight: 1.8 }} {...props} />,

  blockquote: (props) => (
    <Box
      component="blockquote"
      sx={{
        borderLeft: 4,
        borderColor: TEAL,
        pl: 2.5,
        py: 1,
        my: 2,
        bgcolor: "action.hover",
        borderRadius: "0 8px 8px 0",
        "& p": { mb: 0, fontStyle: "italic" },
      }}
      {...props}
    />
  ),

  hr: () => <Divider sx={{ my: 4 }} />,

  a: (props) => (
    <Box
      component="a"
      sx={{
        color: "primary.main",
        textDecoration: "none",
        fontWeight: 500,
        "&:hover": { textDecoration: "underline" },
      }}
      target={props.href?.startsWith("http") ? "_blank" : undefined}
      rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    />
  ),

  code: (props) => (
    <Box
      component="code"
      sx={{
        bgcolor: "action.hover",
        px: 0.8,
        py: 0.3,
        borderRadius: 0.5,
        fontSize: "0.875em",
        fontFamily: "var(--font-geist-mono)",
      }}
      {...props}
    />
  ),

  pre: (props) => (
    <Box
      component="pre"
      sx={{
        bgcolor: CODE_BG,
        color: "#e2e8f0",
        p: 2.5,
        borderRadius: 2,
        overflowX: "auto",
        my: 2,
        fontSize: "0.875rem",
        lineHeight: 1.6,
        fontFamily: "var(--font-geist-mono)",
        "& code": {
          bgcolor: "transparent",
          p: 0,
          borderRadius: 0,
          fontSize: "inherit",
          color: "inherit",
        },
      }}
      {...props}
    />
  ),

  table: (props) => (
    <TableContainer component={Paper} variant="outlined" sx={{ my: 2 }}>
      <Table size="small" {...props} />
    </TableContainer>
  ),
  thead: (props) => <TableHead {...props} />,
  tbody: (props) => <TableBody {...props} />,
  tr: (props) => <TableRow hover {...props} />,
  th: (props) => <TableCell sx={{ fontWeight: 600 }} {...props} />,
  td: (props) => <TableCell {...props} />,

  img: (props) => (
    <Box
      component="img"
      sx={{ maxWidth: "100%", height: "auto", borderRadius: 2, my: 2 }}
      alt=""
      {...props}
    />
  ),

  strong: (props) => <Box component="strong" sx={{ fontWeight: 600 }} {...props} />,
};
