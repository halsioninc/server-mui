import Image from "next/image";
import { styled, Box } from "server-mui";
import NextLink from "next/link";

const Typography = styled("h1")(({ variant }: { variant?: string }) => ({}));
const Container = styled("div")(({ maxWidth }: { maxWidth: string }) => ({}));

export default function Home() {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          my: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" sx={{ mb: 2 }}>
          Material UI - Next.js App Router example in TypeScript
        </Typography>
        <Box sx={{ p: 3, color: { xs: "primary.main", lg: "secondary.main" } }}>
          This text color depends on the breakpoint
        </Box>
        <Box
          component={NextLink}
          href="/about"
          sx={{ color: "secondary.main", m: 3 }}
        >
          <Box
            component={Image}
            aria-hidden
            src="/globe.svg"
            alt="A box Image"
            width={16}
            height={16}
            sx={{
              p: (theme) => theme.spacing(2),
              border: (theme) => `1px solid ${theme.palette.primary.light}`,
            }}
          />
          <Typography sx={{ m: 2 }}> A styled link </Typography>
        </Box>
      </Box>
    </Container>
  );
}
