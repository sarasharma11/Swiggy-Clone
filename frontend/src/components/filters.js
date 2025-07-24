import * as React from "react";
import Grid from "@mui/material/Grid";
import Select from "react-select";
import { Select as MSelect } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import { FormLabel } from "@mui/material";

export default function Filters({ filter, setFilter, options }) {
  let tags = options.tags.map((tag) => {
    return { value: tag, label: tag };
  });

  let shopNames = options.shopNames.map((shopName) => {
    return { value: shopName, label: shopName };
  });

  return (
    <>
      <TextField
        sx={{
          marginBottom: 3,
        }}
        fullWidth
        id="searchItem"
        value={filter.search}
        label="Search Bar"
        onChange={(e) => setFilter({ ...filter, search: e.target.value })}
      />

      <Grid container>
        <Grid item xs={12} sm={8} md={10}>
          <Grid container sx={{ paddingBottom: 5 }}>
            <Grid>
              <FormLabel>Tags</FormLabel>
              <Select
                isMulti
                options={tags}
                onChange={(e) => {
                  setFilter({ ...filter, tags: e.map((item) => item.value) });
                }}
              />
            </Grid>
            <Grid sx={{ paddingLeft: 2 }}>
              <FormLabel>Shop Names</FormLabel>
              <Select
                isMulti
                options={shopNames}
                onChange={(e) => {
                  setFilter({
                    ...filter,
                    shopNames: e.map((item) => item.value),
                  });
                }}
              />
            </Grid>
            <Grid sx={{ paddingLeft: 2 }}>
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label="Veg"
                onChange={(e) => {
                  if (e.target.checked) {
                    if (!filter.veg.find((item) => item == "veg"))
                      setFilter({ ...filter, veg: [...filter.veg, "veg"] });
                  } else {
                    if (filter.veg.find((item) => item == "veg")) {
                      let temp = filter.veg;
                      const index = filter.veg.indexOf("veg");
                      if (index > -1) {
                        temp.splice(index, 1);
                      }
                      setFilter({ ...filter, veg: temp });
                    }
                  }
                }}
              />
            </Grid>
            <Grid>
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label="Non Veg"
                onChange={(e) => {
                  if (e.target.checked) {
                    if (!filter.veg.find((item) => item == "nonveg"))
                      setFilter({ ...filter, veg: [...filter.veg, "nonveg"] });
                  } else {
                    if (filter.veg.find((item) => item == "nonveg")) {
                      let temp = filter.veg;
                      const index = filter.veg.indexOf("nonveg");
                      if (index > -1) {
                        temp.splice(index, 1);
                      }
                      setFilter({ ...filter, veg: temp });
                    }
                  }
                }}
              />
            </Grid>
            <Grid sx={{ paddingLeft: 2 }}>
              <TextField
                required
                name="maxPrice"
                label="Max Price"
                type="number"
                id="maxPrice"
                value={filter.max}
                onChange={(e) => setFilter({ ...filter, max: e.target.value })}
              />
            </Grid>
            <Grid sx={{ paddingLeft: 2 }}>
              <TextField
                required
                name="minPrice"
                label="Min Price"
                type="number"
                id="minPrice"
                value={filter.min}
                onChange={(e) => setFilter({ ...filter, min: e.target.value })}
              />
            </Grid>
            <Grid sx={{ paddingLeft: 2 }}>
              <MSelect
                value={filter.choice}
                onChange={(event) => {
                  setFilter({ ...filter, choice: event.target.value });
                }}
              >
                <MenuItem value="price">Price</MenuItem>
                <MenuItem value="rating">Rating</MenuItem>
              </MSelect>
            </Grid>
            <Grid sx={{ paddingLeft: 2 }}>
              <MSelect
                value={filter.asc}
                onChange={(event) => {
                  setFilter({ ...filter, asc: event.target.value });
                }}
              >
                <MenuItem value="-1">Ascending</MenuItem>
                <MenuItem value="1">Descending</MenuItem>
              </MSelect>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
