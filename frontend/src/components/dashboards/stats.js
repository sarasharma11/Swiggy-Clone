import * as React from "react";
import axios from "axios";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import { Grid } from "@mui/material";

export default function Stats() {
  const navigate = useNavigate();
  let id = localStorage.getItem("userid");

  const [details, setDetails] = React.useState({
    foodItems: [],
    completedOrders: 0,
    ordersPlaced: 0,
    pendingOrders: 0,
  });

  React.useEffect(() => {
    axios
      .post("/api/food/stats", { id: id })
      .then((res) => {
        setDetails(res.data);
      })
      .catch((err) => {
        console.log(err.request.response);
      });
  }, []);

  const rows = ["item1", "item2", "item3", "item4", "item5"];
  return (
    <Container>
      <Button
        variant="contained"
        onClick={() => {
          navigate("/vendor/");
        }}
      >
        Back
      </Button>
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography component="h1" variant="h4">
              Top 5 Items
            </Typography>
            {details.foodItems.map((row) => (
              <Typography component="h1" variant="h5" key={row}>
                {row}
              </Typography>
            ))}
          </Grid>
          <Grid item xs={12}>
            <Typography component="h1" variant="h4">
              Counts
            </Typography>
            <Typography component="h3" variant="h6">
              Orders Placed: {details.ordersPlaced}
            </Typography>
            <Typography component="h3" variant="h6">
              Pending Orders: {details.pendingOrders}
            </Typography>
            <Typography component="h3" variant="h6">
              Completed Orders: {details.completedOrders}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
