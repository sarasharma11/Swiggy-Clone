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
import moment from "moment";
import { useNavigate } from "react-router-dom";

const status = {
  0: "Placed",
  1: "Accepted",
  2: "Cooking",
  3: "Ready for Pickup",
  4: "Completed",
  5: "Rejected",
};

export default function OrderVendor() {
  const navigate = useNavigate();
  const [orders, setOrders] = React.useState([]);
  const [error, setErrors] = React.useState({});
  const id = localStorage.getItem("userid");
  React.useEffect(() => {
    axios
      .post("/api/food/getOrders", { id: id, role: "vendor" })
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => {
        setErrors(err.response);
      });
  }, [id]);

  const nextStage = (order, rejected) => {
    if (order.status < 4) {
      axios
        .post("/api/food/changeStatus", { id: order.id, rejected: rejected })
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
        <Typography component="h1" variant="h5">
          Orders
        </Typography>
        {error.display && <Alert color="error">{error.display}</Alert>}

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Placed Time</TableCell>
              <TableCell>Food Item</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Add Ons</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{moment(row.placedTime).format("LT")}</TableCell>
                <TableCell>{row.foodItem}</TableCell>
                <TableCell>{row.quantity}</TableCell>
                <TableCell>
                  {row.addOns.map((addOn, i) => (
                    <li key={i}>{addOn.label}</li>
                  ))}
                </TableCell>
                <TableCell>{status[row.status]}</TableCell>
                {row.status !== 5 ? (
                  <>
                    <Button
                      variant="contained"
                      disabled={row.status > 2}
                      onClick={() => {
                        nextStage(row, false);
                      }}
                    >
                      Move To Next Stage
                    </Button>
                    {row.status == 0 && (
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                          nextStage(row, true);
                        }}
                      >
                        Reject
                      </Button>
                    )}
                  </>
                ) : (
                  "Rejected"
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Container>
  );
}
