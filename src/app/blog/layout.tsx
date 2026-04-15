import Box from "@mui/material/Box";
import { SiteHeader } from "@/components/layout/site-header";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <Box sx={{ pt: { xs: "60px", sm: "68px" } }}>{children}</Box>
    </>
  );
}
