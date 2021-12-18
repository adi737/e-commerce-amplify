import { Container, Stack, Button, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";

type Inputs = {
  email: string;
  password: string;
  repassword: string;
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
    repassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match"),
  })
  .required();

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(schema),
  });

  const handleOnSubmit = (data: Inputs) => {
    console.log(data);
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
            helperText={errors.email ? errors.email.message : null}
          />

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
            Sign up
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default Register;
