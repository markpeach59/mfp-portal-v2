import React from "react";

const OptionImg = props => {
  const { imgName } = props;

  //console.log("IMG:", imgName);

  const imgNam = "https://forklift-options.s3.eu-west-2.amazonaws.com/" + imgName;

  //console.log("IMG:", imgNam);

  return (
    <React.Fragment>
      <img src={imgNam}  
      style={{ width: 200, paddingTop: 10, paddingBottom: 20 }}
      alt="" />
    </React.Fragment>
  );
};

export default OptionImg;