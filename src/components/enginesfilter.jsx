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

const EnginesFilter = props => {
  const { engines, onEngineSel, selectedEngine } = props;

  //console.log("AA", selectedEngine.name);

  var aa = "";
  if (selectedEngine) {
    aa = selectedEngine.name;
    //console.log("AA", selectedEngine.name);
  }

  const classes = useStyles();
 
  return (
    <React.Fragment>
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">Engine Type</FormLabel>
        <RadioGroup aria-label="enginetype" name="enginetype" row={true}>
          {engines.map((engine, index) => (
            <FormControlLabel
              key={engine._id}
              value={engine.name}
              control={<Radio color="primary" />}
              label={engine.name}
              onChange={() => onEngineSel(engine, index)}
              checked={aa === engine.name}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </React.Fragment>
  );
};

export default EnginesFilter;
