import * as React from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { FormHelperText, FormLabel } from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Alert from "@mui/material/Alert";

let tags = [];
let addOns = [];

export default function AddFood(prop) {
  let id = localStorage.getItem("userid");
  const [addOnPrice, setAddOnPrice] = React.useState();
  const [addOnName, setAddOnName] = React.useState("");
  const [tag, setTag] = React.useState("");
  const [error, setError] = React.useState({});
  const [errorTag, setErrorTag] = React.useState("");
  const [errorAddOn, setErrorAddOn] = React.useState("");

  const handleNewItem = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const newFoodItem = {
      name: data.get("name"),
      price: data.get("price"),
      rating: 0,
      veg: data.get("radio-buttons-group"),
      addOns: addOns,
      tags: tags,
      vendorID: id,
    };
    axios
      .post("http://localhost:5000/api/food/addFood", newFoodItem)
      .then((res) => {
        tags = [];
        addOns = [];
        prop.setShowAdd(false);
      })
      .catch((err) => {
        setError(JSON.parse(err.request.response));
      });
  };
  return (
    <>
      <Grid container>
        <Box
          component="form"
          noValidate
          onSubmit={handleNewItem}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
              />
            </Grid>
            {error.name && <Alert color="error">{error.name}</Alert>}

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                type="number"
                id="price"
                label="Price"
                name="price"
              />
            </Grid>
            {error.price && <Alert color="error">{error.price}</Alert>}

            <Grid item xs={12}>
              <TextField
                id="tag"
                label="Tag"
                name="tag"
                value={tag}
                onChange={(e) => {
                  setTag(e.target.value);
                }}
              />
              <Button
                onClick={() => {
                  if (tag == null || tag == "") {
                    return setErrorTag("Tag field is empty");
                  } else {
                    tags.push(tag);
                    setTag("");
                  }
                }}
                variant="outlined"
                sx={{ mt: 3, mb: 2 }}
              >
                Add Tag
              </Button>
              {errorTag && <Alert color="error">{errorTag}</Alert>}

              <Grid>
                <Typography>
                  {tags.map((tag, index) => (
                    <li key={index}>{tag} </li>
                  ))}
                </Typography>
              </Grid>
            </Grid>
            <FormControl>
              <FormLabel id="demo-radio-buttons-group-label">
                Veg/Non-Veg
              </FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="veg"
                name="radio-buttons-group"
              >
                <FormControlLabel value="veg" control={<Radio />} label="Veg" />
                <FormControlLabel
                  value="nonveg"
                  control={<Radio />}
                  label="Non-Veg"
                />
              </RadioGroup>
            </FormControl>
            <Grid item xs={12}>
              <FormHelperText>Add Ons</FormHelperText>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="addonName"
                  id="addonName"
                  label="Name"
                  value={addOnName}
                  onChange={(e) => {
                    setAddOnName(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="addonPrice"
                  id="addonPrice"
                  label="Price"
                  type="Number"
                  value={addOnPrice}
                  onChange={(e) => {
                    setAddOnPrice(e.target.value);
                  }}
                />
              </Grid>
              <Button
                onClick={() => {
                  if (addOnName == null || addOnName == "") {
                    return setErrorAddOn("Name field is required");
                  } else if (addOnPrice == null || addOnPrice == "") {
                    return setErrorAddOn("Price field is required");
                  } else if (addOnPrice <= 0)
                    return setErrorAddOn("Price must be greater than 0");
                  else if (!addOnPrice.match(["[0-9]+"]))
                    return setErrorAddOn("Invalid Price");
                  else {
                    addOns.push({ name: addOnName, price: addOnPrice });
                    setAddOnPrice(0);
                    setAddOnName("");
                  }
                }}
                variant="outlined"
                sx={{ mt: 3, mb: 2 }}
              >
                Add Add On
              </Button>
              {errorAddOn && <Alert color="error">{errorAddOn}</Alert>}

              <Grid>
                <Typography>
                  {addOns.map((addOn, index) => (
                    <li key={index}>
                      {addOn.name} {addOn.price}
                    </li>
                  ))}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Add Item
          </Button>
        </Box>
      </Grid>
    </>
  );
}
