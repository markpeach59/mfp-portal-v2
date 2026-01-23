import React from "react";

import Grid from "@material-ui/core/Grid";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Divider from "@material-ui/core/Divider";

const Masts = props => {
  const {
    masts,

    selectedMast,
    onMastSizeSel,
    selectedMastSize,
    selectedSideShift,
    selectedForkpositioner
  } = props;

  var aa = "";
  if (selectedMastSize) {
    aa = selectedMast + " " + selectedMastSize.mastlength;
    //console.log("AYA", aa);
  }

  function displayMastDetails (mastsize) {return mastsize.freeliftheight ? (
                          
                              mastsize.mastlength +
                              "mm,  " +
                              mastsize.closedheight +
                              "mm," +
                              mastsize.freeliftheight +
                              "mm"
                            
                        ): (
                          
                              mastsize.mastlength +
                              "mm,  " +
                              mastsize.closedheight +
                              "mm"
                            
                        )
  }

  function displayCapacityMFH (mastsize, selectedSideShift, selectedForkpositioner ) {

    //console.log ('SideShift -', selectedSideShift);
    //console.log ('Fork Positioner -', selectedForkpositioner);

    if (selectedForkpositioner){

      return ""
    }

    if (selectedSideShift && selectedSideShift.sideshifttype === 'Hook On' ){
      if  (mastsize.mastrange && mastsize.stdcapacity){
          const reduc = Math.round(mastsize.stdcapacity * .08);
          const hookoncapacity = mastsize.stdcapacity -reduc;
          return ("," + hookoncapacity + "Kg")
      }
      return "";
    }

    if (selectedSideShift && selectedSideShift.sideshifttype === 'Integral' ){
      if  (mastsize.mastrange && mastsize.isscapacity){
        return ("," + mastsize.isscapacity+ "Kg")
    }
    return "";
    }

  
    
    return mastsize.mastrange ? (
                          
    "," + mastsize.stdcapacity +
    "Kg " 
  
): (
""
  
)
}

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        {masts.map(mast => (
          <Grid item xs={4} key={mast._id}>
            <div>
              <FormControl component="fieldset">
                <FormLabel component="legend">{mast.masttype}</FormLabel>

                <RadioGroup aria-label="mastsize" name="mastsize" row={false}>
                  {mast.mastsizes.map(mastsize => {
                    return mastsize.closedheight ? (
                      <FormControlLabel
                        key={mastsize._id}
                        value={mastsize.mastlength}
                        control={<Radio color="primary" />}
                        label={
                          displayMastDetails(mastsize) + displayCapacityMFH(mastsize, selectedSideShift, selectedForkpositioner)
                        }
                        onChange={() => onMastSizeSel(mastsize, mast.masttype)}
                        checked={
                          aa === mast.masttype + " " + mastsize.mastlength
                        }
                      />
                    ) : (
                      <FormControlLabel
                        key={mastsize._id}
                        value={mastsize.mastlength}
                        control={<Radio color="primary" />}
                        label={mastsize.mastlength + "mm"}
                        onChange={() => onMastSizeSel(mastsize, mast.masttype)}
                        checked={
                          aa === mast.masttype + " " + mastsize.mastlength
                        }
                      />
                    );
                  })}
                </RadioGroup>
              </FormControl>
            </div>
          </Grid>
        ))}
      </Grid>
      <Divider />
      <br />
    </React.Fragment>
  );
};

export default Masts;
