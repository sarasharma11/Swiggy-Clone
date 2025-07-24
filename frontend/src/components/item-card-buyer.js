import * as React from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import ToggleButton from "@mui/material/ToggleButton";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import Typography from "@mui/material/Typography";
import Select from "react-select";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import moment from "moment";

export default function ItemCard({
  cardDeatils = {},
  email,
  wallet,
  setWallet,
  favFoods,
  setFavFoods,
  timeComparer,
  fav = false,
}) {
  const id = localStorage.getItem("userid");
  const [card, setCard] = React.useState(cardDeatils);
  const [selectedAddOns, setSelectedAddOns] = React.useState([]);
  const [price, setPrice] = React.useState(card?.price);
  const [addOns, setAddOns] = React.useState(
    card?.addOns?.map((addOn) => {
      return { value: addOn.price, label: addOn.name };
    })
  );
  const [quantity, setQuantity] = React.useState(0);
  const [error, setError] = React.useState({});

  const buyItem = () => {
    if (quantity > 0) {
      if (price * quantity > wallet) {
        setError({ wallet: "Insufficient balance" });
        return;
      }
      const newOrder = {
        quantity: quantity,
        foodId: card?._id,
        vendorID: card?.vendorID,
        addOns: selectedAddOns,
        status: 0,
        price: price * quantity,
        email: email,
        buyerID: id,
      };
      axios
        .post("/api/food/placeOrder", newOrder)
        .then((res) => {
          setWallet(res.data);
          setError({ success: "Order Placed Successfully" });
        })
        .catch((err) => {
          setError(err.response);
        });
    } else setError({ quantity: "Invalid Quantity" });
  };

  const onToggle = () => {
    axios
      .post("/api/users/toggleFav", { email: email, foodId: card?._id })
      .then((res) => {
        setFavFoods(res.data);
      })
      .catch((err) => {
        setError(err.response);
      });
  };

  React.useEffect(() => {
    if (fav) {
      axios
        .post("/api/food/getSingleFood", { foodId: cardDeatils?._id })
        .then((res) => {
          console.log(res.data);
          setCard(res.data);
        })
        .catch((err) => {
          setError(err.response);
        });
    }
  }, []);

  return (
    <>
      {error.quantity && <Alert color="error">{error.quantity}</Alert>}
      {error.wallet && <Alert color="error">{error.wallet}</Alert>}
      {error.success && <Alert color="success">{error.success}</Alert>}

      <Card>
        <CardContent>
          {timeComparer(card) == 1 && (
            <Typography variant="subtitle1" style={{ color: "grey" }}>
              Canteen Closed
            </Typography>
          )}

          <Typography gutterBottom variant="h5" component="h2">
            {card?.name}
          </Typography>
          <Typography>
            <b>Price:</b> Rs {price}
          </Typography>
          <Typography>
            <b>Vendor:</b> {card?.vendorName}
          </Typography>
          <Typography>
            <b>Shop Name:</b> {card?.vendorShopName}
          </Typography>
          <Typography>
            <b>Open Time:</b> {moment(card?.vendorOpenTime).format("LT")}
          </Typography>
          <Typography>
            <b>Close Time:</b> {moment(card?.vendorCloseTime).format("LT")}
          </Typography>
          <Typography style={{ color: card?.veg === "veg" ? "green" : "red" }}>
            {card?.veg === "veg" ? "Vegeterian" : "Non-Vegeterian"}
          </Typography>
          {card?.tags?.length > 0 && (
            <Typography>
              <br />
              <b>Tags:</b>
            </Typography>
          )}
          {card?.tags?.length > 0 &&
            card?.tags?.map((tag, index) => (
              <Typography key={index}>{tag}</Typography>
            ))}
        </CardContent>
        <CardActions>
          <Grid container>
            <Grid>
              <TextField
                required
                size="small"
                name="quantity"
                label="Quantity"
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) => {
                  setQuantity(e.target.value);
                }}
              />
            </Grid>
          </Grid>
        </CardActions>
        <ToggleButton
          value="fav"
          selected={favFoods.includes(card?._id)}
          onChange={onToggle}
        >
          {favFoods.includes(card?._id) ? (
            <StarIcon color="info" />
          ) : (
            <StarBorderIcon color="info" />
          )}
        </ToggleButton>
      </Card>
      <Grid sx={{ paddingTop: 2 }}>
        {card?.addOns?.length > 0 && (
          <>
            <Typography>Addons</Typography>
            <Select
              isMulti
              options={addOns}
              onChange={(e) => {
                setSelectedAddOns(e);
                setPrice(
                  card?.price +
                    e
                      .map((item) => item.value)
                      .reduce((acc, addOn) => {
                        return acc + parseInt(addOn);
                      }, 0)
                );
              }}
            />
          </>
        )}
        {timeComparer(card) == -1 ? (
          <Button variant="contained" onClick={() => buyItem()}>
            Buy
          </Button>
        ) : (
          <Button variant="contained" disabled onClick={() => buyItem()}>
            Buy
          </Button>
        )}
      </Grid>
    </>
  );
}
