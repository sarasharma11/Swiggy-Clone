import * as React from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

export default function Wallet({ email, wallet, setWallet }) {
  const [walletAdd, setWalletAdd] = React.useState(0);

  const addMoney = (event) => {
    axios
      .post("/api/users/addMoney", {
        email: email,
        amount: walletAdd,
      })
      .then((res) => {
        setWalletAdd(0);
        setWallet(res.data.wallet);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Card sx={{ paddingTop: 2 }}>
      <CardContent>
        <Typography variant="h4">Wallet</Typography>
        <Grid>
          <TextField disabled value={wallet} name="wallet" />
        </Grid>

        <Grid>
          <TextField
            name="wallet"
            type="number"
            id="wallet"
            label="Add Money"
            value={walletAdd}
            onChange={(e) => setWalletAdd(e.target.value)}
          />
        </Grid>
      </CardContent>
      <CardActions>
        <Button variant="contained" onClick={() => addMoney()}>
          Add
        </Button>
      </CardActions>
    </Card>
  );
}
