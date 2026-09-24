import React from "react";
import { brandConfig } from "../config/brand";

const ForkliftImg = props => {
  const { imgName } = props;

  //console.log("IMG:", imgName);

  const imgNam = brandConfig.imageBaseUrl + imgName;

  //console.log("IMG:", imgNam);

  return (
    <React.Fragment>
      <img src={imgNam}  
      style={{ width: 300, paddingTop: 20, paddingBottom: 40 }}
      alt="" />
    </React.Fragment>
  );
};

export default ForkliftImg;
