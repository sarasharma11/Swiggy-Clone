import * as React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import Alert from "@mui/material/Alert";
import FormHelperText from "@mui/material/FormHelperText";

// for time
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import TimePicker from "@mui/lab/TimePicker";

import axios from "axios";

export default function Profile() {
  const [contact, setContact] = React.useState("");
  const [shopName, setShopName] = React.useState("");
  const [managerName, setManagerName] = React.useState("");
  const [openTime, setOpenTime] = React.useState(Date.now());
  const [closeTime, setCloseTime] = React.useState(Date.now());
  const [batch, setBatch] = React.useState("");
  const [age, setAge] = React.useState("");
  const [name, setName] = React.useState("");
  const [user, setUser] = React.useState({ details: "" });
  const [error, setError] = React.useState({});

  let id = localStorage.getItem("userid");

  const navigate = useNavigate();

  React.useEffect(() => {
    axios
      .post("/api/users/getUser", { id: id })
      .then((res) => {
        setUser(res.data);
        setContact(res.data.details.contact);

        if (res.data.role == "buyer") {
          setBatch(res.data.details.batch);
          setAge(res.data.details.age);
          setName(res.data.details.name);
        } else {
          setShopName(res.data.details.shopName);
          setManagerName(res.data.details.managerName);
          setOpenTime(res.data.details.openTime);
          setCloseTime(res.data.details.closeTime);
        }
      })
      .catch((err) => {
        setError(JSON.parse(err.request.response));
      });
  }, [id]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const userDetails = {
      contact: contact,
      email: user.details.email,
      role: user.role,
    };
    if (user.role === "vendor") {
      userDetails.shopName = shopName;
      userDetails.managerName = managerName;
      userDetails.closeTime = closeTime;
      userDetails.openTime = openTime;
    } else if (user.role === "buyer") {
      userDetails.name = name;
      userDetails.age = age;
      userDetails.batch = batch;
      userDetails.wallet = user.wallet;
    }
    console.log(userDetails);
    axios
      .post("/api/users/edit", userDetails)
      .then((res) => {
        console.log("changes made");
      })
      .catch((err) => {
        setError(JSON.parse(err.request.response));
      });
  };
  return (
    <>
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Box component="form" noValidate sx={{ mt: 3 }}>
          <Paper
            variant="outlined"
            sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
          >
            <Typography component="h1" variant="h4" align="center">
              Profile
            </Typography>
            {error.user && <Alert color="error">{error.user}</Alert>}
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormHelperText>Email</FormHelperText>

                <TextField
                  disabled
                  fullWidth
                  id="email"
                  value={user.details.email}
                  name="email"
                  variant="standard"
                />
              </Grid>
              {user.role == "vendor" ? (
                <>
                  <Grid item xs={12}>
                    <FormHelperText>Manager Name</FormHelperText>

                    <TextField
                      required
                      fullWidth
                      id="managerName"
                      value={managerName}
                      name="managerName"
                      variant="standard"
                      onChange={(e) => {
                        setManagerName(e.target.value);
                      }}
                    />
                    {error.managerName && (
                      <Alert color="error">{error.managerName}</Alert>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <FormHelperText>Shop Name</FormHelperText>

                    <TextField
                      required
                      fullWidth
                      value={shopName}
                      id="shopName"
                      name="shopName"
                      variant="standard"
                      onChange={(e) => {
                        setShopName(e.target.value);
                      }}
                    />
                    {error.shopName && (
                      <Alert color="error">{error.shopName}</Alert>
                    )}
                  </Grid>
                </>
              ) : (
                <Grid item xs={12}>
                  <FormHelperText>Name</FormHelperText>

                  <TextField
                    required
                    fullWidth
                    id="name"
                    value={name}
                    name="name"
                    variant="standard"
                    autoComplete="name"
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                  {error.name && <Alert color="error">{error.name}</Alert>}
                </Grid>
              )}
              <Grid item xs={12}>
                <FormHelperText>Contact</FormHelperText>

                <TextField
                  required
                  fullWidth
                  id="contact"
                  value={contact}
                  variant="standard"
                  name="contact"
                  onChange={(e) => {
                    setContact(e.target.value);
                  }}
                />
                {error.contact && <Alert color="error">{error.contact}</Alert>}
              </Grid>
              {user.role == "buyer" ? (
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
                        onChange={(e) => {
                          setBatch(e.target.value);
                        }}
                      >
                        <MenuItem value={"UG1"}>UG1</MenuItem>
                        <MenuItem value={"UG2"}>UG2</MenuItem>
                        <MenuItem value={"UG3"}>UG3</MenuItem>
                        <MenuItem value={"UG4"}>UG4</MenuItem>
                        <MenuItem value={"UG5"}>UG5</MenuItem>
                      </Select>
                    </FormControl>
                    <Grid />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormHelperText>Age</FormHelperText>

                    <TextField
                      name="age"
                      variant="standard"
                      value={age}
                      required
                      fullWidth
                      id="age"
                      onChange={(e) => {
                        setAge(e.target.value);
                      }}
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
          </Paper>
          <Button variant="contained" onClick={handleSubmit}>
            Save
          </Button>
        </Box>
        <Button
          variant="contained"
          onClick={() => {
            if (user.role == "buyer") navigate("/buyer");
            else navigate("/vendor");
          }}
        >
          Back
        </Button>
      </Container>
    </>
  );
}
