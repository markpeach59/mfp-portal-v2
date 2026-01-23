import React from "react";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Divider from "@material-ui/core/Divider";

const ColdStoreProts = props => {
  const { coldstoreprots, onColdStoreProtSel, selectedColdStoreProt } = props;

  var aa = "X";
  if (selectedColdStoreProt) {
    aa = selectedColdStoreProt.coldstoreprottype;
  }

  return (
    <React.Fragment>
      <FormControl component="fieldset">
        <FormLabel component="legend">Cold Store Protection</FormLabel>

        <RadioGroup
          aria-label="coldstoreprots"
          name="coldstoreprots"
          row={true}
        >
          {coldstoreprots.map(coldstoreprot => (
            <FormControlLabel
              key={coldstoreprot._id}
              value={coldstoreprot.coldstoreprottype}
              control={<Radio color="primary" />}
              label={coldstoreprot.coldstoreprottype}
              onChange={() => onColdStoreProtSel(coldstoreprot)}
              checked={aa === coldstoreprot.coldstoreprottype}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Divider />
      <br />
    </React.Fragment>
  );
};

export default ColdStoreProts;
