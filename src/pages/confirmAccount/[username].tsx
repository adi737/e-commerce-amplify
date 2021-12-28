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
};

const schema = yup
  .object({
    code: yup.string().required(),
  })
  .required();

const ConfirmAccount = ({}) => {
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
      await Auth.confirmSignUp(username as string, data.code);
      push("/login");
    } catch (error) {
      console.error("error confirming sign up", error.message);
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
            <NextLink passHref href="/send/signUp">
              <Link underline="none">Resend the verification code</Link>
            </NextLink>
          </Typography>

          <Button
            type="submit"
            variant="outlined"
            style={{
              marginBottom: "20px",
            }}
          >
            {isLoading ? <CircularProgress /> : "Confirm code"}
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default ConfirmAccount;
