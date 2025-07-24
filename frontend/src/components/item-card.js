import * as React from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import EditItem from "./editFood";

export default function FoodItem(prop) {
  let id = localStorage.getItem("userid");
  const [showEdit, setShowEdit] = React.useState(false);
  const [cardDetails, setCardDetails] = React.useState(prop.card);

  React.useEffect(() => {
    axios
      .post("/api/food/getSingleFood", { id: id, foodId: cardDetails._id })
      .then((res) => {
        setCardDetails(res.data);
      })
      .catch((err) => {
        console.log(JSON.parse(err.request.response));
      });
  }, [id, showEdit]);

  return (
    <Card>
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {cardDetails.name}
        </Typography>
        <Typography>Name : {cardDetails.name}</Typography>
        <Typography>Price : {cardDetails.price}</Typography>
        <Typography>Rating : {cardDetails.rating}</Typography>
        <Typography>{cardDetails.veg}</Typography>
        <Typography>
          Add Ons:
          {cardDetails.addOns.map((addOn, index) => (
            <li key={index}>
              {addOn.name} {addOn.price}
            </li>
          ))}
        </Typography>
        <Typography>
          Tags:
          {cardDetails.tags.map((tag, index) => (
            <li key={index}>{tag}</li>
          ))}
        </Typography>
      </CardContent>
      <CardActions>
        <Grid container>
          <Button variant="contained" onClick={(e) => setShowEdit(!showEdit)}>
            Edit
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              axios
                .post("/api/food/deleteFood", cardDetails)
                .then((response) => {
                  prop.onDelete(cardDetails._id);
                })
                .catch((err) => {
                  console.log(err.request.response);
                });
            }}
          >
            Delete
          </Button>
        </Grid>
      </CardActions>
      {showEdit && (
        <EditItem
          showEdit={showEdit}
          setShowEdit={setShowEdit}
          card={cardDetails}
        />
      )}
    </Card>
  );
}
