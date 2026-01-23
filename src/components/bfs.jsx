import React from "react";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Divider from "@material-ui/core/Divider";

const Bfs = props => {
  const { bfss, onBfsSel, selectedBfs } = props;

  var aa = "X";
  if (selectedBfs) {
    aa = selectedBfs.bfstype;
  }

  return (
    <React.Fragment>
      <FormControl component="fieldset">
        <FormLabel component="legend">BFS</FormLabel>

        <RadioGroup aria-label="bfss" name="bfss" row={true}>
          {bfss.map(bfs => (
            <FormControlLabel
              key={bfs._id}
              value={bfs.bfstype}
              control={<Radio color="primary" />}
              label={bfs.bfstype}
              onChange={() => onBfsSel(bfs)}
              checked={aa === bfs.bfstype}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Divider />
      <br />
    </React.Fragment>
  );
};

export default Bfs;
