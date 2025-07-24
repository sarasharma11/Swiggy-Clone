import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Rating from '@mui/material/Rating';

const status = {
  0: "Placed",
  1: "Accepted",
  2: "Cooking",
  3: "Ready for Pickup",
  4: "Completed",
  5: "Rejected",
};

export default function OrderBuyer({ userDetails }) {
  const navigate = useNavigate();
  const [orders, setOrders] = React.useState([]);
  const [error, setErrors] = React.useState({});
  const [rating, setRating] = React.useState(0);
  const id = localStorage.getItem("userid");
  React.useEffect(() => {
    axios
      .post("/api/food/getOrders", { id: id, role: "buyer" })
      .then((res) => {
        console.log(res.data);
        setOrders(res.data);
      })
      .catch((err) => {
        setErrors(err.response);
      });
  }, [id]);

  const onPickup = (order) => {
    if (order.status < 4) {
      axios
        .post("/api/food/changeStatus", { id: order.id, pickup: true })
        .then((res) => {
          let index = orders.findIndex((orderItem) => order.id == orderItem.id);
          setOrders([
            ...orders.slice(0, index),
            { ...orders[index], status: orders[index].status + 1 },
            ...orders.slice(index + 1),
          ]);
        })
        .catch((err) => {
          setErrors(err.response);
        });
    }
  };

  return (
    <Container>
      <Button
        variant="contained"
        onClick={() => {
          navigate("/buyer/");
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
        <Typography component="h1" variant="h5">
          Orders
        </Typography>
        {error.display && <Alert color="error">{error.display}</Alert>}

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Placed Time</TableCell>
              <TableCell>Vendor Name</TableCell>
              <TableCell>Food Item</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Add Ons</TableCell>
              <TableCell>Cost</TableCell>
              <TableCell>Rating</TableCell>

              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{moment(row.placedTime).format("LT")}</TableCell>
                <TableCell>{row.vendorName}</TableCell>
                <TableCell>{row.foodItem}</TableCell>
                <TableCell>{row.quantity}</TableCell>
                <TableCell>
                  {row.addOns.map((addOn, i) => (
                    <li key={i}>{addOn.label}</li>
                  ))}
                </TableCell>
                <TableCell>{row.price}</TableCell>
                <TableCell>{row.rating}
                
                { (row.status == 4) &&
                <Rating
                  name="simple-controlled"
                  value={rating}
                  onChange={(event, newValue) => {
                    setRating(newValue);
                  }}
                />
                }
                
                </TableCell>
                <TableCell align="right">{status[row.status]}</TableCell>
                <Button
                  variant="contained"
                  onClick={() => onPickup(row)}
                  disabled={row.status !== 3}
                >
                  Ready for Pickup
                </Button>
                
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Container>
  );
}
