import {
  Container,
  Stack,
  Button,
  TextField,
  CircularProgress,
  Typography,
  Link,
} from "@mui/material";
import { Box } from "@mui/system";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Auth } from "aws-amplify";
import { useState } from "react";
import { useRouter } from "next/router";
import NextLink from "next/link";

type Inputs = {
  email: string;
};

const schema = yup
  .object({
    email: yup.string().email().required(),
  })
  .required();

const ForgotPassword = () => {
  const [isLoading, setisLoading] = useState(false);
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
      setisLoading(true);
      await Auth.forgotPassword(data.email);
      push(`/confirmPassword/${data.email}`);
    } catch (error) {
      console.error("error sending code: ", error.message);
      if (error.message) {
        setError("email", { message: error.message });
      }
      setisLoading(false);
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
            type="text"
            error={!!errors.email}
            helperText={
              errors.email ? (
                errors.email.message ===
                "Cannot reset password for the user as there is no registered/verified email or phone_number" ? (
                  <Typography
                    variant="caption"
                    style={{
                      marginTop: "0.25rem",
                    }}
                  >
                    {errors.email.message}.{" "}
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

          <Button
            type="submit"
            variant="outlined"
            style={{
              marginBottom: "20px",
            }}
          >
            {isLoading ? <CircularProgress /> : "Send the verification code"}
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
