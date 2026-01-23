import _ from "lodash";
import React, { Component } from "react";

import { Link } from "react-router-dom";

import { getAllQuotes } from "../services/allQuotesService";
import { getUsers } from "../services/userService";
import { getDealers } from "../services/dealerService";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

import Table from "@material-ui/core/Table";
//import TableHead from "@material-ui/core/TableHead";

import TableBody from "@material-ui/core/TableBody";

import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";

import TableHead from "@material-ui/core/TableHead";

import Reassignquote from "./reassignquote";
import "typeface-roboto";
import { reassignQuote } from "../services/quotesService";

class AllQuotes extends Component {
  state = {
    quotes: [],
    users: [],
    dealers: [],
  };

  async componentDidMount() {
    const { data: quotes } = await getAllQuotes();
    //console.log("Quotes Returned", quotes);

    const { data: users } = await getUsers();
    //console.log("Users Returned", users);

    const { data: dealers } = await getDealers();
    //console.log("Dealers Returned", dealers);

    this.setState({
      quotes,
      users,
      dealers,
    });
  }

  handleReassign = (quoteid, newowner) => {
    //console.log("Reassign - ", quoteid, " ", newowner);

    const thequote = _.find(this.state.quotes, ["_id", quoteid]);

    if (thequote === undefined) return;

    //console.log("the Quote", thequote);
    thequote.userid = newowner;
    this.setState({ thequote });
    //console.log("the Amended Quote", thequote);

    reassignQuote(quoteid, newowner);
  };

  render() {
    const t = this.state.quotes;
    const u = this.state.users;
    const d = this.state.dealers;
    //console.log("LL", t);

    const { length: count } = this.state.quotes;

    if (count === 0) return <p>There are no Quotes in the database</p>;

    const dealername = (id) => {
      //console.log(id);

      const ptr = _.find(u, ["_id", id]);

      if (ptr === undefined) return " - ";

      const m = ptr.dealerId;

      if (m === undefined) return " - ";

      const dn = _.find(d, ["_id", m]).dealername;
      return dn;
    };

    const username = (id) => {
      //console.log(id);

      const ptr = _.find(u, ["_id", id]);

      if (ptr === undefined) return " - ";

      return ptr.name;
    };

    const emailaddr = (id) => {
      //console.log(id);
      
      const ptr = _.find(u, ["_id", id]);

      if (ptr === undefined) return " - ";

      return ptr.email;
    };

    return (
      <React.Fragment>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <h2>List of Quotes</h2>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date & Time</TableCell>
                  <TableCell align="right">Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Dealer</TableCell>
                  <TableCell align="right">Model</TableCell>
                  <TableCell align="right">Offer</TableCell>
                  <TableCell align="right">Percentage</TableCell>
                  <TableCell align="right">Saving</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="right">Reassign</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {t.map((x) => (
                  <TableRow key={x._id}>
                    <TableCell>
                      <Link to={{ pathname: "/quotes/" + x._id }}>
                        <Button>
                          {_.slice(x.updatedAt, 0, 10)}{" "}
                          {_.slice(x.updatedAt, 11, 19)}
                        </Button>
                      </Link>
                    </TableCell>
                    <TableCell align="right">
                      {" "}
                      {username(x.userid)}
                
                    </TableCell>
                    <TableCell align="right">
                      {" "}
                      {emailaddr(x.userid)}
                    </TableCell>
                    <TableCell align="right"> {dealername(x.userid)}</TableCell>
                    <TableCell align="right"> {x.model}</TableCell>
                    <TableCell align="right">
                     
                     {x.hasDiscount  ? ( "Yes") : null}
                     {!x.hasDiscount && (x.saving > 0 )  ? ( "Yes") : null}
                     </TableCell>
 
                     <TableCell align="right">
                     {x.hasDiscount  ? (
                       (x.discountPercentage * 100) % 1 === 0 
                         ? (x.discountPercentage * 100).toFixed(0) + "%" 
                         : (x.discountPercentage * 100).toFixed(1) + "%"
                     ) : null}
                     </TableCell>
 
                     <TableCell align="right">
                     {x.hasDiscount  ? ( " £" + x.discountAmount) : null}
                     {!x.hasDiscount && x.saving  ? ( " £" + x.saving) : null}
                     </TableCell>
 
 
                     <TableCell align="right">
                     {x.hasDiscount  ? (" £" + (x.discountedPrice)): null}
                     {!x.hasDiscount && x.saving ? (" £" + (x.price - x.saving )): null}
                     {!x.hasDiscount && !x.offerprice ? (" £" + (x.price )): null}
                     </TableCell>
                    <TableCell align="right">
                      <Reassignquote
                        quoteid={x._id}
                        quoteowner={x.userid}
                        users={u}
                        onReassign={this.handleReassign}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default AllQuotes;
