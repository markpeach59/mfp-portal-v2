import React, { Component } from "react";

import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

import Masts from "./masts";
import Forks from "./forks";
import SideShifts from "./sideshifts";

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

class Kbd extends Component {
  state = {
    modelname: "KBD15",
    imgName: require("../photos/KB20.jpg"),
    engType: "Diesel",
    engine: "ISUZU Diesel Engine C240-30 Euro 5",
    rangeName: "D Series",
    rangeCat: "1-1.5T",
    liftcapacity: 1500,

    selection: {},
    totalprice: 11303,

    masts: [
      {
        _id: 1,
        masttype: "2 Stage Mast",
        sizes: [
          { _id: 1, length: 3000, price: 0 },
          { _id: 2, length: 3300, price: 225 },
          { _id: 3, length: 4000, price: 395 },
          { _id: 4, length: 4500, price: 640 },
          { _id: 5, length: 5000, price: 760 }
        ]
      },
      {
        _id: 2,
        masttype: "2 Stage Full Free Mast",
        sizes: [
          { _id: 1, length: 3000, price: 501 },

          { _id: 3, length: 4000, price: 896 }
        ]
      },
      {
        _id: 3,
        masttype: "3 Stage Full Free Mast",
        sizes: [
          { _id: 1, length: 4350, price: 1200 },
          { _id: 2, length: 4500, price: 1350 },
          { _id: 3, length: 4700, price: 1490 },
          { _id: 4, length: 5000, price: 1620 },
          { _id: 5, length: 5500, price: 1710 },
          { _id: 6, length: 6000, price: 1988 }
        ]
      }
    ],

    forks: [
      { _id: 1, length: 1070, price: 0 },
      { _id: 2, length: 1200, price: 95 },
      { _id: 3, length: 1370, price: 169 },
      { _id: 4, length: 1500, price: 265 },
      { _id: 5, length: 1670, price: 311 }
    ],

    sideshifts: [
      { _id: 1, type: "None", price: 0 },
      { _id: 2, type: " Hook On", price: 350 },
      { _id: 3, type: "Integral", price: 800 }
    ]
  };

  handleMastSel = mast => {
    console.log("Current Mast Selected", this.state.selectedMast);

    console.log("Passedmask", mast);

    console.log("Mast Selected ", mast);

    this.setState({ selectedMast: mast });
  };

  handleMastSizeSel = mastsize => {
    console.log("Current Mast Size Selected", this.state.selectedMastSize);

    console.log("Passedmask", mastsize);

    console.log("Mast Selected ", mastsize);

    const oldprice = this.state.selectedMastSize
      ? this.state.selectedMastSize.price
      : 0;
    const newprice = this.state.totalprice + mastsize.price - oldprice;

    this.setState({ selectedMastSize: mastsize, totalprice: newprice });
  };

  handleForkSel = fork => {
    console.log("Current Fork Selected", this.state.selectedFork);

    console.log("PassedmFork", fork);

    const oldprice = this.state.selectedFork
      ? this.state.selectedFork.price
      : 0;
    const newprice = this.state.totalprice + fork.price - oldprice;

    this.setState({ selectedFork: fork, totalprice: newprice });
  };

  handleSideShiftSel = sideshift => {
    console.log("Current Side Shift Selected", this.state.selectedSideShift);

    console.log("Side Shift Selected ", sideshift);

    const oldprice = this.state.selectedSideShift
      ? this.state.selectedSideShift.price
      : 0;
    const newprice = this.state.totalprice + sideshift.price - oldprice;

    this.setState({ selectedSideShift: sideshift, totalprice: newprice });
  };

  render() {
    return (
      <React.Fragment>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <h1>KBD 15</h1>

            <ul id="forkliftranges">
              <h2>
                {this.state.engType} {this.state.rangeCat} INTERNAL COMBUSTION
              </h2>
              <img src={this.state.imgName} alt="" />
              <div></div>
              <li>
                {this.state.modelName} 1.5T {this.state.rangeCat}{" "}
                {this.state.engType} forklift
                <br />
                {this.state.liftcapacity}Kg
                <br /> {this.state.engType}
                <br />
                {this.state.engine} <br />
                {this.state.selectedMast ? (
                  this.state.selectedMast.masttype
                ) : (
                  <span>Please Select a Mast Type</span>
                )}
                <br />
                {this.state.selectedMastSize
                  ? "Mast Size - " + this.state.selectedMastSize.length
                  : null}
                <br />
                {this.state.selectedFork
                  ? "Fork Length - " + this.state.selectedFork.length
                  : null}
                <br />
                {this.state.selectedSideShift
                  ? "Side Shift - " + this.state.selectedSideShift.type
                  : null}
                <br />
                Side Lever
                <br />
                ISO Safety System
                <br />
                Full LED Road Lighting
                <br />
                Amber Beacon, Safety Blue Spot
                <br />
                Reverse Alarm
                <br />
                <br />
                <strong>Quote Price : £{this.state.totalprice}</strong>
              </li>
            </ul>
          </Grid>
          <Grid item xs={6}>
            <Masts
              masts={this.state.masts}
              selectedMast={this.state.selectedMast}
              onMastSel={this.handleMastSel}
              onMastSizeSel={this.handleMastSizeSel}
              selectedMastSize={this.state.selectedMastSize}
            />

            <Forks
              forks={this.state.forks}
              selectedFork={this.state.selectedFork}
              onForkSel={this.handleForkSel}
            />

            <SideShifts
              sideshifts={this.state.sideshifts}
              selectedSideShift={this.state.selectedSideShift}
              onSideShiftSel={this.handleSideShiftSel}
            />
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default Kbd;
