import React from 'react';
import Switch from "@material-ui/core/Switch";

const label = { inputProps: { "aria-label": "Switch to Restricted" } };


const ToggleSwitch = props => {
    const { onToggle } = props;

    const test = localStorage.getItem("restricted");
    let switchon =false;

    if (test){switchon=true;}

   
    //console.log('Test', switchon);

  return (
    <Switch {...label}  checked={switchon} onChange={onToggle} />
  )
}
export default ToggleSwitch