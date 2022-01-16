import { Container, Link, Typography } from "@mui/material";
import NextLink from "next/link";

export default function FourOhFour() {
  return (
    <Container
      component="main"
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center",
      }}
    >
      <Typography variant="h4">404 - Page Not Found</Typography>
      <NextLink passHref href="/">
        <Link>Go back home</Link>
      </NextLink>
    </Container>
  );
}
