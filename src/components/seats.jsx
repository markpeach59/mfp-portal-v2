import React from "react";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Divider from "@material-ui/core/Divider";

const Seats = props => {
  const { seats, onSeatSel, selectedSeat } = props;

  var aa = "";
  if (selectedSeat) {
    aa = selectedSeat.seattype;
  }

  return (
    <React.Fragment>
      <FormControl component="fieldset">
        <FormLabel component="legend">Seats</FormLabel>

        <RadioGroup aria-label="seats" name="seats" row={true}>
          {seats.map(seat => (
            <FormControlLabel
              key={seat._id}
              value={seat.seattype}
              control={<Radio color="primary" />}
              label={seat.seattype}
              onChange={() => onSeatSel(seat)}
              checked={aa === seat.seattype}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Divider />
      <br />
    </React.Fragment>
  );
};

export default Seats;
