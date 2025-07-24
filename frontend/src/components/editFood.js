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

export default function EditFood(prop) {
  let id = localStorage.getItem("userid");
  const [name, setName] = React.useState(prop.card.name);
  const [price, setPrice] = React.useState(prop.card.price);
  const [veg, setVeg] = React.useState(prop.card.veg);
  const [tags, setTags] = React.useState(prop.card.tags);
  const [addOns, setAddOns] = React.useState(prop.card.addOns);

  const [addOnPrice, setAddOnPrice] = React.useState("");
  const [addOnName, setAddOnName] = React.useState("");
  const [tag, setTag] = React.useState([]);
  const [error, setError] = React.useState({});
  const [errorTag, setErrorTag] = React.useState("");
  const [errorName, setErrorName] = React.useState("");
  const [errorPrice, setErrorPrice] = React.useState("");
  const [errorAddOn, setErrorAddOn] = React.useState("");

  const handleEdit = (event) => {
    event.preventDefault();
    const newFoodItem = {
      name: name,
      price: price,
      rating: prop.card.rating,
      veg: veg,
      addOns: addOns,
      tags: tags,
      vendorID: id,
    };
    axios
      .post("/api/food/editFood", newFoodItem)
      .then((res) => {
        prop.setShowEdit(false);
      })
      .catch((err) => {
        setError(err.request);
      });
  };
  return (
    <>
      <Grid>
        <Box component="form" noValidate onSubmit={handleEdit}>
          <Grid container spacing={2} sx={{ margin: 1 }}>
            <Grid item xs={12}>
              <TextField
                required
                id="name"
                label="Name"
                name="name"
                value={name}
                onChange={(e) => {
                  if (!e.target.value) return setErrorName("Name is required");
                  setName(e.target.value);
                }}
              />
            </Grid>
            {errorName && <Alert color="error">{error.name}</Alert>}

            <Grid item xs={12}>
              <TextField
                required
                type="number"
                id="price"
                label="Price"
                name="price"
                value={price}
                onChange={(e) => {
                  if (!e.target.value)
                    return setErrorPrice("Price is required");
                  else if (e.target.value < 0)
                    return setErrorPrice("Price cannot be negative");
                  setPrice(e.target.value);
                }}
              />
            </Grid>
            {errorPrice && <Alert color="error">{error.price}</Alert>}

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
                    <li key={index}>
                      {tag}
                      <Button
                        color="error"
                        onClick={() => setTags(tags.filter((e) => e !== tag))}
                      >
                        X
                      </Button>
                    </li>
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
                defaultValue={veg}
                name="radio-buttons-group"
                onChange={(e) => setVeg(e.target.value)}
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
                      {addOn.name} - Rs. {addOn.price}
                      <Button
                        color="error"
                        onClick={() =>
                          setAddOns(addOns.filter((e) => e.name !== addOn.name))
                        }
                      >
                        X
                      </Button>
                    </li>
                  ))}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
            Edit Item
          </Button>
        </Box>
      </Grid>
    </>
  );
}
