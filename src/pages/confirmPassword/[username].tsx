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
  code: string;
  password: string;
  repassword: string;
};

const schema = yup
  .object({
    code: yup.string().required(),
    password: yup
      .string()
      .required()
      .min(8)
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "password must contain at least 1 lowercase, 1 uppercase, 1 numeric and 1 special character"
      ),
    repassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match"),
  })
  .required();

const ConfirmPassword = ({}) => {
  const [isLoading, setisLoading] = useState(false);
  const {
    push,
    query: { username },
  } = useRouter();
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
      await Auth.forgotPasswordSubmit(
        username as string,
        data.code,
        data.password
      );
      push("/login");
    } catch (error) {
      console.error("error confirming password", error.message);
      if (error.message) {
        setError("code", { message: error.message });
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
        <Typography textAlign="center">
          We have sent the verification code to
        </Typography>
        <Typography textAlign="center" fontWeight="bold" mb={2}>
          {username}
        </Typography>
        <Stack spacing={2}>
          <TextField
            {...register("code")}
            variant="outlined"
            label="Verification code"
            required
            type="text"
            error={!!errors.code}
            helperText={errors.code ? errors.code.message : null}
          />
          <Typography
            variant="caption"
            style={{
              marginTop: "0.25rem",
            }}
          >
            <NextLink passHref href="/send/forgotPassword">
              <Link underline="none">Resend the verification code</Link>
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

          <TextField
            {...register("repassword")}
            variant="outlined"
            label="Confirm password"
            required
            type="password"
            error={!!errors.repassword}
            helperText={errors.repassword ? errors.repassword.message : null}
          />

          <Button
            type="submit"
            variant="outlined"
            style={{
              marginBottom: "20px",
            }}
          >
            {isLoading ? <CircularProgress /> : "Change password"}
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default ConfirmPassword;
