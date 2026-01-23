import _ from "lodash";
import React, { Component } from "react";

import { Link } from "react-router-dom";

import { getAllOrders } from "../services/ordersService";


import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

import Table from "@material-ui/core/Table";
//import TableHead from "@material-ui/core/TableHead";

import TableBody from "@material-ui/core/TableBody";

import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";

import TableHead from "@material-ui/core/TableHead";

import "typeface-roboto";

class Orders extends Component {
  state = {
    orders: [],
  };

  async componentDidMount() {
    const { data: orders } = await getAllOrders();
    //console.log("Orders Returned", orders);

    this.setState({
      orders,
    });
  }

  render() {
    const t = this.state.orders;
    //console.log("LL", t);

    const { length: count } = this.state.orders;

    if (count === 0) return <p>There are no Orders in the database</p>;

    return (
      <React.Fragment>
        <Grid container spacing={2}>
          <Grid item xs={10}>
            <h2>List of Orders</h2>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date & Time</TableCell>
                  <TableCell align="right">Model</TableCell>
                  <TableCell align="right">Cost</TableCell>
                  <TableCell align="right">Markup</TableCell>
                  <TableCell align="right">Offer</TableCell>
                  <TableCell align="right">Percentage</TableCell>
                  <TableCell align="right">Saving</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="right">Confirmed</TableCell>
                  <TableCell align="right">PO#</TableCell>
                  <TableCell align="right">Stock#</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {t.map((x) => (
                  <TableRow key={x._id}>
                    <TableCell>
                      <Link to={{ pathname: "/orders/" + x._id }}>
                        <Button>
                          {_.slice(x.updatedAt, 0, 10)}{" "}
                          {_.slice(x.updatedAt, 11, 19)}
                        </Button>
                      </Link>
                    </TableCell>
                    <TableCell align="right"> {x.model}</TableCell>
                    <TableCell align="right">
                      {" £"}
                      {x.price}
                    </TableCell>
                    <TableCell align="right">
                      {" £"}
                      {x.markup}
                    </TableCell>
                                      <TableCell align="right">
                     
                     {x.hasDiscount  ? ( "Yes") : null}
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
                     </TableCell>
 
 
                     <TableCell align="right">
                     {x.hasDiscount  ? (" £" + (x.discountedPrice + x.markup)): (" £" + (x.price + x.markup))}
                     </TableCell>
                     <TableCell align="right">
                     {!x.confirmedorder? "No": "Yes"}
                     </TableCell>
                     <TableCell align="right">
                     {!x.ponumber? "": x.ponumber}
                    </TableCell>
                    <TableCell align="right">
                    {!x.stocknumber? "": x.stocknumber}
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

export default Orders;
