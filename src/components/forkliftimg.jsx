import React from "react";

const ForkliftImg = props => {
  const { imgName } = props;

  //console.log("IMG:", imgName);

  const imgNam = "https://maximalforklifts.s3.eu-west-2.amazonaws.com/" + imgName;

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
