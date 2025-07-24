import * as React from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import AddItem from "../addFood";
import ItemCard from "../item-card";

export default function VendorDashboard(prop) {
  let id = localStorage.getItem("userid");
  const [userFood, setUserFood] = React.useState([]);
  const [showAdd, setShowAdd] = React.useState(false);
  const [errorFood, setErrorFood] = React.useState("");

  const navigate = useNavigate();

  React.useEffect(() => {
    axios
      .post("/api/food/getFood", { id: id })
      .then((res) => {
        setUserFood(res.data);
      })
      .catch((err) => {
        setErrorFood(JSON.parse(err.request.response));
      });
  }, [id, showAdd]);

  const onDelete = (foodId) => {
    setUserFood(userFood.filter((userFood) => userFood._id !== foodId));
  };

  return (
    <>
      <Box
        sx={{
          marginTop: 3,
          marginRight: 10,
          marginLeft: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* <Container> */}

        <Grid container>
          <Grid item xs={12} sm={8} md={10}>
            <Grid container>
              <Button
                variant="contained"
                onClick={() => {
                  setShowAdd(!showAdd);
                }}
              >
                Add Item
              </Button>
            </Grid>
            {showAdd && <AddItem showAdd={showAdd} setShowAdd={setShowAdd} />}
            {errorFood && <Alert color="error">{errorFood}</Alert>}

            <Container>
              <Grid container spacing={4}>
                {userFood.map((card) => (
                  <Grid item key={card._id} xs={12} sm={6} md={3}>
                    <ItemCard card={card} onDelete={onDelete} />
                  </Grid>
                ))}
              </Grid>
            </Container>
          </Grid>
          <Grid item xs={12} sm={4} md={2} sx={{ paddingTop: 2 }}>
            <Grid>
              <Button
                variant="contained"
                onClick={() => {
                  navigate("/order-vendor");
                }}
              >
                My Orders
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  navigate("/profile");
                }}
              >
                My Profile
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  navigate("/stats");
                }}
              >
                My Stats
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      {/* </Container> */}
    </>
  );
}
