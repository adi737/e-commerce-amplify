import { yupResolver } from "@hookform/resolvers/yup";
import {
  Container,
  Stack,
  Button,
  TextField,
  Link,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Box } from "@mui/system";
import { Auth } from "aws-amplify";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import NextLink from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";

type Inputs = {
  email: string;
  password: string;
};

const schema = yup
  .object({
    email: yup.string().email().required(),
    password: yup
      .string()
      .required()
      .min(8)
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "password must contain at least 1 lowercase, 1 uppercase, 1 numeric and 1 special character"
      ),
  })
  .required();

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { push } = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<Inputs>({
    resolver: yupResolver(schema),
  });

  const handleOnSubmit = async (data: Inputs) => {
    try {
      setIsLoading(true);
      await Auth.signIn({
        username: data.email,
        password: data.password,
      });
      push("/");
    } catch (error) {
      console.error("error signing in", error.message);
      if (error.message) {
        setError("email", { message: error.message });
      }
      setIsLoading(false);
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <Box component="form" onSubmit={handleSubmit(handleOnSubmit)}>
        <Stack spacing={2}>
          <TextField
            {...register("email")}
            variant="outlined"
            label="Email adress"
            required
            type="email"
            error={!!errors.email}
            helperText={
              errors.email ? (
                errors.email.message === "User is not confirmed." ? (
                  <Typography
                    variant="caption"
                    style={{
                      marginTop: "0.25rem",
                    }}
                  >
                    {errors.email.message}{" "}
                    <NextLink passHref href="/send/signUp">
                      <Link>Resend the verification code</Link>
                    </NextLink>
                  </Typography>
                ) : (
                  errors.email.message
                )
              ) : null
            }
          />
          <Typography
            variant="caption"
            style={{
              marginTop: "0.25rem",
            }}
          >
            {`Don't have an account yet?`}{" "}
            <NextLink passHref href="/register">
              <Link underline="none">Sign up</Link>
            </NextLink>
          </Typography>

          <TextField
            {...register("password")}
            variant="outlined"
            label="Password"
            required
            type="password"
            error={!!errors.password}
            helperText={errors.password ? errors.password.message : null}
          />
          <Typography
            variant="caption"
            style={{
              marginTop: "0.25rem",
            }}
          >
            Forgot your password?{" "}
            <NextLink passHref href="/send/forgotPassword">
              <Link underline="none">Reset password</Link>
            </NextLink>
          </Typography>

          <Button
            type="submit"
            variant="outlined"
            style={{
              marginBottom: "20px",
            }}
          >
            {isLoading ? <CircularProgress /> : "Sign in"}
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default Login;
