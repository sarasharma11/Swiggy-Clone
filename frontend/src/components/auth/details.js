import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
import { Link, useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";

// for time
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import TimePicker from "@mui/lab/TimePicker";

import axios from "axios";

export default function Details(prop) {
  const navigate = useNavigate();
  const [error, setError] = React.useState({});
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    if (prop.role === "vendor") {
      const newVendor = {
        role: "vendor",
        email: prop.email,
        password: prop.password,
        password2: prop.confirmPassword,
        contact: data.get("contact"),
        shopName: data.get("shopName"),
        managerName: data.get("managerName"),
        closeTime: closeTime,
        openTime: openTime,
      };

      axios
        .post("/api/users/register", newVendor)
        .then((res) => {
          localStorage.setItem("userid", res.data.id);

          navigate("/vendor");
        })
        .catch((err) => {
          setError(JSON.parse(err.request.response));
        });
    } else if (prop.role === "buyer") {
      const newBuyer = {
        role: "buyer",
        email: prop.email,
        password: prop.password,
        password2: prop.confirmPassword,
        contact: data.get("contact"),
        name: data.get("name"),
        age: data.get("age"),
        batch: data.get("batch"),
        wallet: 0,
      };
      axios
        .post("/api/users/register", newBuyer)
        .then((res) => {
          localStorage.setItem("userid", res.data.id);
          navigate("/buyer");
        })
        .catch((err) => {
          setError(JSON.parse(err.request.response));
        });
    }
  };

  const role = prop.role;
  const [batch, setBatch] = React.useState("");
  const [closeTime, setCloseTime] = React.useState(null);
  const [openTime, setOpenTime] = React.useState(null);
  const handleChange = (event) => {
    setBatch(event.target.value);
  };
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {(error.email || error.password) && (
          <Alert color="error">
            {error.email}
            {error.password}
          </Alert>
        )}

        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            {role === "vendor" ? (
              <>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="managerName"
                    label="Manager Name"
                    name="managerName"
                  />
                  {error.managerName && (
                    <Alert color="error">{error.managerName}</Alert>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="shopName"
                    label="Shop Name"
                    name="shopName"
                  />
                  {error.shopName && (
                    <Alert color="error">{error.shopName}</Alert>
                  )}
                </Grid>
              </>
            ) : (
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  name="name"
                  autoComplete="name"
                />
                {error.name && <Alert color="error">{error.name}</Alert>}
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="contact"
                label="Contact Number"
                name="contact"
              />
              {error.contact && <Alert color="error">{error.contact}</Alert>}
            </Grid>
            {role == "buyer" ? (
              <>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-required-label">
                      Batch
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-required-label"
                      id="demo-simple-select-required"
                      name="batch"
                      value={batch}
                      label="Batch"
                      onChange={handleChange}
                    >
                      <MenuItem value={"UG1"}>UG1</MenuItem>
                      <MenuItem value={"UG2"}>UG2</MenuItem>
                      <MenuItem value={"UG3"}>UG3</MenuItem>
                      <MenuItem value={"UG4"}>UG4</MenuItem>
                      <MenuItem value={"UG5"}>UG5</MenuItem>
                    </Select>
                    <FormHelperText>Required</FormHelperText>
                    {error.batch && <Alert color="error">{error.batch}</Alert>}
                  </FormControl>
                  <Grid />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="age"
                    required
                    fullWidth
                    id="age"
                    label="Age"
                  />
                  {error.age && <Alert color="error">{error.age}</Alert>}
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs={12}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <TimePicker
                      label="Open Time"
                      name="openingTime"
                      value={openTime}
                      onChange={(newOpenTime) => {
                        setOpenTime(newOpenTime);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                  {error.openTime && (
                    <Alert color="error">{error.openTime}</Alert>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <TimePicker
                      label="Close Time"
                      value={closeTime}
                      name="closingTime"
                      onChange={(newCloseTime) => {
                        setCloseTime(newCloseTime);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                  {error.closeTime && (
                    <Alert color="error">{error.closeTime}</Alert>
                  )}
                </Grid>
              </>
            )}
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
