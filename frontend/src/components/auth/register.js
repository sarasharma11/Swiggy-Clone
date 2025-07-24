import * as React from "react";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
import Details from "./details";

export default function SignUp() {
  const [role, setRole] = React.useState("buyer");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setPassword2] = React.useState("");

  const handleChange = (event) => {
    setRole(event.target.value);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box>
          {/* <Box component="form" sx={{ mt: 3 }}> */}
          {/* <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}> */}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="confirm-password"
                label="Confirm Password"
                value={confirmPassword}
                type="password"
                id="conform-password"
                onChange={(e) => {
                  setPassword2(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-required-label">
                  Role
                </InputLabel>
                <Select
                  labelId="demo-simple-select-required-label"
                  id="demo-simple-select-required"
                  name="role"
                  value={role}
                  label="Role"
                  onChange={handleChange}
                >
                  <MenuItem value={"buyer"}>Buyer</MenuItem>
                  <MenuItem value={"vendor"}>Vendor</MenuItem>
                </Select>
                <FormHelperText>Required</FormHelperText>
              </FormControl>
              <Grid />
            </Grid>
            {role === "vendor" ? (
              <Details
                role="vendor"
                password={password}
                confirmPassword={confirmPassword}
                email={email}
              />
            ) : (
              <Details
                role="buyer"
                password={password}
                confirmPassword={confirmPassword}
                email={email}
              />
            )}
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
