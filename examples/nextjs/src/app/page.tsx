import Image from "next/image";
import { styled, Box, Stack, Container, Grid } from "server-mui";
import NextLink from "next/link";

const Typography = styled("h1")(({ variant }: { variant?: string }) => ({}));

export default function Home() {
  return (
    <Container maxWidth="lg">
      <Stack
        sx={{
          my: 4,
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
        <Grid
          container
          spacing={{ xs: 2, md: 4 }}
          direction={{ xs: "column", md: "row" }}
          sx={{ width: "100%" }}
        >
          <Grid size={{ xs: 12, md: 6 }}>Parallel Item 1</Grid>
          <Grid size={{ xs: 12, md: 6 }}>Parallel Item 2</Grid>
        </Grid>
        <Grid container sx={{ width: "100%" }}>
          <Grid size="auto">Auto-sized</Grid>
          <Grid size="grow">Fill space</Grid>
          <Grid size={6}>6 columns</Grid>
        </Grid>
      </Stack>
    </Container>
  );
}
