import React from "react";

import { makeStyles } from "@material-ui/core/styles";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import "typeface-roboto";

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "left"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

const CapacityFilter = props => {
  const {
    capacityfilters,
    onCapacityFilterSel,
    selectedCapacityFilter
  } = props;

  var aa = "";
  if (selectedCapacityFilter) {
    aa = selectedCapacityFilter.capFilter;
  }

  const classes = useStyles();

  return (
    <React.Fragment>
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">Max Load Capacity</FormLabel>

        <RadioGroup
          aria-label="loadcapcity"
          name="loadcapacity"
          //value={value}
          //onChange={handleChange}
          row={true}
        >
          {capacityfilters.map((capacityfilter, index) => (
            <FormControlLabel
              key={capacityfilter._id}
              value={capacityfilter.capFilter}
              control={<Radio color="primary" />}
              label={capacityfilter.capFilter}
              onChange={() => onCapacityFilterSel(capacityfilter, index)}
              checked={aa === capacityfilter.capFilter}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </React.Fragment>
  );
};

export default CapacityFilter;
